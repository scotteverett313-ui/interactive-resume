import { ROOT, CURIO_ROOT } from './content';
import { NOTE_BY_SLUG } from './notes';

/* ============================================================
   Addresses. Every place in the brain has its own link:

     /                              the opening screen, then the map
     /work                          a gravity point's level
     /work/what-i-do/se-design      a level deeper (levels nest as far as the tree does)
     /work/what-i-do/se-design/case-studies/robear-detroit    a page
     /work/resume/resume-pdf        the resume, shown on screen with a download button
     /orbit                         the "Can't stop thinking about" page
     /orbit/gardening               a curiosity's page
     /work-with-me                  the SE|Design services page
     /notes  and  /notes/<slug>     the notes list, and one note

   A node's part of the address is made from its label ("Case studies"
   gives "case-studies"). To pin it so it survives a rename, give the node a
   `slug` in content.js.
   ============================================================ */

export const STUDIO_PATH = '/work-with-me';
export const NOTES_PATH = '/notes';
export const ORBIT_PATH = '/orbit';

export function slugify(s){
  return s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export function slugOf(node){ return node.slug || slugify(node.label); }

/* The address for what is on screen.
   view: { stack, pageNode, sheet }  sheet is null, { type:'studio' } or { type:'notes', slug } */
export function pathFor(view){
  var sheet = view.sheet, pageNode = view.pageNode;
  if (sheet) return sheet.type === 'studio' ? STUDIO_PATH : (sheet.slug ? NOTES_PATH + '/' + sheet.slug : NOTES_PATH);
  if (pageNode && pageNode.curio) return pageNode === CURIO_ROOT ? ORBIT_PATH : ORBIT_PATH + '/' + slugOf(pageNode);
  var parts = view.stack.slice(1).map(slugOf);
  if (pageNode) parts.push(slugOf(pageNode));
  return '/' + parts.join('/');
}

/* What an address shows. Anything it does not recognise comes back as the top of the brain with found:false. */
export function parsePath(pathname){
  var home = { stack:[ROOT], pageNode:null, sheet:null, found:true };
  var parts = pathname.split('/').filter(Boolean).map(function(p){ return decodeURIComponent(p).toLowerCase(); });
  if (!parts.length) return home;
  var first = '/' + parts[0];
  if (first === STUDIO_PATH && parts.length === 1) return { stack:[ROOT], pageNode:null, sheet:{ type:'studio' }, found:true };
  if (first === NOTES_PATH){
    if (parts.length === 1) return { stack:[ROOT], pageNode:null, sheet:{ type:'notes', slug:null }, found:true };
    if (parts.length === 2 && NOTE_BY_SLUG[parts[1]]) return { stack:[ROOT], pageNode:null, sheet:{ type:'notes', slug:parts[1] }, found:true };
    return { stack:[ROOT], pageNode:null, sheet:{ type:'notes', slug:null }, found:false };
  }
  if (first === ORBIT_PATH){
    if (parts.length === 1) return { stack:[ROOT], pageNode:CURIO_ROOT, sheet:null, found:true };
    var c = CURIO_ROOT.kids.filter(function(k){ return slugOf(k) === parts[1]; })[0];
    return c && parts.length === 2 ? { stack:[ROOT], pageNode:c, sheet:null, found:true } : { stack:[ROOT], pageNode:CURIO_ROOT, sheet:null, found:false };
  }
  /* walk down the tree one part at a time */
  function kidCalled(node, slug){
    var kids = node.kids || [];
    for (var k = 0; k < kids.length; k++) if (slugOf(kids[k]) === slug) return kids[k];
    return null;
  }
  var stack = [ROOT], node = ROOT;
  for (var i = 0; i < parts.length; i++){
    var next = kidCalled(node, parts[i]);
    if (!next) return { stack:stack, pageNode:null, sheet:null, found:false };
    if (next.go === 'studio') return { stack:stack, pageNode:null, sheet:{ type:'studio' }, found:true };
    if (next.kids && next.kids.length){ stack.push(next); node = next; }
    else return { stack:stack, pageNode:next, sheet:null, found: i === parts.length - 1 };
  }
  return { stack:stack, pageNode:null, sheet:null, found:true };
}

/* The browser tab's text for what is on screen. */
export function titleFor(view, site){
  var name = null;
  if (view.sheet) name = view.sheet.type === 'studio' ? 'Work with me' : (view.sheet.slug && NOTE_BY_SLUG[view.sheet.slug] ? NOTE_BY_SLUG[view.sheet.slug].title : 'Notes');
  else if (view.pageNode) name = view.pageNode.label;
  else if (view.stack.length > 1) name = view.stack[view.stack.length - 1].label;
  return name ? name + ' · ' + site : site;
}
