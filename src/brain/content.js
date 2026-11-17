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
     page when pressed.
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
       more:  optional extra pictures for the "More" strip, same form.
              To give one its own caption write it as
              { src: '/proof/name.webp', caption: '...' }
              Pressing any picture opens it full screen, and the arrows
              step through the page's pictures: `image` first, then `more`.
       action: optional button, { label: '...', go: 'studio' } opens the
              Work with me page; { label: '...', url: 'https://...' }
              opens another site in a new tab
       gallery: makes the page a wall of pictures with filter buttons
              instead of the usual layout: an array of
              { src: '/proof/name.webp', tag: 'Branding', caption: '...' }.
              `tag` should be one of the page's `tags`.
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
   TITLES, just below this comment.

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

/* The two titles in the top-left corner.
     home: on the opening screen with the character. It fades as the intro starts.
     map:  on the map, once you are inside the brain.
   `sub` is the small line under the title; leave it as '' for none. */
export const TITLES = {
  home: { title: 'What up doe.', sub: "I'm Scott Everett, Omni Designer. I design, build, and teach in Detroit." },
  map:  { title: 'It all connects.', sub: '' }
};

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

/* Shown on a page when that field is still blank. */
export const PH_LEDE = '[One line: what this is to me]';
export const PH_STORY = '[The story: how I got here and why it stuck]';

/* Content from "Inside Scott's Brain: Site Content" (Scott's words, plus drafts where a line is still blank).
   links: { to: node id, why: one line } become "Connects to" jumps anywhere in the brain. */
