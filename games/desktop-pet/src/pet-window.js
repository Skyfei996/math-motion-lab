import { MotionController, mountGege } from "./motion-controller.js";
import { restoreShareState } from "./pet-state.js";
import { createNativeRuntime } from "./native-runtime.js";
import { createStateStorage } from "./state-storage.js";
import { fireReminder } from "./reminder-model.js";

const DRAG_THRESHOLD = 5;

const button = document.querySelector("#pet-window-button");
const host = document.querySelector("#pet-window-gege-host");
const status = document.querySelector("#pet-window-status");
const reminderBubble = document.querySelector("#pet-reminder-bubble");
const reminderTitle = document.querySelector("#pet-reminder-title");
const gege = mountGege(host, 96);
const motion = new MotionController(gege, {
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
});
const [runtime, storage] = await Promise.all([
  createNativeRuntime(),
  createStateStorage()
]);

let session = await storage.load();
let pointerGesture = null;
let suppressClick = false;
let placementSaveTimer = null;
let ambientTimer = null;
let lastInteractionAt = Date.now();

function renderReminderBubble() {
  const fired = session.reminders.find((reminder) => reminder.status === "fired");
  reminderBubble.hidden = !fired;
  reminderTitle.textContent = fired?.title ?? "";
  button.dataset.hasReminder = String(Boolean(fired));
}

function renderSession(nextSession) {
  session = nextSession;
  const restored = session.checkpoint
    ? restoreShareState(session.checkpoint)
    : null;
  gege.dataset.accessory = restored?.rewards.picnicHat ? "picnic-hat" : "none";
  button.dataset.reward = restored?.rewards.picnicHat ? "picnic-hat" : "none";
  renderReminderBubble();
  void runtime.setAlwaysOnTop(session.alwaysOnTop);
  void runtime.syncReminders(session.reminders);
}

async function savePlacement(placement) {
  if (!placement) return;
  session = await storage.save({ ...session, petPlacement: placement });
}

async function handleReminderFired(reminder) {
  const current = session.reminders.find((item) => (
    item.id === reminder.id
    && item.dueAt === reminder.dueAt
    && item.status === "scheduled"
  ));
  if (!current) return;
  lastInteractionAt = Date.now();
  session = await storage.save({
    ...session,
    reminders: session.reminders.map((item) => (
      item.id === reminder.id ? fireReminder(item) : item
    ))
  });
  renderSession(session);
  status.textContent = `${reminder.title}，到时间了。`;
  await motion.play("motion.gege.reminder_alert");
}

await runtime.onReminderFired(handleReminderFired);
renderSession(session);
await runtime.placePetWindow(session.petPlacement);
await storage.subscribe(renderSession);
await runtime.onAlwaysOnTopChanged(async (alwaysOnTop) => {
  session = await storage.save({ ...session, alwaysOnTop });
});
await runtime.onWindowMoved((placement) => {
  window.clearTimeout(placementSaveTimer);
  placementSaveTimer = window.setTimeout(() => savePlacement(placement), 180);
});

button.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  lastInteractionAt = Date.now();
  button.setPointerCapture(event.pointerId);
  pointerGesture = {
    pointerId: event.pointerId,
    startX: event.screenX,
    startY: event.screenY,
    dragging: false
  };
});

button.addEventListener("pointermove", async (event) => {
  if (!pointerGesture || event.pointerId !== pointerGesture.pointerId) return;
  const distance = Math.hypot(
    event.screenX - pointerGesture.startX,
    event.screenY - pointerGesture.startY
  );
  if (pointerGesture.dragging || distance <= DRAG_THRESHOLD) return;

  pointerGesture.dragging = true;
  suppressClick = true;
  button.dataset.dragging = "true";
  status.textContent = "正在移动格格。";
  await runtime.startDragging();
});

function finishGesture(event) {
  if (!pointerGesture || event.pointerId !== pointerGesture.pointerId) return;
  suppressClick = pointerGesture.dragging;
  pointerGesture = null;
  button.dataset.dragging = "false";
  if (suppressClick) {
    window.setTimeout(() => {
      suppressClick = false;
    }, 0);
  }
}

button.addEventListener("pointerup", finishGesture);
button.addEventListener("pointercancel", finishGesture);

button.addEventListener("click", async (event) => {
  if (suppressClick) {
    event.preventDefault();
    return;
  }
  lastInteractionAt = Date.now();
  await motion.play("motion.gege.touch_response");
  status.textContent = "正在打开分果子任务。";
  await runtime.openTaskWindow();
});

function scheduleAmbientMotion() {
  window.clearTimeout(ambientTimer);
  const delay = 20_000 + Math.round(Math.random() * 30_000);
  ambientTimer = window.setTimeout(async () => {
    const quietLongEnough = Date.now() - lastInteractionAt >= 18_000;
    if (
      quietLongEnough
      && !pointerGesture
      && reminderBubble.hidden
      && document.visibilityState === "visible"
    ) {
      await motion.play("motion.gege.ambient_curiosity");
    }
    scheduleAmbientMotion();
  }, delay);
}

scheduleAmbientMotion();
