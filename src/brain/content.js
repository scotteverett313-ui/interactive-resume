/* ============================================================
   Inside Scott's Brain: the content tree.

   This is the only file you need to touch to change what the
   brain says. Everything else (the map, the pages, the intro)
   reads from here.

   HOW THE TREE WORKS
   - ROOT is the brain. Its three kids are the gravity points: Work,
     Teach, and Build. Their colors are not here; they live in
     palettes.js, keyed by these same ids.
   - Work is the body of work: what I do (the studio, the UX and
     research roles, the art), the resume, and the background. Build
     is what I am making and getting better at now.
   - Every node has an id and a label. ids must be unique across
     the whole file; they are what links point at.
   - A node with `kids` goes deeper (an ink-colored blob on the map).
     A node without `kids` is a leaf and opens a page (a blob in its
     hub's color).
   - A node with `kids` can carry a `blurb`: one sentence shown under
     the breadcrumbs when you are inside that level. A blurb still in
     [brackets] is not shown.
   - A leaf with `go:'studio'` instead of a page opens the Work with me
     page when pressed. A leaf with `go:'gallery'` opens the Gallery,
     narrowed to the level it sits in.
   - A level with `view:'cards'` is shown as a row of large cards that
     slide sideways, one per page, instead of blobs on the map. It suits
     a level that holds only pages. Only Case Studies has it for now.
   - A level with only one thing inside is passed straight through:
     pressing it opens that one page (or lands inside that one level),
     and Back skips it too. Add a second item and the level shows up
     as a level again.

   THE CASE STUDY LAYOUT
   A page with a `brief` or a `study` is laid out as a case study
   instead of the usual two-panel page: a stack of rounded cards and
   pictures, short at the top, with the full story underneath.

   `brief` is the short part. Every field is optional:
       cards:    two or three small facts, [[label, text], ...]. The
                 first is full width, the rest sit side by side.
                 ("Client", "Services", "Year")
       question: the big question the project answers
       approach: how you went at it, in a sentence or two
       impact:   what came of it
       points:   a few short statements, each on its own card, with the
                 page's pictures between them
   After the cards come the page's buttons, then "The full story": the
   `study` below if the page has one, otherwise its `story` and `list`.
   The page's `image` is the picture at the top unless the study has a
   `hero`, and its `more` pictures sit between the cards.

   `study` is the long part:
       hero:     the picture across the top, { src, caption, alt }, or
                 '[Hero image: what goes here]' while it is still to come
       sub:      the line under the title
       intro:    opening paragraphs, an array of strings
       facts:    the quick facts, an array of [label, value]. A value
                 can be { text, url } to make it a link.
       sections: an array of { title, body }. `body` is an array, in
                 reading order, of any of these:
                   a string                       a paragraph
                   { image: src, caption, alt }   one picture
                   { images: [ {src,caption,alt}, {..} ] }  pictures side by side
                   { screens: true, images: [...] }  phone screens: kept small, in one row
                   { image: '[Image: what goes here]' }     an empty slot,
                                                  shown striped until the file exists
                   { list: [ [lead, text], ... ] } bullets; `lead` is bold
       actions:  the buttons at the end, [{ label, url }]. A url still
                 in [brackets] shows the button as not ready yet.
   `caption` is what the viewer shows under the picture; `alt` is the
   description a screen reader reads. The page's `tags`, `links`, and
   its `image` and `more` pictures (shown as a strip at the end) still
   apply. The page's `lede` and `story` are not used.

   JUST THE WORK
   The "Just the work" button on the opening screen opens a short stack
   of large tiles, one per project. Which projects, and in what order,
   is INDEX.picks below.

   FEATURED
   A level can carry `featured`: previews of pages offered straight
   from that level, however deep they really sit. Each entry is one
   extra blob with a picture in it:
       as:     the name under the blob (the page's own name if left out)
       pages:  page ids. Pressing the blob opens the first one, and
               Next and Previous on the page step through the rest.
               With a single page, they step through that page's
               neighbors; if it has none, through the level's other
               single-page previews.
       image:  optional picture for the blob. Without it the blob
               uses the first page's own picture, or stays a plain
               color blob until that page has one.
   If a featured page is already one press away on that level, no
   second blob is added: the blob that is already there becomes the
   big one.

   NEXT AND PREVIOUS
   Every page that has neighbors (other pages in the same level) gets
   Next and Previous at the bottom. Arrow keys and a sideways swipe do
   the same.

   THE GALLERY
   The Gallery button (bottom left, always there) shows every picture
   on the site in one wall: each page's `image` and `more`, plus any
   `gallery` extras. Nothing to maintain: add a picture to a page and
   it is on the wall. Its title and one line are in GALLERY below.
   - `page` is optional. Any field inside it is optional too:
       lede:  one line, shown big under the title
       story: a paragraph
       list:  array of strings, shown as bullets under the story
       tags:  array of short words: the disciplines and skills the page
              shows, drawn as small chips under the one-liner. On a
              gallery page they are the filter buttons.
       proof: caption for the proof panel
       image: optional picture for the proof panel, a file in public/proof,
              written as '/proof/name.webp'
       focus: optional. The large picture is cropped to fill its panel;
              this says which part to keep: 'top', 'bottom', 'left',
              'right' (the middle is kept when it is left out)
       fit:   optional. 'whole' shows the entire large picture inside
              the panel instead of cropping it to fill. Good for a
              mockup on a plain background.
       more:  optional extra pictures for the "More" strip, same form.
              To give one its own caption write it as
              { src: '/proof/name.webp', caption: '...' }
              Pressing any picture opens it full screen, and the arrows
              step through the page's pictures: `image` first, then `more`.
       action: optional button, { label: '...', go: 'studio' } opens the
              Work with me page; { label: '...', url: 'https://...' }
              opens another site in a new tab
       gallery: only on a `go:'gallery'` leaf: extra pictures for the
              Gallery that belong to no page of their own, an array of
              { src: '/proof/name.webp', tag: 'Branding', caption: '...' }.
              `tag` should be one of that leaf's `tags`.
       doc:   optional document shown on the page instead of the usual
              layout, { file: '/cv/name.pdf', pages: ['/cv/page-1.webp'] }.
              `file` is what downloads; `pages` are pictures of its pages,
              shown on screen. The resume uses this.
       links: [{ to: '<node id>', why: 'one line' }]
              these become the "Connects to" buttons and can jump
              anywhere in the brain, up or down any branch.
   - Text wrapped in [square brackets] is a placeholder. It renders
     with a dashed underline so it is obvious what is still blank.
     Brackets can sit inside a sentence too: only that part is marked.

   HOW TO ADD A NODE
   1. Find the parent in ROOT and add an object to its `kids`:
        { id:'myid', label:'My thing', page:{ lede:'[One line]' } }
   2. If it should branch, give it `kids:[ ... ]` instead of a page.
   3. To link to it from somewhere else, add { to:'myid', why:'...' }
      to that node's page.links. Links are one-way; add the reverse
      on the other node if you want it both ways.

   THE TITLES
   The headline on the opening screen and the one on the map are in
   TITLES, just below this comment. The lines said while the intro
   scrolls are INTRO_SAYS, right after it.

   THE STICKERS
   The stickers on the opening screen (the lightning bolt, the sound
   marks by the ear) are in STICKERS, below the titles: what each
   one is called and where pressing it goes.

   THE OUTER ORBIT
   CURIO_ROOT holds the curiosities that float around the outside of
   the brain. Each one also has:
       fx, fy: where it sits, as a fraction of the screen (0 to 1)
       hubs:   which gravity points it feeds ('work','teach','build')
       also:   ids of other curiosities it touches (drawn as dashed lines)
       sub:    optional short tag shown after the label
   ============================================================ */

/* The titles. `splash` is the full-screen card before the character on a first visit (Splash.js).
   The other two sit in the top-left corner.
     home: on the opening screen with the character. It fades as the intro starts.
     map:  on the map, once you are inside the brain.
   `sub` is the small line under the title; leave it as '' for none. */
export const TITLES = {
  /* the splash before the character, on the first visit: the name, and the title under it */
  splash: { title: 'Scott Everett', sub: 'Omni Designer' },
  home: { title: 'What up doe.', sub: "I'm Scott Everett, Omni Designer. I design, build, and teach in Detroit." },
  map:  { title: 'It all connects.', sub: '' }
};

/* The lines Scott says while the intro plays. They appear one at a time in a speech bubble, in the corner
   the opening title leaves, spread evenly across the scroll: the first as the head opens, the last just
   before the map settles and "It all connects." takes over. Any number of lines works; keep each one short.
   These four are drafts. Replace them with your own words. */
export const INTRO_SAYS = [
  'Go on, take a look inside.',
  'This is where I keep everything.',
  'The work. The teaching. The things I build.',
  'None of it sits by itself.'
];

/* The stickers on the opening screen. Each one is a button.
     label: what a screen reader calls it, and the tooltip
     go:    where pressing it lands. One of:
              a node id from this file (a gravity point, a page, or an
                outer-orbit curiosity)
              'curio'   the "Can't Stop Thinking About" page
              'studio'  Work with me
              'notes'   the notes
              a web address starting with https://, which opens in a new tab
                (a Spotify playlist, for example)
   Where each sticker sits on the character is in character.js. */
export const STICKERS = {
  bolt:  { label: "Can't stop thinking about", go: 'curio' },
  /* a Spotify playlist. To change it, paste another playlist's address here */
  audio: { label: 'What I am listening to, on Spotify', go: 'https://open.spotify.com/playlist/0DJIRlDoAI6vq1X7ILXecI' }
};

/* The five clay things from the coffee in the head, as stickers on the brain map's top level (where Work, Teach and
   Build are). Together they are the door to Can't Stop Thinking About: each opens that page at its own section
   (`section`, an id in CURIO_ROOT's study.sections), and its `label` is printed under it. A section that is not
   written yet does not show, and its sticker opens the page at the top.
   Where each sits is a fraction of the screen (0 to 1): `wide` on a landscape screen, `tall` on a phone held
   upright. `tilt` is how far it is turned, in degrees. The art (white border and shadow included) is
   src/brain/art/coffee/sticker-*.webp. */
