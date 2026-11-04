/* ============================================================
   Inside Scott's Brain: the content tree.

   This is the only file you need to touch to change what the
   brain says. Everything else (the map, the pages, the intro)
   reads from here.

   HOW THE TREE WORKS
   - ROOT is the brain. Its three kids are the gravity points:
     Learn (solid black), Teach (white), Improve (halftone dots).
   - Every node has an id and a label. ids must be unique across
     the whole file; they are what links point at.
   - A node with `kids` goes deeper (a black blob on the map).
     A node without `kids` is a leaf and opens a page (a white blob).
   - `page` is optional. Any field inside it is optional too:
       lede:  one line, shown big under the title
       story: a paragraph
       list:  array of strings, shown as bullets under the story
       proof: caption for the proof panel (image, link, embed later)
       links: [{ to: '<node id>', why: 'one line' }]
              these become the "Connects to" buttons and can jump
              anywhere in the brain, up or down any branch.
   - Text wrapped in [square brackets] is a placeholder. It renders
     with a dashed underline so it is obvious what is still blank.

   HOW TO ADD A NODE
   1. Find the parent in ROOT and add an object to its `kids`:
        { id:'myid', label:'My thing', page:{ lede:'[One line]' } }
   2. If it should branch, give it `kids:[ ... ]` instead of a page.
   3. To link to it from somewhere else, add { to:'myid', why:'...' }
      to that node's page.links. Links are one-way; add the reverse
      on the other node if you want it both ways.

   THE OUTER ORBIT
   CURIO_ROOT holds the curiosities that float around the outside of
   the brain. Each one also has:
       fx, fy: where it sits, as a fraction of the screen (0 to 1)
       hubs:   which gravity points it feeds ('learn','teach','improve')
       also:   ids of other curiosities it touches (drawn as dashed lines)
       sub:    optional short tag shown after the label
   ============================================================ */

/* Shown on a page when that field is still blank. */
export const PH_LEDE = '[One line: what this is to me]';
export const PH_STORY = '[The story: how I got here and why it stuck]';

/* Content from Brain Map: Content Source (Scott's words) + Gap Drafts where the doc is still blank.
   links: { to: node id, why: one line } become "Connects to" jumps anywhere in the brain. */
