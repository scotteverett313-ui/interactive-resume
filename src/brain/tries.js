/* ============================================================
   Trial switches: ideas Scott is choosing between, each one off
   until switched on. Nothing here changes the site for anyone
   who has not asked for a trial.

   Turn ideas on with the address:  /?try=a1   or  /?try=a1,b1
   That also shows the small "Trials" panel (bottom left), where
   each idea can be switched on and off. /?try=off turns them all
   off and hides the panel. The choice is kept in this browser
   (localStorage), so it survives moving around the site.

   When Scott has picked, the switches for dropped ideas come out
   and the kept ones become the site.
   ============================================================ */

/* the ideas that are built so far, in the order they are offered */
export const TRIES = [
  { id:'a1', name:'A1 · Name list', note:'Work opens as a list of names on its own color', group:'layout' },
  { id:'a2', name:'A2 · Card stack', note:'Work opens as one big card per project; swipe or scroll to the next', group:'layout' },
  { id:'a3', name:'A3 · Labelled blobs', note:'Work keeps its blobs, each with a bigger name and a line on a paper tag', group:'layout' }
];

var KEY = 'brain-try', PANEL = 'brain-try-panel';

function store(get, k, v){
  try { if (get) return window.localStorage.getItem(k); if (v === null) window.localStorage.removeItem(k); else window.localStorage.setItem(k, v); }
  catch (e) { /* storage blocked: trials last for this page only */ }
  return null;
}

/* the switches as they stand: read the address once, then the browser's memory */
export function readTries(){
  var on = {}, saved = store(true, KEY);
  (saved ? saved.split(',') : []).forEach(function(id){ if (id) on[id] = true; });
  var panel = store(true, PANEL) === '1';
  try {
    var q = new URLSearchParams(window.location.search).get('try');
    if (q === 'off'){ on = {}; panel = false; store(false, KEY, null); store(false, PANEL, null); }
    else if (q !== null){
      q.split(',').forEach(function(id){
        id = id.trim().toLowerCase();
        var me = TRIES.filter(function(t){ return t.id === id; })[0]; if (!me) return;
        /* the layouts are alternatives: the last one named wins */
        if (me.group) TRIES.forEach(function(t){ if (t.group === me.group) delete on[t.id]; });
        on[id] = true;
      });
      panel = true; store(false, PANEL, '1'); store(false, KEY, Object.keys(on).join(','));
    }
  } catch (e) { /* no address to read */ }
  return { on:on, panel:panel };
}

export function saveTries(on){ store(false, KEY, Object.keys(on).filter(function(k){ return on[k]; }).join(',')); }
export function hidePanel(){ store(false, PANEL, null); }
