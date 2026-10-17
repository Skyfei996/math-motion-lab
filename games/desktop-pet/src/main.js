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
  restoreShareState,
  returnToDesktop,
  showShareWrongAttempt,
  startShareTask
} from "./pet-state.js";
import { analyzeAssignments } from "./share-model.js";
import { MotionController, mountGege } from "./motion-controller.js";
import { RewardScene } from "./reward-scene.js";
import { ShareScene } from "./share-scene.js";
import { createNativeRuntime } from "./native-runtime.js";
import { createStateStorage } from "./state-storage.js";
import { createCompanionTools } from "./companion-tools.js";

const searchParams = new URLSearchParams(window.location.search);
const surface = searchParams.get("surface") === "task" ? "task" : "simulator";
const debugEnabled = searchParams.get("debug") === "1";
document.body.dataset.surface = surface;
document.body.dataset.debug = String(debugEnabled);

const desktop = document.querySelector("#desktop");
const desktopPet = document.querySelector("#desktop-pet");
const desktopGegeHost = document.querySelector("#desktop-gege-host");
const quickGegeHost = document.querySelector("#quick-gege-host");
const taskGegeHost = document.querySelector("#task-gege-host");
const sizePreviewList = document.querySelector("#size-preview-list");
const sizeInspector = document.querySelector("#size-inspector");
const companionWindow = document.querySelector("#companion-window");
const quickView = document.querySelector("#quick-view");
const utilityView = document.querySelector("#utility-view");
const taskView = document.querySelector("#task-view");
const quickEyebrow = document.querySelector("#quick-eyebrow");
const quickTitle = document.querySelector("#quick-title");
const quickDescription = document.querySelector("#quick-description");
const startShareTaskButton = document.querySelector("#start-share-task");
const shareWorkspace = document.querySelector(".share-workspace");
const formulaBoard = document.querySelector("#formula-board");
const memoryCard = document.querySelector("#memory-card");
const picnicPlatter = document.querySelector("#picnic-platter");
const taskStepLabel = document.querySelector("#task-step-label");
const taskTitle = document.querySelector("#task-title");
const taskDialogue = document.querySelector("#task-dialogue");
const taskHint = document.querySelector("#task-hint");
const taskAction = document.querySelector("#task-action");
const liveRegion = document.querySelector("#live-region");
const sizeSelect = document.querySelector("#pet-size-select");
const reduceMotionToggle = document.querySelector("#reduce-motion-toggle");
const toggleSizeTest = document.querySelector("#toggle-size-test");
const [runtime, storage] = await Promise.all([
  createNativeRuntime(),
  createStateStorage()
]);

const systemPrefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
reduceMotionToggle.checked = systemPrefersReduced;
document.body.classList.toggle("reduced-motion", systemPrefersReduced);

const desktopGege = mountGege(desktopGegeHost, 96);
const quickGege = mountGege(quickGegeHost, 78);
const taskGege = mountGege(taskGegeHost, 82);
const motionControllers = [
  new MotionController(desktopGege, { reducedMotion: systemPrefersReduced }),
  new MotionController(quickGege, { reducedMotion: systemPrefersReduced }),
  new MotionController(taskGege, { reducedMotion: systemPrefersReduced })
];

for (const size of [64, 96, 128]) {
  const preview = document.createElement("div");
  preview.className = "size-preview";
  const host = document.createElement("div");
  host.className = "gege-host";
  mountGege(host, size);
  const label = document.createElement("span");
  label.textContent = `${size} px`;
  preview.append(host, label);
  sizePreviewList.append(preview);
}

let session = await storage.load();
let state = restoreSessionState(session);
let sizeInspectionEnabled = debugEnabled;
let actionHandler = null;
let companionTools = null;

const shareScene = new ShareScene(document.querySelector("#share-stage"), {
  onMove: handleFruitMove,
  onAnnounce: announce
});
const rewardScene = new RewardScene(picnicPlatter, taskGegeHost, {
  onFeed: handlePicnicFeed,
  onAnnounce: announce
});

function restoreSessionState(savedSession) {
  if (!savedSession.checkpoint) return createPetState();
  const restored = restoreShareState(savedSession.checkpoint);
  return savedSession.closed ? returnToDesktop(restored) : restored;
}

