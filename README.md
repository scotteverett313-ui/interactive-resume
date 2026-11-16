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

### Addresses

Every place in the brain has its own link, so anything can be shared, bookmarked,
or found by a search engine. Arriving on any link but the front door skips the
intro and lands straight on that place. The Back and Forward buttons work.

| Address | What it shows |
|---|---|
| `/` | The opening screen, then the map |
| `/work`, `/work/case-studies` | A level of the map |
| `/work/case-studies/civilla` | A page |
| `/work/resume` | The resume, shown on screen with a download button |
| `/orbit`, `/orbit/gardening` | The outer orbit's pages |
| `/work-with-me` | The SE\|Design services page |
| `/notes`, `/notes/<slug>` | The list of notes, and one note |
| `/resume` | The classic resume |

A node's part of the address comes from its label ("Case studies" becomes
`case-studies`).
Renaming a node changes its address. To pin it, give the node a `slug` in
`content.js`. The rules are in `src/brain/routes.js`.

### Work with me

One short page at `/work-with-me`: a headline, three ways to work with me, a
button to book a call, and a message form. Its words, the booking link, and the
social links are in `src/brain/studio.js`. Each of the three ways names a node
in `content.js` with `see`, and links to that place in the brain. The layout is
`src/brain/StudioPage.js`. The form sends through EmailJS using the settings in
`src/emailConfig.js`, the same ones the resume's form uses.

A node's page can link to it with `action: { label: '...', go: 'studio' }`.

### Notes

The blog. Each note is one entry in `src/brain/notes.js`, newest first. To post,
add an entry at the top; the comment in that file lists the fields. A note's
`links` become "Connects to" buttons that jump into the brain.

### The three gravity points

- **Work** is the body of work, sorted by what a visitor is looking for: Case
  studies, What I do, Background, and the Resume.
- **Teach** is teaching: where, what, workshops, and internships.
- **Build** is what I am making and getting better at now.

### The resume

`/work/resume` shows the resume on screen and offers it as a download. Two
things in `public/cv/` make that work: `scott-everett-resume.pdf` is the file
people download, and `page-1.webp` is a picture of its page, which is what
shows on screen (a picture displays on every phone; an embedded PDF does not).
To use a different resume, replace the PDF and export a picture of each page
under the same names, adding `page-2.webp` to the `pages` list in `content.js`
if it runs to two pages.

### Pictures on pages

Put a picture in `public/proof/` and point a page at it with
`image: '/proof/name.webp'`. Extra pictures for the "More" strip go in
`more: [...]`. Pages without one keep the striped placeholder.

### Old addresses

`vercel.json` sends the old Wix addresses to their new homes, so existing links
keep working once the domain points here: `/partnershiplevels`, `/contact`, and
`/stopguessing` go to `/work-with-me`, `/about` to `/`, `/blog` to `/notes`,
and `/post/<slug>` to `/notes/<slug>`. The old `/work` address needs no
redirect, since Work is now a level of the map. Links shared while the hubs
were called Learn and Improve go to `/work` and `/build`. They are temporary
redirects for now; change `"permanent": false` to `true` once the move is final.

### The titles

The headline on the opening screen and the one on the map are `TITLES` at the
top of `src/brain/content.js`. Each has a `title` and an optional small `sub`
line. The opening title fades as the intro starts; the map title shows at the
top level of the map and gives way to the breadcrumbs once you go into a hub.

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
- Set `MONO = true` in `character.js` to show the intro in grayscale.

The brain that lifts out is eight renders of the same brain, one per angle:
`src/brain/art/brain-00.webp` to `brain-07.webp`. The intro flips through
them in order as the brain turns. To swap or add frames, keep them square,
centered, and the same size, then list them in `BRAIN.frames` in
`character.js`. Any number of frames works.

Behind the head sits a blob of halftone dots, and the figure casts a soft
shadow onto it. That overlap is what
keeps the figure from reading flat. Its position, size, wobble, and dot grid
are the `BACKDROP` numbers in `character.js`. The shadow is a small blurred
copy of the figure's outline, `src/brain/art/scott-shadow.webp`; if the
character art changes, that file needs regenerating to match.

When the top of the head lifts off, the head is hollow: an elliptical opening
with a rim showing the thickness of the head's wall and a shadowed interior.
The back of the rim sits behind the brain and the front of it sits in front,
so the brain reads as sitting inside. The rim is dark where the cut passes
through the locs and skin-toned across the forehead. Its shape and colors are
`CHARACTER.inside` in `character.js`.

The scroll timeline in `src/brain/Intro.js` moves these layers by id, so keep
the names: `backdropG`, `insideG`, `rimG`, `bodyG`, `headG` (with two `.pupil` groups), `capG`, `slit`,
`brainWrap` (with one `.bv` image per angle), and `angleTag`.

