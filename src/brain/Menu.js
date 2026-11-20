import React, { useEffect, useRef, useState } from 'react';
import { STATUS } from './studio';

/* The one menu: a single button in the top-right corner of the opening screen and the map, in place of the
   row of buttons that used to sit along the bottom. Pressing it drops a small card with every way out:

     the "Open for work" status (studio.js)
     Just the work, Work with me, Gallery, Notes
     Skip intro while the intro is on screen, Replay intro after it
     light or dark mode

   It closes on Escape (ahead of the brain's own Escape, so nothing else moves), on a press outside it, on any
   choice except the light and dark switch, and whenever the address changes. Focus goes into the card when it
   opens and back to the button when it closes with Escape.

     done:   whether the intro is over (Skip intro, or Replay intro)
     mode:   'light' or 'dark'
     path:   the current address; the card closes when it changes
     hidden: true while a page is open over the map (the page has its own way back) */

var ICONS = {
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>
};
function Icon({ name }){
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

export default function Menu({ done, mode, path, hidden, onIndex, onStudio, onGallery, onNotes, onSkip, onReplay, onToggleTheme }){
  var [open, setOpen] = useState(false);
  var wrapRef = useRef(null), btnRef = useRef(null), cardRef = useRef(null);

  /* a new address (a choice made, Back, Forward) or a page opening closes it */
  useEffect(function(){ setOpen(false); }, [path, hidden]);

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
  var next = mode === 'dark' ? 'light' : 'dark';
  var ways = [
    { id:'menuWork', label:'Just the work', fn:onIndex },
    { id:'menuStudio', label:'Work with me', fn:onStudio },
    { id:'menuGallery', label:'Gallery', fn:onGallery },
    { id:'menuNotes', label:'Notes', fn:onNotes }
  ];

  return (
    <div id="menu" ref={wrapRef} hidden={hidden} className={open ? 'open' : undefined}>
      <button id="menuBtn" ref={btnRef} className="chip-btn" type="button" aria-expanded={open} aria-controls="menuCard"
        onClick={function(){ setOpen(!open); }}>
        <Icon name={open ? 'close' : 'menu'} />{open ? 'Close' : 'Menu'}
      </button>
      {open && (
        <nav id="menuCard" ref={cardRef} aria-label="Menu">
          {STATUS.open && <p className="m-status"><i className="open-dot" aria-hidden="true" />{STATUS.label}</p>}
          <ul className="m-ways">
            {ways.map(function(w){
              return <li key={w.id}><button id={w.id} type="button" onClick={pick(w.fn)}>{w.label}<span aria-hidden="true">→</span></button></li>;
            })}
          </ul>
          <div className="m-foot">
            {done
              ? <button id="menuReplay" className="chip-btn" type="button" onClick={pick(onReplay)}>Replay intro</button>
              : <button id="menuSkip" className="chip-btn" type="button" onClick={pick(onSkip)}>Skip intro</button>}
            {/* the light and dark switch keeps the card open, so the change can be seen and undone */}
            <button id="menuTheme" className="chip-btn" type="button" onClick={onToggleTheme} aria-label={'Switch to ' + next + ' mode'}>
              <Icon name={next === 'dark' ? 'moon' : 'sun'} />{next === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
