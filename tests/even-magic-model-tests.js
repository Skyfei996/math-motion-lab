const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("assets/lab-models.js", "utf8"), sandbox);
const { patterns } = sandbox.window.MathLabModels;

[4, 8, 12, 16].forEach((order) => {
  ["inside", "outside"].forEach((variant) => {
    const square = patterns.magicSquareDoublyEvenState(order, variant);
    assert.strictEqual(square.valid, true);
    assert.strictEqual(square.verified, true);
    assert.strictEqual(square.magicSum, (order * (order * order + 1)) / 2);
    assert.deepStrictEqual([...square.cells.flat()].sort((a, b) => a - b), Array.from({ length: order * order }, (_, index) => index + 1));
  });
});

[6, 10, 14, 18].forEach((order) => {
  const square = patterns.magicSquareSinglyEvenState(order);
  assert.strictEqual(square.valid, true);
  assert.strictEqual(square.verified, true);
  assert.strictEqual(square.magicSum, (order * (order * order + 1)) / 2);
  assert.deepStrictEqual([...square.cells.flat()].sort((a, b) => a - b), Array.from({ length: order * order }, (_, index) => index + 1));
});

assert.strictEqual(patterns.magicSquareDoublyEvenState(6).valid, false);
assert.strictEqual(patterns.magicSquareSinglyEvenState(4).valid, false);
console.log("Even magic-square model checks passed.");