### Colors, light mode and dark mode

Every color on the brain site comes from one file, `src/brain/palettes.js`.
It holds two palettes, `light` and `dark`, and each fills the same roles:

| Role | What it colors |
|---|---|
| `ground` | The page behind everything: intro and pages |
| `mapGround` | The ground behind the map |
| `paper` | Small surfaces on the ground: buttons, tags, chips |
| `ink` | Lines and text |
| `muted` | Secondary text |
| `hubs.work`, `hubs.teach`, `hubs.build` | Each gravity point: `fill` for the blob, `text` for the label on it |

On the map, blobs are flat shapes with no outline. A node that only opens a
page takes its hub's color; a node that goes deeper uses ink.

Inside a hub the nodes are scattered loosely, not arranged in a ring. The
scatter is seeded by the hub's `id`, so each level always looks the same, and
it knows how much room each label needs, so nodes never overlap each other or
the buttons and tags around the edge. Each node is joined to its nearest
neighbors in a branching web. Where a label sits, the connection lines are cut
away, so a line passes behind the words with nothing drawn around the text.
The scatter and the web are the `scatter` and `webLinks` functions in
`src/brain/blob.js`.

The dashed lines around the outside come in two kinds. A line from a curiosity
to the gravity point it feeds is dotted and tinted with that hub's color; the
dots flow toward the hub, and a pulse of hub color travels along it every few
seconds. A line between two curiosities is fine ink dashes. Hovering a
curiosity or a hub brightens its lines and speeds them up. Reduced motion
holds everything still and shows no pulses.

**Which mode a visitor sees.** They start in whichever their device is set to.
The round button in the bottom-right corner switches modes and remembers the
choice in that browser. Until they press it, the site keeps following the
device. Adding `?theme=light` or `?theme=dark` to the address opens that mode
for one visit, which is useful for sharing a link. This lives in
`src/brain/ThemeToggle.js`.

`BrainExperience.js` sets the active palette on the brain root as CSS custom
properties (`--ground`, `--paper`, `--ink`, `--muted`, `--work`, `--teach`,
`--build`, and a `-text` version of each hub). `brain.css` and the SVG use
only those, so there are no hex codes anywhere else. The one exception is
`character.js`, which holds colors that belong to the character art itself
(eyes, the cut line, the inside of the head) and stay the same in both modes.

To change a color, edit its value in `palettes.js`.

### The pace of the intro

The intro is scrubbed by scroll. Two things control how it feels:

- **How much scrolling it takes.** The height of `#intro` in
  `src/brain/brain.css` (300vh means two screens of scrolling). Taller is
  slower.
- **What happens when.** The timeline in `src/brain/Intro.js`, written in
  order with a comment on each phase: the cut, the lid lifting off, the brain
  rising, the head dropping away, and the zoom into the map. The numbers at the
  end of each line are start times; the timeline is 9 units long.

Once the brain is out of the head, letting go of the scroll plays the rest
through on its own. Before that point it stays wherever you stop.

During the zoom the map does not simply grow as one picture. The gravity
points start tiny at the center of the brain and spiral outward as it grows,
while the curiosities and their dotted connections start beyond the edges of
the screen and are pulled inward into orbit. That motion lives in the
"arrival" section of `src/brain/BrainMap.js`; the intro only tells it how far
along the zoom is.

### Where the rest lives

| File | What it does |
|---|---|
| `src/brain/content.js` | The content tree. The only file you need to edit. |
| `src/brain/BrainExperience.js` | Owns the state: current level, open page, intro done. |
| `src/brain/Intro.js` | The character layers and the scroll-scrubbed GSAP timeline. |
| `src/brain/character.js` | The character, brain, and backdrop art and their measurements. |
| `src/brain/BrainMap.js` | The map: blob morph loop, hover reach, drag and spring back, dive and rise, outer orbit. |
| `src/brain/NodePage.js` | The page layout and its Connects to buttons. |
| `src/brain/routes.js` | Addresses: which link shows what. |
| `src/brain/studio.js`, `StudioPage.js` | The Work with me page: its words, and its layout. |
| `src/brain/notes.js`, `NotesPage.js` | The notes: the writing, and the layout. |
| `src/brain/ContactForm.js`, `Sheet.js`, `SiteNav.js` | The message form, the full-screen page frame, and the two site buttons. |
| `src/brain/DotNav.js`, `Crumbs.js` | Depth dots and the breadcrumb trail. |
| `src/brain/palettes.js` | The light and dark palettes. The only place colors are defined. |
| `src/brain/ThemeToggle.js` | The light / dark button, and remembering the visitor's choice. |
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
│   │   ├── art/              <- scott-front.webp, scott-shadow.webp, brain-00..07.webp
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
