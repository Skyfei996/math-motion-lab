import assert from "node:assert/strict";
import {
  SHARE_CONSTANTS,
  analyzeAssignments,
  countAssignments,
  createAssignments,
  moveFruit
} from "../src/share-model.js";

assert.deepEqual(SHARE_CONSTANTS, {
  fruitCount: 12,
  plateCount: 3,
  targetPerPlate: 4,
  initialCounts: [5, 4, 3]
});

const initial = createAssignments();
assert.equal(initial.length, 12);
assert.deepEqual(countAssignments(initial), [5, 4, 3]);
assert.deepEqual(analyzeAssignments(initial), {
  valid: true,
  balanced: false,
  counts: [5, 4, 3],
  total: 12,
  targetPerPlate: 4
});

const moved = moveFruit(initial, 4, 2);
assert.notEqual(moved, initial);
assert.deepEqual(countAssignments(moved), [4, 4, 4]);
assert.equal(analyzeAssignments(moved).balanced, true);
assert.deepEqual(countAssignments(initial), [5, 4, 3]);

assert.equal(moveFruit(initial, -1, 2), null);
assert.equal(moveFruit(initial, 12, 2), null);
assert.equal(moveFruit(initial, 4, -1), null);
assert.equal(moveFruit(initial, 4, 3), null);
assert.equal(moveFruit(initial, 0, 0), null);

assert.equal(analyzeAssignments([0, 0]).valid, false);
assert.equal(analyzeAssignments(Array(12).fill(4)).valid, false);
assert.equal(analyzeAssignments([...initial.slice(0, 11), 1.5]).valid, false);

console.log("share model tests passed");
