import React from 'react';
import { STICKER_SPOTS as SPOT } from './character';
import { STICKERS } from './content';

/* The stickers on the opening screen: small drawn buttons stuck around the character.
   They live in their own SVG, laid exactly over the intro's drawing (same viewBox),
   so their positions are in the same 800 x 600 space as the character.

   Each sticker is a real button: it takes keyboard focus, has a name for screen
   readers, and answers Enter and Space. Colors are not set here: the shapes carry
   classes (edge, face) and brain.css paints them from the palette.

     onPress: called with the sticker's `go` from content.js */

/* the lightning bolt, drawn in a box 65.5 wide and 100 tall.
   edge is the whole silhouette (outline and the thick side); face is the bright front */
var BOLT_EDGE = 'M15.7 0 L54.9 0 L65.5 14.7 L51 35.5 L55.3 35.7 L61.5 47 L1.7 100 L14.4 64 L0 49.3 Z';
var BOLT_FACE = 'M17.8 3.1 L51.7 3.1 L31.3 38.2 L52 38.6 L7.2 91.5 L23.8 47.1 L3.7 47.1 Z';

/* one sound mark: a short arc of a circle around the ear point, facing the direction `aim` */
function arc(r, aim, half){
  var a0 = (aim - half) * Math.PI / 180, a1 = (aim + half) * Math.PI / 180;
  var f = function(n){ return n.toFixed(1); };
  return 'M' + f(r * Math.cos(a0)) + ' ' + f(r * Math.sin(a0)) + ' A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(r * Math.cos(a1)) + ' ' + f(r * Math.sin(a1));
}

function Sticker({ id, name, transform, onPress, children }){
  var s = STICKERS[name];
  function press(){ onPress(s.go); }
  function onKey(e){
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); press(); }
  }
  return (
    <g transform={transform}>
      <g id={id} className="sticker" role="button" tabIndex={0} aria-label={s.label} onClick={press} onKeyDown={onKey}>
        <title>{s.label}</title>
        {children}
      </g>
    </g>
  );
}

export default function Stickers({ svgRef, mono, onPress }){
  var b = SPOT.bolt, a = SPOT.audio;
  var k = b.size / 100;
  /* three marks, evenly spaced out to the full reach; the closest one is the shortest */
  var marks = [.42, .71, 1].map(function(t, i){ return arc(a.size * t, a.aim, 30 + i * 4); });
  var rad = a.aim * Math.PI / 180;
  /* how far each mark nudges outward as the sound ripples, handed to the CSS animation */
  var nudge = { '--nx': (3 * Math.cos(rad)).toFixed(2) + 'px', '--ny': (3 * Math.sin(rad)).toFixed(2) + 'px' };
  /* the middle of the marks, for the press area and the focus ring */
  var mid = { x: a.size * .62 * Math.cos(rad), y: a.size * .62 * Math.sin(rad) };
  return (
    <svg id="stickerSvg" ref={svgRef} className={mono ? 'mono' : undefined} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
      <Sticker id="stickerBolt" name="bolt" onPress={onPress}
        transform={'translate(' + b.x + ' ' + b.y + ') rotate(' + (b.rotate || 0) + ') scale(' + k + ') translate(-32.75 -50)'}>
        <g className="sticker-art">
          <path className="edge" d={BOLT_EDGE} />
          <path className="face" d={BOLT_FACE} />
        </g>
        <rect className="ring" x="-9" y="-9" width="83.5" height="118" rx="14" />
        <rect className="hit" x="-9" y="-9" width="83.5" height="118" />
      </Sticker>
      <Sticker id="stickerAudio" name="audio" onPress={onPress} transform={'translate(' + a.x + ' ' + a.y + ')'}>
        <g className="sticker-art" style={nudge}>
          {marks.map(function(d, i){
            return (
              <g className={'mark mark-' + i} key={i}>
                <path className="edge shade" d={d} transform="translate(2 2.4)" />
                <path className="edge" d={d} />
                <path className="face" d={d} />
              </g>
            );
          })}
        </g>
        <circle className="ring" cx={mid.x} cy={mid.y} r={a.size * .62 + 6} />
        <circle className="hit" cx={mid.x} cy={mid.y} r={Math.max(26, a.size * .62 + 6)} />
      </Sticker>
    </svg>
  );
}