export const MAP_STICKERS = [
  { id: 'cup',      section: 'podcasts',   label: 'Podcasts',   wide: [.08, .4],  tall: [.15, .6],  tilt: -9 },
  { id: 'papers',   section: 'books',      label: 'Books',      wide: [.47, .12], tall: [.84, .2],  tilt: 7 },
  { id: 'computer', section: 'technology', label: 'Technology', wide: [.84, .62], tall: [.14, .8],  tilt: -5 },
  { id: 'flowers',  section: 'gardening',  label: 'Gardening',  wide: [.13, .8],  tall: [.84, .8],  tilt: 10 },
  { id: 'stylus',   section: 'science',    label: 'Science',    wide: [.74, .84], tall: [.63, .21], tilt: -14 }
];

/* The Gallery: every picture on the site in one wall, opened from the Gallery button. */
export const GALLERY = {
  title: 'Gallery',
  intro: 'Every picture on the site, in one place. Filter by what you’re looking for.',
  /* pictures that belong to no page of their own: { src, tag, caption }. They show under Work */
  extras:[
            { src:'/proof/gallery/5.webp', tag:'Graphic Design', caption:'Home health care survey, ClearPath Home Care' },
            { src:'/proof/gallery/6.webp', tag:'Graphic Design', caption:'FATE HS Program guide' },
            { src:'/proof/gallery/7.webp', tag:'Graphic Design', caption:'Brochure, Chalkbeat Detroit' },
            { src:'/proof/gallery/9.webp', tag:'App Design', caption:'Dye. app' },
            { src:'/proof/gallery/10.webp', tag:'App Design', caption:'Goodwoolf app' },
            { src:'/proof/gallery/11.webp', tag:'App Design', caption:'FordPass app' },
            { src:'/proof/gallery/12.webp', tag:'App Design', caption:'AFA app' },
            { src:'/proof/gallery/15.webp', tag:'App Design', caption:'App and interface mockups' },
            { src:'/proof/gallery/ui-goodwoolf.webp', tag:'App Design', caption:'Goodwoolf app, profiles' },
            { src:'/proof/gallery/ui-fordpass.webp', tag:'App Design', caption:'FordPass app, home screen' },
            { src:'/proof/gallery/ui-black-gold.webp', tag:'App Design', caption:'Black Gold checkout, Daily UI' },
            { src:'/proof/gallery/ui-calculator.webp', tag:'App Design', caption:'Calculator, Daily UI' },
            { src:'/proof/gallery/ui-netflix.webp', tag:'App Design', caption:'Netflix redesign concept, Daily UI' },
            { src:'/proof/gallery/ui-app-icon.webp', tag:'App Design', caption:'App icon, Daily UI' },
            { src:'/proof/gallery/17.webp', tag:'Site', caption:'Viacon Packaging Solutions website' },
            { src:'/proof/gallery/18.webp', tag:'Site', caption:'The Local Butcher website' },
            { src:'/proof/gallery/22.webp', tag:'Branding', caption:'JB Cinematic Media logo' },
            { src:'/proof/gallery/logo-se-design.webp', tag:'Branding', caption:'SE|Design logo' },
            { src:'/proof/gallery/logo-robear.webp', tag:'Branding', caption:'Robear Detroit logo' },
            { src:'/proof/gallery/logo-krw-music.webp', tag:'Branding', caption:'KRW Music logo' },
            { src:'/proof/gallery/logo-martez-hurd.webp', tag:'Branding', caption:'Martez Hurd logo' },
            { src:'/proof/gallery/logo-micro-money-management.webp', tag:'Branding', caption:'Micro Money Management logo' },
            { src:'/proof/gallery/logo-kiss-n-cakes.webp', tag:'Branding', caption:'Kiss N\' Cakes logo' },
            { src:'/proof/gallery/logo-viacon.webp', tag:'Branding', caption:'Viacon Packaging Solutions logo' },
            { src:'/proof/gallery/logo-lacks.webp', tag:'Branding', caption:'Lacks Enterprises logo' },
            { src:'/proof/gallery/logo-nostalgic.webp', tag:'Branding', caption:'Nostalgic Brand logo' },
            { src:'/proof/gallery/logo-returnmail.webp', tag:'Branding', caption:'Returnmail logo' },
            { src:'/proof/gallery/logo-art-in-motion.webp', tag:'Branding', caption:'Art in Motion logo' },
            { src:'/proof/gallery/29.webp', tag:'Illustration', caption:'Ready Set Culture tee' },
            { src:'/proof/gallery/31.webp', tag:'Social Media', caption:'Family Tactical Solutions' },
            { src:'/proof/gallery/32.webp', tag:'Social Media', caption:'Kiss N\' Cakes Cupcake Studio' }
          ]
};

/* "Just the work": a short stack of large tiles, one per project, opened from the button on the opening
   screen. Each tile opens that project's case study, and "Next case study" at the bottom of each one
   carries on through the same list. */
export const INDEX = {
  title: 'Just the work',
  intro: 'Five projects. Open one, then keep going to the next.',
  /* the projects shown, in order. `to` is a page id; `as` is the name on the tile when the page's own
     name ("Overview") needs a clearer one. The line under each name is the page's first two tags. */
  picks: [
    { to: 'civilla' },
    { to: 'robear' },
    { to: 'mmm' },
    { to: 'wesson' },
    { to: 'ff' }
  ]
};

/* Shown on a page when that field is still blank. */
export const PH_LEDE = '[One line: what this is to me]';
export const PH_STORY = '[The story: how I got here and why it stuck]';

/* Content from "Inside Scott's Brain: Site Content" (Scott's words, plus drafts where a line is still blank).
   links: { to: node id, why: one line } become "Connects to" jumps anywhere in the brain. */
