(function () {
  const app = document.querySelector("[data-pen-transfer-app]");
  if (!app || !window.MathLabModels || !window.MathLab) return;

  const stage = app.querySelector("[data-stage]");
  const board = app.querySelector("[data-board]");
  const progress = app.querySelector("[data-progress]");
  const pageCount = app.querySelector("[data-page-count]");
  const nextLabel = app.querySelector("[data-next-label]");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");
  const prevButton = app.querySelector("[data-action='prev']");

  const state = { ningPens: "30", qingPens: "15", multiple: "8" };
  let slideIndex = 0;

  const copies = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "钢笔搬家倍数问题",
      back: "返回课程目录",
      edit: "编辑题目",
      fullscreen: "全屏讲解",
      parameters: "题目参数",
      ningName: "小宁",
      qingName: "小青",
      pensUnit: "支",
      timesUnit: "倍",
      transferDirection: "小青给小宁",
      targetLead: "目标：",
      prev: "上一页",
      next: "下一页",
      replay: "重新播放",
      settingsTitle: "编辑钢笔搬家问题",
      settingsLead: "应用后会检查题目是否有符合方向的整支答案，并从第1页重新讲解。",
      ningLabel: "小宁原有钢笔",
      qingLabel: "小青原有钢笔",
      multipleLabel: "目标倍数",
      validityTitle: "有效题目需要满足",
      validityPositive: "三项都是正整数，目标倍数不小于2",
      validityWhole: "总数能平均分成“目标倍数＋1”份",
      validityDirection: "小青确实需要给出钢笔，而不是接收钢笔",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      pageCount: "第 {current} 页 / 共 {total} 页",
      currentQuestion: "本页问题",
      blackboard: "本页板书",
      initial: "搬动前",
      final: "搬动后",
      waiting: "等待接收",
      qingKeeps: "小青留下 {count} 支",
      transferUnknown: "送给小宁的部分",
      onePart: "1份",
      ningParts: "小宁：{count}份",
      qingParts: "小青：1份",
      compressedParts: "小宁共有 {count} 份",
      wholePens: "每份 {count} 支",
      answer: "答：小青给小宁 {count} 支钢笔。",
      invalidNing: "小宁原有支数必须是大于0的整数。",
      invalidQing: "小青原有支数必须是大于0的整数。",
      invalidMultiple: "目标倍数必须是不小于2的整数。",
      nonWholePart: "总数 {total} 支不能平均分成 {parts} 份，不能得到整支钢笔的答案。",
      noTransfer: "小青现在已经有最后1份的 {count} 支，不需要给出钢笔。请换一组需要正向转移的数。",
      wrongDirection: "这组数需要小宁给小青 {count} 支，方向与题目相反。",
      genericError: "请输入能按题目方向得到整支答案的数据。"
    },
    "en-US": {
      labName: "Elementary Math Interactive Classroom",
      title: "Moving Pens: A Multiples Problem",
      back: "Back to catalog",
      edit: "Edit problem",
      fullscreen: "Fullscreen",
      parameters: "Problem values",
      ningName: "Ning",
      qingName: "Qing",
      pensUnit: "pens",
      timesUnit: "times",
      transferDirection: "Qing gives pens to Ning",
      targetLead: "Target: ",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      settingsTitle: "Edit the pen-transfer problem",
      settingsLead: "The values are checked for a whole-number answer in the stated direction, then the lesson restarts at page 1.",
      ningLabel: "Ning starts with",
      qingLabel: "Qing starts with",
      multipleLabel: "Target multiple",
      validityTitle: "A valid problem must satisfy",
      validityPositive: "All three values are positive whole numbers, and the multiple is at least 2",
      validityWhole: "The total splits evenly into “target multiple + 1” parts",
      validityDirection: "Qing must give pens rather than receive pens",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      pageCount: "Page {current} of {total}",
      currentQuestion: "Question",
      blackboard: "Blackboard",
      initial: "Before the move",
      final: "After the move",
      waiting: "Ready to receive",
      qingKeeps: "Qing keeps {count} pens",
      transferUnknown: "The part given to Ning",
      onePart: "1 part",
      ningParts: "Ning: {count} parts",
      qingParts: "Qing: 1 part",
      compressedParts: "Ning has {count} parts in all",
      wholePens: "{count} pens in each part",
      answer: "Answer: Qing gives Ning {count} pens.",
      invalidNing: "Ning's starting count must be a whole number greater than 0.",
      invalidQing: "Qing's starting count must be a whole number greater than 0.",
      invalidMultiple: "The target multiple must be a whole number of at least 2.",
      nonWholePart: "The total of {total} pens cannot be split evenly into {parts} parts, so there is no whole-pen answer.",
      noTransfer: "Qing already has the final one-part amount of {count} pens, so no transfer is needed. Choose values that require a positive transfer.",
      wrongDirection: "These values require Ning to give Qing {count} pens, which reverses the problem's direction.",
      genericError: "Enter values that give a whole-number answer in the stated direction."
    }
  };

  function language() {
    return MathLab.getLanguage();
  }

  function copy(key, values = {}) {
    const template = copies[language()]?.[key] ?? copies["zh-CN"][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  }

  function tr(zh, en) {
    return language() === "zh-CN" ? zh : en;
  }

  function formatInteger(value) {
    try {
      return new Intl.NumberFormat(language()).format(value);
    } catch (error) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  function result(values = state) {
    return MathLabModels.quantity.penTransferState(values.ningPens, values.qingPens, values.multiple);
  }

  function renderPenCluster(count, compact = false, showCount = true) {
    const visibleCount = showCount ? (count <= 5n ? Number(count) : 4) : 3;
    const pens = Array.from({ length: visibleCount }, (_, index) => `<span class="pt-pen" style="--pen-index:${index}" aria-hidden="true"></span>`).join("");
    const badge = showCount && count > 5n ? `<strong class="pt-cluster-badge">×${formatInteger(count)}</strong>` : "";
    return `<span class="pt-pen-cluster ${compact ? "is-compact" : ""}" aria-hidden="true">${pens}${badge}</span>`;
  }

  function renderCase(owner, count, note = "") {
    const ownerName = copy(owner === "ning" ? "ningName" : "qingName");
    const ownerClass = owner === "ning" ? "is-ning" : "is-qing";
    return `<section class="pt-pencil-case ${ownerClass}" aria-label="${ownerName}: ${formatInteger(count)} ${copy("pensUnit")}">
      <div class="pt-case-label"><span>${ownerName}</span><strong>${formatInteger(count)} <small>${copy("pensUnit")}</small></strong></div>
      ${renderPenCluster(count)}
      ${note ? `<span class="pt-case-note">${note}</span>` : ""}
    </section>`;
  }

  function ratioPercent(value, total) {
    if (total <= 0n) return 0;
    return Number((value * 10000n) / total) / 100;
  }

  function renderPartCell(owner, onePart, revealValue, summary = "") {
    const ownerName = copy(owner === "ning" ? "ningName" : "qingName");
    const ownerClass = owner === "ning" ? "is-ning" : "is-qing";
    if (summary) {
      return `<div class="pt-part-cell ${ownerClass} is-summary" aria-label="${summary}"><strong>…</strong><span>${summary}</span></div>`;
    }
    return `<div class="pt-part-cell ${ownerClass}" aria-label="${ownerName}, ${revealValue ? copy("wholePens", { count: formatInteger(onePart) }) : copy("onePart")}">
      ${revealValue ? renderPenCluster(onePart, true) : `<span class="pt-part-mark">1</span>`}
      <strong>${revealValue ? `${formatInteger(onePart)} ${copy("pensUnit")}` : copy("onePart")}</strong>
    </div>`;
  }

  function renderParts(problem, revealValue) {
    const exact = problem.totalParts <= 12n;
    const cells = [];
    if (exact) {
      for (let index = 0; index < Number(problem.multiple); index += 1) {
        cells.push(renderPartCell("ning", problem.onePart, revealValue));
      }
    } else {
      for (let index = 0; index < 3; index += 1) cells.push(renderPartCell("ning", problem.onePart, revealValue));
      cells.push(renderPartCell("ning", problem.onePart, revealValue, copy("compressedParts", { count: formatInteger(problem.multiple) })));
    }
    cells.push(renderPartCell("qing", problem.onePart, revealValue));
    const columns = exact ? Math.min(Number(problem.totalParts), 9) : 5;
    const aria = tr(
      `最后小宁占${formatInteger(problem.multiple)}份，小青占1份，共${formatInteger(problem.totalParts)}份`,
      `At the end, Ning has ${formatInteger(problem.multiple)} parts and Qing has 1, for ${formatInteger(problem.totalParts)} parts in all`
    );
    return `<div class="pt-parts-scene" role="img" aria-label="${aria}">
      <div class="pt-parts-legend">
        <span class="is-ning">${copy("ningParts", { count: formatInteger(problem.multiple) })}</span>
        <span class="is-qing">${copy("qingParts")}</span>
      </div>
      <div class="pt-parts-grid" style="--part-columns:${columns}">${cells.join("")}</div>
    </div>`;
  }

  function buildSlides(problem) {
    const ning = formatInteger(problem.ningPens);
    const qing = formatInteger(problem.qingPens);
    const multiple = formatInteger(problem.multiple);
    const total = formatInteger(problem.total);
    const totalParts = formatInteger(problem.totalParts);
    const onePart = formatInteger(problem.onePart);
    const transfer = formatInteger(problem.transfer);
    const finalNing = formatInteger(problem.finalNing);
    const finalQing = formatInteger(problem.finalQing);
    return [
      {
        id: "direction",
        label: tr("读题", "Read"),
        title: tr("先看钢笔往哪儿搬", "First, follow the direction"),
        question: tr("钢笔从谁的文具盒移向谁的文具盒？", "Whose pencil case do the pens leave, and whose do they enter?"),
        lead: tr(`小青把一部分钢笔给小宁。小宁的数量会增加，小青的数量会减少。`, `Qing gives some pens to Ning. Ning's count increases while Qing's count decreases.`),
        formula: [`${copy("qingName")} → ${copy("ningName")}`, `${ning} ${copy("pensUnit")}　|　${qing} ${copy("pensUnit")}`]
      },
      {
        id: "total",
        label: tr("总数没变", "Same total"),
        title: tr("钢笔换了主人，总数没有变", "The pens change owners, not the total"),
        question: tr("两人一共有多少支钢笔？", "How many pens do they have altogether?"),
        lead: tr("没有钢笔被拿走，也没有增加新钢笔。把两人的钢笔合在一起数。", "No pens are removed and no new pens are added. Count both collections together."),
        formula: [`${ning} + ${qing} = <strong>${total}</strong>`, `${tr("总数", "Total")} = ${total} ${copy("pensUnit")}`]
      },
      {
        id: "parts",
        label: tr("看懂倍数", "See the multiple"),
        title: tr(`${multiple}倍要画成“${multiple}份和1份”`, `${multiple} times means “${multiple} parts and 1 part”`),
        question: tr(`小宁占${multiple}份，小青占1份，一共是多少份？`, `If Ning has ${multiple} parts and Qing has 1 part, how many parts are there altogether?`),
        lead: tr("比较的每一份必须同样多。小青是1份，小宁就有同样大小的多份。", "Every compared part must be the same size. Qing has one part, and Ning has several equal parts."),
        formula: [`${multiple} ${tr("份", "parts")} + 1 ${tr("份", "part")} = <strong>${totalParts} ${tr("份", "parts")}</strong>`]
      },
      {
        id: "one-part",
        label: tr("求1份", "Find one part"),
        title: tr("把总数平均放进所有份", "Share the total equally among the parts"),
        question: tr(`${total}支平均分成${totalParts}份，每份有多少支？`, `If ${total} pens are shared equally among ${totalParts} parts, how many pens are in each part?`),
        lead: tr(`最后小青只占1份，所以求出1份，也就知道小青最后有多少支。`, `Qing has exactly one part at the end, so finding one part gives Qing's final count.`),
        formula: [`${total} ÷ ${totalParts} = <strong>${onePart}</strong>`, `${copy("qingName")} ${tr("最后有", "ends with")} ${onePart} ${copy("pensUnit")}`]
      },
      {
        id: "move",
        label: tr("找搬走部分", "Find the moved part"),
        title: tr("小青留下1份，其余送给小宁", "Qing keeps one part and gives away the rest"),
        question: tr(`小青原有${qing}支，最后留下${onePart}支，送出了多少支？`, `Qing starts with ${qing} pens and keeps ${onePart}. How many pens are given away?`),
        lead: tr("先把留下的部分圈出来。原来的数量减去留下的数量，就是送给小宁的部分。", "Circle the part Qing keeps. Subtracting that from the starting count gives the part sent to Ning."),
        formula: [`${qing} − ${onePart} = <strong>?</strong>`, `${tr("送给小宁的部分", "Pens given to Ning")} = ?`]
      },
      {
        id: "answer",
        label: tr("验证", "Check"),
        title: tr("算出搬走的数量，再倒回去检查", "Calculate the move, then check it backwards"),
        question: tr("搬动后，小宁的数量真的是小青的目标倍数吗？", "After the move, does Ning really have the target multiple of Qing's pens?"),
        lead: tr("既要检查两人最后的数量，也要检查总数没有改变。两项都对，答案才成立。", "Check both final counts and confirm that the total is unchanged. The answer works only when both checks pass."),
        formula: [
          `${qing} − ${onePart} = <strong>${transfer}</strong>`,
          `${ning} + ${transfer} = ${finalNing}`,
          `${qing} − ${transfer} = ${finalQing}`,
          `${finalNing} ÷ ${finalQing} = <strong>${multiple}</strong>`
        ]
      }
    ];
  }

  function renderSlideHeader(slide, index, total) {
    return `<header class="pt-slide-head">
      <div><p class="pt-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div>
      <span class="pt-slide-number">${index + 1}/${total}</span>
    </header>`;
  }

  function renderStageBody(problem, slide) {
    if (slide.id === "direction") {
      return `<div class="pt-case-row">
        ${renderCase("ning", problem.ningPens)}
        <div class="pt-direction-arrow" aria-label="${copy("qingName")} ${tr("给", "gives to")} ${copy("ningName")}"><span>←</span><small>${copy("transferDirection")}</small></div>
        ${renderCase("qing", problem.qingPens)}
      </div>`;
    }
    if (slide.id === "total") {
      const ningWidth = ratioPercent(problem.ningPens, problem.total);
      const qingWidth = 100 - ningWidth;
      return `<div class="pt-total-scene" role="img" aria-label="${formatInteger(problem.ningPens)} + ${formatInteger(problem.qingPens)} = ${formatInteger(problem.total)}">
        <div class="pt-total-cases">${renderCase("ning", problem.ningPens)}${renderCase("qing", problem.qingPens)}</div>
        <div class="pt-combine-mark" aria-hidden="true">↓</div>
        <div class="pt-total-track">
          <span class="is-ning" style="width:${ningWidth}%">${formatInteger(problem.ningPens)}</span>
          <span class="is-qing" style="width:${qingWidth}%">${formatInteger(problem.qingPens)}</span>
        </div>
        <strong class="pt-total-badge">${formatInteger(problem.total)} ${copy("pensUnit")}</strong>
      </div>`;
    }
    if (slide.id === "parts") return renderParts(problem, false);
    if (slide.id === "one-part") return renderParts(problem, true);
    if (slide.id === "move") {
      return `<div class="pt-move-scene">
        <div class="pt-move-target">${renderCase("ning", problem.ningPens, copy("waiting"))}</div>
        <div class="pt-transfer-lane" aria-label="${copy("transferUnknown")}">
          <span class="pt-lane-arrow" aria-hidden="true">←</span>
          <div class="pt-transfer-packet">${renderPenCluster(problem.transfer, true, false)}<strong>? ${copy("pensUnit")}</strong></div>
          <small>${copy("transferUnknown")}</small>
        </div>
        <div class="pt-qing-source">
          ${renderCase("qing", problem.qingPens, copy("initial"))}
          <div class="pt-retained-part">${renderPenCluster(problem.onePart, true)}<strong>${copy("qingKeeps", { count: formatInteger(problem.onePart) })}</strong></div>
        </div>
      </div>`;
    }
    return `<div class="pt-final-scene">
      <div class="pt-final-cases">
        ${renderCase("ning", problem.finalNing, copy("final"))}
        ${renderCase("qing", problem.finalQing, copy("final"))}
      </div>
      <div class="pt-final-equation"><strong>${formatInteger(problem.finalNing)}</strong><span>=</span><strong>${formatInteger(problem.multiple)} × ${formatInteger(problem.finalQing)}</strong></div>
      <div class="pt-check-grid">
        <span>✓ ${tr("总数", "Total")}: ${formatInteger(problem.checkedTotal)} ${copy("pensUnit")}</span>
        <span>✓ ${tr("倍数", "Multiple")}: ${formatInteger(problem.checkedMultiple)} ${copy("timesUnit")}</span>
      </div>
      <div class="pt-answer-banner">${copy("answer", { count: formatInteger(problem.transfer) })}</div>
    </div>`;
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="pt-board-label">${copy("currentQuestion")}</p>
      <h2>${slide.question}</h2>
      <p class="pt-board-lead">${slide.lead}</p>
      <div class="pt-formula"><span class="pt-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="pt-formula-line">${line}</span>`).join("")}</div>`;
  }

  function renderStaticCopy(problem) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelector("[data-ning-summary]").textContent = formatInteger(problem.ningPens);
    app.querySelector("[data-qing-summary]").textContent = formatInteger(problem.qingPens);
    app.querySelector("[data-target-summary]").textContent = formatInteger(problem.multiple);
  }

  function renderProgress(slides) {
    progress.innerHTML = slides.map((slide, index) => `<button class="pt-progress-step ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" type="button" data-step="${index}" ${index === slideIndex ? 'aria-current="step"' : ""}>${index < slideIndex ? "✓ " : ""}${slide.label}</button>`).join("");
  }

  function renderControls(slides) {
    prevButton.disabled = slideIndex === 0;
    nextLabel.textContent = slideIndex === slides.length - 1 ? copy("replay") : copy("next");
    pageCount.textContent = copy("pageCount", { current: slideIndex + 1, total: slides.length });
  }

  function render() {
    const problem = result();
    if (!problem.valid) return;
    const slides = buildSlides(problem);
    slideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
    const slide = slides[slideIndex];
    renderStaticCopy(problem);
    renderProgress(slides);
    renderControls(slides);
    stage.innerHTML = `<article class="pt-slide">${renderSlideHeader(slide, slideIndex, slides.length)}${renderStageBody(problem, slide)}</article>`;
    renderBoard(slide);
  }

  function goNext() {
    const slides = buildSlides(result());
    slideIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
    render();
  }

  function goPrevious() {
    if (slideIndex === 0) return;
    slideIndex -= 1;
    render();
  }

  function openSettings() {
    app.querySelector("[data-setting='ningPens']").value = state.ningPens;
    app.querySelector("[data-setting='qingPens']").value = state.qingPens;
    app.querySelector("[data-setting='multiple']").value = state.multiple;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-ning") return copy("invalidNing");
    if (problem.reason === "invalid-qing") return copy("invalidQing");
    if (problem.reason === "invalid-multiple") return copy("invalidMultiple");
    if (problem.reason === "non-whole-part") {
      return copy("nonWholePart", { total: formatInteger(problem.total), parts: formatInteger(problem.totalParts) });
    }
    if (problem.reason === "no-transfer") return copy("noTransfer", { count: formatInteger(problem.onePart) });
    if (problem.reason === "wrong-direction") return copy("wrongDirection", { count: formatInteger(problem.neededFromNing) });
    return copy("genericError");
  }

  function applySettings() {
    const nextValues = {
      ningPens: app.querySelector("[data-setting='ningPens']").value.trim(),
      qingPens: app.querySelector("[data-setting='qingPens']").value.trim(),
      multiple: app.querySelector("[data-setting='multiple']").value.trim()
    };
    const problem = result(nextValues);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }
    state.ningPens = problem.ningPens.toString();
    state.qingPens = problem.qingPens.toString();
    state.multiple = problem.multiple.toString();
    slideIndex = 0;
    settingsDialog.close();
    render();
  }

  app.addEventListener("click", (event) => {
    const stepButton = event.target.closest("[data-step]");
    if (stepButton) {
      slideIndex = Number(stepButton.dataset.step);
      render();
      return;
    }
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "prev") goPrevious();
    if (action === "next") goNext();
    if (action === "edit") openSettings();
    if (action === "apply-settings") applySettings();
    if (action === "close-settings" || action === "cancel-settings") settingsDialog.close();
    if (action === "fullscreen") {
      const request = document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.();
      request?.catch?.(() => {});
    }
  });

  document.addEventListener("keydown", (event) => {
    if (settingsDialog.open || /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName || "")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      goNext();
    }
  });

  MathLab.bindLanguageToggle(render);
  render();
})();
