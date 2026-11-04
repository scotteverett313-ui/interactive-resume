import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ROOT, CURIO_ROOT } from './content';
import { blobPath, rng, clamp, wrapLabel, curvePath } from './blob';

const INK = '#1a1a1a', PAPER = '#ffffff', NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs){ var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

/* ------------------------------------------------------------------
   The map engine. Plain imperative code, ported from the prototype.

   React renders the SVG shell once; everything inside it (blobs, links,
   the outer orbit, the background net) is built here and redrawn every
   frame by writing SVG attributes directly. Nodes are tweened with GSAP
   on plain objects, and old levels keep animating out while the new
   level animates in, which is why none of this lives in React state.
   ------------------------------------------------------------------ */
export function createScene(o){
  var svg = o.svg, nodesG = o.nodesG, linksG = o.linksG, bgNet = o.bgNet, wm = o.wm;
  var curioG = o.curioG, curioLinksG = o.curioLinksG, legend = o.legend, pickHint = o.pickHint, mapLayer = o.mapLayer;
  var reduce = o.reduce, busyRef = o.busyRef;
  function D(x){ return reduce ? 0 : x; }
  function busy(){ return busyRef.current; }
  function setBusy(b){ busyRef.current = b; }

  var W = 1000, H = 700, M = 700;
  var mouse = null, drag = null, done = false, raf = 0;
  var view = { node:null, items:[], links:[] }, dying = [];
  var curioLinks = [], curioPos = {}, hot = {};

  function measure(){
    var r = svg.getBoundingClientRect();
    W = Math.max(320, r.width); H = Math.max(320, r.height); M = Math.min(W, H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  }

  /* background net plus the outer orbit of curiosities */
  function drawBg(){
    bgNet.innerHTML = '';
    var R = rng(11), pts = [];
    for (var i = 0; i < 42; i++) pts.push([R() * W, R() * H]);
    pts.forEach(function(p){
      var near = pts.map(function(q, j){ return [j, (q[0]-p[0])*(q[0]-p[0]) + (q[1]-p[1])*(q[1]-p[1])]; })
        .sort(function(a, b){ return a[1] - b[1]; }).slice(1, 3);
      near.forEach(function(n){ var q = pts[n[0]];
        bgNet.appendChild(el('path', { d:'M'+p[0].toFixed(0)+' '+p[1].toFixed(0)+' L'+q[0].toFixed(0)+' '+q[1].toFixed(0), stroke:INK, 'stroke-width':1, opacity:.12, fill:'none' })); });
      bgNet.appendChild(el('circle', { cx:p[0].toFixed(0), cy:p[1].toFixed(0), r:(2 + R() * 3).toFixed(1), fill:PAPER, stroke:INK, 'stroke-width':1.2, opacity:.3 }));
    });
    curioG.innerHTML = ''; curioLinksG.innerHTML = ''; curioLinks = []; curioPos = {};
    var kids = CURIO_ROOT.kids;
    kids.forEach(function(c){ curioPos[c.id] = { x:c.fx * W, y:c.fy * H }; });
    function curioBtn(g, label, fn){
      g.setAttribute('class', 'cnode'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', label);
      g.addEventListener('click', function(){ if (done && !busy() && view.node === ROOT) fn(); });
      g.addEventListener('keydown', function(e){ if ((e.key === 'Enter' || e.key === ' ') && done && !busy() && view.node === ROOT){ e.preventDefault(); fn(); } });
    }
    var first = curioPos[kids[0].id];
    var tg = el('g', {});
    tg.appendChild(el('rect', { x:first.x - 10, y:first.y - 46, width:260, height:30, fill:'#ffffff', 'fill-opacity':.001 }));
    var tt = el('text', { x:first.x - 4, y:first.y - 26, 'class':'ctitle' });
    tt.textContent = "CAN'T STOP THINKING ABOUT →";
    tg.appendChild(tt);
    curioBtn(tg, "Open page: Can't stop thinking about", function(){ o.onOpenPage(CURIO_ROOT); });
    curioG.appendChild(tg);
    kids.forEach(function(c){
      var pt = curioPos[c.id], right = c.fx > .5;
      var g = el('g', {});
      g.appendChild(el('circle', { cx:pt.x, cy:pt.y, r:24, fill:'#ffffff', 'fill-opacity':.001 }));
      g.appendChild(el('circle', { 'class':'vis', cx:pt.x, cy:pt.y, r:7, fill:PAPER, stroke:INK, 'stroke-width':1.8, 'stroke-dasharray':'3 3' }));
      var t = el('text', { x: right ? pt.x - 14 : pt.x + 14, y:pt.y + 4, 'text-anchor': right ? 'end' : 'start' });
      t.textContent = c.label + (c.sub ? ' ' + c.sub : '');
      g.appendChild(t);
      curioBtn(g, c.label + ', open page', function(){ o.onOpenPage(c); });
      g.addEventListener('pointerenter', function(){ hot[c.id] = true; });
      g.addEventListener('pointerleave', function(){ hot[c.id] = false; });
      g.addEventListener('focus', function(){ hot[c.id] = true; });
      g.addEventListener('blur', function(){ hot[c.id] = false; });
      curioG.appendChild(g);
      (c.hubs || []).forEach(function(h){ addCurioLink(c, h, null); });
      (c.also || []).forEach(function(x){ if (x > c.id) addCurioLink(c, null, x); });
    });
  }
  function addCurioLink(c, hubId, otherId){
    var p = el('path', { fill:'none', stroke:INK, 'stroke-width':1.4, 'stroke-dasharray':'5 6', 'stroke-linecap':'round' });
    curioLinksG.appendChild(p);
    curioLinks.push({ c:c, hub:hubId, other:otherId, p:p, k:curioLinks.length });
  }
  function drawCurio(t){
    if (view.node !== ROOT) return;
    var byId = {};
    view.items.forEach(function(it){ byId[it.node.id] = it; });
    curioLinks.forEach(function(l){
      var a = curioPos[l.c.id], bx, by, isHot = hot[l.c.id];
      if (l.hub){
        var it = byId[l.hub];
        if (!it || it.cx === undefined){ l.p.setAttribute('d', ''); return; }
        bx = it.cx; by = it.cy; isHot = isHot || it.hover;
      } else {
        var x = curioPos[l.other]; bx = x.x; by = x.y; isHot = isHot || hot[l.other];
      }
      l.p.setAttribute('d', curvePath(a.x, a.y, bx, by, 16 * Math.sin(t * .6 + l.k * 1.3)));
      l.p.style.opacity = isHot ? .9 : .28;
      l.p.setAttribute('stroke-width', isHot ? 2.2 : 1.4);
    });
  }

  function layout(node){
    var kids = node.kids || [];
    if (node === ROOT){
      var spots = { learn:[.27,.37,.17], teach:[.5,.69,.18], improve:[.73,.35,.13] };
      if (W < H * .8) spots = { learn:[.32,.3,.2], teach:[.5,.66,.21], improve:[.72,.42,.15] };
      return kids.map(function(k){ var s = spots[k.id]; return { x:s[0]*W, y:s[1]*H, r:s[2]*M }; });
    }
    var n = kids.length, cx = W / 2, cy = H * .54;
    var rx = Math.min(W * .32, 430), ry = Math.min(H * .26, 250);
    var R = rng(n * 7 + node.label.length);
    return kids.map(function(k, i){
      var deeper = !!(k.kids && k.kids.length);
      var r = M * (deeper ? .062 : .045);
      if (n === 1) return { x:cx, y:cy, r:r };
      var a = -Math.PI / 2 - .35 + i / n * Math.PI * 2 + (R() - .5) * .25;
      return { x:cx + Math.cos(a) * rx, y:cy + Math.sin(a) * ry, r:r };
    });
  }

  function makeItem(node, pos, i){
    var isHub = !!node.fill, deeper = !!(node.kids && node.kids.length);
    var g = el('g', { 'class':'node', tabindex:0, role:'button',
      'aria-label': node.label + (deeper ? ', go deeper' : ', open page') });
    var fill = isHub ? node.fill : (deeper ? INK : PAPER);
    var path = el('path', { fill:fill, stroke:INK, 'stroke-width': isHub ? 3.5 : 3 });
    var lines = wrapLabel(node.label);
    var lbl = el('text', { 'class': node.halo ? 'lbl halo' : 'lbl', 'text-anchor':'middle', fill: isHub ? node.text : INK });
    var spans = lines.map(function(s, j){ var ts = el('tspan', { dy: j ? '1.1em' : '0' }); ts.textContent = s; lbl.appendChild(ts); return ts; });
    var sub = el('text', { 'class':'sub', 'text-anchor':'middle', fill: isHub ? node.text : INK });
    sub.textContent = deeper ? (node.kids.length + ' inside') : 'page';
    g.appendChild(path); g.appendChild(lbl); g.appendChild(sub);
    nodesG.appendChild(g);
    var it = { node:node, g:g, path:path, lbl:lbl, spans:spans, sub:sub, isHub:isHub, deeper:deeper, lines:lines.length,
      x:pos.x, y:pos.y, r:pos.r, s:1, o:1, hs:1, lx:0, ly:0, px:0, py:0, dragX:0, dragY:0, hover:false,
      seed:i * 1.7 + node.label.length * .37, amp: isHub ? .09 : .07 };
    g.addEventListener('pointerenter', function(){ it.hover = true; });
    g.addEventListener('pointerleave', function(){ if (!drag || drag.it !== it) it.hover = false; });
    g.addEventListener('pointerdown', function(e){
      if (!done || busy() || it.o < .5 || e.button > 0) return;
      e.preventDefault();
      gsap.killTweensOf(it, 'dragX,dragY');
      drag = { it:it, id:e.pointerId, sx:e.clientX - it.dragX, sy:e.clientY - it.dragY, moved:false, type:e.pointerType };
      it.hover = true;
      mapLayer.classList.add('dragging');
    });
    g.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(it); } });
    return it;
  }

  function buildView(node){
    var pos = layout(node);
    var items = (node.kids || []).map(function(k, i){ return makeItem(k, pos[i], i); });
    var links = [], n = items.length;
    function addLink(a, b){ var p = el('path', { fill:'none', stroke:INK, 'stroke-width':2.5, 'stroke-linecap':'round' }); linksG.appendChild(p); links.push({ a:a, b:b, p:p, k:links.length }); }
    if (node === ROOT){ addLink(items[0], items[1]); addLink(items[0], items[2]); addLink(items[1], items[2]); }
    else if (n > 1){ for (var i = 0; i < n - 1; i++) addLink(items[i], items[i + 1]); if (n > 2) addLink(items[n - 1], items[0]); }
    return { node:node, items:items, links:links };
  }

  function hubOf(node){ return node === ROOT ? null : (node.hub || node); }
  function groundFor(node){ var h = hubOf(node); return h ? h.tint : '#ffffff'; }
  function setChrome(node){
    var wmText = node === ROOT ? '' : node.label.toUpperCase();
    wm.textContent = wmText;
    wm.setAttribute('x', W / 2); wm.setAttribute('y', H / 2);
    wm.setAttribute('font-size', Math.min(M * .32, W * 1.5 / Math.max(4, wmText.length)).toFixed(0));
    gsap.to([curioG, curioLinksG], { opacity: node === ROOT ? 1 : 0, duration:D(.4) });
    curioG.style.pointerEvents = node === ROOT ? '' : 'none';
    legend.hidden = node !== ROOT;
    pickHint.style.opacity = node === ROOT ? 1 : 0;
  }

  function retire(v){
    v.items.forEach(function(it){ it.g.style.pointerEvents = 'none'; dying.push(it); });
    v.links.forEach(function(l){ dying.push(l); });
  }
  function bury(list){
    list.forEach(function(x){ var e = x.g || x.p; if (e && e.parentNode) e.parentNode.removeChild(e); });
    dying = dying.filter(function(x){ return list.indexOf(x) < 0; });
  }

  /* mode: 'dive' from an item, 'rise' going back up, 'instant' */
  function swapView(node, mode, fromItem){
    var old = view;
    if (mode === 'instant'){
      bury(old.items.concat(old.links));
      view = buildView(node);
      mapLayer.style.background = groundFor(node);
      setChrome(node);
      return;
    }
    setBusy(true);
    retire(old);
    view = { node:node, items:[], links:[] };
    var oldList = old.items.concat(old.links);
    var t = gsap.timeline({ onComplete:function(){ bury(oldList); setBusy(false); } });
    if (mode === 'dive' && fromItem){
      nodesG.appendChild(fromItem.g);
      t.to(fromItem, { x:W / 2, y:H / 2, r:Math.hypot(W, H) * .62, duration:D(.85), ease:'power3.inOut' }, 0);
      old.items.forEach(function(x){
        if (x === fromItem) return;
        var dx = x.x - W / 2, dy = x.y - H / 2, a = Math.atan2(dy, dx) + 1.9, d = Math.hypot(dx, dy) * 1.5 + 60;
        t.to(x, { x:W / 2 + Math.cos(a) * d, y:H / 2 + Math.sin(a) * d, s:.25, o:0, duration:D(.75), ease:'power2.in' }, 0);
      });
      t.add(function(){
        mapLayer.style.background = groundFor(node);
        view = buildView(node);
        setChrome(node);
        view.items.forEach(function(it){ it.s = 0; it.o = 0; });
        gsap.to(view.items, { s:1, o:1, duration:D(.6), ease:'back.out(1.7)', stagger:D(.05) });
      }, D(.8));
      t.to(fromItem, { o:0, duration:D(.45) }, D(.85));
    } else {
      old.items.forEach(function(x){ t.to(x, { s:.35, o:0, duration:D(.4), ease:'power2.in' }, 0); });
      t.add(function(){
        mapLayer.style.background = groundFor(node);
        view = buildView(node);
        setChrome(node);
        view.items.forEach(function(it){ it.s = 1.8; it.o = 0; });
        gsap.to(view.items, { s:1, o:1, duration:D(.6), ease:'power3.out', stagger:D(.04) });
      }, D(.35));
      t.to({}, { duration:D(.5) });
    }
  }

  function activate(it){
    if (busy() || !done || it.o < .5) return;
    if (it.deeper){
      setBusy(true); /* the dive starts on the next render; block double taps until then */
      o.onDive(it.node, it);
    } else {
      gsap.to(it, { s:1.5, duration:D(.3), yoyo:true, repeat:1 });
      o.onOpenPage(it.node);
    }
  }

  /* ---------- render loop ---------- */
  function drawItem(it, t){
    var tx = 0, ty = 0;
    if (mouse && done){
      var f = it.hover ? .1 : .03, cap = it.hover ? 26 : 12;
      tx = clamp((mouse.x - it.x) * f, -cap, cap); ty = clamp((mouse.y - it.y) * f, -cap, cap);
    }
    it.lx += (tx - it.lx) * .12; it.ly += (ty - it.ly) * .12;
    it.hs += ((it.hover && done ? 1.07 : 1) - it.hs) * .15;
    var base = Math.max(.1, it.r * it.s);
    /* hover: the near side reaches toward the cursor */
    var hpx = 0, hpy = 0;
    if (mouse && done && !drag){
      var mdx = mouse.x - it.x, mdy = mouse.y - it.y, md = Math.hypot(mdx, mdy), reach = base * 2.2;
      if (md < reach && md > 0){
        var str = (1 - md / reach) * (it.hover ? .34 : .2) * base;
        hpx = mdx / md * str; hpy = mdy / md * str;
      }
    }
    it.px += (hpx - it.px) * .14; it.py += (hpy - it.py) * .14;
    var cx = it.x + it.lx + it.dragX * .45, cy = it.y + it.ly + it.dragY * .45;
    var rr = base * it.hs;
    it.path.setAttribute('d', blobPath(cx, cy, rr, t, it.seed, it.amp, it.px + it.dragX * .7, it.py + it.dragY * .7));
    it.g.style.opacity = it.o;
    var fs, ly, sy;
    if (it.isHub){
      fs = clamp(rr * .3, 16, 260);
      ly = cy + fs * .35 - (it.lines - 1) * fs * .55;
      sy = cy + rr * .45;
      it.sub.style.opacity = rr > 240 ? 0 : 1;
    } else {
      fs = clamp(M * .026, 14, 20);
      ly = cy + rr + fs + 6;
      sy = ly + fs * 1.1 * (it.lines - 1) + 18;
    }
    it.lbl.setAttribute('font-size', fs.toFixed(1));
    it.lbl.setAttribute('y', ly.toFixed(1));
    it.spans.forEach(function(s){ s.setAttribute('x', cx.toFixed(1)); });
    it.sub.setAttribute('x', cx.toFixed(1)); it.sub.setAttribute('y', sy.toFixed(1));
    it.cx = cx; it.cy = cy; it.rr = rr;
  }
  function drawLink(l, t){
    var a = l.a, b = l.b; if (a.cx === undefined || b.cx === undefined) return;
    l.p.setAttribute('d', curvePath(a.cx, a.cy, b.cx, b.cy, 22 * Math.sin(t * .8 + l.k * 1.7)));
    l.p.style.opacity = Math.min(a.o, b.o);
  }
  function frame(now){
    var t = reduce ? 0 : now / 1000;
    if (done || o.getIntroProgress() > .8){
      view.items.forEach(function(it){ drawItem(it, t); });
      dying.forEach(function(x){ if (x.g) drawItem(x, t); });
      view.links.forEach(function(l){ drawLink(l, t); });
      dying.forEach(function(x){ if (x.p) drawLink(x, t); });
      drawCurio(t);
      if (mouse && !reduce) bgNet.setAttribute('transform', 'translate(' + ((W / 2 - mouse.x) * .015).toFixed(1) + ' ' + ((H / 2 - mouse.y) * .015).toFixed(1) + ')');
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- pointer ---------- */
  function onSvgMove(e){
    if (e.pointerType === 'touch') return;
    var r = svg.getBoundingClientRect(); mouse = { x:e.clientX - r.left, y:e.clientY - r.top };
  }
  function onSvgLeave(){ mouse = null; }
  /* press and drag: rubber-band the blob, spring back on release, a still press counts as a click */
  function onWinMove(e){
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy, dist = Math.hypot(dx, dy);
    if (dist > 6) drag.moved = true;
    var eff = dist / (1 + dist / (M * .55)), f = dist ? eff / dist : 0;
    drag.it.dragX = dx * f; drag.it.dragY = dy * f;
  }
  function endDrag(e){
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    mapLayer.classList.remove('dragging');
    gsap.to(d.it, { dragX:0, dragY:0, duration:D(1.3), ease:'elastic.out(1, 0.28)' });
    if (d.type !== 'mouse') d.it.hover = false;
    if (e.type === 'pointerup' && !d.moved) activate(d.it);
  }

  function relayout(){
    measure(); drawBg();
    var node = view.node, pos = layout(node);
    view.items.forEach(function(it, i){ if (pos[i]){ it.x = pos[i].x; it.y = pos[i].y; it.r = pos[i].r; } });
    setChrome(node);
  }
  function onResize(){ if (!busy()) relayout(); }

  function init(){
    measure(); drawBg();
    view = buildView(ROOT);
    mapLayer.style.background = groundFor(ROOT);
    setChrome(ROOT);
    svg.addEventListener('pointermove', onSvgMove);
    svg.addEventListener('pointerleave', onSvgLeave);
    window.addEventListener('pointermove', onWinMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(frame);
  }
  function destroy(){
    cancelAnimationFrame(raf);
    svg.removeEventListener('pointermove', onSvgMove);
    svg.removeEventListener('pointerleave', onSvgLeave);
    window.removeEventListener('pointermove', onWinMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
    window.removeEventListener('resize', onResize);
    gsap.killTweensOf(view.items.concat(dying, [curioG, curioLinksG]));
    bury(view.items.concat(view.links, dying));
    bgNet.innerHTML = ''; curioG.innerHTML = ''; curioLinksG.innerHTML = '';
    view = { node:null, items:[], links:[] };
    setBusy(false);
  }

  return {
    init: init,
    destroy: destroy,
    swapTo: swapView,
    relayout: relayout,
    setDone: function(b){ done = b; },
    activateById: function(id){ var it = view.items.filter(function(i){ return i.node.id === id; })[0]; if (it) activate(it); },
    currentNode: function(){ return view.node; }
  };
}

/* ------------------------------------------------------------------
   The React shell. Renders the SVG once, hands the refs to the engine,
   and translates stack changes into dive / rise / instant swaps.

   stack:    array of nodes from ROOT down to the current level
   modeRef:  { mode, fromItem } set by BrainExperience just before it
             changes the stack, so the map knows how to transition
   sceneRef: BrainExperience uses it to call activateById (curio "Feeds" buttons)
   ------------------------------------------------------------------ */
export default function BrainMap({ stack, done, reduce, busyRef, modeRef, sceneRef, mapLayerRef, getIntroProgress, onDive, onOpenPage }){
  var svgRef = useRef(null), nodesRef = useRef(null), linksRef = useRef(null), bgRef = useRef(null), wmRef = useRef(null);
  var curioRef = useRef(null), curioLinksRef = useRef(null), legendRef = useRef(null), pickRef = useRef(null);
  var cb = useRef(null);
  cb.current = { onDive:onDive, onOpenPage:onOpenPage, getIntroProgress:getIntroProgress };

  useLayoutEffect(function(){
    var scene = createScene({
      svg:svgRef.current, nodesG:nodesRef.current, linksG:linksRef.current, bgNet:bgRef.current, wm:wmRef.current,
      curioG:curioRef.current, curioLinksG:curioLinksRef.current, legend:legendRef.current, pickHint:pickRef.current,
      mapLayer:mapLayerRef.current, reduce:reduce, busyRef:busyRef,
      getIntroProgress:function(){ return cb.current.getIntroProgress(); },
      onDive:function(n, it){ cb.current.onDive(n, it); },
      onOpenPage:function(n){ cb.current.onOpenPage(n); }
    });
    scene.init();
    sceneRef.current = scene;
    return function(){ scene.destroy(); sceneRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(function(){ if (sceneRef.current) sceneRef.current.setDone(done); }, [done, sceneRef]);

  useEffect(function(){
    var scene = sceneRef.current; if (!scene) return;
    var node = stack[stack.length - 1];
    var req = modeRef.current || { mode:'instant' };
    modeRef.current = null;
    if (scene.currentNode() === node){ busyRef.current = false; return; }
    scene.swapTo(node, req.mode, req.fromItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stack]);

  return (
    <div id="mapLayer" ref={mapLayerRef}>
      <svg id="mapSvg" ref={svgRef} aria-label="Brain map. Choose Learn, Teach, or Improve to go deeper.">
        <defs>
          <pattern id="halftone" width="7" height="7" patternUnits="userSpaceOnUse">
            <rect width="7" height="7" fill="#ffffff" />
            <circle cx="3.5" cy="3.5" r="1.4" fill="#1a1a1a" />
          </pattern>
        </defs>
        <g id="bgNet" ref={bgRef} aria-hidden="true" />
        <text id="wm" ref={wmRef} textAnchor="middle" dominantBaseline="middle" />
        <g id="curioLinks" ref={curioLinksRef} aria-hidden="true" />
        <g id="curio" ref={curioRef} className="curio" />
        <g id="links" ref={linksRef} filter="url(#boil)" aria-hidden="true" />
        <g id="nodes" ref={nodesRef} />
      </svg>
      <div id="legend" ref={legendRef} hidden><span><b className="fill" />goes deeper</span><span><b className="open" />opens a page</span></div>
      <div id="pickHint" ref={pickRef}>Pick one</div>
    </div>
  );
}