export const ROOT = { id:'root', label:'Brain', kids:[
  /* featured: the case studies that get the biggest picture blobs on their gravity point, and lead Next and Previous.
     rich: Scott says a line under the breadcrumbs on this gravity point's levels (`says`), and pictures show in blobs.
     A page can hold `subs`: pages that live under it (Civilla holds Secretary of State and Project Cohere).
     parked:true keeps a node in this file but off the site (see PARKING below) */
  { id:'work', label:'Work', blurb:'[Short blurb]', rich:true,
    says:'This is the work. Studio clients, design research for the state, and the art underneath all of it.',
    featured:[{ pages:['civilla'] }],
    /* trial A1 (the name list, see tries.js): the groups the list shows, in order. An item can be a page, a page's
       sub-page, or a More level (which stands for the finished pages inside it) */
    list:[
      { name:'Civilla', items:['civilla', 'sos', 'cohere', 'mdhhs'] },
      { name:'SE|Design', items:['missg', 'martez', 'robear', 'mmm', 'workmore'] },
      { name:'Wesson Art', items:['wesson'] }
    ], kids:[
{ id:'civilla', label:'Civilla', role:'Design Researcher', blurb:'Design research that shaped services for 2M+ Michigan residents.', page:{
            brief:{
              cards:[['Role', `Sr. UX/UI Designer and Design Researcher at Civilla`], ['Services', `Design research, UX/UI, service design`], ['Years', `[Years]`]],
              question:`How do you make state services easier for 2M+ Michigan residents to use?`,
              approach:`Interview, define the problem, prototype, test with users, and help implement across state and government institutions.`,
              impact:`75+ web and mobile prototypes for state and federal initiatives, and research informing services for 2M+ residents.`,
              points:[`Design lead on a multi-agency benefits platform`, `Journey maps, walkthroughs, and brand collateral`]
            },
            lede:'Design research that shaped services for 2M+ Michigan residents.',
            story:'Sr. UX/UI Designer and Design Researcher at Civilla, a small but mighty team. I conducted interviews, defined problems, ideated, prototyped, user tested, and helped implement across state and government institutions. It is where I learned to really be part of a team.',
            list:['Built 75+ web and mobile prototypes for state and federal initiatives','User research informing services for 2M+ residents','Design lead on a multi-agency benefits platform','Developed core journey map design and facilitation, walkthroughs, and brand collateral','Worked with the Michigan Secretary of State, Michigan Health and Human Services, Starfish, Deloitte, and more'],
            study:{
              /* the long story: the old Overview's words, then a short section for each smaller Civilla project.
                 A section marked fold:true shows only what is written: lines still in [brackets] wait in this file */
              intro:['Sr. UX/UI Designer and Design Researcher at Civilla, a small but mighty team. I conducted interviews, defined problems, ideated, prototyped, user tested, and helped implement across state and government institutions. It is where I learned to really be part of a team.'],
              sections:[
                { title:'What I did', body:[{ list:['Built 75+ web and mobile prototypes for state and federal initiatives','User research informing services for 2M+ residents','Design lead on a multi-agency benefits platform','Developed core journey map design and facilitation, walkthroughs, and brand collateral','Worked with the Michigan Secretary of State, Michigan Health and Human Services, Starfish, Deloitte, and more'] }] },
                { title:'Unemployment Insurance Agency', fold:true, body:['With the Unemployment Insurance Agency, I [researched / designed ___] to help residents [file / understand / get through ___]. My role: [___]. [Outcome.]',
                  { image:'/proof/civilla/uia/1.webp', caption:'Claimant Roadmap on a phone' }] },
                { title:'Eastern Michigan Probation Dept', fold:true, body:['With the probation department, I [researched / designed ___] so people on probation could [goal]. My role: [___]. [Outcome.]'] }
              ] },
            tags:['Design Research','UX/UI','Service Design','Government'],
            proof:'Journey maps, Civilla',
            image:'/proof/civilla-journey-maps.webp',
            more:[{ src:'/proof/civilla/overview-team.webp', caption:'At Civilla' },{ src:'/proof/civilla-renewal-notice.webp', caption:'Renewal notice, Civilla' },{ src:'/proof/civilla-mobile-prototypes.webp', caption:'Mobile prototypes, Civilla' }],
            links:[{ to:'c2', why:'The design thinking I practiced here is what I teach now.' },{ to:'sedesign', why:'Brought the same process to small businesses.' }] },
          /* subs: pages that live under this page (their addresses sit under /work/civilla). They show on the page
             as cards. The three parked ones are folded into the sections above */
          subs:[
    { id:'sos', label:'Secretary of State', page:{
                lede:'[My role and what we made]',
                story:'With the Michigan Secretary of State, I helped redesign [notices / forms / ___] so residents could [goal]. My role: [___]. [Outcome.]',
                tags:['Design Research','UX/UI','Government'],
                proof:'Renewal notices, Secretary of State',
                image:'/proof/civilla/sos/1.webp',
                more:[
                  { src:'/proof/civilla/sos/2.webp', caption:'Driver’s license renewal notice' },
                  { src:'/proof/civilla/sos/3.webp', caption:'The renewal notice in hand' },
                  { src:'/proof/civilla/sos/4.webp', caption:'The challenge' },
                  { src:'/proof/civilla/sos/5.webp', caption:'Filling in a notice' },
                  { src:'/proof/civilla/sos/6.webp', caption:'A branch office waiting room' },
                  { src:'/proof/civilla/sos/7.webp', caption:'Sketching at the whiteboard' },
                  { src:'/proof/civilla/sos/8.webp', caption:'Audit of the state site: Getting Your License Back' },
                  { src:'/proof/civilla/sos/9.webp', caption:'How to Request a Hearing' },
                  { src:'/proof/civilla/sos/10.webp', caption:'Requesting a hearing, prototype' },
                  { src:'/proof/civilla/sos/11.webp', caption:'Driver’s License Request pages, revised' },
                  { src:'/proof/civilla/sos/12.webp', caption:'Getting your license reinstated, revised' },
                  { src:'/proof/civilla/sos/13.webp', caption:'Driver Appeal Integrated System: Request for a New Hearing' },
                  { src:'/proof/civilla/sos/14.webp', caption:'Driver Appeal Integrated System, revised' },
                  { src:'/proof/civilla/sos/15.webp', caption:'Driver Appeal Integrated System, every screen' },
                  { src:'/proof/civilla/sos/16.webp', caption:'The hearing request on a phone' }
                ] }},
    { id:'cohere', label:'Project Cohere', page:{
                lede:'[My role and what we made]',
                story:'Cohere is a benefits navigation tool for Michigan residents. I [designed / researched / prototyped ___] to help people find and apply for the support they qualify for. My role: [___]. [Outcome.]',
                tags:['Design Research','UX/UI','Government'],
                proof:'Cohere on desktop and phone',
                image:'/proof/civilla/cohere/1.webp',
                more:[
                  { src:'/proof/civilla/cohere/2.webp', caption:'The dashboard' },
                  { src:'/proof/civilla/cohere/3.webp', caption:'Welcome to Cohere: onboarding' },
                  { src:'/proof/civilla/cohere/4.webp', caption:'Getting to know you' },
                  { src:'/proof/civilla/cohere/5.webp', caption:'Chat and uploads' },
                  { src:'/proof/civilla/cohere/6.webp', caption:'Resources' },
                  { src:'/proof/civilla/cohere/7.webp', caption:'Basic info' },
                  { src:'/proof/civilla/cohere/8.webp', caption:'The intro selfie illustration' },
                  { src:'/proof/civilla/cohere/9.webp', caption:'Wireframes: dashboard and notifications' },
                  { src:'/proof/civilla/cohere/10.webp', caption:'Wireframes: upload and offboarding' },
                  { src:'/proof/civilla/cohere/11.webp', caption:'Wireframes: agreement and contract' },
                  { src:'/proof/civilla/cohere/12.webp', caption:'Reviewing paper prototypes' },
                  { src:'/proof/civilla/cohere/13.webp', caption:'The sticky note wall' }
                ] }},
{ id:'mdhhs', label:'MDHHS', waits:true, page:{
                lede:'[My role and what we made]',
                story:'With Michigan Health and Human Services, I [researched / designed ___] to make [service] easier for residents to [action]. My role: [interviews, prototypes, testing]. [Outcome.]',
                tags:['Design Research','UX/UI','Government'],
                proof:'Assistance Application, MDHHS',
                image:'/proof/civilla/mdhhs/1.webp',
                more:[{ src:'/proof/civilla/mdhhs/2.webp', caption:'Reading the Assistance Application' },{ src:'/proof/civilla/mdhhs/3.webp', caption:'Program sections: healthcare, food, child care, cash, emergency relief' }] }},
    { id:'emprobation', label:'Eastern Michigan Probation Dept', parked:true, page:{
                lede:'[My role and what we made]',
                story:'With the probation department, I [researched / designed ___] so people on probation could [goal]. My role: [___]. [Outcome.]',
                tags:['Design Research','UX/UI','Government'] }},
    { id:'uia', label:'Unemployment Insurance Agency', parked:true, page:{
                lede:'[My role and what we made]',
                story:'With the Unemployment Insurance Agency, I [researched / designed ___] to help residents [file / understand / get through ___]. My role: [___]. [Outcome.]',
                tags:['Design Research','UX/UI','Government'],
                proof:'Claimant Roadmap on a phone',
                image:'/proof/civilla/uia/1.webp' }} ] },
    /* SE|Design: the studio's community partnerships. Miss G and Martez Hurd (waits:true) show once they have a
       picture and no [brackets]; so does anything under More */
    { id:'sedesign', label:'SE|Design', sub:'Community Partnerships', blurb:'My on-demand design studio for small businesses, nonprofits, and entrepreneurs.', kids:[
      { id:'missg', label:'Miss G', waits:true, page:{
                lede:'[My role and what we made]',
                story:'Miss G Curls & Braids. [What the site and the brand are for, and what I did.]',
                tags:['Website','Branding'],
                proof:'Miss G Curls & Braids, brand identity',
                image:'/proof/miss-g/1.webp',
                more:[{ src:'/proof/miss-g/2.webp', caption:'Brand guidelines' },{ src:'/proof/miss-g/3.webp', caption:'The logo and mark' },{ src:'/proof/miss-g/4.webp', caption:'The logo and mark, upright' }] }},
      { id:'martez', label:'Martez Hurd', waits:true, page:{
                    lede:'[One line: the project]',
                    story:'[Martez Hurd is / does ___]. He needed a site and a brand that [goal]. I built [what you made], and now [what changed].',
                    tags:['Site','Branding'],
                    proof:'Brand board, Martez Hurd',
                    image:'/proof/martez-hurd/1.webp' }},
      { id:'robear', label:'Robear Detroit', page:{
                  brief:{
                    cards:[['Client', `Robear Detroit`], ['Services', `Landing page, branding`], ['Year', `2025`]],
                    question:`[The big question: what did they need to solve?]`,
                    approach:`[The approach, in a sentence]`,
                    impact:`[The impact: what changed after launch]`
                  },
                  lede:'Custom landing page, 2025.',
                  story:'Robear Detroit needed [what they needed]. I designed and built a custom landing page and [brand work], so they could [result]. [What changed for them after launch.]',
                  tags:['Site','Branding'],
                  proof:'Landing page, Robear Detroit',
                  image:'/proof/robear/1.webp',
                  fit:'whole',
                  action:{ label:'Visit robeardetroitvo.com', url:'https://www.robeardetroitvo.com/' },
                  more:[
                    { src:'/proof/robear/2.webp', caption:'About screen on a phone' },
                    { src:'/proof/robear/3.webp', caption:'Brand board' }
                  ],
                  links:[{ to:'sedesign', why:'A studio partnership.' }] }},
      { id:'mmm', label:'Micro Money Management', page:{
                  brief:{
                    cards:[['Client', `Micro Money Management`], ['Services', `Brand identity, social media`], ['Year', `[Year]`]],
                    question:`[The big question: what did they need to solve?]`,
                    approach:`[The approach, in a sentence]`,
                    impact:`[The impact: what changed for them]`
                  },
                  lede:'[One line: the project]',
                  story:'[Micro Money Management is / does ___]. They needed [brand need]. I designed [what you made], so they could [result].',
                  tags:['Branding','Social Media'],
                  proof:'Brand identity, Micro Money Management',
                  image:'/proof/micro-money-management/1.webp',
                  more:[
                    { src:'/proof/micro-money-management/2.webp', caption:'Stylescape' },
                    { src:'/proof/micro-money-management/3.webp', caption:'Stylescape detail' },
                    { src:'/proof/micro-money-management/4.webp', caption:'Brand voice' },
                    { src:'/proof/micro-money-management/5.webp', caption:'Logo' },
                    { src:'/proof/micro-money-management/6.webp', caption:'Brochure' }
                  ] }},
      { id:'workmore', label:'More', slug:'more', more:true, kids:[
        { id:'krw', label:'KRW', page:{
                      lede:'[One line: the project]',
                      story:'KRW came to me for [brand need]. I designed [logo, brand system, social templates], so they could show up consistently on social. [Result.] Their website is next.',
                      tags:['Branding','Social Media'],
                      proof:'Stylescape, KRW Music',
                      image:'/proof/krw/1.webp',
                      focus:'top',
                      more:[
                        { src:'/proof/krw/2.webp', caption:'Primary logo' },
                        { src:'/proof/krw/3.webp', caption:'Brandmark, icon and color palette' },
                        { src:'/proof/krw/4.webp', caption:'Logo on red' },
                        { src:'/proof/krw/5.webp', caption:'Wordmark' },
                        { src:'/proof/krw/6.webp', caption:'Record icon' },
                        { src:'/proof/krw/7.webp', caption:'Stylescape detail' },
                        { src:'/proof/krw/8.webp', caption:'Badge logo' }
                      ],
                      links:[{ to:'krwsite', why:'Their website is next.' }] }},
        { id:'irule', label:'iRule', page:{
                      lede:'Where I cut my teeth in user interface design.',
                      story:'Sr. UX/UI Designer, March 2015 to July 2018, in Detroit. I built a design system and library of custom mobile interfaces that wirelessly control lights, thermostats, shades, and appliances across the iRule, On Controls, and Kramer brands.',
                      list:['Created a design system and library of custom UIs for mobile devices','Worked with R&D, the dev team, and leadership through wireframes, prototypes, and UX flow charts','Simplified older designs to reflect modern best practices, improving customer experience and workflow','Designed the iRule logo'],
                      tags:['UX/UI','Design Systems','Mobile','Branding'],
                      links:[{ to:'c4', why:'Where I designed apps for a living.' }] }} ]} ]},
{ id:'wesson', label:'Wesson Art', blurb:'Where I always land on my feet. The base of it all.', page:{
          brief:{
            cards:[['Practice', `Wesson Art: my digital art, mostly drawn on iPad`], ['Work', `Portraits, animals, editorial`], ['Since', `[Year]`]],
            points:[`20+ portraits for How I Built This`, `Four years of John Templeton Prize laureate portraits`, `A mural at the Ann Arbor District Library`]
          },
          lede:'Where I always land on my feet. The base of it all.',
          story:'Wesson Art is where my digital art lives, mostly drawn on iPad: portraits, animals, and editorial work.',
          list:['20+ portraits for How I Built This','Four years of John Templeton Prize laureate portraits','Mural at the Ann Arbor District Library','A few MOCAD drawing challenges'],
          tags:['Illustration','Portraits','Editorial'],
          proof:'Ann Arbor District Library, Black History Bicentennial',
          image:'/proof/aadl-bicentennial.webp',
          more:[
            { src:'/proof/wesson/portrait-fur-coat.webp', caption:'Portrait' },
            { src:'/proof/wesson/raffe.webp', caption:'Raffe' },
            { src:'/proof/wesson/clukincrazy.webp', caption:'Clukincrazy' },
            { src:'/proof/wesson/pugalisious.webp', caption:'Pugalisious' },
            { src:'/proof/wesson/vigo.webp', caption:'Vigo' },
            { src:'/proof/wesson/portrait-scorpion-shirt.webp', caption:'Portrait' },
            { src:'/proof/wesson/doodlage-2.webp', caption:'Doodlage 2' },
            { src:'/proof/wesson/cat-black.webp', caption:'Cat' },
            { src:'/proof/wesson/smile.webp', caption:'Smile' },
            { src:'/proof/wesson/donut-drip.webp', caption:'Donut Drip' },
            { src:'/proof/wesson/cat-grey.webp', caption:'Cat' },
            { src:'/proof/wesson/portrait-paper-crown.webp', caption:'Portrait' },
            { src:'/proof/wesson/pain.webp', caption:'Pain' },
            { src:'/proof/wesson/doodlage-1.webp', caption:'Doodlage 1' },
            { src:'/proof/wesson/hydra.webp', caption:'Hydra' },
            { src:'/proof/wesson/thumb.webp', caption:'Thumb' },
            { src:'/proof/wesson/portraits-three.webp', caption:'Portraits' }
          ],
          action:{ label:'Visit wessonart.com', url:'https://wessonart.com' },
          links:[{ to:'sketch', why:'Where the pieces start.' },{ to:'vault', why:'The idea came from my own digital art.' }] },
        subs:[
  { id:'sketch', label:'Sketchbook', parked:true, page:{
            lede:'Let loose.',
            story:'Random thoughts and drawings, shapes and wireframes. No client, no brief. This site started on these pages.',
            tags:['Illustration','Process'],
            proof:'[Photos of sketchbook spreads]',
            links:[{ to:'samples', why:'Quick thoughts here turn into finished pieces.' },{ to:'thissite', why:'The storyboard for this site came from here.' }] }} ] },
    /* More: the rest of the work, one smaller blob. A page shows in it only once it has a picture and no
       [brackets] in its lede or story; with nothing ready, More does not show at all */
    /* parked: the layers and pages that used to sit here. Kept whole, off the site */
    { id:'does', label:'What I Do', parked:true, blurb:'[Short blurb]', says:'Three lanes: my studio, design research, and my own art.', kids:[
      { id:'cases', label:'Case Studies', parked:true, blurb:'[Short blurb]', view:'cards', says:'Four clients. Swipe through, or open one.', kids:[]},
        { id:'gallery', label:'Gallery', go:'gallery', page:{
                  lede:'[Short blurb]',
                  story:'A wall of the work. Logos, sites, packaging, posts, and illustrations from SE|Design projects. Filter by what you’re looking for.',
                  tags:['Branding','Site','Social Media','Packaging','Illustration'] }},
        { id:'workwithme', label:'Work with me', go:'studio' },
      { id:'uxr', label:'Senior UX/UI Designer + Design Researcher', parked:true, blurb:'[Short blurb]', kids:[]} ]},
    { id:'resume', label:'Resume', parked:true, blurb:'[Short blurb]', says:'The short version. Grab the PDF, or walk through it one role at a time.', kids:[
      { id:'resumepdf', label:'Resume PDF', page:{
              lede:'Roles, dates, and skills on one page.',
              doc:{ file:'/cv/scott-everett-resume.pdf', pages:['/cv/page-1.webp'] } }},
      { id:'iresume', label:'Interactive Resume', blurb:'[Short blurb]', says:'Where I have worked, one stop at a time.', kids:[
        { id:'rcivilla', label:'Civilla', page:{
                  lede:'Sr. UX/UI Designer and Design Researcher.',
                  story:'[Dates and a one-line summary of the role]',
                  tags:['Design Research','UX/UI'],
                  links:[{ to:'civilla', why:'The full Civilla pages.' }] }},
        { id:'rumf', label:'UofM Flint', page:{
                  lede:'Designed and taught seven courses, and managed and facilitated workshops.',
                  story:'[Dates and title]',
                  tags:['Teaching','Curriculum Design'],
                  links:[{ to:'umf', why:'The full UofM Flint page.' }] }},
        { id:'skills', label:'Skills', page:{
                  lede:'[One line: how I would sum up what I bring]',
                  story:'[Draft list below is pulled from the work on this site. Edit, reorder, or cut.]',
                  list:['Design research: interviews, problem definition, user testing','UX/UI design and prototyping, web and mobile','Design systems and component libraries','Journey mapping and workshop facilitation','Brand identity and packaging','Web design on WordPress, Wix, and Squarespace, and building with code','Illustration and digital art','Teaching and curriculum design'] }} ]} ]},
    { id:'background', label:'Background', parked:true, blurb:'[Short blurb]', says:'Where I come from, and how I trained.', kids:[
      { id:'roots', label:'Where it started', page:{
              lede:'Started here and never left.',
              story:'It started in Detroit with my mom noticing I could draw. That turned into art classes, then custom pieces for family. After we moved to Arizona I took AP Studio Art at Chandler High and figure drawing at Maricopa Community College, which led to an $80K scholarship to CCS.',
              list:['Art classes, then custom art for family','AP Studio Art at Chandler High School','Figure drawing at Maricopa Community College','$80K scholarship to the College for Creative Studies'],
              tags:['Illustration','Detroit'],
              proof:'MCC · BFA, CCS · SACI International',
              links:[{ to:'ccs', why:'Where the scholarship took me.' },{ to:'samples', why:'Where my illustration lives now.' }] }},
      { id:'ccs', label:'College for Creative Studies', page:{
              lede:'Came for illustration, left as a designer.',
              story:'I started in illustration but quickly found interest in other facets of design: graphic design, typography, package design, and UI/UX. I built my own mix of illustration, package design, and graphic design.',
              tags:['Illustration','Graphic Design','Packaging'],
              proof:'BFA in Illustration, College for Creative Studies',
              links:[{ to:'saci', why:'Studied abroad while at CCS.' },{ to:'irule', why:'Where design took me after school.' }] }},
      { id:'saci', label:'SACI Florence, Italy', page:{
              lede:'Three months studying abroad at SACI International in Florence, Italy.',
              story:'[What the three months were like]',
              list:['Graphic design',"Children's book illustration",'Sculpture'],
              tags:['Graphic Design','Illustration','Sculpture'],
              proof:'Studio Art Centers International, Palazzo Jules Maidoff',
              image:'/proof/saci/1.webp',
              more:[{ src:'/proof/saci/2.webp', caption:'Carved marble, Italy' },{ src:'/proof/saci/3.webp', caption:'SACI, Studio Art Center International Florence' }],
              links:[{ to:'ccs', why:'Part of my time at CCS.' }] }} ]} ]},
  { id:'teach', label:'Teach', blurb:'[Short blurb]', kids:[
  { id:'umf', label:'UofM Flint', page:{
        lede:'I teach the way I learned, by making.',
        story:'I started teaching at the University of Michigan-Flint, where I designed and taught multiple curriculums and managed and facilitated workshops.',
        list:['Designed and taught seven courses','Managed and facilitated workshops'],
        /* the seven courses, one line each, carried over from their own (now parked) pages under Curriculum */
        study:{
          intro:['I started teaching at the University of Michigan-Flint, where I designed and taught multiple curriculums and managed and facilitated workshops.'],
          sections:[
            { title:'The seven courses', body:[{ list:[
                    ['Design Thinking', 'Students learn to start with people, not pixels. They interview real users, find the real problem, and prototype fast.'],
                    ['Info + Experience Design', 'How information becomes an experience. Students map journeys, organize content, and design systems people can find their way through.'],
                    ['App Design', 'From idea to clickable prototype. Students plan flows, design screens, and test with real users.'],
                    ['Storytelling', 'Every design tells a story. Students learn structure, sequence, and image to make work that people remember.'],
                    ['Digital Media', 'The tools and the thinking. Students build skills across image, type, and motion, then use them to say something.'],
                    ['Interaction Design I + II', 'How things respond when people touch them. Part I covers the basics of interaction and prototyping, and Part II goes deeper into motion, feedback, and complex flows.'],
                    'Web Design' ] }] }
          ] },
        tags:['Teaching','Curriculum Design','Workshops'],
      action:{ label:'Digital guides', url:'[link TBD]' },
        proof:'[Syllabi, student work, workshop photos]',
        links:[{ to:'curric', why:'The seven courses I designed and taught.' },{ to:'civilla', why:'I teach the design thinking I practiced in the field.' }] }},
  { id:'curric', label:'Curriculum', parked:true, blurb:'[Short blurb]', kids:[
        { id:'c2', label:'Design Thinking', page:{
          lede:'Start with people, not pixels.',
          story:'Students learn to start with people, not pixels. They interview real users, find the real problem, and prototype fast. [One project.]',
          tags:['Teaching'],
          links:[{ to:'civilla', why:'What I did every day at Civilla.' }] }},
        { id:'c7', label:'Info + Experience Design', page:{
          lede:'[One line: what this course is about]',
          story:'How information becomes an experience. Students map journeys, organize content, and design systems people can find their way through. [One project.]',
          tags:['Teaching'],
          links:[{ to:'civilla', why:'Journey maps and walkthroughs.' }] }},
        { id:'c4', label:'App Design', page:{
          lede:'[One line: what this course is about]',
          story:'From idea to clickable prototype. Students plan flows, design screens, and test with real users. [One project.]',
          tags:['Teaching'],
          links:[{ to:'irule', why:'Where I designed apps for a living.' }] }},
        { id:'c6', label:'Storytelling', page:{
          lede:'Every design tells a story, so tell it on purpose.',
          story:'Every design tells a story. Students learn structure, sequence, and image to make work that people remember. [One project.]',
          tags:['Teaching'] }},
        { id:'c1', label:'Digital Media', page:{
          lede:'[One line: what this course is about]',
          story:'The tools and the thinking. Students build skills across image, type, and motion, then use them to say something. [One project.]',
          tags:['Teaching'] }},
        { id:'c5', label:'Interaction Design I + II', page:{
          lede:'[One line: what this course is about]',
          story:'How things respond when people touch them. Part I covers the basics of interaction and prototyping, and Part II goes deeper into motion, feedback, and complex flows. [One project.]',
          tags:['Teaching'],
          links:[{ to:'thissite', why:'This site is an interaction design project.' }] }},
        { id:'c3', label:'Web Design', page:{
          lede:'[One line: what this course is about]',
          story:'[What students learn, and one project they make]',
          tags:['Teaching'] }} ]} ]},
  { id:'build', label:'Build', blurb:'[Short blurb]', rich:true, featured:[{ pages:['ff'] }], kids:[
{ id:'ff', label:'First Fire', page:{
      brief:{
        cards:[['Project', `My own game, built with an AI partner`], ['Role', `Game design, writing, illustration, art direction`], ['Year', `2026`]],
        question:`How do you make a survival game that rewards visiting and never punishes absence?`,
        approach:`Write the rules down first. Then build in a loop with an AI partner: idea, design talk, plan, build, check on my phone.`,
        impact:`300+ changes and about 14,500 lines of game code in about seven weeks. Soft launch in November 2026.`,
        points:[`You are a voice, not a body`, `Fully playable with a screen reader and with sound off`, `Tested by playing 150 full games in minutes`]
      },
      tags:['Game','Pixel Art'],
      /* the case study. See THE CASE STUDY LAYOUT at the top of this file for the shape */
      study:{
        hero:{ src:'/proof/first-fire/study/02-camp-night.webp', caption:'The camp at night', alt:'The First Fire camp at night in a green palette: huts, trees and a small fire under the moon, titled Ember Kin, spring, the fifth year.' },
        sub:`Designing a prehistoric world with an AI partner`,
        intro:[
          `First Fire is a text-first, 8-bit survival game for phones. You never see yourself. You are a voice that a small prehistoric group hears only through their shaman. They live on their own between your short check-ins, and the more they believe in you, the clearer your words reach them.`,
          `I designed the world, wrote its rules and story, set the art direction, and drew its people. An AI partner, Claude, helped me plan, build, test and keep it all straight. This is how that partnership worked.`
        ],
        facts:[
          ['Role', `game designer, writer, illustrator, art director`],
          ['AI partner', `Claude, for design talk and for building`],
          ['Timeline', `code began Sep 29, 2026. Soft launch in Nov 2026`],
          ['Scale', `300+ changes, about 14,500 lines of game code`],
          ['Tools', `Procreate, Procreate Dreams, Figma, GitHub, JavaScript`],
          ['Play it', { text:'play.firstfire.world', url:'https://play.firstfire.world' }]
        ],
        sections:[
          { title:`The idea`, body:[
            `I wanted a game that felt like a Tamagotchi, played tight like Oregon Trail, and rewarded curiosity like Dr. Stone. Small enough to check on in two minutes. Deep enough to care about for weeks.`,
            `The twist is the player. You have no body and no hands. You can only nudge, suggest and gift, and your people decide for themselves. If they stop believing, your words arrive twisted and late. Every choice has to earn their trust.`,
            `One rule shaped everything else: reward visiting, never punish absence. Life on the coast goes on while you are away, and the game never makes you feel guilty for having a life.`
          ] },
          { title:`Starting with words`, body:[
            `Before any code, the world lived in two documents. A Lore Doc held the peoples, the story and the way people talk. A Game Doc held the rules and the numbers. Those two stayed the source of truth for the whole build. When the code and a doc disagreed, the code won, and I updated the doc.`,
            { image:`[Image: your Game Doc or Lore Doc page]` }
          ] },
          { title:`Drawing the people`, body:[
            `The first camp was colored blocks. It was enough to prove the idea, but not enough to love. When the people became sprites, they were too small to read on a phone, so I grew them from 13 to 19 pixels tall. Now I draw them myself in Procreate: front, side and back, then the shaman dressed for the role.`,
            { image:`[Image: your Procreate turnaround]` },
            `The camp is 240 by 144 pixels, Game Boy height. A green pocket palette gives every screen one calm voice, and a full color look is there for players who want it.`,
            { images:[
              { src:'/proof/first-fire/study/01-camp-day-green.webp', caption:'The camp by day, green palette', alt:'The camp by day in the green pocket palette: people walking the shore, huts, trees and a fenced field.' },
              { src:'/proof/first-fire/study/03-camp-full-color.webp', caption:'The camp in full color', alt:'The same camp in full color: blue sea, sand, green trees and people in bright clothes.' }
            ] }
          ] },
          { title:`Built for thumbs and screen readers`, body:[
            `First Fire is fully playable with a screen reader and with sound off. Every picture and every sound also has a line of text. Taps are sized for thumbs, every screen is designed at phone width first, and nothing flashes. These rules were written into every build, not added at the end.`,
            { image:'/proof/first-fire/study/04-phone-dashboard.webp', caption:'The phone dashboard', alt:'The game on a phone: the camp view, four speed buttons, and a Camp at a glance panel showing people, food, mood, shelter, health, belief and tokens.' }
          ] },
          { title:`Designer and AI: how we worked`, body:[
            { image:'/proof/first-fire/study/05-build-loop.webp', caption:'The build loop', alt:'Diagram of the build loop in five steps: idea, design talk, the prompt, build, and check. The status file comes back to the chat so both sides stay in sync.' },
            `Every change went around the same loop. I brought an idea, a feeling or a problem from play. In chat, Claude offered options and trade-offs, one question at a time, and I chose. Claude drafted a build plan, and I approved it. Claude Code built the change, tested its effect on the world, and updated the project's record. Then I played it on my phone and merged it.`,
            `The habit that made it work was simple. After every change, a short status file came back to the chat. The designer side and the builder side never drifted apart.`,
            `I made every decision. The AI made those decisions real, quickly, and showed me what they cost.`
          ] },
          { title:`Testing a world, not a screen`, body:[
            `A game where people live and die on their own is hard to test by playing. So the game can run without a screen. I could play 150 full games in minutes, each about thirty years long, and see who lives, who dies, and why.`,
            /* the two charts are full of small words, so each gets the full width, one after the other */
            { image:'/proof/first-fire/study/06-who-dies.webp', caption:'Who dies, and how', alt:'Bar chart of deaths in one era, averaged over 30 simulated eras: old age 47, lost scouting 11, drowned in the surf 6.5, wolves 4.6, snow on the high pass 2.6, the great wave 1.1.' },
            { image:'/proof/first-fire/study/07-where-you-start.webp', caption:'Where you start matters', alt:'Bar chart of eras where the whole group was lost, out of 30 per starting spot: river mouth 1, open beach 1, sheltered cove 6, cliffside caves 11.' },
            `That audit found real problems. Scouts were dying out of sight. One starting spot lost everyone in a third of its games, always in the first three years. And the game still hurt people while the player was away, against my own first rule. Each finding became a fix.`
          ] },
          { title:`What worked`, body:[
            { list:[
              [`The voice and the shaman.`, `Having no body makes every choice feel human.`],
              [`Scarcity with care.`, `Gifts come from a small hand that refills slowly, so each one is a real choice.`],
              [`An ending with weight.`, `My own camp reached year 32 with no urgency. Now the mountain wakes in stages: smoke, trembling, ash, and the sea pulling back.`],
              [`Speed without losing the wheel.`, `A designer without an engineering team shipped over 300 changes in about seven weeks.`]
            ] }
          ] },
          { title:`What did not`, body:[
            { list:[
              [`Building too much.`, `When building is cheap, every idea gets built. The game grew systems that overlap, and I am still pruning them.`],
              [`Feel cannot be simulated.`, `The AI can test numbers, not moments. That still took my phone and my players.`],
              [`Small slips, big effects.`, `One reused name froze every vision in the game. Now known bugs get written down so they never come back.`],
              [`My first screen reader test.`, `It "definitely needs some work," I wrote. It became an audit and a set of fixes, one screen at a time.`]
            ] }
          ] },
          { title:`What is next`, body:[
            `The second era, the Valley, with fields, furnaces and trade. A bigger camp with my own drawn people. Play styles that leave a mark on who reaches the Valley. And outside the game, a graphic novel about the first five people, and a small picture frame that shows the camp on a shelf.`
          ] },
          { title:`What I would tell another designer`, body:[
            `Write your rules down before you build. Keep one place where the truth lives. Let the AI build fast, and spend your own time on taste, testing and saying no.`
          ] }
        ],
        actions:[
          { label:`Play First Fire`, url:'https://play.firstfire.world' },
          { label:`Join the Discord`, url:'[Discord invite link]' }
        ]
      },
      proof:'Title art, First Fire',
      image:'/proof/first-fire/1.webp',
      more:[
        { src:'/proof/first-fire/2.webp', caption:'Key art' },
        { src:'/proof/first-fire/3.webp', caption:'Icon' }
      ],
      links:[{ to:'thissite', why:'Built with Claude Code.' }] }},
{ id:'dirtrich', label:'Dirt Rich', page:{
          brief:{
            cards:[['Project', `My own app, built with an AI partner`], ['Role', `Product design, illustration, art direction, development`], ['Year', `2026`]],
            question:`What would a garden tracker look like if it thought in zones, the way I actually garden?`,
            approach:`Build it during the season I was trying to track, so every feature got tested on real plants.`,
            impact:`300+ changes, and one 2,700-line file refactored into 21 focused files. Beta launch in fall 2026.`,
            points:[`A grow partner, not a task manager`, `Pixel art plants I drew myself`, `Built for one hand in a garden`]
          },
          tags:['App','Product Design'],
          study:{
            hero:{ src:'/proof/dirt-rich/hero.webp', caption:'My Garden, a plant, and the harvest list', alt:'Three Dirt Rich phone screens: My Garden with the season progress bar and plants in the Basement zone, the detail sheet for a tomato with its next watering, and the Harvest list of lettuce, kale, basil and tomato' },
            sub:`Building a garden tracker with an AI partner while actually planting`,
            intro:[
              `Dirt Rich is a mobile-first garden tracking PWA for people who take their grow seriously. Track plants by zone from seed to harvest. Scan seed packets with AI. Know when to water, when to harvest, and how much of the season you have left.`,
              `I designed the product, wrote its rules and content, set the visual direction, and drew its pixel art. An AI partner, Claude, helped me plan, build, test, and keep it all straight. This is how that partnership worked.`
            ],
            facts:[
              ['Role', `product designer, illustrator, art director, developer`],
              ['AI partner', `Claude, for design decisions and for building`],
              ['Timeline', `code began Spring 2026. Beta launch Fall 2026`],
              ['Scale', `300+ changes, 2,700+ lines of code refactored into 21 focused files`],
              ['Tools', `Procreate, Figma, React, Supabase, Vercel, GitHub`],
              ['Use it', `[your Vercel URL]`]
            ],
            sections:[
              { title:`The idea`, body:[
                `I needed a garden tracker that worked for how I actually garden. Four zones — a basement grow station, a greenhouse, raised beds, in-ground beds. Nothing I found thought that way. Most apps felt like a houseplant diary, not a real grower’s tool.`,
                `The core rule that shaped everything else: the app should feel like a trusted grow partner, not a task manager. It should know your season, remember your plants, and give you what you need without demanding your attention.`,
                `One constraint kept the design honest: build it during the season you’re trying to track. Every feature got tested on real plants, in real dirt, in real Detroit spring weather.`
              ] },
              { title:`Starting with the season`, body:[
                `Before any code, I defined the four zones and the plant lifecycle — from seed to germinating to seedling to transplanted to growing to flowering to fruiting to harvesting. Those states became the data model. The frost date progress bar came from needing to answer one question every time I walked outside: how much season do I have left?`,
                { image:`[Image: frost date progress bar + zone layout sketch]` }
              ] },
              { title:`Drawing the plants`, body:[
                `The first version used emoji. It worked well enough to prove the idea but not well enough to love. When I drew the first pixel art icons — Tomato, Carrot, Eggplant, Lettuce, Sunflower — the app started feeling like something worth using.`,
                `Each plant icon is 32×32px, drawn in Procreate, always rendered with imageRendering: pixelated. Never scaled with interpolation. The pixel art is the soul of the brand, not decoration.`,
                { image:`[Image: Procreate pixel art plant icons — Tomato, Carrot, Eggplant, Lettuce, Sunflower]` },
                `The app background is parchment (#faf6f0). Cards are white with 2px black borders and offset shadows. Lime green (#a8e063) is the signal color — it means active, alive, in season.`,
                { image:`[Images: plant grid card dark / card light — before and after pixel art]` }
              ] },
              { title:`Built for one hand in a garden`, body:[
                `Dirt Rich is designed at phone width first. Every tap target is thumb-sized. The plant detail sheet slides up from the bottom so you can log care with one hand while the other is in the soil. The seed scanner lets you point your camera at any packet and AI reads everything — name, variety, days to maturity, water needs — directly into your seed library.`,
                { screens:true, images:[
                  { src:'/proof/dirt-rich/plant-detail.webp', caption:'The plant detail sheet', alt:'A tomato in Dirt Rich: the plant sheet slid up over a photo, with the next watering on Saturday, November 21, and its growing overview' },
                  { src:'/proof/dirt-rich/care-log.webp', caption:'Logging care, inline', alt:'Further down the tomato sheet: a harvest and frost warning, companion plants, and the care log with a watering entry and a Log Care button' }
                ] },
                { image:`[Image: phone screenshot — seed scanner in use]` }
              ] },
              { title:`Designer and AI: how we worked`, body:[
                { image:`[Image: build loop diagram]` },
                `Every change followed the same pattern. I brought a problem or an idea from actual use — something that felt off, something missing, something a real plant session surfaced. In chat, Claude offered options and trade-offs. I chose. Claude drafted the change. I approved. Claude built it, tested it, and noted what changed. Then I opened the app on my phone and used it.`,
                `The habit that kept it working: the app started as one 2,700-line file. When edits started hitting tool limits and sessions started drifting, we refactored the whole thing into 21 focused files — components, tabs, hooks, constants, utils. After that, every session started in the right file and ended clean.`,
                `I made every product decision. The AI made those decisions real, fast, and showed me what they cost.`
              ] },
              { title:`Testing in the season, not just the simulator`, body:[
                `A tracker that only works when you remember to open it isn’t a tracker. So I used Dirt Rich through the whole spring season — scanning real packets, adding real plants, logging real care. That live use found the real problems.`,
                `The backup warning was annoying before it was necessary. The zone filter was hidden before it was obvious. The care log was a separate screen before it was inline. Each friction point in real use became a design fix.`,
                { image:`[Images: before/after care log inline; before/after header redesign]` }
              ] },
              { title:`What worked`, body:[
                { list:[
                  [`The pixel art.`, `Making the icons myself meant every plant had a face I drew.`],
                  [`The frost date bar.`, `One glance tells you where you are in the season. That single element changes how you think about every plant in the app.`],
                  [`Cloud sync.`, `Adding Supabase meant the data survived every app update, every device switch, every Safari cache clear.`],
                  [`The seed scanner.`, `Pointing a camera at a packet and watching it populate is still the moment that gets people.`]
                ] },
                { screens:true, images:[
                  { src:'/proof/dirt-rich/calendar.webp', caption:'The season calendar', alt:'The Dirt Rich calendar: a harvest countdown for lettuce, kale and basil, and a full-season chart of when to start indoors, transplant and direct sow' },
                  { src:'/proof/dirt-rich/harvest.webp', caption:'What’s ready, and what’s next', alt:'The Harvest tab: lettuce, kale, basil and tomato with days until harvest and their zones' },
                  { src:'/proof/dirt-rich/profile.webp', caption:'The garden portfolio', alt:'The profile tab: seven plants growing, the growing season at 91 percent, a care activity chart and holdings' }
                ] }
              ] },
              { title:`What didn’t`, body:[
                { list:[
                  [`Building before the data model was solid.`, `The zone system started hardcoded and had to be refactored to dynamic when it became obvious growers don’t all have the same four zones.`],
                  [`One giant file.`, `Starting in a single App.jsx made early builds fast and later sessions slow. The refactor was necessary but it cost two sessions.`],
                  [`Testing on my own garden only.`, `The features that felt obvious to me needed more explanation for first-time users. That became the onboarding flow.`]
                ] }
              ] },
              { title:`What’s next`, body:[
                `A community Discord for beta testers. An App Store path through Capacitor. Succession planting suggestions on the Harvest tab — what to plant when something comes out. And more pixel art. Always more pixel art.`
              ] },
              { title:`What I’d tell another designer`, body:[
                `Design with the constraint that you’re the first user. Build what your season actually needs. Keep one file where the truth lives. Let the AI build fast and spend your own time on feel, testing, and knowing when to say no.`
              ] }
            ],
            actions:[
              { label:`Use Dirt Rich`, url:'[your URL]' },
              { label:`Join the Discord`, url:'[Discord invite link]' }
            ]
          },
          links:[{ to:'thissite', why:'Built the way I build now.' }] }},
{ id:'vault', label:'VaultMark', page:{
          brief:{
            cards:[['Project', `My own invention, designed with an AI partner`], ['Role', `Product design, system architecture, writing`], ['Year', `2026`]],
            question:`How can proof of ownership live inside the image itself?`,
            approach:`Map the system before the interface: an encrypted original in the vault, a scrambled copy for display, and a key grown from the image's own pixels.`,
            impact:`A working prototype across five versions, 80+ features mapped, and a provisional patent application filed.`,
            points:[`Three layers that all have to align`, `Built for a gallery director and a solo artist`]
          },
          tags:['Software','Concept'],
          study:{
            hero:{ src:'/proof/vaultmark/study/04-dashboard-gallery.webp', caption:'The gallery dashboard', alt:'The Vaultmark dashboard for a demo gallery: totals across the top and a grid of eight vaulted artworks, each shown as a scrambled tile with its title, artist and status.' },
            sub:`Inventing a digital art authentication system with an AI partner`,
            intro:[
              `Vaultmark is a pixel-level authentication platform for digital artwork. The proof of ownership is embedded in the image’s own pixel data — not attached as metadata, not stored as a URL pointer — grown from the physical structure of the image itself.`,
              `I developed the concept, designed the system architecture, built the encryption engine, mapped the user flows, and took it from idea to provisional patent. Claude was the partner I designed with and built through.`
            ],
            facts:[
              ['Role', `product designer, system architect, inventor, writer`],
              ['AI partner', `Claude, for design decisions, system design, and building`],
              ['Timeline', `concept began April 2026`],
              ['Scale', `working prototype across 5 versions, 80+ features mapped, provisional patent application filed`],
              ['Tools', `Claude, JavaScript, Procreate (for brand exploration), GitHub`]
            ],
            sections:[
              { title:`The idea`, body:[
                `The NFT space tried to solve digital art ownership and got it wrong in a fundamental way. The token points to the artwork through a URL. If the server goes down, the NFT is a receipt for nothing. The image itself carries no proof.`,
                `I wanted authentication that lived inside the image — the way brushstrokes are intrinsic to a physical painting. Not attached. Not pointed at. Part of it.`,
                `The core insight came from zooming in. A digital image, at the pixel level, is already a unique code. Every pixel is a specific color value from a specific sensor at a specific moment. No two captures of the same artwork produce identical pixel data. That grid is already a fingerprint. The question was how to use it as a lock.`
              ] },
              { title:`Starting with the system`, body:[
                `Before any prototype, I mapped the concept in conversation. What does the artist hold? What does the platform hold? What happens at the moment of sale?`,
                `Three layers emerged. The encrypted original lives in the vault. A scrambled copy is safe to display publicly. The key — derived from the image’s own pixels — belongs only to the artist. All three have to align for authentication to succeed. Compromise any one and the system holds.`,
                `That structural decision shaped every other decision in the product.`,
                { image:`[Image: the three-layer diagram]` }
              ] },
              { title:`The encryption engine`, body:[
                `The mechanic I landed on uses a proprietary QR symbol library as a pixel selection mask. The QR pattern is overlaid on a zoomed region of the image. Only the pixels underneath the filled portions of the QR are read. Those pixel RGBA values, hashed with SHA-256, become the key.`,
                `The QR serves two jobs simultaneously: it selects which pixels get read, and it encodes a URL that links to the verification page. The same code that is the lock is also the door.`,
                `A screenshot, a reprint, a perfect copy — none of these produce the same pixel values. The physical capture event is the lock.`,
                { image:'/proof/vaultmark/study/05-pipeline-detail.webp', caption:'The pixel mask engine', alt:'The pixel mask engine prototype: upload, QR symbol and pixel region controls on the left, and a six-step pipeline across the top: original, region selected, pixel grid, QR mask, key extract, scrambled.' }
              ] },
              { title:`Built in conversation`, body:[
                `Every prototype iteration happened through a design conversation first. I described the problem or the next step, Claude offered options and trade-offs, I made the call, and the prototype got built. Five versions over the course of the project.`,
                `The habit that kept it working: every session, I started from the same set of documents. The white paper. The feature list. The artifact registry. The design side and the build side never drifted apart because I kept them in sync.`,
                { image:`[Image: the prototype pipeline — v1 tile scramble / v2 real checksums / v3 pixel mask engine / v4 intake workflow / v5 dashboard]` }
              ] },
              { title:`The user flows`, body:[
                `Two users needed the same system to feel built for them: a gallery director running intake on ten pieces in a day, and a solo artist vaulting their first digital work from their studio.`,
                `The intake flow became a five-step sequence: capture, vault, label, confirm, key issued. Each step unlocks the next. When the vault is sealed, the key is issued — and Vaultmark never holds it again. The museum-quality label form generates a certificate of authenticity automatically. The gallery session adds a co-sign field. The solo session adds a backup prompt.`,
                `The dashboard became the director’s home base. Sortable list view, thumbnail grid, piece detail modal with inline verification. Pre-populated demo with eight real works from a fictional Detroit gallery.`,
                { images:[
                  { src:'/proof/vaultmark/study/02-intake-workflow.webp', caption:'The intake flow', alt:'The start of the intake flow, asking who is logging in today: a gallery or institution, or a private collector or artist.' },
                  { src:'/proof/vaultmark/study/06-piece-modal.webp', caption:'A piece in the dashboard', alt:'The detail view for one artwork in the demo dashboard: its scrambled image and key credential on the left, and its artwork, vault record, provenance and gallery details on the right.' }
                ] }
              ] },
              { title:`The business`, body:[
                `The revenue model runs three engines at once: subscriptions, primary sale commission, and a perpetual resale royalty on every future transaction. A piece vaulted today generates royalties the next time it sells in 2041.`,
                `The two customer scales are structurally different. A small gallery pays $149-$699/month and generates $13-$18K annual platform revenue. A DIA-scale institution pays $24-$120K annually and generates nearly $500K in year one through transaction royalties. One mid-tier museum contract is worth more than 35 gallery subscriptions.`,
                `The exit path is Path A: license the technology, not build the company. The provisional patent is filed. The public white paper is ready to share. The next step is an attorney and a licensing conversation.`
              ] },
              { title:`What worked`, body:[
                `The concept is genuinely novel. A prior art search didn’t surface any existing system using a QR pattern as a pixel selection mask for image-based ownership authentication. The architecture — distributed custody, pixel-bound proof, perpetual royalty — solves real problems the NFT space never solved.`,
                `Starting with the system before the UI. Getting the three-layer architecture right in conversation before writing a line of code meant every prototype decision had a clear reason. The UI served the concept instead of the other way around.`,
                `The public/private document split. The technical white paper goes to the patent attorney. The public white paper is safe to share with anyone before the patent is filed. That distinction mattered.`
              ] },
              { title:`What did not`, body:[
                `Building too much too fast. When building is cheap, every idea gets built. The session went deep into revenue modeling, branding direction, and institutional go-to-market before the core prototype was fully tested with real users. That’s a sequencing problem.`,
                `Branding hit a ceiling. The SVG-based logo exploration I tried in this environment was geometrically correct but visually flat. That work needs Fable and a proper creative session, not a generative SVG.`,
                `The prototype is still single-session. All vault data lives in browser memory. The moment you close the tab it’s gone. A real backend is the prerequisite for showing this to anyone who needs to see it work over time.`
              ] },
              { title:`What is next`, body:[
                `A Claude Code build of the full Next.js app — the project brief is written and the six prototype HTML files are ready to hand off. A patent attorney filing. A licensing conversation with one of the established authentication platforms or a major auction house. And a Fable session for the brand.`
              ] },
              { title:`What I would tell another designer`, body:[
                `You do not need to understand cryptography to invent a cryptographic system. You need to understand the problem clearly enough to describe what the solution has to do. The technical implementation followed from the concept, not the other way around.`,
                `Write the system before you write the code. Get the architecture right in conversation. The prototype is proof of concept — the design thinking is the actual work.`
              ] }
            ]
          },
          links:[{ to:'samples', why:'It came from my own digital work.' }] }},
    /* Miss G lives in SE|Design (its home: its address is under /work/se-design). Build shows the same page here,
       as a second door to it (alias): it waits, and shows, with the page itself */
    { id:'missg-build', label:'Miss G', alias:'missg' },
{ id:'thissite', label:'This Site', parked:true, page:{
        lede:'Designing with code, not just for it.',
        story:'It started as an experiment: could a designer with some coding experience ship a real site with Claude Code? The first interactive resume went live. This brain is version two.',
        list:['Built with React, GSAP, and Claude Code'],
        tags:['Website','Interaction Design','Code'],
        proof:'This site: the brain map',
        image:'/proof/this-site/1.webp',
        more:[{ src:'/proof/this-site/2.webp', caption:'Opening the head: coffee, and the things that float in it' }],
        links:[{ to:'c5', why:'I teach interaction design.' },{ to:'sketch', why:'The storyboard started in the sketchbook.' }] }},
    /* parked: folded into About, or layers that are gone */
    { id:'stack', label:'My stack', parked:true, page:{
          lede:'The tools I reach for every day, from sketching on iPad to shipping with code.',
          story:'[Icons of the software]',
          list:['Photoshop, Illustrator, InDesign, and Firefly','Procreate and Procreate Dreams','WordPress, Wix, and Squarespace','React and GSAP','Claude Code'] }},
    { id:'apps', label:'Apps', parked:true, kids:[]},
    { id:'games', label:'Games', parked:true, kids:[]},
    { id:'software', label:'Software', parked:true, kids:[]},
    { id:'websites', label:'Websites', parked:true, kids:[
      { id:'krwsite', label:'KRW Site', page:{
              lede:'Coming soon.',
              story:'[What it will be]',
              tags:['Website'],
              links:[{ to:'krw', why:'The brand came first.' }] }} ]} ]} ]};

