import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CHARACTER as C, BRAIN as B, BACKDROP as K, MONO } from './character';
import { blobPath } from './blob';
import Stickers from './Stickers';
import { INTRO_SAYS } from './content';

gsap.registerPlugin(ScrollTrigger);

/* The character and the scroll intro. An inline SVG with separate layers
   so the timeline can move each one. Keep these ids and classes stable:

     #backdropG  the halftone blob behind the head (contains the #backdrop path)
     #insideG    the hollow and back rim of the open head, behind the brain
     #bodyG      hoodie and everything below the chin line
     #headG      face, between the forehead cut and the chin (contains .pupil x2)
     #rimG       the front of the head's rim, in front of the brain
     #capG       top of the head above the forehead cut; lifts off
     #slit       the line that draws across the forehead
     #brainWrap  the brain, lifts out and zooms (contains one .bv image per angle)
     #angleTag   "angle n / 8" caption
     #boil       the hand-drawn line wobble filter (slit, and the map links)
     #stickerSvg the sticker buttons, in their own drawing laid over this one (see Stickers.js)
     #introSays  the lines Scott says as the intro scrolls, one .say per line (the words are in content.js)

   The art and its measurements live in character.js.

   Scrolling the tall #intro section scrubs a GSAP timeline:

     1. a cut draws across the forehead
     2. the top of the head lifts off and leaves through the top of the screen
     3. the brain rises out of the hollow head, already turning
     4. the head drops away while the brain keeps turning and starts to grow
     5. the map's gravity points and connections appear inside the brain and
        grow with it, the brain dissolves, and the map is left full screen

   The phases overlap so something is always moving. Past the point where the
   brain is out, letting go of the scroll plays the rest through on its own.

     sectionRef:  the tall #intro section ScrollTrigger watches
     mapLayerRef: the map layer, faded in during the zoom
     onMapArrival: called with 0 to 1 as the map comes together during the zoom
     dotTagRef:   the depth-nav tag, written with the scroll percent
     done:        true once the intro is finished or skipped; false again on replay
     onFinish:    called when the scrub reaches the end
     onSticker:   called with where a sticker goes when it is pressed

   The ref handle exposes mapShowing() so the map only draws once it is on screen. */

/* how many times bigger the brain gets by the end of the zoom */
var ZOOM = 11;
/* a steady zoom: each bit of scroll multiplies the size by the same amount,
   so it never stalls at the start or rushes at the end */
function zoomEase(p){ return (Math.pow(ZOOM, p) - 1) / (ZOOM - 1); }

