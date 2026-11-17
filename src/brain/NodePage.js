import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CURIO_ROOT, BYID, PH_LEDE, PH_STORY, hubName } from './content';
import PictureViewer from './PictureViewer';

/* Text in [brackets] is a placeholder: show it dashed-underlined so it is obvious what is still blank.
   Brackets can sit anywhere in a sentence; only the bracketed parts are marked. */
function Ph({ text }){
  return (
    <>
      {String(text).split(/(\[[^\]]*\])/).map(function(s, i){
        return /^\[.*\]$/.test(s) ? <span className="ph" key={i}>{s}</span> : s;
      })}
    </>
  );
}
/* the small chips under a page's one-liner: the disciplines and skills it shows */
function Tags({ tags }){
  if (!tags || !tags.length) return null;
  return <ul className="tags" aria-label="What this shows">{tags.map(function(t){ return <li key={t}>{t}</li>; })}</ul>;
}
/* a page's own button: opens the Work with me page, or another site in a new tab */
function Action({ action, onAction }){
  if (!action) return null;
  if (action.url) return <div><a className="chip-btn solid" href={action.url} target="_blank" rel="noopener noreferrer">{action.label} ↗</a></div>;
  return <div><button type="button" className="chip-btn solid" onClick={function(){ onAction(action); }}>{action.label} →</button></div>;
}

/* Every picture on a node's page, in the order the viewer steps through them: the large one, then the "More" strip.
   An entry in `more` is either a path, or { src, caption } when it has words of its own. */
function picsOf(n, filter){
  var p = n.page || {}, out = [];
  /* a gallery page: its wall, narrowed to the chosen filter */
  if (p.gallery) return p.gallery.filter(function(g){ return !filter || g.tag === filter; })
    .map(function(g){ return { src:g.src, caption:g.caption || g.tag || n.label }; });
  if (p.image) out.push({ src:p.image, caption:p.proof || n.label });
  (p.more || []).forEach(function(m){
    out.push(typeof m === 'string' ? { src:m, caption:n.label } : { src:m.src, caption:m.caption || n.label });
  });
  return out;
}
/* the small corner mark on a picture that says it opens larger */
var EXPAND = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </svg>
);

/* The "Main" page layout from the sketch. It stays mounted and hides itself,
   so it can fade out after the node it was showing is already gone.

   node:     the node to show, or null to close
   instant:  when node is null, hide right away instead of fading
   stack:    current map stack, for the crumb line
   onBack, onGoToNode(node), onDiveTo(hubId), onOpenPage(node)
   onAction(action): the page's optional button, for example opening the Work with me page */
