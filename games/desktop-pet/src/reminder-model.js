export const REMINDER_STATUSES = Object.freeze({
  SCHEDULED: "scheduled",
  FIRED: "fired",
  DONE: "done"
});

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function localTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
}

function normalizeTitle(source) {
  return cleanText(
    source
      .replace(/^(提醒我|记得|有)/, "")
      .replace(/^(要|去)/, ""),
    60
  ) || "未命名提醒";
}

function parseRelativeMinutes(text, now) {
  const match = text.match(/^(\d{1,3})\s*分钟后(?:提醒我|记得)?\s*(.+)$/);
  if (!match) return null;
  const minutes = Number(match[1]);
  if (minutes < 1 || minutes > 720) return { error: "unsupported-time" };
  return {
    title: normalizeTitle(match[2]),
    dueAt: now.getTime() + minutes * 60_000
  };
}

function parseNamedDay(text, now) {
  const match = text.match(
    /^(今天|明天|后天)(早上|上午|中午|下午|晚上)?\s*(\d{1,2})(?:点|:)(\d{1,2})?\s*(.*)$/
  );
  if (!match) return null;

  const dayOffset = { 今天: 0, 明天: 1, 后天: 2 }[match[1]];
  const period = match[2] || "";
  let hour = Number(match[3]);
  const minute = Number(match[4] || 0);
  if (hour > 23 || minute > 59) return { error: "unsupported-time" };
  if (["下午", "晚上"].includes(period) && hour < 12) hour += 12;
  if (period === "中午" && hour < 11) hour += 12;

  const due = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dayOffset,
    hour,
    minute,
    0,
    0
  );
  if (due.getTime() <= now.getTime()) return { error: "time-in-past" };

  return {
    title: normalizeTitle(match[5]),
    dueAt: due.getTime()
  };
}

export function parseReminderText(value, now = new Date()) {
  const text = cleanText(value, 120);
  if (!text) return { ok: false, error: "empty" };
  const parsed = parseRelativeMinutes(text, now) ?? parseNamedDay(text, now);
  if (!parsed) return { ok: false, error: "unsupported-format" };
  if (parsed.error) return { ok: false, error: parsed.error };
  return {
    ok: true,
    title: parsed.title,
    dueAt: parsed.dueAt,
    timeZone: localTimeZone()
  };
}

export function createReminder(
  value,
  {
    now = Date.now(),
    fallbackId = `reminder-${now}`
  } = {}
) {
  const title = cleanText(value?.title, 60);
  const dueAt = Number(value?.dueAt);
  if (!title || !Number.isFinite(dueAt)) return null;

  const status = Object.values(REMINDER_STATUSES).includes(value?.status)
    ? value.status
    : REMINDER_STATUSES.SCHEDULED;
  return {
    id: cleanText(value?.id, 80) || fallbackId,
    title,
    dueAt: Math.round(dueAt),
    timeZone: cleanText(value?.timeZone, 80) || localTimeZone(),
    advanceMinutes: Math.min(
      60,
      Math.max(0, Math.round(Number(value?.advanceMinutes) || 0))
    ),
    status,
    createdAt: Number.isFinite(Number(value?.createdAt))
      ? Math.round(Number(value.createdAt))
      : Math.round(now),
    firedAt: Number.isFinite(Number(value?.firedAt))
      ? Math.round(Number(value.firedAt))
      : null,
    snoozeCount: Math.min(
      20,
      Math.max(0, Math.round(Number(value?.snoozeCount) || 0))
    )
  };
}

export function normalizeReminders(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const reminders = [];
  for (const [index, item] of value.slice(0, 200).entries()) {
    const reminder = createReminder(item, { fallbackId: `reminder-${index + 1}` });
    if (!reminder || seen.has(reminder.id)) continue;
    seen.add(reminder.id);
    reminders.push(reminder);
  }
  return reminders;
}

export function fireReminder(reminder, firedAt = Date.now()) {
  if (reminder.status !== REMINDER_STATUSES.SCHEDULED) return reminder;
  return {
    ...reminder,
    status: REMINDER_STATUSES.FIRED,
    firedAt
  };
}

export function completeReminder(reminder) {
  return { ...reminder, status: REMINDER_STATUSES.DONE };
}

export function snoozeReminder(reminder, now = Date.now(), minutes = 10) {
  return {
    ...reminder,
    dueAt: now + minutes * 60_000,
    status: REMINDER_STATUSES.SCHEDULED,
    firedAt: null,
    snoozeCount: reminder.snoozeCount + 1
  };
}

export function formatReminderTime(dueAt) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(dueAt));
}
