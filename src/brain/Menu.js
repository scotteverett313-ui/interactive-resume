import React, { useEffect, useRef, useState } from 'react';
import { NOTES } from './notes';
import { NOTES_PARKED } from './routes';

/* The menu: a single button in the top-right corner of the opening screen and the map. Pressing it opens a
   small card with every way out:

     Work (Just the work), About, Gallery, Contact (Work with me), and Notes once notes.js holds three posts
     Skip intro while the intro is on screen, Replay intro after it

   On the opening screen the card takes the speech bubble's place: the character says the menu, and "What up
   doe." comes back when it closes. Everywhere else it drops down under the button.

   It closes on Escape (ahead of the brain's own Escape, so nothing else moves), on a press outside it, on any
   choice, when the address changes, and on the opening screen as soon as scrolling starts. Focus goes into the
   card when it opens and back to the button when it closes with Escape.

     done:     whether the intro is over (Skip intro, or Replay intro)
     path:     the current address; the card closes when it changes
     hidden:   true while a page is open over the map (the page has its own way back)
     onOpen:   told whether the card is open, so the speech bubble can step aside */

var ICONS = {
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />
};
function Icon({ name }){
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

export default function Menu({ done, path, hidden, onIndex, onAbout, onStudio, onGallery, onNotes, onSkip, onReplay, onOpen }){
  var [open, setOpen] = useState(false);
  var wrapRef = useRef(null), btnRef = useRef(null), cardRef = useRef(null);
  /* on the opening screen the card is the speech bubble */
  var bubble = !done;

  /* a new address (a choice made, Back, Forward), a page opening, or the intro ending closes it */
  useEffect(function(){ setOpen(false); }, [path, hidden, done]);
  useEffect(function(){ if (onOpen) onOpen(open && bubble); }, [open, bubble, onOpen]);
  /* the speech bubble belongs to the opening screen: the moment the intro starts to scroll, it closes */
  useEffect(function(){
    if (!open || !bubble) return undefined;
    function onScroll(){ if (window.scrollY > 12) setOpen(false); }
    window.addEventListener('scroll', onScroll, { passive:true });
    return function(){ window.removeEventListener('scroll', onScroll); };
  }, [open, bubble]);

  useEffect(function(){
    if (!open) return undefined;
    var first = cardRef.current && cardRef.current.querySelector('button');
    if (first) first.focus({ preventScroll:true });
    function onKey(e){
      if (e.key !== 'Escape') return;
      e.preventDefault(); e.stopPropagation();
      setOpen(false);
      if (btnRef.current) btnRef.current.focus({ preventScroll:true });
    }
    function onDown(e){ if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    /* tabbing out past the last choice closes it too */
    function onFocus(e){ if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('focusin', onFocus);
    return function(){
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onDown, true);
      document.removeEventListener('focusin', onFocus);
    };
  }, [open]);

  function pick(fn){ return function(){ setOpen(false); fn(); }; }
  var ways = [
    { id:'menuWork', label:'Work', fn:onIndex },
    { id:'menuAbout', label:'About', fn:onAbout },
    { id:'menuGallery', label:'Gallery', fn:onGallery },
    { id:'menuStudio', label:'Contact', fn:onStudio }
  ];
  /* Notes waits until there are three posts to read */
  if (!NOTES_PARKED && NOTES.length >= 3) ways.push({ id:'menuNotes', label:'Notes', fn:onNotes });

  return (
    <div id="menu" ref={wrapRef} hidden={hidden} className={open ? 'open' : undefined}>
      <button id="menuBtn" ref={btnRef} className="chip-btn" type="button" aria-expanded={open} aria-controls="menuCard"
        onClick={function(){ setOpen(!open); }}>
        <Icon name={open ? 'close' : 'menu'} />{open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <nav id="menuCard" ref={cardRef} aria-label="Menu" className={bubble ? 'as-bubble' : undefined}>
          <ul className="m-ways">
            {ways.map(function(w){
              return <li key={w.id}><button id={w.id} type="button" onClick={pick(w.fn)}>{w.label}<span aria-hidden="true">→</span></button></li>;
            })}
          </ul>
          <div className="m-foot">
            {done
              ? <button id="menuReplay" className="chip-btn" type="button" onClick={pick(onReplay)}>Replay intro</button>
              : <button id="menuSkip" className="chip-btn" type="button" onClick={pick(onSkip)}>Skip intro</button>}
          </div>
          {/* as the speech bubble, it keeps the bubble's tail, pointing down at the character */}
          {bubble && (
            <svg className="tail" viewBox="0 0 46 40" width="46" height="40" aria-hidden="true">
              <path className="tail-shade" d="M7 7.5 L45 44 L33 7.5 Z" />
              <path className="tail-fill" d="M2 -0.5 L2 1.5 L40 38 L28 1.5 L28 -0.5 Z" />
              <path className="tail-line" d="M2 1.5 L40 38 L28 1.5" />
            </svg>
          )}
        </nav>
      )}
    </div>
  );
}
