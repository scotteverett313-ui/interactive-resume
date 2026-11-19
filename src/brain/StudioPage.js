import React from 'react';
import Sheet from './Sheet';
import ContactForm from './ContactForm';
import { STUDIO as S, STATUS, BOOKING, SOCIALS } from './studio';
import { BYID } from './content';

/* "Work with me": what I am open to, and one way to start talking. All of its words are in studio.js.
   Each way links into the brain, so the work itself does the showing. */
export default function StudioPage({ onClose, onGoToNode }){
  return (
    <Sheet id="studioPage" onClose={onClose}>
      <div className="work">
        <div className="work-say">
          <p className="kicker">Work with me{STATUS.open && <span className="status"><i className="open-dot" aria-hidden="true" />{STATUS.label}</span>}</p>
          <h1 tabIndex={-1}>{S.title}</h1>
          <p className="lede">{S.intro}</p>
          <ul className="ways">
            {S.ways.map(function(w){
              var node = BYID[w.see];
              return (
                <li key={w.name} className={node ? 'in-' + node.hub.id : undefined}>
                  <button type="button" onClick={function(){ if (node) onGoToNode(node); }} aria-label={w.name + '. ' + w.text + ' See the work.'}>
                    <i aria-hidden="true" />
                    <span><b>{w.name}</b><span className="t">{w.text}</span></span>
                    <span className="go" aria-hidden="true">See the work →</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="talk" id="contact">
          <a className="chip-btn solid" href={BOOKING} target="_blank" rel="noopener noreferrer">{S.call}</a>
          <p className="tag">{S.callNote}</p>
          <h2>{S.write}</h2>
          <ContactForm subject="Work with me" />
        </div>
      </div>

      <footer className="sheet-foot">
        {SOCIALS.map(function(s){ return <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>; })}
      </footer>
    </Sheet>
  );
}
