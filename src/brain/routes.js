import { ROOT, CURIO_ROOT, only } from './content';
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
     /gallery                       every picture on the site
     /the-work                      every finished page as a plain list ("Just the work")
     /work/what-i-do/se-design/gallery   the gallery, narrowed to SE|Design
     /notes  and  /notes/<slug>     the notes list, and one note

   A node's part of the address is made from its label ("Case studies"
   gives "case-studies"). To pin it so it survives a rename, give the node a
   `slug` in content.js.
   ============================================================ */

export const STUDIO_PATH = '/work-with-me';
export const NOTES_PATH = '/notes';
export const ORBIT_PATH = '/orbit';
export const GALLERY_PATH = '/gallery';
export const INDEX_PATH = '/the-work';

/* a node's ancestors from the brain down to the node itself: [ROOT, ..., node] */
export function lineOf(node){
  var line = [];
  for (var x = node; x; x = x.parent) line.unshift(x);
  return line;
}

/* A level with one thing inside is never shown on its own (see `only` in content.js). Given where someone is
   trying to stand, this returns where they actually end up:
     - a stack ending on such a level carries on into the one level inside it, or
     - if the one thing inside is a page, that page opens and the stack backs out to the last real level
   A page that is already open keeps the same rule: the stack under it never ends on a pass-through level. */
export function settle(stack, pageNode){
  stack = stack.slice();
  for (;;){
    var kid = only(stack[stack.length - 1]);
    if (!kid || !(kid.kids && kid.kids.length)) break;
    stack.push(kid);
  }
  var last = only(stack[stack.length - 1]);
  if (last && !pageNode && !last.go) pageNode = last;
  if (pageNode || last) while (stack.length > 1 && only(stack[stack.length - 1])) stack.pop();
  return { stack:stack, pageNode:pageNode || null, go:last && last.go ? last : null };
}

export function slugify(s){
  return s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export function slugOf(node){ return node.slug || slugify(node.label); }

/* The address for what is on screen.
   view: { stack, pageNode, sheet }  sheet is null, { type:'studio' } or { type:'notes', slug } */
export function pathFor(view){
  var sheet = view.sheet, pageNode = view.pageNode;
  if (sheet && sheet.type === 'studio') return STUDIO_PATH;
  if (sheet && sheet.type === 'notes') return sheet.slug ? NOTES_PATH + '/' + sheet.slug : NOTES_PATH;
  /* the gallery narrowed to a level lives at the address of the node that opens it */
  if (sheet && sheet.type === 'index') return INDEX_PATH;
  if (sheet && sheet.type === 'gallery') return sheet.node ? '/' + lineOf(sheet.node).slice(1).map(slugOf).join('/') : GALLERY_PATH;
  if (pageNode && pageNode.curio) return pageNode === CURIO_ROOT ? ORBIT_PATH : ORBIT_PATH + '/' + slugOf(pageNode);
  /* a page's address is its own place in the tree, whatever level is showing behind it */
  if (pageNode) return '/' + lineOf(pageNode).slice(1).map(slugOf).join('/');
  return '/' + view.stack.slice(1).map(slugOf).join('/');
}

/* What an address shows. Anything it does not recognise comes back as the top of the brain with found:false. */
export function parsePath(pathname){
  var home = { stack:[ROOT], pageNode:null, sheet:null, found:true };
  var parts = pathname.split('/').filter(Boolean).map(function(p){ return decodeURIComponent(p).toLowerCase(); });
  if (!parts.length) return home;
  var first = '/' + parts[0];
  if (first === STUDIO_PATH && parts.length === 1) return { stack:[ROOT], pageNode:null, sheet:{ type:'studio' }, found:true };
  if (first === INDEX_PATH) return { stack:[ROOT], pageNode:null, sheet:{ type:'index' }, found:parts.length === 1 };
  if (first === GALLERY_PATH) return { stack:[ROOT], pageNode:null, sheet:{ type:'gallery', node:null }, found:parts.length === 1 };
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
  /* where the walk ended, with single-item levels passed through */
  function land(stack, pageNode, found){
    var at = settle(stack, pageNode);
    return { stack:at.stack, pageNode:at.pageNode, sheet:at.go ? sheetFor(at.go) : null, found:found };
  }
  var stack = [ROOT], node = ROOT;
  for (var i = 0; i < parts.length; i++){
    var next = kidCalled(node, parts[i]);
    if (!next) return land(stack, null, false);
    if (next.go) return { stack:settle(stack, next).stack, pageNode:null, sheet:sheetFor(next), found:true };
    if (next.kids && next.kids.length){ stack.push(next); node = next; }
    else return land(stack, next, i === parts.length - 1);
  }
  return land(stack, null, true);
}

/* The full-screen page a `go` leaf opens: Work with me, or the gallery narrowed to the level the leaf sits in. */
export function sheetFor(node){
  return node.go === 'gallery' ? { type:'gallery', node:node } : { type:'studio' };
}

/* The browser tab's text for what is on screen. */
export function titleFor(view, site){
  var name = null;
  if (view.sheet && view.sheet.type === 'index') name = 'Just the work';
  else if (view.sheet && view.sheet.type === 'gallery') name = 'Gallery';
  else if (view.sheet) name = view.sheet.type === 'studio' ? 'Work with me' : (view.sheet.slug && NOTE_BY_SLUG[view.sheet.slug] ? NOTE_BY_SLUG[view.sheet.slug].title : 'Notes');
  else if (view.pageNode) name = view.pageNode.label;
  else if (view.stack.length > 1) name = view.stack[view.stack.length - 1].label;
  return name ? name + ' · ' + site : site;
}
