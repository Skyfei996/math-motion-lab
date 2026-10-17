import {
  TASK_CATEGORIES,
  TASK_CONTEXTS,
  createTaskItem,
  drawTask,
  rememberDraw
} from "./task-pool.js";
import {
  REMINDER_STATUSES,
  completeReminder,
  createReminder,
  formatReminderTime,
  parseReminderText,
  snoozeReminder
} from "./reminder-model.js";

const REMINDER_ERRORS = Object.freeze({
  empty: "先告诉格格要提醒什么。",
  "unsupported-format": "还没认出这个时间。可以试试“明天上午10点有会议”。",
  "unsupported-time": "这个时间超出首版支持范围，请换一种说法。",
  "time-in-past": "这个时间已经过去了，请换一个未来时间。"
});

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function optionMarkup(values, selected) {
  return values.map((value) => (
    `<option${value === selected ? " selected" : ""}>${value}</option>`
  )).join("");
}

export function createCompanionTools({
  root,
  readSession,
  writeSession,
  showUtility,
  showQuick,
  announce
}) {
  const panels = {
    random: root.querySelector("#random-task-panel"),
    reminders: root.querySelector("#reminder-panel"),
    pool: root.querySelector("#task-pool-panel")
  };
  const utilityEyebrow = root.querySelector("#utility-eyebrow");
  const utilityTitle = root.querySelector("#utility-title");
  const randomContext = root.querySelector("#random-context");
  const randomCategory = root.querySelector("#random-task-category");
  const randomTitle = root.querySelector("#random-task-title");
  const randomMeta = root.querySelector("#random-task-meta");
  const completeRandomTask = root.querySelector("#complete-random-task");
  const reminderForm = root.querySelector("#reminder-form");
  const reminderInput = root.querySelector("#reminder-natural-input");
  const reminderHelp = root.querySelector("#reminder-form-help");
  const confirmation = root.querySelector("#reminder-confirmation");
  const confirmationTitle = root.querySelector("#reminder-confirm-title");
  const confirmationTime = root.querySelector("#reminder-confirm-time");
  const reminderList = root.querySelector("#reminder-list");
  const reminderCount = root.querySelector("#reminder-count");
  const taskPoolForm = root.querySelector("#task-pool-form");
  const taskPoolList = root.querySelector("#task-pool-list");

  let activePanel = "random";
  let currentTask = null;
  let pendingReminder = null;
  let taskPoolUpdateQueue = Promise.resolve();

  function setPanel(panel) {
    activePanel = panel;
    for (const [name, element] of Object.entries(panels)) {
      element.hidden = name !== panel;
    }
    const headings = {
      random: ["格格的随机冒险", "现在做什么"],
      reminders: ["格格帮你记住", "提醒与日程"],
      pool: ["由你来决定", "管理任务池"]
    };
    [utilityEyebrow.textContent, utilityTitle.textContent] = headings[panel];
    showUtility();
  }

  async function persist(patch) {
    return writeSession({ ...readSession(), ...patch });
  }

  async function draw() {
    const session = readSession();
    currentTask = drawTask(session.taskPool, {
      recentTaskIds: session.recentTaskIds,
      context: randomContext.value
    });
    if (!currentTask) {
      randomCategory.textContent = "没有可抽取任务";
      randomTitle.textContent = "先去任务池开启或添加任务";
      randomMeta.textContent = "也可以换一个当前条件。";
      completeRandomTask.disabled = true;
      return;
    }

    await persist({
      recentTaskIds: rememberDraw(session.recentTaskIds, currentTask.id)
    });
    randomCategory.textContent = currentTask.category;
    randomTitle.textContent = currentTask.title;
    randomMeta.textContent = `${currentTask.durationMinutes}分钟 · ${currentTask.context}`;
    completeRandomTask.disabled = false;
    announce(`格格抽到了：${currentTask.title}。`);
  }

  function renderTaskPool() {
    const { taskPool } = readSession();
    taskPoolList.replaceChildren();
    if (taskPool.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "任务池还是空的，先添加一个想做的小任务吧。";
      taskPoolList.append(empty);
      return;
    }

    for (const task of taskPool) {
      const row = document.createElement("div");
      row.className = "task-row";
      row.dataset.taskId = task.id;
      row.innerHTML = `
        <input type="checkbox" data-field="enabled"${task.enabled ? " checked" : ""}>
        <input type="text" maxlength="40" data-field="title" aria-label="任务名称" value="">
        <select data-field="category" aria-label="任务分类">${optionMarkup(TASK_CATEGORIES, task.category)}</select>
        <input type="number" min="1" max="60" data-field="durationMinutes" aria-label="任务分钟数" value="${task.durationMinutes}">
        <select data-field="context" aria-label="任务条件">${optionMarkup(TASK_CONTEXTS, task.context)}</select>
        <button class="mini-button" type="button" data-action="save">存</button>
        <button class="mini-button" type="button" data-action="delete">删</button>
      `;
      const enabledInput = row.querySelector('[data-field="enabled"]');
      const titleInput = row.querySelector('[data-field="title"]');
      const saveButton = row.querySelector('[data-action="save"]');
      const deleteButton = row.querySelector('[data-action="delete"]');
      enabledInput.setAttribute("aria-label", `启用${task.title}`);
      titleInput.value = task.title;
      saveButton.setAttribute("aria-label", `保存${task.title}`);
      deleteButton.setAttribute("aria-label", `删除${task.title}`);
      taskPoolList.append(row);
    }
  }

  function renderReminders() {
    const active = readSession().reminders
      .filter((reminder) => reminder.status !== REMINDER_STATUSES.DONE)
      .sort((a, b) => a.dueAt - b.dueAt);
    reminderCount.textContent = `${active.length}项`;
    reminderList.replaceChildren();
    if (active.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "还没有提醒。格格会把确认过的时间记在这里。";
      reminderList.append(empty);
      return;
    }

    for (const reminder of active) {
      const row = document.createElement("article");
      row.className = "reminder-row";
      row.dataset.reminderId = reminder.id;
      row.dataset.status = reminder.status;
      const copy = document.createElement("div");
      copy.className = "reminder-row-copy";
      const title = document.createElement("strong");
      title.textContent = reminder.title;
      const time = document.createElement("time");
      time.dateTime = new Date(reminder.dueAt).toISOString();
      time.textContent = reminder.status === REMINDER_STATUSES.FIRED
        ? `到时间了 · ${formatReminderTime(reminder.dueAt)}`
        : formatReminderTime(reminder.dueAt);
      copy.append(title, time);

      const actions = document.createElement("div");
      actions.className = "reminder-row-actions";
      if (reminder.status === REMINDER_STATUSES.FIRED) {
        actions.append(
          createRowButton("10分钟后", "snooze"),
          createRowButton("完成", "done")
        );
      } else {
        actions.append(
          createRowButton("完成", "done"),
          createRowButton("删除", "delete")
        );
      }
      row.append(copy, actions);
      reminderList.append(row);
    }
  }

  function createRowButton(label, action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mini-button";
    button.dataset.action = action;
    button.textContent = label;
    return button;
  }

  function showReminderError(error) {
    reminderHelp.dataset.error = "true";
    reminderHelp.textContent = REMINDER_ERRORS[error] ?? "没有识别成功，请换一种说法。";
    confirmation.hidden = true;
    pendingReminder = null;
  }

  function resetReminderForm() {
    reminderHelp.dataset.error = "false";
    reminderHelp.textContent = "支持“明天上午10点有会议”和“20分钟后提醒我喝水”。";
    confirmation.hidden = true;
    pendingReminder = null;
  }

  async function savePendingReminder() {
    if (!pendingReminder) return;
    const session = readSession();
    const reminder = createReminder({
      id: createId("reminder"),
      ...pendingReminder,
      advanceMinutes: 0
    });
    if (!reminder) return;
    await persist({ reminders: [...session.reminders, reminder].slice(-200) });
    reminderInput.value = "";
    resetReminderForm();
    renderReminders();
    announce(`格格记住了：${reminder.title}，${formatReminderTime(reminder.dueAt)}。`);
  }

  async function updateReminder(reminderId, action) {
    const session = readSession();
    const reminders = action === "delete"
      ? session.reminders.filter((reminder) => reminder.id !== reminderId)
      : session.reminders.map((reminder) => {
        if (reminder.id !== reminderId) return reminder;
        if (action === "snooze") return snoozeReminder(reminder);
        if (action === "done") return completeReminder(reminder);
        return reminder;
      });
    await persist({ reminders });
    renderReminders();
  }

  root.querySelector("#draw-another-task").addEventListener("click", draw);
  randomContext.addEventListener("change", draw);
  completeRandomTask.addEventListener("click", () => {
    if (!currentTask) return;
    announce(`${currentTask.title}，完成啦。`);
    randomCategory.textContent = "完成";
    randomTitle.textContent = "格格把这次小冒险记住了";
    randomMeta.textContent = "想继续时可以再换一个。";
    completeRandomTask.disabled = true;
  });
  root.querySelector("#manage-random-pool").addEventListener("click", () => {
    setPanel("pool");
    renderTaskPool();
  });

  reminderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const parsed = parseReminderText(reminderInput.value);
    if (!parsed.ok) {
      showReminderError(parsed.error);
      return;
    }
    pendingReminder = parsed;
    reminderHelp.dataset.error = "false";
    confirmationTitle.textContent = parsed.title;
    confirmationTime.dateTime = new Date(parsed.dueAt).toISOString();
    confirmationTime.textContent = formatReminderTime(parsed.dueAt);
    confirmation.hidden = false;
    root.querySelector("#save-reminder").focus();
  });
  root.querySelector("#save-reminder").addEventListener("click", savePendingReminder);
  root.querySelector("#cancel-reminder-confirm").addEventListener("click", () => {
    resetReminderForm();
    reminderInput.focus();
  });
  reminderList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    const row = button?.closest("[data-reminder-id]");
    if (!button || !row) return;
    void updateReminder(row.dataset.reminderId, button.dataset.action);
  });

  taskPoolForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const task = createTaskItem({
      id: createId("task"),
      title: root.querySelector("#task-title-input").value,
      category: root.querySelector("#task-category-input").value,
      durationMinutes: root.querySelector("#task-duration-input").value,
      context: root.querySelector("#task-context-input").value,
      enabled: true
    });
    if (!task) return;
    const session = readSession();
    await persist({ taskPool: [...session.taskPool, task].slice(-200) });
    taskPoolForm.reset();
    root.querySelector("#task-duration-input").value = "5";
    renderTaskPool();
    announce(`已经把${task.title}加入任务池。`);
  });

  taskPoolList.addEventListener("change", (event) => {
    const field = event.target.dataset.field;
    const row = event.target.closest("[data-task-id]");
    if (field !== "enabled" || !row) return;
    const taskId = row.dataset.taskId;
    const enabled = event.target.checked;
    taskPoolUpdateQueue = taskPoolUpdateQueue.then(async () => {
      const session = readSession();
      const taskPool = session.taskPool.map((task) => {
        if (task.id !== taskId) return task;
        return createTaskItem({ ...task, enabled }, task.id);
      }).filter(Boolean);
      await persist({ taskPool });
    });
  });

  taskPoolList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    const row = button?.closest("[data-task-id]");
    if (!button || !row) return;
    if (button.dataset.action === "save") {
      const task = createTaskItem({
        id: row.dataset.taskId,
        title: row.querySelector('[data-field="title"]').value,
        category: row.querySelector('[data-field="category"]').value,
        durationMinutes: row.querySelector('[data-field="durationMinutes"]').value,
        context: row.querySelector('[data-field="context"]').value,
        enabled: row.querySelector('[data-field="enabled"]').checked
      }, row.dataset.taskId);
      if (!task) {
        announce("任务名称不能为空。");
        return;
      }
      await taskPoolUpdateQueue;
      const session = readSession();
      await persist({
        taskPool: session.taskPool.map((item) => item.id === task.id ? task : item)
      });
      renderTaskPool();
      announce(`已经保存${task.title}。`);
      return;
    }
    if (button.dataset.action !== "delete") return;
    await taskPoolUpdateQueue;
    const session = readSession();
    await persist({
      taskPool: session.taskPool.filter((task) => task.id !== row.dataset.taskId),
      recentTaskIds: session.recentTaskIds.filter((id) => id !== row.dataset.taskId)
    });
    renderTaskPool();
  });

  return {
    async openRandom() {
      setPanel("random");
      await draw();
    },
    openReminders() {
      setPanel("reminders");
      resetReminderForm();
      renderReminders();
      window.setTimeout(() => reminderInput.focus(), 0);
    },
    openPool() {
      setPanel("pool");
      renderTaskPool();
    },
    back: showQuick,
    refresh() {
      if (activePanel === "reminders") renderReminders();
      if (activePanel === "pool") renderTaskPool();
    }
  };
}
