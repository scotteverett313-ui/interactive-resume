import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROOT, CURIO_ROOT, TITLES, BYID, CURIO_BY_ID, only } from './content';
import Intro from './Intro';
import BrainMap from './BrainMap';
import NodePage from './NodePage';
import DotNav from './DotNav';
import Crumbs from './Crumbs';
import SiteNav from './SiteNav';
import StudioPage from './StudioPage';
import NotesPage from './NotesPage';
import GalleryPage from './GalleryPage';
import { pathFor, parsePath, titleFor, settle, sheetFor, lineOf } from './routes';
import { PALETTES, paletteVars } from './palettes';
import ThemeToggle, { readThemeChoice, saveThemeChoice } from './ThemeToggle';
import './brain.css';

var SITE = "Inside Scott's Brain";
function isHome(v){ return v.stack.length === 1 && !v.pageNode && !v.sheet; }

/* Owns the pieces of state the brain has:
     stack:  nodes from ROOT down to the level on the map
     page:   { node, instant, seq } the open page, or null. seq is the list it was opened from
             (a level's featured previews), which its Next and Previous step through
     sheet:  a full-screen page over the brain: the services page, the notes, or the gallery, or null
     done:   whether the intro has finished
   Those four decide the address in the browser, and the address decides them (see routes.js).
   Everything animated lives in refs and GSAP, not here. */
