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
    tags:['Illustration','Process'],
    links:[{ to:'samples', why:'Where the pieces start.' }] } }
```

- `id` must be unique across the file. It is what links point at.
- A node with `kids: [ ... ]` goes deeper (a black blob). A node without
  `kids` is a leaf and opens a page (a white blob).
- A node with `kids` can have a `blurb`: one sentence shown under the
  breadcrumbs inside that level. A blurb still in `[brackets]` is not shown.
- Every field inside `page` is optional. Anything missing shows a placeholder.
- Text in `[square brackets]` is a placeholder and renders dashed-underlined.
  Brackets can sit inside a sentence; only that part is marked.
- `tags` are the disciplines and skills a page shows, drawn as small chips
  under its one-liner.
- A leaf written as `{ id, label, go:'studio' }` has no page: pressing it
  opens the Work with me page. `go:'gallery'` opens the Gallery.
- `links` become the **Connects to** buttons on the page. They can jump
  anywhere in the brain, up or down any branch. Links are one-way; add the
  reverse on the other node if you want it both ways.
- A page can hold pages of its own in `subs: [ ... ]`. Civilla does:
  Secretary of State and Project Cohere live under it, at
  `/work/civilla/secretary-of-state` and `/work/civilla/project-cohere`, and
  show on the Civilla page as a card each ("Inside Civilla"). On the map,
  Civilla is still a page blob.
- A case study's `study.sections` can be marked `fold: true`. Those are words
  folded in from pages that were parked (MDHHS on the Civilla page, the
  courses on the Teach page, the old Background pages on About). A folded
  section shows only what is written: any line or list item still in
  `[brackets]` waits in `content.js`, and a section with nothing written and
  no pictures does not show at all.
- A link to a page that was folded into another (`FOLDED` in `content.js`,
  for example `c2` → the Teach page) lands on the page it was folded into.

### The shape of the site

- **Work:** Civilla (with Secretary of State and Project Cohere under it),
  Robear Detroit, Micro Money Management, Wesson Art, and More (KRW,
  Martez Hurd, iRule).
- **Teach:** one page, UofM Flint, with the seven courses a line each.
  Teach has one page inside, so pressing Teach opens it.
- **Build:** First Fire, This Site, and More (Dirt Rich, VaultMark, Miss G).
- **About** (`/about`, `ABOUT` in `content.js`) and **Can't Stop Thinking
  About** (`/orbit`, `CURIO_ROOT`) are single pages outside the three
  gravity points.
- Everything else is parked, kept whole in `content.js`.

### Addresses

Every place in the brain has its own link, so anything can be shared, bookmarked,
or found by a search engine. Arriving on any link but the front door skips the
intro and lands straight on that place. The Back and Forward buttons work.

| Address | What it shows |
|---|---|
| `/` | The opening screen, then the map |
| `/work`, `/work/what-i-do/se-design` | A level of the map (levels nest as deep as the tree) |
| `/work/what-i-do/se-design/case-studies/robear-detroit` | A page |
| `/work/resume/resume-pdf` | The resume, shown on screen with a download button |
| `/orbit`, `/orbit/gardening` | The outer orbit's pages |
| `/work-with-me` | The SE\|Design services page |
| `/gallery` | Every picture on the site |
| `/the-work` | Just the work: six projects as tiles |
| `/notes`, `/notes/<slug>` | The list of notes, and one note |
| `/resume` | The classic resume |

A node's part of the address comes from its label ("Case Studies" becomes
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
A page button can also leave the site: `action: { label: '...', url:
'https://...' }` opens that address in a new tab.

### The menu and the bar along the bottom

The Menu button sits in the top-right corner of the opening screen and the
map. It opens a small card with Just the work, Work with me, Gallery and
Notes, then Skip intro (while the intro is on screen) or Replay intro (after
it). On the opening screen the card opens in place of the "What up doe."
speech bubble, tail and all, so the character says the menu; the bubble comes
back when it closes, and starting to scroll closes it. On the map it drops
down under the button. Escape, a press outside, or any choice closes it. The
menu is `src/brain/Menu.js`.

Along the bottom of the opening screen and the map: the status button on the
left ("Open for work", which opens Work with me), Just the work on the right,
and the round light and dark button in the corner. A page open over the map
covers the bar and the menu; the light and dark button stays.

The depth dots down the right edge show on the opening screen and the map
only. Pages and full-screen pages have their own way back, so the dots step
aside there.

### The gallery

Gallery, in the menu, shows every picture on the site in one
wall, at `/gallery`. There is nothing to maintain: the wall is gathered from
`content.js` (each page's `image` and `more`), so adding a picture to a page
puts it on the wall. Filters narrow it by gravity point and by tag. Pressing a
picture opens the viewer, where a button in the top left leads to the page
that picture is from. Its title and one line are `GALLERY` in `content.js`;
the gathering is `src/brain/gallery.js` and the page is
`src/brain/GalleryPage.js`.

A leaf written with `go:'gallery'` (the Gallery node under SE|Design) opens
the same wall narrowed to the level it sits in. Its `tags` are the filter
buttons, and its `gallery` list holds extra pictures that belong to no page:
`{ src: '/proof/name.webp', tag: 'Branding', caption: '...' }`.

### Case studies

A page with a `brief` or a `study` in `content.js` is laid out as a case
study instead of the usual two-panel page: a stack of rounded cards and
pictures, short at the top, with the full story underneath.

- **`brief`** is the short part: two or three fact cards (`cards`, such as
  Client, Services, Year), then `question`, `approach` and `impact`, each on
  its own card, then a few short `points`. The page's pictures sit between
  the cards. Every field is optional; a card with nothing written is left out,
  and text still in `[brackets]` shows as a placeholder.
- After the cards come the page's buttons, each a full-width card.
- **"The full story"** follows: the page's `study` if it has one (opening
  paragraphs, quick facts, titled sections with pictures and bullets),
  otherwise its `story` and `list`.
- The page ends with "Connects to" and a tall **Next** card that leads to the
  next page. Arrow keys and a sideways swipe turn the page too.

First Fire is the fullest example: find `id:'ff'` in `content.js`. The
comment "THE CASE STUDY LAYOUT" at the top of that file lists every field.
A picture that has not arrived yet is written as
`{ image: '[Image: what goes here]' }` and shows as a striped slot. Each
picture has a `caption` (shown in the viewer) and an `alt` (what a screen
reader reads). Screenshots of pixel art and flat diagrams are saved without
lossy compression so they stay crisp.

### Featured pages, and Next and Previous

A level can offer previews of pages straight from its own screen, however
deep they really sit. Give the level a `featured` list in `content.js`:

```js
featured:[
  { as:'Civilla', pages:['civoverview'] },
  { as:'SE|Design', image:'/proof/brand-system.webp', pages:['robear','martez','krw'] }
]
```

Each entry is one extra blob on that level, bigger than the rest, with a
picture inside and the tag "featured". `as` is the name under it. Pressing it
opens the first of its `pages`. The picture is the entry's `image`, or the
first page's own picture when there is none; with no picture at all it is a
plain color blob until that page gets one. Work, Teach and Build have
previews.

If a featured page is already one press away on that level, no second blob is
added: the one already there becomes the big one. That is how Build features
First Fire and VaultMark, which sit behind Games and Software.

Every page with neighbors has a bar at the bottom with Previous and Next.
Opened from a featured blob with several pages, they step through that list
in order. Opened any other way, or from a preview with one page, they step
through the other pages in the same level. A single-page preview whose page
has no neighbors steps through the level's other single-page previews instead
(First Fire and VaultMark).
The left and right arrow keys and a sideways swipe do the same, and the list
wraps around at the ends.

### A level as cards

A level with `view:'cards'` in `content.js` is shown as a row of large cards
that slide sideways, one per page, instead of blobs on the map: swipe on a
phone, or use the two arrow buttons. Each card shows the page's picture, name,
one line and tags, and opens the page. It suits a level that holds only
pages. Case Studies is the only one for now. The row is
`src/brain/LevelCards.js`.

### Just the work

"Just the work", bottom right and in the menu, skips the brain and opens a short stack of large tiles at `/the-work`, one per project: its name,
its first two tags, a number and its picture. A tile opens that project's
case study, and the Next card at the bottom of each one carries on through
the same list, so the six read as one run.

Which projects, and in what order, is `INDEX.picks` in `content.js`. `as`
gives a project a clearer name there than its page has ("Civilla" for
"Overview"), and the page wears that name when opened from the tiles. The page is `src/brain/IndexPage.js`.

### Single-item levels

A level with only one thing inside is passed straight through, so nobody
presses twice to reach one page. Pressing Apps opens Dirt Rich; pressing the
UX role lands inside Civilla. Back, Escape, and the breadcrumbs skip those
levels on the way up too. Nothing marks a level as pass-through: it is any
level with exactly one item, so adding a second item makes it a normal level
again. Addresses do not change (`/build/apps/dirt-rich`).

### Notes

The blog. Each note is one entry in `src/brain/notes.js`, newest first. To post,
add an entry at the top; the comment in that file lists the fields. A note's
`links` become "Connects to" buttons that jump into the brain.

### The three gravity points

- **Work** is the body of work: What I Do (SE|Design, the UX and research
  roles, Wesson Art), the Resume, and the Background.
- **Teach** is teaching: UofM Flint and the curriculum.
- **Build** is what I am making now: my stack, apps, games, software, and
  websites.

The map goes as deep as the tree does. The depth dots on the right count the
levels for themselves, a crowded level shrinks its blobs on a small screen
until nothing overlaps, and on a phone the breadcrumbs show only the last two
levels after a "…".

### The resume

`/work/resume/resume-pdf` shows the resume on screen and offers it as a download. Two
things in `public/cv/` make that work: `scott-everett-resume.pdf` is the file
people download, and `page-1.webp` is a picture of its page, which is what
shows on screen (a picture displays on every phone; an embedded PDF does not).
To use a different resume, replace the PDF and export a picture of each page
under the same names, adding `page-2.webp` to the `pages` list in `content.js`
if it runs to two pages.

### Pictures on pages

Put a picture in `public/proof/` and point a page at it with
`image: '/proof/name.webp'`. Extra pictures for the "More" strip go in
`more: [...]`. Pictures can sit in a folder per page (`/proof/krw/1.webp`).
The large picture is cropped to fill its panel; `focus: 'top'` (or `bottom`,
`left`, `right`) says which part to keep when the middle is the wrong part.
`fit: 'whole'` shows the entire picture in the panel instead of a crop.
Each picture has a small copy beside it, `name.thumb.webp` (about 520px),
used for the "More" strip, the Gallery wall and the featured blobs so those
load fast; the full picture is used in the large panel and the viewer. If a
small copy is missing, the full picture is used in its place.
Pages without a picture keep the striped placeholder. To give a
"More" picture its own caption, write it as
`{ src: '/proof/name.webp', caption: '...' }` instead of just the path.

Pressing any picture opens it in the viewer: the whole picture, uncropped,
full screen on a dark ground with its caption. Arrows, the arrow keys, and
swipes step through the page's pictures (`image` first, then `more`). Pinch,
double-tap, click, the mouse wheel, the Zoom button, or the + and - keys get
closer, and dragging moves around. Escape, Close, or a press outside the
picture closes it. The viewer is `src/brain/PictureViewer.js`. How sharp a
picture stays when zoomed depends on the file, so save pictures with detail
worth inspecting at about 2400px on the long side.

### Old addresses

`vercel.json` sends the old Wix addresses to their new homes, so existing links
keep working once the domain points here: `/partnershiplevels`, `/contact`, and
`/stopguessing` go to `/work-with-me`, `/about` to `/`, `/blog` to `/notes`,
and `/post/<slug>` to `/notes/<slug>`. The old `/work` address needs no
redirect, since Work is now a level of the map. Links shared while the hubs
were called Learn and Improve go to `/work` and `/build`. They are temporary
redirects for now; change `"permanent": false` to `true` once the move is final.

### The coffee in the head

Once the top of the head lifts off, the head fills with coffee and five things
bob up out of it: a coffee cup, papers and posters, a '90s computer, flowers,
and a stylus. Each is a button while it floats, with its name on hover:

| Thing | Goes to |
| --- | --- |
| Coffee cup | Work with me |
| Papers and posters | The Gallery |
| Computer | Build |
| Flowers | Dirt Rich |
| Stylus | Wesson Art |

Then the brain rises out of the coffee, they drift off, and the coffee drains.
The same five come back as stickers on the map's top level (with Work, Teach
and Build), turned a little as if slapped on by hand, with a short name under
each. They took the place of the five curiosity dots; the curiosities are still
one press away through "Can't stop thinking about" on the map and the lightning
bolt sticker. Where each sticker sits, on a landscape screen and on an upright
phone, and how far it is turned, is `MAP_STICKERS` in `content.js`; the short
names are `short` in `FLOATERS`. The sticker art, white border and shadow baked
in, is `src/brain/art/coffee/sticker-*.webp`.
Where each one goes, and its name, is `FLOATERS` in `content.js`. Where each one
floats (and how big it is) is `COFFEE` in `character.js`. The art is in
`src/brain/art/coffee/`, generated with Higgsfield in the character's clay style.

### The splash

On the first visit in a browser session, the front door opens with a full
screen card: the name rising in letter by letter, the title, and the SE|Design
logo stamping down under them (`public/logo.png`, recolored to the ink color so
it works light or dark). After about two seconds it slides up and the
character makes his entrance. A press, a key, a scroll or a swipe skips ahead.
It never shows on a link to anywhere else, or with reduced motion. The words
are `TITLES.splash` in `content.js`; the card is `src/brain/Splash.js`. Add
`?splash=1` to the address to see it again, or `?splash=0` to skip it.

### The titles

The headline on the opening screen and the one on the map are `TITLES` at the
top of `src/brain/content.js`. Each has a `title` and an optional small `sub`
line. The opening title fades as the intro starts; the map title shows at the
top level of the map and gives way to the breadcrumbs once you go into a hub.

The opening title sits in a speech bubble with a tail pointing at the
character. The bubble is as wide as the headline, and the small line wraps
under it. Its look is the `#homeTitle` rules in `src/brain/brain.css`.

