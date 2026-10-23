const assert = require("node:assert/strict");
const model = require("../lessons/周长不变形状变/canvas-models.js");
const close = (actual, expected, message) => assert(Math.abs(actual - expected) < 1e-7, message || `${actual} != ${expected}`);
const rectangle = [{ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 100 }, { x: 0, y: 100 }];
close(model.semicirclePerimeter(3), 3 * Math.PI + 6);
for (const [angle, perimeter] of [[90, 1.5 * Math.PI + 6], [180, 3 * Math.PI + 6],
  [270, 4.5 * Math.PI + 6], [360, 6 * Math.PI], [22.5, .375 * Math.PI + 6]]) {
  close(model.sectorPerimeter(3, angle), perimeter);
}
close(model.polygonArea(rectangle), 20000);
close(model.polygonPerimeter(rectangle), 600);
for (const [start, end] of [
  [{ x: 100, y: -10 }, { x: 100, y: 110 }],
  [{ x: -20, y: 50 }, { x: 220, y: 50 }],
  [{ x: 0, y: 0 }, { x: 200, y: 100 }],
  [{ x: -20, y: 90 }, { x: 220, y: 10 }],
  [{ x: 200, y: 100 }, { x: 0, y: 0 }]
]) {
  const halves = model.splitConvexPolygon(rectangle, start, end);
  assert.equal(halves.length, 2);
  close(halves.reduce((sum, half) => sum + model.polygonArea(half), 0), 20000);
  halves.forEach((half) => half.forEach((point) => {
    assert(point.x >= -1e-7 && point.x <= 200 + 1e-7 && point.y >= -1e-7 && point.y <= 100 + 1e-7);
  }));
}
for (const [start, end] of [
  [{ x: 0, y: 0 }, { x: 200, y: 0 }],
  [{ x: 0, y: 0 }, { x: -20, y: 30 }],
  [{ x: 201, y: 0 }, { x: 201, y: 100 }],
  [{ x: 20, y: 20 }, { x: 20, y: 20 }]
]) assert.equal(model.splitConvexPolygon(rectangle, start, end), null);

