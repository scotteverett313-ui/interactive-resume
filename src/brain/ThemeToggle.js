import React from 'react';

/* ============================================================
   Light and dark mode.

   The brain has two modes, each one a palette in palettes.js.
   A visitor starts in whichever their device is set to. The
   round button in the bottom-right corner changes modes and
   remembers the choice in this browser;
   until they use it, the site keeps following the device, even
   if that changes while the page is open.

   Adding ?theme=light or ?theme=dark to the address opens that
   mode for one visit without changing what is remembered.
   ============================================================ */

var KEY = 'brain-theme';

/* the visitor's own choice, or null if they have not made one */
export function readThemeChoice(){
  try {
    var q = new URLSearchParams(window.location.search).get('theme');
    if (q === 'light' || q === 'dark') return q;
    var saved = window.localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) { /* private mode or blocked storage: follow the device */ }
  return null;
}
export function saveThemeChoice(mode){
  try { window.localStorage.setItem(KEY, mode); } catch (e) { /* not saved, still switches for this visit */ }
}

/* the round button in the bottom-right corner shows where a press will take you: a moon in light mode, a sun in dark mode */
export default function ThemeToggle({ mode, onToggle }){
  var next = mode === 'dark' ? 'light' : 'dark';
  return (
    <button id="themeToggle" className="chip-btn" type="button" onClick={onToggle}
      aria-label={'Switch to ' + next + ' mode'} title={'Switch to ' + next + ' mode'}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {next === 'dark'
          ? <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
          : <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>}
      </svg>
    </button>
  );
}
