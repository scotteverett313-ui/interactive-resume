# Scott Everett - Interactive Resume

A bold, animated React-based interactive resume showcasing my work as a Sr. UX/UI Designer & Educator.

On the `brain` branch the home page is **Inside Scott's Brain**: scroll opens an
illustrated bust, the brain lifts out and zooms, and the map inside holds
everything I learn, teach, and am improving. The classic resume still lives at
`/resume`.

## Features

- **Bold Yellow/Black Branding** - Matches your personal brand identity
- **Scroll Animations** - Smooth, engaging animations as users scroll
- **Interactive Timeline** - Visual career history with hover effects
- **Filterable Project Gallery** - Filter projects by category
- **Skills Display** - Organized skill categories with hover interactions
- **Contact Form** - Ready for backend integration
- **Fully Responsive** - Works on all devices

## Getting Started

### Prerequisites

You'll need Node.js installed on your computer. Download it from:
https://nodejs.org/ (LTS version recommended)

### Installation

1. Open Terminal and navigate to this folder:
   ```bash
   cd "/Users/scotteverett/Library/CloudStorage/GoogleDrive-scotteverett313@gmail.com/My Drive/SE Design | House/Claude Code/interactive-resume"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Customization

### Adding Your Photo

Replace the placeholder in `src/components/Hero.js` and `src/components/About.js` with your actual image:

```jsx
<img src="/path/to/your-photo.jpg" alt="Scott Everett" className="hero-img" />
```

### Updating Social Links

Edit the `socialLinks` array in `src/components/Footer.js` with your actual URLs.

### Contact Form Integration

The contact form currently logs to console. To make it functional:
1. Use a service like Formspree, EmailJS, or Netlify Forms
2. Or connect to your own backend API

## How to edit the brain

Everything the brain says lives in one file: `src/brain/content.js`. You do
not need to touch any component to change the content.

### The shape of a node

```js
{ id:'sketch', label:'Sketchbook', page:{
    lede:'Let loose.',
    story:'Random thoughts and drawings, shapes and wireframes.',
    list:['One thing', 'Another thing'],
    proof:'[Photos of sketchbook spreads]',
    links:[{ to:'wesson', why:'Where the pieces start.' }] } }
```

- `id` must be unique across the file. It is what links point at.
- A node with `kids: [ ... ]` goes deeper (a black blob). A node without
  `kids` is a leaf and opens a page (a white blob).
- Every field inside `page` is optional. Anything missing shows a placeholder.
- Text in `[square brackets]` is a placeholder and renders dashed-underlined.
- `links` become the **Connects to** buttons on the page. They can jump
  anywhere in the brain, up or down any branch. Links are one-way; add the
  reverse on the other node if you want it both ways.

### Adding a node

1. Find the parent inside `ROOT` and add an object to its `kids`.
2. Give it a `page` (leaf) or its own `kids` (branch).
3. Link to it from elsewhere with `{ to:'<its id>', why:'...' }`.

### The outer orbit

`CURIO_ROOT` holds the loose curiosities drawn around the outside. Each one
also has `fx, fy` (position as a fraction of the screen), `hubs` (which of
`learn`, `teach`, `improve` it feeds, drawn as dashed lines), `also` (ids of
other curiosities it touches), and an optional `sub` tag.

### The character

The figure on the home page is one image, `src/brain/art/scott-front.webp`:
the front view on a transparent background. The intro needs it in layers, so
`src/brain/character.js` draws the same image three times, each cut to one
region: body, head, and the cap above the forehead line that lifts off. The
eyes are redrawn as vectors on top so the pupils can look up at the brain.

- To swap in a new render of the same pose and size, replace the `.webp`.
- A different pose or crop also needs new numbers in `character.js`: where
  the image sits, the forehead line, and the two eye outlines.
- The rest of the site is black and white. Set `MONO = true` in
  `character.js` to show the character and the brain in grayscale too.

The brain that lifts out is eight renders of the same brain, one per angle:
`src/brain/art/brain-00.webp` to `brain-07.webp`. The intro flips through
them in order as the brain turns. To swap or add frames, keep them square,
centered, and the same size, then list them in `BRAIN.frames` in
`character.js`. Any number of frames works.

The scroll timeline in `src/brain/Intro.js` moves these layers by id, so keep
the names: `bodyG`, `headG` (with two `.pupil` groups), `capG`, `slit`,
`brainWrap` (with one `.bv` image per angle), and `angleTag`.

### Where the rest lives

| File | What it does |
|---|---|
| `src/brain/content.js` | The content tree. The only file you need to edit. |
| `src/brain/BrainExperience.js` | Owns the state: current level, open page, intro done. |
| `src/brain/Intro.js` | The character layers and the scroll-scrubbed GSAP timeline. |
| `src/brain/character.js` | The character and brain art and their measurements. |
| `src/brain/BrainMap.js` | The map: blob morph loop, hover reach, drag and spring back, dive and rise, outer orbit. |
| `src/brain/NodePage.js` | The page layout and its Connects to buttons. |
| `src/brain/DotNav.js`, `Crumbs.js` | Depth dots and the breadcrumb trail. |
| `src/brain/blob.js` | The blob path math, pure functions. |
| `src/brain/brain.css` | All brain styles, scoped so they never touch the resume. |

Keyboard: every node is focusable, Enter or Space activates it, Escape goes
up a level. `prefers-reduced-motion` skips the intro and stills the motion.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build` folder, ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

## Tech Stack

- React 18
- React Router
- GSAP + ScrollTrigger (the brain intro and map)
- Framer Motion (resume animations)
- React Intersection Observer (scroll triggers)
- CSS Custom Properties (theming)

## Project Structure

```
interactive-resume/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── About.js
│   │   ├── Experience.js
│   │   ├── Skills.js
│   │   ├── Projects.js
│   │   ├── Education.js
│   │   ├── Contact.js
│   │   └── Footer.js
│   ├── brain/
│   │   ├── content.js        <- edit this
│   │   ├── BrainExperience.js
│   │   ├── Intro.js
│   │   ├── character.js
│   │   ├── art/              <- scott-front.webp, brain-00..07.webp
│   │   ├── BrainMap.js
│   │   ├── NodePage.js
│   │   ├── DotNav.js
│   │   ├── Crumbs.js
│   │   ├── blob.js
│   │   └── brain.css
│   ├── styles/
│   │   ├── index.css
│   │   └── App.css
│   ├── App.js
│   └── index.js
└── package.json
```
