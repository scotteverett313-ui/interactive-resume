/* Pure helpers for the brain map. No DOM, no React. */

/* Seeded random, so layouts are stable between renders. */
export function rng(seed){ return function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }

export function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

/* Wobbly blob outline as an SVG path.
   cx, cy, r: center and base radius
   t: time in seconds, drives the morph
   seed, amp: per-blob phase and wobble amount
   pull (px, py) stretches the side of the blob facing that direction, like goo */
export function blobPath(cx, cy, r, t, seed, amp, px, py){
  var N = 12, p = [];
  var mag = Math.hypot(px || 0, py || 0), ux = mag ? px / mag : 0, uy = mag ? py / mag : 0;
  for (var i = 0; i < N; i++){
    var a = i / N * Math.PI * 2 + seed * .3, ca = Math.cos(a), sa = Math.sin(a);
    var k = 1 + amp * (.55 * Math.sin(t * .9 + seed + i * 1.3) + .45 * Math.sin(t * 1.37 + seed * 2 + i * 1.9));
    var align = ca * ux + sa * uy;
    var extra = align > 0 ? align * align * align * mag : align * -.12 * mag;
    p.push([cx + ca * (r * k + extra), cy + sa * (r * k + extra)]);
  }
  var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
  for (var j = 0; j < N; j++){
    var p0 = p[(j - 1 + N) % N], p1 = p[j], p2 = p[(j + 1) % N], p3 = p[(j + 2) % N];
    d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
         (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' +
         p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
  }
  return d + 'Z';
}

/* Split a long label into two lines near the middle. */
export function wrapLabel(s){
  if (s.length <= 16) return [s];
  var words = s.split(' '), a = '', b = '';
  var half = s.length / 2;
  words.forEach(function(w){ if ((a + ' ' + w).trim().length <= half + 4 && !b) a = (a + ' ' + w).trim(); else b = (b + ' ' + w).trim(); });
  return b ? [a, b] : [a];
}

/* Control point of a curved link between two points, bowing sideways by w. */
export function curveCtrl(ax, ay, bx, by, w){
  var mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  return [mx - dy / len * w, my + dx / len * w];
}

/* Curved link between two points, bowing sideways by w. */
export function curvePath(ax, ay, bx, by, w){
  var c = curveCtrl(ax, ay, bx, by, w);
  return 'M' + ax.toFixed(1) + ' ' + ay.toFixed(1) + ' Q' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1);
}

/* The point a fraction u (0 to 1) of the way along that same curve. */
export function curvePoint(ax, ay, bx, by, w, u){
  var c = curveCtrl(ax, ay, bx, by, w), v = 1 - u;
  return [v * v * ax + 2 * v * u * c[0] + u * u * bx, v * v * ay + 2 * v * u * c[1] + u * u * by];
}

