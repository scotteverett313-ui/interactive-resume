import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CURIO_ROOT, BYID, PH_LEDE, PH_STORY, hubName } from './content';

/* Text in [brackets] is a placeholder: show it dashed-underlined so it is obvious what is still blank. */
function Ph({ text }){
  return /^\[.*\]$/.test(text) ? <span className="ph">{text}</span> : <>{text}</>;
}

/* The "Main" page layout from the sketch. It stays mounted and hides itself,
   so it can fade out after the node it was showing is already gone.

   node:     the node to show, or null to close
   instant:  when node is null, hide right away instead of fading
   stack:    current map stack, for the crumb line
   onBack, onGoToNode(node), onDiveTo(hubId), onOpenPage(node) */
export default function NodePage({ node, instant, stack, reduce, onBack, onGoToNode, onDiveTo, onOpenPage }){
  var pageRef = useRef(null), titleRef = useRef(null);
  var D = function(x){ return reduce ? 0 : x; };
  var [shown, setShown] = useState(null);

  /* open: reveal and fade in if we were hidden; change: just swap content. close: fade then hide. */
  useLayoutEffect(function(){
    var page = pageRef.current;
    if (node){
      setShown(node);
      if (page.hidden){
        gsap.killTweensOf(page);
        page.hidden = false;
        gsap.fromTo(page, { opacity:0, y:30 }, { opacity:1, y:0, duration:D(.45), ease:'power3.out', delay:D(.15) });
      }
    } else if (!page.hidden){
      gsap.killTweensOf(page);
      if (instant){ page.hidden = true; }
      else gsap.to(page, { opacity:0, y:20, duration:D(.3), onComplete:function(){ page.hidden = true; } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, instant]);

  /* after the new content is in the DOM: scroll to the top and put focus on the title */
  useEffect(function(){
    if (!shown || !titleRef.current) return;
    pageRef.current.scrollTop = 0;
    titleRef.current.focus({ preventScroll:true });
  }, [shown]);

  var n = shown;
  var body = null;
  if (n){
    var p = n.page || {}, hub = n.hub || n;
    var trail = stack.slice(1).map(function(x){ return x.label; });
    if (n.curio && n !== CURIO_ROOT) trail.push(CURIO_ROOT.label);
    trail.push(n.label);
    var items = p.list || (n === CURIO_ROOT ? n.kids.map(function(k){
      return k.label + (k.sub ? ' ' + k.sub : '') + ': feeds ' + k.hubs.map(hubName).join(' and ');
    }) : []);
    var links = (p.links || []).map(function(l){ return { t:BYID[l.to], why:l.why }; }).filter(function(l){ return l.t; });
    var nLinks = links.length;
    var hubs = n.hubs || [];
    var sibs = n === CURIO_ROOT ? n.kids.slice() :
      ((n.parent && n.parent.kids) || []).filter(function(s){ return s !== n && !(s.kids && s.kids.length); });
    if (n.also) sibs.sort(function(a, b){ return (n.also.indexOf(b.id) >= 0) - (n.also.indexOf(a.id) >= 0); });
    var empty = !sibs.length && !nLinks && !hubs.length;
    if (nLinks) sibs = sibs.filter(function(s){ return !(p.links || []).some(function(l){ return l.to === s.id; }); });
    sibs = sibs.slice(0, nLinks ? 4 : 6);
    var proofBg = 'repeating-linear-gradient(135deg, transparent 0 18px, rgba(40,40,42,.14) 18px 20px), ' + (hub.tint || '#ffffff');

    body = (
      <div className="page-grid">
        <div className="page-text">
          <div className="page-top">
            <div className="page-crumbs" id="pCrumbs">{['Brain'].concat(trail).join(' / ')}</div>
            <button className="chip-btn" type="button" id="pBack" onClick={onBack}>← Back to brain</button>
          </div>
          <div className="pull" id="pPull">
            {n.curio
              ? <><i style={{ background:'#ffffff', borderStyle:'dashed' }} />Outer orbit · not pulled in yet</>
              : <><i style={{ background:hub.swatch }} />Pulled toward {hub.label}</>}
          </div>
          <h1 id="pTitle" tabIndex={-1} ref={titleRef}>{n.label}</h1>
          <p className="lede" id="pLede"><Ph text={p.lede || PH_LEDE} /></p>
          <div className="story">
            <h2>The story</h2>
            <p id="pStory"><Ph text={p.story || PH_STORY} /></p>
            <ul id="pList" hidden={!items.length}>
              {items.map(function(s, i){ return <li key={i}><Ph text={s} /></li>; })}
            </ul>
          </div>
          <div>
            <h2>Connects to</h2>
            <div className="conn" id="pConn">
              {links.map(function(l){
                return (
                  <button type="button" className="lk" key={'l' + l.t.id} onClick={function(){ onGoToNode(l.t); }}>
                    <b>{l.t.label} →</b><span>{l.why}</span>
                  </button>
                );
              })}
              {hubs.map(function(h){
                return <button type="button" key={'h' + h} onClick={function(){ onDiveTo(h); }}>Feeds {hubName(h)} ↗</button>;
              })}
              {empty && <span className="ph">[Connected node]: [why they connect]</span>}
              {sibs.map(function(s){
                return <button type="button" key={'s' + s.id} onClick={function(){ onOpenPage(s); }}>{s.label} →</button>;
              })}
            </div>
          </div>
          <div>
            <h2>More</h2>
            <div className="thumbs" aria-label="More work, scrolls sideways">
              <div /><div /><div /><div /><div /><span className="arrow" aria-hidden="true">→</span>
            </div>
          </div>
        </div>
        <div className="proof" id="pProof" style={{ background:proofBg }}>
          <div className="cap" id="pProofCap">{p.proof ? 'Proof: ' + p.proof : '[Proof: image, video, live embed, or link]'}</div>
        </div>
      </div>
    );
  }

  return (
    <article id="page" ref={pageRef} hidden aria-labelledby="pTitle">
      {body}
    </article>
  );
}