const original = { kind: "image", src: "pixels", width: 200, height: 100, points: rectangle, x: 513, y: -70, angle: 137 };
const start = model.toWorld({ x: 100, y: -10 }, original), end = model.toWorld({ x: 100, y: 110 }, original);
const halves = model.splitImage(original, start, end);
close(halves.reduce((sum, half) => sum + model.polygonArea(half.points), 0), 20000);
halves.forEach((half) => {
  assert.equal(half.src, original.src);
  assert.equal(half.angle, original.angle);
  assert.equal(half.x, original.x);
  assert.equal(half.y, original.y);
  half.points.forEach((point) => {
    const back = model.toLocal(model.toWorld(point, half), half);
    close(back.x, point.x); close(back.y, point.y);
  });
});
assert.deepEqual(original.points, rectangle);
let pieces = [original];
for (let i = 1; i < 20; i += 1) {
  const a = model.toWorld({ x: i * 10, y: -20 }, original);
  const b = model.toWorld({ x: i * 10, y: 120 }, original);
  pieces = pieces.flatMap((piece) => model.splitImage(piece, a, b) || [piece]);
}
assert.equal(pieces.length, 20);
close(pieces.reduce((sum, piece) => sum + model.polygonArea(piece.points), 0), 20000);
const curve = { kind: "semicircle", cx: 30, cy: 40, rx: 96, ry: 96, angle: 0 };
let points = model.curvePoints(curve);
close(Math.min(...points.map((p) => p.y)), -56);
close(Math.max(...points.map((p) => p.y)), 40);
curve.angle = 90; points = model.curvePoints(curve);
close(Math.min(...points.map((p) => p.x)), 30);
close(Math.max(...points.map((p) => p.x)), 126);
// Compare exact sector bounds with densely sampled arcs under independent rotations.
for (const sweepAngle of [.0001, 22.5, 90, 180, 270, 359.9, 360]) {
  for (const angle of [-135, 0, 37, 90, 190, 360]) {
    const sector = { kind: "sector", cx: 30, cy: 40, rx: 13, ry: 13, sweepAngle, angle };
    const exact = model.curvePoints(sector);
    const sampled = sweepAngle < 360 ? [{ x: 30, y: 40 }] : [];
    for (let step = 0; step <= 10000; step += 1) {
      const theta = (180 + angle + sweepAngle * step / 10000) * Math.PI / 180;
      sampled.push({ x: 30 + 13 * Math.cos(theta), y: 40 + 13 * Math.sin(theta) });
    }
    for (const axis of ["x", "y"]) {
      for (const extreme of [Math.min, Math.max]) {
        const bound = extreme(...exact.map((point) => point[axis]));
        const reference = extreme(...sampled.map((point) => point[axis]));
        assert(Math.abs(bound - reference) < 1e-5, `bounds: ${sweepAngle}°, rotation ${angle}°, ${axis}`);
      }
    }
  }
}
const legacy = { kind: "semicircle", cx: 30, cy: 40, rx: 96, ry: 96, angle: 37 };
assert.deepEqual(model.curvePoints(legacy), model.curvePoints({ ...legacy, kind: "sector", sweepAngle: 180 }));
// Full ellipse bounds must retain their exact extrema after the sector extension.
const ellipse = { kind: "ellipse", cx: 30, cy: 40, rx: 96, ry: 64, angle: 37 };
const ellipsePoints = model.curvePoints(ellipse), theta = 37 * Math.PI / 180;
const halfWidth = Math.hypot(96 * Math.cos(theta), 64 * Math.sin(theta));
const halfHeight = Math.hypot(96 * Math.sin(theta), 64 * Math.cos(theta));
close(Math.min(...ellipsePoints.map((p) => p.x)), 30 - halfWidth);
close(Math.max(...ellipsePoints.map((p) => p.x)), 30 + halfWidth);
close(Math.min(...ellipsePoints.map((p) => p.y)), 40 - halfHeight);
close(Math.max(...ellipsePoints.map((p) => p.y)), 40 + halfHeight);
const bounds = model.objectPoints({ kind: "text", x: 20, y: 30, angle: 90, width: 80, height: 40 });
close(Math.min(...bounds.map((p) => p.x)), -20);
close(Math.max(...bounds.map((p) => p.y)), 110);
// Layer order is back-to-front; multi-selection moves together without reversal.
const layers = [1, 2, 3, 4, 5].map((id) => ({ id }));
const layerIds = (items) => items.map((item) => item.id);
for (const [selected, direction, expected] of [
  [[2], "forward", [1, 3, 2, 4, 5]],
  [[3], "backward", [1, 3, 2, 4, 5]],
  [[2], "front", [1, 3, 4, 5, 2]],
  [[3], "back", [3, 1, 2, 4, 5]],
  [[2, 3], "forward", [1, 4, 2, 3, 5]],
  [[2, 3], "backward", [2, 3, 1, 4, 5]],
  [[2, 4], "forward", [1, 3, 2, 5, 4]],
  [[2, 4], "backward", [2, 1, 4, 3, 5]],
  [[2, 4], "front", [1, 3, 5, 2, 4]],
  [[2, 4], "back", [2, 4, 1, 3, 5]],
  [[4, 5], "forward", [1, 2, 3, 4, 5]],
  [[1, 2], "backward", [1, 2, 3, 4, 5]],
  [[], "front", [1, 2, 3, 4, 5]],
  [[1, 2, 3, 4, 5], "back", [1, 2, 3, 4, 5]]
]) {
  assert.deepEqual(layerIds(model.moveLayers(layers, new Set(selected.map(String)), direction)), expected);
  assert.deepEqual(layerIds(layers), [1, 2, 3, 4, 5], "reordering must not mutate its input");
}
console.log("canvas model tests passed");