export const ROOT = { id:'root', label:'Brain', kids:[
  { id:'learn', label:'Learn', fill:'#1a1a1a', text:'#ffffff', swatch:'#1a1a1a', tint:'#ffffff', kids:[
    { id:'illus', label:'Illustration', kids:[
      { id:'roots', label:'Where it started', page:{
        lede:'Started here and never left.',
        story:'It started in Detroit with my mom noticing I could draw. That turned into art classes, then custom pieces for family. After we moved to Arizona I took AP Studio Art at Chandler High and figure drawing at Maricopa Community College, which led to an $80K scholarship to CCS.',
        list:['Art classes, then custom art for family','AP Studio Art at Chandler High School','Figure drawing at Maricopa Community College','$80K scholarship to the College for Creative Studies'],
        proof:'MCC · BFA, CCS · SACI International',
        links:[{ to:'ccs', why:'Where the scholarship took me.' },{ to:'wesson', why:'Where my illustration lives now.' }] }},
      { id:'ccs', label:'CCS, BFA Illustration', page:{
        lede:'Came for illustration, left as a designer.',
        story:'I started in illustration but quickly found interest in other facets of design: graphic design, typography, package design, and UI/UX. I built my own mix of illustration, package design, and graphic design.',
        proof:'BFA in Illustration, College for Creative Studies',
        links:[{ to:'saci', why:'Studied abroad while at CCS.' },{ to:'irule', why:'Where design took me after school.' },{ to:'pack', why:'Package design started here.' }] }},
      { id:'saci', label:'SACI, Florence', page:{
        lede:'Studied abroad at SACI International in Florence, Italy.',
        list:['Graphic design',"Children's book illustration",'Sculpture'],
        proof:'SACI International',
        links:[{ to:'ccs', why:'Part of my time at CCS.' }] }},
      { id:'sketch', label:'Sketchbook', page:{
        lede:'Let loose.',
        story:'Random thoughts and drawings, shapes and wireframes. No client, no brief. This site started on these pages.',
        proof:'[Photos of sketchbook spreads]',
        links:[{ to:'wesson', why:'Quick thoughts here turn into finished pieces.' },{ to:'motion', why:'The storyboard for this site came from here.' }] }} ]},
    { id:'uiux', label:'UI/UX', kids:[
      { id:'irule', label:'iRule / On Controls', page:{
        lede:'Where I cut my teeth in user interface design.',
        story:'Sr. UX/UI Designer, March 2015 to July 2018, in Detroit. I built a design system and library of custom mobile interfaces that wirelessly control lights, thermostats, shades, and appliances across the iRule, On Controls, and Kramer brands.',
        list:['Created a design system and library of custom UIs for mobile devices','Worked with R&D, the dev team, and leadership through wireframes, prototypes, and UX flow charts','Simplified older designs to reflect modern best practices, improving customer experience and workflow','Designed the iRule logo'],
        links:[{ to:'systems', why:'My first real design system.' },{ to:'brand', why:'I designed the iRule logo.' },{ to:'c4', why:'Where I designed apps for a living.' }] }},
      { id:'civilla', label:'Civilla', page:{
        lede:'Design research that shaped services for 2M+ Michigan residents.',
        story:'Sr. UX/UI Designer and Design Researcher at Civilla, a small but mighty team. I conducted interviews, defined problems, ideated, prototyped, user tested, and helped implement across state and government institutions. It is where I learned to really be part of a team.',
        list:['Built 75+ web and mobile prototypes for state and federal initiatives','User research informing services for 2M+ residents','Design lead on a multi-agency benefits platform','Developed core journey map design and facilitation, walkthroughs, and brand collateral','Worked with the Michigan Secretary of State, Michigan Health and Human Services, Starfish, Deloitte, and more'],
        proof:'civilla.com',
        links:[{ to:'c2', why:'The design thinking I practiced here is what I teach now.' },{ to:'sedstudio', why:'Brought the same process to small businesses.' },{ to:'systems', why:'Forms and flows for state agencies.' }] }},
      { id:'systems', label:'Component systems', page:{
        lede:'Build the pieces once, use them everywhere.',
        story:'From remote control interface libraries at iRule to forms and flows for state agencies at Civilla.',
        links:[{ to:'irule', why:'Where the first system came from.' },{ to:'civilla', why:'Forms and flows at government scale.' }] }},
      { id:'a11y', label:'Accessibility audits', page:{
        lede:'Making sure everyone can actually use it.',
        story:'Speed and accessibility audits for nonprofit and small business sites.',
        proof:'Speed and accessibility audit, dreamofdetroit.org',
        links:[{ to:'web', why:'Audits make the sites better.' }] }} ]},
    { id:'sed', label:'SE|Design Studio', kids:[
      { id:'sedstudio', label:'The studio', page:{
        lede:'My on-demand design studio for small businesses, nonprofits, and entrepreneurs.',
        story:'Working with entrepreneurs and small businesses to level up their brand is my jam. Monthly design partnerships instead of one-off projects, with the same research-first process I used at Civilla.',
        list:['Partners include Local Butcher, Robear Detroit, C4 Combat, and [Viacon]'],
        links:[{ to:'civilla', why:'Same process, smaller scale.' },{ to:'web', why:'Most partnerships include the site.' }] }},
      { id:'brand', label:'Brand identity', page:{
        lede:'Logos and the systems around them.',
        list:['iRule logo','Robear Detroit','C4 Combat','Local Butcher'],
        links:[{ to:'roots', why:'The hand behind the marks.' },{ to:'irule', why:'I designed the iRule logo.' }] }},
      { id:'pack', label:'Packaging', page:{
        lede:'Where illustration meets the shelf.',
        list:['Atwater Beer: Voodoo Vator Doppelbock'],
        proof:'[Label photos]',
        links:[{ to:'ccs', why:'Package design started at CCS.' }] }},
      { id:'web', label:'Web design', page:{
        lede:'Sites people can actually run themselves.',
        story:'Building and managing CMS sites for partners on WordPress, Wix, and Squarespace. Lately I am building with Claude Code too.',
        links:[{ to:'cc', why:'Moving from templates to building my own.' },{ to:'c3', why:'I teach web design at U of M-Flint.' }] }},
      { id:'merit', label:'Give Merit tees', page:{
        lede:'Students design it and wear it.',
        story:'Give Merit helps high school students pay for college. As their graphic designer, I have helped four rounds of students design and promote their own garments.',
        proof:'[Photos of the work and the finished garments]',
        links:[{ to:'umf', why:'Teaching outside the classroom.' }] }} ]} ]},
  { id:'teach', label:'Teach', fill:'#ffffff', text:'#1a1a1a', swatch:'#ffffff', tint:'#ffffff', kids:[
    { id:'umf', label:'U of M-Flint', page:{
      lede:'I teach the way I learned, by making.',
      story:'I started teaching at the University of Michigan-Flint, where I designed and taught multiple curriculums and managed and facilitated workshops.',
      list:['Designed and taught seven courses','Managed and facilitated workshops'],
      proof:'[Syllabi, student work, workshop photos]',
      links:[{ to:'curric', why:'The seven courses I designed and taught.' },{ to:'civilla', why:'I teach the design thinking I practiced in the field.' }] }},
    { id:'curric', label:'Curriculum', kids:[
      { id:'c1', label:'Digital Media' },
      { id:'c2', label:'Design Thinking', page:{ lede:'Start with people, not pixels.', links:[{ to:'civilla', why:'What I did every day at Civilla.' }] }},
      { id:'c3', label:'Web Design', page:{ links:[{ to:'web', why:'What I build for partners.' }] }},
      { id:'c4', label:'App Design', page:{ links:[{ to:'irule', why:'Where I designed apps for a living.' }] }},
      { id:'c5', label:'Interaction Design', page:{ links:[{ to:'cc', why:'This site is an interaction design project.' }] }},
      { id:'c6', label:'Storytelling', page:{ lede:'Every design tells a story, so tell it on purpose.', story:'[One project students do in this class]' }},
      { id:'c7', label:'Information and Experience Design', page:{ links:[{ to:'civilla', why:'Journey maps and walkthroughs.' }] }} ]},
    { id:'workshops', label:'Workshops', page:{
      lede:'Managed and facilitated workshops.',
      links:[{ to:'civilla', why:'Facilitation started with journey mapping sessions.' }] }} ]},
  { id:'improve', label:'Improve', fill:'url(#halftone)', text:'#1a1a1a', halo:true, swatch:'radial-gradient(#1a1a1a 1.3px, #ffffff 1.6px) 0 0/5px 5px', tint:'#ffffff', kids:[
    { id:'ai', label:'AI', kids:[
      { id:'cc', label:'Claude Code + React', page:{
        lede:'Designing with code, not just for it.',
        story:'It started as an experiment: could a designer with some coding experience ship a real site with Claude Code? The first interactive resume went live. This brain is version two.',
        list:['Built with React, GSAP, and Claude Code'],
        proof:'This site',
        links:[{ to:'web', why:'Moving past templates.' },{ to:'c5', why:'I teach interaction design.' }] }} ]},
    { id:'ff', label:'First Fire', kids:[
      { id:'game', label:'The game', page:{
        lede:'A prehistoric survival game where you guide your people through their shaman.',
        story:'A Tamagotchi-style game I am building and drawing myself, sprite by sprite.',
        proof:'[First Fire screenshots]',
        links:[{ to:'pixel', why:'Every sprite starts there.' },{ to:'cc', why:'Built with Claude Code.' }] }},
      { id:'pixel', label:'Pixel art', page:{
        lede:'Everything starts with a pixel.',
        story:'I am working on a game, and the best way to learn is to start small. I am learning to draw and animate on iPad with Procreate and Procreate Dreams.',
        proof:'[First Fire game, process images]',
        links:[{ to:'game', why:'Every sprite in the game starts here.' },{ to:'roots', why:'Same hand, smaller grid.' }] }} ]},
    { id:'wesson', label:'Wesson Art', page:{
      lede:'Where I always land on my feet. The base of it all.',
      story:'Wesson Art is where my digital art lives, mostly drawn on iPad: portraits, animals, and editorial work.',
      list:['20+ portraits for How I Built This','Four years of John Templeton Prize laureate portraits','Mural at the Ann Arbor District Library','A few MOCAD drawing challenges'],
      proof:'Wessonart.com',
      links:[{ to:'sketch', why:'Where the pieces start.' },{ to:'vault', why:'The idea came from my own digital art.' }] }},
    { id:'dirtrich', label:'Dirt Rich', page:{
      lede:'A garden tracker built in Detroit.',
      story:'Seed starting and tracking across four grow zones. A curiosity that turned into an app.',
      links:[{ to:'cc', why:'Built the way I build now.' }] }},
    { id:'motion', label:'Motion graphics', page:{
      lede:'Drawings that move.',
      links:[{ to:'pixel', why:'Animating in Procreate Dreams.' },{ to:'cc', why:'The intro of this site is a motion piece.' }] }},
    { id:'print3d', label:'3D printing', page:{ lede:'[What I am printing, or want to print]' }},
    { id:'vault', label:'Vaultmark', page:{
      lede:'Proving digital art is the real thing.',
      story:'A digital art authentication concept I developed into provisional patent materials.',
      links:[{ to:'wesson', why:'It came from my own digital work.' }] }} ]} ]};