var Intro = forwardRef(function Intro({ stageRef, sectionRef, mapLayerRef, dotTagRef, reduce, done, onFinish, onMapArrival, onSticker }, ref){
  var svgRef = useRef(null), stickRef = useRef(null), boilRef = useRef(null), backdropRef = useRef(null), backdropClipRef = useRef(null);
  var tlRef = useRef(null), triggerRef = useRef(null);
  var onFinishRef = useRef(onFinish); onFinishRef.current = onFinish;
  var onArriveRef = useRef(onMapArrival); onArriveRef.current = onMapArrival;

  /* build the timeline once; it is driven by ScrollTrigger, or jumped to 0 / 1 by the effect below */
  useEffect(function(){
    var svg = svgRef.current, $ = function(sel){ return svg.querySelector(sel); };
    var variants = svg.querySelectorAll('.bv'), angleTag = $('#angleTag'), slit = $('#slit');
    var turn = { a:0 }, shownVariant = 0;
    var nVariants = variants.length;
    function setVariant(){
      var i = Math.round(turn.a) % nVariants;
      if (i === shownVariant) return;
      variants[shownVariant].style.display = 'none';
      variants[i].style.display = '';
      shownVariant = i;
      angleTag.textContent = 'angle ' + (i + 1) + ' / ' + nVariants;
    }
    /* lift until the top of the brain sits just inside the top of the drawing */
    var lift = -(B.cy - B.size * B.fill / 2 - 8);
    var hint = sectionRef.current.querySelector('#hint'), homeTitle = sectionRef.current.querySelector('#homeTitle');
    gsap.set($('#brainWrap'), { svgOrigin:B.cx + ' ' + B.cy });
    /* one dash as long as the whole line, slid into view, draws the cut on */
    var slitLen = Math.ceil(slit.getTotalLength()) + 2;
    slit.setAttribute('stroke-dasharray', slitLen);
    /* everything that travels with the head when it drops away */
    var figure = [$('#headG'), $('#bodyG'), $('#backdropG'), $('#insideG'), $('#rimG')];
    var brain = $('#brainWrap'), mapLayer = mapLayerRef.current;
    /* the top of the head and its shadow tilt around the middle of the cap as they lift */
    var cap = [$('#capG'), $('#capShade')];
    gsap.set(cap, { svgOrigin:'400 205' });

    var arrive = { p:0 };
    var tl = gsap.timeline({ paused:true });
    /* Every tween below whose target also has an "intro is done" rule in brain.css is given its starting value
       outright (fromTo), never read from the page. When the intro is skipped, or the visit starts on a deep link,
       the timeline's first move is a jump to the end with those rules already applied; a start value read then
       would be the finished one, and Replay would rewind to a map still showing on top of the character */
    tl.fromTo(hint, { opacity:1 }, { opacity:0, duration:.5 }, 0)
      /* the opening title lifts away as the scroll begins */
      .to(homeTitle, { opacity:0, y:-14, duration:.9, ease:'power1.in' }, 0)
      /* the stickers go with it; autoAlpha also hides them, so they cannot be pressed or tabbed to once gone */
      .fromTo(stickRef.current, { autoAlpha:1, y:0 }, { autoAlpha:0, y:-14, duration:.7, ease:'power1.in' }, 0)

      /* 1. the cut draws across the forehead */
      .fromTo(slit, { opacity:0 }, { opacity:1, duration:.3 }, 0)
      .fromTo(slit, { attr:{ 'stroke-dashoffset':slitLen } }, { attr:{ 'stroke-dashoffset':0 }, duration:1, ease:'none' }, 0)

      /* 2. the top of the head lifts off: slow at first, then gone through the top of the screen.
            No fade. The brain and the inside of the head are switched on underneath it just before */
      .to([brain, $('#insideG'), $('#rimG')], { opacity:1, duration:.15 }, 1)
      .to(cap, { y:-480, rotation:-8, duration:2.4, ease:'power2.in' }, 1)
      .to(slit, { opacity:0, duration:.4 }, 1.2)

      /* 3. the brain rises out once the lid is clear, turning as it comes; the head sinks to give it room */
      .to(brain, { y:lift, duration:2.2, ease:'power2.inOut' }, 2.2)
      .to(figure, { y:150, duration:2, ease:'power2.inOut' }, 2.4)
      .to(svg.querySelectorAll('.pupil'), { y:C.lookUp.y, x:C.lookUp.x, duration:.8 }, 2.6)
      .to(turn, { a:nVariants - 1, duration:4.4, ease:'none', onUpdate:setVariant }, 3)
      .to(angleTag, { opacity:1, duration:.3 }, 3.4)
      .to(angleTag, { opacity:0, duration:.3 }, 5)

      /* 4. the head drops away while the brain settles in the middle and starts to grow */
      .addLabel('zoom', 4.4)
      .to(figure, { y:560, duration:1.6, ease:'power2.in' }, 'zoom')
      .to($('#backdropG'), { opacity:0, duration:1, ease:'power1.in' }, 'zoom')
      .to(brain, { y:78, duration:1, ease:'power2.inOut' }, 'zoom')
      .to(brain, { scale:ZOOM, duration:4.6, ease:zoomEase }, 'zoom')

      /* 5. the map comes together on top of the growing brain: the gravity points spiral out from its center
            while the curiosities and their connections sweep in from beyond the screen (BrainMap moves each
            part; this only tells it how far along we are). Then the brain dissolves underneath */
      .addLabel('map', 5)
      .fromTo(mapLayer, { opacity:0 }, { opacity:1, duration:.4 }, 'map')
      .fromTo(arrive, { p:0 }, { p:1, duration:4, ease:'none', onUpdate:function(){ onArriveRef.current(arrive.p); } }, 'map')
      .to(brain, { opacity:0, duration:1.6 }, 7.2)
      .to(svg, { opacity:0, duration:.6 }, 8.4);
    /* the lines said along the way: each gets an equal share of the stretch between the title leaving and the
       map settling, rises in, holds, and lifts away as the next one comes */
    var says = sectionRef.current.querySelectorAll('#introSays .say');
    var from = 1, until = 6.4, share = says.length ? (until - from) / says.length : 0;
    says.forEach(function(el, i){
      var at = from + i * share;
      tl.fromTo(el, { autoAlpha:0, y:12 }, { autoAlpha:1, y:0, duration:.3, ease:'power2.out' }, at)
        .to(el, { autoAlpha:0, y:-10, duration:.25, ease:'power1.in' }, at + share - .28);
    });
    tlRef.current = tl;
    return function(){
      if (triggerRef.current){ triggerRef.current.kill(); triggerRef.current = null; }
      tl.kill(); tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* the moment the intro is done, stop listening to scroll. This runs before the page jumps back to the top,
     so that jump is never read as "the intro is at 0%" */
  useLayoutEffect(function(){
    if (done && triggerRef.current){ triggerRef.current.kill(); triggerRef.current = null; }
  }, [done]);

  /* done: park the timeline at the end. not done (first load, or replay): rewind and let scroll drive it */
  useEffect(function(){
    var tl = tlRef.current; if (!tl) return;
    if (triggerRef.current){ triggerRef.current.kill(); triggerRef.current = null; }
    if (done){
      tl.progress(1);
      onArriveRef.current(1);
      return;
    }
    tl.progress(0);
    onArriveRef.current(0);
    /* past this point the brain is out of the head, and the rest plays through on its own */
    var autoFrom = tl.labels.zoom / tl.duration();
    triggerRef.current = ScrollTrigger.create({
      trigger:sectionRef.current, start:'top top', end:'bottom bottom', scrub:.3, animation:tl,
      /* let go while scrolling forward past autoFrom and the scroll carries on to the end; anywhere else it stays put */
      snap:{
        snapTo:function(p, self){ return self.direction > 0 && self.progress > autoFrom ? 1 : self.progress; },
        duration:{ min:.8, max:2.2 }, delay:.05, ease:'power1.inOut', inertia:false
      },
      onUpdate:function(self){
        if (dotTagRef.current) dotTagRef.current.textContent = 'Intro ' + Math.round(self.progress * 100) + '%';
        if (self.progress > .995 && tl.progress() > .99) onFinishRef.current();
      },
      /* finish once the smoothed animation has caught up with the scroll, so the last moment is not cut off */
      onScrubComplete:function(self){ if (self.progress > .995) onFinishRef.current(); }
    });
    ScrollTrigger.refresh();
  }, [done, sectionRef, dotTagRef]);

  useImperativeHandle(ref, function(){
    return {
      progress:function(){ return tlRef.current ? tlRef.current.progress() : 0; },
      /* true from just before the map starts to fade in during the zoom */
      mapShowing:function(){ var tl = tlRef.current; return !!tl && tl.time() >= tl.labels.map - .1; }
    };
  }, []);

  /* tall phone screens: crop in on the bust so it fills the height instead of floating small */
  useEffect(function(){
    function fitIntro(){
      var r = stageRef.current.getBoundingClientRect();
      var box = r.width / r.height < .8 ? '190 30 420 570' : '0 0 800 600';
      svgRef.current.setAttribute('viewBox', box);
      stickRef.current.setAttribute('viewBox', box); /* the stickers stay locked to the character */
    }
    fitIntro();
    window.addEventListener('resize', fitIntro);
    return function(){ window.removeEventListener('resize', fitIntro); };
  }, [stageRef]);

  /* fetch and decode every brain frame up front, so flipping between them during the turn never flashes empty */
  useEffect(function(){
    B.frames.forEach(function(src){
      var im = new Image();
      im.src = src;
      if (im.decode) im.decode().catch(function(){});
    });
  }, []);

  /* the blob behind the head drifts slowly while the intro is on screen; written straight to the path, no React state */
  useEffect(function(){
    if (reduce || done) return undefined;
    var raf = 0, path = backdropRef.current, clip = backdropClipRef.current;
    function frame(now){
      var d = blobPath(K.cx, K.cy, K.r, now / 1000 * .6, K.seed, K.amp, 0, 0);
      path.setAttribute('d', d);
      clip.setAttribute('d', d); /* the shadow is cut to the same outline */
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return function(){ cancelAnimationFrame(raf); };
  }, [reduce, done]);

  /* boil: redraw the line wobble a few times a second, like a hand-drawn loop */
  useEffect(function(){
    if (reduce) return undefined;
    var seedN = 1, boilT = boilRef.current;
    var id = setInterval(function(){ seedN = seedN % 5 + 1; boilT.setAttribute('seed', seedN); }, 120);
    return function(){ clearInterval(id); };
  }, [reduce]);

  /* the head's wall, seen from above where it was cut: the band between the outer and inner edge */
  var rimD = C.inside.outer + ' ' + C.inside.inner;
  var rimBack = <path d={rimD} fillRule="evenodd" fill={C.inside.rimHair} stroke={C.inside.edge} strokeWidth=".8" />;
  var rimFront = <path d={rimD} fillRule="evenodd" fill="url(#rimFrontFill)" stroke={C.inside.edge} strokeWidth=".8" />;
  var blob0 = blobPath(K.cx, K.cy, K.r, 0, K.seed, K.amp, 0, 0);
  var pad = C.shadow.pad;
  var shade = <image href={C.shadow.src} x={-pad} y={-pad} width={C.width + pad * 2} height={C.height + pad * 2} transform={C.place} />;

  return (
    <>
      <svg id="introSvg" ref={svgRef} className={MONO ? 'mono' : undefined} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" role="img"
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
          <clipPath id="lowerClip"><path d={C.clip.lower} /></clipPath>
          <clipPath id="rimFrontClip"><rect x="0" y={C.inside.chord} width="800" height="60" /></clipPath>
          <linearGradient id="rimFrontFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset={C.inside.skinFrom - .008} stopColor={C.inside.rimHair} />
            <stop offset={C.inside.skinFrom + .008} stopColor={C.inside.rimSkin} />
            <stop offset={C.inside.skinTo - .008} stopColor={C.inside.rimSkin} />
            <stop offset={C.inside.skinTo + .008} stopColor={C.inside.rimHair} />
          </linearGradient>
          <linearGradient id="insideWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.inside.wallTop} />
            <stop offset="1" stopColor={C.inside.wallDeep} />
          </linearGradient>
          <clipPath id="backdropClip"><path ref={backdropClipRef} d={blob0} /></clipPath>
          <pattern id="introDots" width={K.dots.gap} height={K.dots.gap} patternUnits="userSpaceOnUse">
            <rect className="dots-ground" width={K.dots.gap} height={K.dots.gap} />
            <circle className="dots-dot" cx={K.dots.gap / 2} cy={K.dots.gap / 2} r={K.dots.r} />
          </pattern>
        </defs>
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* furthest back: the shape behind the head */}
          <g id="backdropG">
            <path id="backdrop" ref={backdropRef} d={blob0} fill="url(#introDots)" />
            {/* the figure's soft shadow, falling only on the shape. The cap's part is separate so it leaves with the cap */}
            <g clipPath="url(#backdropClip)">
              <g transform={'translate(' + C.shadow.offset.x + ' ' + C.shadow.offset.y + ')'}>
                <g id="capShade" clipPath="url(#capClip)">{shade}</g>
                <g clipPath="url(#lowerClip)">{shade}</g>
              </g>
            </g>
          </g>

          {/* the inside of the head: the shadowed hollow and the whole rim, behind the brain */}
          <g id="insideG" stroke="none" opacity="0">
            <path d={C.inside.inner} fill="url(#insideWall)" />
            {rimBack}
          </g>

          {/* the brain comes next so it sits behind the character: it shows inside the open head and rises out from behind the forehead cut */}
          <g id="brainWrap" opacity="0">
            {B.frames.map(function(src, i){
              return (
                <image className="bv" key={i} href={src} x={B.cx - B.size / 2} y={B.cy - B.size / 2} width={B.size} height={B.size}
                  style={i ? { display:'none' } : undefined} />
              );
            })}
          </g>

          <g id="charInk" stroke="none">
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
                        <circle cx={e.pupil.cx} cy={e.pupil.cy} r={e.pupil.r} fill={C.pupilColor} />
                        <circle cx={e.pupil.cx - 10.5} cy={e.pupil.cy - 3.5} r="1.6" fill={C.glintColor} opacity=".85" />
                        <circle cx={e.pupil.cx + 11} cy={e.pupil.cy - 1.5} r="1.1" fill={C.glintColor} opacity=".6" />
                      </g>
                    </g>
                  );
                })}
              </g>
            </g>
            {/* the front of the rim again, drawn over the brain so the brain sits inside the head */}
            <g id="rimG" clipPath="url(#rimFrontClip)" opacity="0">{rimFront}</g>
            <g id="capG" clipPath="url(#capClip)">
              <image href={C.src} width={C.width} height={C.height} transform={C.place} />
            </g>
            {/* the empty rect only gives the wobble filter room to move the line */}
            <g filter="url(#boil)">
              <rect x="233" y="217" width="336" height="76" fill="none" />
              <path id="slit" d={C.slit} fill="none" stroke={C.slitColor} strokeWidth="3.5" />
            </g>
          </g>

          <text id="angleTag" x="400" y="570" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="14" opacity="0">{'angle 1 / ' + B.frames.length}</text>
        </g>
      </svg>
      <Stickers svgRef={stickRef} mono={MONO} onPress={onSticker} />
      <div id="hint"><span>Scroll to open</span><span className="line" /></div>
      <div id="introSays">
        {INTRO_SAYS.map(function(t, i){ return <p className="say" key={i}>{t}</p>; })}
      </div>
    </>
  );
});

export default Intro;