export default function BrainExperience(){
  var reduce = useMemo(function(){ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  var location = useLocation(), navigate = useNavigate();
  /* where the visitor arrived. Anywhere but the front door lands straight on that place, with no intro to scroll through */
  var arrived = useMemo(function(){ return parsePath(window.location.pathname); }, []);
  var [done, setDone] = useState(reduce || !isHome(arrived)); /* reduced motion skips the intro too */
  var [stack, setStack] = useState(arrived.stack);
  var [page, setPage] = useState({ node:arrived.pageNode, instant:true });
  var [sheet, setSheet] = useState(arrived.sheet);
  /* light or dark: the visitor's own choice if they have made one, otherwise whatever their device is set to */
  var [themeChoice, setThemeChoice] = useState(readThemeChoice);
  var [deviceDark, setDeviceDark] = useState(function(){ return window.matchMedia('(prefers-color-scheme: dark)').matches; });
  useEffect(function(){
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(e){ setDeviceDark(e.matches); }
    if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
    return function(){ if (mq.removeEventListener) mq.removeEventListener('change', onChange); else mq.removeListener(onChange); };
  }, []);
  var mode = themeChoice || (deviceDark ? 'dark' : 'light');
  var palette = PALETTES[mode];
  var vars = useMemo(function(){ return paletteVars(palette); }, [palette]);
  var toggleTheme = useCallback(function(){
    var next = mode === 'dark' ? 'light' : 'dark';
    saveThemeChoice(next);
    setThemeChoice(next);
  }, [mode]);

  var busyRef = useRef(false), modeRef = useRef(null), sceneRef = useRef(null);
  var stageRef = useRef(null), sectionRef = useRef(null), mapLayerRef = useRef(null), dotTagRef = useRef(null), introRef = useRef(null);
  var stackRef = useRef(stack); stackRef.current = stack;
  var pageRef = useRef(page); pageRef.current = page;
  var doneRef = useRef(done); doneRef.current = done;
  var sheetRef = useRef(sheet); sheetRef.current = sheet;

  /* the html-level overrides for this route, and the tab title put back when leaving it */
  useEffect(function(){
    var prev = document.title;
    document.documentElement.classList.add('brain-route');
    return function(){ document.title = prev; document.documentElement.classList.remove('brain-route'); };
  }, []);

  /* ---- addresses: what is on screen and the address bar stay in step, both ways ---- */
  var path = pathFor({ stack:stack, pageNode:page.node, sheet:sheet });
  var pathRef = useRef(path); pathRef.current = path;
  var syncedRef = useRef(false);
  /* something changed on screen: move the address to match. The very first correction replaces the entry,
     so a mistyped address does not sit in the Back history */
  useEffect(function(){
    if (location.pathname !== path) navigate(path, { replace: !syncedRef.current });
    syncedRef.current = true;
    document.title = titleFor({ stack:stack, pageNode:page.node, sheet:sheet }, SITE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  /* the address changed on its own (Back, Forward): show what it points at */
  useEffect(function(){
    if (location.pathname === pathRef.current) return;
    var v = parsePath(location.pathname);
    modeRef.current = { mode:'instant' };
    setStack(v.stack);
    setPage({ node:v.pageNode, instant:true });
    setSheet(v.sheet);
    if (!isHome(v)) setDone(true);
  }, [location.pathname]);

  /* the page behind the brain, the scrollbar, the text selection, and the phone's browser bar sit outside
     the .brain root, so they get the ground and ink colors copied onto <html> while this route is mounted */
  useEffect(function(){
    var root = document.documentElement;
    root.style.setProperty('--ground', palette.ground);
    root.style.setProperty('--ink', palette.ink);
    var meta = document.querySelector('meta[name="theme-color"]');
    var prev = meta ? meta.getAttribute('content') : null;
    if (meta) meta.setAttribute('content', palette.ground);
    return function(){
      root.style.removeProperty('--ground');
      root.style.removeProperty('--ink');
      if (meta && prev !== null) meta.setAttribute('content', prev);
    };
  }, [palette]);

  /* open a node's page. A leaf marked `go` has no page of its own: it opens Work with me, or the gallery */
  var openPage = useCallback(function(node, seq){
    if (node && node.go){ setSheet(sheetFor(node)); return; }
    setPage({ node:node, instant:false, seq:seq || null });
  }, []);
  var closePage = useCallback(function(instant){
    if (!pageRef.current.node) return;
    setPage({ node:null, instant:!!instant });
  }, []);

  /* go back up to a level in the stack (1 = the brain itself) */
  var goTo = useCallback(function(depth){
    if (busyRef.current) return;
    if (pageRef.current.node) closePage();
    var s = stackRef.current;
    if (depth >= s.length) return;
    /* a level with one thing inside is never shown on its own, so going up skips past it */
    while (depth > 1 && only(s[depth - 1])) depth--;
    modeRef.current = { mode:'rise' };
    setStack(s.slice(0, depth));
  }, [closePage]);

  /* a map item was pressed: go one level deeper, diving out of that item */
  var onDive = useCallback(function(node, item){
    modeRef.current = { mode:'dive', fromItem:item };
    /* a level holding a single level carries straight on into it */
    setStack(settle(stackRef.current.concat(node), null).stack);
  }, []);

  /* jump anywhere in the brain from a "Connects to" link: rebuild the path, then land on the page or the level */
  var goToNode = useCallback(function(n){
    if (busyRef.current) return;
    /* a jump into the brain can start while the intro is still on screen (from the Gallery, the notes, or
       Work with me). It ends the intro, so the map is what is behind the page when it closes */
    setDone(true);
    /* an outer-orbit curiosity has no level of its own: its page opens over wherever the map is */
    if (n.curio){ closePage(true); openPage(n); return; }
    var line = lineOf(n);
    if (line[0] !== ROOT) return;
    closePage(true);
    modeRef.current = { mode:'instant' };
    /* single-item levels are passed through on the way, the same as on the map */
    var at = n.kids && n.kids.length ? settle(line, null) : settle(line.slice(0, -1), n);
    setStack(at.stack);
    if (at.go) openPage(at.go); else if (at.pageNode) openPage(at.pageNode);
  }, [closePage, openPage]);

  /* the full-screen pages over the brain */
  var openStudio = useCallback(function(){ setSheet({ type:'studio' }); }, []);
  var openNote = useCallback(function(slug){ setSheet({ type:'notes', slug:slug || null }); }, []);
  var openGallery = useCallback(function(){ setSheet({ type:'gallery', node:null }); }, []);
  var closeSheet = useCallback(function(){ setSheet(null); }, []);
  /* a node page's own button, for example "See partnership levels" */
  var onAction = useCallback(function(action){ if (action && action.go === 'studio') openStudio(); }, [openStudio]);
  /* a note's "Connects to": leave the notes and land in the brain */
  var goToNodeFromSheet = useCallback(function(n){ setSheet(null); goToNode(n); }, [goToNode]);

  /* a sticker on the opening screen was pressed: leave the intro and land where it points */
  var onSticker = useCallback(function(go){
    if (go === 'studio'){ openStudio(); return; }
    if (go === 'notes'){ openNote(null); return; }
    var n = go === CURIO_ROOT.id ? CURIO_ROOT : (BYID[go] || CURIO_BY_ID[go]);
    if (!n || n === ROOT) return;
    setDone(true);
    if (n.curio) openPage(n); else goToNode(n);
  }, [openStudio, openNote, openPage, goToNode]);

  /* from a curiosity page, jump straight into the hub it feeds */
  var diveTo = useCallback(function(id){
    closePage(true);
    if (sceneRef.current) sceneRef.current.activateById(id);
  }, [closePage]);

  /* the scrub reached the end, or Skip was pressed: Intro parks its timeline at 1 when done flips */
  var finishIntro = useCallback(function(){
    if (doneRef.current) return;
    setDone(true);
  }, []);
  /* back to the top of the brain, rewind the intro, and let scroll drive it again */
  var replayIntro = useCallback(function(){
    if (busyRef.current) return;
    closePage(true);
    setSheet(null);
    modeRef.current = { mode:'instant' };
    setStack([ROOT]);
    setDone(false);
  }, [closePage]);
  /* whenever the intro starts or ends, the section height changes; start from the top either way */
  useLayoutEffect(function(){ window.scrollTo(0, 0); }, [done]);

  var onBack = useCallback(function(){
    if (pageRef.current.node) closePage(); else goTo(stackRef.current.length - 1);
  }, [closePage, goTo]);

  /* Escape goes up a level */
  useEffect(function(){
    function onKey(e){
      if (e.key !== 'Escape') return;
      if (sheetRef.current){ setSheet(null); return; }
      if (!doneRef.current) return;
      if (pageRef.current.node) closePage(); else if (stackRef.current.length > 1) goTo(stackRef.current.length - 1);
    }
    document.addEventListener('keydown', onKey);
    return function(){ document.removeEventListener('keydown', onKey); };
  }, [closePage, goTo]);

  /* the intro reports how far the map has come together; the map moves its own parts to match */
  var onMapArrival = useCallback(function(p){ if (sceneRef.current) sceneRef.current.setArrival(p); }, []);
  /* the map only needs drawing once it is on screen: after the intro, or from partway through the zoom */
  var mapShowing = useCallback(function(){ return doneRef.current || (!!introRef.current && introRef.current.mapShowing()); }, []);

  var atTop = stack.length === 1;

  return (
    <div className="brain" data-scheme={palette.scheme} style={vars}>
      <section id="intro" ref={sectionRef} className={done ? 'done' : undefined} aria-label="Intro">
        <div className={'stage' + (done ? ' is-done' : '')} id="stage" ref={stageRef}>
          <div className="grain" aria-hidden="true" />
          <Intro ref={introRef} stageRef={stageRef} sectionRef={sectionRef} mapLayerRef={mapLayerRef} dotTagRef={dotTagRef}
            reduce={reduce} done={done} onFinish={finishIntro} onMapArrival={onMapArrival} onSticker={onSticker} />
          <BrainMap stack={stack} done={done} reduce={reduce}
            busyRef={busyRef} modeRef={modeRef} sceneRef={sceneRef} mapLayerRef={mapLayerRef}
            mapShowing={mapShowing} onDive={onDive} onOpenPage={openPage} />
          {/* the opening title is a speech bubble; it stays mounted so the intro can fade it.
              The map title shows at the top level of the map */}
          <div id="homeTitle" className="site-title" aria-hidden={done}>
            <div className="bubble">
              <h1>{TITLES.home.title}</h1>
              {TITLES.home.sub && <p>{TITLES.home.sub}</p>}
              {/* the bubble's tail, pointing down at the character */}
              <svg className="tail" viewBox="0 0 46 40" width="46" height="40" aria-hidden="true">
                <path className="tail-shade" d="M7 7.5 L45 44 L33 7.5 Z" />
                <path className="tail-fill" d="M2 -0.5 L2 1.5 L40 38 L28 1.5 L28 -0.5 Z" />
                <path className="tail-line" d="M2 1.5 L40 38 L28 1.5" />
              </svg>
            </div>
          </div>
          {done && atTop && !page.node && !sheet && (
            <div id="mapTitle" className="site-title">
              <h1>{TITLES.map.title}</h1>
              {TITLES.map.sub && <p>{TITLES.map.sub}</p>}
            </div>
          )}
          {/* at the top level the title takes the crumbs' corner; there is nowhere to go back to from there */}
          <Crumbs done={done && !atTop} stack={stack} pageNode={page.node} onBack={onBack} onGoTo={goTo} />
          <button id="skip" className="chip-btn" type="button" hidden={done} onClick={finishIntro}>Skip intro</button>
          <button id="replay" className="chip-btn" type="button" hidden={!done} onClick={replayIntro}>Replay intro</button>
          <ThemeToggle mode={mode} onToggle={toggleTheme} />
          <SiteNav onStudio={openStudio} onNotes={function(){ openNote(null); }} onGallery={openGallery} />
          <DotNav done={done} stack={stack} pageNode={page.node || sheet} tagRef={dotTagRef} onReplay={replayIntro}
            onGoTo={function(d){ setSheet(null); goTo(d); }} />
          <NodePage node={page.node} instant={page.instant} seq={page.seq} stack={stack} reduce={reduce}
            onBack={function(){ closePage(); }} onGoToNode={goToNode} onDiveTo={diveTo} onOpenPage={openPage} onAction={onAction} />
          {sheet && sheet.type === 'studio' && <StudioPage onClose={closeSheet} onGoToNode={goToNodeFromSheet} />}
          {sheet && sheet.type === 'gallery' && <GalleryPage node={sheet.node} reduce={reduce} onClose={closeSheet} onGoToNode={goToNodeFromSheet} />}
          {sheet && sheet.type === 'notes' && (
            <NotesPage slug={sheet.slug} onClose={closeSheet} onOpenNote={openNote} onGoToNode={goToNodeFromSheet} onStudio={openStudio} />
          )}
        </div>
      </section>
    </div>
  );
}
