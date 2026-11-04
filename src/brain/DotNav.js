import React from 'react';

/* Five depth dots down the right edge. The current dot carries a tag;
   during the intro, ScrollTrigger writes the scroll percent straight into
   that tag through tagRef, so the scrub never re-renders React. */
export default function DotNav({ done, stack, pageNode, tagRef, onReplay, onGoTo }){
  var depth = !done ? 0 : Math.min(4, pageNode ? stack.length + 1 : stack.length);
  var tags = ['Intro'].concat(stack.map(function(n){ return n.label; }));
  if (pageNode) tags[depth] = 'Page';
  var rows = [];
  for (var i = 0; i < 5; i++){
    (function(i){
      var on = i === depth, reachable = done && i < depth;
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
