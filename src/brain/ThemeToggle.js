/* ============================================================
   Light and dark mode.

   The brain has two modes, each one a palette in palettes.js.
   A visitor starts in whichever their device is set to. The
   switch in the menu (Menu.js) changes modes and remembers the
   choice in this browser;
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