### The stickers

The lightning bolt and the sound marks by the ear are buttons. Two places
control them:

- `STICKERS` in `src/brain/content.js`: each sticker's `label` (what a screen
  reader calls it) and `go` (where pressing it lands). `go` is any node id,
  `'curio'` for the Can't Stop Thinking About page, `'studio'` for Work with
  me, `'notes'`, or a web address starting with `https://` (a Spotify
  playlist, say), which opens in a new tab.
- `STICKER_SPOTS` in `src/brain/character.js`: where each one sits on the
  character (`x`, `y` in the 800 x 600 drawing), its `size`, the bolt's
  `rotate`, and the direction the sound marks spread (`aim`). On a phone the
  drawing is cropped to x 190 to 610, so keep stickers inside that range.

Their bright fill is the `spark` color in `src/brain/palettes.js`; the edge
is `ink`. The shapes are drawn in `src/brain/Stickers.js`. They fade with
the title as soon as scrolling starts, and come back on Replay intro.

### The lines said during the intro

As the intro scrolls, Scott says a few short lines in a speech bubble, one at
a time, in the corner the opening title leaves. They are `INTRO_SAYS` near
the top of `src/brain/content.js`: a plain list, in order. Any number works;
they share the scroll evenly, the first as the head opens and the last just
before the map settles.

