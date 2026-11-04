import React from 'react';

/* Breadcrumb trail across the top: Back chip, then each level of the stack. */
export default function Crumbs({ done, stack, pageNode, onBack, onGoTo }){
  return (
    <nav id="crumbs" aria-label="Where you are" hidden={!done}>
      {done && (stack.length > 1 || pageNode) && (
        <button type="button" className="chip-btn" id="backBtn" style={{ textDecoration:'none' }} onClick={onBack}>← Back</button>
      )}
      {done && stack.map(function(n, i){
        var last = i === stack.length - 1 && !pageNode;
        return (
          <React.Fragment key={n.id}>
            {i > 0 && <span className="sep">/</span>}
            {last
              ? <span aria-current="location">{n.label}</span>
              : <button type="button" onClick={function(){ onGoTo(i + 1); }}>{n.label}</button>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
