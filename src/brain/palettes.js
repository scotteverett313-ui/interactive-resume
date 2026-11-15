/* ============================================================
   The brain's colors.

   Every color on the brain site comes from the active palette
   below. Nothing else in src/brain should contain a hex code,
   apart from character.js, which holds the colors that belong to
   the character art itself (eyes, the inside of the head).

   ROLES
     ground     the page behind everything: intro, pages
     mapGround  the ground behind the map
     paper      small surfaces that sit on the ground: buttons, tags, chips
     ink        lines and text
     muted      secondary text
     hubs       the three gravity points, each { fill, text }
                fill is the blob, text is the label that sits on it

   On the map, a node that only opens a page takes its hub's fill.
   A node that goes deeper uses ink.

   scheme tells the browser whether the palette is light or dark,
   so native bits such as scrollbars match.

   TO CHANGE A COLOR edit the value here. TO ADD A PALETTE add
   another entry with the same roles.
   ============================================================ */

export const PALETTES = {
  /* 1. Complementary (light): Aqua against Rust, its near-opposite on the color wheel */
  complementary: {
    name: 'Complementary',
    scheme: 'light',
    ground: '#E2DAC2',
    mapGround: '#E2DAC2',
    paper: '#E2DAC2',
    ink: '#222A2A',
    muted: '#525A57',
    hubs: {
      learn:   { fill: '#4FBBBC', text: '#222A2A' },
      teach:   { fill: '#EC4624', text: '#222A2A' },
      improve: { fill: '#F49885', text: '#222A2A' }
    }
  },

  /* 2. Split-complementary (dark): Heat as the base, with the two colors beside its opposite, Aqua and Indigo */
  split: {
    name: 'Split-complementary',
    scheme: 'dark',
    ground: '#222A2A',
    mapGround: '#222A2A',
    paper: '#222A2A',
    ink: '#E2DAC2',
    muted: '#B8B19C',
    hubs: {
      learn:   { fill: '#4FBBBC', text: '#222A2A' },
      teach:   { fill: '#F39120', text: '#222A2A' },
      improve: { fill: '#6764C4', text: '#FFFFFF' }
    }
  }
};

export const DEFAULT_PALETTE = 'complementary';

/* The palette as CSS custom properties, ready to spread onto the brain root's style. */
export function paletteVars(p){
  return {
    '--ground': p.ground,
    '--map-ground': p.mapGround,
    '--paper': p.paper,
    '--ink': p.ink,
    '--muted': p.muted,
    '--learn': p.hubs.learn.fill, '--learn-text': p.hubs.learn.text,
    '--teach': p.hubs.teach.fill, '--teach-text': p.hubs.teach.text,
    '--improve': p.hubs.improve.fill, '--improve-text': p.hubs.improve.text
  };
}