/* outer orbit: curiosities not pulled in yet. hubs = which gravity points they feed, also = other curiosities they touch */
export const CURIO_ROOT = { id:'curio', label:"Can't Stop Thinking About", curio:true,
  page:{ lede:'The outer ring. Loose curiosities that feed what I am chasing. When one turns into a real project, it drifts inward.',
    /* one section per curiosity, folded in from their own (now parked) pages. fold:true: only written lines show */
    study:{ sections:[
      { id:'podcasts', title:'Podcasts', fold:true, body:['[Which ones, and why]', 'What’s in my ears while I work.', { list:['What Now? With Trevor Noah - Trevor Noah','Short Wave - NPR','The Daily - The New York Times','Today Explained - Vox','StarTalk with Neil deGrasse Tyson - Neil deGrasse Tyson'] }] },
      { id:'science', title:'Science', fold:true, body:['[What pulls me in]', '[Draft:] I’m drawn to how things work at the smallest scale, like cells and neurons. A lot of this site’s brain started there.'] },
      { id:'books', title:'Books', fold:true, body:['[Which ones, and why]', 'What I’m reading right now. [Two or three titles.]'] },
      { id:'gardening', title:'Gardening', fold:true, body:['A curiosity that turned into a project: Dirt Rich, a garden tracking app built in Detroit.', 'Raised beds, seed starts, and a lot of trial and error. It slows me down, and it turned into Dirt Rich.'] },
      { id:'technology', title:'Technology', fold:true, body:['[What pulls me in]', '[Draft:] New tools change what one person can make. I like testing them early and finding where they actually help.'] }
    ] },
    links:[{ to:'dirtrich', why:'The curiosity that drifted inward and became an app.' }] },
  kids:[
    { id:'podcasts', label:'Podcasts', parked:true, fx:.09, fy:.17, hubs:['teach'], also:['books','technology'],
      page:{ lede:'[Which ones, and why]', story:'What’s in my ears while I work.',
        list:['What Now? With Trevor Noah - Trevor Noah','Short Wave - NPR','The Daily - The New York Times','Today Explained - Vox','StarTalk with Neil deGrasse Tyson - Neil deGrasse Tyson'] } },
    { id:'science', label:'Science', parked:true, fx:.86, fy:.13, hubs:['build'], also:['technology','gardening'],
      page:{ lede:'[What pulls me in]', story:'[Draft:] I’m drawn to how things work at the smallest scale, like cells and neurons. A lot of this site’s brain started there.' } },
    { id:'books', label:'Books', parked:true, fx:.9, fy:.6, hubs:['teach'], also:['podcasts'],
      page:{ lede:'[Which ones, and why]', story:'What I’m reading right now. [Two or three titles.]' } },
    { id:'gardening', label:'Gardening', parked:true, sub:'→ Dirt Rich', fx:.11, fy:.8, hubs:['build','work'], also:['science'],
      page:{ lede:'A curiosity that turned into a project: Dirt Rich, a garden tracking app built in Detroit.',
        story:'Raised beds, seed starts, and a lot of trial and error. It slows me down, and it turned into Dirt Rich.', proof:'Dirt Rich',
        links:[{ to:'dirtrich', why:'The curiosity that drifted inward and became an app.' }] } },
    { id:'technology', label:'Technology', parked:true, fx:.74, fy:.9, hubs:['build','work'], also:['science','podcasts'],
      page:{ lede:'[What pulls me in]', story:'[Draft:] New tools change what one person can make. I like testing them early and finding where they actually help.' } } ]}

