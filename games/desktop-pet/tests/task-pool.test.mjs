import assert from "node:assert/strict";
import {
  createDefaultTaskPool,
  createTaskItem,
  drawTask,
  normalizeTaskPool,
  rememberDraw
} from "../src/task-pool.js";

const defaults = createDefaultTaskPool();
assert.ok(defaults.length >= 20);
assert.equal(defaults.every((task) => task.enabled), true);

assert.deepEqual(createTaskItem({
  id: "custom",
  title: "  读英语5分钟  ",
  category: "学习",
  durationMinutes: 5,
  context: "室内",
  enabled: false
}), {
  id: "custom",
  title: "读英语5分钟",
  category: "学习",
  durationMinutes: 5,
  context: "室内",
  enabled: false
});

const normalized = normalizeTaskPool([
  { id: "a", title: "任务A", durationMinutes: 0 },
  { id: "a", title: "重复ID" },
  { id: "b", title: "" }
]);
assert.equal(normalized.length, 1);
assert.equal(normalized[0].durationMinutes, 1);

const pool = [
  createTaskItem({ id: "a", title: "室内任务", context: "室内" }),
  createTaskItem({ id: "b", title: "户外任务", context: "户外" }),
  createTaskItem({ id: "c", title: "任意任务", context: "任意" })
];
assert.equal(drawTask(pool, { context: "户外", random: () => 0 }).id, "b");
assert.equal(
  drawTask(pool, { recentTaskIds: ["a"], context: "室内", random: () => 0 }).id,
  "c"
);
assert.deepEqual(rememberDraw(["b", "a"], "a", 2), ["a", "b"]);

console.log("task pool tests passed");
