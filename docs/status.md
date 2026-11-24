# Inside Scott's Brain: status

As of Nov 24, 2026. Paste this into a new chat session to pick up where we left off.

## In progress: the focus pass

Shrinking the site so every page that shows is finished. Six steps, each committed on its own:

1. **Parking** (done): `parked: true` in content.js takes a node off the site without deleting it (see README, "Parking a page"). The Sketchbook is parked.
2. **The new tree** (done): Work (Civilla with two sub-pages, Robear, MMM, Wesson Art, More), Teach (one page), Build (First Fire, This Site, More), About and Can't Stop Thinking About as single pages. Folded sections show only written lines.
3. **The "More" door** (done): projects are big picture blobs; one small More blob shows pages that have a picture and no [brackets]. Work's More is hidden for now (KRW, Martez, iRule waiting); Build's shows Dirt Rich and VaultMark (Miss G waiting). This Site has two screenshots of the site as its pictures.
4. **Fewer doors** (done): Menu is Work, About, Gallery, Contact, Skip/Replay (Notes waits for three posts). Front door: character, bubble, See the work, Open for work, light/dark. The clay things in the intro are not buttons; the map stickers open Can't Stop Thinking About at their sections. Just the work: Civilla, Robear, MMM, Wesson Art, First Fire, This Site. Featured: Civilla and Robear on Work, First Fire and This Site on Build.
5. Redirects in vercel.json for every moved or parked address.
6. Checks, and this file and the README brought up to date.

## The project

- **What:** Scott Everett's portfolio, shaped like his brain. A clay 3D character greets you, scrolling opens his head, and the work sits on a map of three hubs: Work, Teach and Build.
- **Repo:** `scotteverett313-ui/interactive-resume`, branch **`brain`** (49 commits; latest `117d5f0b`).
- **Live site:** `main` is the current live resume. It has not been touched and must not be until Scott says to launch.
- **Preview:** every push to `brain` builds a Vercel preview. It sits behind Vercel's login until Deployment Protection is turned off.
- **Stack:** Create React App (react-scripts 5), React 18, react-router-dom 7, GSAP 3.14 with ScrollTrigger, EmailJS.

## Ground rules (in force since the first message)

- Work only on `brain`. Never touch `main`.
- No new dependencies without asking first.
- Keep: Skip intro and Replay intro (both in the Menu now), Escape goes up a level, keyboard focus on every node.
- Reduced motion skips the intro and the splash and stills the motion.
- Mobile: 100dvh full height, portrait crop on the character, touch drag works, no sideways scroll.
- The animation loop writes to SVG attributes through refs, not React state.
- Keep the typeface (Bricolage Grotesque) exactly as it is.
- Placeholders in [brackets] stay. Never invent facts; draft lines for Scott to approve.
- Commit at each checkpoint with a clear message and push, so Scott can check the preview on his phone.
- Build check: `CI=true npx react-scripts build` (lint warnings count as errors).

## What a visitor sees

