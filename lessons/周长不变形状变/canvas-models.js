(function (root) {
  const radians = (angle) => (angle || 0) * Math.PI / 180;
  function toWorld(point, object) {
    const angle = radians(object.angle), c = Math.cos(angle), s = Math.sin(angle);
    return { x: object.x + point.x * c - point.y * s, y: object.y + point.x * s + point.y * c };
  }
  function toLocal(point, object) {
    const angle = radians(object.angle), c = Math.cos(angle), s = Math.sin(angle);
    const x = point.x - object.x, y = point.y - object.y;
    return { x: x * c + y * s, y: -x * s + y * c };
  }
  function objectPoints(object) {
    const points = object.kind === "image" ? object.points : [
      { x: 0, y: 0 }, { x: object.width, y: 0 },
      { x: object.width, y: object.height }, { x: 0, y: object.height }
    ];
    return points.map((point) => toWorld(point, object));
  }
  function curvePoints(curve) {
    const angle = radians(curve.angle), c = Math.cos(angle), s = Math.sin(angle);
    const tx = Math.atan2(-curve.ry * s, curve.rx * c);
    const ty = Math.atan2(curve.ry * c, curve.rx * s);
    const sweep = curve.kind === "semicircle" ? Math.PI : curve.kind === "sector" ? radians(curve.sweepAngle) : 2 * Math.PI;
    const points = [Math.PI, Math.PI + sweep, tx, tx + Math.PI, ty, ty + Math.PI]
      .filter((t) => (t - Math.PI + 4 * Math.PI) % (2 * Math.PI) <= sweep + 1e-10)
      .map((t) => ({ x: curve.cx + curve.rx * Math.cos(t) * c - curve.ry * Math.sin(t) * s,
        y: curve.cy + curve.rx * Math.cos(t) * s + curve.ry * Math.sin(t) * c }));
    if (sweep < 2 * Math.PI) points.push({ x: curve.cx, y: curve.cy });
    return points;
  }
  function sectorPerimeter(radius, sweepAngle) {
    return sweepAngle / 360 * 2 * Math.PI * radius + (sweepAngle === 360 ? 0 : 2 * radius);
  }
  function polygonArea(points) {
    return Math.abs(points.reduce((sum, p, i) => {
      const q = points[(i + 1) % points.length];
      return sum + p.x * q.y - p.y * q.x;
    }, 0)) / 2;
  }
  function polygonPerimeter(points) {
    return points.reduce((sum, p, i) => {
      const q = points[(i + 1) % points.length];
      return sum + Math.hypot(q.x - p.x, q.y - p.y);
    }, 0);
  }
  // Successive straight cuts of a rectangle always leave convex polygons.
  function splitConvexPolygon(points, start, end) {
    const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy);
    if (!Number.isFinite(length) || length < 1e-8 || points.length < 3) return null;
    const distance = (p) => ((p.x - start.x) * dy - (p.y - start.y) * dx) / length;
    const distances = points.map(distance), epsilon = 1e-7;
    if (!distances.some((d) => d > epsilon) || !distances.some((d) => d < -epsilon)) return null;
    const halves = [[], []];
    points.forEach((p, i) => {
      const q = points[(i + 1) % points.length], a = distances[i], b = distances[(i + 1) % points.length];
      if (a >= -epsilon) halves[0].push({ ...p });
      if (a <= epsilon) halves[1].push({ ...p });
      if ((a > epsilon && b < -epsilon) || (a < -epsilon && b > epsilon)) {
        const t = a / (a - b), intersection = { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
        halves.forEach((half) => half.push({ ...intersection }));
      }
    });
    const cleaned = halves.map((half) => half.filter((p, i) => {
      const q = half[(i + half.length - 1) % half.length];
      return Math.hypot(p.x - q.x, p.y - q.y) > epsilon;
    }));
    return cleaned.every((half) => half.length >= 3 && polygonArea(half) > epsilon) ? cleaned : null;
  }
  function splitImage(object, start, end) {
    const halves = splitConvexPolygon(object.points, toLocal(start, object), toLocal(end, object));
    return halves && halves.map((points) => ({ ...object, points }));
  }
  function moveLayers(layers, selected, direction) {
    const result = layers.slice();
    const chosen = (layer) => selected.has(String(layer.id));
    if (direction === "front") return result.filter((layer) => !chosen(layer)).concat(result.filter(chosen));
    if (direction === "back") return result.filter(chosen).concat(result.filter((layer) => !chosen(layer)));
    if (direction === "forward") {
      for (let i = result.length - 2; i >= 0; i -= 1) {
        if (chosen(result[i]) && !chosen(result[i + 1])) [result[i], result[i + 1]] = [result[i + 1], result[i]];
      }
    } else if (direction === "backward") {
      for (let i = 1; i < result.length; i += 1) {
        if (chosen(result[i]) && !chosen(result[i - 1])) [result[i], result[i - 1]] = [result[i - 1], result[i]];
      }
    }
    return result;
  }
  const api = { toWorld, toLocal, objectPoints, curvePoints, sectorPerimeter, polygonArea, polygonPerimeter, moveLayers,
    splitConvexPolygon, splitImage, semicirclePerimeter: (radius) => (Math.PI + 2) * radius };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.GeometryCanvasModels = api;
})(typeof window === "object" ? window : globalThis);
