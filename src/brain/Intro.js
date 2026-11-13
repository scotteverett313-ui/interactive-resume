import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CHARACTER as C, MONO } from './character';

gsap.registerPlugin(ScrollTrigger);

/* The character and the scroll intro. An inline SVG with separate layers
   so the timeline can move each one. Keep these ids and classes stable:

     #bodyG      hoodie and everything below the chin line
     #headG      face, between the forehead cut and the chin (contains .pupil x2)
     #capG       top of the head above the forehead cut; lifts off
     #slit       the line that draws across the forehead
     #brainWrap  the brain, lifts out and zooms (contains 4 .bv angles)
     #angleTag   "drawn angle n / 4" caption
     #boil       the hand-drawn line wobble filter (slit, and the map links)

   The art and its measurements live in character.js.

   Scrolling the 520vh #intro section scrubs a GSAP timeline that opens the
   head, lifts the brain, turns it through the four angles, and zooms until
   the map layer fades in on top.

     sectionRef:  the tall #intro section ScrollTrigger watches
     mapLayerRef: the map, faded in at the end of the timeline
     dotTagRef:   the depth-nav tag, written with the scroll percent
     done:        true once the intro is finished or skipped; false again on replay
     onFinish:    called when the scrub reaches the end

   The ref handle exposes progress() so the map can start drawing as the zoom lands. */
