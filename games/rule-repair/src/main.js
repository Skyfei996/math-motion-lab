import {
  changePhase,
  chooseEvidence,
  createGameState,
  addRuleStep,
  placeLooseLeg,
  repairAnimal,
  resetToChickenBaseline,
  selectPair,
  toggleAnimal,
  toggleTransferCheck
} from "./game-state.js";
import { dialogueFor } from "./dialogue.js";
import { progressFor, promptFor, renderActions, renderScene } from "./farm-scene.js";

const game = document.querySelector("[data-game]");
const stage = game.querySelector("[data-stage]");
const scene = game.querySelector("[data-scene]");
const actions = game.querySelector("[data-actions]");
const companion = game.querySelector("[data-companion]");
const dialogue = game.querySelector("[data-dialogue] p");
const promptKicker = game.querySelector("[data-prompt-kicker]");
const prompt = game.querySelector("[data-prompt]");
const headCount = game.querySelector("[data-head-count]");
const legCount = game.querySelector("[data-leg-count]");
const sensorStatus = game.querySelector("[data-sensor-status]");
const progressLabel = game.querySelector("[data-progress-label]");
const progressFill = game.querySelector("[data-progress-fill]");

let state = createGameState();
let pendingTimer = null;
let dragPayload = null;

function sensorFor(current) {
  const problem = current.phase === "transfer" || current.phase === "restored"
    ? current.transfer
    : current.problem;

  if (current.phase === "arrival") return [problem, "记录互相对不上"];
  if (current.phase === "explore") return [problem, `目标记录：${problem.legs} 条腿`];
  if (current.phase === "baseline") return [problem, current.baselineApplied ? `全鸡基准：${problem.baselineLegs} 条` : "准备统一假设"];
  if (current.phase === "pair") return [problem, `${problem.extraLegs} 条差量正在分组`];
  if (current.phase === "repair") return [problem, `已修正 ${current.repairedAnimals.length} 只兔`];
  if (current.phase === "misconception") return [problem, "数量已对，规则待检查"];
  if (current.phase === "teach") return [problem, `规则轨道：${current.ruleTrack.length}/4`];
  if (current.phase === "transfer") {
    const checks = Number(current.transferChecks.heads) + Number(current.transferChecks.legs);
    return [problem, current.transferRun ? `迁移检查：${checks}/2` : "新记录等待处理"];
  }
  return [problem, "登记恢复 · 规则有效"];
}

function render() {
  const [sensorProblem, status] = sensorFor(state);
  const [kicker, promptText] = promptFor(state);
  const [progressText, progress] = progressFor(state);
  const robot = dialogueFor(state);

  stage.classList.toggle("is-restored", state.phase === "restored");
  stage.dataset.phase = state.phase;
  scene.innerHTML = renderScene(state);
  actions.innerHTML = renderActions(state);
  promptKicker.textContent = kicker;
  prompt.textContent = promptText;
  dialogue.textContent = robot.text;
  companion.classList.remove("is-thinking", "is-wrong", "is-happy");
  companion.classList.add(`is-${robot.mood}`);
  headCount.textContent = sensorProblem.heads;
  legCount.textContent = sensorProblem.legs;
  sensorStatus.textContent = status;
  progressLabel.textContent = progressText;
  progressFill.style.width = `${progress}%`;
}

function restart() {
  if (pendingTimer !== null) {
    window.clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  state = createGameState();
  dragPayload = null;
  render();
}

function runAction(action) {
  if (action === "restart") {
    restart();
    return;
  }

  if (action === "investigate") changePhase(state, "explore");
  if (action === "shortcut") changePhase(state, "baseline");
  if (action === "start-repair") changePhase(state, "repair");
  if (action === "check-result") changePhase(state, "misconception");
  if (action === "teach-robot") changePhase(state, "teach");
  if (action === "open-transfer") changePhase(state, "transfer");
  if (action === "run-transfer") state.transferRun = true;
  if (action === "restore-farm") changePhase(state, "restored");

  if (action === "apply-baseline" && !state.baselineApplied) {
    resetToChickenBaseline(state);
    render();
    pendingTimer = window.setTimeout(() => {
      changePhase(state, "pair");
      pendingTimer = null;
      render();
    }, 850);
    return;
  }

  render();
}

game.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (action && !action.disabled) {
    runAction(action.dataset.action);
    return;
  }

  const animal = event.target.closest("[data-animal-index]");
  if (animal) {
    const index = Number(animal.dataset.animalIndex);
    if (state.phase === "explore") toggleAnimal(state, index);
    if (state.phase === "repair") repairAnimal(state, index);
    render();
    return;
  }

  const legToken = event.target.closest("[data-leg-token]");
  if (legToken) {
    placeLooseLeg(state);
    render();
    return;
  }

  const pair = event.target.closest("[data-repair-pair]");
  if (pair && !pair.disabled) {
    selectPair(state, Number(pair.dataset.repairPair));
    render();
    return;
  }

  const evidence = event.target.closest("[data-evidence]");
  if (evidence) {
    chooseEvidence(state, evidence.dataset.evidence);
    render();
    return;
  }

  const ruleCard = event.target.closest("[data-rule-card]");
  if (ruleCard && !ruleCard.disabled) {
    addRuleStep(state, ruleCard.dataset.ruleCard);
    render();
    return;
  }

  const transferCheck = event.target.closest("[data-transfer-check]");
  if (transferCheck) {
    toggleTransferCheck(state, transferCheck.dataset.transferCheck);
    render();
  }
});

game.addEventListener("dragstart", (event) => {
  const legToken = event.target.closest("[data-leg-token]");
  const pair = event.target.closest("[data-repair-pair]");

  if (legToken) {
    dragPayload = { type: "leg" };
    event.dataTransfer.effectAllowed = "move";
    return;
  }

  if (pair && !pair.disabled) {
    dragPayload = { type: "pair", index: Number(pair.dataset.repairPair) };
    event.dataTransfer.effectAllowed = "move";
  }
});

game.addEventListener("dragend", () => {
  dragPayload = null;
  game.querySelectorAll(".is-over").forEach((element) => element.classList.remove("is-over"));
});

stage.addEventListener("dragover", (event) => {
  if (!dragPayload) return;
  const tray = event.target.closest("[data-pair-tray]");
  const animal = event.target.closest("[data-animal-index]");
  const canDropLeg = dragPayload.type === "leg" && tray;
  const canDropPair = dragPayload.type === "pair" && animal && state.phase === "repair";

  if (canDropLeg || canDropPair) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    (tray || animal).classList.add("is-over");
  }
});

stage.addEventListener("dragleave", (event) => {
  const target = event.target.closest(".is-over");
  if (target && !target.contains(event.relatedTarget)) target.classList.remove("is-over");
});

stage.addEventListener("drop", (event) => {
  if (!dragPayload) return;
  const tray = event.target.closest("[data-pair-tray]");
  const animal = event.target.closest("[data-animal-index]");

  if (dragPayload.type === "leg" && tray) {
    event.preventDefault();
    placeLooseLeg(state, Number(tray.dataset.pairTray));
    dragPayload = null;
    render();
    return;
  }

  if (dragPayload.type === "pair" && animal) {
    event.preventDefault();
    selectPair(state, dragPayload.index);
    repairAnimal(state, Number(animal.dataset.animalIndex));
    dragPayload = null;
    render();
  }
});

render();
