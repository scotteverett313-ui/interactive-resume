import React from 'react';

/* The two doors that are always there: the services page and the notes.
   They sit in the bottom-left corner of the opening screen and the map. */
export default function SiteNav({ onStudio, onNotes }){
  return (
    <nav id="siteNav" aria-label="Site">
      <button className="chip-btn solid" type="button" onClick={onStudio}>Work with me</button>
      <button className="chip-btn" type="button" onClick={onNotes}>Notes</button>
    </nav>
  );
}