async function saveCheckpoint() {
  session = await storage.save({
    ...session,
    checkpoint: state.shareCheckpoint,
    closed: state.productState === PRODUCT_STATES.DESKTOP_ACTIVE
  });
}

function announce(message) {
  liveRegion.textContent = "";
  window.requestAnimationFrame(() => {
    liveRegion.textContent = message;
  });
}

function setCompanionView(view) {
  companionWindow.dataset.view = view;
  quickView.hidden = view !== "quick";
  utilityView.hidden = view !== "utility";
  taskView.hidden = view !== "task";
  sizeInspector.hidden = (
    surface === "task"
    || view !== "closed"
    || !sizeInspectionEnabled
  );
  desktopPet.setAttribute("aria-expanded", String(view !== "closed"));
}

async function writeSession(nextSession) {
  session = await storage.save(nextSession);
  companionTools?.refresh();
  return session;
}

function returnToQuickHub() {
  renderQuickContent();
  setCompanionView("quick");
  window.setTimeout(() => startShareTaskButton.focus(), 0);
}

function setTaskAction(label, handler, { disabled = false } = {}) {
  taskAction.textContent = label;
  taskAction.disabled = disabled;
  actionHandler = handler;
}

function setWorkspaceMode(mode) {
  shareWorkspace.dataset.mode = mode;
}

function updateAccessoryState() {
  const accessory = state.rewards.picnicHat ? "picnic-hat" : "none";
  for (const gege of [desktopGege, quickGege, taskGege]) {
    gege.dataset.accessory = accessory;
  }
}

function renderQuickContent() {
  if (state.sharePhase === SHARE_PHASES.COMMITTED) {
    quickEyebrow.textContent = "格格留下了一篇新日记";
    quickTitle.textContent = "我把野餐方法记住啦！";
    quickDescription.textContent = "野餐帽也戴好了，来看看我的成长日记。";
    startShareTaskButton.textContent = "看看日记";
    return;
  }

  if (state.sharePhase === SHARE_PHASES.PLATTER_READY) {
    quickEyebrow.textContent = "野餐果盘还在等你";
    quickTitle.textContent = "把4 · 4 · 4送给格格";
    quickDescription.textContent = "任务已经保存，可以继续亲手递给它。";
    startShareTaskButton.textContent = "继续投喂";
    return;
  }

  if (state.shareCheckpoint) {
    quickEyebrow.textContent = "格格把进度留在原处";
    quickTitle.textContent = "野餐任务还没有完成";
    quickDescription.textContent = "盘子和果子都没有动，继续帮助格格吧。";
    startShareTaskButton.textContent = "继续任务";
    return;
  }

  quickEyebrow.textContent = "格格带来一个问题";
  quickTitle.textContent = "12颗果子，怎么分给3位朋友？";
  quickDescription.textContent = "它想先试试自己的办法。";
  startShareTaskButton.textContent = "一起看看";
}

function renderTaskForState() {
  formulaBoard.hidden = true;
  memoryCard.hidden = true;
  rewardScene.setReady(false);
  setWorkspaceMode("share");

  if (state.sharePhase === SHARE_PHASES.INTRO) {
    taskStepLabel.textContent = "观察问题";
    taskTitle.textContent = "给3位朋友分果子";
    taskDialogue.textContent = "我先来试试看。";
    taskHint.textContent = "先看看格格会怎么分。";
    shareScene.renderPool();
    setTaskAction("看看格格怎么分", runWrongAttempt);
    return;
  }

  if (state.sharePhase === SHARE_PHASES.WRONG_ATTEMPT) {
    renderWrongAttemptReady();
    return;
  }

  if (state.sharePhase === SHARE_PHASES.INTERACTIVE) {
    taskStepLabel.textContent = "帮助格格";
    taskTitle.textContent = "让每只盘子一样多";
    taskDialogue.textContent = "这些盘子看起来不太一样。";
    taskHint.textContent = "拖动果子，或选中果子后按数字1、2、3。";
    shareScene.renderAssignments(state.assignments);
    shareScene.setInteractive(true);
    setTaskAction("正在分果子", null, { disabled: true });
    return;
  }

  if (state.sharePhase === SHARE_PHASES.BALANCED) {
    showBalancedResult({ playMotion: false });
    return;
  }

  if (state.sharePhase === SHARE_PHASES.PLATTER_READY) {
    showPlatterReady({ animate: false });
    return;
  }

  showCommittedMemory({ playMotion: false });
}

