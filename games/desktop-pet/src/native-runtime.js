import {
  resolveTaskWindowPlacement,
  resolveWindowPlacement
} from "./window-placement.js";

const PET_WINDOW_SIZE = Object.freeze({ width: 112, height: 128 });
const TASK_WINDOW_SIZE = Object.freeze({ width: 560, height: 420 });

function createBrowserRuntime(host) {
  let reminderHandler = null;
  let reminderTimer = null;
  let reminders = [];
  const delivered = new Set();

  function scheduleReminder() {
    host.clearTimeout(reminderTimer);
    const now = Date.now();
    const next = reminders
      .filter((reminder) => reminder.status === "scheduled")
      .sort((a, b) => a.dueAt - b.dueAt)
      .find((reminder) => !delivered.has(`${reminder.id}:${reminder.dueAt}`));
    if (!next || !reminderHandler) return;
    const delay = Math.min(2_147_000_000, Math.max(0, next.dueAt - now));
    reminderTimer = host.setTimeout(() => {
      const key = `${next.id}:${next.dueAt}`;
      delivered.add(key);
      reminderHandler(next);
      scheduleReminder();
    }, delay);
  }

  return {
    kind: "browser",
    async openTaskWindow() {
      host.location.assign("./?surface=task");
    },
    async hideCurrentWindow() {
      host.location.assign("./pet.html");
    },
    async startDragging() {
      return false;
    },
    async placePetWindow() {
      return null;
    },
    async getPetPlacement() {
      return null;
    },
    async onWindowMoved() {
      return () => {};
    },
    async onTaskWindowRequested() {
      return () => {};
    },
    async setAlwaysOnTop() {
      return false;
    },
    async onAlwaysOnTopChanged() {
      return () => {};
    },
    async syncReminders(nextReminders) {
      reminders = [...nextReminders];
      scheduleReminder();
      return true;
    },
    async onReminderFired(handler) {
      reminderHandler = handler;
      scheduleReminder();
      return () => {
        reminderHandler = null;
        host.clearTimeout(reminderTimer);
      };
    }
  };
}

function logicalPoint(point, scaleFactor) {
  if (typeof point?.toLogical === "function") return point.toLogical(scaleFactor);
  return {
    x: point.x / scaleFactor,
    y: point.y / scaleFactor
  };
}

function logicalSize(size, scaleFactor) {
  if (typeof size?.toLogical === "function") return size.toLogical(scaleFactor);
  return {
    width: size.width / scaleFactor,
    height: size.height / scaleFactor
  };
}

function monitorId(monitor) {
  return monitor.name
    ?? `${monitor.position.x}:${monitor.position.y}`;
}

function normalizeMonitor(monitor, primaryName) {
  const position = logicalPoint(monitor.workArea.position, monitor.scaleFactor);
  const size = logicalSize(monitor.workArea.size, monitor.scaleFactor);
  return {
    id: monitorId(monitor),
    primary: monitor.name === primaryName,
    workArea: {
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    }
  };
}

async function createTauriRuntime() {
  const { invoke } = await import("@tauri-apps/api/core");
  const { emitTo, listen } = await import("@tauri-apps/api/event");
  const {
    LogicalPosition,
    availableMonitors,
    currentMonitor,
    getCurrentWindow,
    primaryMonitor
  } = await import("@tauri-apps/api/window");
  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");
  const currentWindow = getCurrentWindow();

  async function readDisplays() {
    const [monitors, primary] = await Promise.all([
      availableMonitors(),
      primaryMonitor()
    ]);
    return monitors.map((monitor) => (
      normalizeMonitor(monitor, primary?.name ?? null)
    ));
  }

  async function getPetPlacement() {
    const [position, scaleFactor, monitor] = await Promise.all([
      currentWindow.outerPosition(),
      currentWindow.scaleFactor(),
      currentMonitor()
    ]);
    const logicalPosition = logicalPoint(position, scaleFactor);
    return {
      displayId: monitor ? monitorId(monitor) : "unknown",
      x: Math.round(logicalPosition.x),
      y: Math.round(logicalPosition.y)
    };
  }

  return {
    kind: "tauri",
    async openTaskWindow() {
      const taskWindow = await WebviewWindow.getByLabel("task");
      if (!taskWindow) return false;
      const petPlacement = await getPetPlacement();
      const taskPlacement = resolveTaskWindowPlacement({
        displays: await readDisplays(),
        petBounds: { ...petPlacement, ...PET_WINDOW_SIZE },
        windowSize: TASK_WINDOW_SIZE
      });
      if (taskPlacement) {
        await taskWindow.setPosition(
          new LogicalPosition(taskPlacement.x, taskPlacement.y)
        );
      }
      await emitTo("task", "desktop-pet://open-quick");
      await taskWindow.show();
      await taskWindow.setFocus();
      return true;
    },
    async hideCurrentWindow() {
      await currentWindow.hide();
      return true;
    },
    async startDragging() {
      await currentWindow.startDragging();
      return true;
    },
    async placePetWindow(savedPlacement) {
      const placement = resolveWindowPlacement({
        displays: await readDisplays(),
        windowSize: PET_WINDOW_SIZE,
        savedPlacement
      });
      if (!placement) return null;
      await currentWindow.setPosition(new LogicalPosition(placement.x, placement.y));
      return placement;
    },
    getPetPlacement,
    async onWindowMoved(handler) {
      return currentWindow.onMoved(async () => {
        handler(await getPetPlacement());
      });
    },
    async onTaskWindowRequested(handler) {
      return listen("desktop-pet://open-quick", () => handler());
    },
    async setAlwaysOnTop(enabled) {
      await currentWindow.setAlwaysOnTop(enabled);
      return true;
    },
    async onAlwaysOnTopChanged(handler) {
      return listen("desktop-pet://always-on-top-changed", (event) => {
        handler(Boolean(event.payload));
      });
    },
    async syncReminders(reminders) {
      await invoke("sync_reminders", { reminders });
      return true;
    },
    async onReminderFired(handler) {
      return listen("desktop-pet://reminder-fired", (event) => {
        handler(event.payload);
      });
    }
  };
}

export async function createNativeRuntime(host = globalThis.window) {
  if (!host.__TAURI_INTERNALS__) return createBrowserRuntime(host);
  return createTauriRuntime();
}
