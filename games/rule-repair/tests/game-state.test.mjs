import assert from "node:assert/strict";
import {
  RULE_ORDER,
  addRuleStep,
  changePhase,
  chooseEvidence,
  completedPairs,
  createGameState,
  currentLegComparison,
  currentTrialLegs,
  placeLooseLeg,
  repairAnimal,
  resetToChickenBaseline,
  selectPair,
  toggleAnimal,
  toggleTransferCheck,
  transferComplete
} from "../src/game-state.js";

const state = createGameState();
assert.equal(state.phase, "arrival");
assert.equal(currentTrialLegs(state), 16);

changePhase(state, "explore");
toggleAnimal(state, 0);
toggleAnimal(state, 1);
toggleAnimal(state, 2);
assert.equal(currentTrialLegs(state), 22);
assert.equal(currentLegComparison(state).relation, "match");

resetToChickenBaseline(state);
changePhase(state, "pair");
for (let index = 0; index < 6; index += 1) {
  assert.equal(placeLooseLeg(state), true);
}
assert.deepEqual(state.pairTrayCounts, [2, 2, 2]);
assert.equal(completedPairs(state), 3);
assert.equal(placeLooseLeg(state), false);

changePhase(state, "repair");
for (let index = 0; index < 3; index += 1) {
  assert.equal(selectPair(state, index), true);
  assert.equal(repairAnimal(state, index), true);
}
assert.equal(currentTrialLegs(state), 22);
assert.equal(state.repairedAnimals.length, 3);

changePhase(state, "misconception");
assert.equal(chooseEvidence(state, "six-legs"), false);
assert.equal(chooseEvidence(state, "three-pairs"), true);

changePhase(state, "teach");
assert.equal(addRuleStep(state, "difference"), false);
RULE_ORDER.forEach((step) => assert.equal(addRuleStep(state, step), true));

changePhase(state, "transfer");
state.transferRun = true;
toggleTransferCheck(state, "heads");
assert.equal(transferComplete(state), false);
toggleTransferCheck(state, "legs");
assert.equal(transferComplete(state), true);

console.log("game state tests passed");
