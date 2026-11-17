import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* The picture viewer: one of a page's pictures shown whole, full screen, on a dark ground.

     pics:    [{ src, caption }] every picture on the page, the large one first
     index:   which one is showing
     onIndex: called with a new index (arrows, swipes)
     onClose: called to close (Escape, the close button, a press outside the picture)

   Getting closer: pinch on a touch screen, double-tap, click, the mouse wheel, the Zoom
   button, or the + and - keys. Drag to move around once zoomed in.

   The zoom and position are plain numbers written straight to the image's style,
   not React state, so a pinch or a drag never re-renders anything. The only state
   is whether the picture is zoomed at all, for the button's label. */

var MAX = 5;      /* how many times bigger the picture can get */
var STEP = 2.5;   /* how far one click, double-tap, or press of the Zoom button goes */
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

export default function PictureViewer({ pics, index, onIndex, onClose, reduce }){
  var rootRef = useRef(null), stageRef = useRef(null), imgRef = useRef(null), closeRef = useRef(null);
  var z = useRef({ s:1, x:0, y:0 });
  var ptrs = useRef({}), gest = useRef(null), last = useRef({ moved:false, onImg:false, x:0, y:0, touch:false }), tapAt = useRef(0);
  var [zoomed, setZoomed] = useState(false);
  var n = pics.length, pic = pics[index];
  var latest = useRef(null);
  latest.current = { n:n, index:index, onIndex:onIndex, onClose:onClose };

  /* write the zoom to the image; `ease` glides there instead of jumping */
  function apply(ease){
    var img = imgRef.current, v = z.current;
    if (!img) return;
    img.style.transition = ease && !reduce ? 'transform .22s ease' : 'none';
    img.style.transform = 'translate(' + v.x.toFixed(1) + 'px,' + v.y.toFixed(1) + 'px) scale(' + v.s.toFixed(3) + ')';
    setZoomed(v.s > 1.01);
  }
  /* keep a zoomed picture from being dragged off the screen */
  function hold(){
    var img = imgRef.current, st = stageRef.current, v = z.current;
    var mx = Math.max(0, (img.offsetWidth * v.s - st.clientWidth) / 2), my = Math.max(0, (img.offsetHeight * v.s - st.clientHeight) / 2);
    v.x = clamp(v.x, -mx, mx); v.y = clamp(v.y, -my, my);
  }
  /* a screen point, measured from the middle of the stage */
  function fromCenter(cx, cy){
    var r = stageRef.current.getBoundingClientRect();
    return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
  }
  /* zoom to scale s, keeping the spot under p (measured from the middle) where it is */
  function zoomTo(s, p, ease){
    var v = z.current, c = { x:(p.x - v.x) / v.s, y:(p.y - v.y) / v.s };
    v.s = clamp(s, 1, MAX);
    if (v.s <= 1.01){ v.s = 1; v.x = 0; v.y = 0; }
    else { v.x = p.x - c.x * v.s; v.y = p.y - c.y * v.s; hold(); }
    apply(ease);
  }
  function toggleZoom(p){ zoomTo(z.current.s > 1.01 ? 1 : STEP, p || { x:0, y:0 }, true); }
  function go(d){
    var L = latest.current;
    if (L.n > 1) L.onIndex((L.index + d + L.n) % L.n);
  }

  /* a new picture starts whole and centered */
  useLayoutEffect(function(){
    z.current = { s:1, x:0, y:0 };
    apply(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  /* focus moves into the viewer when it opens */
  useEffect(function(){ closeRef.current.focus({ preventScroll:true }); }, []);

  /* keys. This listens ahead of the brain's own Escape handler, so Escape closes the viewer and nothing else */
  useEffect(function(){
    function onKey(e){
      var root = rootRef.current;
      if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); latest.current.onClose(); return; }
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(1); return; }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); return; }
      if (e.key === '+' || e.key === '='){ e.preventDefault(); zoomTo(z.current.s * 1.5, { x:0, y:0 }, true); return; }
      if (e.key === '-' || e.key === '_'){ e.preventDefault(); zoomTo(z.current.s / 1.5, { x:0, y:0 }, true); return; }
      if (e.key === '0'){ e.preventDefault(); zoomTo(1, { x:0, y:0 }, true); return; }
      if (e.key === 'Tab'){
        /* Tab stays inside the viewer while it is open */
        var f = root.querySelectorAll('button'), first = f[0], end = f[f.length - 1], a = document.activeElement;
        if (!root.contains(a)){ e.preventDefault(); first.focus(); }
        else if (e.shiftKey && a === first){ e.preventDefault(); end.focus(); }
        else if (!e.shiftKey && a === end){ e.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener('keydown', onKey, true);
    return function(){ window.removeEventListener('keydown', onKey, true); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* the mouse wheel zooms toward the pointer. Added by hand so it can stop the page behind from scrolling */
  useEffect(function(){
    var st = stageRef.current;
    function onWheel(e){
      e.preventDefault();
      zoomTo(z.current.s * Math.exp(-e.deltaY * .0022), fromCenter(e.clientX, e.clientY), false);
    }
    st.addEventListener('wheel', onWheel, { passive:false });
    return function(){ st.removeEventListener('wheel', onWheel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- fingers and the mouse: one pointer drags or swipes, two pinch ---- */
  function two(){
    var ids = Object.keys(ptrs.current), a = ptrs.current[ids[0]], b = ptrs.current[ids[1]];
    return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, m: fromCenter((a.x + b.x) / 2, (a.y + b.y) / 2) };
  }
  function startOne(e, moved){
    gest.current = { kind:'one', x0:e.clientX, y0:e.clientY, t0:{ x:z.current.x, y:z.current.y }, dx:0, dy:0 };
    last.current = { moved:!!moved, onImg:e.target === imgRef.current, x:e.clientX, y:e.clientY, touch:e.pointerType !== 'mouse' };
  }
  function onDown(e){
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try { stageRef.current.setPointerCapture(e.pointerId); } catch (err) { /* the pointer is already gone */ }
    ptrs.current[e.pointerId] = { x:e.clientX, y:e.clientY };
    var count = Object.keys(ptrs.current).length;
    if (count === 1) startOne(e, false);
    else if (count === 2){
      var t = two();
      gest.current = { kind:'pinch', d0:t.d, s0:z.current.s, c:{ x:(t.m.x - z.current.x) / z.current.s, y:(t.m.y - z.current.y) / z.current.s } };
      last.current.moved = true; /* a pinch is never a tap */
    }
  }
  function onMove(e){
    var p = ptrs.current[e.pointerId], g = gest.current, v = z.current;
    if (!p || !g) return;
    p.x = e.clientX; p.y = e.clientY;
    if (g.kind === 'pinch'){
      if (Object.keys(ptrs.current).length < 2) return;
      var t = two();
      v.s = clamp(g.s0 * t.d / g.d0, 1, MAX);
      v.x = t.m.x - g.c.x * v.s; v.y = t.m.y - g.c.y * v.s;
      hold(); apply(false);
      return;
    }
    g.dx = e.clientX - g.x0; g.dy = e.clientY - g.y0;
    if (Math.hypot(g.dx, g.dy) > 8) last.current.moved = true;
    if (!last.current.moved) return;
    if (v.s > 1.01){ v.x = g.t0.x + g.dx; v.y = g.t0.y + g.dy; hold(); apply(false); }
    else if (latest.current.n > 1){ v.x = g.dx; apply(false); } /* the picture follows a sideways swipe */
  }
  function onUp(e){
    var g = gest.current, v = z.current;
    if (!ptrs.current[e.pointerId]) return;
    delete ptrs.current[e.pointerId];
    var left = Object.keys(ptrs.current);
    if (!g) return;
    if (g.kind === 'pinch'){
      if (v.s <= 1.05) zoomTo(1, { x:0, y:0 }, true);
      /* one finger still down carries on as a drag, not a tap */
      if (left.length === 1){ var q = ptrs.current[left[0]]; startOne({ clientX:q.x, clientY:q.y, target:null, pointerType:'touch' }, true); }
      else gest.current = null;
      return;
    }
    gest.current = null;
    if (!last.current.moved || v.s > 1.01) return;
    /* a swipe: far enough sideways changes the picture, anything less springs back */
    var far = Math.abs(g.dx) > 56 && Math.abs(g.dx) > Math.abs(g.dy) * 1.2;
    v.x = 0;
    if (far && latest.current.n > 1){ apply(false); go(g.dx < 0 ? 1 : -1); }
    else apply(true);
  }
  /* a press that did not move. Outside the picture it closes; on the picture a click, or a double-tap, zooms */
  function onClick(e){
    var L = last.current;
    if (L.moved) return;
    if (!L.onImg){ onClose(); return; }
    var p = fromCenter(L.x, L.y);
    if (!L.touch){ toggleZoom(p); return; }
    var now = Date.now();
    if (now - tapAt.current < 340){ tapAt.current = 0; toggleZoom(p); } else tapAt.current = now;
  }

  return (
    <div id="viewer" ref={rootRef} className={zoomed ? 'zoomed' : undefined} role="dialog" aria-modal="true" aria-label={'Picture viewer' + (n > 1 ? ', ' + n + ' pictures' : '')}>
      <div className="viewer-top">
        <button type="button" className="chip-btn icon" aria-label={zoomed ? 'Zoom out' : 'Zoom in'} aria-pressed={zoomed} onClick={function(){ toggleZoom(); }}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21M7.5 10.5h6" />{!zoomed && <path d="M10.5 7.5v6" />}
          </svg>
        </button>
        <button type="button" className="chip-btn" ref={closeRef} onClick={onClose}>Close</button>
      </div>
      <div className="viewer-stage" ref={stageRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClick={onClick}>
        <img key={pic.src} ref={imgRef} src={pic.src} alt={pic.caption} draggable={false} />
      </div>
      <div className="viewer-bar">
        {n > 1 && <button type="button" className="chip-btn icon" aria-label="Previous picture" onClick={function(){ go(-1); }}>←</button>}
        <p aria-live="polite">
          <span>{pic.caption}</span>
          {n > 1 && <span className="count">{(index + 1) + ' / ' + n}</span>}
        </p>
        {n > 1 && <button type="button" className="chip-btn icon" aria-label="Next picture" onClick={function(){ go(1); }}>→</button>}
      </div>
    </div>
  );
}
