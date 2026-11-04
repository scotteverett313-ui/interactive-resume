import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ROOT } from './content';
import Intro from './Intro';
import BrainMap from './BrainMap';
import NodePage from './NodePage';
import DotNav from './DotNav';
import Crumbs from './Crumbs';
import './brain.css';

/* Owns the three pieces of state the brain has:
     stack:  nodes from ROOT down to the level on the map
     page:   { node, instant } the open page, or null
     done:   whether the intro has finished
   Everything animated lives in refs and GSAP, not here. */
export default function BrainExperience(){
  var reduce = useMemo(function(){ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);
  var [done, setDone] = useState(reduce); /* reduced motion skips the intro */
  var [stack, setStack] = useState([ROOT]);
  var [page, setPage] = useState({ node:null, instant:false });

  var busyRef = useRef(false), modeRef = useRef(null), sceneRef = useRef(null);
  var stageRef = useRef(null), sectionRef = useRef(null), mapLayerRef = useRef(null), dotTagRef = useRef(null), introRef = useRef(null);
  var stackRef = useRef(stack); stackRef.current = stack;
  var pageRef = useRef(page); pageRef.current = page;
  var doneRef = useRef(done); doneRef.current = done;

  /* page title and the html-level overrides for this route */
  useEffect(function(){
    var prev = document.title;
    document.title = "Inside Scott's Brain";
    document.documentElement.classList.add('brain-route');
    return function(){ document.title = prev; document.documentElement.classList.remove('brain-route'); };
  }, []);

  var openPage = useCallback(function(node){ setPage({ node:node, instant:false }); }, []);
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
    modeRef.current = { mode:'rise' };
    setStack(s.slice(0, depth));
  }, [closePage]);

  /* a map item was pressed: go one level deeper, diving out of that item */
  var onDive = useCallback(function(node, item){
    modeRef.current = { mode:'dive', fromItem:item };
    setStack(stackRef.current.concat(node));
  }, []);

  /* jump anywhere in the brain from a "Connects to" link: rebuild the path, then land on the page or the level */
  var goToNode = useCallback(function(n){
    if (busyRef.current) return;
    var path = [];
    for (var x = n; x; x = x.parent) path.unshift(x);
    if (path[0] !== ROOT) return;
    closePage(true);
    modeRef.current = { mode:'instant' };
    if (n.kids && n.kids.length){
      setStack(path);
    } else {
      setStack(path.slice(0, -1));
      openPage(n);
    }
  }, [closePage, openPage]);

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
      if (e.key !== 'Escape' || !doneRef.current) return;
      if (pageRef.current.node) closePage(); else if (stackRef.current.length > 1) goTo(stackRef.current.length - 1);
    }
    document.addEventListener('keydown', onKey);
    return function(){ document.removeEventListener('keydown', onKey); };
  }, [closePage, goTo]);

  var getIntroProgress = useCallback(function(){ return doneRef.current ? 1 : (introRef.current ? introRef.current.progress() : 0); }, []);

  return (
    <div className="brain">
      <section id="intro" ref={sectionRef} className={done ? 'done' : undefined} aria-label="Intro">
        <div className={'stage' + (done ? ' is-done' : '')} id="stage" ref={stageRef}>
          <div className="grain" aria-hidden="true" />
          <Intro ref={introRef} stageRef={stageRef} sectionRef={sectionRef} mapLayerRef={mapLayerRef} dotTagRef={dotTagRef}
            reduce={reduce} done={done} onFinish={finishIntro} />
          <BrainMap stack={stack} done={done} reduce={reduce}
            busyRef={busyRef} modeRef={modeRef} sceneRef={sceneRef} mapLayerRef={mapLayerRef}
            getIntroProgress={getIntroProgress} onDive={onDive} onOpenPage={openPage} />
          <Crumbs done={done} stack={stack} pageNode={page.node} onBack={onBack} onGoTo={goTo} />
          <button id="skip" className="chip-btn" type="button" hidden={done} onClick={finishIntro}>Skip intro</button>
          <button id="replay" className="chip-btn" type="button" hidden={!done} onClick={replayIntro}>Replay intro</button>
          <DotNav done={done} stack={stack} pageNode={page.node} tagRef={dotTagRef} onReplay={replayIntro} onGoTo={goTo} />
          <NodePage node={page.node} instant={page.instant} stack={stack} reduce={reduce}
            onBack={function(){ closePage(); }} onGoToNode={goToNode} onDiveTo={diveTo} onOpenPage={openPage} />
        </div>
      </section>
    </div>
  );
}
