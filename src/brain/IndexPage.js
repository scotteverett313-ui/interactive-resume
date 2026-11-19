import React from 'react';
import Sheet from './Sheet';
import { ROOT, INDEX } from './content';
import { thumbOf, fullOnError } from './gallery';

/* "Just the work": every finished page on the site as one plain list, for someone who wants to scan it
   in ten seconds. Grouped by gravity point, in the order of the map. Its title and line are INDEX in content.js.

   Nothing to maintain: the list is gathered from content.js, and a page joins it once it is finished enough
   to be worth landing on (see `finished` below). Words still in [brackets] are never shown here.

     onGoToNode(node): leave the list and land on a page
     onGallery():      the same work as pictures */

function written(t){ return !!t && !/^\[.*\]$/.test(t); }
/* some real words outside the [brackets] */
function hasWords(t){ return !!t && t.replace(/\[[^\]]*\]/g, '').replace(/[^A-Za-z]/g, '').length > 12; }

/* a page's picture for its row: its lead picture, its case study's hero, or the first page of its document */
function leadOf(n){
  var p = n.page || {}, hero = p.study && p.study.hero && p.study.hero.src;
  return p.image || hero || (p.doc && p.doc.pages && p.doc.pages[0]) || null;
}
/* a page's one line, or '' while it is still a placeholder */
function lineOf(n){
  var p = n.page || {}, t = p.lede || (p.study && p.study.sub) || '';
  return written(t) ? t : '';
}
/* worth landing on: it has a picture, or it has its one line and something written under it */
function finished(n){
  var p = n.page || {};
  if (leadOf(n)) return true;
  return !!lineOf(n) && !!(p.study || p.doc || (p.list && p.list.length) || hasWords(p.story));
}

/* every finished page under a gravity point, in map order, each with the levels it sits in */
function pagesIn(hub){
  var out = [];
  (function walk(n, trail){
    (n.kids || []).forEach(function(k){
      if (k.kids && k.kids.length) walk(k, trail.concat(k.label));
      else if (!k.go && finished(k)) out.push({ node:k, trail:trail });
    });
  })(hub, []);
  return out;
}

export default function IndexPage({ onClose, onGoToNode, onGallery }){
  var groups = ROOT.kids.map(function(h){ return { hub:h, pages:pagesIn(h) }; }).filter(function(g){ return g.pages.length; });
  var total = groups.reduce(function(sum, g){ return sum + g.pages.length; }, 0);
  return (
    <Sheet id="indexPage" onClose={onClose}>
      <div className="sheet-head">
        <h1 tabIndex={-1}>{INDEX.title}</h1>
        <p className="lede">{INDEX.intro}</p>
        <p className="tag">{total + ' pages'} · <button type="button" className="text-link" onClick={onGallery}>See it as pictures</button></p>
      </div>
      {groups.map(function(g){
        return (
          <section className={'index-group in-' + g.hub.id} key={g.hub.id} aria-label={g.hub.label}>
            <h2><i aria-hidden="true" />{g.hub.label}<span>{g.pages.length}</span></h2>
            <ul className="index-list">
              {g.pages.map(function(pg){
                var n = pg.node, src = leadOf(n), line = lineOf(n);
                return (
                  <li key={n.id}>
                    <button type="button" onClick={function(){ onGoToNode(n); }} aria-label={pg.trail.concat(n.label).join(', ') + (line ? '. ' + line : '')}>
                      <span className={'thumb' + (src ? '' : ' none')}>
                        {src && <img src={thumbOf(src)} onError={fullOnError(src)} alt="" loading="lazy" />}
                      </span>
                      <span className="what">
                        {pg.trail.length > 0 && <span className="where">{pg.trail.join(' / ')}</span>}
                        <b>{n.label}</b>
                        {line && <span className="line">{line}</span>}
                      </span>
                      <span className="go" aria-hidden="true">→</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </Sheet>
  );
}