/* outer orbit: curiosities not pulled in yet. hubs = which gravity points they feed, also = other curiosities they touch */
export const CURIO_ROOT = { id:'curio', label:"Can't Stop Thinking About", curio:true,
  page:{ lede:'The outer ring. Loose curiosities that feed what I am chasing. When one turns into a real project, it drifts inward.' },
  kids:[
    { id:'podcasts', label:'Podcasts', fx:.09, fy:.17, hubs:['teach'], also:['technology'] },
    { id:'science', label:'Science', fx:.86, fy:.13, hubs:['improve'], also:['biology','technology'] },
    { id:'biology', label:'Biology', fx:.9, fy:.6, hubs:['improve'], also:['science','gardening'],
      page:{ lede:'[What keeps pulling me toward the very small, like neurons]' } },
    { id:'gardening', label:'Gardening', sub:'→ Dirt Rich', fx:.11, fy:.8, hubs:['improve','learn'], also:['biology'],
      page:{ lede:'A curiosity that turned into a project: Dirt Rich, a garden tracking app built in Detroit.', proof:'Dirt Rich',
        links:[{ to:'dirtrich', why:'The curiosity that drifted inward and became an app.' }] } },
    { id:'technology', label:'Technology', fx:.74, fy:.9, hubs:['improve','learn'], also:['science','podcasts'] } ]};

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

/* Label of a gravity point by id, e.g. hubName('teach') -> 'Teach' */
export function hubName(id){ return ROOT.kids.filter(function(k){ return k.id === id; })[0].label; }