### Open for work

`STATUS` in `src/brain/studio.js` controls the "Open for work" status: the
button in the bottom-left corner (it opens Work with me) and a line at the
top of the Work with me page. Change `label` for different words. Set
`open: false` and the button reads "Work with me" instead.

### Color on hover

Where there is a pointer to hover with, pictures in map blobs and Gallery
tiles rest in gray and show their color under the pointer or keyboard focus.
On a touch screen they stay in color.

### The More door

Each gravity point shows its projects as big picture blobs, plus one smaller
**More** blob that opens the rest (a node with `more: true` in `content.js`:
`workmore` under Work, `buildmore` under Build).

A page inside More shows only once it is ready: it has a picture (`image`, or
a case study `hero`), and its `lede` and `story` have no `[brackets]` left.
A page that is not ready is held back like a parked one: off the map, out of
the Gallery, and its address lands on its gravity point. Write its lines and
give it a picture, and it appears on its own. If nothing in a More is ready,
the More blob does not show at all.

Right now Work's More is hidden (KRW, Martez Hurd and iRule are waiting), and
Build's More shows Dirt Rich and VaultMark (Miss G is waiting).

### Parking a page

To take a page (or a whole level) off the site without losing it, add
`parked: true` to it in `content.js`:

```js
{ id:'sketch', label:'Sketchbook', parked:true, page:{ ... } }
```