/* A repeatable number from a string, so each level of the map can have its own scatter that never changes. */
export function seedOf(str){
  var h = 2166136261;
  for (var i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 233280;
}

/* Scatter nodes inside a rectangle so it looks loose and hand-placed, with no two overlapping.

   boxes:  one per node, the room it needs around its center:
           { hw: half its width, up: space above the center, down: space below it }
   region: { x0, y0, x1, y1 } where centers may go
   seed:   a number; the same seed always gives the same scatter
   avoid:  optional rectangles { x0, y0, x1, y1 } that nodes must stay clear of

   Each node is first dropped at the best of a few random spots (the one furthest from the nodes already
   placed), which spreads them out without lining them up. Then any that still overlap are nudged apart. */
function scatterOnce(boxes, region, seed, avoid){
  var R = rng(seed), n = boxes.length, pts = [];
  avoid = avoid || [];
  /* how far a node at p would have to move to clear a keep-out rectangle: [sideways, up or down], or null if clear */
  function clash(p, b, a){
    var ox = Math.min(p.x + b.hw, a.x1) - Math.max(p.x - b.hw, a.x0), oy = Math.min(p.y + b.down, a.y1) - Math.max(p.y - b.up, a.y0);
    return ox > 0 && oy > 0 ? [ox, oy] : null;
  }
  function spot(b){
    return { x: region.x0 + b.hw + R() * Math.max(0, region.x1 - region.x0 - 2 * b.hw),
             y: region.y0 + b.up + R() * Math.max(0, region.y1 - region.y0 - b.up - b.down) };
  }
  /* how close a spot is to the nearest node already placed. Sideways distance counts for less,
     since labels make nodes wider than they are tall */
  function nearest(c){
    var d = Infinity;
    for (var q = 0; q < pts.length; q++) d = Math.min(d, Math.hypot((c.x - pts[q].x) * .7, c.y - pts[q].y));
    return d;
  }
  for (var bi = 0; bi < n; bi++){
    var best = null, bestD = -1;
    for (var k = 0; k < 14; k++){
      var c = spot(boxes[bi]), d = nearest(c);
      for (var v = 0; v < avoid.length; v++) if (clash(c, boxes[bi], avoid[v])) d *= .05; /* a spot on a keep-out is a last resort */
      if (d > bestD){ bestD = d; best = c; }
    }
    pts.push(best);
  }
  function keepIn(p, b){
    p.x = clamp(p.x, region.x0 + b.hw, Math.max(region.x0 + b.hw, region.x1 - b.hw));
    p.y = clamp(p.y, region.y0 + b.up, Math.max(region.y0 + b.up, region.y1 - b.down));
  }
  for (var pass = 0; pass < 300; pass++){
    var moved = false;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++){
      var a = pts[i], b = pts[j], A = boxes[i], B = boxes[j];
      var ox = A.hw + B.hw - Math.abs(a.x - b.x);
      var oy = Math.min(a.y + A.down, b.y + B.down) - Math.max(a.y - A.up, b.y - B.up);
      if (ox > 0 && oy > 0){
        moved = true;
        /* slide apart along whichever direction needs the smaller move */
        if (ox < oy){ var sx = (a.x < b.x ? -1 : 1) * (ox / 2 + .5); a.x += sx; b.x -= sx; }
        else { var sy = (a.y + (A.down - A.up) / 2 < b.y + (B.down - B.up) / 2 ? -1 : 1) * (oy / 2 + .5); a.y += sy; b.y -= sy; }
      }
    }
    for (var m = 0; m < n; m++){
      for (var w = 0; w < avoid.length; w++){
        var hit = clash(pts[m], boxes[m], avoid[w]);
        if (!hit) continue;
        moved = true;
        var mid = (avoid[w].x0 + avoid[w].x1) / 2, midY = (avoid[w].y0 + avoid[w].y1) / 2;
        if (hit[0] < hit[1]) pts[m].x += (pts[m].x < mid ? -1 : 1) * (hit[0] + .5);
        else pts[m].y += (pts[m].y + (boxes[m].down - boxes[m].up) / 2 < midY ? -1 : 1) * (hit[1] + .5);
      }
      keepIn(pts[m], boxes[m]);
    }
    if (!moved) break;
  }
  /* how badly this arrangement still collides: 0 means nothing touches */
  var cost = 0;
  for (var ci = 0; ci < n; ci++){
    for (var cj = ci + 1; cj < n; cj++){
      var cx = boxes[ci].hw + boxes[cj].hw - Math.abs(pts[ci].x - pts[cj].x);
      var cy = Math.min(pts[ci].y + boxes[ci].down, pts[cj].y + boxes[cj].down) - Math.max(pts[ci].y - boxes[ci].up, pts[cj].y - boxes[cj].up);
      if (cx > 1 && cy > 1) cost += cx * cy;
    }
    for (var cv = 0; cv < avoid.length; cv++){ var ch = clash(pts[ci], boxes[ci], avoid[cv]); if (ch && ch[0] > 1 && ch[1] > 1) cost += ch[0] * ch[1]; }
  }
  return { pts:pts, cost:cost };
}

/* The scatter the map uses. A crowded level on a small screen can leave the first arrangement with two
   nodes touching, so this tries a handful of arrangements and keeps the first clean one (or the cleanest).
   The same seed always leads to the same result. */
export function scatter(boxes, region, seed, avoid){
  var best = null;
  for (var attempt = 0; attempt < 24; attempt++){
    var r = scatterOnce(boxes, region, (seed + attempt * 7919) % 233280, avoid);
    if (!best || r.cost < best.cost) best = r;
    if (best.cost === 0) break;
  }
  /* `clean` says whether everything ended up apart; a caller with room to give can try again with smaller boxes */
  best.pts.clean = best.cost === 0;
  return best.pts;
}

/* Which nodes to join with a line, as pairs of indexes. Each node is tied to its nearest neighbor in a
   branching web (never a ring), and with five or more nodes one extra short link closes a single loop. */
export function webLinks(pts){
  var n = pts.length, pairs = [];
  if (n < 2) return pairs;
  function d(i, j){ return Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); }
  function joined(i, j){
    for (var q = 0; q < pairs.length; q++) if ((pairs[q][0] === i && pairs[q][1] === j) || (pairs[q][0] === j && pairs[q][1] === i)) return true;
    return false;
  }
  var inTree = [0];
  while (inTree.length < n){
    var best = null, bestD = Infinity;
    for (var t = 0; t < inTree.length; t++){
      for (var j = 0; j < n; j++){
        if (inTree.indexOf(j) < 0 && d(inTree[t], j) < bestD){ bestD = d(inTree[t], j); best = [inTree[t], j]; }
      }
    }
    pairs.push(best); inTree.push(best[1]);
  }
  if (n >= 5){
    var extra = null, extraD = Infinity;
    for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++){
      if (!joined(a, b) && d(a, b) < extraD){ extraD = d(a, b); extra = [a, b]; }
    }
    if (extra) pairs.push(extra);
  }
  return pairs;
}
