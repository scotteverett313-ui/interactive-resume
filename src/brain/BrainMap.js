import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ROOT, BYID, only, MAP_STICKERS } from './content';
import stickerCup from './art/coffee/sticker-cup.webp';
import stickerPapers from './art/coffee/sticker-papers.webp';
import stickerComputer from './art/coffee/sticker-computer.webp';
import stickerFlowers from './art/coffee/sticker-flowers.webp';
import stickerStylus from './art/coffee/sticker-stylus.webp';

import { DOT_COUNT } from './DotNav';
import { blobPath, rng, clamp, wrapLabel, curvePath, curvePoint, seedOf, scatter, webLinks } from './blob';

/* the sticker art for the map's top level, and each picture's width over its height */
var STICKER_ART = {
  cup:      { src: stickerCup, ratio: .849 },
  papers:   { src: stickerPapers, ratio: 1.185 },
  computer: { src: stickerComputer, ratio: 1.026 },
  flowers:  { src: stickerFlowers, ratio: 1.011 },
  stylus:   { src: stickerStylus, ratio: .588 }
};

const NS = 'http://www.w3.org/2000/svg';
/* Colors are never set here. Elements get a class, and brain.css paints them from the palette tokens. */
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
  var linkMask = o.linkMask, linkMaskAll = o.linkMaskAll;
  var reduce = o.reduce, busyRef = o.busyRef;
  function D(x){ return reduce ? 0 : x; }
  function busy(){ return busyRef.current; }
  function setBusy(b){ busyRef.current = b; }

  var W = 1000, H = 700, M = 700;
  var mouse = null, drag = null, done = false, raf = 0;
  var view = { node:null, items:[], links:[] }, dying = [];
  var curioLinks = [], curioPos = {}, hot = {};

  /* ---------- arrival: how the map comes together at the end of the intro ----------
     arr runs from 0 to 1, driven by the intro's scroll timeline (so it scrubs both ways).
     Instead of one flat picture growing, each part moves on its own:
       gravity points  start tiny and huddled at the center, inside the brain, then spiral outward as it
                       grows and land one after another with a slight swell
       curiosities     start beyond the edges of the screen and get pulled inward into their orbit,
                       dragging their dotted connections in with them
       background net  drifts in last
     At 1 everything sits exactly where the normal layout puts it. */
  var arr = 1, arrSettled = true, curioEls = {}, curioTitle = null, curioNow = {};
  var ARR_GROW = Math.log(11) * .87;   /* keeps the gravity points in step with the brain's zoom */
  function arrBase(p){ return Math.exp(-ARR_GROW * (1 - p)); }
  function backOut(x, c){ return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function hubArrive(i){
    var pop = backOut(clamp((arr - i * .05) / .16, 0, 1), 1.7);
    var s0 = .6 + i * .07, q = clamp((arr - s0) / (1 - s0), 0, 1);
    return { k: arrBase(arr) * pop * (1 + .16 * Math.sin(q * Math.PI)), th: -.9 * Math.pow(1 - arr, 1.6), o: clamp((arr - i * .05) / .06, 0, 1) };
  }
  function curioArrive(c, j){
    var p0 = curioPos[c.id], s0 = .36 + j * .05, q = clamp((arr - s0) / (1 - s0), 0, 1);
    var wide = 2.6 - 1.6 * backOut(q, 1), th = Math.pow(1 - q, 1.5);
    var dx = p0.x - W / 2, dy = p0.y - H / 2, co = Math.cos(th), si = Math.sin(th);
    return { x: W / 2 + (dx * co - dy * si) * wide, y: H / 2 + (dx * si + dy * co) * wide, a: clamp(q * 5, 0, 1) };
  }
  /* move the curiosities, the net, and the hint to where the arrival puts them; once arrived, hand them back untouched */
  function applyArrival(){
    var arriving = arr < 1, kids = MAP_STICKERS;
    kids.forEach(function(c, j){
      var p0 = curioPos[c.id], g = curioEls[c.id]; if (!p0) return;
      var A = arriving ? curioArrive(c, j) : { x:p0.x, y:p0.y, a:1 };
      curioNow[c.id] = A;
      [g, j === 0 ? curioTitle : null].forEach(function(e){
        if (!e) return;
        if (arriving){ e.setAttribute('transform', 'translate(' + (A.x - p0.x).toFixed(1) + ' ' + (A.y - p0.y).toFixed(1) + ')'); e.style.opacity = A.a; }
        else { e.removeAttribute('transform'); e.style.opacity = ''; }
      });
    });
    if (arriving){
      var nk = 1.35 - .35 * (1 - Math.pow(1 - arr, 3));
      bgNet.setAttribute('transform', 'translate(' + (W / 2 * (1 - nk)).toFixed(1) + ' ' + (H / 2 * (1 - nk)).toFixed(1) + ') scale(' + nk.toFixed(3) + ')');
      bgNet.style.opacity = clamp((arr - .4) / .5, 0, 1);
      pickHint.style.opacity = clamp((arr - .85) / .15, 0, 1);
    } else {
      bgNet.removeAttribute('transform'); bgNet.style.opacity = '';
      pickHint.style.opacity = view.node === ROOT ? 1 : 0;
      view.links.forEach(function(l){ l.p.style.strokeWidth = ''; });
    }
    arrSettled = !arriving;
  }

  function measure(){
    /* the layer's own layout size, not its on-screen box: the intro scales the layer while it zooms in */
    W = Math.max(320, mapLayer.offsetWidth); H = Math.max(320, mapLayer.offsetHeight); M = Math.min(W, H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    /* the mask that hides connection lines behind labels covers the whole map */
    [linkMask, linkMaskAll].forEach(function(e){ e.setAttribute('x', 0); e.setAttribute('y', 0); e.setAttribute('width', W); e.setAttribute('height', H); });
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
        bgNet.appendChild(el('path', { 'class':'net-line', d:'M'+p[0].toFixed(0)+' '+p[1].toFixed(0)+' L'+q[0].toFixed(0)+' '+q[1].toFixed(0) })); });
      bgNet.appendChild(el('circle', { 'class':'net-dot', cx:p[0].toFixed(0), cy:p[1].toFixed(0), r:(2 + R() * 3).toFixed(1) }));
    });
    curioG.innerHTML = ''; curioLinksG.innerHTML = ''; curioLinks = []; curioPos = {}; curioEls = {}; curioNow = {}; arrSettled = false;
    /* the stickers: a landscape screen and an upright phone each get their own spots */
    var tall = W < H * .9, kids = MAP_STICKERS;
    kids.forEach(function(c){ var f = tall ? c.tall : c.wide; curioPos[c.id] = { x:f[0] * W, y:f[1] * H }; curioNow[c.id] = { x:f[0] * W, y:f[1] * H, a:1 }; });
    function curioBtn(g, label, fn){
      g.setAttribute('class', ((g.getAttribute('class') || '') + ' cnode').trim()); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', label);
      g.addEventListener('click', function(){ if (done && !busy() && view.node === ROOT) fn(); });
      g.addEventListener('keydown', function(e){ if ((e.key === 'Enter' || e.key === ' ') && done && !busy() && view.node === ROOT){ e.preventDefault(); fn(); } });
    }
    /* the stickers are the way into Can't Stop Thinking About; there is no separate text link */
    /* each sticker: its picture turned a little, as if slapped on by hand, with its name underneath.
       The size follows the screen: about an eighth of its short side, never smaller than 58 */
    var size = clamp(M * .13, 58, 112);
    kids.forEach(function(c){
      var pt = curioPos[c.id], art = STICKER_ART[c.id];
      var h = c.id === 'stylus' || c.id === 'cup' ? size * 1.08 : size, w = h * art.ratio;
      var g = el('g', { 'class':'msticker' });
      var tilt = el('g', { transform:'rotate(' + c.tilt + ' ' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')' });
      var pop = el('g', { 'class':'ms-art' });
      pop.appendChild(el('rect', { 'class':'ring', x:(pt.x - w / 2 - 6).toFixed(1), y:(pt.y - h / 2 - 6).toFixed(1), width:(w + 12).toFixed(1), height:(h + 12).toFixed(1), rx:14 }));
      pop.appendChild(el('image', { href:art.src, x:(pt.x - w / 2).toFixed(1), y:(pt.y - h / 2).toFixed(1), width:w.toFixed(1), height:h.toFixed(1) }));
      tilt.appendChild(pop); g.appendChild(tilt);
      var t = el('text', { x:pt.x.toFixed(1), y:(pt.y + h / 2 + 15).toFixed(1), 'text-anchor':'middle' });
      t.textContent = c.label;
      g.appendChild(t);
      curioBtn(g, "Can't stop thinking about: " + c.label, function(){ if (o.onSticker) o.onSticker('curio#' + c.section); });
      curioG.appendChild(g); curioEls[c.id] = g;
    });
  }
  /* The stickers have no connection lines; curioLinks stays empty and drawCurio below has nothing to draw.
     (The curiosities' own dotted links lived here before the stickers took their place.) */
  var lastCurioT = 0;
  function drawCurio(t){
    if (view.node !== ROOT) return;
    var dt = Math.min(.1, Math.max(0, t - lastCurioT)); lastCurioT = t;
    var byId = {};
    view.items.forEach(function(it){ byId[it.node.id] = it; });
    curioLinks.forEach(function(l){
      var a = curioNow[l.c.id], bx, by, isHot = hot[l.c.id], alpha = a.a;
      if (l.hub){
        var it = byId[l.hub];
        if (!it || it.cx === undefined){ l.p.setAttribute('d', ''); if (l.pulse) l.pulse.style.opacity = 0; return; }
        bx = it.cx; by = it.cy; isHot = isHot || it.hover;
      } else {
        var x = curioNow[l.other]; bx = x.x; by = x.y; isHot = isHot || hot[l.other]; alpha = Math.min(alpha, x.a);
      }
      var bow = 16 * Math.sin(t * .6 + l.k * 1.3);
      l.p.setAttribute('d', curvePath(a.x, a.y, bx, by, bow));
      if (l.hub){
        /* dots flow from the curiosity toward the hub it feeds, faster while either end is hovered */
        l.off -= dt * (isHot ? 46 : 13);
        l.p.setAttribute('stroke-dashoffset', l.off.toFixed(1));
        l.p.setAttribute('stroke-width', isHot ? 4 : 3);
        l.p.style.opacity = (isHot ? 1 : .8) * alpha;
        if (l.pulse){
          /* a pulse leaves the curiosity every few seconds, each link on its own beat; hovered links fire back to back */
          var period = isHot ? 1.3 : 3.8, travel = isHot ? 1 : .4;
          var phase = (t / period + l.k * .618) % 1;
          if (phase < travel){
            var u = phase / travel, pt = curvePoint(a.x, a.y, bx, by, bow, u);
            l.pulse.setAttribute('cx', pt[0].toFixed(1)); l.pulse.setAttribute('cy', pt[1].toFixed(1));
            l.pulse.setAttribute('r', isHot ? 6 : 5);
            l.pulse.style.opacity = Math.min(1, Math.sin(Math.PI * u) * 2.2) * alpha; /* fade in as it leaves, out as it lands */
          } else l.pulse.style.opacity = 0;
        }
      } else {
        l.off -= dt * 4 * (l.k % 2 ? 1 : -1);
        l.p.setAttribute('stroke-dashoffset', l.off.toFixed(1));
        l.p.setAttribute('stroke-width', isHot ? 2 : 1.2);
        l.p.style.opacity = (isHot ? .9 : .3) * alpha;
      }
    });
  }

  /* the fuller look being trialled: on for every level inside a gravity point marked `rich` in content.js */
  function isRich(node){ return node !== ROOT && !!(node.hub && node.hub.rich); }
  /* a page's lead picture: its own, or its case study's hero */
  function leadOf(n){
    var p = n.page || {}, hero = p.study && p.study.hero && p.study.hero.src;
    return p.image || hero || null;
  }
  function dotR(){ return clamp(M * .011, 4.5, 8); }

  /* the small tag under a blob's name: what a press leads to. `feature` and `promote` are the featured kinds (see entries) */
  function tagOf(node, feature, promote){
    var deeper = !!(node.kids && node.kids.length), inside = null, ends = null;
    for (var one = only(node); one; one = only(one)){
      if (one.kids && one.kids.length) inside = one; else { ends = one; break; }
    }
    if (feature) return 'featured';
    if (promote) return ends ? ends.label + ' · featured' : 'featured';
    return ends ? ends.label : (inside ? inside.label + ' · ' + inside.kids.length + ' inside' : (deeper ? node.kids.length + ' inside' : 'page'));
  }
  /* does pressing this kid already open that page? Either it is the page, or it is a single-item level that ends in it */
  function leadsTo(kid, page){
    if (kid === page) return true;
    for (var one = only(kid); one; one = only(one)) if (one === page) return true;
    return false;
  }
  /* what a level shows: its kids, plus its featured previews (see `featured` in content.js).
     A preview whose page is already one press away on this level does not get a second blob: the blob that
     is already there is promoted instead (bigger, with the picture). Any other preview gets a blob of its own,
     standing for its first page.
     Each carries `seq`, the list its page's Next and Previous step through: the preview's own pages when it has
     several, otherwise the level's single-page previews together (soft: the page's own neighbors win if it has any) */
  function entries(node){
    var out = (node.kids || []).map(function(k){ return { node:k, feature:null, promote:null }; });
    if (node === ROOT) return out;
    var previews = [];
    (node.featured || []).forEach(function(f){
      var pages = (f.pages || []).map(function(id){
        var n = BYID[id];
        return n && !(n.kids && n.kids.length) && !n.go ? { node:n, name:n.label } : null;
      }).filter(Boolean);
      if (pages.length) previews.push({ f:f, pages:pages });
    });
    var singles = previews.filter(function(pv){ return pv.pages.length === 1; }).map(function(pv){ return pv.pages[0]; });
    previews.forEach(function(pv){
      var first = pv.pages[0].node;
      var seq = pv.pages.length > 1 ? { pages:pv.pages, soft:false } : { pages:singles, soft:true };
      /* the blob's picture: the preview's own, else the page's lead picture, else its case study's hero */
      var fp = first.page || {}, hero = fp.study && fp.study.hero && fp.study.hero.src;
      var image = pv.f.image || fp.image || hero || null;
      var home = out.filter(function(e){ return !e.feature && leadsTo(e.node, first); })[0];
      if (home) home.promote = { seq:seq, image:image };
      else out.push({ node:first, feature:{ seq:seq, name:pv.f.as || pv.pages[0].name, image:image }, promote:null });
    });
    return out;
  }

  function layout(node){
    var kids = node.kids || [];
    if (node === ROOT){
      var spots = { work:[.27,.37,.17], teach:[.5,.69,.18], build:[.73,.35,.13] };
      if (W < H * .8) spots = { work:[.32,.3,.2], teach:[.5,.66,.21], build:[.72,.42,.15] };
      return kids.map(function(k){ var s = spots[k.id]; return { x:s[0]*W, y:s[1]*H, r:s[2]*M }; });
    }
    /* inside a hub: a loose scatter, not a ring. Each node gets room for its blob plus the label and tag
       under it, the scatter keeps them from overlapping, and the node's id seeds it so it never changes */
    var ents = entries(node), n = ents.length, fs = clamp(M * .026, 14, 20);
    function boxesAt(k){
      return ents.map(function(ent){
        var kid = ent.node;
        /* a page is the thing to open, so its blob is the bigger one; a node that only goes deeper is smaller */
        var deeper = !!(kid.kids && kid.kids.length);
        /* a level that ends in a single page opens that page, so it is drawn as one */
        for (var one = only(kid); one && deeper; one = only(one)) if (!(one.kids && one.kids.length)) deeper = false;
        /* a featured blob holds a picture, so it is the biggest thing on the level. On a gravity point the
           projects themselves are big picture blobs too, and the one "More" blob is the small one */
        var big = ent.feature || ent.promote;
        var core = node.parent === ROOT && !deeper && !kid.go;
        var r = M * (big ? .1 : core ? .088 : kid.more ? .046 : (deeper ? .054 : .07)) * k;
        var lines = wrapLabel(ent.feature ? ent.feature.name : kid.label), chars = Math.max.apply(null, lines.map(function(x){ return x.length; }));
        /* a picture blob is big enough that its wobble needs a little more air around it */
        var air = big ? r * .12 + 8 : 0;
        /* in the fuller look a blob that goes deeper wears a ring of dots over its top: leave room for them */
        if (isRich(node) && deeper && !big) air = r * .4 + dotR() * 2 + 8;
        /* the tag under the name can be the widest thing, so it counts toward the room the node needs */
        var tagHalf = tagOf(kid, ent.feature, ent.promote).length * 3.9;
        return { r:r, hw: Math.max(r + air, chars * fs * .3, tagHalf, 38) + 10, up: r + 8 + air, down: r + fs + 6 + fs * 1.1 * (lines.length - 1) + 18 + 16 };
      });
    }
    function areaOf(bs){ return bs.reduce(function(sum, b){ return sum + 2 * b.hw * (b.up + b.down); }, 0); }
    /* where centers may go: clear of the crumbs along the top, the depth dots on the right, the legend and toggle below */
    /* on narrow screens the crumbs wrap onto a second line, so start lower */
    var full = { x0:16, y0: W < 600 ? 118 : 78, x1:W - 62, y1:H - 60 };
    /* the crumbs can run deeper than that: a long trail, or the level's blurb under it (Crumbs.js draws both).
       They are already on the page for this level by the time the map lays itself out, so measure them */
    var crumbs = mapLayer.parentNode && mapLayer.parentNode.querySelector('#crumbs');
    if (crumbs && !crumbs.hidden){
      var cb = crumbs.getBoundingClientRect(), lb = mapLayer.getBoundingClientRect();
      if (cb.height) full.y0 = Math.max(full.y0, cb.bottom - lb.top + (crumbs.querySelector('#levelBlurb, #levelSays') ? 18 : -22));
    }
    /* the depth tag sits beside the dots on the right, level with this level's dot: keep nodes off it.
       The dots are 28px rows, 2px apart, centered on the screen; this level's row is its depth plus one.
       A long name is cut short in the tag (see #dots .tag in brain.css), so its width is capped the same way */
    var depth = 0; for (var up = node; up && up !== ROOT; up = up.parent) depth++;
    var tagW = Math.min(node.label.length * 8, Math.min(W * .4, 220)) + 18;
    var rowY = H / 2 - (DOT_COUNT * 30 - 2) / 2 + 14 + (depth + 1) * 30;
    var tag = { x0:W - 52 - tagW - 10, y0:rowY - 20, x1:W, y1:rowY + 20 };
    /* the legend sits in the bottom-left corner on wide screens */
    /* along the bottom: the status button and Just the work, with the legend above the status on a wide screen */
    var corner = W <= 820 ? { x0:0, y0:H - 66, x1:W, y1:H } : { x0:0, y0:H - 100, x1:340, y1:H };
    var corner2 = W <= 820 ? corner : { x0:W - 260, y0:H - 66, x1:W, y1:H };
    var fw = full.x1 - full.x0, fh = full.y1 - full.y0;
    /* a crowded level on a small screen: shrink the blobs a step at a time until the level fills
       no more than about half the room, so the scatter can still pull everything apart */
    var shrink = 1, boxes = boxesAt(1);
    while (shrink > .62 && areaOf(boxes) > fw * fh * .52){ shrink -= .1; boxes = boxesAt(shrink); }
    /* a single node sits in the middle, moved left if the depth tag would be on top of it */
    if (n === 1){
      var one = boxes[0], ox = W / 2, oy = Math.max(H * .5, full.y0 + one.up);
      if (ox + one.hw > tag.x0 && oy + one.down > tag.y0 && oy - one.up < tag.y1) ox = Math.max(full.x0 + one.hw, tag.x0 - one.hw - 6);
      return [{ x:ox, y:oy, r:one.r }];
    }
    /* few nodes on a big screen: keep them in a loose group near the middle instead of flung to the corners */
    var mx = (full.x0 + full.x1) / 2, my = (full.y0 + full.y1) / 2, pts;
    for (;;){
      var need = areaOf(boxes) * 3.2;
      var rw = Math.min(fw, Math.sqrt(need * fw / fh)), rh = Math.min(fh, need / rw);
      rw = Math.min(fw, need / rh);
      pts = scatter(boxes, { x0:mx - rw / 2, y0:my - rh / 2, x1:mx + rw / 2, y1:my + rh / 2 }, seedOf(node.id), [tag, corner, corner2]);
      /* still touching after every try: the level is too full for this screen, so go a size smaller and scatter again */
      if (pts.clean || shrink <= .52) break;
      shrink -= .1; boxes = boxesAt(shrink);
    }
    return pts.map(function(p, i){ return { x:p.x, y:p.y, r:boxes[i].r }; });
  }

  /* lines between the nodes of a level: the three gravity points form a triangle; inside a hub each node
     joins its nearest neighbors in a branching web */
  function makeLinks(node, items){
    var pairs = node === ROOT ? [[0, 1], [0, 2], [1, 2]] : webLinks(items);
    return pairs.map(function(pr, k){
      var p = el('path', { 'class':'link' }); linksG.appendChild(p);
      return { a:items[pr[0]], b:items[pr[1]], p:p, k:k };
    });
  }

  var clipN = 0;
  /* pictures rest in gray and show their color under the pointer. Only where there is a pointer to hover with:
     on a touch screen they stay in color, since there is no way to reveal it without pressing through */
  var canHover = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
  function makeItem(node, pos, i, feature, promote){
    var isHub = !feature && node.parent === ROOT, deeper = !!(node.kids && node.kids.length);
    /* a level with one thing inside is passed straight through. `inside` is the single level it leads into,
       if there is one; `ends` is the single page at the end of the line, if there is one. A level that ends
       in a page behaves like a page: pressing it opens that page */
    var inside = null, ends = null;
    for (var one = only(node); one; one = only(one)){
      if (one.kids && one.kids.length) inside = one; else { ends = one; break; }
    }
    var opens = !deeper || !!ends;
    /* in-<hub> gives the node its hub's colors; is-hub and is-deep say which of them it uses (see brain.css) */
    var cls = 'node in-' + node.hub.id + (isHub ? ' is-hub' : (opens ? ' is-leaf' : ' is-deep')) + (feature || promote ? ' is-featured' : '');
    var rich = !isHub && isRich(node);
    var name = feature ? feature.name : node.label;
    var g = el('g', { 'class':cls, tabindex:0, role:'button',
      'aria-label': feature ? 'Featured: ' + name + ', open page'
        : node.label + (ends ? ', open page: ' + ends.label : (inside ? ', go deeper: ' + inside.label : (deeper ? ', go deeper' : ', open page'))) + (promote ? ', featured' : '') });
    var path = el('path', {});
    /* the featured blob shows its page's picture, cut to the blob's shape, with an ink edge drawn over it.
       The same outline is written to all three each frame: the blob, the cut, and the edge */
    var clip = null, clipPath = null, img = null, gray = null, edge = null, src = feature ? feature.image : (promote ? promote.image : null);
    /* in the fuller look, a page with a picture shows it in its blob */
    if (!src && rich && !feature && !deeper) src = leadOf(node);
    if (src){
      var cid = 'featClip' + (++clipN);
      clip = el('clipPath', { id:cid }); clipPath = el('path', {}); clip.appendChild(clipPath);
      svg.querySelector('defs').appendChild(clip);
      /* the small copy of the picture is plenty for a blob; fall back to the full one if there is no small copy */
      var small = src.replace(/\.webp$/, '.thumb.webp');
      img = el('image', { href:small, preserveAspectRatio:'xMidYMid slice', 'clip-path':'url(#' + cid + ')' });
      if (small !== src) img.addEventListener('error', function(){ if (img.getAttribute('href') !== src) img.setAttribute('href', src); });
      edge = el('path', { 'class':'edge' });
      if (canHover){
        gray = el('image', { 'class':'mute', href:small, preserveAspectRatio:'xMidYMid slice', 'clip-path':'url(#' + cid + ')', filter:'url(#mute)' });
        if (small !== src) gray.addEventListener('error', function(){ if (gray.getAttribute('href') !== src) gray.setAttribute('href', src); });
      }
    }
    var lines = wrapLabel(name);
    var lbl = el('text', { 'class':'lbl', 'text-anchor':'middle' });
    var spans = lines.map(function(s, j){ var ts = el('tspan', { dy: j ? '1.1em' : '0' }); ts.textContent = s; lbl.appendChild(ts); return ts; });
    var sub = el('text', { 'class':'sub', 'text-anchor':'middle' });
    /* the small tag under the name says what a press leads to */
    sub.textContent = tagOf(node, feature, promote);
    g.appendChild(path);
    if (img){ g.appendChild(img); if (gray) g.appendChild(gray); g.appendChild(edge); }
    g.appendChild(lbl); g.appendChild(sub);
    /* in the fuller look, a blob that goes deeper wears a dot for each thing inside it, with its name beside it
       when the blob is under the pointer or has keyboard focus. A dot is ink if it goes deeper again and the
       hub's color if it is a page, the same as the blobs themselves */
    var sats = null;
    if (rich && deeper && !ends && !feature){
      var satG = el('g', { 'class':'sats' });
      sats = (inside || node).kids.map(function(k){
        var leafy = !(k.kids && k.kids.length);
        for (var o2 = only(k); o2 && !leafy; o2 = only(o2)) if (!(o2.kids && o2.kids.length)) leafy = true;
        var c = el('circle', { 'class':'sat' + (leafy ? ' leaf' : '') }), t = el('text', { 'class':'sat-name' });
        t.textContent = k.label.length > 24 ? k.label.slice(0, 23) + '…' : k.label;
        satG.appendChild(c); satG.appendChild(t);
        return { c:c, t:t };
      });
      sats.g = satG;
      g.appendChild(satG);
    }
    nodesG.appendChild(g);
    /* a label that sits on the ground cuts a gap in the connection lines, so a line passes behind the words
       instead of through them. Nothing is drawn around the text itself. (Gravity points carry their label
       on the blob, which already covers the lines.) */
    var gap = null;
    if (!isHub){ gap = el('rect', { fill:'black', rx:5 }); linkMask.appendChild(gap); }
    var it = { node:node, g:g, path:path, lbl:lbl, spans:spans, sub:sub, isHub:isHub, deeper:deeper, ends:ends, lines:lines.length,
      feature:feature || null, promote:promote || null, clip:clip, clipPath:clipPath, img:img, gray:gray, edge:edge, sats:sats, r0:pos.r, sway:0, lt:0,
      idx:i, gap:gap, tw:0, twFs:0, x:pos.x, y:pos.y, r:pos.r, s:1, o:1, hs:1, lx:0, ly:0, px:0, py:0, dragX:0, dragY:0, hover:false,
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
    var items = entries(node).map(function(e, i){ return makeItem(e.node, pos[i], i, e.feature, e.promote); });
    return { node:node, items:items, links:makeLinks(node, items) };
  }

  /* tell the layer which hub the current level belongs to, so the legend can show that hub's color */
  function setHub(node){
    ROOT.kids.forEach(function(h){ mapLayer.classList.remove('in-' + h.id); });
    if (node !== ROOT) mapLayer.classList.add('in-' + node.hub.id);
  }
  function setChrome(node){
    setHub(node);
    var wmText = node === ROOT ? '' : node.label.toUpperCase();
    wm.textContent = wmText;
    wm.setAttribute('x', W / 2); wm.setAttribute('y', H / 2);
    wm.setAttribute('font-size', Math.min(M * .32, W * 1.5 / Math.max(4, wmText.length)).toFixed(0));
    /* autoAlpha hides the outer orbit as well as fading it, so inside a level its buttons cannot be tabbed to */
    gsap.to([curioG, curioLinksG], { autoAlpha: node === ROOT ? 1 : 0, duration:D(.4) });
    curioG.style.pointerEvents = node === ROOT ? '' : 'none';
    legend.hidden = node === ROOT; /* the legend only means something inside a hub */
    pickHint.style.opacity = node === ROOT ? 1 : 0;
  }

  function retire(v){
    v.items.forEach(function(it){ it.g.style.pointerEvents = 'none'; dying.push(it); });
    v.links.forEach(function(l){ dying.push(l); });
  }
  function bury(list){
    list.forEach(function(x){
      var e = x.g || x.p; if (e && e.parentNode) e.parentNode.removeChild(e);
      if (x.gap && x.gap.parentNode) x.gap.parentNode.removeChild(x.gap);
      if (x.clip && x.clip.parentNode) x.clip.parentNode.removeChild(x.clip);
    });
    dying = dying.filter(function(x){ return list.indexOf(x) < 0; });
  }

  /* mode: 'dive' from an item, 'rise' going back up, 'instant' */
  var swapTl = null;
  function swapView(node, mode, fromItem){
    /* a jump (Back, Forward, a link) can arrive mid-transition: drop the one in flight and clear what it left */
    if (swapTl){ swapTl.kill(); swapTl = null; bury(dying.slice()); setBusy(false); }
    var old = view;
    if (mode === 'instant'){
      bury(old.items.concat(old.links));
      view = buildView(node);
      setChrome(node);
      return;
    }
    setBusy(true);
    retire(old);
    view = { node:node, items:[], links:[] };
    var oldList = old.items.concat(old.links);
    var t = swapTl = gsap.timeline({ onComplete:function(){ bury(oldList); setBusy(false); swapTl = null; } });
    if (mode === 'dive' && fromItem){
      nodesG.appendChild(fromItem.g);
      t.to(fromItem, { x:W / 2, y:H / 2, r:Math.hypot(W, H) * .62, duration:D(.85), ease:'power3.inOut' }, 0);
      old.items.forEach(function(x){
        if (x === fromItem) return;
        var dx = x.x - W / 2, dy = x.y - H / 2, a = Math.atan2(dy, dx) + 1.9, d = Math.hypot(dx, dy) * 1.5 + 60;
        t.to(x, { x:W / 2 + Math.cos(a) * d, y:H / 2 + Math.sin(a) * d, s:.25, o:0, duration:D(.75), ease:'power2.in' }, 0);
      });
      t.add(function(){
          view = buildView(node);
        setChrome(node);
        view.items.forEach(function(it){ it.s = 0; it.o = 0; });
        gsap.to(view.items, { s:1, o:1, duration:D(.6), ease:'back.out(1.7)', stagger:D(.05) });
      }, D(.8));
      t.to(fromItem, { o:0, duration:D(.45) }, D(.85));
    } else {
      old.items.forEach(function(x){ t.to(x, { s:.35, o:0, duration:D(.4), ease:'power2.in' }, 0); });
      t.add(function(){
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
    if (it.feature){
      /* the featured blob opens its page as the first of the level's featured list */
      gsap.to(it, { s:1.25, duration:D(.3), yoyo:true, repeat:1 });
      o.onOpenPage(it.node, it.feature.seq);
    } else if (it.deeper && !it.ends){
      setBusy(true); /* the dive starts on the next render; block double taps until then */
      o.onDive(it.node, it);
    } else {
      gsap.to(it, { s:1.5, duration:D(.3), yoyo:true, repeat:1 });
      o.onOpenPage(it.ends || it.node, it.promote ? it.promote.seq : null);
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
    /* arriving at the end of the intro: a gravity point is pulled in toward the center, turned, and shrunk */
    var arriving = arr < 1 && it.isHub, arrO = 1, arrK = 1;
    if (arriving){
      var A = hubArrive(it.idx), adx = cx - W / 2, ady = cy - H / 2, co = Math.cos(A.th), si = Math.sin(A.th);
      cx = W / 2 + (adx * co - ady * si) * A.k; cy = H / 2 + (adx * si + ady * co) * A.k;
      rr *= A.k; arrO = A.o; arrK = A.k;
    }
    var outline = blobPath(cx, cy, rr, t, it.seed, it.amp, it.px + it.dragX * .7, it.py + it.dragY * .7);
    it.path.setAttribute('d', outline);
    if (it.img){
      /* the picture is a square a little bigger than the blob, so the wobble and the stretch never show its corners */
      var half = rr * 1.45;
      it.clipPath.setAttribute('d', outline); it.edge.setAttribute('d', outline);
      it.img.setAttribute('x', (cx - half).toFixed(1)); it.img.setAttribute('y', (cy - half).toFixed(1));
      it.img.setAttribute('width', (half * 2).toFixed(1)); it.img.setAttribute('height', (half * 2).toFixed(1));
      if (it.gray){
        it.gray.setAttribute('x', (cx - half).toFixed(1)); it.gray.setAttribute('y', (cy - half).toFixed(1));
        it.gray.setAttribute('width', (half * 2).toFixed(1)); it.gray.setAttribute('height', (half * 2).toFixed(1));
      }
    }
    if (it.sats){
      /* the dots sit on an arc over the top of the blob, clear of the name underneath, and sway a little.
         They hold still while the blob is under the pointer so the names can be read, and fade as the blob
         swells into the next level */
      var ns = it.sats.length, dr = dotR(), orbit = rr * 1.3 + dr + 6;
      var step = Math.min(.62, 3.3 / Math.max(1, ns));
      if (!it.hover) it.sway += (t - (it.lt || t));
      it.lt = t;
      var lean = Math.sin(it.sway * .5 + it.seed) * .09;
      for (var q = 0; q < ns; q++){
        var ang = -Math.PI / 2 + (q - (ns - 1) / 2) * step + lean, cs = Math.cos(ang), sn = Math.sin(ang);
        var sx = cx + cs * orbit, sy2 = cy + sn * orbit, sat = it.sats[q];
        sat.c.setAttribute('cx', sx.toFixed(1)); sat.c.setAttribute('cy', sy2.toFixed(1)); sat.c.setAttribute('r', dr.toFixed(1));
        /* names fan outward; the ones near the top sit a line higher so neighbors do not run into each other */
        var out = dr + 7 + (Math.abs(cs) < .3 ? 13 : 0);
        sat.t.setAttribute('x', (sx + cs * out).toFixed(1)); sat.t.setAttribute('y', (sy2 + sn * out + 4).toFixed(1));
        sat.t.setAttribute('text-anchor', cs > .3 ? 'start' : (cs < -.3 ? 'end' : 'middle'));
      }
      it.sats.g.style.opacity = clamp(2.2 - rr / it.r0 * 1.2, 0, 1);
    }
    it.g.style.opacity = it.o * arrO;
    var fs, ly, sy;
    if (it.isHub){
      fs = arriving ? rr * .3 : clamp(rr * .3, 16, 260);
      ly = cy + fs * .35 - (it.lines - 1) * fs * .55;
      sy = cy + rr * .45;
      it.sub.style.opacity = arriving ? clamp((arrK - .55) / .25, 0, 1) : (rr > 240 ? 0 : 1);
    } else {
      fs = clamp(M * .026, 14, 20);
      ly = cy + rr + fs + 6;
      sy = ly + fs * 1.1 * (it.lines - 1) + 18;
    }
    it.lbl.setAttribute('font-size', fs.toFixed(1));
    it.lbl.setAttribute('y', ly.toFixed(1));
    it.spans.forEach(function(s){ s.setAttribute('x', cx.toFixed(1)); });
    it.sub.setAttribute('x', cx.toFixed(1)); it.sub.setAttribute('y', sy.toFixed(1));
    if (it.gap){
      /* measure the words once per size (and again if the font arrives late), then keep the gap under them */
      if (it.twFs !== fs){ var bw = it.lbl.getBBox().width; if (bw > 0){ it.tw = Math.max(bw, it.sub.getBBox().width); it.twFs = fs; } }
      var gw = (it.tw || rr * 2) + 14, top = ly - fs;
      it.gap.setAttribute('x', (cx - gw / 2).toFixed(1)); it.gap.setAttribute('y', top.toFixed(1));
      it.gap.setAttribute('width', gw.toFixed(1)); it.gap.setAttribute('height', (sy + 7 - top).toFixed(1));
      it.gap.setAttribute('fill-opacity', it.o);
    }
    it.cx = cx; it.cy = cy; it.rr = rr;
  }
  function drawLink(l, t){
    var a = l.a, b = l.b; if (a.cx === undefined || b.cx === undefined) return;
    l.p.setAttribute('d', curvePath(a.cx, a.cy, b.cx, b.cy, 22 * Math.sin(t * .8 + l.k * 1.7)));
    l.p.style.opacity = Math.min(a.o, b.o) * (arr < 1 ? clamp(arr / .12, 0, 1) : 1);
    if (arr < 1) l.p.style.strokeWidth = (2.5 * Math.max(.3, arrBase(arr))).toFixed(2) + 'px';
  }
  function frame(now){
    var t = reduce ? 0 : now / 1000;
    if (done || o.mapShowing()){
      if (arr < 1 || !arrSettled) applyArrival();
      view.items.forEach(function(it){ drawItem(it, t); });
      dying.forEach(function(x){ if (x.g) drawItem(x, t); });
      view.links.forEach(function(l){ drawLink(l, t); });
      dying.forEach(function(x){ if (x.p) drawLink(x, t); });
      drawCurio(t);
      if (mouse && !reduce && arr >= 1) bgNet.setAttribute('transform', 'translate(' + ((W / 2 - mouse.x) * .015).toFixed(1) + ' ' + ((H / 2 - mouse.y) * .015).toFixed(1) + ')');
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
    /* the scatter changes with the screen, so which nodes are nearest changes too: redraw the lines to match */
    view.links.forEach(function(l){ if (l.p.parentNode) l.p.parentNode.removeChild(l.p); });
    view.links = makeLinks(node, view.items);
    setChrome(node);
  }
  function onResize(){ if (!busy()) relayout(); }

  function init(){
    measure(); drawBg();
    view = buildView(ROOT);
    setChrome(ROOT);
    svg.addEventListener('pointermove', onSvgMove);
    svg.addEventListener('pointerleave', onSvgLeave);
    window.addEventListener('pointermove', onWinMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', onResize);
    /* labels are measured for their gaps; measure again once the display font has loaded */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ view.items.forEach(function(it){ it.twFs = 0; }); });
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
    /* 0 to 1: how far the map has come together (see "arrival" above). The intro drives this; it rests at 1 */
    setArrival: function(p){ arr = clamp(p, 0, 1); if (arr < 1) arrSettled = false; },
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
export default function BrainMap({ stack, done, reduce, busyRef, modeRef, sceneRef, mapLayerRef, mapShowing, onDive, onOpenPage, onSticker }){
  var svgRef = useRef(null), nodesRef = useRef(null), linksRef = useRef(null), bgRef = useRef(null), wmRef = useRef(null);
  var curioRef = useRef(null), curioLinksRef = useRef(null), legendRef = useRef(null), pickRef = useRef(null);
  var maskRef = useRef(null), maskAllRef = useRef(null);
  var cb = useRef(null);
  cb.current = { onDive:onDive, onOpenPage:onOpenPage, onSticker:onSticker, mapShowing:mapShowing };

  useLayoutEffect(function(){
    var scene = createScene({
      svg:svgRef.current, nodesG:nodesRef.current, linksG:linksRef.current, bgNet:bgRef.current, wm:wmRef.current,
      curioG:curioRef.current, curioLinksG:curioLinksRef.current, legend:legendRef.current, pickHint:pickRef.current,
      mapLayer:mapLayerRef.current, reduce:reduce, busyRef:busyRef,
      linkMask:maskRef.current, linkMaskAll:maskAllRef.current,
      mapShowing:function(){ return cb.current.mapShowing(); },
      onDive:function(n, it){ cb.current.onDive(n, it); },
      onOpenPage:function(n, seq){ cb.current.onOpenPage(n, seq); },
      onSticker:function(go){ cb.current.onSticker(go); }
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
      <svg id="mapSvg" ref={svgRef} aria-label="Brain map. Choose Work, Teach, or Build to go deeper.">
        <defs>
          {/* white shows the connection lines, black hides them: one black patch per label, added by the engine */}
          <mask id="linkMask" ref={maskRef} maskUnits="userSpaceOnUse">
            <rect ref={maskAllRef} fill="white" />
          </mask>
          {/* takes the color out of a picture: the gray copy that sits over each picture blob until it is hovered */}
          <filter id="mute" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <g id="bgNet" ref={bgRef} aria-hidden="true" />
        <text id="wm" ref={wmRef} textAnchor="middle" dominantBaseline="middle" />
        <g id="curioLinks" ref={curioLinksRef} aria-hidden="true" />
        <g id="curio" ref={curioRef} className="curio" />
        <g id="links" ref={linksRef} mask="url(#linkMask)" filter="url(#boil)" aria-hidden="true" />
        <g id="nodes" ref={nodesRef} />
      </svg>
      <div id="legend" ref={legendRef} hidden><span><b className="fill" />goes deeper</span><span><b className="open" />opens a page</span></div>
      <div id="pickHint" ref={pickRef}>Pick one</div>
    </div>
  );
}