var Intro = forwardRef(function Intro({ stageRef, sectionRef, mapLayerRef, dotTagRef, reduce, done, onFinish }, ref){
  var svgRef = useRef(null), boilRef = useRef(null);
  var tlRef = useRef(null), triggerRef = useRef(null);
  var onFinishRef = useRef(onFinish); onFinishRef.current = onFinish;

  /* build the timeline once; it is driven by ScrollTrigger, or jumped to 0 / 1 by the effect below */
  useEffect(function(){
    var svg = svgRef.current, $ = function(sel){ return svg.querySelector(sel); };
    var variants = svg.querySelectorAll('.bv'), angleTag = $('#angleTag'), slit = $('#slit');
    var turn = { a:0 }, shownVariant = 0;
    function setVariant(){
      var i = Math.round(turn.a) % 4;
      if (i === shownVariant) return;
      variants[shownVariant].style.display = 'none';
      variants[i].style.display = '';
      shownVariant = i;
      angleTag.textContent = 'drawn angle ' + (i + 1) + ' / 4';
    }
    var hint = sectionRef.current.querySelector('#hint');
    gsap.set($('#brainWrap'), { svgOrigin:'400 222' });
    /* one dash as long as the whole line, slid into view, draws the cut on */
    var slitLen = Math.ceil(slit.getTotalLength()) + 2;
    slit.setAttribute('stroke-dasharray', slitLen);
    var tl = gsap.timeline({ paused:true });
    tl.to(hint, { opacity:0, duration:.6 }, 0)
      .fromTo(slit, { opacity:0 }, { opacity:1, duration:.4 }, 0)
      .fromTo(slit, { attr:{ 'stroke-dashoffset':slitLen } }, { attr:{ 'stroke-dashoffset':0 }, duration:1.4, ease:'none' }, 0)
      .to($('#capG'), { y:-40, opacity:0, duration:1 }, 1.5)
      .to($('#brainWrap'), { opacity:1, duration:.6 }, 1.5)
      .to(slit, { opacity:0, duration:.5 }, 2)
      .to($('#brainWrap'), { y:-170, duration:2, ease:'power2.inOut' }, 2.5)
      .to([$('#headG'), $('#bodyG')], { y:150, duration:2, ease:'power2.inOut' }, 2.5)
      .to(svg.querySelectorAll('.pupil'), { y:C.lookUp.y, x:C.lookUp.x, duration:.8 }, 2.7)
      .to([$('#headG'), $('#bodyG')], { y:560, duration:2, ease:'power2.in' }, 4.6)
      .to($('#brainWrap'), { y:78, scale:1.7, duration:2, ease:'power2.inOut' }, 4.6)
      .to(turn, { a:3, duration:2, ease:'none', onUpdate:setVariant }, 4.6)
      .to(angleTag, { opacity:1, duration:.3 }, 4.6)
      .to(angleTag, { opacity:0, duration:.3 }, 6.4)
      .to($('#brainWrap'), { scale:11, duration:2.6, ease:'power2.in' }, 6.6)
      .to(mapLayerRef.current, { opacity:1, duration:1 }, 8.6)
      .to(svg, { opacity:0, duration:1 }, 8.8);
    tlRef.current = tl;
    return function(){
      if (triggerRef.current){ triggerRef.current.kill(); triggerRef.current = null; }
      tl.kill(); tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* done: park the timeline at the end. not done (first load, or replay): rewind and let scroll drive it */
  useEffect(function(){
    var tl = tlRef.current; if (!tl) return;
    if (triggerRef.current){ triggerRef.current.kill(); triggerRef.current = null; }
    if (done){
      tl.progress(1);
      return;
    }
    tl.progress(0);
    triggerRef.current = ScrollTrigger.create({
      trigger:sectionRef.current, start:'top top', end:'bottom bottom', scrub:.5, animation:tl,
      onUpdate:function(self){
        if (dotTagRef.current) dotTagRef.current.textContent = 'Intro ' + Math.round(self.progress * 100) + '%';
        if (self.progress > .995) onFinishRef.current();
      }
    });
    ScrollTrigger.refresh();
  }, [done, sectionRef, dotTagRef]);

  useImperativeHandle(ref, function(){
    return { progress:function(){ return tlRef.current ? tlRef.current.progress() : 0; } };
  }, []);

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
        aria-label="Scott as a vinyl toy figure with locs, round gold glasses, and a black hoodie. Scrolling opens his head and zooms into his brain.">
        <defs>
          <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence id="boilT" ref={boilRef} type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="3.5" />
          </filter>
          <clipPath id="capClip"><path d={C.clip.cap} /></clipPath>
          <clipPath id="headClip"><path d={C.clip.head} /></clipPath>
          <clipPath id="bodyClip"><path d={C.clip.body} /></clipPath>
          {C.eyes.map(function(e){ return <clipPath id={e.id} key={e.id}><path d={e.outline} /></clipPath>; })}
        </defs>
        <g stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <g id="charInk" stroke="none" className={MONO ? 'mono' : undefined}>
            <g id="bodyG" clipPath="url(#bodyClip)">
              <image href={C.src} width={C.width} height={C.height} transform={C.place} />
            </g>
            <g id="headG" clipPath="url(#headClip)">
              <image href={C.src} width={C.width} height={C.height} transform={C.place} />
              <g transform={C.place}>
                {C.eyes.map(function(e){
                  return (
                    <g key={e.id} clipPath={'url(#' + e.id + ')'}>
                      <path d={e.outline} fill={e.white} />
                      <g className="pupil">
                        <circle cx={e.pupil.cx} cy={e.pupil.cy} r={e.pupil.r} fill="#111010" />
                        <circle cx={e.pupil.cx - 10.5} cy={e.pupil.cy - 3.5} r="1.6" fill="#ffffff" opacity=".85" />
                        <circle cx={e.pupil.cx + 11} cy={e.pupil.cy - 1.5} r="1.1" fill="#ffffff" opacity=".6" />
                      </g>
                    </g>
                  );
                })}
              </g>
            </g>
            <g id="capG" clipPath="url(#capClip)">
              <image href={C.src} width={C.width} height={C.height} transform={C.place} />
            </g>
            {/* the empty rect only gives the wobble filter room to move the line */}
            <g filter="url(#boil)">
              <rect x="233" y="217" width="336" height="76" fill="none" />
              <path id="slit" d={C.slit} fill="none" stroke="#ffffff" strokeWidth="3.5" />
            </g>
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
    </>
  );
});

export default Intro;
