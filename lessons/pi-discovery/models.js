(function (root) {
  "use strict";
  const PI = Math.PI;
  function polygonBounds(edges) {
    if (!Number.isInteger(edges) || edges < 6 || edges > 768 || !Number.isInteger(Math.log2(edges / 6))) throw new RangeError("Use 6 × a power of two, up to 768.");
    let sine = 0.5;
    let cosine = Math.sqrt(3) / 2;
    for (let count = 6; count < edges; count *= 2) {
      sine = sine / Math.sqrt(2 + 2 * cosine);
      cosine = Math.sqrt(1 - sine * sine);
    }
    return { lower: edges * sine, upper: edges * sine / cosine };
  }
  function wallis(terms) {
    if (!Number.isInteger(terms) || terms < 0 || terms > 10000) throw new RangeError("Invalid term count.");
    let value = 2;
    for (let k = 1; k <= terms; k++) value *= (4 * k * k) / (4 * k * k - 1);
    return value;
  }
  function machinStep(k) {
    if (!Number.isInteger(k) || k < 1 || k > 9) throw new RangeError("Use rounds 1–9.");
    const power = 2 * k - 1;
    return ((k % 2 ? 1 : -1) / power) * (16 / (5 ** power) - 4 / (239 ** power));
  }
  function machin(terms) {
    if (!Number.isInteger(terms) || terms < 0 || terms > 9) throw new RangeError("Invalid term count.");
    let value = 0;
    for (let k = 1; k <= terms; k++) value += machinStep(k);
    return value;
  }
  function circumference(diameter, approximation, tolerance) {
    if (![diameter, approximation, tolerance].every(Number.isFinite) || diameter <= 0 || approximation <= 0 || tolerance < 0) throw new RangeError("Invalid measurement.");
    const actual = diameter * PI;
    const estimated = diameter * approximation;
    const error = Math.abs(estimated - actual);
    return { actual, estimated, error, fits: error <= tolerance };
  }
  function outwardBounds(edges, digits = 5) {
    const { lower, upper } = polygonBounds(edges);
    const scale = 10 ** digits;
    return { lower: (Math.floor(lower * scale) / scale).toFixed(digits), upper: (Math.ceil(upper * scale) / scale).toFixed(digits) };
  }
  // Unbend a symmetric arc at constant length. Both ends stay on the bench.
  function ropePoint(radius, progress, fraction) {
    const length = 2 * PI * radius * fraction;
    const curvature = (1 - progress) / radius;
    if (curvature < 1e-8) return { x: length, y: 0 };
    const halfAngle = PI * (1 - progress);
    const angle = halfAngle - length * curvature;
    return { x: (Math.sin(halfAngle) - Math.sin(angle)) / curvature, y: (Math.cos(halfAngle) - Math.cos(angle)) / curvature };
  }
  function ropePath(radius, progress, fraction = 1, x = 260, y = 315) {
    const points = [];
    for (let i = 0; i <= 360; i++) {
      const p = ropePoint(radius, progress, fraction * i / 360);
      points.push(`${i ? 'L' : 'M'}${(x + p.x).toFixed(4)} ${(y + p.y).toFixed(4)}`);
    }
    return points.join(' ');
  }
  function rolling(turns, diameter = 1, approximation = 3.14) {
    const actual = turns * diameter * PI;
    const estimated = turns * diameter * approximation;
    return { actual, estimated, error: actual - estimated, angle: turns * 2 * PI };
  }
  function refiningOuter(previousEdges, edges, radius, progress) {
    const old = Array.from({length:previousEdges},(_,i)=>{
      const a=-PI/2+(2*i+1)*PI/previousEdges,r=radius/Math.cos(PI/previousEdges);
      return {x:r*Math.cos(a),y:r*Math.sin(a)};
    });
    const normals=Array.from({length:edges},(_,i)=>{
      const angle=-PI/2+2*PI*i/edges,x=Math.cos(angle),y=Math.sin(angle);
      const support=Math.max(...old.map(p=>p.x*x+p.y*y));
      return {x,y,d:support+(radius-support)*progress};
    });
    return normals.map((a,i)=>{
      const b=normals[(i+1)%edges],det=a.x*b.y-a.y*b.x;
      return {x:(a.d*b.y-a.y*b.d)/det,y:(a.x*b.d-a.d*b.x)/det};
    });
  }
  const api = { PI, polygonBounds, wallis, machinStep, machin, circumference, outwardBounds, ropePoint, ropePath, rolling, refiningOuter };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PiModels = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
