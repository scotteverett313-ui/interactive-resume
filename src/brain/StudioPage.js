import React from 'react';
import Sheet from './Sheet';
import ContactForm from './ContactForm';
import { STUDIO as S, BOOKING, SOCIALS } from './studio';

function Book({ children, quiet }){
  return <a className={'chip-btn' + (quiet ? '' : ' solid')} href={BOOKING} target="_blank" rel="noopener noreferrer">{children}</a>;
}

/* "Work with me": the SE|Design services page. All of its words are in studio.js. */
export default function StudioPage({ onClose }){
  return (
    <Sheet id="studioPage" onClose={onClose}>
      <header className="sheet-head">
        <p className="kicker">{S.kicker}</p>
        <h1 tabIndex={-1}>{S.title}</h1>
        <p className="lede">{S.intro}</p>
        <div className="row"><Book>{S.contact.call}</Book><a className="chip-btn" href="#levels">See Partnership Levels</a></div>
        <ul className="facts">
          {S.facts.map(function(f){ return <li key={f.big}><b>{f.big}</b><span>{f.small}</span></li>; })}
        </ul>
      </header>

      <section>
        <h2>Why SE|Design</h2>
        <h3 className="big">{S.why.title}</h3>
        <div className="cards three">
          {S.why.options.map(function(o){
            return <div className="panel" key={o.name}><p className="tag">{o.name}</p><h4>{o.quote}</h4><p>{o.text}</p></div>;
          })}
        </div>
        <h3 className="big">{S.why.gap}</h3>
        {S.why.gapText.map(function(t, i){ return <p className="body" key={i}>{t}</p>; })}
      </section>

      <section>
        <h2>The Flow</h2>
        <h3 className="big">{S.flow.title}</h3>
        <ol className="steps">
          {S.flow.steps.map(function(s, i){
            return <li key={s.name}><span className="num">{'0' + (i + 1)}</span><div><h4>{s.name}</h4><p>{s.text}</p></div></li>;
          })}
        </ol>
        <p className="body">{S.flow.note}</p>
      </section>

      <section>
        <h2>{S.who.title}</h2>
        <div className="cards three">
          {S.who.groups.map(function(g){
            return <div className="panel" key={g.name}><h4>{g.name}</h4><p>{g.text}</p><p className="tag">{g.kinds}</p></div>;
          })}
        </div>
      </section>

      <section id="levels">
        <h2>Partnership Levels</h2>
        <h3 className="big">{S.levels.title}</h3>
        <p className="body">{S.levels.note}</p>
        <div className="cards three">
          {S.levels.tiers.map(function(t){
            return (
              <div className={'panel tier' + (t.popular ? ' popular' : '')} key={t.name}>
                {t.popular && <p className="flag">Most Popular</p>}
                <h4>{t.name}</h4>
                <p className="tag">{t.hours}</p>
                <p className="price">{t.price}</p>
                <p className="tag">{t.rate}</p>
                <p>{t.text}</p>
                <p className="tag">{t.includesLabel}</p>
                <ul>{t.includes.map(function(x){ return <li key={x}>{x}</li>; })}</ul>
                <Book quiet={!t.popular}>Book a Free Call</Book>
                <p className="tag">{t.best}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2>Trial projects</h2>
        <h3 className="big">{S.trial.title}</h3>
        <p className="body">{S.trial.note}</p>
        <div className="cards three">
          {S.trial.items.map(function(t){
            return (
              <div className="panel" key={t.name}>
                <p className="tag">{t.tag}</p><h4>{t.name}</h4><p className="price small">{t.price}</p><p>{t.text}</p>
                <Book quiet>Book a Free Call</Book>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2>What they say</h2>
        <div className="cards three">
          {S.said.map(function(q){
            return <figure className="panel quote" key={q.who}><blockquote>{q.text}</blockquote><figcaption>{q.who}<span className="tag">{q.kind}</span></figcaption></figure>;
          })}
        </div>
      </section>

      <section id="contact" className="reach">
        <div>
          <h2>Contact</h2>
          <h3 className="big">{S.contact.title}</h3>
          <p className="body">{S.contact.text}</p>
          <div className="row"><Book>{S.contact.call}</Book></div>
          <p className="tag">{S.contact.callNote}</p>
        </div>
        <ContactForm subject="SE|Design inquiry" />
      </section>

      <footer className="sheet-foot">
        {SOCIALS.map(function(s){ return <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>; })}
      </footer>
    </Sheet>
  );
}
