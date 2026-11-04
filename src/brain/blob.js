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

/* Curved link between two points, bowing sideways by w. */
export function curvePath(ax, ay, bx, by, w){
  var mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  return 'M' + ax.toFixed(1) + ' ' + ay.toFixed(1) + ' Q' + (mx - dy / len * w).toFixed(1) + ' ' + (my + dx / len * w).toFixed(1) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1);
}
