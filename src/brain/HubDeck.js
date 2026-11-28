import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { pagesOf, lineFor } from './HubList';
import { thumbOf, fullOnError } from './gallery';

/* Trial A2, the card stack. On Work's level, one project per big card: its picture, its name and a line, and the
   group it belongs to. The next card peeks in from the side. Swipe on a phone; on a computer the scroll wheel, the
   arrow keys or the two arrow buttons move card by card. Which projects, in which order, is `list` on the gravity
   point in content.js (the same groups as the name list).

   Still versions: on a phone it is a plain sideways swipe with nothing on hover, and with reduced motion the cards
   jump instead of gliding and do not slide in.

     node:    the gravity point (Work)
     reduce:  reduced motion
     onOpen:  open a project's page */

function leadOf(n){
  var p = n.page || {}, hero = p.study && p.study.hero && p.study.hero.src;
  return p.image || hero || null;
}

export default function HubDeck({ node, reduce, onOpen }){
  var railRef = useRef(null), rootRef = useRef(null);
  var [top, setTop] = useState(96), [at, setAt] = useState(0);
  var cards = [];
  (node.list || []).forEach(function(g){ pagesOf(g.items).forEach(function(n){ cards.push({ node:n, group:g.name }); }); });

  /* start just under the breadcrumbs and Scott's line, however tall they are on this screen */
  useLayoutEffect(function(){
    function measure(){
      var stage = rootRef.current && rootRef.current.closest('.stage'), crumbs = stage && stage.querySelector('#crumbs');
      if (!crumbs) return;
      var c = crumbs.getBoundingClientRect(), s = stage.getBoundingClientRect();
      if (c.height) setTop(Math.round(c.bottom - s.top + 12));
    }
    measure();
    window.addEventListener('resize', measure);
    return function(){ window.removeEventListener('resize', measure); };
  }, [node]);

  /* the cards slide in from the right, one after another */
  useLayoutEffect(function(){
    if (reduce || !railRef.current) return undefined;
    var t = gsap.fromTo(railRef.current.children, { x:80, autoAlpha:0 }, { x:0, autoAlpha:1, duration:.5, stagger:.06, ease:'power3.out' });
    return function(){ t.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  function cardW(){ var r = railRef.current, c = r && r.children[0]; return c ? c.getBoundingClientRect().width + 20 : 1; }
  function go(i){
    var r = railRef.current; if (!r) return;
    i = Math.max(0, Math.min(cards.length - 1, i));
    r.scrollTo({ left:i * cardW(), behavior:reduce ? 'auto' : 'smooth' });
  }
  function onScroll(){ var r = railRef.current; if (r) setAt(Math.round(r.scrollLeft / cardW())); }

  /* on a computer: the arrow keys, and the scroll wheel turned sideways, move card by card */
  useEffect(function(){
    var r = railRef.current; if (!r) return undefined;
    var lock = 0;
    function onWheel(e){
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;   /* a sideways swipe on a trackpad scrolls by itself */
      e.preventDefault();
      var now = Date.now(); if (now - lock < 450) return; lock = now;
      go(Math.round(r.scrollLeft / cardW()) + (e.deltaY > 0 ? 1 : -1));
    }
    function onKey(e){
      if (document.querySelector('#page:not([hidden])')) return;
      if (e.key === 'ArrowRight'){ e.preventDefault(); go(Math.round(r.scrollLeft / cardW()) + 1); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); go(Math.round(r.scrollLeft / cardW()) - 1); }
    }
    r.addEventListener('wheel', onWheel, { passive:false });
    window.addEventListener('keydown', onKey);
    return function(){ r.removeEventListener('wheel', onWheel); window.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, cards.length]);

  return (
    <section id="hubDeck" ref={rootRef} className={'in-' + node.id} style={{ top:top }} aria-label={node.label + ', ' + cards.length + ' projects'}>
      <ul ref={railRef} onScroll={onScroll}>
        {cards.map(function(c, i){
          var n = c.node, src = leadOf(n);
          return (
            <li key={n.id}>
              <button type="button" className="hd-card" onClick={function(){ onOpen(n); }} aria-label={n.label + ', ' + c.group + ', open page, ' + (i + 1) + ' of ' + cards.length}>
                <span className={'hd-pic' + (src ? '' : ' none')}>
                  {src && <img src={thumbOf(src)} onError={fullOnError(src)} alt="" loading={i < 2 ? undefined : 'lazy'} />}
                </span>
                <span className="hd-words">
                  <span className="hd-group">{c.group}<i>{(i + 1) + ' / ' + cards.length}</i></span>
                  <b>{n.label}</b>
                  <span className="hd-line">{lineFor(n)}</span>
                  <span className="hd-go" aria-hidden="true">Open →</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="hd-foot">
        <button type="button" className="chip-btn icon" aria-label="Previous project" disabled={at <= 0} onClick={function(){ go(at - 1); }}>←</button>
        <div className="hd-dots" aria-hidden="true">{cards.map(function(c, i){ return <i key={c.node.id} className={i === at ? 'on' : undefined} />; })}</div>
        <button type="button" className="chip-btn icon" aria-label="Next project" disabled={at >= cards.length - 1} onClick={function(){ go(at + 1); }}>→</button>
      </div>
    </section>
  );
}
