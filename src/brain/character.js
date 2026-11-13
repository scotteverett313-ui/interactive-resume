import front from './art/scott-front.webp';

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

/* The rest of the site is black and white. Set this to true to
   show the character in grayscale as well. */
export const MONO = false;

export const CHARACTER = {
  src: front,
  width: 524, height: 990,
  /* where the image sits in the 800 x 600 drawing: forehead line at y = 250, face centered on x = 400 */
  place: 'translate(206.1 127.9) scale(0.74)',
  /* the forehead cut, drawn on by the first stretch of scroll */
  slit: 'M253 247 C315 262 487 262 549 247',
  clip: {
    cap: 'M-200 -600 H1000 V247 L549 247 C487 262 315 262 253 247 L-200 247 Z',
    head: 'M-200 246 L253 246 C315 261 487 261 549 246 L1000 246 V512 H-200 Z',
    body: 'M-200 510 H1000 V1600 H-200 Z'
  },
  /* image px: the white of each eye, and the pupil inside it */
  eyes: [
    { id:'eyeL', white:'#f3ebe5', pupil:{ cx:187.0, cy:272.2, r:17.3 },
      outline:'M147.6 281.5 L148.5 278.7 L151.5 273.8 L154.5 271.0 L157.5 269.3 L160.5 268.2 L163.5 267.3 L166.5 266.8 L169.5 266.3 L172.5 267.0 L175.5 267.0 L178.5 267.0 L181.5 267.0 L184.5 267.0 L187.5 267.0 L190.5 267.0 L193.5 267.0 L196.5 267.0 L199.5 267.0 L202.5 267.0 L205.5 266.6 L208.5 267.3 L211.5 268.1 L214.5 269.3 L217.5 271.2 L220.5 274.9 L220.5 274.9 L221.4 279.6 L220.5 284.2 L220.5 284.2 L217.5 287.8 L214.5 289.9 L211.5 291.2 L208.5 292.2 L205.5 292.9 L202.5 293.4 L199.5 293.8 L196.5 294.0 L193.5 294.2 L190.5 294.2 L187.5 294.2 L184.5 294.1 L181.5 294.0 L178.5 293.8 L175.5 293.6 L172.5 293.1 L169.5 292.8 L166.5 292.2 L163.5 291.7 L160.5 291.0 L157.5 290.2 L154.5 289.2 L151.5 287.8 L148.5 284.4Z' },
    { id:'eyeR', white:'#f0e8e1', pupil:{ cx:336.5, cy:272.9, r:16.8 },
      outline:'M302.6 279.6 L303.5 274.8 L306.5 271.7 L309.5 269.6 L312.5 268.3 L315.5 267.4 L318.5 266.9 L321.5 267.5 L324.5 267.5 L327.5 267.5 L330.5 267.5 L333.5 267.5 L336.5 267.5 L339.5 267.5 L342.5 267.5 L345.5 267.5 L348.5 267.5 L351.5 267.5 L354.5 266.9 L357.5 267.6 L360.5 268.2 L362.5 268.9 L363.4 280.1 L362.5 291.4 L360.5 291.9 L357.5 292.7 L354.5 293.1 L351.5 293.7 L348.5 294.0 L345.5 294.2 L342.5 294.4 L339.5 294.7 L336.5 294.7 L333.5 294.7 L330.5 294.4 L327.5 294.3 L324.5 294.0 L321.5 293.7 L318.5 293.1 L315.5 292.3 L312.5 291.4 L309.5 290.1 L306.5 288.0 L303.5 284.4Z' }
  ],
  /* image px: how far the pupils shift when they look up at the brain */
  lookUp: { x:1.5, y:-6 }
};