export default function NodePage({ node, instant, stack, reduce, onBack, onGoToNode, onDiveTo, onOpenPage, onAction }){
  var pageRef = useRef(null), titleRef = useRef(null), guardRef = useRef(0);
  useEffect(function(){ return function(){ clearTimeout(guardRef.current); }; }, []);
  var D = function(x){ return reduce ? 0 : x; };
  var [shown, setShown] = useState(null);
  /* the picture viewer: which picture is open (null for none), and the button that opened it, to hand focus back to */
  var [view, setView] = useState(null), openerRef = useRef(null);
  function openPic(i, from){ openerRef.current = from; setView(i); }
  function closePic(){
    setView(null);
    var from = openerRef.current; openerRef.current = null;
    if (from && document.contains(from)) from.focus({ preventScroll:true });
  }
  /* a gallery page's chosen filter: one of its tags, or null for everything */
  var [filter, setFilter] = useState(null);
  /* leaving the page (Back, a link, the browser's Back) closes the viewer with it, and clears the filter */
  useEffect(function(){ setView(null); setFilter(null); }, [node]);

  /* open: reveal and fade in if we were hidden; change: just swap content. close: fade then hide. */
  useLayoutEffect(function(){
    var page = pageRef.current;
    if (node){
      setShown(node);
      if (page.hidden){
        gsap.killTweensOf(page);
        page.hidden = false;
        /* on a touch screen the tap that opened this page is followed by a click at the same spot. Without
           this pause that click lands on whatever the page puts there, such as its Back button */
        page.style.pointerEvents = 'none';
        clearTimeout(guardRef.current);
        guardRef.current = setTimeout(function(){ page.style.pointerEvents = ''; }, 350);
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
  var body = null, pics = n ? picsOf(n, filter) : [];
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
    /* a page inside a hub carries that hub's colors; outer-orbit pages have no hub */
    var hubClass = n.curio ? '' : ' in-' + hub.id;

    /* a gallery page: a wall of pictures, with the page's tags as filter buttons. Each picture opens in the viewer */
    if (p.gallery) body = (
      <div className={'page-doc page-gallery' + hubClass}>
        <div className="page-top">
          <div className="page-crumbs" id="pCrumbs">{['Brain'].concat(trail).join(' / ')}</div>
          <button className="chip-btn" type="button" id="pBack" onClick={onBack}>← Back to brain</button>
        </div>
        <div className="gallery-head">
          <div className="pull" id="pPull"><i />Pulled toward {hub.label}</div>
          <h1 id="pTitle" tabIndex={-1} ref={titleRef}>{n.label}</h1>
          <p className="lede" id="pLede"><Ph text={p.lede || PH_LEDE} /></p>
          {p.story && <p className="gallery-say" id="pStory"><Ph text={p.story} /></p>}
        </div>
        <div className="filters" role="group" aria-label="Filter the pictures">
          <button type="button" className="chip-btn" aria-pressed={!filter} onClick={function(){ setFilter(null); }}>All</button>
          {(p.tags || []).map(function(t){
            return <button type="button" className="chip-btn" key={t} aria-pressed={filter === t} onClick={function(){ setFilter(t); }}>{t}</button>;
          })}
        </div>
        {pics.length
          ? (
            <div className="wall">
              {pics.map(function(pc, i){
                return (
                  <button type="button" key={pc.src} aria-label={'View larger: ' + pc.caption + ', picture ' + (i + 1) + ' of ' + pics.length}
                    onClick={function(e){ openPic(i, e.currentTarget); }}>
                    <img src={pc.src} alt="" loading="lazy" />
                  </button>
                );
              })}
            </div>
          )
          : <p className="wall-empty"><span className="ph">{filter ? '[' + filter + ' pictures go here]' : '[Gallery pictures go here]'}</span></p>}
      </div>
    );
    /* a document page: the file's pages shown on screen, with a button to download it. The resume uses this */
    else if (p.doc) body = (
      <div className={'page-doc' + hubClass}>
        <div className="page-top">
          <div className="page-crumbs" id="pCrumbs">{['Brain'].concat(trail).join(' / ')}</div>
          <button className="chip-btn" type="button" id="pBack" onClick={onBack}>← Back to brain</button>
        </div>
        <div className="doc-head">
          <div>
            <div className="pull" id="pPull"><i />Pulled toward {hub.label}</div>
            <h1 id="pTitle" tabIndex={-1} ref={titleRef}>{n.label}</h1>
            {p.lede && <p className="lede" id="pLede">{p.lede}</p>}
          </div>
          <div className="doc-actions">
            <a className="chip-btn solid" href={p.doc.file} download>Download PDF</a>
            <a className="chip-btn" href={p.doc.file} target="_blank" rel="noopener noreferrer">Open in a new tab</a>
          </div>
        </div>
        <div className="doc-pages">
          {p.doc.pages.map(function(src, i){ return <img key={src} src={src} alt={n.label + ', page ' + (i + 1)} />; })}
        </div>
      </div>
    );
    else body = (
      <div className={'page-grid' + hubClass}>
        <div className="page-text">
          <div className="page-top">
            <div className="page-crumbs" id="pCrumbs">{['Brain'].concat(trail).join(' / ')}</div>
            <button className="chip-btn" type="button" id="pBack" onClick={onBack}>← Back to brain</button>
          </div>
          <div className="pull" id="pPull">
            {n.curio
              ? <><i className="orbit" />Outer orbit · not pulled in yet</>
              : <><i />Pulled toward {hub.label}</>}
          </div>
          <h1 id="pTitle" tabIndex={-1} ref={titleRef}>{n.label}</h1>
          <p className="lede" id="pLede"><Ph text={p.lede || PH_LEDE} /></p>
          <Tags tags={p.tags} />
          <div className="story">
            <h2>The story</h2>
            <p id="pStory"><Ph text={p.story || PH_STORY} /></p>
            <ul id="pList" hidden={!items.length}>
              {items.map(function(s, i){ return <li key={i}><Ph text={s} /></li>; })}
            </ul>
          </div>
          <Action action={p.action} onAction={onAction} />
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
              {(p.more && p.more.length)
                ? p.more.map(function(m, i){
                    var k = i + (p.image ? 1 : 0), pc = pics[k];
                    return (
                      <button type="button" key={pc.src} aria-label={'View larger: ' + pc.caption + ', picture ' + (k + 1) + ' of ' + pics.length}
                        onClick={function(e){ openPic(k, e.currentTarget); }}>
                        <img src={pc.src} alt="" loading="lazy" />
                      </button>
                    );
                  })
                : <><div /><div /><div /><div /><div /></>}
              <span className="arrow" aria-hidden="true">→</span>
            </div>
          </div>
        </div>
        <div className={'proof' + (p.image ? ' has-image' : '')} id="pProof">
          {p.image && (
            <button type="button" className="pic-open" aria-label={'View larger: ' + (p.proof || n.label)} onClick={function(e){ openPic(0, e.currentTarget); }}>
              <img src={p.image} alt="" />
              <span className="pic-hint" aria-hidden="true">{EXPAND}</span>
            </button>
          )}
          <div className="cap" id="pProofCap">{p.proof ? 'Proof: ' + p.proof : '[Proof: image, video, live embed, or link]'}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <article id="page" ref={pageRef} hidden aria-labelledby="pTitle">
        {body}
      </article>
      {view !== null && pics[view] && (
        <PictureViewer pics={pics} index={view} onIndex={setView} onClose={closePic} reduce={reduce} />
      )}
    </>
  );
}

