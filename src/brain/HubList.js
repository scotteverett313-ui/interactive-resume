import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BYID } from './content';
import { blobPath } from './blob';

/* Trial A1, the name list. Pressing Work on the map floods the screen with Work's paint color; the hub becomes a
   small sticker in the top-left corner (it is the way back), and the projects sit in big type, a line each, in
   groups with a count. Which projects, in which groups, is `list` on the gravity point in content.js.

   Still versions: on a phone nothing depends on hover (a name is simply a button), and with reduced motion the
   color is there at once, with no flood.

     node:    the gravity point (Work)
     reduce:  reduced motion
     onOpen:  open a project's page
     onBack:  back up to the brain */

/* the one line under a name: its own line if it is written, else its blurb, else its first tags */
function lineFor(n){
  var p = n.page || {}, b = p.brief || {};
  var said = [p.lede, n.blurb, b.question].filter(function(t){ return t && !/\[/.test(t); })[0];
  return said || (p.tags || []).slice(0, 3).join(' · ');
}

/* a group's ids, as pages: a More level stands for the pages inside it; anything held back or parked is skipped */
function pagesOf(ids){
  var out = [];
  ids.forEach(function(id){
    var n = BYID[id];
    if (!n || n.id !== id) return;
    if (n.more) (n.kids || []).forEach(function(k){ out.push(k); });
    else out.push(n);
  });
  return out;
}

export default function HubList({ node, reduce, onOpen, onBack, from }){
  var rootRef = useRef(null), stickRef = useRef(null);
  var groups = (node.list || []).map(function(g){ return { name:g.name, pages:pagesOf(g.items) }; }).filter(function(g){ return g.pages.length; });

  /* the paint floods out from where the hub sat on the map, then the corner sticker pops on */
  useLayoutEffect(function(){
    var el = rootRef.current; if (!el) return undefined;
    var x = (from ? from[0] : .3) * 100, y = (from ? from[1] : .35) * 100;
    var tl = gsap.timeline();
    if (!reduce){
      tl.fromTo(el, { clipPath:'circle(0% at ' + x + '% ' + y + '%)' }, { clipPath:'circle(150% at ' + x + '% ' + y + '%)', duration:.7, ease:'power2.inOut' })
        .fromTo(stickRef.current, { scale:0, rotation:-20 }, { scale:1, rotation:-6, duration:.45, ease:'back.out(2)' }, .35)
        .fromTo(el.querySelectorAll('.hl-row'), { y:24, autoAlpha:0 }, { y:0, autoAlpha:1, duration:.4, stagger:.05, ease:'power2.out' }, .3);
    }
    return function(){ tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  var blob = blobPath(40, 40, 30, 0, 7, .12, 0, 0);
  return (
    <section id="hubList" ref={rootRef} className={'in-' + node.id} aria-label={node.label + ', ' + groups.reduce(function(s, g){ return s + g.pages.length; }, 0) + ' projects'}>
      <button type="button" className="hl-sticker" ref={stickRef} onClick={onBack} aria-label={'Back to the brain (you are in ' + node.label + ')'}>
        <svg viewBox="0 0 80 80" aria-hidden="true"><path d={blob} className="hl-blob" /></svg>
        <span><i aria-hidden="true">←</i>{node.label}</span>
      </button>
      <div className="hl-body">
        {node.says && <p className="hl-says">{node.says}</p>}
        {groups.map(function(g){
          return (
            <div className="hl-group" key={g.name}>
              <h2 className="hl-row"><span>{g.name}</span><b aria-label={g.pages.length + (g.pages.length === 1 ? ' project' : ' projects')}>{g.pages.length}</b></h2>
              <ul>
                {g.pages.map(function(n){
                  return (
                    <li className="hl-row" key={n.id}>
                      <button type="button" onClick={function(){ onOpen(n); }}>
                        <span className="hl-name">{n.label}</span>
                        <span className="hl-line">{lineFor(n)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
