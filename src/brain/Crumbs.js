import React from 'react';

/* Breadcrumb trail across the top: Back chip, then each level of the stack.
   On a narrow screen only the last two levels show, after a "…", so a deep trail stays on two lines
   (the dots on the right still reach every level). Under the trail sits the level's blurb, the one
   sentence from content.js, when it has been written. It stays there while a page is open over the
   level (the page covers it), so the map can measure the room it takes once and not again. */
export default function Crumbs({ done, stack, pageNode, onBack, onGoTo }){
  var here = stack[stack.length - 1];
  var blurb = done && here && here.blurb && !/^\[.*\]$/.test(here.blurb) ? here.blurb : '';
  var hides = stack.length > 2;
  return (
    <nav id="crumbs" aria-label="Where you are" hidden={!done}>
      {done && (stack.length > 1 || pageNode) && (
        <button type="button" className="chip-btn" id="backBtn" style={{ textDecoration:'none' }} onClick={onBack}>← Back</button>
      )}
      {done && hides && <span className="more" aria-hidden="true">…</span>}
      {done && stack.map(function(n, i){
        var last = i === stack.length - 1 && !pageNode;
        /* far: more than one level above where you are */
        var far = i < stack.length - 2 ? ' far' : '';
        return (
          <React.Fragment key={n.id}>
            {i > 0 && <span className={'sep' + (i - 1 < stack.length - 2 ? ' far' : '')}>/</span>}
            {last
              ? <span className="crumb" aria-current="location">{n.label}</span>
              : <button type="button" className={'crumb' + far} onClick={function(){ onGoTo(i + 1); }}>{n.label}</button>}
          </React.Fragment>
        );
      })}
      {blurb && <p id="levelBlurb">{blurb}</p>}
    </nav>
  );
}
