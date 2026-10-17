(function () {
  const app = document.querySelector("[data-trailing-zeros-app]");
  if (!app || !window.MathLab || !window.MathLabModels) return;

  const COPY = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "乘积末尾的0",
      edit: "修改题目",
      fullscreen: "全屏讲解",
      positiveNote: "星形图标表示正整数",
      problemPrefix: "积的末尾至少有",
      zeroUnit: "个0，最小是多少？",
      prev: "上一页",
      next: "下一页",
      replay: "重新开始",
      pageCount: "第 {current} 页 / 共 {total} 页",
      parameters: "题目参数",
      settingsTitle: "换一道题试一试",
      settingsLead: "应用后会从第1页开始，逐个锁定需要的0。",
      multiplicandLabel: "被乘数（1～1000）",
      targetZerosLabel: "目标0的个数（1～1000）",
      methodTitle: "页面会怎样重新讲解？",
      methodCopy: "每一轮只看正在处理的数的个位，找到最小的乘数，得到一个0后把它锁定。",
      cancel: "取消",
      apply: "应用并重新讲解",
      currentQuestion: "本页问题",
      blackboard: "板书",
      back: "返回课程目录",
      close: "关闭",
      unknown: "未知正整数",
      changeProblem: "修改题目，换一道试试",
      invalidMultiplicand: "请输入1～1000之间的正整数。",
      invalidTargetZeros: "目标0的个数必须是正整数。",
      tooManyTargetZeros: "课堂演示一次最多设置1000个0。"
    },
    "en-US": {
      labName: "Elementary math classroom",
      title: "Trailing Zeros in a Product",
      edit: "Change problem",
      fullscreen: "Present full screen",
      positiveNote: "The star stands for a positive whole number",
      problemPrefix: "Make the product end in at least",
      zeroUnit: "zeros. What is the smallest value?",
      prev: "Previous",
      next: "Next",
      replay: "Start over",
      pageCount: "Page {current} of {total}",
      parameters: "Problem values",
      settingsTitle: "Try a different problem",
      settingsLead: "Applying new values restarts at page 1 and locks the zeros one at a time.",
      multiplicandLabel: "Number being multiplied (1–1000)",
      targetZerosLabel: "Number of trailing zeros (1–1000)",
      methodTitle: "How will the explanation change?",
      methodCopy: "Each round looks only at the ones digit, finds the smallest multiplier, and locks one new zero.",
      cancel: "Cancel",
      apply: "Apply and restart",
      currentQuestion: "Question for this page",
      blackboard: "Working",
      back: "Back to catalog",
      close: "Close",
      unknown: "unknown positive whole number",
      changeProblem: "Change the problem",
      invalidMultiplicand: "Enter a positive whole number from 1 to 1000.",
      invalidTargetZeros: "The target number of zeros must be a positive whole number.",
      tooManyTargetZeros: "A classroom demonstration can show at most 1000 zeros at once."
    }
  };

  const state = { multiplicand: "45", targetZeros: "2" };
  let slideIndex = 0;

  const stage = app.querySelector("[data-stage]");
  const board = app.querySelector("[data-board]");
  const progress = app.querySelector("[data-progress]");
  const pageCount = app.querySelector("[data-page-count]");
  const prevButton = app.querySelector("[data-action='prev']");
  const nextLabel = app.querySelector("[data-next-label]");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");

  function language() {
    return MathLab.getLanguage();
  }

  function tr(zh, en) {
    return language() === "zh-CN" ? zh : en;
  }

  function copy(key, values = {}) {
    const template = COPY[language()][key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
  }

  function formatInteger(value) {
    return typeof value === "bigint" ? value.toString() : String(value);
  }

  function result() {
    return MathLabModels.quantity.trailingZerosState(state.multiplicand, state.targetZeros);
  }

  function starIcon(className = "", showQuestion = true) {
    return `<svg class="tz-star-icon ${className}" viewBox="0 0 64 64" role="img" aria-label="${copy("unknown")}">
      <path d="M32 5.5 39.9 22l18.1 2.6-13 12.8 3.1 18-16.1-8.5-16.1 8.5 3.1-18L6 24.6 24.1 22Z"></path>
      ${showQuestion ? '<text x="32" y="39">?</text>' : ""}
    </svg>`;
  }

  function renderNumberWithOnes(value) {
    const text = formatInteger(value);
    const prefix = text.slice(0, -1);
    const ones = text.slice(-1);
    return `<span class="tz-place-number">${prefix ? `<span>${prefix}</span>` : ""}<strong>${ones}</strong></span>`;
  }

  function highlightLastDigit(value, isSuccess) {
    const text = formatInteger(value);
    return `${text.slice(0, -1)}<strong class="${isSuccess ? "is-zero" : "is-last"}">${text.slice(-1)}</strong>`;
  }

  function highlightRequiredZeros(value, requiredZeros) {
    const text = formatInteger(value);
    const zeroCount = Math.min(requiredZeros, (text.match(/0+$/) || [""])[0].length);
    if (zeroCount === 0) return text;
    return `${text.slice(0, -zeroCount)}<strong class="tz-final-zeros">${text.slice(-zeroCount)}</strong>`;
  }

  function lockedTrack(locked, target) {
    const visibleSlots = Math.min(target, 8);
    const slots = Array.from({ length: visibleSlots }, (_, index) => {
      const completed = index < Math.min(locked, visibleSlots);
      return `<span class="tz-zero-slot ${completed ? "is-locked" : ""}">${completed ? "0" : "_"}</span>`;
    }).join("");
    const remaining = target - visibleSlots;
    return `<div class="tz-zero-track" role="img" aria-label="${tr(`已经锁定${locked}个0，目标${target}个`, `${locked} of ${target} zeros locked`)}">
      <span class="tz-zero-track-label">${tr("0锁定轨道", "Zero lock track")}</span>
      <div class="tz-zero-slots">${slots}${remaining > 0 ? `<span class="tz-more-zeros">+${remaining}</span>` : ""}</div>
      <strong>${locked}/${target}</strong>
    </div>`;
  }

  function patternSlides(problem) {
    const target = problem.targetZeros;
    return [
      {
        id: "small-pattern",
        type: "small-pattern",
        label: tr("观察乘5", "Multiply by 5"),
        title: tr("乘5时，积的末尾总是0吗？", "Does multiplying by 5 always make a trailing zero?"),
        question: tr("把1到10分别乘5，哪些结果的末尾是0？", "Multiply each number from 1 to 10 by 5. Which products end in zero?"),
        lead: tr("先同时看成功和不成功的例子，不能只挑出有0的算式。", "Look at both successes and counterexamples instead of selecting only products that end in zero."),
        formula: [tr("个位是偶数：积的末尾是0", "Even ones digit: the product ends in 0"), tr("个位是奇数：积的末尾是5", "Odd ones digit: the product ends in 5")]
      },
      {
        id: "large-pattern",
        type: "large-pattern",
        label: tr("搬到大数", "Larger numbers"),
        title: tr("数字变大，规律会改变吗？", "Does the pattern change for larger numbers?"),
        question: tr("12、22、32和10、20、30、40为什么乘5后都以0结尾？", "Why do 12, 22, 32 and 10, 20, 30, 40 all end in zero after multiplying by 5?"),
        lead: tr("这些数看起来不同，但个位只有2或0。再用个位是1的数作反例。", "The numbers look different, but their ones digits are only 2 or 0. Compare them with numbers ending in 1."),
        formula: [tr("只看另一个数的个位", "Look only at the other number's ones digit"), "0、2、4、6、8 × 5 → 0"]
      },
      {
        id: "why-ones",
        type: "why-ones",
        label: tr("为什么", "Why ones?"),
        title: tr("为什么判断末尾时只看个位？", "Why is the ones digit enough?"),
        question: tr("十位、百位上的数为什么不会改变积的个位？", "Why can the tens and hundreds places not change the product's ones digit?"),
        lead: tr("整十数乘完仍是整十数，末尾总有0；真正决定最后一位的是个位相乘。", "A multiple of ten stays a multiple of ten after multiplication, so only the ones digits decide the final digit."),
        formula: ["32 × 5 = 30 × 5 + 2 × 5", "150 + 10 = 160"]
      }
    ];
  }

  function actionCopy(round) {
    if (round.action === "existing-zero") {
      return {
        title: tr("这个0本来就有，直接锁定", "This zero is already there, so lock it"),
        lead: tr("不用再乘新的数。把末尾的0保留下来，继续看它前面的数。", "No new multiplication is needed. Keep the trailing zero and continue with the number in front of it.")
      };
    }
    if (round.action === "times-two") {
      return {
        title: tr("个位是5，先试1和2", "The ones digit is 5, so try 1 and 2"),
        lead: tr("乘1仍以5结尾；乘2第一次出现0，所以2是这一轮最小的选择。", "Times 1 still ends in 5. Times 2 is the first result ending in zero, so 2 is the smallest choice this round.")
      };
    }
    if (round.action === "times-five") {
      return {
        title: tr(`个位是${round.lastDigit}，从1试到5`, `The ones digit is ${round.lastDigit}, so try 1 through 5`),
        lead: tr("乘1、2、3、4都不能在末尾得到0，乘5第一次成功。", "Multiplying by 1, 2, 3, or 4 does not make a trailing zero. Times 5 is the first success.")
      };
    }
    return {
      title: tr(`个位是${round.lastDigit}，从1试到10`, `The ones digit is ${round.lastDigit}, so try 1 through 10`),
      lead: tr("乘1到9都不能在末尾得到0；乘10才第一次成功。", "None of 1 through 9 makes a trailing zero. Times 10 is the first success.")
    };
  }

  function roundSlide(problem, round) {
    const action = actionCopy(round);
    return {
      id: `round-${round.number}`,
      type: "round",
      round,
      label: tr(`第${round.number}个0`, `Zero ${round.number}`),
      title: action.title,
      question: tr(
        `正在看的数是${formatInteger(round.before)}，最少乘几才能得到第${round.number}个0？`,
        `The active number is ${formatInteger(round.before)}. What is the smallest multiplier that makes zero ${round.number}?`
      ),
      lead: action.lead,
      formula: round.action === "existing-zero"
        ? [tr(`${formatInteger(round.before)}的末尾已经有0`, `${formatInteger(round.before)} already ends in zero`), tr("乘数保持不变", "The multiplier does not change")]
        : [
            `${formatInteger(round.before)} × ${formatInteger(round.roundMultiplier)} = ${formatInteger(round.beforeLock)}`,
            tr(`锁定1个0，继续看${formatInteger(round.afterLock)}`, `Lock one zero; continue with ${formatInteger(round.afterLock)}`)
          ]
    };
  }

  function compactActionSummary(rounds) {
    const counts = new Map();
    rounds.forEach((round) => {
      const key = formatInteger(round.roundMultiplier);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()].map(([multiplier, count]) => tr(`乘${multiplier}：${count}次`, `times ${multiplier}: ${count} rounds`));
  }

  function buildSlides(problem) {
    const slides = patternSlides(problem);
    problem.rounds.slice(0, 12).forEach((round) => slides.push(roundSlide(problem, round)));

    if (problem.rounds.length > 12) {
      const repeatedRounds = problem.rounds.slice(12);
      slides.push({
        id: "repeated-rounds",
        type: "repeated-rounds",
        rounds: repeatedRounds,
        label: tr("继续锁定", "Keep locking"),
        title: tr(`后面还有${repeatedRounds.length}个0，用同样方法继续`, `${repeatedRounds.length} more zeros follow the same method`),
        question: tr("后面的每一轮分别要乘几？", "What is the smallest multiplier in each remaining round?"),
        lead: tr("页面把重复步骤合在一页显示，但计算没有省略。", "The page groups repeated rounds for readability, but none of the calculation is skipped."),
        formula: compactActionSummary(repeatedRounds)
      });
    }

    const actionExpression = problem.rounds.length <= 8
      ? problem.rounds.map((round) => formatInteger(round.roundMultiplier)).join(" × ")
      : compactActionSummary(problem.rounds).join("；");
    slides.push({
      id: "minimum",
      type: "minimum",
      label: tr("合起来", "Combine"),
      title: tr("每一轮都取第一次成功的数", "Each round uses the first successful multiplier"),
      question: tr("把每一轮的最小选择合起来，星形图标最小是多少？", "When the smallest choice from every round is combined, what is the star's smallest value?"),
      lead: tr("每一轮都从1开始试到第一次成功，没有跳过更小的选择。先在心里算，下一页再揭晓。", "Each round started at 1 and stopped at the first success. Work out the combined value before revealing it on the next page."),
      formula: [actionExpression ? `${actionExpression} = ?` : "1 = ?"]
    });
    slides.push({
      id: "answer",
      type: "answer",
      label: tr("验证", "Check"),
      title: tr("把答案乘回原题检查", "Multiply back to check the answer"),
      question: tr("积的末尾达到目标了吗？更小的选择都已经排除了吗？", "Does the product meet the target, and were all smaller choices ruled out?"),
      lead: tr("目标和最小性都确认后，答案才算完整。", "The answer is complete only after both the target and the minimum have been checked."),
      formula: [
        `${formatInteger(problem.multiplicand)} × ${formatInteger(problem.minimumMultiplier)} = ${formatInteger(problem.product)}`,
        tr(`末尾至少有${problem.targetZeros}个0`, `At least ${problem.targetZeros} trailing zeros`)
      ]
    });
    return slides;
  }

  function slideHeader(slide, index, total) {
    return `<header class="tz-slide-head">
      <div><p class="tz-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div>
      <span class="tz-slide-number">${index + 1}/${total}</span>
    </header>`;
  }

  function renderSmallPattern() {
    const cards = Array.from({ length: 10 }, (_, index) => {
      const value = index + 1;
      const product = value * 5;
      const success = product % 10 === 0;
      return `<div class="tz-example-card ${success ? "is-success" : "is-counter"}">
        <span class="tz-example-input">${renderNumberWithOnes(value)} × 5</span>
        <span aria-hidden="true">=</span>
        <strong>${highlightLastDigit(product, success)}</strong>
        <small>${success ? tr("末尾是0", "ends in 0") : tr("末尾是5", "ends in 5")}</small>
      </div>`;
    }).join("");
    return `<div class="tz-pattern-legend"><span class="is-success">${tr("个位为偶数", "Even ones digit")}</span><span class="is-counter">${tr("个位为奇数", "Odd ones digit")}</span></div>
      <div class="tz-example-grid">${cards}</div>`;
  }

  function renderLargePattern() {
    const groups = [
      { label: tr("个位是2", "Ones digit 2"), values: [12, 22, 32], success: true },
      { label: tr("个位是0", "Ones digit 0"), values: [10, 20, 30, 40], success: true },
      { label: tr("反例：个位是1", "Counterexamples: ones digit 1"), values: [11, 21, 31], success: false }
    ];
    return `<div class="tz-large-groups">${groups.map((group) => `<section class="tz-large-group ${group.success ? "is-success" : "is-counter"}">
      <h3>${group.label}</h3>
      <div>${group.values.map((value) => `<span class="tz-large-equation">${renderNumberWithOnes(value)} × 5 = ${highlightLastDigit(value * 5, group.success)}</span>`).join("")}</div>
    </section>`).join("")}</div>
    <p class="tz-stage-conclusion">${tr("共同点不在数字有多大，而在个位是什么。", "The shared feature is not the size of the number; it is the ones digit.")}</p>`;
  }

  function renderWhyOnes() {
    return `<div class="tz-split-number">
      <div class="tz-split-source">${renderNumberWithOnes(32)} × 5</div>
      <div class="tz-split-arrow" aria-hidden="true">→</div>
      <div class="tz-split-parts">
        <section><span>${tr("十位部分", "Tens part")}</span><strong>30 × 5 = 150</strong><small>${tr("整十数，不会改变个位", "A multiple of ten")}</small></section>
        <section class="is-ones"><span>${tr("个位部分", "Ones part")}</span><strong>2 × 5 = 10</strong><small>${tr("决定最后一位", "Decides the final digit")}</small></section>
      </div>
    </div>
    <div class="tz-compare-strip">
      <span>45 × 11 = 450 + 45 = <strong>495</strong></span>
      <span>45 × 12 = 450 + 90 = <strong class="is-zero">540</strong></span>
    </div>`;
  }

  function renderRound(problem, round) {
    const trials = round.trials.map((trial) => `<div class="tz-trial ${trial.succeeds ? "is-success" : ""}">
      <span>× ${formatInteger(trial.candidate)}</span>
      <strong>${highlightLastDigit(trial.result, trial.succeeds)}</strong>
      <small>${trial.succeeds ? tr("第一次成功", "first success") : tr("还没有0", "not zero yet")}</small>
    </div>`).join("");
    return `${lockedTrack(round.number - 1, problem.targetZeros)}
      <div class="tz-active-number"><span>${tr("正在看的数", "Active number")}</span>${renderNumberWithOnes(round.before)}</div>
      <div class="tz-trial-grid">${trials}</div>
      <div class="tz-lock-demo">
        <span>${formatInteger(round.beforeLock)}</span><span aria-hidden="true">→</span>
        <span class="tz-after-lock">${formatInteger(round.afterLock)}<strong>0</strong></span>
        <small>${tr(`锁定第${round.number}个0`, `lock zero ${round.number}`)}</small>
      </div>
      ${lockedTrack(round.number, problem.targetZeros)}`;
  }

  function renderRepeated(problem, rounds) {
    const summary = compactActionSummary(rounds);
    return `${lockedTrack(12, problem.targetZeros)}
      <div class="tz-repeat-panel">
        <span class="tz-repeat-count">${rounds.length}</span>
        <h3>${tr("轮计算合并展示", "rounds grouped for display")}</h3>
        <p>${tr("每一轮仍然先检查当前个位，再选择第一次能得到0的乘数。", "Every round still checks the active ones digit and chooses the first multiplier that makes zero.")}</p>
        <div class="tz-summary-chips">${summary.map((item) => `<span>${item}</span>`).join("")}</div>
      </div>
      ${lockedTrack(problem.targetZeros, problem.targetZeros)}`;
  }

  function renderMinimum(problem) {
    const visibleRounds = problem.rounds.slice(0, 12);
    const steps = visibleRounds.map((round) => `<div class="tz-chain-step">
      <span>${tr(`第${round.number}个0`, `Zero ${round.number}`)}</span>
      <strong>× ${formatInteger(round.roundMultiplier)}</strong>
    </div>`).join("");
    const remaining = problem.rounds.length - visibleRounds.length;
    return `${lockedTrack(problem.targetZeros, problem.targetZeros)}
      <div class="tz-chain">
        ${steps}
        ${remaining > 0 ? `<div class="tz-chain-step is-summary"><span>${tr("其余步骤", "Remaining")}</span><strong>+${remaining}</strong></div>` : ""}
      </div>
      <div class="tz-unknown-equation">${starIcon("is-large")}<span>=</span><strong>?</strong></div>
      <p class="tz-stage-conclusion">${tr("每一步都试完了更小的数，所以没有漏掉更小的选择。", "Every smaller trial was checked at each step, so no smaller choice was skipped.")}</p>`;
  }

  function renderAnswer(problem) {
    return `<div class="tz-answer-layout">
      <div class="tz-answer-star">${starIcon("is-answer", false)}<span>=</span><strong>${formatInteger(problem.minimumMultiplier)}</strong></div>
      <div class="tz-answer-product">
        <span>${formatInteger(problem.multiplicand)} × ${formatInteger(problem.minimumMultiplier)} =</span>
        <strong>${highlightRequiredZeros(problem.product, problem.targetZeros)}</strong>
      </div>
      ${lockedTrack(problem.targetZeros, problem.targetZeros)}
      <p>${tr(
        `星形图标表示的最小正整数是${formatInteger(problem.minimumMultiplier)}。`,
        `The smallest positive whole number represented by the star is ${formatInteger(problem.minimumMultiplier)}.`
      )}</p>
      <button class="tz-change-button" type="button" data-action="edit">${copy("changeProblem")}</button>
    </div>`;
  }

  function renderSlideBody(problem, slide) {
    if (slide.type === "small-pattern") return renderSmallPattern();
    if (slide.type === "large-pattern") return renderLargePattern();
    if (slide.type === "why-ones") return renderWhyOnes();
    if (slide.type === "round") return renderRound(problem, slide.round);
    if (slide.type === "repeated-rounds") return renderRepeated(problem, slide.rounds);
    if (slide.type === "minimum") return renderMinimum(problem);
    return renderAnswer(problem);
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="tz-board-label">${copy("currentQuestion")}</p>
      <h2>${slide.question}</h2>
      <p class="tz-board-lead">${slide.lead}</p>
      <div class="tz-formula"><span class="tz-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="tz-formula-line">${line}</span>`).join("")}</div>`;
  }

  function renderStaticCopy(problem) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelectorAll(".tz-star-icon").forEach((icon) => icon.setAttribute("aria-label", copy("unknown")));
    app.querySelector("[data-multiplicand-summary]").textContent = formatInteger(problem.multiplicand);
    app.querySelector("[data-target-summary]").textContent = String(problem.targetZeros);
  }

  function renderProgress(slides) {
    progress.innerHTML = slides.map((slide, index) => `<span class="tz-progress-step ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" ${index === slideIndex ? 'aria-current="step"' : ""}>${index < slideIndex ? "✓ " : ""}${slide.label}</span>`).join("");
    const currentStep = progress.querySelector(".is-current");
    if (currentStep) {
      progress.scrollLeft = Math.max(0, currentStep.offsetLeft - (progress.clientWidth - currentStep.clientWidth) / 2);
    }
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
    stage.innerHTML = `<article class="tz-slide">${slideHeader(slide, slideIndex, slides.length)}${renderSlideBody(problem, slide)}</article>`;
    renderBoard(slide);
    app.querySelectorAll(".tz-star-icon").forEach((icon) => icon.setAttribute("aria-label", copy("unknown")));
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
    app.querySelector("[data-setting='multiplicand']").value = state.multiplicand;
    app.querySelector("[data-setting='targetZeros']").value = state.targetZeros;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-multiplicand") return copy("invalidMultiplicand");
    if (problem.reason === "too-many-target-zeros") return copy("tooManyTargetZeros");
    return copy("invalidTargetZeros");
  }

  function applySettings() {
    const nextMultiplicand = app.querySelector("[data-setting='multiplicand']").value.trim();
    const nextTargetZeros = app.querySelector("[data-setting='targetZeros']").value.trim();
    const problem = MathLabModels.quantity.trailingZerosState(nextMultiplicand, nextTargetZeros);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }
    state.multiplicand = problem.multiplicand.toString();
    state.targetZeros = String(problem.targetZeros);
    slideIndex = 0;
    settingsDialog.close();
    render();
  }

  app.addEventListener("click", (event) => {
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
