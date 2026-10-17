import assert from "node:assert/strict";
import {
  SAVE_VERSION,
  createBrowserStateStorage,
  normalizeSession
} from "../src/state-storage.js";
import { createDefaultTaskPool } from "../src/task-pool.js";

const empty = normalizeSession(null);
assert.deepEqual(empty, {
  version: SAVE_VERSION,
  checkpoint: null,
  closed: true,
  petPlacement: null,
  alwaysOnTop: true,
  taskPool: createDefaultTaskPool(),
  recentTaskIds: [],
  reminders: []
});

const migrated = normalizeSession({
  checkpoint: "SHARE_PLATTER_READY",
  closed: false
});
assert.equal(migrated.version, SAVE_VERSION);
assert.equal(migrated.checkpoint, "SHARE_PLATTER_READY");
assert.equal(migrated.closed, false);
assert.equal(migrated.alwaysOnTop, true);
assert.deepEqual(migrated.taskPool, createDefaultTaskPool());
assert.deepEqual(migrated.reminders, []);

const invalid = normalizeSession("{not-json");
assert.deepEqual(invalid, empty);

const unknownCheckpoint = normalizeSession({
  version: SAVE_VERSION,
  checkpoint: "SHARE_UNKNOWN",
  closed: false
});
assert.deepEqual(unknownCheckpoint, empty);

const memory = new Map();
const fakeLocalStorage = {
  getItem(key) {
    return memory.get(key) ?? null;
  },
  setItem(key, value) {
    memory.set(key, value);
  },
  removeItem(key) {
    memory.delete(key);
  }
};

const storage = createBrowserStateStorage({
  localStorage: fakeLocalStorage,
  eventTarget: null,
  channelFactory: null
});
await storage.save({
  checkpoint: "SHARE_COMMITTED",
  closed: true,
  petPlacement: { displayId: "primary", x: 12, y: 34 },
  alwaysOnTop: false,
  taskPool: [{
    id: "custom",
    title: "读英语5分钟",
    category: "学习",
    durationMinutes: 5,
    context: "室内",
    enabled: true
  }],
  recentTaskIds: ["custom"],
  reminders: [{
    id: "meeting",
    title: "会议",
    dueAt: 1785463200000,
    timeZone: "Asia/Singapore",
    advanceMinutes: 0,
    status: "scheduled",
    createdAt: 1785400000000,
    firedAt: null,
    snoozeCount: 0
  }]
});
const loaded = await storage.load();
assert.equal(loaded.checkpoint, "SHARE_COMMITTED");
assert.equal(loaded.closed, true);
assert.deepEqual(loaded.petPlacement, { displayId: "primary", x: 12, y: 34 });
assert.equal(loaded.alwaysOnTop, false);
assert.equal(loaded.taskPool[0].title, "读英语5分钟");
assert.deepEqual(loaded.recentTaskIds, ["custom"]);
assert.equal(loaded.reminders[0].title, "会议");

await storage.reset();
assert.deepEqual(await storage.load(), empty);

console.log("state storage tests passed");