A parked node, and everything under it:

- does not show on the map, in Just the work, in the Gallery, in featured
  previews, or in Next and Previous
- has no address: a visit to its old address lands on its gravity point
  (Work, Teach or Build)
- is skipped wherever another page links to it ("Connects to")

Nothing is deleted. Its words and pictures stay in `content.js`, ready to
come back: remove `parked: true` and it is live again, at the same address.
The curiosities under `CURIO_ROOT` can be parked the same way.

### Adding a node

1. Find the parent inside `ROOT` and add an object to its `kids`.
2. Give it a `page` (leaf) or its own `kids` (branch).
3. Link to it from elsewhere with `{ to:'<its id>', why:'...' }`.

### The outer orbit

`CURIO_ROOT` holds the loose curiosities drawn around the outside. Each one
also has `fx, fy` (position as a fraction of the screen), `hubs` (which of
`work`, `teach`, `build` it feeds, drawn as dashed lines), `also` (ids of
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
`brainWrap` (with one `.bv` image per angle), and `angleTag`. The stickers
are a second drawing, `stickerSvg`, laid exactly over the first.

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
| `spark` | The bright fill of the stickers on the opening screen |
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
properties (`--ground`, `--paper`, `--ink`, `--muted`, `--spark`, `--work`, `--teach`,
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
| `src/brain/Stickers.js` | The sticker buttons on the opening screen: the bolt and the sound marks. |
| `src/brain/PictureViewer.js` | The full-screen picture viewer that opens from a page's pictures. |
| `src/brain/gallery.js`, `GalleryPage.js` | The Gallery: every picture gathered from the content, and the wall that shows them. |
| `src/brain/character.js` | The character, brain, and backdrop art and their measurements. |
| `src/brain/BrainMap.js` | The map: blob morph loop, hover reach, drag and spring back, dive and rise, outer orbit. |
| `src/brain/NodePage.js` | The page layout and its Connects to buttons. |
| `src/brain/routes.js` | Addresses: which link shows what. |
| `src/brain/studio.js`, `StudioPage.js` | The Work with me page: its words, and its layout. |
| `src/brain/notes.js`, `NotesPage.js` | The notes: the writing, and the layout. |
| `src/brain/ContactForm.js`, `Sheet.js` | The message form, and the full-screen page frame. |
| `src/brain/Menu.js` | The menu: every way out, and Skip and Replay intro. On the opening screen it opens as the speech bubble. |
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
