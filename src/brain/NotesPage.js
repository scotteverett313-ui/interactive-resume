import React from 'react';
import Sheet from './Sheet';
import { NOTES, NOTE_BY_SLUG, noteDate } from './notes';
import { BYID } from './content';

/* The notes: a list of every note, or one note when `slug` is set. All of the writing is in notes.js.
   A note's "Connects to" buttons jump into the brain, the same as on a node's page. */
export default function NotesPage({ slug, onClose, onOpenNote, onGoToNode, onStudio }){
  var note = slug ? NOTE_BY_SLUG[slug] : null;

  if (!note){
    return (
      <Sheet id="notesPage" onClose={onClose}>
        <header className="sheet-head">
          <p className="kicker">Notes</p>
          <h1 tabIndex={-1}>What I am thinking about</h1>
        </header>
        <ul className="note-list">
          {NOTES.map(function(n){
            return (
              <li key={n.slug}>
                <button type="button" onClick={function(){ onOpenNote(n.slug); }}>
                  <span className="tag">{noteDate(n.date)}</span>
                  <b>{n.title}</b>
                  <span>{n.summary}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    );
  }

  var links = (note.links || []).map(function(l){ return { t:BYID[l.to], why:l.why }; }).filter(function(l){ return l.t; });
  return (
    <Sheet id={'note-' + note.slug} onClose={onClose}>
      <header className="sheet-head">
        <p className="kicker"><button type="button" className="text-link" onClick={function(){ onOpenNote(null); }}>Notes</button> · {noteDate(note.date)}</p>
        <h1 tabIndex={-1}>{note.title}</h1>
      </header>
      <div className="note-body">
        {note.body.map(function(b, i){
          if (b.h) return <h2 key={i}>{b.h}</h2>;
          return <p key={i}>{b.lead && <b>{b.lead} </b>}{b.p}</p>;
        })}
      </div>
      {(links.length > 0 || note.studio) && (
        <section>
          <h2>Connects to</h2>
          <div className="conn">
            {links.map(function(l){
              return (
                <button type="button" className="lk" key={l.t.id} onClick={function(){ onGoToNode(l.t); }}>
                  <b>{l.t.label} →</b><span>{l.why}</span>
                </button>
              );
            })}
            {note.studio && <button type="button" className="chip-btn solid" onClick={onStudio}>Work with me →</button>}
          </div>
        </section>
      )}
    </Sheet>
  );
}
