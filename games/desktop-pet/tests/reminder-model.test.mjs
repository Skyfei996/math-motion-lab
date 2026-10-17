import assert from "node:assert/strict";
import {
  REMINDER_STATUSES,
  completeReminder,
  createReminder,
  fireReminder,
  normalizeReminders,
  parseReminderText,
  snoozeReminder
} from "../src/reminder-model.js";

const now = new Date(2026, 6, 30, 14, 0, 0, 0);
const meeting = parseReminderText("明天上午10点有会议", now);
assert.equal(meeting.ok, true);
assert.equal(meeting.title, "会议");
assert.equal(new Date(meeting.dueAt).getDate(), 31);
assert.equal(new Date(meeting.dueAt).getHours(), 10);

const water = parseReminderText("20分钟后提醒我喝水", now);
assert.equal(water.ok, true);
assert.equal(water.title, "喝水");
assert.equal(water.dueAt, now.getTime() + 20 * 60_000);

assert.equal(parseReminderText("今天上午10点开会", now).error, "time-in-past");
assert.equal(parseReminderText("下周提醒我开会", now).error, "unsupported-format");

const reminder = createReminder({
  id: "meeting",
  title: "会议",
  dueAt: meeting.dueAt,
  timeZone: "Asia/Singapore"
}, { now: now.getTime() });
assert.equal(reminder.status, REMINDER_STATUSES.SCHEDULED);

const fired = fireReminder(reminder, meeting.dueAt);
assert.equal(fired.status, REMINDER_STATUSES.FIRED);
assert.equal(fired.firedAt, meeting.dueAt);

const snoozed = snoozeReminder(fired, meeting.dueAt, 10);
assert.equal(snoozed.status, REMINDER_STATUSES.SCHEDULED);
assert.equal(snoozed.dueAt, meeting.dueAt + 10 * 60_000);
assert.equal(snoozed.snoozeCount, 1);
assert.equal(completeReminder(snoozed).status, REMINDER_STATUSES.DONE);

assert.equal(normalizeReminders([reminder, reminder, { title: "" }]).length, 1);

console.log("reminder model tests passed");
