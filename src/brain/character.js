import front from './art/scott-front.webp';
import shadow from './art/scott-shadow.webp';
import brain0 from './art/brain-00.webp';
import brain1 from './art/brain-01.webp';
import brain2 from './art/brain-02.webp';
import brain3 from './art/brain-03.webp';
import brain4 from './art/brain-04.webp';
import brain5 from './art/brain-05.webp';
import brain6 from './art/brain-06.webp';
import brain7 from './art/brain-07.webp';

/* ============================================================
   The character on the home page.

   The art is one image: the front view of the figure on a
   transparent background (src/brain/art/scott-front.webp).
   The intro needs it in layers, so instead of separate files the
   same image is drawn three times, each time cut to one region:

     body   everything below the chin line
     head   between the forehead cut and the chin line
     cap    everything above the forehead cut (lifts off)

   The forehead cut is the `slit` curve below. The eyes are redrawn
   as vectors on top of the image so the pupils can move.

   All numbers marked "image px" are measured on the image itself
   (524 x 990). Everything else is in the intro's 800 x 600 drawing space.

   TO SWAP THE ART for a new render of the same pose and size,
   replace the .webp file and keep the transparent background.
   A different pose or crop also needs new numbers here: `place`
   to position it, `slit` and `clip` for the forehead line, and
   the two eye outlines.
   ============================================================ */

/* Set this to true to show the whole intro (character, brain, backdrop) in grayscale. */
export const MONO = false;

/* ============================================================
   The brain that lifts out of the head.

   Eight renders of the same brain, one per angle, each a square
   image with the brain centered on a transparent background
   (src/brain/art/brain-00.webp to brain-07.webp). The intro shows
   one at a time and flips through them in order as the brain turns.

   TO SWAP OR ADD FRAMES keep them square, centered, and all the
   same size, then list them here in the order they should play.
   Any number of frames works.
   ============================================================ */
export const BRAIN = {
  frames: [brain0, brain1, brain2, brain3, brain4, brain5, brain6, brain7],
  /* center of the brain in the 800 x 600 drawing; it starts inside the head, behind the forehead cut */
  cx: 400, cy: 222,
  /* side of the square image in drawing units, and how much of that side the brain itself fills top to bottom */
  size: 188, fill: 0.84
};

