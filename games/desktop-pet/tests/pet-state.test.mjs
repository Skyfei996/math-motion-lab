import assert from "node:assert/strict";
import {
  PRODUCT_STATES,
  SHARE_CHECKPOINTS,
  SHARE_PHASES,
  commitPicnicFeeding,
  createPetState,
  moveShareFruit,
  openQuickInteraction,
  prepareSharePlatter,
  requestShareHelp,
  returnToDesktop,
  restoreShareState,
  showShareWrongAttempt,
  startShareTask
} from "../src/pet-state.js";

const state = createPetState();
assert.equal(state.productState, PRODUCT_STATES.DESKTOP_ACTIVE);
assert.equal(state.sharePhase, SHARE_PHASES.DESKTOP);
assert.equal(state.shareCheckpoint, null);

assert.equal(openQuickInteraction(state), true);
assert.equal(state.productState, PRODUCT_STATES.QUICK_INTERACTION);

assert.equal(startShareTask(state), true);
assert.equal(state.productState, PRODUCT_STATES.LEARNING_ADVENTURE);
assert.equal(state.sharePhase, SHARE_PHASES.INTRO);
assert.equal(state.shareCheckpoint, SHARE_CHECKPOINTS.INTRO);

assert.equal(showShareWrongAttempt(state), true);
assert.equal(state.sharePhase, SHARE_PHASES.WRONG_ATTEMPT);

assert.equal(requestShareHelp(state), true);
assert.equal(state.sharePhase, SHARE_PHASES.INTERACTIVE);
assert.equal(state.shareCheckpoint, SHARE_CHECKPOINTS.HELP_READY);

assert.equal(moveShareFruit(state, 4, 2), true);
assert.equal(state.sharePhase, SHARE_PHASES.BALANCED);
assert.equal(state.shareCheckpoint, SHARE_CHECKPOINTS.BALANCED);
assert.equal(state.balancedCommitCount, 1);

assert.equal(moveShareFruit(state, 4, 1), false);
assert.equal(state.balancedCommitCount, 1);

assert.equal(prepareSharePlatter(state), true);
assert.equal(state.sharePhase, SHARE_PHASES.PLATTER_READY);
assert.equal(state.shareCheckpoint, SHARE_CHECKPOINTS.PLATTER_READY);
assert.equal(state.platterPrepareCount, 1);
assert.equal(prepareSharePlatter(state), false);
assert.equal(state.platterPrepareCount, 1);

assert.equal(commitPicnicFeeding(state), true);
assert.equal(state.sharePhase, SHARE_PHASES.COMMITTED);
assert.equal(state.shareCheckpoint, SHARE_CHECKPOINTS.COMMITTED);
assert.equal(state.feedingCommitCount, 1);
assert.equal(state.memoryCommitCount, 1);
assert.equal(state.rewards.picnicHat, true);
assert.deepEqual(state.diaryEntries, ["picnic-sharing"]);
assert.equal(commitPicnicFeeding(state), false);
assert.equal(state.feedingCommitCount, 1);
assert.equal(state.memoryCommitCount, 1);
returnToDesktop(state);
assert.equal(state.productState, PRODUCT_STATES.DESKTOP_ACTIVE);
assert.equal(openQuickInteraction(state), true);
assert.equal(startShareTask(state), true);
assert.equal(state.sharePhase, SHARE_PHASES.COMMITTED);
assert.equal(state.shareCheckpoint, SHARE_CHECKPOINTS.COMMITTED);

const helpRestore = restoreShareState(SHARE_CHECKPOINTS.HELP_READY);
assert.equal(helpRestore.sharePhase, SHARE_PHASES.INTERACTIVE);
assert.deepEqual(helpRestore.assignments.filter((plate) => plate === 0).length, 5);

const balancedRestore = restoreShareState(SHARE_CHECKPOINTS.BALANCED);
assert.equal(balancedRestore.sharePhase, SHARE_PHASES.BALANCED);
assert.deepEqual(balancedRestore.assignments.reduce((counts, plate) => {
  counts[plate] += 1;
  return counts;
}, [0, 0, 0]), [4, 4, 4]);
assert.equal(balancedRestore.balancedCommitCount, 1);

const platterRestore = restoreShareState(SHARE_CHECKPOINTS.PLATTER_READY);
assert.equal(platterRestore.sharePhase, SHARE_PHASES.PLATTER_READY);
assert.equal(platterRestore.platterPrepareCount, 1);
assert.equal(platterRestore.feedingCommitCount, 0);
assert.deepEqual(platterRestore.assignments.reduce((counts, plate) => {
  counts[plate] += 1;
  return counts;
}, [0, 0, 0]), [4, 4, 4]);

const committedRestore = restoreShareState(SHARE_CHECKPOINTS.COMMITTED);
assert.equal(committedRestore.sharePhase, SHARE_PHASES.COMMITTED);
assert.equal(committedRestore.platterPrepareCount, 1);
assert.equal(committedRestore.feedingCommitCount, 1);
assert.equal(committedRestore.memoryCommitCount, 1);
assert.equal(committedRestore.rewards.picnicHat, true);
assert.deepEqual(committedRestore.diaryEntries, ["picnic-sharing"]);

console.log("pet state tests passed");