/* About: one page, opened from the Menu at /about. It sits outside the three gravity points, like the page above.
   Folded in from the old Background and Resume levels (those pages are parked under Work). fold:true sections
   show only what is written; lines still in [brackets] wait here until they are */
export const ABOUT = { id:'about', label:'About', outside:true,
  page:{
    lede:'[One line: who I am]',
    story:'[About me, in my words]',
    tags:['Illustration','Graphic Design','UX/UI','Teaching'],
    image:'/proof/about/scott.webp',
    proof:'Scott Everett',
    study:{
      sub:'Where I come from, and how I trained.',
      actions:[{ label:'Download my resume (PDF)', url:'/cv/scott-everett-resume.pdf' }],
      sections:[
        { title:'About me', fold:true, body:['[About me, in my words]'] },
        { title:'Where it started', fold:true, body:['It started in Detroit with my mom noticing I could draw. That turned into art classes, then custom pieces for family. After we moved to Arizona I took AP Studio Art at Chandler High and figure drawing at Maricopa Community College, which led to an $80K scholarship to CCS.', { list:['Art classes, then custom art for family','AP Studio Art at Chandler High School','Figure drawing at Maricopa Community College','$80K scholarship to the College for Creative Studies'] }] },
        { title:'College for Creative Studies', fold:true, body:['Came for illustration, left as a designer.', 'I started in illustration but quickly found interest in other facets of design: graphic design, typography, package design, and UI/UX. I built my own mix of illustration, package design, and graphic design.'] },
        { title:'SACI Florence, Italy', fold:true, body:['Three months studying abroad at SACI International in Florence, Italy.', '[What the three months were like]', { list:['Graphic design',"Children's book illustration",'Sculpture'] },
          { images:[
            { src:'/proof/saci/1.webp', caption:'Studio Art Centers International, Palazzo Jules Maidoff' },
            { src:'/proof/saci/2.webp', caption:'Carved marble, Italy' },
            { src:'/proof/saci/3.webp', caption:'SACI, Studio Art Center International Florence' }
          ] }] },
        { title:'Skills', fold:true, body:['[Draft list below is pulled from the work on this site. Edit, reorder, or cut.]', { list:['Design research: interviews, problem definition, user testing','UX/UI design and prototyping, web and mobile','Design systems and component libraries','Journey mapping and workshop facilitation','Brand identity and packaging','Web design on WordPress, Wix, and Squarespace, and building with code','Illustration and digital art','Teaching and curriculum design'] }] },
        { title:'My stack', fold:true, body:['The tools I reach for every day, from sketching on iPad to shipping with code.', '[Icons of the software]', { list:['Photoshop, Illustrator, InDesign, and Firefly','Procreate and Procreate Dreams','WordPress, Wix, and Squarespace','React and GSAP','Claude Code'] }] }
      ] },
    links:[{ to:'wesson', why:'Where my illustration lives now.' },{ to:'irule', why:'Where design took me after school.' }] } };

