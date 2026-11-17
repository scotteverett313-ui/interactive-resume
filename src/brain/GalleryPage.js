import React, { useEffect, useMemo, useRef, useState } from 'react';
import Sheet from './Sheet';
import PictureViewer from './PictureViewer';
import { ROOT, GALLERY } from './content';
import { picturesIn } from './gallery';

/* Text in [brackets] is a placeholder: dashed-underlined, so it is obvious what is still blank. */
function Ph({ text }){
  return (
    <>
      {String(text).split(/(\[[^\]]*\])/).map(function(s, i){
        return /^\[.*\]$/.test(s) ? <span className="ph" key={i}>{s}</span> : s;
      })}
    </>
  );
}

/* The Gallery: every picture on the site in one wall (see gallery.js for where they come from).

     node:  null for the whole site. Or the go:'gallery' leaf that opened it: then the wall is narrowed
            to the level that leaf sits in, and the title, words, and filter names come from the leaf.
     onGoToNode(node): leave the gallery and land on a picture's page

   Filters: the three gravity points (whole-site view only), then the tags. Both narrow the wall together.
   Pressing a picture opens the viewer on the pictures showing, with a way through to the page it is from. */
export default function GalleryPage({ node, reduce, onClose, onGoToNode }){
  var scope = node ? node.parent : null, words = node ? (node.page || {}) : null;
  var all = useMemo(function(){ return picturesIn(scope ? scope.id : null); }, [scope]);
  var [hub, setHub] = useState(null), [tag, setTag] = useState(null);
  var [view, setView] = useState(null), openerRef = useRef(null);
  /* a different gallery (the whole site, or another level's) starts unfiltered */
  useEffect(function(){ setHub(null); setTag(null); setView(null); }, [node]);

  var inHub = hub ? all.filter(function(p){ return p.hub && p.hub.id === hub; }) : all;
  /* the tags on offer: the leaf's own list first (so its filters show even before they have pictures),
     then any other tag that has a picture in view */
  var tags = (words && words.tags ? words.tags.slice() : []);
  inHub.forEach(function(p){ p.tags.forEach(function(t){ if (tags.indexOf(t) < 0) tags.push(t); }); });
  var activeTag = tag && tags.indexOf(tag) >= 0 ? tag : null;
  var pics = activeTag ? inHub.filter(function(p){ return p.tags.indexOf(activeTag) >= 0; }) : inHub;

  function openPic(i, from){ openerRef.current = from; setView(i); }
  function closePic(){
    setView(null);
    var from = openerRef.current; openerRef.current = null;
    if (from && document.contains(from)) from.focus({ preventScroll:true });
  }
  var shown = view !== null && pics[view] ? pics.map(function(p){
    /* where the picture leads: its page, or for an extra the level it belongs to */
    var to = p.page || p.level || null;
    return { src:p.src, caption:p.caption, goLabel:to ? to.label : null, node:to };
  }) : null;

  return (
    <>
      <Sheet id="galleryPage" onClose={onClose}>
        <div className="sheet-head">
          {scope && <p className="kicker">{scope.label}</p>}
          <h1 tabIndex={-1}>{node ? node.label : GALLERY.title}</h1>
          {words
            ? <>
                {words.lede && <p className="lede"><Ph text={words.lede} /></p>}
                {words.story && <p><Ph text={words.story} /></p>}
              </>
            : <p className="lede">{GALLERY.intro}</p>}
        </div>
        <div className="gallery-tools">
          {!scope && (
            <div className="filters" role="group" aria-label="Filter by part of the brain">
              <button type="button" className="chip-btn" aria-pressed={!hub} onClick={function(){ setHub(null); }}>All</button>
              {ROOT.kids.map(function(h){
                return (
                  <button type="button" className={'chip-btn in-' + h.id} key={h.id} aria-pressed={hub === h.id} onClick={function(){ setHub(h.id); }}>
                    <i aria-hidden="true" />{h.label}
                  </button>
                );
              })}
            </div>
          )}
          {tags.length > 0 && (
            <div className="filters small" role="group" aria-label="Filter by kind of work">
              <button type="button" className="chip-btn" aria-pressed={!activeTag} onClick={function(){ setTag(null); }}>{scope ? 'All' : 'Any kind'}</button>
              {tags.map(function(t){
                return <button type="button" className="chip-btn" key={t} aria-pressed={activeTag === t} onClick={function(){ setTag(t); }}>{t}</button>;
              })}
            </div>
          )}
        </div>
        {pics.length
          ? (
            <div className="wall">
              {pics.map(function(pc, i){
                return (
                  <button type="button" key={pc.src} className={pc.hub ? 'in-' + pc.hub.id : undefined}
                    aria-label={'View larger: ' + pc.caption + (pc.page ? ', from ' + pc.page.label : '') + ', picture ' + (i + 1) + ' of ' + pics.length}
                    onClick={function(e){ openPic(i, e.currentTarget); }}>
                    <img src={pc.src} alt="" loading="lazy" />
                  </button>
                );
              })}
            </div>
          )
          : <p className="wall-empty"><span className="ph">{'[' + (activeTag || (hub ? ROOT.kids.filter(function(h){ return h.id === hub; })[0].label : 'Gallery')) + ' pictures go here]'}</span></p>}
      </Sheet>
      {shown && (
        <PictureViewer pics={shown} index={view} onIndex={setView} onClose={closePic} reduce={reduce}
          onGo={function(pic){ if (pic.node) onGoToNode(pic.node); }} />
      )}
    </>
  );
}
