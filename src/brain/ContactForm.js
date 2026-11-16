import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, CONTACT_EMAIL } from '../emailConfig';

/* A short message form. It sends through EmailJS, the same account the resume's form uses,
   so messages arrive in the same inbox. `subject` is the subject line the email will carry. */
export default function ContactForm({ subject }){
  var [v, setV] = useState({ name:'', email:'', message:'' });
  var [state, setState] = useState('idle'); /* idle, sending, sent, error */

  function set(e){ var next = Object.assign({}, v); next[e.target.name] = e.target.value; setV(next); }
  function onSubmit(e){
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
      { from_name:v.name, from_email:v.email, subject:subject, message:v.message }, EMAILJS_PUBLIC_KEY)
      .then(function(){ setState('sent'); setV({ name:'', email:'', message:'' }); },
            function(){ setState('error'); });
  }

  return (
    <form className="msg-form" onSubmit={onSubmit}>
      <label>Name
        <input name="name" type="text" autoComplete="name" required value={v.name} onChange={set} />
      </label>
      <label>Email
        <input name="email" type="email" autoComplete="email" required value={v.email} onChange={set} />
      </label>
      <label>Message
        <textarea name="message" rows="4" required value={v.message} onChange={set} />
      </label>
      <div className="form-foot">
        <button className="chip-btn solid" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <span role="status" aria-live="polite">
          {state === 'sent' && 'Sent. I will get back to you soon.'}
          {state === 'error' && <>That did not send. Email me at <a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a>.</>}
        </span>
      </div>
    </form>
  );
}
