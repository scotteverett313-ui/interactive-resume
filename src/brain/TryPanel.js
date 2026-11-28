import React from 'react';
import { TRIES } from './tries';

/* The "Trials" panel: a small box in the bottom-left corner, shown only after a ?try= address. One switch per
   idea; they can be on alone or together. See tries.js. */
export default function TryPanel({ on, onChange, onHide }){
  return (
    <div id="tryPanel" role="group" aria-label="Trials">
      <div className="tp-head"><b>Trials</b><button type="button" onClick={onHide} aria-label="Hide the trials panel">×</button></div>
      {TRIES.map(function(t){
        return (
          <label key={t.id} title={t.note}>
            <input type="checkbox" checked={!!on[t.id]} onChange={function(e){ onChange(t.id, e.target.checked); }} />
            <span>{t.name}</span>
          </label>
        );
      })}
    </div>
  );
}