async function runWrongAttempt() {
  if (!showShareWrongAttempt(state)) return;
  await saveCheckpoint();
  taskStepLabel.textContent = "格格先尝试";
  taskDialogue.textContent = "我分好了……这样一样多吗？";
  taskHint.textContent = "观察三只盘子里的数量。";
  setTaskAction("格格正在分", null, { disabled: true });
  shareScene.renderAssignments(state.assignments);

  window.setTimeout(async () => {
    await motionControllers[2].play("motion.gege.safe_fail_retry");
    renderWrongAttemptReady();
  }, 620);
}

function renderWrongAttemptReady() {
  shareScene.renderAssignments(state.assignments);
  shareScene.setInteractive(false);
  taskStepLabel.textContent = "发现不平均";
  taskDialogue.textContent = "5、4、3……好像不一样。";
  taskHint.textContent = "帮助格格，让三只盘子的数量一样多。";
  setTaskAction("帮帮格格", beginShareHelp);
  announce("格格分成了5颗、4颗和3颗，三只盘子不一样多。");
}

async function beginShareHelp() {
  if (!requestShareHelp(state)) return;
  await saveCheckpoint();
  renderTaskForState();
  document.querySelector(".fruit:not(:disabled)")?.focus();
}

function handleFruitMove(fruitIndex, targetPlate) {
  const accepted = moveShareFruit(state, fruitIndex, targetPlate);
  if (!accepted) return false;

  shareScene.renderAssignments(state.assignments);
  const analysis = analyzeAssignments(state.assignments);
  announce(`三只盘子现在有${analysis.counts.join("、")}颗果子。`);

  if (analysis.balanced) {
    shareScene.setInteractive(false);
    void saveCheckpoint().then(() => {
      window.setTimeout(() => showBalancedResult({ playMotion: true }), 360);
    });
  }
  return true;
}

function showBalancedResult({ playMotion }) {
  setWorkspaceMode("share");
  taskStepLabel.textContent = "看见结果";
  taskTitle.textContent = "三只盘子一样多";
  taskDialogue.textContent = "每只盘子都有4颗！";
  taskHint.textContent = "把这个办法做成一只野餐果盘。";
  shareScene.renderAssignments(state.assignments);
  shareScene.setInteractive(false);
  formulaBoard.hidden = false;
  memoryCard.hidden = true;
  rewardScene.setReady(false);
  setTaskAction("做成野餐果盘", preparePlatter);
  if (playMotion) motionControllers[2].play("motion.gege.understand_restate");
  announce("每盘4颗。4加4加4等于12，12除以3等于4。");
}

async function preparePlatter() {
  if (!prepareSharePlatter(state)) return;
  await saveCheckpoint();
  showPlatterReady({ animate: true });
}

function showPlatterReady({ animate }) {
  taskStepLabel.textContent = "亲手照顾";
  taskTitle.textContent = "把野餐果盘递给格格";
  taskDialogue.textContent = "4、4、4！这是我们一起做的。";
  taskHint.textContent = "拖到窗口左侧的格格身上；也可以直接点“递给格格”。";
  shareScene.renderAssignments(state.assignments);
  shareScene.setInteractive(false);
  formulaBoard.hidden = true;
  memoryCard.hidden = true;
  setWorkspaceMode("platter");
  picnicPlatter.dataset.animate = String(animate);
  rewardScene.setReady(true);
  setTaskAction("递给格格", handlePicnicFeed);
  window.setTimeout(() => picnicPlatter.focus(), animate ? 360 : 0);
  announce("野餐果盘准备好了。把果盘递给格格。");
}

async function handlePicnicFeed() {
  if (!commitPicnicFeeding(state)) return false;
  await saveCheckpoint();
  updateAccessoryState();
  setWorkspaceMode("feeding");
  taskStepLabel.textContent = "一起野餐";
  taskTitle.textContent = "格格正在品尝";
  taskDialogue.textContent = "我也要分给朋友们！";
  taskHint.textContent = "看格格怎样接住、品尝，再把方法记下来。";
  setTaskAction("格格正在品尝", null, { disabled: true });
  announce("格格接住了野餐果盘，正在和朋友一起分享。");
  finishPicnicFeeding();
  return true;
}

