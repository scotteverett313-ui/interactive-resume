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
function picsOf(n){
  var p = n.page || {}, out = [];
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
   seq:      the list this page was opened from, if any: { pages:[{ node, name }], soft }, from a level's
             featured previews. Next and Previous step through it. Without one they step through the
             page's neighbors, the other pages in the same level
   instant:  when node is null, hide right away instead of fading
   stack:    current map stack, for the crumb line
   onBack, onGoToNode(node), onDiveTo(hubId), onOpenPage(node)
   onAction(action): the page's optional button, for example opening the Work with me page */
export default function NodePage({ node, instant, seq, stack, reduce, onBack, onGoToNode, onDiveTo, onOpenPage, onAction }){
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
  /* leaving the page (Back, a link, the browser's Back) closes the viewer with it */
  useEffect(function(){ setView(null); }, [node]);

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
    /* arriving by Next or Previous: the new page slides in from the side it came from */
    var dir = slideRef.current; slideRef.current = 0;
    if (dir && pageRef.current.firstElementChild){
      gsap.fromTo(pageRef.current.firstElementChild, { x:36 * dir, opacity:0 }, { x:0, opacity:1, duration:D(.28), ease:'power2.out', clearProps:'transform,opacity' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  /* ---- Next and Previous: through the list the page was opened from, or else its neighbors ---- */
  var slideRef = useRef(0), turnRef = useRef(null), touchRef = useRef(null);
  var list = null, inSeq = false;
  if (shown){
    var near = ((shown.parent && shown.parent.kids) || [])
      .filter(function(k){ return !(k.kids && k.kids.length) && !k.go; })
      .map(function(k){ return { node:k, name:k.label }; });
    /* the list it was opened from wins when it has somewhere to go. A soft list (a level's single previews
       gathered together) only steps in for a page that has no neighbors of its own */
    var mine = seq && seq.pages.length > 1 && seq.pages.some(function(e){ return e.node === shown; });
    if (mine && !(seq.soft && near.length > 1)){ list = seq.pages; inSeq = true; }
    else list = near;
  }
  var at = -1;
  if (list) list.forEach(function(e, i){ if (e.node === shown) at = i; });
  var many = !!list && list.length > 1 && at >= 0;
  var prev = many ? list[(at - 1 + list.length) % list.length] : null, next = many ? list[(at + 1) % list.length] : null;
  function turn(dir){
    if (!many) return;
    slideRef.current = dir;
    onOpenPage((dir > 0 ? next : prev).node, inSeq ? seq : null);
  }
  turnRef.current = many ? turn : null;
  /* the arrow keys and a swipe turn the page, unless something is open on top of it or the keys are needed for typing */
  useEffect(function(){
    function onKey(e){
      if (!turnRef.current || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var page = pageRef.current, a = document.activeElement;
      if (!page || page.hidden || page.parentNode.querySelector('.sheet, #viewer')) return;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
      e.preventDefault();
      turnRef.current(e.key === 'ArrowRight' ? 1 : -1);
    }
    /* a quick sideways swipe turns the page too. It is heard on the whole screen, not just the page, because the
       depth dots sit on top of the page's right side, which is where a swipe to the next page usually starts.
       Swipes that begin at the screen's edge belong to the browser; ones on the picture strip or the pager belong to those */
    function onTouchStart(e){
      var t = e.touches[0], page = pageRef.current;
      touchRef.current = null;
      if (!turnRef.current || e.touches.length !== 1 || !page || page.hidden) return;
      if (page.parentNode.querySelector('.sheet, #viewer') || !page.parentNode.contains(e.target)) return;
      if (e.target.closest && e.target.closest('.thumbs, .pager')) return;
      if (t.clientX <= 24 || t.clientX >= window.innerWidth - 24) return;
      touchRef.current = { x:t.clientX, y:t.clientY, at:Date.now() };
    }
    function onTouchEnd(e){
      var s = touchRef.current, t = e.changedTouches[0];
      touchRef.current = null;
      if (!s || !t || !turnRef.current) return;
      var dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 2.2 && Date.now() - s.at < 700) turnRef.current(dx < 0 ? 1 : -1);
    }
    function onTouchCancel(){ touchRef.current = null; }
    document.addEventListener('keydown', onKey);
    document.addEventListener('touchstart', onTouchStart, { passive:true });
    document.addEventListener('touchend', onTouchEnd, { passive:true });
    document.addEventListener('touchcancel', onTouchCancel, { passive:true });
    return function(){
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
    };
  }, []);

  var n = shown;
  var body = null, pics = n ? picsOf(n) : [];
  var pager = many ? (
    <nav className="pager" aria-label={inSeq ? 'Featured work' : 'More in ' + (n.parent ? n.parent.label : 'this level')}>
      <button type="button" className="chip-btn" aria-label={'Previous: ' + prev.name} onClick={function(){ turn(-1); }}>← <span>{prev.name}</span></button>
      <span className="pager-count">{(inSeq ? 'Featured · ' : '') + (at + 1) + ' / ' + list.length}</span>
      <button type="button" className="chip-btn" aria-label={'Next: ' + next.name} onClick={function(){ turn(1); }}><span>{next.name}</span> →</button>
    </nav>
  ) : null;
  if (n){
    var p = n.page || {}, hub = n.hub || n;
    /* the crumb line is the page's own place in the tree, whatever level is showing behind it.
       An outer-orbit page has no place in the tree, so it shows where you came from */
    var trail;
    if (n.curio){
      trail = stack.slice(1).map(function(x){ return x.label; });
      if (n !== CURIO_ROOT) trail.push(CURIO_ROOT.label);
      trail.push(n.label);
    } else {
      trail = [];
      for (var up = n; up && up.parent; up = up.parent) trail.unshift(up.label);
    }
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

    /* a document page: the file's pages shown on screen, with a button to download it. The resume uses this */
    if (p.doc) body = (
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
        {pager}
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
          {pager}
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

