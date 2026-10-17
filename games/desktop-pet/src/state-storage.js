import { SHARE_CHECKPOINTS } from "./pet-state.js";
import { normalizeReminders } from "./reminder-model.js";
import { createDefaultTaskPool, normalizeTaskPool } from "./task-pool.js";

export const SAVE_VERSION = 3;
export const STATE_STORAGE_KEY = "desktop-pet-share-checkpoint-v1";
const TAURI_STORE_PATH = "desktop-pet-state.json";

function emptySession() {
  return {
    version: SAVE_VERSION,
    checkpoint: null,
    closed: true,
    petPlacement: null,
    alwaysOnTop: true,
    taskPool: createDefaultTaskPool(),
    recentTaskIds: [],
    reminders: []
  };
}

function normalizePlacement(value) {
  if (
    !value
    || typeof value.displayId !== "string"
    || typeof value.x !== "number"
    || !Number.isFinite(value.x)
    || typeof value.y !== "number"
    || !Number.isFinite(value.y)
  ) return null;

  return {
    displayId: value.displayId,
    x: value.x,
    y: value.y
  };
}

export function normalizeSession(value) {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return emptySession();
    }
  }

  if (!parsed || typeof parsed !== "object") return emptySession();

  const checkpoint = parsed.checkpoint ?? null;
  if (
    checkpoint !== null
    && !Object.values(SHARE_CHECKPOINTS).includes(checkpoint)
  ) return emptySession();

  const taskPool = parsed.taskPool === undefined
    ? createDefaultTaskPool()
    : normalizeTaskPool(parsed.taskPool);
  const taskIds = new Set(taskPool.map((task) => task.id));
  const recentTaskIds = Array.isArray(parsed.recentTaskIds)
    ? parsed.recentTaskIds
      .filter((id) => typeof id === "string" && taskIds.has(id))
      .slice(0, 5)
    : [];

  return {
    version: SAVE_VERSION,
    checkpoint,
    closed: typeof parsed.closed === "boolean" ? parsed.closed : true,
    petPlacement: normalizePlacement(parsed.petPlacement),
    alwaysOnTop: typeof parsed.alwaysOnTop === "boolean"
      ? parsed.alwaysOnTop
      : true,
    taskPool,
    recentTaskIds,
    reminders: normalizeReminders(parsed.reminders)
  };
}

export function createBrowserStateStorage({
  localStorage,
  eventTarget = globalThis.window ?? null,
  channelFactory = globalThis.BroadcastChannel
    ? (name) => new globalThis.BroadcastChannel(name)
    : null
}) {
  const channel = channelFactory?.("desktop-pet-state") ?? null;

  function publish(session) {
    channel?.postMessage(session);
  }

  return {
    kind: "browser",
    async load() {
      return normalizeSession(localStorage.getItem(STATE_STORAGE_KEY));
    },
    async save(value) {
      const session = normalizeSession(value);
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(session));
      publish(session);
      return session;
    },
    async reset() {
      localStorage.removeItem(STATE_STORAGE_KEY);
      const session = emptySession();
      publish(session);
      return session;
    },
    subscribe(handler) {
      const handleStorage = (event) => {
        if (event.key === STATE_STORAGE_KEY) handler(normalizeSession(event.newValue));
      };
      const handleChannel = (event) => handler(normalizeSession(event.data));
      eventTarget?.addEventListener("storage", handleStorage);
      channel?.addEventListener("message", handleChannel);
      return () => {
        eventTarget?.removeEventListener("storage", handleStorage);
        channel?.removeEventListener("message", handleChannel);
      };
    }
  };
}

async function createTauriStateStorage() {
  const { Store } = await import("@tauri-apps/plugin-store");
  const store = await Store.load(TAURI_STORE_PATH, { autoSave: false });

  return {
    kind: "tauri",
    async load() {
      return normalizeSession(await store.get(STATE_STORAGE_KEY));
    },
    async save(value) {
      const session = normalizeSession(value);
      await store.set(STATE_STORAGE_KEY, session);
      await store.save();
      return session;
    },
    async reset() {
      await store.delete(STATE_STORAGE_KEY);
      await store.save();
      return emptySession();
    },
    async subscribe(handler) {
      return store.onKeyChange(STATE_STORAGE_KEY, (value) => {
        handler(normalizeSession(value));
      });
    }
  };
}

export async function createStateStorage(host = globalThis) {
  if (host.__TAURI_INTERNALS__) return createTauriStateStorage();
  return createBrowserStateStorage({ localStorage: host.localStorage });
}