async function finishPicnicFeeding() {
  await motionControllers[2].play("task.share.picnic_feed");
  showCommittedMemory({ playMotion: false });
  if (companionWindow.dataset.view === "task") taskAction.focus();
}

function showCommittedMemory({ playMotion }) {
  updateAccessoryState();
  taskStepLabel.textContent = "留下记忆";
  taskTitle.textContent = "格格记住了平均分";
  taskDialogue.textContent = "平均分，就是每份一样多。";
  taskHint.textContent = "野餐帽和成长日记已经保存。";
  shareScene.renderAssignments(state.assignments);
  shareScene.setInteractive(false);
  setWorkspaceMode("memory");
  formulaBoard.hidden = true;
  memoryCard.hidden = false;
  rewardScene.setReady(false);
  setTaskAction("回到桌面", closeTask);
  if (playMotion) motionControllers[2].play("motion.gege.understand_restate");
  announce("野餐帽和成长日记已经保存。平均分，就是每份一样多。");
}

function openQuickCard() {
  if (companionWindow.dataset.view !== "closed") return;
  if (!openQuickInteraction(state)) return;
  renderQuickContent();
  setCompanionView("quick");
  motionControllers[1].play("motion.gege.notice_observe");
  window.setTimeout(() => startShareTaskButton.focus(), 240);
}

function prepareTaskQuickSurface() {
  if (surface !== "task") return;
  returnToDesktop(state);
  if (!openQuickInteraction(state)) return;
  renderQuickContent();
  setCompanionView("quick");
  window.setTimeout(() => startShareTaskButton.focus(), 0);
}

async function startTask() {
  if (!startShareTask(state)) return;
  await saveCheckpoint();
  setCompanionView("task");
  renderTaskForState();
  window.setTimeout(() => taskAction.focus(), 260);
}

async function closeQuick() {
  returnToDesktop(state);
  await saveCheckpoint();
  if (surface === "task") {
    await runtime.hideCurrentWindow();
    return;
  }
  setCompanionView("closed");
  desktopPet.focus();
}

async function closeTask() {
  returnToDesktop(state);
  await saveCheckpoint();
  if (surface === "task") {
    await runtime.hideCurrentWindow();
    return;
  }
  setCompanionView("closed");
  desktopPet.focus();
}

companionTools = createCompanionTools({
  root: document,
  readSession: () => session,
  writeSession,
  showUtility: () => setCompanionView("utility"),
  showQuick: returnToQuickHub,
  announce
});

startShareTaskButton.addEventListener("click", startTask);
document.querySelector("#open-random-task").addEventListener("click", () => {
  void companionTools.openRandom();
});
document.querySelector("#open-reminders").addEventListener("click", () => {
  companionTools.openReminders();
});
document.querySelector("#open-task-pool").addEventListener("click", () => {
  companionTools.openPool();
});
document.querySelector("#close-quick").addEventListener("click", closeQuick);
document.querySelector("#utility-back").addEventListener("click", companionTools.back);
document.querySelector("#close-utility").addEventListener("click", closeQuick);
document.querySelector("#close-task").addEventListener("click", closeTask);
taskAction.addEventListener("click", () => actionHandler?.());

sizeSelect.addEventListener("change", () => {
  const size = Number(sizeSelect.value);
  desktopGegeHost.style.setProperty("--pet-size", `${size}px`);
  desktopPet.style.setProperty("--pet-size", `${size}px`);
  announce(`格格桌面尺寸切换为${size}像素。`);
});

toggleSizeTest.addEventListener("click", () => {
  sizeInspectionEnabled = !sizeInspectionEnabled;
  toggleSizeTest.setAttribute("aria-expanded", String(sizeInspectionEnabled));
  sizeInspector.hidden = !sizeInspectionEnabled || companionWindow.dataset.view !== "closed";
});

reduceMotionToggle.addEventListener("change", () => {
  const reduced = reduceMotionToggle.checked;
  document.body.classList.toggle("reduced-motion", reduced);
  motionControllers.forEach((controller) => controller.setReducedMotion(reduced));
  announce(reduced ? "已减少动态效果。" : "已恢复完整动态效果。");
});

