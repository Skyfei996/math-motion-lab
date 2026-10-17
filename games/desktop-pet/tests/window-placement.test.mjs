import assert from "node:assert/strict";
import {
  resolveTaskWindowPlacement,
  resolveWindowPlacement
} from "../src/window-placement.js";

const windowSize = { width: 112, height: 128 };
const displays = [
  {
    id: "primary",
    primary: true,
    workArea: { x: 0, y: 0, width: 1920, height: 1040 }
  },
  {
    id: "left",
    workArea: { x: -1280, y: -120, width: 1280, height: 1024 }
  }
];

const primaryDefault = resolveWindowPlacement({ displays, windowSize });
assert.deepEqual(primaryDefault, {
  displayId: "primary",
  x: 1784,
  y: 888,
  width: 112,
  height: 128
});

const negativeDisplay = resolveWindowPlacement({
  displays,
  windowSize,
  savedPlacement: { displayId: "left", x: -1240, y: -80 }
});
assert.equal(negativeDisplay.displayId, "left");
assert.equal(negativeDisplay.x, -1240);
assert.equal(negativeDisplay.y, -80);

const missingDisplay = resolveWindowPlacement({
  displays,
  windowSize,
  savedPlacement: { displayId: "removed", x: 640, y: 420 }
});
assert.equal(missingDisplay.displayId, "primary");
assert.equal(missingDisplay.x, 640);
assert.equal(missingDisplay.y, 420);

const staleDisplayId = resolveWindowPlacement({
  displays,
  windowSize,
  savedPlacement: { displayId: "left", x: 640, y: 420 }
});
assert.equal(staleDisplayId.displayId, "primary");
assert.equal(staleDisplayId.x, 640);
assert.equal(staleDisplayId.y, 420);

const clamped = resolveWindowPlacement({
  displays,
  windowSize,
  savedPlacement: { displayId: "left", x: -3000, y: 2000 }
});
assert.equal(clamped.displayId, "left");
assert.equal(clamped.x, -1272);
assert.equal(clamped.y, 768);

const taskRightOfPet = resolveTaskWindowPlacement({
  displays,
  petBounds: { x: 120, y: 760, width: 112, height: 128 },
  windowSize: { width: 560, height: 420 }
});
assert.deepEqual(taskRightOfPet, {
  displayId: "primary",
  x: 244,
  y: 612,
  width: 560,
  height: 420
});

const taskLeftOfPet = resolveTaskWindowPlacement({
  displays,
  petBounds: { x: 1784, y: 888, width: 112, height: 128 },
  windowSize: { width: 560, height: 420 }
});
assert.equal(taskLeftOfPet.displayId, "primary");
assert.equal(taskLeftOfPet.x, 1212);
assert.equal(taskLeftOfPet.y, 612);

const taskOnNegativeDisplay = resolveTaskWindowPlacement({
  displays,
  petBounds: { x: -1200, y: 40, width: 112, height: 128 },
  windowSize: { width: 560, height: 420 }
});
assert.equal(taskOnNegativeDisplay.displayId, "left");
assert.equal(taskOnNegativeDisplay.x, -1076);
assert.equal(taskOnNegativeDisplay.y, -106);

console.log("window placement tests passed");
