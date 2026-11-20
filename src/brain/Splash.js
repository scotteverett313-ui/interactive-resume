import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TITLES } from './content';

/* The splash: Scott's name and title, full screen, before the character. The words are TITLES.splash in
   content.js.

   The name rises in letter by letter, the title follows, three dots in the Work, Teach and Build colors pop
   in, it holds a moment, then the whole card slides up and away to reveal the character, whose speech bubble
   and stickers only then make their entrance.

   It shows on the first visit in a browser session, at the front door only (a link to anywhere else lands
   straight there, and counts as the visit), and never with reduced motion. Adding ?splash=1 to the address shows it again; ?splash=0
   skips it. A press, a key, a scroll or a swipe skips straight to the slide away.

     onDone: called once the card is gone

   The words are read once by screen readers as the site's name; the card itself is decoration. */

var KEY = 'brain-splash-seen';

/* whether to show it on this load: the front door, motion allowed, and not yet this session (or asked for) */
export function wantSplash(home, reduce){
  try {
    /* arriving anywhere but the front door counts as having been introduced */
    if (!home) { window.sessionStorage.setItem(KEY, '1'); return false; }
    if (reduce) return false;
    var q = new URLSearchParams(window.location.search).get('splash');
    if (q === '1') return true;
    if (q === '0') return false;
    if (window.sessionStorage.getItem(KEY)) return false;
  } catch (e) { /* storage blocked: show it at the front door, it is short */ }
  return home && !reduce;
}

export default function Splash({ onDone }){
  var rootRef = useRef(null), tlRef = useRef(null);
  var onDoneRef = useRef(onDone); onDoneRef.current = onDone;
  var words = TITLES.splash || { title:'', sub:'' };
  var lines = words.title.split(' ');

  useLayoutEffect(function(){
    try { window.sessionStorage.setItem(KEY, '1'); } catch (e) { /* not remembered, shows again next time */ }
    var root = rootRef.current, q = function(s){ return root.querySelectorAll(s); };
    var tl = gsap.timeline({ onComplete:function(){ onDoneRef.current(); } });
    tl.fromTo(q('.ch'), { yPercent:115, rotate:6 }, { yPercent:0, rotate:0, duration:.7, ease:'power3.out', stagger:.035, clearProps:'transform' }, .15)
      .fromTo(q('.sp-title'), { autoAlpha:0, letterSpacing:'.5em' }, { autoAlpha:1, letterSpacing:'.14em', duration:.8, ease:'power2.out' }, .55)
      .fromTo(q('.sp-dots i'), { scale:0 }, { scale:1, duration:.45, ease:'back.out(2.4)', stagger:.09 }, .8)
      .addLabel('leave', 2.1)
      .to(root, { yPercent:-100, duration:.75, ease:'power3.inOut' }, 'leave');
    tlRef.current = tl;
    return function(){ tl.kill(); };
  }, []);

  /* any press, key, scroll or swipe skips ahead to the slide away */
  useEffect(function(){
    function skip(){
      var tl = tlRef.current;
      if (tl && tl.time() < tl.labels.leave) tl.seek('leave');
    }
    var opts = { passive:true };
    window.addEventListener('pointerdown', skip, opts);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, opts);
    window.addEventListener('touchmove', skip, opts);
    return function(){
      window.removeEventListener('pointerdown', skip, opts);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip, opts);
      window.removeEventListener('touchmove', skip, opts);
    };
  }, []);

  return (
    <div id="splash" ref={rootRef} aria-hidden="true">
      <div className="sp-in">
        <p className="sp-name">
          {lines.map(function(w, i){
            return (
              <span className="sp-line" key={i}>
                {w.split('').map(function(c, j){ return <span className="ch" key={j}>{c}</span>; })}
              </span>
            );
          })}
        </p>
        <p className="sp-title">{words.sub}</p>
        <p className="sp-dots"><i className="d-work" /><i className="d-teach" /><i className="d-build" /></p>
      </div>
    </div>
  );
}
