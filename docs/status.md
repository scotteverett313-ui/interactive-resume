# Inside Scott's Brain: status

As of Nov 24, 2026, after the focus pass. Paste this into a new chat session to pick up where we left off.

## The project

- **What:** Scott Everett's portfolio, shaped like his brain. A clay 3D character greets you, scrolling opens his head, and the work sits on a map of three gravity points: Work, Teach and Build.
- **Repo:** `scotteverett313-ui/interactive-resume`, branch **`brain`**.
- **Live site:** `main` is the current live resume. It has not been touched and must not be until Scott says to launch.
- **Preview:** every push to `brain` builds a Vercel preview. It sits behind Vercel's login until Deployment Protection is turned off.
- **Stack:** Create React App (react-scripts 5), React 18, react-router-dom 7, GSAP 3.14 with ScrollTrigger, EmailJS.

## Ground rules

- Work only on `brain`. Never touch `main`.
- No new dependencies without asking first.
- Keep: Skip intro and Replay intro (both in the Menu), Escape goes up a level, keyboard focus on every node.
- Reduced motion skips the intro and the splash and stills the motion.
- Mobile: 100dvh full height, portrait crop on the character, touch drag works, no sideways scroll.
- The animation loop writes to SVG attributes through refs, not React state.
- Keep the typeface (Bricolage Grotesque) exactly as it is.
- Placeholders in [brackets] stay. Never invent facts; draft lines for Scott to approve.
- Nothing gets deleted: pages that leave the site are parked (`parked: true`), not removed.
- Commit at each checkpoint with a clear message and push, so Scott can check the preview on his phone.
- Build check: `CI=true npx react-scripts build` (lint warnings count as errors).

## The focus pass (done)

The site went from about 45 pages and three ways to browse to a small site where every page that shows is finished. Six steps, one commit each:

| Step | What | Commit |
|---|---|---|
| 1 | Parking: `parked: true` takes a node off the site without deleting it | `00ed6871` |
| 2 | The new tree: Work, Teach, Build, plus About and Can't Stop Thinking About as single pages | `bb131f08` |
| 3 | The More door: one small blob per hub, showing only finished pages | `07bbdea7` |
| 4 | Fewer doors: menu, front door, stickers, Just the work, featured | `4cf3b069` |
| 5 | Redirects for all 56 moved or parked addresses | `77cc5a43` |
| 6 | Checks at three sizes (and a pager fix for 320px phones), docs brought up to date | (this commit) |

## The site now

**Splash** (first visit per session): "Scott Everett", "OMNI DESIGNER", the SE|Design logo. `?splash=1` shows it again.

**Front door:**
- The character with the "What up doe." speech bubble.
- The bolt sticker opens Can't Stop Thinking About; the Spotify sound doodles open the playlist.
- The bottom row: "Open for work" (Work with me), "See the work" (Just the work), and light/dark.

**Menu:** Work (Just the work), About, Gallery, Contact (Work with me), Skip intro / Replay intro. Notes waits until `notes.js` has three posts (it has one).

**Intro:** the forehead line, the top of the head lifts, coffee fills the head with five clay things bobbing in it (not buttons), the brain rises out and grows into the map.

**The map:**

| Gravity point | Blobs |
|---|---|
| Work | Civilla (featured), Robear Detroit (featured), Micro Money Management, Wesson Art. More is hidden: nothing in it is ready yet. |
| Teach | One page, UofM Flint, with the seven courses a line each. Pressing Teach opens it. |
| Build | First Fire (featured), This Site (featured), More (Dirt Rich, VaultMark). |

- **Pictures:** every project is a picture blob. More is the small blob.
- **Depth:** the map is never more than two levels below a gravity point.
- **Stickers:** on the top level, five clay stickers open Can't Stop Thinking About at their sections: cup → Podcasts, papers → Books, computer → Technology, flowers → Gardening, stylus → Science.

**Pages:**