export const CHARACTER = {
  src: front,
  width: 524, height: 990,
  /* where the image sits in the 800 x 600 drawing: forehead line at y = 250, face centered on x = 400 */
  place: 'translate(206.1 127.9) scale(0.74)',
  /* colors that belong to the art itself, so they stay the same in every palette:
     the cut line drawn across the forehead, the pupils, and the glints in them */
  slitColor: '#ffffff', pupilColor: '#111010', glintColor: '#ffffff',
  /* the forehead cut, drawn on by the first stretch of scroll */
  slit: 'M253 247 C315 262 487 262 549 247',
  clip: {
    cap: 'M-200 -600 H1000 V247 L549 247 C487 262 315 262 253 247 L-200 247 Z',
    head: 'M-200 246 L253 246 C315 261 487 261 549 246 L1000 246 V512 H-200 Z',
    body: 'M-200 510 H1000 V1600 H-200 Z',
    /* head and body together: everything below the forehead cut */
    lower: 'M-200 246 L253 246 C315 261 487 261 549 246 L1000 246 V1600 H-200 Z'
  },
  /* image px: the white of each eye, and the pupil inside it */
  eyes: [
    { id:'eyeL', white:'#f3ebe5', pupil:{ cx:187.0, cy:272.2, r:17.3 },
      outline:'M147.6 281.5 L148.5 278.7 L151.5 273.8 L154.5 271.0 L157.5 269.3 L160.5 268.2 L163.5 267.3 L166.5 266.8 L169.5 266.3 L172.5 267.0 L175.5 267.0 L178.5 267.0 L181.5 267.0 L184.5 267.0 L187.5 267.0 L190.5 267.0 L193.5 267.0 L196.5 267.0 L199.5 267.0 L202.5 267.0 L205.5 266.6 L208.5 267.3 L211.5 268.1 L214.5 269.3 L217.5 271.2 L220.5 274.9 L220.5 274.9 L221.4 279.6 L220.5 284.2 L220.5 284.2 L217.5 287.8 L214.5 289.9 L211.5 291.2 L208.5 292.2 L205.5 292.9 L202.5 293.4 L199.5 293.8 L196.5 294.0 L193.5 294.2 L190.5 294.2 L187.5 294.2 L184.5 294.1 L181.5 294.0 L178.5 293.8 L175.5 293.6 L172.5 293.1 L169.5 292.8 L166.5 292.2 L163.5 291.7 L160.5 291.0 L157.5 290.2 L154.5 289.2 L151.5 287.8 L148.5 284.4Z' },
    { id:'eyeR', white:'#f0e8e1', pupil:{ cx:336.5, cy:272.9, r:16.8 },
      outline:'M302.6 279.6 L303.5 274.8 L306.5 271.7 L309.5 269.6 L312.5 268.3 L315.5 267.4 L318.5 266.9 L321.5 267.5 L324.5 267.5 L327.5 267.5 L330.5 267.5 L333.5 267.5 L336.5 267.5 L339.5 267.5 L342.5 267.5 L345.5 267.5 L348.5 267.5 L351.5 267.5 L354.5 266.9 L357.5 267.6 L360.5 268.2 L362.5 268.9 L363.4 280.1 L362.5 291.4 L360.5 291.9 L357.5 292.7 L354.5 293.1 L351.5 293.7 L348.5 294.0 L345.5 294.2 L342.5 294.4 L339.5 294.7 L336.5 294.7 L333.5 294.7 L330.5 294.4 L327.5 294.3 L324.5 294.0 L321.5 293.7 L318.5 293.1 L315.5 292.3 L312.5 291.4 L309.5 290.1 L306.5 288.0 L303.5 284.4Z' }
  ],
  /* the inside of the head, seen once the cap lifts off. The opening is a shallow ellipse: its front
     edge is the forehead cut, its back edge bows up behind the brain. `outer` is the edge of the head,
     `inner` is the edge of the hollow, and the band between them is the thickness of the head's wall.
     The back of the rim and the hollow sit behind the brain; the front of the rim sits in front of it,
     so the brain reads as sitting inside the head. chord is the y where front and back meet. */
  inside: {
    outer: 'M253 247 C315 262 487 262 549 247 C487 207 315 207 253 247 Z',
    inner: 'M264 247 C322 255.5 480 255.5 538 247 C480 213.5 322 213.5 264 247 Z',
    chord: 247,
    /* the rim takes the color of what was cut through: locs at the sides and back, skin across the forehead.
       skinFrom and skinTo are where the forehead starts and ends along the cut, as a fraction of its width */
    rimHair: '#3f3736', rimSkin: '#e2976b', skinFrom: 0.199, skinTo: 0.747,
    wallTop: '#9a4c3a', wallDeep: '#33130f',
    /* a faint dark line around the rim */
    edge: 'rgba(0, 0, 0, 0.35)'
  },
  /* a soft blurred copy of the figure's outline, cast onto the shape behind the head.
     pad is the empty margin around the figure in that image (image px); offset is where
     the shadow falls relative to the figure, in drawing units (right and down) */
  shadow: { src: shadow, pad: 48, offset: { x: 12, y: 14 } },
  /* image px: how far the pupils shift when they look up at the brain */
  lookUp: { x:1.5, y:-6 }
};

/* ============================================================
   The shape behind the head.

   A soft wobbly blob of halftone dots with an outline. It sits
   behind the character so the hair breaks out of the top and the
   shoulders overlap the bottom, and the figure casts a soft shadow
   onto it. Together that keeps the figure from reading flat against
   the page. It drifts slowly, and it drops away with the head when
   the brain lifts out. Its colors come from the palette (see the
   "backdrop" rules in brain.css).

   cx, cy, r: center and radius in the 800 x 600 drawing
   amp:       how much the outline wobbles (0 is a perfect circle)
   dots:      spacing of the halftone grid, and the dot radius
   ============================================================ */
export const BACKDROP = {
  cx: 400, cy: 378, r: 204,
  seed: 2.4, amp: 0.045,
  dots: { gap: 8, r: 1.7 }
};

/* ============================================================
   The stickers on the opening screen.

   Small drawn buttons stuck around the character. What each one
   says and where it goes is in content.js (STICKERS); this is only
   where they sit. Their colors come from the palette (see the
   "stickers" rules in brain.css).

   x, y:   where the sticker's anchor sits in the 800 x 600 drawing.
           For the bolt that is its center. For the sound marks it is
           the point on the ear they spread out from.
   size:   bolt: its height. sound marks: how far the outer mark
           reaches from the ear.
   rotate: bolt: tilt in degrees, clockwise.
   aim:    sound marks: the direction they spread, in degrees
           (180 is straight left, 225 is up and to the left, 270 is up)

   On a phone the drawing is cropped to x 190 to 610, so keep
   stickers inside that range or they fall off the screen.
   ============================================================ */
export const STICKER_SPOTS = {
  bolt:  { x: 538, y: 128, size: 78, rotate: 8 },
  audio: { x: 234, y: 319, size: 44, aim: 222 }
};
