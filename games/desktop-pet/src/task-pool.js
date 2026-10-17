export const TASK_CATEGORIES = Object.freeze([
  "学习",
  "运动",
  "创造",
  "家庭",
  "生活",
  "观察",
  "安静",
  "善意"
]);

export const TASK_CONTEXTS = Object.freeze([
  "任意",
  "室内",
  "户外",
  "需要家人",
  "需要联网"
]);

const DEFAULT_TASK_DEFINITIONS = Object.freeze([
  ["读英语5分钟", "学习", 5, "室内"],
  ["学会3个英语单词", "学习", 5, "室内"],
  ["做2道数学题", "学习", 5, "室内"],
  ["给格格讲一个今天学到的知识", "学习", 5, "任意"],
  ["做10个开合跳", "运动", 3, "室内"],
  ["单脚站立20秒", "运动", 3, "任意"],
  ["跟着一首歌跳舞3分钟", "运动", 3, "室内"],
  ["到户外走5分钟", "运动", 5, "户外"],
  ["画一个今天心情的格格", "创造", 10, "室内"],
  ["给格格设计一顶新帽子", "创造", 10, "室内"],
  ["用积木搭一座桥", "创造", 10, "室内"],
  ["编一个三句话的小故事", "创造", 5, "任意"],
  ["跟爸爸下一盘棋", "家庭", 15, "需要家人"],
  ["给家人讲一个笑话", "家庭", 3, "需要家人"],
  ["采访爸爸小时候最喜欢的游戏", "家庭", 10, "需要家人"],
  ["和家人一起完成一幅画", "家庭", 15, "需要家人"],
  ["整理书桌3分钟", "生活", 3, "室内"],
  ["把5件物品放回原位", "生活", 5, "室内"],
  ["给植物浇水", "生活", 3, "任意"],
  ["准备一份水果", "生活", 10, "室内"],
  ["找到3个圆形物品", "观察", 5, "任意"],
  ["观察今天的云像什么", "观察", 5, "户外"],
  ["闭眼听周围有几种声音", "安静", 3, "任意"],
  ["做5次慢呼吸", "安静", 3, "任意"],
  ["对家人说一句谢谢", "善意", 3, "需要家人"],
  ["主动帮助家人做一件小事", "善意", 5, "需要家人"]
]);

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanDuration(value) {
  const duration = Number(value);
  if (!Number.isFinite(duration)) return 5;
  return Math.min(60, Math.max(1, Math.round(duration)));
}

export function createTaskItem(value, fallbackId = `task-${Date.now()}`) {
  const title = cleanText(value?.title, 40);
  if (!title) return null;

  return {
    id: cleanText(value?.id, 80) || fallbackId,
    title,
    category: TASK_CATEGORIES.includes(value?.category)
      ? value.category
      : "学习",
    durationMinutes: cleanDuration(value?.durationMinutes),
    context: TASK_CONTEXTS.includes(value?.context)
      ? value.context
      : "任意",
    enabled: typeof value?.enabled === "boolean" ? value.enabled : true
  };
}

export function createDefaultTaskPool() {
  return DEFAULT_TASK_DEFINITIONS.map(
    ([title, category, durationMinutes, context], index) => createTaskItem({
      id: `builtin-${index + 1}`,
      title,
      category,
      durationMinutes,
      context,
      enabled: true
    })
  );
}

export function normalizeTaskPool(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const normalized = [];

  for (const [index, item] of value.slice(0, 200).entries()) {
    const task = createTaskItem(item, `task-${index + 1}`);
    if (!task || seen.has(task.id)) continue;
    seen.add(task.id);
    normalized.push(task);
  }
  return normalized;
}

export function drawTask(
  taskPool,
  {
    recentTaskIds = [],
    context = "任意",
    random = Math.random
  } = {}
) {
  const enabled = normalizeTaskPool(taskPool).filter((task) => {
    if (!task.enabled) return false;
    return context === "任意"
      || task.context === "任意"
      || task.context === context;
  });
  if (enabled.length === 0) return null;

  const recent = new Set(recentTaskIds);
  const fresh = enabled.filter((task) => !recent.has(task.id));
  const candidates = fresh.length > 0 ? fresh : enabled;
  const value = Number(random());
  const index = Math.min(
    candidates.length - 1,
    Math.max(0, Math.floor((Number.isFinite(value) ? value : 0) * candidates.length))
  );
  return candidates[index];
}

export function rememberDraw(recentTaskIds, taskId, limit = 5) {
  return [
    taskId,
    ...recentTaskIds.filter((id) => id !== taskId)
  ].slice(0, limit);
}
