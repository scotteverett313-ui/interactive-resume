import React from 'react';
import { MAX_DEPTH, only } from './content';

/* Depth dots down the right edge: one for the intro, one for each level the map can go
   (the brain, a gravity point, and however many levels sit inside it), and one for a page.
   The current dot carries a tag; during the intro, ScrollTrigger writes the scroll percent
   straight into that tag through tagRef, so the scrub never re-renders React. */
export var DOT_COUNT = MAX_DEPTH + 2;

export default function DotNav({ done, stack, pageNode, tagRef, onReplay, onGoTo }){
  var depth = !done ? 0 : Math.min(DOT_COUNT - 1, pageNode ? stack.length + 1 : stack.length);
  var tags = ['Intro'].concat(stack.map(function(n){ return n.label; }));
  if (pageNode) tags[depth] = 'Page';
  var rows = [];
  for (var i = 0; i < DOT_COUNT; i++){
    (function(i){
      /* a level with one thing inside is passed through, so its dot is not a stop */
      var on = i === depth, reachable = done && i < depth && !(i > 0 && only(stack[i - 1]));
      rows.push(
        <div className="row" key={i}>
          {on && <span className="tag" id="dotTag" ref={tagRef}>{!done ? 'Intro' : (tags[i] || '')}</span>}
          <button type="button"
            aria-label={i === 0 ? 'Replay intro' : 'Level ' + i + (tags[i] ? ': ' + tags[i] : '')}
            className={on ? 'on' : undefined}
            aria-current={on ? 'step' : undefined}
            disabled={!reachable}
            onClick={function(){ if (i === 0) onReplay(); else onGoTo(i); }}>
            <i />
          </button>
        </div>
      );
    })(i);
  }
  return <div id="dots" aria-label="Depth">{rows}</div>;
}