document.querySelector("#reset-prototype").addEventListener("click", async () => {
  session = await storage.reset();
  state = createPetState();
  setCompanionView("closed");
  formulaBoard.hidden = true;
  memoryCard.hidden = true;
  rewardScene.setReady(false);
  setWorkspaceMode("share");
  shareScene.renderPool();
  updateAccessoryState();
  announce("原型已经重置。");
  desktopPet.focus();
});

let hoverTimer = null;
desktopPet.addEventListener("pointerenter", () => {
  hoverTimer = window.setTimeout(() => {
    if (!desktopPet.classList.contains("is-dragging")) {
      motionControllers[0].play("motion.gege.notice_observe");
    }
  }, 400);
});
desktopPet.addEventListener("pointerleave", () => window.clearTimeout(hoverTimer));

let petDrag = null;
let suppressPetClick = false;

desktopPet.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || companionWindow.dataset.view !== "closed") return;
  const petRect = desktopPet.getBoundingClientRect();
  const desktopRect = desktop.getBoundingClientRect();
  desktopPet.setPointerCapture(event.pointerId);
  petDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    left: petRect.left - desktopRect.left,
    top: petRect.top - desktopRect.top,
    active: false
  };
});

desktopPet.addEventListener("pointermove", (event) => {
  if (!petDrag || event.pointerId !== petDrag.pointerId) return;
  const deltaX = event.clientX - petDrag.startX;
  const deltaY = event.clientY - petDrag.startY;
  if (!petDrag.active && Math.hypot(deltaX, deltaY) < 4) return;

  petDrag.active = true;
  desktopPet.classList.add("is-dragging");
  const desktopRect = desktop.getBoundingClientRect();
  const petRect = desktopPet.getBoundingClientRect();
  const maxLeft = desktopRect.width - petRect.width - 16;
  const maxTop = desktopRect.height - petRect.height - 48;
  const left = Math.min(Math.max(16, petDrag.left + deltaX), maxLeft);
  const top = Math.min(Math.max(16, petDrag.top + deltaY), maxTop);
  desktopPet.style.left = `${left}px`;
  desktopPet.style.top = `${top}px`;
  desktopPet.style.bottom = "auto";
  desktopPet.style.setProperty("--drag-tilt", `${Math.max(-6, Math.min(6, deltaX / 18))}deg`);
});

function finishPetDrag(event) {
  if (!petDrag || event.pointerId !== petDrag.pointerId) return;
  suppressPetClick = petDrag.active;
  desktopPet.classList.remove("is-dragging");
  desktopPet.style.removeProperty("--drag-tilt");
  petDrag = null;
  if (suppressPetClick) {
    window.setTimeout(() => {
      suppressPetClick = false;
    }, 0);
  }
}

desktopPet.addEventListener("pointerup", finishPetDrag);
desktopPet.addEventListener("pointercancel", finishPetDrag);

desktopPet.addEventListener("click", async (event) => {
  if (suppressPetClick) {
    event.preventDefault();
    return;
  }
  await motionControllers[0].play("motion.gege.touch_response");
  openQuickCard();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (companionWindow.dataset.view === "quick") closeQuick();
  if (companionWindow.dataset.view === "utility") companionTools.back();
  if (companionWindow.dataset.view === "task") closeTask();
});

await storage.subscribe((nextSession) => {
  session = nextSession;
  companionTools.refresh();
});
await runtime.onReminderFired((reminder) => {
  announce(`${reminder.title}，到时间了。`);
  companionTools.refresh();
});

updateAccessoryState();

if (surface === "task") {
  await runtime.onTaskWindowRequested(prepareTaskQuickSurface);
  prepareTaskQuickSurface();
} else if (state.productState === PRODUCT_STATES.LEARNING_ADVENTURE) {
  setCompanionView("task");
  renderTaskForState();
} else {
  setCompanionView("closed");
  shareScene.renderPool();
}

if (surface !== "task" && state.productState === PRODUCT_STATES.LEARNING_ADVENTURE) {
  announce(`已恢复到${state.shareCheckpoint}。`);
}
