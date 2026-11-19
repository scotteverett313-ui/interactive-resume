import React from 'react';
import { STATUS } from './studio';

/* The three doors that are always there: the services page, the notes, and the gallery.
   They sit in the bottom-left corner of the opening screen and the map.
   While the status in studio.js is open, the Work with me button carries a small dot. */
export default function SiteNav({ onStudio, onNotes, onGallery }){
  return (
    <nav id="siteNav" aria-label="Site">
      <button className="chip-btn solid" type="button" onClick={onStudio} aria-label={STATUS.open ? 'Work with me. ' + STATUS.label + '.' : undefined}>
        {STATUS.open && <i className="open-dot" aria-hidden="true" />}Work with me
      </button>
      <button className="chip-btn" type="button" onClick={onNotes}>Notes</button>
      <button className="chip-btn" type="button" onClick={onGallery}>Gallery</button>
    </nav>
  );
}