1. **Splash** (first visit per browser session, front door only): "Scott Everett" rises in letter by letter, then "OMNI DESIGNER", then the SE|Design logo stamps down. The card slides up. A tap, key or scroll skips it. `?splash=1` shows it again and `?splash=0` skips it.
2. **Front door:** the character with a "What up doe." speech bubble, a lightning bolt sticker (goes to Can't Stop Thinking About) and sound doodles on one ear (a Spotify playlist).
   - **Menu**, top right: Just the work, Work with me, Gallery, Notes, Skip intro / Replay intro. On the front door it opens as the speech bubble.
   - **Bottom row:** "Open for work" status (goes to Work with me), "Just the work →", and a light/dark toggle.
3. **Scroll intro:**
   - A line draws across the forehead and the top of the head lifts off.
   - The head fills with coffee and five clay things bob up: cup, papers, '90s computer, flowers, stylus. Each is clickable while it floats, with its name on hover.
   - The brain rises out of the coffee and the things drift away.
   - The brain turns and grows into the map. Four drafted intro lines play along the way.
4. **Map:**
   - **Top level:** three hub blobs, plus the same five clay things as tilted die-cut stickers. These replaced the five curiosity dots and their lines.
   - **Curiosities:** still reachable from "Can't stop thinking about →" and from the bolt sticker.
   - **Hubs:** featured picture previews of the best case studies. Page blobs show their picture, gray until hovered.
   - **Single-item levels:** they pass straight through to their one item.
5. **Pages:** one case study layout everywhere. Cards up top (role, question, approach, impact), pictures, the full story, and a "Next case study" card. Arrow keys and swipe move between pages.
6. **Just the work** (`/the-work`): six project tiles (Civilla, Micro Money Management, Robear Detroit, First Fire, VaultMark, Wesson Art).
7. **Gallery:** every picture on the site, filterable, with a large viewer that links to each picture's project.

## Where things live

| What | File |
|---|---|
| All copy, the site map, gallery extras, intro lines, stickers, floating things | `src/brain/content.js` |
| Character art layout, the coffee and floating things' positions (`COFFEE`) | `src/brain/character.js` |
| Map sticker spots, landscape and phone (`MAP_STICKERS`) | `src/brain/content.js` |
| Scroll intro timeline, coffee beat, floating buttons | `src/brain/Intro.js` |
| Map engine (blobs, layout, map stickers) | `src/brain/BrainMap.js` |
| Splash | `src/brain/Splash.js` |
| Page and case study layout | `src/brain/NodePage.js` |
| App shell: routes, menu, sheets, bottom bar | `src/brain/BrainExperience.js` |
| Every style | `src/brain/brain.css` |
| "Open for work" status, booking, socials | `src/brain/studio.js` |
| Coffee and sticker art (Higgsfield, Nano Banana) | `src/brain/art/coffee/` |
| Project pictures (WebP, each with a `.thumb.webp`) | `public/proof/` |
| How to edit the brain | `README.md` |

## Recent work (newest first)

- `117d5f0b` The five clay things as stickers on the top map, with separate spots for landscape and phone.
- `b5876943` The intro depth tag moves under the dots on phones, clear of the floating things.
- `42000c8b` Coffee in the head with five clickable floating things; SE|Design logo on the splash.
- `16ad355a` 66 new pictures: Civilla projects, Cohere, Dirt Rich, SACI, Miss G (new page under Build → Websites), 11 logos and 6 app designs in the Gallery.
- `5cc49875` Name and title splash.
- `baea692a` The menu opens as the speech bubble; the status button, Just the work and the theme toggle return.

## Open items

**Waiting on Scott:**
- **Copy in [brackets]:** Civilla project roles and outcomes, years, the Robear and Micro Money Management briefs, Miss G, SACI.
- **Missing pictures:** Dirt Rich seed scanner and pixel-art icons, VaultMark diagrams. Two Wesson files were too big to download (over 10 MB).
- **Links:** Discord, the Dirt Rich app URL, the real resume PDF.
- **Decisions:**
  - Split Secretary of State into two pages (renewal notices, driver appeals)?
  - Check two picture captions that were guesses: "A branch office waiting room" and "Carved marble, Italy".
- **Sensitive details held back:** VaultMark (patent, pricing) and Viacon personal details.
- **Launch steps:**
  - Turn off Vercel Deployment Protection so the preview opens without a login.
  - Give the go-ahead to merge `brain` into `main`.

**Offered, not yet answered:**
- On phones, the map's "BRAIN" depth tag sits over the word "Build". It could move the same way the intro tag did.
- Remove the depth dots on map levels.
- Roll the narrator line and picture blobs out to Teach and Build.

**Art:**
- Higgsfield has 1 credit left on the free plan. Its GPT Image model needs a paid plan, so the art used Nano Banana. Any art redo needs more credits.
- How the art was made: generated on flat magenta, then cut out locally.

## Testing

- **Setup:** Playwright against `npx serve -s build -l 4173`, at desktop (1280×800), iPhone 13 and 320×568.
- **Scripts:** the test scripts from this session live only in the old session's scratchpad. A new session would need to rewrite them.
- **What the suite covered:**
  - 38 intro and Replay route checks
  - overlap checks on every map level
  - the menu
  - Just the work tiles
  - every picture loading
  - the splash
  - the floating things' links
  - map sticker overlaps

## Environment notes

- **Cloud environment:** "Scott Everett sites". Its allowed hosts include `scotteverett.design`, four reference sites, and Higgsfield's upload host (`upload.higgsfield.ai`) and image host (`d8j0ntlcm91z4.cloudfront.net`).
- **Commit messages end with:** a `Co-Authored-By` line and a `Claude-Session` link.
- **Content source of truth:** Scott's Google Doc *Inside Scott's Brain: Site Content*.
- **Images:** the Drive folder `1Ad1MjCEgQug_OYVyUIoH49aLzNy--V7u`, with subfolders 1 Work, 3 Build and Gallery.
