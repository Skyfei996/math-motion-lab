(function () {
  const app = document.querySelector("[data-app]");
  const stage = app.querySelector("[data-stage]");
  const progress = app.querySelector("[data-progress]");
  const question = app.querySelector("[data-question]");
  const lead = app.querySelector("[data-lead]");
  const pageCount = app.querySelector("[data-page-count]");
  const previous = app.querySelector("[data-action='prev']");
  const nextLabel = app.querySelector("[data-next-label]");
  const dialog = document.querySelector("[data-settings-dialog]");

  const copy = {
    "zh-CN": {
      back: "返回目录", eyebrow: "数与规律", title: "奇数阶幻方的阶梯法", settings: "选择阶数", settingsTitle: "换一个奇数阶方格", orderLabel: "方格边长", settingsNote: "更换后会回到读题页，所有数字和验证会重新生成。", cancel: "取消", apply: "应用", previous: "上一步", next: "下一步", replay: "重新开始", currentQuestion: "本页问题", place: "放下下一个数", reset: "从 1 重新演示", nextCheck: "查看下一条线", complete: "填完了", lineNames: ["第 1 行", "第 2 行", "第 3 行", "第 4 行", "第 5 行", "第 6 行", "第 7 行", "第 1 列", "第 2 列", "第 3 列", "第 4 列", "第 5 列", "第 6 列", "第 7 列", "主对角线", "另一条对角线"],
      introQuestion: "这道题知道什么？要找什么？", introLead: "先读完整题目；这一页不急着讲方法。", sumQuestion: "每一条线的和应该是多少？", sumLead: "所有数字的总和会被平均分到 n 行。", ruleQuestion: "阶梯法的下一步怎样走？", ruleLead: "先记住三个规则，再让数字自己排队。", buildQuestion: "下一格该放在哪里？", buildLead: "每点一次，只发生一个清楚的填数动作。", verifyQuestion: "每一条线真的都一样吗？", verifyLead: "依次沿着一行、一列和两条对角线相加。", trackQuestion: "为什么每填满一组数，楼梯会换一条轨道？", trackLead: "右上走负责组内前进；目标被占时，向下走负责开启下一组。", rowsQuestion: "一行里的“组号”和“组内位置”为何恰好平衡？", rowsLead: "先看一行的两种标签和，再把它们还原成原来的数。", columnsQuestion: "一列也会得到同样的标签和吗？", columnsLead: "右上走和回环把同样的平衡带到每一列。", diagonalsQuestion: "对角线的标签不全相同，为什么和仍然一样？", diagonalsLead: "不需要每个标签都不同；关键是两种标签各自的总和。", reasonQuestion: "为什么阶梯法能保证横、竖、斜的和都相等？", reasonLead: "规律、三类线的检查和数的拆分，合起来就是原因。"
    },
    "en-US": {
      back: "Back to catalog", eyebrow: "Numbers and patterns", title: "Odd Magic Squares: Staircase Method", settings: "Choose order", settingsTitle: "Try another odd square", orderLabel: "Side length", settingsNote: "Changing the order returns to the problem page and rebuilds every number and check.", cancel: "Cancel", apply: "Apply", previous: "Previous", next: "Next", replay: "Start again", currentQuestion: "Question", place: "Place the next number", reset: "Restart at 1", nextCheck: "Check the next line", complete: "Complete", lineNames: ["Row 1", "Row 2", "Row 3", "Row 4", "Row 5", "Row 6", "Row 7", "Column 1", "Column 2", "Column 3", "Column 4", "Column 5", "Column 6", "Column 7", "Main diagonal", "Other diagonal"],
      introQuestion: "What is known, and what must be found?", introLead: "Read the full problem first. We will not start the method yet.", sumQuestion: "What should each line add to?", sumLead: "The sum of all the numbers is shared equally among n rows.", ruleQuestion: "Where does the next staircase step go?", ruleLead: "Remember three rules, then let the numbers line up.", buildQuestion: "Where should the next number go?", buildLead: "Each click makes just one clear filling action.", verifyQuestion: "Do all the lines really match?", verifyLead: "Add one row, one column, and the two diagonals in turn.", trackQuestion: "Why does the staircase change track after each group?", trackLead: "Up-right moves advance within a group; a blocked target drops to begin the next group.", rowsQuestion: "Why do group labels and within-group positions balance in a row?", rowsLead: "Read the two label sums in one row, then rebuild the original-number sum.", columnsQuestion: "Does a column have the same label balance?", columnsLead: "Up-right moves and wraparounds carry the same balance into every column.", diagonalsQuestion: "Why can a diagonal total correctly with repeated labels?", diagonalsLead: "Labels do not need to be all different; their two totals are what matter.", reasonQuestion: "Why does the staircase guarantee equal row, column, and diagonal sums?", reasonLead: "The path pattern, three kinds of line checks, and the number split form the reason."
    }
  };

  const state = { order: 3, slide: 0, placed: 0, lineIndex: 0, balanceIndex: { row: 0, column: 0, diagonal: 0 } };
  const slides = ["intro", "sum", "rules", "build", "verify", "track", "rows", "columns", "diagonals", "reason"];
  const language = () => MathLab.getLanguage();
  const t = (key) => copy[language()][key] ?? key;
  const model = () => MathLabModels.patterns.magicSquareState(state.order);
  const tr = (zh, en) => language() === "zh-CN" ? zh : en;

  function lineName(line, index) {
    if (line.type === "row") return tr(`第 ${index + 1} 行`, `Row ${index + 1}`);
    if (line.type === "column") return tr(`第 ${index + 1} 列`, `Column ${index + 1}`);
    return index === 0 ? tr("主对角线", "Main diagonal") : tr("另一条对角线", "Other diagonal");
  }

  function balanceLine(square, type) {
    const choices = square.lines.filter((line) => line.type === type);
    return choices[state.balanceIndex[type] % choices.length];
  }

  function point(move, order) {
    return { x: ((move.column + 0.5) * 100) / order, y: ((move.row + 0.5) * 100) / order };
  }

  function diagonalExit(from) {
    const distance = Math.min(100 - from.x, from.y);
    return { x: from.x + distance, y: from.y - distance };
  }

  function diagonalEntry(to) {
    const distance = Math.min(to.x, 100 - to.y);
    return { x: to.x - distance, y: to.y + distance };
  }

  function guideScale(order) {
    return {
      marker: Math.max(1.7, Math.min(5, 20 / order)),
      stroke: Math.max(0.65, Math.min(2.4, 7 / order)),
      text: Math.max(2.6, Math.min(5.5, 26 / order))
    };
  }

  function guideSvg(square, visible) {
    if (visible === square.order * square.order) return "";
    const scale = guideScale(square.order);
    const arrowOffset = Math.min(5, 20 / square.order);
    const edgeOffset = arrowOffset * 0.8;
    const entryOffset = arrowOffset * 0.6;
    const style = `style="--ms-guide-stroke:${scale.stroke};--ms-guide-text:${scale.text}px;--ms-guide-halo:${Math.max(0.8, scale.stroke)}"`;
    const marker = `<defs><marker id="ms-guide-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="${scale.marker}" markerHeight="${scale.marker}" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="ms-guide-gold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="${scale.marker}" markerHeight="${scale.marker}" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="ms-guide-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="${scale.marker}" markerHeight="${scale.marker}" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>`;
    if (visible === 0) {
      const startLabel = square.order < 9 ? `<text x="50" y="6">${tr("从顶部正中开始", "start at top middle")}</text>` : "";
      return `<svg class="ms-guide ms-guide-start" ${style} viewBox="0 0 100 100" aria-hidden="true">${marker}<rect x="${50 - 50 / square.order + 2}" y="2" width="${100 / square.order - 4}" height="${100 / square.order - 4}" rx="${Math.max(0.8, 8 / square.order)}" />${startLabel}</svg>`;
    }

    const source = square.moves[visible - 1];
    const target = square.moves[visible];
    const from = point(source, square.order);
    const to = point(target, square.order);
    const rule = source.nextRule;
    if (rule === "down") {
      const wrappedTarget = source.row === 0 || source.column === square.order - 1;
      if (wrappedTarget) {
        const exit = diagonalExit(from);
        return `<svg class="ms-guide ms-guide-wrap-blocked" ${style} viewBox="-12 -12 124 124" aria-hidden="true">${marker}<path class="ms-wrap-attempt" d="M ${from.x + edgeOffset} ${from.y - edgeOffset} L ${exit.x} ${exit.y}" marker-end="url(#ms-guide-gold)" /><path class="ms-down-move" d="M ${from.x} ${from.y + edgeOffset} V ${to.y - arrowOffset}" marker-end="url(#ms-guide-red)" /></svg>`;
      }
      const downLabel = square.order < 9 ? `<text x="${Math.min(94, from.x + 8)}" y="${(from.y + to.y) / 2}">${tr("右上格已填 → 向下", "up-right filled → down")}</text>` : "";
      return `<svg class="ms-guide ms-guide-down" ${style} viewBox="-12 -12 124 124" aria-hidden="true">${marker}<path d="M ${from.x} ${from.y + edgeOffset} V ${to.y - arrowOffset}" marker-end="url(#ms-guide-red)" />${downLabel}</svg>`;
    }
    if (rule === "stair") {
      const stairLabel = square.order < 9 ? `<text x="${(from.x + to.x) / 2 + 5}" y="${(from.y + to.y) / 2 - 5}">${tr("右上有空", "up-right")}</text>` : "";
      return `<svg class="ms-guide ms-guide-stair" ${style} viewBox="-12 -12 124 124" aria-hidden="true">${marker}<path d="M ${from.x + arrowOffset} ${from.y - arrowOffset} L ${to.x - arrowOffset} ${to.y + arrowOffset}" marker-end="url(#ms-guide-blue)" />${stairLabel}</svg>`;
    }

    const exitsTop = source.row === 0;
    const exitsRight = source.column === square.order - 1;
    const exit = diagonalExit(from);
    const entry = diagonalEntry(to);
    return `<svg class="ms-guide ms-guide-wrap" ${style} viewBox="-12 -12 124 124" aria-hidden="true">${marker}<path d="M ${from.x + edgeOffset} ${from.y - edgeOffset} L ${exit.x} ${exit.y}" marker-end="url(#ms-guide-gold)" /><path d="M ${entry.x} ${entry.y} L ${to.x - entryOffset} ${to.y + entryOffset}" marker-end="url(#ms-guide-gold)" /></svg>`;
  }

  function cellGrid(square, options = {}) {
    const visible = options.visible ?? square.order * square.order;
    const highlight = new Set((options.highlight || []).map(([row, column]) => `${row}-${column}`));
    const showLabels = options.showLabels || false;
    const labelsOnlyHighlighted = options.labelsOnlyHighlighted || false;
    const compactLabels = options.compactLabels || false;
    const currentMove = options.markCurrent ? square.moves[Math.max(0, visible - 1)] : null;
    const grid = square.cells.map((row, rowIndex) => row.map((value, columnIndex) => {
      const key = `${rowIndex}-${columnIndex}`;
      const show = value <= visible;
      const layer = Math.floor((value - 1) / square.order);
      const position = (value - 1) % square.order;
      const current = show && currentMove && currentMove.row === rowIndex && currentMove.column === columnIndex;
      const label = compactLabels ? `${layer}/${position}` : `${tr("组", "G")}${layer} · ${tr("位", "P")}${position}`;
      const shouldShowLabel = showLabels && show && (!labelsOnlyHighlighted || highlight.has(key));
      return `<div class="ms-cell ${show ? "is-filled" : ""} ${highlight.has(key) ? "is-highlighted" : ""} ${current ? "is-current" : ""}"><strong>${show ? value : ""}</strong>${shouldShowLabel ? `<small>${label}</small>` : ""}</div>`;
    }).join("")).join("");
    const guide = options.guide ? guideSvg(square, visible) : "";
    return `<div class="ms-grid-wrap ${options.compactGrid ? "is-compact" : ""} ${options.expandGrid ? "is-expanded" : ""} ${square.order >= 11 ? "is-dense" : ""} ${square.order >= 15 ? "is-extra-dense" : ""}"><div class="ms-grid" style="--order:${square.order}" aria-label="${square.order} by ${square.order} magic square">${grid}</div>${guide}</div>`;
  }

  function formula(text, tone = "") { return `<p class="ms-formula ${tone}">${text}</p>`; }

  function stageHtml(square, slide) {
    const n = square.order;
    if (slide === "intro") {
      return `<div class="ms-opening"><p class="ms-problem">把 <strong>1 到 ${n * n}</strong> 分别填入一个 <strong>${n} × ${n}</strong> 方格。要让每一行、每一列和两条对角线上的数相加，所得的和都相等。</p>${cellGrid(square, { visible: 0 })}<p class="ms-prompt">${tr("请你先说一说：知道什么？要找什么？", "Tell the class: What is known, and what must be found?")}</p></div>`;
    }
    if (slide === "sum") {
      const ribbonValues = n >= 17 ? [...Array.from({ length: n }, (_, index) => index + 1), "…", ...Array.from({ length: n }, (_, index) => n * n - n + index + 1)] : Array.from({ length: n * n }, (_, index) => index + 1);
      return `<div class="ms-sum-scene"><div class="ms-number-ribbon">${ribbonValues.map((value) => `<span>${value}</span>`).join("")}</div>${formula(`1 + 2 + … + ${n * n} = ${square.totalSum}`)}<div class="ms-arrow">↓</div>${formula(`${square.totalSum} ÷ ${n} = <strong>${square.magicSum}</strong>`, "is-gold")}<p class="ms-explain">${tr(`所以每一条线要凑成 ${square.magicSum}。这叫作这个 ${n} 阶幻方的“幻和”。`, `So every line must total ${square.magicSum}. This is the magic sum of the ${n}-order square.`)}</p></div>`;
    }
    if (slide === "rules") {
      return `<div class="ms-rule-scene">${cellGrid(square, { visible: 1 })}<ol class="ms-rules"><li><b>1</b><span>${tr("把 1 放在第一行正中。", "Put 1 in the middle of the top row.")}</span></li><li><b>2</b><span>${tr("下一个数向右上走一格；越出边界，就从另一边回来。", "Move the next number one square up-right; wrap around an edge.")}</span></li><li><b>3</b><span>${tr("如果目标格已经有数，就从当前格向下走一格。", "If that square is filled, move down one square from the current number.")}</span></li></ol></div>`;
    }
    if (slide === "build") {
      const last = square.moves[Math.max(0, state.placed - 1)];
      const nextRule = last?.nextRule;
      const crossesTop = last?.row === 0;
      const crossesRight = last?.column === n - 1;
      const wrapHint = crossesTop && crossesRight ? tr("越过右上角，回到左下格", "Cross the top-right corner and return at the bottom-left square") : crossesTop ? tr("越过上边，从下边回来", "Cross the top edge and return from the bottom") : tr("越过右边，从左边回来", "Cross the right edge and return from the left");
      const hint = state.placed === 0 ? tr("从 1 开始。", "Start with 1.") : state.placed === n * n ? tr("方阵已经填满。", "The square is full.") : nextRule === "down" && (crossesTop || crossesRight) ? tr(`${wrapHint}；但回到的格子已有数字，所以从当前数向下走一格。`, `${wrapHint}; but that returned square is filled, so move down from the current number.`) : nextRule === "down" ? tr("右上目标格已有数字：从当前数向下走一格。", "The up-right target is filled: move down one square.") : nextRule === "wrap" ? `${wrapHint}${tr("。", ".")}` : tr("向右上走一格。", "Move one square up-right.");
      return `<div class="ms-build-scene">${cellGrid(square, { visible: state.placed, markCurrent: true, guide: true })}<div class="ms-action-row"><p>${hint}</p><button type="button" class="ms-stage-button" data-stage-action="place" ${state.placed === n * n ? "disabled" : ""}>${t("place")} <span aria-hidden="true">↗</span></button><button type="button" class="ms-text-button" data-stage-action="reset-demo">${t("reset")}</button></div><p class="ms-placement-count">${state.placed} / ${n * n}</p></div>`;
    }
    if (slide === "verify") {
      const line = square.lines[state.lineIndex % square.lines.length];
      const lineFormula = n >= 11 ? `${tr("高亮线的数相加", "Highlighted line total")} = <strong>${line.sum}</strong>` : `${line.values.join(" + ")} = <strong>${line.sum}</strong>`;
      return `<div class="ms-verify-scene">${cellGrid(square, { highlight: line.coordinates, expandGrid: n >= 15 })}<div class="ms-check-strip"><span class="ms-check-name">${lineName(line, line.index)}</span>${formula(lineFormula, "is-green")}<button type="button" class="ms-stage-button" data-stage-action="next-line">${t("nextCheck")}</button></div></div>`;
    }
    if (slide === "track") {
      const firstGroup = Array.from({ length: n }, (_, index) => index + 1);
      const secondGroup = Array.from({ length: n }, (_, index) => n + index + 1);
      return `<div class="ms-track-scene"><div class="ms-track-board ${n >= 15 ? "is-wide" : ""}" style="--order:${n}"><p class="ms-track-kicker">${tr("把连续的数每", "Split consecutive numbers into groups of")} ${n} ${tr("个分成一组", "")}</p><div class="ms-track-row"><span class="ms-track-label">${tr("第 0 组", "Group 0")}</span>${firstGroup.map((value) => `<b>${value}</b>`).join("")}</div><div class="ms-track-drop">${tr(`第 ${n} 个数右上目标回到 1，已经被占 → 向下开新轨`, `After ${n}, the up-right target returns to filled 1 → drop to a new track`)}</div><div class="ms-track-row is-next"><span class="ms-track-label">${tr("第 1 组", "Group 1")}</span>${secondGroup.map((value) => `<b>${value}</b>`).join("")}</div></div><div class="ms-track-copy"><p>${tr("在一组里面，数字一直向右上前进。", "Within one group, numbers keep moving up-right.")}</p><p>${tr("每放完 n、2n、3n……，右上目标会碰到先前的数，于是从当前格向下走一格，开始下一组。", "After n, 2n, 3n, …, the up-right target meets an earlier number, so the path drops one square to begin the next group.")}</p><p>${tr("所以这不是随意拐弯：右上走是在组内走楼梯；向下走是在规律地换轨。", "So the turn is not random: up-right climbs within a group, while down changes track in a regular way.")}</p></div></div>`;
    }
    if (slide === "rows" || slide === "columns" || slide === "diagonals") {
      const type = slide === "rows" ? "row" : slide === "columns" ? "column" : "diagonal";
      const line = balanceLine(square, type);
      const labels = line.values.map((value) => ({ group: Math.floor((value - 1) / n), position: (value - 1) % n }));
      const title = type === "row" ? lineName(line, line.index) : type === "column" ? lineName(line, line.index) : lineName(line, line.index);
      const note = type === "row"
        ? tr("换一行时，标签的排列会变；但两种标签的总和不变。", "The label order changes from row to row, but both totals stay fixed.")
        : type === "column"
          ? tr("右上走和跨边回环，正好把同样的标签总和带到每一列。", "Up-right moves and edge wraparounds carry the same label totals into every column.")
          : tr("注意：这里的标签可以重复；我们只需要两种标签的总和固定。", "Notice: labels may repeat here; only the two label totals need to stay fixed.");
      const highOrder = n >= 9;
      const showGridLabels = n === 9;
      const labelHint = n === 9
        ? `<p class="ms-compact-label-note">${tr("高亮格里的 2/1 表示“组 2、位 1”。", "In a highlighted cell, 2/1 means group 2, position 1.")}</p>`
        : n >= 11
          ? `<p class="ms-compact-label-note">${tr("高阶方格较密，组号和位置在右侧算式中逐项显示。", "This higher-order grid is dense, so its group and position labels are listed in the equations here.")}</p>`
          : "";
      const originalSum = n >= 11 ? `${tr("高亮线的原数和", "Highlighted line total")} = <strong>${line.sum}</strong>` : `${line.values.join(" + ")} = <strong>${line.sum}</strong>`;
      return `<div class="ms-balance-scene">${cellGrid(square, { highlight: line.coordinates, showLabels: showGridLabels, labelsOnlyHighlighted: highOrder, compactLabels: highOrder, compactGrid: n === 9, expandGrid: n >= 15 })}<div class="ms-balance-copy"><span class="ms-check-name">${title}</span><p>${tr("把这条线的数拆成“组号”和“组内位置”：", "Split the numbers on this line into a group label and a within-group position:")}</p>${labelHint}${formula(`${tr("组号", "Groups")}: ${labels.map((item) => item.group).join(" + ")} = <strong>${line.layerSum}</strong>`, "is-green")}${formula(`${tr("组内位置", "Positions")}: ${labels.map((item) => item.position).join(" + ")} = <strong>${line.positionSum}</strong>`, "is-green")}${formula(originalSum)}<p class="ms-balance-note">${note}</p><button type="button" class="ms-stage-button" data-stage-action="next-balance-${type}">${tr("换一条同类线", "Check another of this kind")}</button></div></div>`;
    }
    return `<div class="ms-reason-scene">${cellGrid(square, { showLabels: n < 9, expandGrid: n >= 15 })}<div class="ms-reason-copy"><p>${tr("每个数都能写成：", "Every number can be written as:")}</p>${formula(`${n} × ${tr("组号", "group")} + ${tr("组内位置", "position")} + 1`)}<p>${tr(`前面已经看见：每一行、每一列和每条对角线的组号和、组内位置和，都是 ${square.targetPartSum}。`, `We have seen that every row, column, and diagonal has group-label and position-label totals of ${square.targetPartSum}.`)}</p>${formula(`${n} × ${square.targetPartSum} + ${square.targetPartSum} + ${n} = <strong>${square.magicSum}</strong>`, "is-gold")}<p>${tr("因此横、竖、斜三类线的原数和都相等。阶梯法用“组内右上走 + 组间向下换轨”，正好制造了这份平衡。", "Therefore the original-number totals match for rows, columns, and diagonals. The staircase creates this balance through up-right moves within groups and downward track changes between groups.")}</p></div></div>`;
  }

  function slideCopy(slide) { return { question: t(`${slide}Question`), lead: t(`${slide}Lead`) }; }

  function render() {
    const square = model();
    const slide = slides[state.slide];
    const content = slideCopy(slide);
    document.documentElement.lang = language();
    document.title = `${t("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    question.textContent = content.question;
    lead.textContent = content.lead;
    stage.innerHTML = stageHtml(square, slide);
    previous.disabled = state.slide === 0;
    nextLabel.textContent = state.slide === slides.length - 1 ? t("replay") : t("next");
    pageCount.textContent = `${state.slide + 1} / ${slides.length}`;
    progress.innerHTML = slides.map((item, index) => `<button type="button" class="ms-progress-dot ${index === state.slide ? "is-current" : ""} ${index < state.slide ? "is-complete" : ""}" data-action="jump" data-index="${index}" aria-label="${index + 1}/${slides.length}" ${index === state.slide ? 'aria-current="step"' : ""}>${index < state.slide ? "✓" : index + 1}</button>`).join("");
  }

  function goNext() { state.slide = state.slide === slides.length - 1 ? 0 : state.slide + 1; render(); }
  function goPrevious() { if (state.slide > 0) { state.slide -= 1; render(); } }

  document.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const action = actionNode.dataset.action;
      if (action === "next") goNext();
      if (action === "prev") goPrevious();
      if (action === "jump") { state.slide = Number(actionNode.dataset.index); render(); }
      if (action === "edit") { dialog.querySelector("[data-setting='order']").value = state.order; dialog.showModal(); }
      if (action === "close-settings" || action === "cancel-settings") dialog.close();
      if (action === "apply-settings") { state.order = Number(dialog.querySelector("[data-setting='order']").value); state.slide = 0; state.placed = 0; state.lineIndex = 0; state.balanceIndex = { row: 0, column: 0, diagonal: 0 }; dialog.close(); render(); }
      return;
    }
    const stageAction = event.target.closest("[data-stage-action]")?.dataset.stageAction;
    if (stageAction === "place") { state.placed = Math.min(model().order ** 2, state.placed + 1); render(); }
    if (stageAction === "reset-demo") { state.placed = 0; render(); }
    if (stageAction === "next-line") { state.lineIndex = (state.lineIndex + 1) % model().lines.length; render(); }
    if (stageAction === "next-balance-row") { state.balanceIndex.row += 1; render(); }
    if (stageAction === "next-balance-column") { state.balanceIndex.column += 1; render(); }
    if (stageAction === "next-balance-diagonal") { state.balanceIndex.diagonal += 1; render(); }
  });

  document.addEventListener("keydown", (event) => {
    if (dialog.open || /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName || "")) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); goPrevious(); }
    if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); goNext(); }
  });

  MathLab.bindLanguageToggle(render);
  render();
})();
