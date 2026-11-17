import React from 'react';

/* The three doors that are always there: the services page, the notes, and the gallery.
   They sit in the bottom-left corner of the opening screen and the map. */
export default function SiteNav({ onStudio, onNotes, onGallery }){
  return (
    <nav id="siteNav" aria-label="Site">
      <button className="chip-btn solid" type="button" onClick={onStudio}>Work with me</button>
      <button className="chip-btn" type="button" onClick={onNotes}>Notes</button>
      <button className="chip-btn" type="button" onClick={onGallery}>Gallery</button>
    </nav>
  );
}
