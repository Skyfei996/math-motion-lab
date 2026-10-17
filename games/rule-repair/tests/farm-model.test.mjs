import assert from "node:assert/strict";
import {
  FARM_CONSTANTS,
  analyzeFarm,
  compareLegs,
  groupExtraLegs,
  legsForTrial
} from "../src/farm-model.js";

const defaultProblem = analyzeFarm(8, 22);
assert.equal(defaultProblem.valid, true);
assert.equal(defaultProblem.baselineLegs, 16);
assert.equal(defaultProblem.extraLegs, 6);
assert.equal(defaultProblem.pairCount, 3);
assert.equal(defaultProblem.chickens, 5);
assert.equal(defaultProblem.rabbits, 3);
assert.equal(defaultProblem.checkedHeads, 8);
assert.equal(defaultProblem.checkedLegs, 22);

const transferProblem = analyzeFarm(10, 28);
assert.equal(transferProblem.valid, true);
assert.equal(transferProblem.chickens, 6);
assert.equal(transferProblem.rabbits, 4);

assert.equal(analyzeFarm(0, 0).reason, "invalid-heads");
assert.equal(analyzeFarm(8, 14).reason, "too-few-legs");
assert.equal(analyzeFarm(8, 34).reason, "too-many-legs");
assert.equal(analyzeFarm(8, 21).reason, "unpairable-extra-legs");

assert.equal(legsForTrial(8, 0), 16);
assert.equal(legsForTrial(8, 3), 22);
assert.equal(legsForTrial(8, 8), 32);
assert.equal(legsForTrial(8, 9), null);

assert.deepEqual(compareLegs(16, 22), { difference: 6, relation: "missing", amount: 6 });
assert.deepEqual(compareLegs(22, 22), { difference: 0, relation: "match", amount: 0 });
assert.deepEqual(compareLegs(24, 22), { difference: -2, relation: "extra", amount: 2 });

assert.deepEqual(groupExtraLegs(6), { valid: true, groups: 3, remainder: 0 });
assert.deepEqual(groupExtraLegs(7), { valid: false, groups: 3, remainder: 1 });

assert.deepEqual(FARM_CONSTANTS, {
  chickenLegs: 2,
  rabbitLegs: 4,
  extraLegsPerRabbit: 2
});

console.log("farm model tests passed");

