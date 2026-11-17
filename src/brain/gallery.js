import { ROOT, CURIO_ROOT } from './content';

/* ============================================================
   Every picture on the site, gathered for the Gallery.

   Nothing here needs editing. The list is built from content.js:
     - each page's `image` (with its `proof` caption) and `more`
     - the `gallery` extras on a go:'gallery' leaf, which belong to
       no page of their own

   Each picture:
     src, caption
     page   the node whose page it is on (null for an extra)
     level  for an extra: the level its leaf sits in, which is where it leads instead
     hub    the gravity point it sits under (null in the outer orbit)
     tags   the page's tags, or the extra's own tag
     line   ids of every level above it, for narrowing to one level
   ============================================================ */

function written(s){ return s && !/^\[.*\]$/.test(s); }

export const PICTURES = (function(){
  var out = [], seen = {};
  function add(pic){ if (pic.src && !seen[pic.src]){ seen[pic.src] = true; out.push(pic); } }
  function walk(n, line){
    var p = n.page || {}, hub = n.hub || null;
    if (n.go === 'gallery'){
      (p.gallery || []).forEach(function(g){
        add({ src:g.src, caption:g.caption || g.tag || n.parent.label, page:null, level:n.parent, hub:hub, tags:g.tag ? [g.tag] : [], line:line });
      });
    } else if (!p.doc){
      var tags = p.tags || [];
      if (p.image) add({ src:p.image, caption:written(p.proof) ? p.proof : n.label, page:n, hub:hub, tags:tags, line:line });
      (p.more || []).forEach(function(m){
        add(typeof m === 'string'
          ? { src:m, caption:n.label, page:n, hub:hub, tags:tags, line:line }
          : { src:m.src, caption:m.caption || n.label, page:n, hub:hub, tags:tags, line:line });
      });
    }
    (n.kids || []).forEach(function(k){ walk(k, line.concat(n.id)); });
  }
  walk(ROOT, []);
  walk(CURIO_ROOT, []);
  return out;
})();

/* the pictures under one level (a node id), or all of them */
export function picturesIn(levelId){
  return levelId ? PICTURES.filter(function(p){ return p.line.indexOf(levelId) >= 0; }) : PICTURES;
}
