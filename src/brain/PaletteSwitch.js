import React from 'react';
import { PALETTES, DEFAULT_PALETTE } from './palettes';

/* ============================================================
   TEMPORARY. A small switcher for comparing the palettes on the
   live site. Once a palette is chosen:
     1. set DEFAULT_PALETTE in palettes.js to the winner
     2. delete this file
     3. in BrainExperience.js remove the PaletteSwitch import, the
        <PaletteSwitch /> line, and replace the palette state with
        `var palette = PALETTES[DEFAULT_PALETTE];`
     4. delete the "palette switcher" block in brain.css
   ============================================================ */

var KEY = 'brain-palette';

/* which palette to start on: ?palette=split in the address wins, then the last one picked, then the default */
export function readPalette(){
  try {
    var q = new URLSearchParams(window.location.search).get('palette');
    if (q && PALETTES[q]) return q;
    var saved = window.localStorage.getItem(KEY);
    if (saved && PALETTES[saved]) return saved;
  } catch (e) { /* private mode or blocked storage: fall through to the default */ }
  return DEFAULT_PALETTE;
}
export function savePalette(id){
  try { window.localStorage.setItem(KEY, id); } catch (e) { /* not saved, still switches for this visit */ }
}

export default function PaletteSwitch({ value, onChange }){
  return (
    <div id="paletteSwitch" role="group" aria-label="Color palette (temporary, for comparing)">
      {Object.keys(PALETTES).map(function(id, i){
        var p = PALETTES[id];
        return (
          <button type="button" key={id} aria-pressed={id === value} title={p.name} onClick={function(){ onChange(id); }}>
            <span className="sw" aria-hidden="true" style={{ background:p.ground }}>
              <i style={{ background:p.hubs.learn.fill }} />
              <i style={{ background:p.hubs.teach.fill }} />
              <i style={{ background:p.hubs.improve.fill }} />
            </span>
            <span className="nm">{(i + 1) + ' ' + p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
