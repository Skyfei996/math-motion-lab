import {
  analyzeAssignments,
  createAssignments,
  moveFruit
} from "./share-model.js";

export const PRODUCT_STATES = Object.freeze({
  DESKTOP_ACTIVE: "DESKTOP_ACTIVE",
  QUICK_INTERACTION: "QUICK_INTERACTION",
  LEARNING_ADVENTURE: "LEARNING_ADVENTURE",
  QUIET_COMPANION: "QUIET_COMPANION"
});

export const SHARE_PHASES = Object.freeze({
  DESKTOP: "desktop",
  INTRO: "intro",
  WRONG_ATTEMPT: "wrong-attempt",
  INTERACTIVE: "interactive",
  BALANCED: "balanced",
  PLATTER_READY: "platter-ready",
  COMMITTED: "committed"
});

export const SHARE_CHECKPOINTS = Object.freeze({
  INTRO: "SHARE_INTRO",
  HELP_READY: "SHARE_HELP_READY",
  BALANCED: "SHARE_BALANCED",
  PLATTER_READY: "SHARE_PLATTER_READY",
  COMMITTED: "SHARE_COMMITTED"
});

export function createPetState() {
  return {
    productState: PRODUCT_STATES.DESKTOP_ACTIVE,
    sharePhase: SHARE_PHASES.DESKTOP,
    shareCheckpoint: null,
    assignments: createAssignments(),
    balancedCommitCount: 0,
    platterPrepareCount: 0,
    feedingCommitCount: 0,
    rewards: {
      picnicHat: false
    },
    diaryEntries: [],
    memoryCommitCount: 0
  };
}

export function openQuickInteraction(state) {
  if (
    state.productState !== PRODUCT_STATES.DESKTOP_ACTIVE
    && state.productState !== PRODUCT_STATES.QUIET_COMPANION
  ) return false;

  state.productState = PRODUCT_STATES.QUICK_INTERACTION;
  return true;
}

export function startShareTask(state) {
  if (state.productState !== PRODUCT_STATES.QUICK_INTERACTION) return false;

  state.productState = PRODUCT_STATES.LEARNING_ADVENTURE;
  if (state.shareCheckpoint) return true;

  state.sharePhase = SHARE_PHASES.INTRO;
  state.shareCheckpoint = SHARE_CHECKPOINTS.INTRO;
  state.assignments = createAssignments();
  return true;
}

export function showShareWrongAttempt(state) {
  if (state.sharePhase !== SHARE_PHASES.INTRO) return false;
  state.sharePhase = SHARE_PHASES.WRONG_ATTEMPT;
  state.assignments = createAssignments();
  return true;
}

export function requestShareHelp(state) {
  if (state.sharePhase !== SHARE_PHASES.WRONG_ATTEMPT) return false;
  state.sharePhase = SHARE_PHASES.INTERACTIVE;
  state.shareCheckpoint = SHARE_CHECKPOINTS.HELP_READY;
  return true;
}

export function moveShareFruit(state, fruitIndex, targetPlate) {
  if (state.sharePhase !== SHARE_PHASES.INTERACTIVE) return false;

  const nextAssignments = moveFruit(state.assignments, fruitIndex, targetPlate);
  if (!nextAssignments) return false;

  state.assignments = nextAssignments;
  if (analyzeAssignments(state.assignments).balanced) {
    state.sharePhase = SHARE_PHASES.BALANCED;
    state.shareCheckpoint = SHARE_CHECKPOINTS.BALANCED;
    state.balancedCommitCount += 1;
  }
  return true;
}

export function prepareSharePlatter(state) {
  if (state.sharePhase !== SHARE_PHASES.BALANCED || state.platterPrepareCount > 0) return false;

  state.sharePhase = SHARE_PHASES.PLATTER_READY;
  state.shareCheckpoint = SHARE_CHECKPOINTS.PLATTER_READY;
  state.platterPrepareCount = 1;
  return true;
}

export function commitPicnicFeeding(state) {
  if (state.sharePhase !== SHARE_PHASES.PLATTER_READY || state.feedingCommitCount > 0) return false;

  state.sharePhase = SHARE_PHASES.COMMITTED;
  state.shareCheckpoint = SHARE_CHECKPOINTS.COMMITTED;
  state.feedingCommitCount = 1;
  state.rewards.picnicHat = true;
  state.diaryEntries = ["picnic-sharing"];
  state.memoryCommitCount = 1;
  return true;
}

export function returnToDesktop(state) {
  state.productState = PRODUCT_STATES.DESKTOP_ACTIVE;
  return state;
}

export function restoreShareState(checkpoint) {
  const state = createPetState();
  if (!Object.values(SHARE_CHECKPOINTS).includes(checkpoint)) return state;

  state.productState = PRODUCT_STATES.LEARNING_ADVENTURE;
  state.shareCheckpoint = checkpoint;

  if (checkpoint === SHARE_CHECKPOINTS.INTRO) {
    state.sharePhase = SHARE_PHASES.INTRO;
    return state;
  }

  if (checkpoint === SHARE_CHECKPOINTS.HELP_READY) {
    state.sharePhase = SHARE_PHASES.INTERACTIVE;
    return state;
  }

  state.assignments = createAssignments([4, 4, 4]);
  state.sharePhase = checkpoint === SHARE_CHECKPOINTS.BALANCED
    ? SHARE_PHASES.BALANCED
    : checkpoint === SHARE_CHECKPOINTS.PLATTER_READY
      ? SHARE_PHASES.PLATTER_READY
      : SHARE_PHASES.COMMITTED;
  state.balancedCommitCount = 1;
  if (
    checkpoint === SHARE_CHECKPOINTS.PLATTER_READY
    || checkpoint === SHARE_CHECKPOINTS.COMMITTED
  ) {
    state.platterPrepareCount = 1;
  }
  if (checkpoint === SHARE_CHECKPOINTS.COMMITTED) {
    state.feedingCommitCount = 1;
    state.rewards.picnicHat = true;
    state.diaryEntries = ["picnic-sharing"];
    state.memoryCommitCount = 1;
  }
  return state;
}