/* ------------------------------------------------------------
   Derived lookups. Nothing below needs editing.
   The linking pass stamps every node with `parent` and `hub`
   (which gravity point it belongs to) and fills BYID so links
   can resolve by id.
   ------------------------------------------------------------ */
/* PARKING. A node with `parked: true` (and everything under it) is lifted out of the live tree before
   anything else reads it: it leaves the map, Just the work, the Gallery, featured previews, Next/Previous
   and "Connects to", and its address is gone. Nothing is deleted: the node keeps all its words and
   pictures, and is kept in PARKED_BYID. Its old address (worked out here, before it is lifted out)
   is remembered in PARKED_PATHS so a visit to it lands on its gravity point instead.
   To bring a page back, remove `parked: true`. */
function slugOfNode(n){ return n.slug || n.label.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
export const PARKED_BYID = {};
export const PARKED_PATHS = {};
(function park(n, path, hubId){
  /* both a level's kids and a page's subs (pages that live under a page) */
  ['kids', 'subs'].forEach(function(list){
    if (!n[list]) return;
    var live = [];
    n[list].forEach(function(k){
      var kPath = path + '/' + slugOfNode(k), kHub = hubId || k.id;
      if (k.parked){
        (function mark(x, xPath){
          PARKED_BYID[x.id] = x; PARKED_PATHS[xPath] = kHub;
          (x.kids || []).concat(x.subs || []).forEach(function(y){ mark(y, xPath + '/' + slugOfNode(y)); });
        })(k, kPath);
      } else { live.push(k); park(k, kPath, kHub); }
    });
    n[list] = live;
  });
})(ROOT, '', null);

/* WHAT SHOWS. A page shows once it is ready: it has a picture (`image`, or a case study `hero`), and its lede and
   story have no [brackets] left. The rule holds for pages marked `waits: true` (new pages: Miss G, Martez Hurd,
   MDHHS) and for every page inside a More (`more: true`, the one smaller "More" blob). Pages that were already live
   show as they are until their lines are written. A page that is not ready is held back like a parked one (off the
   site, its address lands on its gravity point) until it is; write its lines, give it a picture, and it appears.
   A level left with nothing in it (a More, SE|Design) does not show either.
   HELD lists what is waiting, by the level it sits in; HELD_PATHS gives each one's address.

   `alias: 'id'` puts a second door to a page somewhere else in the tree (Miss G in Build). The door shows the same
   page, waits with it, and shows with it. */
export const HELD = {};
export const HELD_PATHS = {};
function readyForMore(n){
  var p = n.page || {}, pic = p.image || (p.study && p.study.hero && p.study.hero.src);
  return !!pic && !/\[/.test((p.lede || '') + ' ' + (p.story || ''));
}
(function aliases(){
  var all = {};
  (function walk(n){ all[n.id] = n; (n.kids || []).concat(n.subs || []).forEach(walk); })(ROOT);
  (function walk(n){
    (n.kids || []).concat(n.subs || []).forEach(function(k){
      var t = k.alias && all[k.alias];
      if (t){ k.page = t.page; k.label = k.label || t.label; k.waits = t.waits; k.slug = k.slug || slugOfNode(t); }
      walk(k);
    });
  })(ROOT);
})();
(function hold(n, path, hubId, inMore){
  ['kids', 'subs'].forEach(function(list){
    if (!n[list]) return;
    var live = [];
    n[list].forEach(function(k){
      var kPath = path + '/' + slugOfNode(k), kHub = hubId || k.id;
      var isLevel = !!(k.kids && k.kids.length);
      if (!isLevel && (k.waits || inMore) && !readyForMore(k)){
        (HELD[n.id] = HELD[n.id] || []).push(k);
        PARKED_BYID[k.id] = k; PARKED_PATHS[kPath] = kHub; HELD_PATHS[k.id] = kPath;
        return;
      }
      hold(k, kPath, kHub, inMore || !!k.more);
      /* a level that has nothing left to show does not show */
      if (isLevel && n !== ROOT && !k.kids.length){ PARKED_PATHS[kPath] = kHub; return; }
      live.push(k);
    });
    n[list] = live;
  });
})(ROOT, '', null, false);

export const BYID = {};
(function link(n, parent, hub){
  n.parent = parent; n.hub = hub; BYID[n.id] = n;
  (n.kids||[]).concat(n.subs||[]).forEach(function(k){ link(k, n, hub || (n === ROOT ? k : hub)); });
})(ROOT, null, null);
ROOT.kids.forEach(function(h){ h.hub = h; });
/* the two pages outside the gravity points */
ABOUT.parent = null; ABOUT.hub = null; BYID[ABOUT.id] = ABOUT;
BYID[CURIO_ROOT.id] = CURIO_ROOT;

/* FOLDED: pages whose words now live on another page. A link to one of these ids lands on the page it was
   folded into (a link to a page that is only parked is skipped). Their old addresses go there too (vercel.json) */
export const FOLDED = {
  civoverview:'civilla', uia:'civilla', emprobation:'civilla',
  samples:'wesson',
  curric:'umf', c1:'umf', c2:'umf', c3:'umf', c4:'umf', c5:'umf', c6:'umf', c7:'umf',
  roots:'about', ccs:'about', saci:'about', skills:'about', stack:'about', resumepdf:'about',
  podcasts:'curio', science:'curio', books:'curio', gardening:'curio', technology:'curio'
};
Object.keys(FOLDED).forEach(function(k){ if (!BYID[k] && BYID[FOLDED[k]]) BYID[k] = BYID[FOLDED[k]]; });

/* the curiosities can be parked the same way */
export const CURIO_BY_ID = {};
CURIO_ROOT.kids = CURIO_ROOT.kids.filter(function(k){ if (k.parked) PARKED_BYID[k.id] = k; return !k.parked; });
CURIO_ROOT.kids.forEach(function(k){ k.parent = CURIO_ROOT; k.curio = true; CURIO_BY_ID[k.id] = k; });

/* A level with exactly one thing inside is passed straight through. This is that one thing, or null. */
export function only(n){ return n && n.kids && n.kids.length === 1 ? n.kids[0] : null; }

/* The deepest the map goes: how many levels a stack can hold, counting the brain itself. The depth dots use it. */
export const MAX_DEPTH = (function deepest(n){
  var d = 0;
  (n.kids || []).forEach(function(k){ if (k.kids && k.kids.length) d = Math.max(d, deepest(k)); });
  return d + 1;
})(ROOT);

/* Label of a gravity point by id, e.g. hubName('teach') -> 'Teach' */
export function hubName(id){ return ROOT.kids.filter(function(k){ return k.id === id; })[0].label; }