export const ROOT = { id:'root', label:'Brain', kids:[
  { id:'work', label:'Work', blurb:'[Short blurb]', kids:[
    { id:'does', label:'What I Do', blurb:'[Short blurb]', kids:[
      { id:'sedesign', label:'SE|Design', blurb:'My on-demand design studio for small businesses, nonprofits, and entrepreneurs.', kids:[
        { id:'cases', label:'Case Studies', blurb:'[Short blurb]', kids:[
          { id:'robear', label:'Robear Detroit', page:{
            lede:'Custom landing page, 2025.',
            story:'Robear Detroit needed [what they needed]. I designed and built a custom landing page and [brand work], so they could [result]. [What changed for them after launch.]',
            tags:['Site','Branding'],
            proof:'[Screens of the landing page]',
            links:[{ to:'sedesign', why:'A studio partnership.' }] }},
          { id:'martez', label:'Martez Hurd', page:{
            lede:'[One line: the project]',
            story:'[Martez Hurd is / does ___]. He needed a site and a brand that [goal]. I built [what you made], and now [what changed].',
            tags:['Site','Branding'] }},
          { id:'krw', label:'KRW', page:{
            lede:'[One line: the project]',
            story:'KRW came to me for [brand need]. I designed [logo, brand system, social templates], so they could show up consistently on social. [Result.] Their website is next.',
            tags:['Branding','Social Media'],
            links:[{ to:'krwsite', why:'Their website is next.' }] }} ]},
        /* a wall of pictures with filters. Each picture: { src, tag, caption }. `tag` is one of the page's tags */
        { id:'gallery', label:'Gallery', page:{
          lede:'[Short blurb]',
          story:'A wall of the work. Logos, sites, packaging, posts, and illustrations from SE|Design projects. Filter by what you’re looking for.',
          tags:['Branding','Site','Social Media','Packaging','Illustration'],
          gallery:[
            { src:'/proof/brand-system.webp', tag:'Branding', caption:'Brand system, SE|Design' }
          ] }},
        /* not a page of its own: pressing it opens the Work with me page (studio.js) */
        { id:'workwithme', label:'Work with me', go:'studio' } ]},
      { id:'uxr', label:'Senior UX/UI Designer + Design Researcher', blurb:'[Short blurb]', kids:[
        { id:'civilla', label:'Civilla', blurb:'Design research that shaped services for 2M+ Michigan residents.', kids:[
          { id:'civoverview', label:'Overview', page:{
            lede:'Design research that shaped services for 2M+ Michigan residents.',
            story:'Sr. UX/UI Designer and Design Researcher at Civilla, a small but mighty team. I conducted interviews, defined problems, ideated, prototyped, user tested, and helped implement across state and government institutions. It is where I learned to really be part of a team.',
            list:['Built 75+ web and mobile prototypes for state and federal initiatives','User research informing services for 2M+ residents','Design lead on a multi-agency benefits platform','Developed core journey map design and facilitation, walkthroughs, and brand collateral','Worked with the Michigan Secretary of State, Michigan Health and Human Services, Starfish, Deloitte, and more'],
            tags:['Design Research','UX/UI','Service Design','Government'],
            proof:'Journey maps, Civilla',
            image:'/proof/civilla-journey-maps.webp',
            more:[{ src:'/proof/civilla-renewal-notice.webp', caption:'Renewal notice, Civilla' },{ src:'/proof/civilla-mobile-prototypes.webp', caption:'Mobile prototypes, Civilla' }],
            links:[{ to:'c2', why:'The design thinking I practiced here is what I teach now.' },{ to:'sedesign', why:'Brought the same process to small businesses.' }] }},
          { id:'mdhhs', label:'MDHHS', page:{
            lede:'[My role and what we made]',
            story:'With Michigan Health and Human Services, I [researched / designed ___] to make [service] easier for residents to [action]. My role: [interviews, prototypes, testing]. [Outcome.]',
            tags:['Design Research','UX/UI','Government'] }},
          { id:'emprobation', label:'Eastern Michigan Probation Dept', page:{
            lede:'[My role and what we made]',
            story:'With the probation department, I [researched / designed ___] so people on probation could [goal]. My role: [___]. [Outcome.]',
            tags:['Design Research','UX/UI','Government'] }},
          { id:'uia', label:'Unemployment Insurance Agency', page:{
            lede:'[My role and what we made]',
            story:'With the Unemployment Insurance Agency, I [researched / designed ___] to help residents [file / understand / get through ___]. My role: [___]. [Outcome.]',
            tags:['Design Research','UX/UI','Government'] }},
          { id:'sos', label:'Secretary of State', page:{
            lede:'[My role and what we made]',
            story:'With the Michigan Secretary of State, I helped redesign [notices / forms / ___] so residents could [goal]. My role: [___]. [Outcome.]',
            tags:['Design Research','UX/UI','Government'] }},
          { id:'cohere', label:'Project Cohere', page:{
            lede:'[My role and what we made]',
            story:'Cohere is a benefits navigation tool for Michigan residents. I [designed / researched / prototyped ___] to help people find and apply for the support they qualify for. My role: [___]. [Outcome.]',
            tags:['Design Research','UX/UI','Government'] }} ]} ]},
      { id:'wesson', label:'Wesson Art', blurb:'Where I always land on my feet. The base of it all.', kids:[
        { id:'samples', label:'Work Samples', page:{
          lede:'Where I always land on my feet. The base of it all.',
          story:'Wesson Art is where my digital art lives, mostly drawn on iPad: portraits, animals, and editorial work.',
          list:['20+ portraits for How I Built This','Four years of John Templeton Prize laureate portraits','Mural at the Ann Arbor District Library','A few MOCAD drawing challenges'],
          tags:['Illustration','Portraits','Editorial'],
          proof:'Ann Arbor District Library, Black History Bicentennial',
          image:'/proof/aadl-bicentennial.webp',
          action:{ label:'Visit wessonart.com', url:'https://wessonart.com' },
          links:[{ to:'sketch', why:'Where the pieces start.' },{ to:'vault', why:'The idea came from my own digital art.' }] }},
        { id:'sketch', label:'Sketchbook', page:{
          lede:'Let loose.',
          story:'Random thoughts and drawings, shapes and wireframes. No client, no brief. This site started on these pages.',
          tags:['Illustration','Process'],
          proof:'[Photos of sketchbook spreads]',
          links:[{ to:'samples', why:'Quick thoughts here turn into finished pieces.' },{ to:'thissite', why:'The storyboard for this site came from here.' }] }} ]} ]},
    { id:'resume', label:'Resume', blurb:'[Short blurb]', kids:[
      { id:'resumepdf', label:'Resume PDF', page:{
        lede:'Roles, dates, and skills on one page.',
        doc:{ file:'/cv/scott-everett-resume.pdf', pages:['/cv/page-1.webp'] } }},
      { id:'iresume', label:'Interactive Resume', blurb:'[Short blurb]', kids:[
        { id:'irule', label:'iRule', page:{
          lede:'Where I cut my teeth in user interface design.',
          story:'Sr. UX/UI Designer, March 2015 to July 2018, in Detroit. I built a design system and library of custom mobile interfaces that wirelessly control lights, thermostats, shades, and appliances across the iRule, On Controls, and Kramer brands.',
          list:['Created a design system and library of custom UIs for mobile devices','Worked with R&D, the dev team, and leadership through wireframes, prototypes, and UX flow charts','Simplified older designs to reflect modern best practices, improving customer experience and workflow','Designed the iRule logo'],
          tags:['UX/UI','Design Systems','Mobile','Branding'],
          links:[{ to:'c4', why:'Where I designed apps for a living.' }] }},
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
    { id:'background', label:'Background', blurb:'[Short blurb]', kids:[
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
        proof:'SACI International',
        links:[{ to:'ccs', why:'Part of my time at CCS.' }] }},
      { id:'about', label:'About', page:{
        lede:'[One line: who I am]',
        story:'[About me, in my words]' }} ]} ]},
  { id:'teach', label:'Teach', blurb:'[Short blurb]', kids:[
    { id:'umf', label:'UofM Flint', page:{
      lede:'I teach the way I learned, by making.',
      story:'I started teaching at the University of Michigan-Flint, where I designed and taught multiple curriculums and managed and facilitated workshops.',
      list:['Designed and taught seven courses','Managed and facilitated workshops'],
      tags:['Teaching','Curriculum Design','Workshops'],
      proof:'[Syllabi, student work, workshop photos]',
      links:[{ to:'curric', why:'The seven courses I designed and taught.' },{ to:'civilla', why:'I teach the design thinking I practiced in the field.' }] }},
    { id:'curric', label:'Curriculum', blurb:'[Short blurb]', kids:[
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
  { id:'build', label:'Build', blurb:'[Short blurb]', kids:[
    { id:'stack', label:'My stack', page:{
      lede:'The tools I reach for every day, from sketching on iPad to shipping with code.',
      story:'[Icons of the software]',
      list:['Photoshop, Illustrator, InDesign, and Firefly','Procreate and Procreate Dreams','WordPress, Wix, and Squarespace','React and GSAP','Claude Code'] }},
    { id:'apps', label:'Apps', kids:[
      { id:'dirtrich', label:'Dirt Rich', page:{
        lede:'A garden tracker built in Detroit.',
        story:'Seed starting and tracking across four grow zones. A curiosity that turned into an app.',
        tags:['App','Product Design'],
        links:[{ to:'thissite', why:'Built the way I build now.' }] }} ]},
    { id:'games', label:'Games', kids:[
      { id:'ff', label:'First Fire', page:{
        lede:'A prehistoric survival game where you guide your people through their shaman.',
        story:'A Tamagotchi-style game I am building and drawing myself, sprite by sprite. I am learning to draw and animate the pixel art on iPad with Procreate and Procreate Dreams.',
        tags:['Game','Pixel Art'],
        proof:'[First Fire screenshots]',
        links:[{ to:'thissite', why:'Built with Claude Code.' }] }} ]},
    { id:'software', label:'Software', kids:[
      { id:'vault', label:'VaultMark', page:{
        lede:'Proving digital art is the real thing.',
        story:'A digital art authentication concept I developed into provisional patent materials.',
        tags:['Software','Concept'],
        links:[{ to:'samples', why:'It came from my own digital work.' }] }} ]},
    { id:'websites', label:'Websites', kids:[
      { id:'thissite', label:'This Site', page:{
        lede:'Designing with code, not just for it.',
        story:'It started as an experiment: could a designer with some coding experience ship a real site with Claude Code? The first interactive resume went live. This brain is version two.',
        list:['Built with React, GSAP, and Claude Code'],
        tags:['Website','Interaction Design','Code'],
        proof:'This site',
        links:[{ to:'c5', why:'I teach interaction design.' },{ to:'sketch', why:'The storyboard started in the sketchbook.' }] }},
      { id:'krwsite', label:'KRW Site', page:{
        lede:'Coming soon.',
        story:'[What it will be]',
        tags:['Website'],
        links:[{ to:'krw', why:'The brand came first.' }] }} ]} ]} ]};

/* outer orbit: curiosities not pulled in yet. hubs = which gravity points they feed, also = other curiosities they touch */
export const CURIO_ROOT = { id:'curio', label:"Can't Stop Thinking About", curio:true,
  page:{ lede:'The outer ring. Loose curiosities that feed what I am chasing. When one turns into a real project, it drifts inward.' },
  kids:[
    { id:'podcasts', label:'Podcasts', fx:.09, fy:.17, hubs:['teach'], also:['books','technology'],
      page:{ lede:'[Which ones, and why]', story:'What’s in my ears while I work. [Two or three favorites, and why.]' } },
    { id:'science', label:'Science', fx:.86, fy:.13, hubs:['build'], also:['technology','gardening'],
      page:{ lede:'[What pulls me in]', story:'[Draft:] I’m drawn to how things work at the smallest scale, like cells and neurons. A lot of this site’s brain started there.' } },
    { id:'books', label:'Books', fx:.9, fy:.6, hubs:['teach'], also:['podcasts'],
      page:{ lede:'[Which ones, and why]', story:'What I’m reading right now. [Two or three titles.]' } },
    { id:'gardening', label:'Gardening', sub:'→ Dirt Rich', fx:.11, fy:.8, hubs:['build','work'], also:['science'],
      page:{ lede:'A curiosity that turned into a project: Dirt Rich, a garden tracking app built in Detroit.',
        story:'Raised beds, seed starts, and a lot of trial and error. It slows me down, and it turned into Dirt Rich.', proof:'Dirt Rich',
        links:[{ to:'dirtrich', why:'The curiosity that drifted inward and became an app.' }] } },
    { id:'technology', label:'Technology', fx:.74, fy:.9, hubs:['build','work'], also:['science','podcasts'],
      page:{ lede:'[What pulls me in]', story:'[Draft:] New tools change what one person can make. I like testing them early and finding where they actually help.' } } ]};

/* ------------------------------------------------------------
   Derived lookups. Nothing below needs editing.
   The linking pass stamps every node with `parent` and `hub`
   (which gravity point it belongs to) and fills BYID so links
   can resolve by id.
   ------------------------------------------------------------ */
export const BYID = {};
(function link(n, parent, hub){
  n.parent = parent; n.hub = hub; BYID[n.id] = n;
  (n.kids||[]).forEach(function(k){ link(k, n, hub || (n === ROOT ? k : hub)); });
})(ROOT, null, null);
ROOT.kids.forEach(function(h){ h.hub = h; });

export const CURIO_BY_ID = {};
CURIO_ROOT.kids.forEach(function(k){ k.parent = CURIO_ROOT; k.curio = true; CURIO_BY_ID[k.id] = k; });

/* The deepest the map goes: how many levels a stack can hold, counting the brain itself. The depth dots use it. */
export const MAX_DEPTH = (function deepest(n){
  var d = 0;
  (n.kids || []).forEach(function(k){ if (k.kids && k.kids.length) d = Math.max(d, deepest(k)); });
  return d + 1;
})(ROOT);

/* Label of a gravity point by id, e.g. hubName('teach') -> 'Teach' */
export function hubName(id){ return ROOT.kids.filter(function(k){ return k.id === id; })[0].label; }
