(function () {
  const app = document.querySelector("[data-notebook-promotion-app]");
  if (!app || !window.MathLabModels || !window.MathLab) return;

  const stage = app.querySelector("[data-stage]");
  const board = app.querySelector("[data-board]");
  const progress = app.querySelector("[data-progress]");
  const pageCount = app.querySelector("[data-page-count]");
  const nextLabel = app.querySelector("[data-next-label]");
  const prevButton = app.querySelector("[data-action='prev']");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");

  const state = { studentCount: "34", unitPrice: "6", buyCount: "5" };
  let slideIndex = 0;

  const copies = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "买5送1买笔记本",
      back: "返回课程目录",
      edit: "编辑题目",
      fullscreen: "全屏讲解",
      parameters: "题目参数",
      classmates: "同学",
      peopleUnit: "名",
      booksUnit: "本",
      yuanUnit: "元",
      yuanPerBook: "元/本",
      buyLead: "买",
      getOne: "送1",
      summaryTask: "求：最少付费本数和总价",
      prev: "上一页",
      next: "下一页",
      replay: "重新播放",
      settingsTitle: "编辑买赠问题",
      settingsLead: "应用后会重新计算，并从第1页重新讲解。",
      studentLabel: "需要笔记本的同学",
      priceLabel: "每本价格",
      buyCountLabel: "买满多少本送1本",
      validityTitle: "有效题目需要满足",
      validityWhole: "同学人数、价格和买满本数都是正整数",
      validityBuy: "买满本数至少是2本，每组固定赠送1本",
      validityRange: "同学人数不超过300，便于课堂清楚展示",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      pageCount: "第 {current} 页 / 共 {total} 页",
      currentQuestion: "本页问题",
      blackboard: "本页板书",
      paidShort: "付",
      freeShort: "赠",
      paidLegend: "付钱购买",
      freeLegend: "商店赠送",
      fullGroup: "完整促销组",
      remainderBooks: "剩下的本数",
      noRemainder: "没有剩余，正好分完",
      moreGroups: "另外 {count} 组",
      orderTitle: "班级采购单",
      promoTitle: "文具店促销",
      orderNeed: "每人1本，共需要 {count} 本",
      orderTask: "至少付钱买多少本？一共付多少元？",
      priceTag: "每本 {price} 元",
      promoTag: "买 {buy} 本，送 1 本",
      groupCaption: "付 {buy} 本的钱，拿到 {group} 本",
      completeCaption: "{groups} 个完整组",
      paidCountCaption: "完整组共付 {count} 本的钱",
      remainderCaption: "还差 {count} 本",
      directPaidCaption: "这 {count} 本也要付钱购买",
      extraGiftCaption: "买满 {count} 本，又会多送1本",
      receiptTitle: "文具店结账单",
      receiptPaid: "付费本数",
      receiptUnitPrice: "每本价格",
      receiptTotal: "应付合计",
      enough: "够用",
      notEnough: "少1本不够",
      finalAnswer: "答：至少付钱买 {paid} 本，一共需要 {cost} 元。",
      invalidStudent: "同学人数必须是1到300之间的整数。",
      invalidPrice: "每本价格必须是1到999之间的整数。",
      invalidBuy: "买满本数必须是2到10之间的整数。",
      genericError: "请输入符合范围的整数。"
    },
    "en-US": {
      labName: "Elementary Math Interactive Classroom",
      title: "Buy 5, Get 1 Notebook Deal",
      back: "Back to catalog",
      edit: "Edit problem",
      fullscreen: "Fullscreen",
      parameters: "Problem values",
      classmates: "Students",
      peopleUnit: "students",
      booksUnit: "notebooks",
      yuanUnit: "yuan",
      yuanPerBook: "yuan each",
      buyLead: "Buy ",
      getOne: ", get 1",
      summaryTask: "Find: least paid count and total cost",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      settingsTitle: "Edit the notebook deal",
      settingsLead: "The lesson recalculates and restarts at page 1.",
      studentLabel: "Students needing notebooks",
      priceLabel: "Price per notebook",
      buyCountLabel: "Paid notebooks needed for 1 free",
      validityTitle: "Valid values",
      validityWhole: "Students, price, and paid group size are positive whole numbers",
      validityBuy: "The paid group size is at least 2, with 1 free notebook per group",
      validityRange: "No more than 300 students so the classroom view stays clear",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      pageCount: "Page {current} of {total}",
      currentQuestion: "Question",
      blackboard: "Board work",
      paidShort: "PAY",
      freeShort: "FREE",
      paidLegend: "Paid notebook",
      freeLegend: "Free notebook",
      fullGroup: "Complete deal group",
      remainderBooks: "Notebooks left over",
      noRemainder: "No remainder — the groups are exact",
      moreGroups: "{count} more groups",
      orderTitle: "Class order",
      promoTitle: "Store deal",
      orderNeed: "One each, so {count} notebooks are needed",
      orderTask: "How many must be paid for, and what is the total cost?",
      priceTag: "{price} yuan each",
      promoTag: "Buy {buy}, get 1 free",
      groupCaption: "Pay for {buy} and receive {group}",
      completeCaption: "{groups} complete groups",
      paidCountCaption: "Pay for {count} notebooks in the complete groups",
      remainderCaption: "{count} notebooks still needed",
      directPaidCaption: "These {count} notebooks must also be paid for",
      extraGiftCaption: "Paying for {count} triggers one more free notebook",
      receiptTitle: "Store receipt",
      receiptPaid: "Paid notebooks",
      receiptUnitPrice: "Price each",
      receiptTotal: "Total due",
      enough: "Enough",
      notEnough: "One fewer is not enough",
      finalAnswer: "Answer: Pay for at least {paid} notebooks. The total cost is {cost} yuan.",
      invalidStudent: "The student count must be a whole number from 1 to 300.",
      invalidPrice: "The price must be a whole number from 1 to 999.",
      invalidBuy: "The paid group size must be a whole number from 2 to 10.",
      genericError: "Enter whole numbers within the allowed ranges."
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
    return new Intl.NumberFormat(language()).format(value);
  }

  function result(values = state) {
    return MathLabModels.quantity.notebookPromotionState(values.studentCount, values.unitPrice, values.buyCount);
  }

  function buildFullProblem(problem) {
    return tr(
      `生活委员给${problem.studentCount}名同学每人买1本笔记本。商店每本${problem.unitPrice}元，买${problem.buyCount}本送1本。至少需要付钱买多少本？一共需要多少钱？`,
      `A class monitor needs one notebook for each of ${problem.studentCount} students. Each notebook costs ${problem.unitPrice} yuan, and the store gives 1 free notebook for every ${problem.buyCount} paid notebooks. What is the least number to pay for, and what is the total cost?`
    );
  }

  function buildSlides(problem) {
    const paidRemainder = problem.paidCount % problem.buyCount;
    const leftoverQuestion = problem.remainder === 0
      ? tr("已经正好分完，还需要另外购买吗？", "The groups are exact. Do we need to buy any more?")
      : problem.remainder === problem.buyCount
        ? tr(`余下${problem.remainder}本买下来，还会发生什么？`, `What else happens when we pay for the last ${problem.remainder} notebooks?`)
        : tr(`余下${problem.remainder}本，要付几本的钱？`, `How many of the last ${problem.remainder} notebooks must be paid for?`);
    const leftoverLead = problem.remainder === 0
      ? tr("没有余数，不需要再补买。", "There is no remainder, so no extra paid notebooks are needed.")
      : problem.remainder === problem.buyCount
        ? tr(`余下${problem.remainder}本都要付钱；它们又凑满一次“买${problem.buyCount}送1”，所以最后会多拿1本。`, `Pay for all ${problem.remainder}. They trigger one more “buy ${problem.buyCount}, get 1” deal, so one extra notebook is received.`)
        : tr(`余下${problem.remainder}本还没有达到下一次赠送条件，所以这${problem.remainder}本都要付钱。`, `The last ${problem.remainder} do not reach another free-notebook threshold, so all ${problem.remainder} must be paid for.`);

    return [
      {
        id: "intro",
        label: tr("读题", "Read"),
        title: tr("先弄清知道什么、要找什么", "Identify what is known and what must be found"),
        question: tr("题目告诉了我们什么，要求什么？", "What information is given, and what are we finding?"),
        lead: tr("先完整读题，不急着计算。", "Read the whole problem before choosing an operation."),
        formula: [
          tr(`需要：${problem.studentCount}本`, `Need: ${problem.studentCount} notebooks`),
          tr(`价格：每本${problem.unitPrice}元`, `Price: ${problem.unitPrice} yuan each`),
          tr(`活动：买${problem.buyCount}送1`, `Deal: buy ${problem.buyCount}, get 1`),
          tr("求：最少付费本数、总价", "Find: least paid count and total cost")
        ]
      },
      {
        id: "promo",
        label: tr("认促销", "Deal"),
        title: tr("把买赠活动看成一组", "Build one complete deal group"),
        question: tr(`付${problem.buyCount}本的钱，实际能拿到几本？`, `If we pay for ${problem.buyCount}, how many notebooks do we receive?`),
        lead: tr("付费本和赠品放进同一个托盘，一组的总数就看清了。", "Put the paid notebooks and the free notebook in one tray to see the full group."),
        formula: [tr(`${problem.buyCount}+1=${problem.groupSize}（本）`, `${problem.buyCount}+1=${problem.groupSize} notebooks`)]
      },
      {
        id: "group",
        label: tr("分组", "Group"),
        title: tr(`把${problem.studentCount}本按每组${problem.groupSize}本来分`, `Group ${problem.studentCount} notebooks in sets of ${problem.groupSize}`),
        question: tr("能分成几个完整组，还剩几本？", "How many complete groups are there, and how many remain?"),
        lead: tr("除数是一组实际拿到的本数，不是付费本数。", "The divisor is the number received in one complete group, not just the paid count."),
        formula: [tr(
          `${problem.studentCount}÷${problem.groupSize}=${problem.fullGroups}（组）……${problem.remainder}（本）`,
          `${problem.studentCount}÷${problem.groupSize}=${problem.fullGroups} remainder ${problem.remainder}`
        )]
      },
      {
        id: "complete",
        label: tr("算整组", "Full groups"),
        title: tr("完整促销组只付其中一部分", "Pay only for the paid notebooks in each complete group"),
        question: tr(`${problem.fullGroups}个完整组，要付多少本的钱？`, `How many notebooks are paid for in ${problem.fullGroups} complete groups?`),
        lead: tr(`每组只付${problem.buyCount}本的钱，赠品不收费。`, `Each group has ${problem.buyCount} paid notebooks; the free notebook costs nothing.`),
        formula: [tr(
          `${problem.fullGroups}×${problem.buyCount}=${problem.completeGroupPaid}（本）`,
          `${problem.fullGroups}×${problem.buyCount}=${problem.completeGroupPaid} paid notebooks`
        )]
      },
      {
        id: "remainder",
        label: tr("处理余数", "Remainder"),
        title: tr("再处理没有装进完整组的本数", "Now handle the notebooks outside the complete groups"),
        question: leftoverQuestion,
        lead: leftoverLead,
        formula: [tr(
          `${problem.completeGroupPaid}+${problem.remainder}=${problem.paidCount}（本）`,
          `${problem.completeGroupPaid}+${problem.remainder}=${problem.paidCount} paid notebooks`
        )]
      },
      {
        id: "cost",
        label: tr("算总价", "Cost"),
        title: tr("只给付费的笔记本算价钱", "Charge only for the paid notebooks"),
        question: tr(`付${problem.paidCount}本的钱，每本${problem.unitPrice}元，共多少钱？`, `If ${problem.paidCount} notebooks are paid for at ${problem.unitPrice} yuan each, what is the cost?`),
        lead: tr("赠送的笔记本不进入乘法算式。", "The free notebooks are not included in the multiplication."),
        formula: [tr(
          `${problem.paidCount}×${problem.unitPrice}=${problem.totalCost}（元）`,
          `${problem.paidCount}×${problem.unitPrice}=${problem.totalCost} yuan`
        )]
      },
      {
        id: "verify",
        label: tr("验算", "Verify"),
        title: tr("够用，还不能再少买1本", "It is enough, and one fewer would fail"),
        question: tr(`为什么付${problem.paidCount}本的钱就够，而且这是最少的？`, `Why is paying for ${problem.paidCount} enough, and why is it the least?`),
        lead: tr(
          problem.extraCount === 0
            ? `付费${problem.paidCount}本得到${problem.giftCount}本赠品，正好${problem.receivedCount}本；少付1本只能得到${problem.previousReceivedCount}本。`
            : `付费${problem.paidCount}本得到${problem.giftCount}本赠品，共${problem.receivedCount}本，多${problem.extraCount}本；少付1本只有${problem.previousReceivedCount}本，仍不够。`,
          problem.extraCount === 0
            ? `Paying for ${problem.paidCount} earns ${problem.giftCount} free notebooks, making exactly ${problem.receivedCount}. Paying for one fewer gives only ${problem.previousReceivedCount}.`
            : `Paying for ${problem.paidCount} earns ${problem.giftCount} free notebooks, making ${problem.receivedCount}, which is ${problem.extraCount} extra. Paying for one fewer gives only ${problem.previousReceivedCount}.`
        ),
        formula: [
          tr(`${problem.paidCount}÷${problem.buyCount}=${problem.giftCount}（组）……${paidRemainder}（本）`, `${problem.paidCount}÷${problem.buyCount}=${problem.giftCount} remainder ${paidRemainder}`),
          `${problem.paidCount}+${problem.giftCount}=${problem.receivedCount}`,
          `${problem.previousPaidCount}+${problem.previousGiftCount}=${problem.previousReceivedCount}<${problem.studentCount}`
        ],
        answer: copy("finalAnswer", { paid: problem.paidCount, cost: problem.totalCost })
      }
    ];
  }

  function renderNotebook(type) {
    const isFree = type === "free";
    return `<span class="np-notebook ${isFree ? "is-free" : "is-paid"}" aria-hidden="true"><span>${copy(isFree ? "freeShort" : "paidShort")}</span></span>`;
  }

  function renderNotebookRow(count, type = "paid", compact = false) {
    if (count <= 0) return "";
    return `<span class="np-notebook-row ${compact ? "is-compact" : ""}" style="--notebook-count:${Math.min(count, 11)}">${Array.from({ length: count }, () => renderNotebook(type)).join("")}</span>`;
  }

  function renderPromoGroup(problem, index = 0, emphasized = false) {
    return `<section class="np-deal-tray ${emphasized ? "is-emphasized" : ""}" aria-label="${copy("groupCaption", { buy: problem.buyCount, group: problem.groupSize })}">
      <span class="np-tray-number">${index > 0 ? index : copy("fullGroup")}</span>
      <div class="np-tray-books">${renderNotebookRow(problem.buyCount, "paid", true)}${renderNotebookRow(1, "free", true)}</div>
    </section>`;
  }

  function renderLegend() {
    return `<div class="np-legend"><span><i class="is-paid"></i>${copy("paidLegend")}</span><span><i class="is-free"></i>${copy("freeLegend")}</span></div>`;
  }

  function renderVisibleGroups(problem, emphasized = false) {
    if (problem.fullGroups === 0) {
      return `<div class="np-empty-groups">${tr("还没有完整促销组", "No complete deal groups yet")}</div>`;
    }
    const visible = Math.min(problem.fullGroups, 5);
    const groups = Array.from({ length: visible }, (_, index) => renderPromoGroup(problem, index + 1, emphasized)).join("");
    const hiddenCount = problem.fullGroups - visible;
    return `<div class="np-groups-grid">${groups}${hiddenCount > 0 ? `<div class="np-more-groups">+ ${copy("moreGroups", { count: hiddenCount })}</div>` : ""}</div>`;
  }

  function renderSlideHeader(slide, index, total) {
    return `<header class="np-slide-header">
      <div><p class="np-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div>
      <span class="np-slide-count">${index + 1} / ${total}</span>
    </header>`;
  }

  function renderIntro(problem) {
    return `<div class="np-intro-scene">
      <section class="np-order-note">
        <span class="np-paper-clip" aria-hidden="true"></span>
        <p class="np-note-label">${copy("orderTitle")}</p>
        <p class="np-full-problem">${buildFullProblem(problem)}</p>
        <div class="np-order-lines">
          <span>${copy("orderNeed", { count: problem.studentCount })}</span>
          <strong>${copy("orderTask")}</strong>
        </div>
      </section>
      <section class="np-shop-sign" aria-label="${copy("promoTitle")}">
        <p>${copy("promoTitle")}</p>
        <strong>${copy("promoTag", { buy: problem.buyCount })}</strong>
        <span>${copy("priceTag", { price: problem.unitPrice })}</span>
      </section>
    </div>`;
  }

  function renderPromo(problem) {
    return `<div class="np-promo-scene">
      ${renderPromoGroup(problem, 0, true)}
      <div class="np-promo-equation"><span>${problem.buyCount}</span><b>+</b><span class="is-free">1</span><b>=</b><strong>${problem.groupSize}</strong><small>${copy("booksUnit")}</small></div>
      ${renderLegend()}
    </div>`;
  }

  function renderGrouping(problem) {
    return `<div class="np-grouping-scene">
      <section class="np-group-zone"><p>${copy("completeCaption", { groups: problem.fullGroups })}</p>${renderVisibleGroups(problem)}</section>
      <section class="np-remainder-zone ${problem.remainder === 0 ? "is-empty" : ""}">
        <p>${copy("remainderBooks")}</p>
        ${problem.remainder === 0 ? `<strong>${copy("noRemainder")}</strong>` : `<div>${renderNotebookRow(problem.remainder, "paid")}</div><strong>${problem.remainder} ${copy("booksUnit")}</strong>`}
      </section>
      ${renderLegend()}
    </div>`;
  }

  function renderComplete(problem) {
    return `<div class="np-complete-scene">
      ${renderVisibleGroups(problem, true)}
      <div class="np-tally-strip"><span>${copy("completeCaption", { groups: problem.fullGroups })}</span><strong>${copy("paidCountCaption", { count: problem.completeGroupPaid })}</strong></div>
      ${renderLegend()}
    </div>`;
  }

  function renderRemainder(problem) {
    const remainderContent = problem.remainder === 0
      ? `<div class="np-zero-remainder"><strong>0</strong><span>${copy("noRemainder")}</span></div>`
      : `<div class="np-remainder-pile">${renderNotebookRow(problem.remainder, "paid")}<strong>${copy("remainderCaption", { count: problem.remainder })}</strong></div>`;
    const note = problem.remainder === problem.buyCount
      ? copy("extraGiftCaption", { count: problem.remainder })
      : problem.remainder === 0
        ? copy("noRemainder")
        : copy("directPaidCaption", { count: problem.remainder });
    return `<div class="np-remainder-scene">
      <section class="np-paid-stack"><span>${copy("paidCountCaption", { count: problem.completeGroupPaid })}</span><strong>${problem.completeGroupPaid}</strong></section>
      <span class="np-plus-sign" aria-hidden="true">+</span>
      ${remainderContent}
      <span class="np-equals-sign" aria-hidden="true">=</span>
      <section class="np-paid-total"><span>${tr("最少付费本数", "Least paid count")}</span><strong>${problem.paidCount}</strong><small>${copy("booksUnit")}</small></section>
      <p class="np-remainder-note">${note}</p>
    </div>`;
  }

  function renderCost(problem) {
    return `<div class="np-receipt-scene">
      <section class="np-receipt">
        <span class="np-receipt-tear" aria-hidden="true"></span>
        <p class="np-note-label">${copy("receiptTitle")}</p>
        <dl>
          <div><dt>${copy("receiptPaid")}</dt><dd>${problem.paidCount} ${copy("booksUnit")}</dd></div>
          <div><dt>${copy("receiptUnitPrice")}</dt><dd>${problem.unitPrice} ${copy("yuanUnit")}</dd></div>
          <div class="is-total"><dt>${copy("receiptTotal")}</dt><dd>${problem.totalCost} ${copy("yuanUnit")}</dd></div>
        </dl>
      </section>
      <div class="np-cost-equation"><span>${problem.paidCount}</span><b>×</b><span>${problem.unitPrice}</span><b>=</b><strong>${problem.totalCost}</strong><small>${copy("yuanUnit")}</small></div>
    </div>`;
  }

  function renderVerify(problem) {
    const exactText = problem.extraCount === 0
      ? tr(`正好${problem.receivedCount}本`, `Exactly ${problem.receivedCount}`)
      : tr(`${problem.receivedCount}本，多${problem.extraCount}本`, `${problem.receivedCount}, ${problem.extraCount} extra`);
    return `<div class="np-verify-scene">
      <section class="np-check-row is-success">
        <span class="np-check-mark" aria-hidden="true">✓</span>
        <div><p>${problem.paidCount} ${copy("booksUnit")} + ${problem.giftCount} ${tr("本赠品", "free")}</p><strong>${exactText}</strong></div>
        <span>${copy("enough")}</span>
      </section>
      <section class="np-check-row is-fail">
        <span class="np-check-mark" aria-hidden="true">×</span>
        <div><p>${problem.previousPaidCount} ${copy("booksUnit")} + ${problem.previousGiftCount} ${tr("本赠品", "free")}</p><strong>${problem.previousReceivedCount} &lt; ${problem.studentCount}</strong></div>
        <span>${copy("notEnough")}</span>
      </section>
      <p class="np-final-answer">${copy("finalAnswer", { paid: problem.paidCount, cost: problem.totalCost })}</p>
    </div>`;
  }

  function renderStageBody(problem, slide) {
    if (slide.id === "intro") return renderIntro(problem);
    if (slide.id === "promo") return renderPromo(problem);
    if (slide.id === "group") return renderGrouping(problem);
    if (slide.id === "complete") return renderComplete(problem);
    if (slide.id === "remainder") return renderRemainder(problem);
    if (slide.id === "cost") return renderCost(problem);
    return renderVerify(problem);
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="np-board-label">${copy("currentQuestion")}</p>
      <h2>${slide.question}</h2>
      <p class="np-board-lead">${slide.lead}</p>
      <div class="np-formula"><span class="np-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="np-formula-line">${line}</span>`).join("")}</div>
      ${slide.answer ? `<p class="np-board-answer">${slide.answer}</p>` : ""}`;
  }

  function renderStaticCopy(problem) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelector("[data-student-summary]").textContent = formatInteger(problem.studentCount);
    app.querySelector("[data-price-summary]").textContent = formatInteger(problem.unitPrice);
    app.querySelector("[data-buy-summary]").textContent = formatInteger(problem.buyCount);
  }

  function renderProgress(slides) {
    progress.style.setProperty("--step-count", slides.length);
    progress.innerHTML = slides.map((slide, index) => `<button class="np-progress-step ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" type="button" data-step="${index}" ${index === slideIndex ? 'aria-current="step"' : ""}>${index < slideIndex ? "✓ " : ""}${slide.label}</button>`).join("");
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
    stage.innerHTML = `<article class="np-slide">${renderSlideHeader(slide, slideIndex, slides.length)}<div class="np-stage-canvas">${renderStageBody(problem, slide)}</div></article>`;
    renderBoard(slide);
  }

  function alignStageOnNarrowScreen() {
    if (!window.matchMedia("(max-width: 820px)").matches) return;
    const stageTop = stage.getBoundingClientRect().top + window.scrollY - 8;
    window.scrollTo({ top: Math.max(0, stageTop), behavior: "auto" });
  }

  function goNext() {
    const slides = buildSlides(result());
    slideIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
    render();
    alignStageOnNarrowScreen();
  }

  function goPrevious() {
    if (slideIndex === 0) return;
    slideIndex -= 1;
    render();
    alignStageOnNarrowScreen();
  }

  function openSettings() {
    app.querySelector("[data-setting='studentCount']").value = state.studentCount;
    app.querySelector("[data-setting='unitPrice']").value = state.unitPrice;
    app.querySelector("[data-setting='buyCount']").value = state.buyCount;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function validateSettings(values) {
    const studentCount = Number(values.studentCount);
    const unitPrice = Number(values.unitPrice);
    const buyCount = Number(values.buyCount);
    if (!Number.isInteger(studentCount) || studentCount < 1 || studentCount > 300) return { valid: false, message: copy("invalidStudent") };
    if (!Number.isInteger(unitPrice) || unitPrice < 1 || unitPrice > 999) return { valid: false, message: copy("invalidPrice") };
    if (!Number.isInteger(buyCount) || buyCount < 2 || buyCount > 10) return { valid: false, message: copy("invalidBuy") };
    const problem = result(values);
    return problem.valid ? { valid: true, problem } : { valid: false, message: copy("genericError") };
  }

  function applySettings() {
    const nextValues = {
      studentCount: app.querySelector("[data-setting='studentCount']").value.trim(),
      unitPrice: app.querySelector("[data-setting='unitPrice']").value.trim(),
      buyCount: app.querySelector("[data-setting='buyCount']").value.trim()
    };
    const validation = validateSettings(nextValues);
    if (!validation.valid) {
      settingsError.textContent = validation.message;
      settingsError.hidden = false;
      return;
    }
    state.studentCount = String(validation.problem.studentCount);
    state.unitPrice = String(validation.problem.unitPrice);
    state.buyCount = String(validation.problem.buyCount);
    slideIndex = 0;
    settingsDialog.close();
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  app.addEventListener("click", (event) => {
    const stepButton = event.target.closest("[data-step]");
    if (stepButton) {
      slideIndex = Number(stepButton.dataset.step);
      render();
      alignStageOnNarrowScreen();
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
