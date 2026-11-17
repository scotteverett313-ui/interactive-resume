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
     hubs       the three gravity points (work, teach, build), each { fill, text }
                fill is the blob, text is the label that sits on it
     spark      the bright fill of the stickers on the opening screen
                (the lightning bolt, the sound marks by the ear)

   On the map, a node that only opens a page takes its hub's fill.
   A node that goes deeper uses ink.

   There are two palettes, one for light mode and one for dark
   mode. The visitor's device picks which one they start in, and
   the toggle button switches between them (see ThemeToggle.js).

   scheme tells the browser whether the palette is light or dark,
   so native bits such as scrollbars match.

   TO CHANGE A COLOR edit the value here.
   ============================================================ */

export const PALETTES = {
  /* Light mode. Complementary: Aqua against Rust, its near-opposite on the color wheel */
  light: {
    name: 'Complementary',
    scheme: 'light',
    ground: '#E2DAC2',
    mapGround: '#E2DAC2',
    paper: '#E2DAC2',
    ink: '#222A2A',
    muted: '#525A57',
    spark: '#F39120',
    hubs: {
      work:  { fill: '#4FBBBC', text: '#222A2A' },
      teach: { fill: '#EC4624', text: '#222A2A' },
      build: { fill: '#F49885', text: '#222A2A' }
    }
  },

  /* Dark mode. Split-complementary: Heat as the base, with the two colors beside its opposite, Aqua and Indigo */
  dark: {
    name: 'Split-complementary',
    scheme: 'dark',
    ground: '#222A2A',
    mapGround: '#222A2A',
    paper: '#222A2A',
    ink: '#E2DAC2',
    muted: '#B8B19C',
    spark: '#F39120',
    hubs: {
      work:  { fill: '#4FBBBC', text: '#222A2A' },
      teach: { fill: '#F39120', text: '#222A2A' },
      build: { fill: '#6764C4', text: '#FFFFFF' }
    }
  }
};

/* The palette as CSS custom properties, ready to spread onto the brain root's style. */
export function paletteVars(p){
  return {
    '--ground': p.ground,
    '--map-ground': p.mapGround,
    '--paper': p.paper,
    '--ink': p.ink,
    '--muted': p.muted,
    '--spark': p.spark,
    '--work': p.hubs.work.fill, '--work-text': p.hubs.work.text,
    '--teach': p.hubs.teach.fill, '--teach-text': p.hubs.teach.text,
    '--build': p.hubs.build.fill, '--build-text': p.hubs.build.text
  };
}
