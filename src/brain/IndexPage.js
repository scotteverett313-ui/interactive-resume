import React from 'react';
import Sheet from './Sheet';
import { BYID, INDEX } from './content';
import { thumbOf, fullOnError } from './gallery';

/* "Just the work": a short stack of large tiles, one per project, for someone who wants the work without
   the brain. Which projects, and in what order, is INDEX.picks in content.js.

   A tile opens that project's case study. The picks travel with it as a list, so "Next case study" at the
   bottom of each one carries on to the next tile's project.

     onGoToNode(node, seq): leave the tiles and land on a page, as part of the list `seq`
     onGallery():           every picture on the site */

/* a page's picture for its tile: its lead picture, or its case study's hero */
function leadOf(n){
  var p = n.page || {}, hero = p.study && p.study.hero && p.study.hero.src;
  return p.image || hero || null;
}

export default function IndexPage({ onClose, onGoToNode, onGallery }){
  var picks = (INDEX.picks || []).map(function(k){
    var n = BYID[k.to];
    return n && n.page ? { node:n, name:k.as || n.label } : null;
  }).filter(Boolean);
  var seq = { pages:picks, soft:false };
  return (
    <Sheet id="indexPage" onClose={onClose}>
      <div className="sheet-head">
        <h1 tabIndex={-1}>{INDEX.title}</h1>
        <p className="lede">{INDEX.intro}</p>
      </div>
      <ul className="tiles">
        {picks.map(function(pk, i){
          var n = pk.node, src = leadOf(n), kind = ((n.page && n.page.tags) || []).slice(0, 2).join(' · ');
          return (
            <li key={n.id} className={'in-' + n.hub.id}>
              <button type="button" onClick={function(){ onGoToNode(n, seq); }}
                aria-label={pk.name + (kind ? ', ' + kind : '') + ', case study ' + (i + 1) + ' of ' + picks.length}>
                <span className="tile-words">
                  <b>{pk.name}</b>
                  {kind && <span className="kind">{kind}</span>}
                </span>
                <span className="tile-foot">
                  <span className="num" aria-hidden="true"><i />{(i + 1 < 10 ? '0' : '') + (i + 1)}</span>
                  <span className={'tile-pic' + (src ? '' : ' none')}>
                    {src && <img src={thumbOf(src)} onError={fullOnError(src)} alt="" loading="lazy" />}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="tag"><button type="button" className="text-link" onClick={onGallery}>See every picture in the Gallery</button></p>
    </Sheet>
  );
}
