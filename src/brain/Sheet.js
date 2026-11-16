import React, { useEffect, useRef } from 'react';

/* A full-screen page that sits over the brain: the services page and the notes use it.
   It scrolls on its own, has a way back to the brain, and moves focus to its headline when it opens. */
export default function Sheet({ id, onClose, children }){
  var ref = useRef(null);
  useEffect(function(){
    var h = ref.current.querySelector('h1');
    if (h) h.focus({ preventScroll:true });
    ref.current.scrollTop = 0;
  }, [id]);
  return (
    <article className="sheet" id={id} ref={ref}>
      <div className="sheet-in">
        <div className="sheet-top">
          <button className="chip-btn" type="button" onClick={onClose}>← Back to brain</button>
        </div>
        {children}
      </div>
    </article>
  );
}
