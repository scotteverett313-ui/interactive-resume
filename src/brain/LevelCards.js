import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PH_LEDE } from './content';
import { thumbOf, fullOnError } from './gallery';

/* A level shown as a row of large cards that slide sideways, instead of blobs on the map.
   A level gets this by carrying view:'cards' in content.js; it suits a level that holds only pages.

     node:    the level
     onOpen:  called with a page's node when its card is pressed

   The row scrolls on its own (swipe, trackpad, or the two arrow buttons) and snaps card by card.
   Each card is a real button. Where the row starts is measured from the breadcrumbs above it, so the
   level's line and a wrapped trail both get the room they need. */

/* Text in [brackets] is a placeholder: dashed-underlined, so it is obvious what is still blank. */
function Ph({ text }){
  return (
    <>
      {String(text).split(/(\[[^\]]*\])/).map(function(s, i){
        return /^\[.*\]$/.test(s) ? <span className="ph" key={i}>{s}</span> : s;
      })}
    </>
  );
}
/* a page's picture for its card: its lead picture, or its case study's hero */
function leadOf(n){
  var p = n.page || {}, hero = p.study && p.study.hero && p.study.hero.src;
  return p.image || hero || null;
}
/* a page's one line: its own, or its case study's */
function lineOf(n){
  var p = n.page || {};
  return p.lede || (p.study && p.study.sub) || PH_LEDE;
}

export default function LevelCards({ node, onOpen }){
  var railRef = useRef(null);
  var [top, setTop] = useState(96);
  var [ends, setEnds] = useState({ start:true, end:false });
  var pages = (node.kids || []).filter(function(k){ return !(k.kids && k.kids.length) && !k.go; });

  /* start just under the breadcrumbs, however tall they are on this screen */
  useLayoutEffect(function(){
    function measure(){
      var stage = railRef.current && railRef.current.closest('.stage'), crumbs = stage && stage.querySelector('#crumbs');
      if (!crumbs) return;
      var c = crumbs.getBoundingClientRect(), s = stage.getBoundingClientRect();
      if (c.height) setTop(Math.round(c.bottom - s.top + 14));
    }
    measure();
    window.addEventListener('resize', measure);
    return function(){ window.removeEventListener('resize', measure); };
  }, [node]);

  /* the arrow buttons know when the row is at either end */
  function check(){
    var r = railRef.current; if (!r) return;
    setEnds({ start:r.scrollLeft < 8, end:r.scrollLeft > r.scrollWidth - r.clientWidth - 8 });
  }
  useEffect(function(){ if (railRef.current) railRef.current.scrollLeft = 0; check(); }, [node]);
  function step(dir){
    var r = railRef.current, card = r && r.querySelector('li');
    if (!card) return;
    r.scrollBy({ left:dir * (card.getBoundingClientRect().width + 16), behavior:'smooth' });
  }

  return (
    <nav id="levelCards" className={'in-' + node.hub.id} style={{ top:top }} aria-label={node.label + ', ' + pages.length + ' pages'}>
      <ul ref={railRef} onScroll={check}>
        {pages.map(function(k, i){
          var src = leadOf(k), tags = (k.page && k.page.tags) || [];
          return (
            <li key={k.id}>
              <button type="button" className="card" onClick={function(){ onOpen(k); }} aria-label={k.label + ', open page, ' + (i + 1) + ' of ' + pages.length}>
                <span className={'pic' + (src ? '' : ' none')}>
                  {src && <img src={thumbOf(src)} onError={fullOnError(src)} alt="" loading="lazy" />}
                </span>
                <span className="words">
                  <span className="count">{(i + 1) + ' / ' + pages.length}</span>
                  <b>{k.label}</b>
                  <span className="line"><Ph text={lineOf(k)} /></span>
                  {tags.length > 0 && <span className="card-tags">{tags.map(function(t){ return <i key={t}>{t}</i>; })}</span>}
                  <span className="go" aria-hidden="true">Open →</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="rail-arrows">
        <button type="button" className="chip-btn icon" aria-label="Previous cards" disabled={ends.start} onClick={function(){ step(-1); }}>←</button>
        <button type="button" className="chip-btn icon" aria-label="More cards" disabled={ends.end} onClick={function(){ step(1); }}>→</button>
      </div>
    </nav>
  );
}
