import { analyzeFarm, compareLegs, legsForTrial } from "./farm-model.js";

export const PHASES = Object.freeze([
  "arrival",
  "explore",
  "baseline",
  "pair",
  "repair",
  "misconception",
  "teach",
  "transfer",
  "restored"
]);

export const RULE_ORDER = Object.freeze(["baseline", "difference", "pair", "repair"]);

export function createGameState() {
  const problem = analyzeFarm(8, 22);
  const transfer = analyzeFarm(10, 28);

  return {
    phase: "arrival",
    problem,
    transfer,
    rabbitFlags: Array(problem.heads).fill(false),
    attempts: 0,
    baselineApplied: false,
    pairTrayCounts: Array(problem.pairCount).fill(0),
    usedPairIndexes: [],
    repairedAnimals: [],
    selectedPair: null,
    evidenceAttempts: 0,
    evidenceSolved: false,
    ruleTrack: [],
    transferRun: false,
    transferChecks: { heads: false, legs: false },
    notice: ""
  };
}

export function currentRabbitCount(state) {
  return state.rabbitFlags.filter(Boolean).length;
}

export function currentTrialLegs(state) {
  return legsForTrial(state.problem.heads, currentRabbitCount(state));
}

export function currentLegComparison(state) {
  return compareLegs(currentTrialLegs(state), state.problem.legs);
}

export function changePhase(state, phase) {
  if (!PHASES.includes(phase)) throw new Error(`Unknown phase: ${phase}`);
  state.phase = phase;
  state.notice = "";
  return state;
}

export function toggleAnimal(state, index) {
  if (state.phase !== "explore") return state;
  if (index < 0 || index >= state.rabbitFlags.length) return state;

  state.rabbitFlags[index] = !state.rabbitFlags[index];
  state.attempts += 1;
  return state;
}

export function resetToChickenBaseline(state) {
  state.rabbitFlags.fill(false);
  state.baselineApplied = true;
  state.pairTrayCounts.fill(0);
  state.usedPairIndexes = [];
  state.repairedAnimals = [];
  state.selectedPair = null;
  return state;
}

export function placeLooseLeg(state, trayIndex = null) {
  if (state.phase !== "pair") return false;
  if (state.pairTrayCounts.reduce((total, count) => total + count, 0) >= state.problem.extraLegs) return false;

  const targetIndex = trayIndex === null
    ? state.pairTrayCounts.findIndex((count) => count < 2)
    : trayIndex;

  if (targetIndex < 0 || targetIndex >= state.pairTrayCounts.length) return false;
  if (state.pairTrayCounts[targetIndex] >= 2) return false;

  state.pairTrayCounts[targetIndex] += 1;
  return true;
}

export function completedPairs(state) {
  return state.pairTrayCounts.filter((count) => count === 2).length;
}

export function selectPair(state, pairIndex) {
  if (state.phase !== "repair") return false;
  if (pairIndex < 0 || pairIndex >= state.problem.pairCount) return false;
  if (state.usedPairIndexes.includes(pairIndex)) return false;
  state.selectedPair = pairIndex;
  return true;
}

export function repairAnimal(state, animalIndex) {
  if (state.phase !== "repair" || state.selectedPair === null) return false;
  if (animalIndex < 0 || animalIndex >= state.problem.heads) return false;
  if (state.rabbitFlags[animalIndex]) return false;

  state.rabbitFlags[animalIndex] = true;
  state.usedPairIndexes.push(state.selectedPair);
  state.repairedAnimals.push(animalIndex);
  state.selectedPair = null;
  return true;
}

export function chooseEvidence(state, evidenceId) {
  if (state.phase !== "misconception") return false;
  state.evidenceAttempts += 1;
  state.evidenceSolved = evidenceId === "three-pairs";
  state.notice = state.evidenceSolved
    ? "这就是反例：6 条腿要先分成 3 组，每组才对应 1 只兔。"
    : "这张纸片只告诉我们结果的一部分，还不能解释为什么是 3 只兔。";
  return state.evidenceSolved;
}

export function addRuleStep(state, ruleId) {
  if (state.phase !== "teach") return false;
  const expected = RULE_ORDER[state.ruleTrack.length];

  if (ruleId !== expected) {
    state.notice = "这一步还接不上。看看世界里最先发生了什么。";
    return false;
  }

  state.ruleTrack.push(ruleId);
  state.notice = "";
  return true;
}

export function toggleTransferCheck(state, check) {
  if (state.phase !== "transfer" || !state.transferRun) return false;
  if (!(check in state.transferChecks)) return false;
  state.transferChecks[check] = !state.transferChecks[check];
  return true;
}

export function transferComplete(state) {
  return state.transferChecks.heads && state.transferChecks.legs;
}