- **Civilla** (`/work/civilla`) is one case study. Secretary of State and Project Cohere live under it at `/work/civilla/…` and show as two cards. MDHHS, UIA and Probation are folded in as sections.
- **About** (`/about`): Where it started, CCS, SACI, Skills, My stack, the resume download, and Scott's photo.
- **Can't Stop Thinking About** (`/orbit`): one section per curiosity.
- **Just the work** (`/the-work`): Civilla, Robear Detroit, Micro Money Management, Wesson Art, First Fire, This Site.
- **Folded sections** (`fold: true`) show only written lines; bracketed lines wait in content.js.

## Where things live

| What | File |
|---|---|
| The tree, every page's words, parking, More, FOLDED, gallery extras, Just the work, map stickers | `src/brain/content.js` |
| Old addresses and where they go now | `src/brain/moved.js` (app) and `vercel.json` (live site) |
| Addresses and how they parse | `src/brain/routes.js` |
| Character, coffee and floating things' layout | `src/brain/character.js` |
| Scroll intro | `src/brain/Intro.js` |
| Map engine (blobs, layout, stickers) | `src/brain/BrainMap.js` |
| Pages (case study layout, folded sections, sub-page cards) | `src/brain/NodePage.js` |
| App shell: routes, menu, sheets, bottom bar | `src/brain/BrainExperience.js`, `src/brain/Menu.js` |
| Splash | `src/brain/Splash.js` |
| Styles | `src/brain/brain.css` |
| Status, booking, socials | `src/brain/studio.js` |
| Art | `src/brain/art/` (character, brain frames, coffee and stickers) |
| Project pictures (WebP, each with a `.thumb.webp`) | `public/proof/` |
| How to edit everything | `README.md`, "How to edit the brain" |

## Waiting on Scott

Each of these makes a page appear, or makes a waiting section show, without any code:

**Work's More** (hidden today):
- **KRW:** a lede and story.
- **Martez Hurd:** a lede and story.
- **iRule:** a picture.

**Build's More:** Miss G needs a lede and story.

**Copy on pages that show:**
- **Robear Detroit:** its question, approach and impact, and the story's bracketed parts.
- **Micro Money Management:** its question, approach and impact, the year, the lede and the story.
- **Secretary of State and Project Cohere:** the lede and story.

**Folded sections waiting to be written:**
- **Civilla:** MDHHS, UIA and Probation text (MDHHS and UIA show their pictures meanwhile).
- **About:** "About me", the SACI story, and the Skills intro.
- **Can't Stop Thinking About:** Science, Books, Technology, and the Podcasts lede.

**Missing pictures:** Dirt Rich seed scanner and pixel-art icons, the VaultMark diagrams.

**Links:** Discord, the Dirt Rich app URL.

**Decisions:** check two picture captions that were guesses, "A branch office waiting room" and "Carved marble, Italy".

**Launch:**
- Turn off Vercel Deployment Protection.
- Give the go-ahead to merge `brain` into `main`.
- Then flip the redirects in `vercel.json` to `permanent: true`.

## Testing

- **Setup:** Playwright against `npx serve -s build -l 4173`, at desktop (1280×800), iPhone 13 and 320×568.
- **Scripts:** the test scripts live only in the session scratchpad. A new session would need to rewrite them.
- **What the step 6 run covered:**
  - intro and Replay routes
  - no overlaps on any map level
  - the menu
  - Just the work tiles and Next
  - every picture loading
  - the tree and its addresses
  - the fewer-doors changes
  - the More rule
  - sticker overlaps
  - all 56 old addresses
  - the splash

## Environment notes

- **Cloud environment:** "Scott Everett sites". Its allowed hosts include `scotteverett.design`, four reference sites, and Higgsfield's upload host (`upload.higgsfield.ai`) and image host (`d8j0ntlcm91z4.cloudfront.net`).
- **Higgsfield:** 1 credit left on the free plan. Its GPT Image model needs a paid plan; Nano Banana works.
- **Commit messages end with:** a `Co-Authored-By` line and a `Claude-Session` link.
- **Content source of truth:** Scott's Google Doc *Inside Scott's Brain: Site Content*.
- **Images:** the Drive folder `1Ad1MjCEgQug_OYVyUIoH49aLzNy--V7u`.
