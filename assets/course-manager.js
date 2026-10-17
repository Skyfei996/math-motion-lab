(function () {
  const copy = {
    "zh-CN": {
      back: "返回课程目录", eyebrow: "课程工作台", title: "管理课程",
      description: "调整课程在目录中的顺序，控制哪些课程对学生显示。",
      visibleLabel: "显示中", hiddenLabel: "已隐藏", all: "全部", visibleFilter: "显示中", hiddenFilter: "已隐藏",
      search: "搜索课程", show: "显示", hide: "隐藏", shown: "显示中", hidden: "已隐藏",
      reset: "恢复默认排序和显示状态", hint: "拖动左侧把手排序，也可以使用上移、下移按钮。隐藏的课程仍会保留在管理列表中。",
      up: "上移", down: "下移", saved: "更改会自动保存到此浏览器", saveFailed: "保存失败，请检查浏览器存储权限。",
      empty: "没有符合条件的课程。", category: "未分类", resetSaved: "已恢复默认设置。"
    },
    "en-US": {
      back: "Back to catalog", eyebrow: "COURSE WORKSPACE", title: "Manage courses",
      description: "Set the catalog order and choose which courses students can see.",
      visibleLabel: "Visible", hiddenLabel: "Hidden", all: "All", visibleFilter: "Visible", hiddenFilter: "Hidden",
      search: "Search courses", show: "Show", hide: "Hide", shown: "Visible", hidden: "Hidden",
      reset: "Restore default order and visibility", hint: "Drag the handle to reorder, or use the move buttons. Hidden courses stay in this list.",
      up: "Move up", down: "Move down", saved: "Changes are saved in this browser", saveFailed: "Could not save. Check this browser’s storage permissions.",
      empty: "No courses match these filters.", category: "Uncategorized", resetSaved: "Default settings restored."
    }
  };

  const list = document.querySelector("[data-course-list]");
  const search = document.querySelector("[data-search]");
  const empty = document.querySelector("[data-empty]");
  const status = document.querySelector("[data-save-status]");
  const preferences = MathLabCatalogPreferences.load();
  let filter = "all";
  let draggedId = null;

  function language() {
    return MathLab.getLanguage() === "en-US" ? "en-US" : "zh-CN";
  }

  function text(key) {
    return copy[language()][key];
  }

  function applyCopy() {
    document.querySelectorAll("[data-ui]").forEach((node) => {
      node.textContent = text(node.dataset.ui);
    });
    search.placeholder = text(search.dataset.uiPlaceholder);
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-label", button.textContent);
    });
    render();
  }

  function save(message) {
    const saved = MathLabCatalogPreferences.save(preferences);
    status.textContent = saved ? message || text("saved") : text("saveFailed");
  }

  function orderedCourses() {
    return preferences.order
      .map((id) => MathLabData.catalog.find((course) => course.id === id))
      .filter(Boolean);
  }

  function filteredCourses() {
    const query = search.value.trim().toLocaleLowerCase();
    return orderedCourses().filter((course) => {
      const isHidden = preferences.hiddenIds.includes(course.id);
      if (filter === "visible" && isHidden) return false;
      if (filter === "hidden" && !isHidden) return false;
      if (!query) return true;
      const title = MathLab.text(`lessons.${course.id}.title`);
      const summary = MathLab.text(`lessons.${course.id}.summary`);
      const category = MathLab.text(`categories.${course.category}`);
      return `${title} ${summary} ${category}`.toLocaleLowerCase().includes(query);
    });
  }

  function moveCourse(id, direction) {
    const index = preferences.order.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= preferences.order.length) return;
    [preferences.order[index], preferences.order[target]] = [preferences.order[target], preferences.order[index]];
    save();
    render();
  }

  function createCourseRow(course) {
    const row = document.createElement("article");
    const isHidden = preferences.hiddenIds.includes(course.id);
    const index = preferences.order.indexOf(course.id);
    row.className = `course-row${isHidden ? " is-hidden" : ""}`;
    row.draggable = true;
    row.dataset.courseId = course.id;

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.textContent = "⠿";
    handle.setAttribute("aria-hidden", "true");
    handle.title = text("hint");

    const info = document.createElement("div");
    info.className = "course-info";
    const titleLine = document.createElement("div");
    titleLine.className = "course-title-line";
    const title = document.createElement("h2");
    title.className = "course-title";
    title.textContent = MathLab.text(`lessons.${course.id}.title`);
    const category = document.createElement("span");
    category.className = "course-category";
    category.textContent = MathLab.text(`categories.${course.category}`) || text("category");
    titleLine.append(title, category);
    const summary = document.createElement("p");
    summary.className = "course-summary";
    summary.textContent = MathLab.text(`lessons.${course.id}.summary`);
    info.append(titleLine, summary);

    const visibility = document.createElement("span");
    visibility.className = `course-visibility${isHidden ? " is-hidden" : ""}`;
    const dot = document.createElement("span");
    dot.className = "visibility-dot";
    dot.setAttribute("aria-hidden", "true");
    visibility.append(dot, document.createTextNode(isHidden ? text("hidden") : text("shown")));

    const actions = document.createElement("div");
    actions.className = "row-actions";
    const up = document.createElement("button");
    up.className = "icon-button";
    up.type = "button";
    up.textContent = "↑";
    up.title = text("up");
    up.setAttribute("aria-label", `${text("up")}: ${title.textContent}`);
    up.disabled = index === 0;
    up.addEventListener("click", () => moveCourse(course.id, -1));
    const down = document.createElement("button");
    down.className = "icon-button";
    down.type = "button";
    down.textContent = "↓";
    down.title = text("down");
    down.setAttribute("aria-label", `${text("down")}: ${title.textContent}`);
    down.disabled = index === preferences.order.length - 1;
    down.addEventListener("click", () => moveCourse(course.id, 1));
    const toggle = document.createElement("button");
    toggle.className = "visibility-button";
    toggle.type = "button";
    toggle.textContent = isHidden ? text("show") : text("hide");
    toggle.setAttribute("aria-pressed", String(!isHidden));
    toggle.addEventListener("click", () => {
      preferences.hiddenIds = isHidden
        ? preferences.hiddenIds.filter((hiddenId) => hiddenId !== course.id)
        : [...preferences.hiddenIds, course.id];
      save();
      render();
    });
    actions.append(up, down, toggle);
    row.append(handle, info, visibility, actions);

    row.addEventListener("dragstart", (event) => {
      draggedId = course.id;
      row.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", course.id);
    });
    row.addEventListener("dragend", () => {
      draggedId = null;
      row.classList.remove("is-dragging");
      list.querySelectorAll(".is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (draggedId && draggedId !== course.id) row.classList.add("is-drop-target");
    });
    row.addEventListener("dragleave", () => row.classList.remove("is-drop-target"));
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("is-drop-target");
      const sourceId = draggedId || event.dataTransfer.getData("text/plain");
      const sourceIndex = preferences.order.indexOf(sourceId);
      const targetIndex = preferences.order.indexOf(course.id);
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
      preferences.order.splice(sourceIndex, 1);
      preferences.order.splice(targetIndex, 0, sourceId);
      save();
      render();
    });
    return row;
  }

  function render() {
    if (!list) return;
    const courses = filteredCourses();
    const visibleCount = MathLabData.catalog.length - preferences.hiddenIds.length;
    document.querySelector("[data-visible-count]").textContent = visibleCount;
    document.querySelector("[data-hidden-count]").textContent = preferences.hiddenIds.length;
    list.replaceChildren(...courses.map(createCourseRow));
    empty.hidden = courses.length > 0;
    empty.textContent = text("empty");
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      render();
    });
  });
  search.addEventListener("input", render);
  document.querySelector("[data-reset]").addEventListener("click", () => {
    const defaults = MathLabCatalogPreferences.normalize();
    preferences.order = defaults.order;
    preferences.hiddenIds = defaults.hiddenIds;
    search.value = "";
    filter = "all";
    save(text("resetSaved"));
    render();
  });

  MathLab.bindLanguageToggle(applyCopy);
  document.addEventListener("DOMContentLoaded", applyCopy);
})();
