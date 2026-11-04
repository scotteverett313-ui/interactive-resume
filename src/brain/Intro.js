import React, { useEffect, useRef } from 'react';

/* The illustrated bust. Inline SVG with separate layers so the scroll
   timeline can move each one. Keep these ids and classes stable; a
   layered Illustrator export with the same names drops straight in:

     #bodyG      shoulders and neck
     #headG      lower head: face, eyes, mouth (contains .pupil x2)
     #capG       skull cap that lifts off
     #slit       the dashed line that draws across the forehead
     #brainWrap  the brain, lifts out and zooms (contains 4 .bv angles)
     #angleTag   "drawn angle n / 4" caption
     #boil       the hand-drawn line wobble filter (also used by the map links)

   The scroll timeline itself is wired in BrainExperience through introRef. */
export default function Intro({ stageRef, reduce }){
  var svgRef = useRef(null), boilRef = useRef(null);

  /* tall phone screens: crop in on the bust so it fills the height instead of floating small */
  useEffect(function(){
    function fitIntro(){
      var r = stageRef.current.getBoundingClientRect();
      svgRef.current.setAttribute('viewBox', r.width / r.height < .8 ? '190 30 420 570' : '0 0 800 600');
    }
    fitIntro();
    window.addEventListener('resize', fitIntro);
    return function(){ window.removeEventListener('resize', fitIntro); };
  }, [stageRef]);

  /* boil: redraw the line wobble a few times a second, like a hand-drawn loop */
  useEffect(function(){
    if (reduce) return undefined;
    var seedN = 1, boilT = boilRef.current;
    var id = setInterval(function(){ seedN = seedN % 5 + 1; boilT.setAttribute('seed', seedN); }, 120);
    return function(){ clearInterval(id); };
  }, [reduce]);

  var brainOutline = 'M30 100 C14 70 34 34 72 34 C84 12 128 10 144 28 C170 14 214 30 214 64 C236 78 234 116 210 128 C206 150 172 160 150 148 C132 162 92 162 78 148 C50 154 26 132 30 100 Z';

  return (
    <>
      <svg id="introSvg" ref={svgRef} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="img"
        aria-label="Illustrated bust of Scott. Scrolling opens his head and zooms into his brain.">
        <defs>
          <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence id="boilT" ref={boilRef} type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="3.5" />
          </filter>
        </defs>
        <g stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <g id="charInk" filter="url(#boil)">
            <g id="bodyG">
              <path d="M150 604 C168 492 632 492 650 604 Z" fill="#ffffff" />
              <path d="M318 510 C350 540 450 540 482 510" fill="none" strokeWidth="3" />
              <rect x="362" y="410" width="76" height="90" fill="#ffffff" />
            </g>
            <g id="headG">
              <ellipse cx="284" cy="318" rx="18" ry="30" fill="#ffffff" />
              <path d="M288 250 A120 140 0 1 0 512 250 Z" fill="#ffffff" />
              <path d="M352 288 Q372 278 392 286 M430 284 Q448 276 466 284" fill="none" />
              <ellipse cx="372" cy="320" rx="16" ry="20" fill="#ffffff" strokeWidth="3" />
              <ellipse cx="447" cy="318" rx="14" ry="19" fill="#ffffff" strokeWidth="3" />
              <circle className="pupil" cx="376" cy="324" r="7" fill="#1a1a1a" stroke="none" />
              <circle className="pupil" cx="450" cy="322" r="6" fill="#1a1a1a" stroke="none" />
              <path d="M420 334 Q434 362 414 370" fill="none" strokeWidth="3" />
              <path d="M386 394 Q414 412 444 390" fill="none" />
              <g fill="#1a1a1a" stroke="none" opacity=".5"><circle cx="356" cy="404" r="1.8" /><circle cx="370" cy="416" r="1.8" /><circle cx="392" cy="424" r="1.8" /><circle cx="420" cy="424" r="1.8" /><circle cx="444" cy="414" r="1.8" /><circle cx="460" cy="400" r="1.8" /></g>
            </g>
            <g id="capG">
              <path d="M288 250 A120 140 0 0 1 512 250 Z" fill="#ffffff" />
              <path d="M330 206 C350 186 380 176 404 178" fill="none" strokeWidth="3" opacity=".5" />
            </g>
            <path id="slit" d="M288 250 C350 264 450 264 512 250" fill="none" strokeWidth="3.5" strokeDasharray="6 7" />
          </g>

          <g id="brainWrap" opacity="0">
            <g transform="translate(298 150) scale(.85)">
              <g className="bv">
                <path d={brainOutline} fill="#ffffff" />
                <path d="M120 22 C110 60 132 92 118 150 M72 50 C92 62 84 82 62 92 M168 46 C150 66 176 86 160 104 M48 116 C70 108 84 124 74 140 M182 120 C196 106 210 112 214 100" fill="none" strokeWidth="3" />
              </g>
              <g className="bv" style={{ display:'none' }}>
                <path d={brainOutline} fill="#ffffff" transform="translate(12 0) scale(.92 1)" />
                <path d="M138 24 C124 60 146 96 134 150 M80 54 C100 64 94 86 70 96 M178 50 C160 70 184 88 170 108 M52 118 C74 110 86 126 78 142" fill="none" strokeWidth="3" />
              </g>
              <g className="bv" style={{ display:'none' }}>
                <path d={brainOutline} fill="#ffffff" transform="translate(26 2) scale(.82 1)" />
                <path d="M146 140 C164 152 190 150 204 132 M90 40 C112 58 100 84 76 92 M150 40 C138 66 162 84 150 108 M64 116 C88 106 104 122 96 140 M118 92 C134 100 150 96 160 86" fill="none" strokeWidth="3" />
              </g>
              <g className="bv" style={{ display:'none' }}>
                <path d={brainOutline} fill="#ffffff" transform="translate(10 0) scale(.94 1)" />
                <path d="M104 22 C96 62 118 94 104 150 M64 52 C84 62 78 84 56 92 M160 44 C142 66 166 84 152 104 M176 118 C192 104 206 112 210 100" fill="none" strokeWidth="3" />
              </g>
            </g>
          </g>
          <text id="angleTag" x="400" y="570" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="14" fill="#1a1a1a" stroke="none" opacity="0">drawn angle 1 / 4</text>
        </g>
      </svg>
      <div id="hint"><span>Scroll to open</span><span className="line" /></div>
      <div id="placeholderTag">Placeholder Scott · swap in your layered SVG</div>
    </>
  );
}
