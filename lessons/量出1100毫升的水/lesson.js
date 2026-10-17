(function () {
  const app = document.querySelector("[data-water-measure-app]");
  if (!app || !window.MathLabModels || !window.MathLab) return;

  const stage = app.querySelector("[data-stage]");
  const board = app.querySelector("[data-board]");
  const progress = app.querySelector("[data-progress]");
  const pageCount = app.querySelector("[data-page-count]");
  const nextLabel = app.querySelector("[data-next-label]");
  const prevButton = app.querySelector("[data-action='prev']");
  const nextButton = app.querySelector("[data-action='next']");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");

  const state = { bottleA: "500", bottleB: "800", target: "1100" };
  let slideIndex = 0;
  let mode = "lesson";
  let exploreTarget = "100";
  let exploreStep = 0;

  const copies = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "量出{target}毫升的水",
      back: "返回课程目录",
      edit: "编辑题目",
      fullscreen: "全屏讲解",
      bottlesLead: "两只瓶子",
      milliliters: "毫升",
      targetLead: "目标：",
      prev: "上一页",
      next: "下一页",
      replay: "重新播放",
      explore: "进入倒水探索",
      exploreHint: "量出100毫升，也挑战其他目标",
      exploreTargetLead: "探索目标：",
      exploreMode: "倒水探索",
      exploreTitle: "用最少的操作量出{target}毫升",
      exploreQuestion: "为什么100毫升是最小的水量单位？",
      exploreUnit: "共同的最小水量单位",
      exploreRule: "两个瓶子的容量都是{unit}毫升的整倍数，所以倒来倒去，出现的水量也只能是{unit}毫升的整倍数。",
      exploreAny: "能量出：{unit}、{doubleUnit}、{tripleUnit}……",
      exploreGoalLabel: "想量出",
      exploreSolve: "计算最少次数",
      exploreInitial: "先观察水量单位，再开始按最短路线倒水。",
      exploreNextOperation: "下一次操作",
      exploreReplay: "重新演示",
      exploreBack: "返回1100毫升讲解",
      exploreStepCount: "第 {current} / {total} 次操作",
      exploreReadyCount: "准备开始 · 共 {total} 次操作",
      exploreMinimum: "最少 {count} 次",
      exploreProof: "已经检查完0到{checked}次的所有走法，都没有达到目标；第{count}次第一次达到。",
      exploreReached: "目标达成：盆中正好有{target}毫升",
      exploreState: "小瓶 {small} · 大瓶 {large} · 盆 {target}",
      exploreNotMeasurable: "这个目标不能准确量出。目标必须是{unit}毫升的整倍数。",
      exploreTooLarge: "这个目标超出课堂搜索范围，请输入较小的{unit}毫升整倍数。",
      exploreInvalid: "请输入大于0的整数目标。",
      exploreProgressUnit: "找基本单位",
      exploreProgressRoute: "按最少次数倒水",
      exploreProgressProof: "验证第一次到达",
      parameters: "题目参数",
      settingsTitle: "编辑量水问题",
      settingsLead: "本课讲解“两个瓶子的差量＋一满瓶”，应用后会从第1页重新讲解。",
      bottleALabel: "瓶子A容量",
      bottleBLabel: "瓶子B容量",
      targetLabel: "要量出的水",
      validityTitle: "有效题目需要满足",
      validityPositive: "三个数都是大于0的整数",
      validityDifferent: "两个瓶子的容量不同",
      validityPattern: "目标水量＝大瓶容量＋两瓶容量之差",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      pageCount: "第 {current} 页 / 共 {total} 页",
      currentQuestion: "本页问题",
      blackboard: "本页板书",
      sourceBasin: "装水的盆",
      targetBasin: "用来量水的空盆",
      smallBottle: "小瓶：{capacity}毫升",
      largeBottle: "大瓶：{capacity}毫升",
      empty: "空",
      enoughWater: "水量充足",
      currentAmount: "盆中已有 {amount} 毫升",
      questionAmount: "还剩多少？",
      fillLargeFirst: "先把大瓶装满",
      fillSmallFromLarge: "再用大瓶把小瓶装满",
      saveResidual: "把大瓶剩下的水倒进空盆",
      answer: "答：先量出{residual}毫升水倒入空盆，再装满{large}毫升瓶倒入空盆，就量出了{target}毫升水。",
      invalidBottleA: "瓶子A的容量必须是大于0的整数。",
      invalidBottleB: "瓶子B的容量必须是大于0的整数。",
      invalidTarget: "目标水量必须是大于0的整数。",
      equalCapacities: "两个瓶子的容量要不同，才能利用容量差量水。",
      unsupportedTarget: "这套课件讲“容量差＋一满瓶”。按当前两个瓶子，目标水量应改为 {target} 毫升。",
      genericError: "请输入符合本课讲解结构的容量和目标水量。"
    },
    "en-US": {
      labName: "Elementary Math Interactive Classroom",
      title: "Measure {target} mL of Water",
      back: "Back to catalog",
      edit: "Edit problem",
      fullscreen: "Fullscreen",
      bottlesLead: "Two bottles",
      milliliters: "mL",
      targetLead: "Target: ",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      explore: "Explore more pours",
      exploreHint: "Measure 100 mL or try another target",
      exploreTargetLead: "Explore target: ",
      exploreMode: "Pouring exploration",
      exploreTitle: "Measure {target} mL in the fewest operations",
      exploreQuestion: "Why is 100 mL the smallest water unit?",
      exploreUnit: "Smallest common water unit",
      exploreRule: "Both bottle capacities are multiples of {unit} mL, so every amount created by pouring must also be a multiple of {unit} mL.",
      exploreAny: "Measurable: {unit}, {doubleUnit}, {tripleUnit}, and so on",
      exploreGoalLabel: "Measure",
      exploreSolve: "Find the minimum",
      exploreInitial: "Notice the common water unit, then follow the shortest route.",
      exploreNextOperation: "Next operation",
      exploreReplay: "Replay route",
      exploreBack: "Back to the 1100 mL lesson",
      exploreStepCount: "Operation {current} of {total}",
      exploreReadyCount: "Ready · {total} operations total",
      exploreMinimum: "Minimum: {count} operations",
      exploreProof: "Every route from 0 through {checked} operations has been checked without reaching the target. The first arrival is at operation {count}.",
      exploreReached: "Target reached: the basin holds exactly {target} mL",
      exploreState: "Small {small} · Large {large} · Basin {target}",
      exploreNotMeasurable: "This target cannot be measured exactly. It must be a multiple of {unit} mL.",
      exploreTooLarge: "This target is beyond the classroom search range. Try a smaller multiple of {unit} mL.",
      exploreInvalid: "Enter a whole-number target greater than 0.",
      exploreProgressUnit: "Find the common unit",
      exploreProgressRoute: "Follow the shortest route",
      exploreProgressProof: "Verify the first arrival",
      parameters: "Problem values",
      settingsTitle: "Edit the water-measuring problem",
      settingsLead: "This lesson uses “the difference between the bottles + one full large bottle,” then restarts at page 1.",
      bottleALabel: "Bottle A capacity",
      bottleBLabel: "Bottle B capacity",
      targetLabel: "Water to measure",
      validityTitle: "A valid problem must satisfy",
      validityPositive: "All three values are whole numbers greater than 0",
      validityDifferent: "The two bottles have different capacities",
      validityPattern: "Target = large bottle + the difference between the bottles",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      pageCount: "Page {current} of {total}",
      currentQuestion: "Question",
      blackboard: "Blackboard",
      sourceBasin: "Basin of water",
      targetBasin: "Empty measuring basin",
      smallBottle: "Small bottle: {capacity} mL",
      largeBottle: "Large bottle: {capacity} mL",
      empty: "Empty",
      enoughWater: "Enough water",
      currentAmount: "The basin now holds {amount} mL",
      questionAmount: "How much remains?",
      fillLargeFirst: "Fill the large bottle first",
      fillSmallFromLarge: "Use the large bottle to fill the small bottle",
      saveResidual: "Pour the water left in the large bottle into the empty basin",
      answer: "Answer: First put {residual} mL into the empty basin. Then fill the {large} mL bottle and add it to make {target} mL.",
      invalidBottleA: "Bottle A must have a whole-number capacity greater than 0.",
      invalidBottleB: "Bottle B must have a whole-number capacity greater than 0.",
      invalidTarget: "The target must be a whole number greater than 0.",
      equalCapacities: "The bottles must have different capacities so their difference can be used.",
      unsupportedTarget: "This lesson teaches “difference + one full large bottle.” With these bottles, change the target to {target} mL.",
      genericError: "Enter capacities and a target that fit this lesson pattern."
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
    return MathLabModels.quantity.waterMeasureState(values.bottleA, values.bottleB, values.target);
  }

  function explorationResult(target = exploreTarget) {
    return MathLabModels.quantity.waterMeasureExploreState(state.bottleA, state.bottleB, target);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function unitSteps(bottleA, bottleB) {
    let larger = bottleA > bottleB ? bottleA : bottleB;
    let smaller = bottleA > bottleB ? bottleB : bottleA;
    const steps = [];
    while (smaller !== 0n) {
      const quotient = larger / smaller;
      const remainder = larger % smaller;
      if (remainder === 0n) break;
      steps.push({ larger, smaller, quotient, remainder });
      larger = smaller;
      smaller = remainder;
    }
    return steps;
  }

  function vesselName(code, solution) {
    if (code === "source") return copy("sourceBasin");
    if (code === "target") return copy("targetBasin");
    const capacity = code === "a" ? solution.bottleACapacity : solution.bottleBCapacity;
    const otherCapacity = code === "a" ? solution.bottleBCapacity : solution.bottleACapacity;
    if (capacity === otherCapacity) {
      return tr(`${formatInteger(capacity)}毫升瓶子${code.toUpperCase()}`, `${formatInteger(capacity)} mL bottle ${code.toUpperCase()}`);
    }
    const size = capacity > otherCapacity ? tr("大瓶", "large bottle") : tr("小瓶", "small bottle");
    return tr(`${formatInteger(capacity)}毫升${size}`, `${formatInteger(capacity)} mL ${size}`);
  }

  function operationText(operation, solution) {
    const from = vesselName(operation.from, solution);
    const to = vesselName(operation.to, solution);
    const amount = formatInteger(operation.amount);
    if (operation.type.startsWith("fill-")) {
      return tr(`从装水盆取水，把${to}装满`, `Fill ${to} from the source basin`);
    }
    if (operation.type.startsWith("empty-")) {
      return tr(`把${from}里的水倒回装水盆`, `Empty ${from} back into the source basin`);
    }
    if (operation.to === "target") {
      return tr(`把${from}中的${amount}毫升倒入目标盆`, `Pour ${amount} mL from ${from} into the target basin`);
    }
    return tr(`从${from}向${to}倒水，直到一只瓶空或另一只瓶满`, `Pour from ${from} to ${to} until one bottle is empty or the other is full`);
  }

  function operationMotion(operation, vessel) {
    if (!operation || operation.from !== vessel) return undefined;
    if (vessel === "a") return operation.to === "source" ? "left" : "right";
    return operation.to === "target" ? "right" : "left";
  }

  function ratio(amount, capacity) {
    if (capacity <= 0n || amount <= 0n) return 0;
    return Math.min(1, Number((amount * 10000n) / capacity) / 10000);
  }

  function renderBottle(id, size, capacity, amount, options = {}) {
    const waterRatio = ratio(amount, capacity);
    const waterTop = Math.round(244 - 176 * waterRatio);
    const waterHeight = Math.max(0, 244 - waterTop);
    const startAmount = options.startAmount ?? amount;
    const startWaterRatio = ratio(startAmount, capacity);
    const startWaterTop = Math.round(244 - 176 * startWaterRatio);
    const labelKey = size === "large" ? "largeBottle" : "smallBottle";
    const amountText = options.hideAmount
      ? copy("questionAmount")
      : amount === 0n
        ? copy("empty")
        : `${formatInteger(amount)} ${copy("milliliters")}`;
    const amountClass = options.hideAmount ? "wm-amount-badge is-question" : amount === 0n ? "wm-empty-sign" : "wm-amount-badge";
    let water = "";
    if (amount > 0n) {
      const isChanging = startAmount !== amount;
      const startScale = waterRatio > 0 ? startWaterRatio / waterRatio : 1;
      const fillClass = isChanging ? "wm-water-fill is-water-changing" : "wm-water-fill";
      const lineClass = isChanging ? "wm-water-line is-water-changing" : "wm-water-line";
      const motionStyle = isChanging
        ? ` style="--start-scale:${startScale.toFixed(4)};--line-offset:${startWaterTop - waterTop}px"`
        : "";
      water = `<rect class="${fillClass}" x="29" y="${waterTop}" width="122" height="${waterHeight}" clip-path="url(#${id}-bottle-clip)"${motionStyle} />
         <line class="${lineClass}" x1="34" y1="${waterTop}" x2="146" y2="${waterTop}" clip-path="url(#${id}-bottle-clip)"${motionStyle} />`;
    } else if (startAmount > 0n) {
      const startWaterHeight = Math.max(0, 244 - startWaterTop);
      const motionStyle = ` style="--empty-distance:${startWaterHeight}px"`;
      water = `<rect class="wm-water-fill is-water-emptying" x="29" y="${startWaterTop}" width="122" height="${startWaterHeight}" clip-path="url(#${id}-bottle-clip)"${motionStyle} />
         <line class="wm-water-line is-water-emptying" x1="34" y1="${startWaterTop}" x2="146" y2="${startWaterTop}" clip-path="url(#${id}-bottle-clip)"${motionStyle} />`;
    }
    const pourClass = options.motion ? ` is-pouring-${options.motion}` : "";
    return `<div class="wm-bottle-group" data-vessel="${id}">
      <div class="wm-bottle is-${size}${pourClass}">
        <svg class="wm-bottle-svg" viewBox="0 0 180 260" role="img" aria-label="${copy(labelKey, { capacity: formatInteger(capacity) })}，${amountText}">
          <defs><clipPath id="${id}-bottle-clip"><path d="M65 20H115V57L137 74Q149 83 149 101V230Q149 244 135 244H45Q31 244 31 230V101Q31 83 43 74L65 57Z" /></clipPath></defs>
          <path class="wm-bottle-outline" d="M65 20H115V57L137 74Q149 83 149 101V230Q149 244 135 244H45Q31 244 31 230V101Q31 83 43 74L65 57Z" />
          ${water}
          <rect class="wm-capacity-mark" x="50" y="124" width="80" height="42" rx="11" />
          <text class="wm-capacity-text" x="90" y="151">${formatInteger(capacity)}</text>
        </svg>
      </div>
      <p class="wm-object-label">${copy(labelKey, { capacity: `<strong>${formatInteger(capacity)}</strong>` })}</p>
      <span class="${amountClass}">${amountText}</span>
    </div>`;
  }

  function renderBasin(id, amount, target, options = {}) {
    const visualRatio = (value) => options.source ? 0.76 : ratio(value, target) * 0.618;
    const waterRatio = visualRatio(amount);
    const waterTop = Math.round(148 - 94 * waterRatio);
    const waterHeight = Math.max(0, 148 - waterTop);
    const startAmount = options.startAmount ?? amount;
    const startWaterRatio = visualRatio(startAmount);
    const startWaterTop = Math.round(148 - 94 * startWaterRatio);
    const objectLabel = options.source ? copy("sourceBasin") : copy("targetBasin");
    const amountText = options.source
      ? copy("enoughWater")
      : amount === 0n
        ? copy("empty")
        : copy("currentAmount", { amount: formatInteger(amount) });
    const badgeClass = amount === 0n && !options.source ? "wm-empty-sign" : "wm-amount-badge";
    const isChanging = amount > 0n && startAmount !== amount;
    const startScale = waterRatio > 0 ? startWaterRatio / waterRatio : 1;
    const fillClass = isChanging ? "wm-water-fill is-water-changing" : "wm-water-fill";
    const lineClass = isChanging ? "wm-water-line is-water-changing" : "wm-water-line";
    const motionStyle = isChanging
      ? ` style="--start-scale:${startScale.toFixed(4)};--line-offset:${startWaterTop - waterTop}px"`
      : "";
    return `<div class="wm-${options.source ? "source" : "target"}-group">
      <div class="wm-basin ${options.source ? "is-source" : "is-target"}">
        <svg class="wm-basin-svg" viewBox="0 0 260 180" role="img" aria-label="${objectLabel}，${amountText}">
          <defs><clipPath id="${id}-basin-clip"><path d="M28 48H232L210 151H50Z" /></clipPath></defs>
          <path class="wm-basin-outline" d="M28 48H232L210 151H50Z" />
          ${waterHeight > 0 ? `<rect class="${fillClass}" x="30" y="${waterTop}" width="200" height="${waterHeight}" clip-path="url(#${id}-basin-clip)"${motionStyle} />` : ""}
          ${waterHeight > 0 ? `<line class="${lineClass}" x1="42" y1="${waterTop}" x2="218" y2="${waterTop}" clip-path="url(#${id}-basin-clip)"${motionStyle} />` : ""}
        </svg>
      </div>
      <p class="wm-object-label"><strong>${objectLabel}</strong></p>
      <span class="${badgeClass}">${amountText}</span>
    </div>`;
  }

  function buildSlides(problem) {
    const small = formatInteger(problem.smallCapacity);
    const large = formatInteger(problem.largeCapacity);
    const residual = formatInteger(problem.residual);
    const target = formatInteger(problem.targetAmount);
    const remaining = formatInteger(problem.remainingAfterResidual);
    const fullProblem = tr(
      `有一盆水和一个空盆。两只瓶子分别能装${small}毫升和${large}毫升。只用这两只瓶子，能不能在空盆中量出${target}毫升水？说出你的办法。`,
      `There is a basin of water and an empty basin. Two bottles hold ${small} mL and ${large} mL. Can you use only these bottles to measure ${target} mL into the empty basin? Explain your method.`
    );
    return [
      {
        id: "read",
        label: tr("读题", "Read"),
        title: tr("先看清有哪些容器", "First, identify every container"),
        question: tr("题目告诉了我们什么？要量出多少水？", "What do we know, and how much water must we measure?"),
        lead: tr("先复述水盆、空盆和两只瓶子的容量，不急着想倒水步骤。", "Restate the two basins and both bottle capacities before planning any pours."),
        formula: [
          `${tr("已知", "Known")}: ${small} ${copy("milliliters")}, ${large} ${copy("milliliters")}`,
          `${tr("要量出", "Measure")}: ${target} ${copy("milliliters")}`
        ],
        fullProblem
      },
      {
        id: "fill",
        label: tr("装满大瓶", "Fill the large bottle"),
        title: tr("第一步，先把大瓶装满", "Step 1: Fill the large bottle"),
        question: tr("开始量水时，先把哪只瓶子装满？", "Which bottle should we fill first?"),
        lead: tr(`从装水的盆中取水，把容量为${large}毫升的大瓶装满。`, `Take water from the source basin and fill the ${large} mL bottle.`),
        formula: [`${tr("大瓶装满", "Large bottle full")}: <strong>${large}</strong> ${copy("milliliters")}`]
      },
      {
        id: "residual",
        label: tr("倒满小瓶", "Fill the small bottle"),
        title: tr("第二步，用大瓶的水把小瓶装满", "Step 2: Use the large bottle to fill the small one"),
        question: tr(`大瓶原有${large}毫升，倒出${small}毫升后还剩多少？`, `The large bottle starts with ${large} mL. How much remains after ${small} mL is poured out?`),
        lead: tr(`把大瓶的水倒入小瓶，小瓶装满时，大瓶里正好剩下${residual}毫升。`, `Pour from the large bottle until the small bottle is full. Exactly ${residual} mL remains in the large bottle.`),
        formula: [`${large} − ${small} = <strong>${residual}</strong> ${copy("milliliters")}`]
      },
      {
        id: "save",
        label: tr("倒入空盆", "Pour into the basin"),
        title: tr(`第三步，把${residual}毫升倒入盆`, `Step 3: Pour ${residual} mL into the basin`),
        question: tr(`盆里有${residual}毫升后，离${target}毫升还差多少？`, `After putting ${residual} mL in the basin, how much more is needed?`),
        lead: tr(`把大瓶剩下的${residual}毫升倒入空盆。${target}减${residual}等于${remaining}，刚好是一满大瓶的水。`, `Pour the remaining ${residual} mL into the empty basin. ${target} minus ${residual} is ${remaining}, exactly one full large bottle.`),
        formula: [`${large} − ${small} = <strong>${residual}</strong>`, `${target} − ${residual} = <strong>${remaining}</strong> ${copy("milliliters")}`]
      },
      {
        id: "refill",
        label: tr("再装一瓶", "Refill the large bottle"),
        title: tr("第四步，再把大瓶装满", "Step 4: Fill the large bottle again"),
        question: tr(`还差${remaining}毫升，应该装满哪只瓶子？`, `We still need ${remaining} mL. Which bottle should we fill?`),
        lead: tr(`还差的${remaining}毫升正好等于大瓶容量，所以再把大瓶装满。`, `The missing ${remaining} mL equals the large bottle's capacity, so fill the large bottle again.`),
        formula: [`${tr("还差", "Still needed")}: <strong>${remaining}</strong> ${copy("milliliters")}`, `${tr("大瓶装满", "Large bottle full")}: ${large} ${copy("milliliters")}`]
      },
      {
        id: "answer",
        label: tr("大瓶倒入盆", "Pour the large bottle"),
        title: tr("第五步，把一满大瓶倒入盆", "Step 5: Pour the full large bottle into the basin"),
        question: tr(`盆里原有${residual}毫升，再倒入${large}毫升，一共有多少？`, `The basin has ${residual} mL. What is the total after adding ${large} mL?`),
        lead: tr(`${residual}加${large}等于${target}。大瓶倒空后，盆里刚好就是目标水量。`, `${residual} plus ${large} equals ${target}. When the large bottle is empty, the basin holds exactly the target amount.`),
        formula: [
          `${large} − ${small} = <strong>${residual}</strong>`,
          `${residual} + ${large} = <strong>${target}</strong> ${copy("milliliters")}`
        ]
      }
    ];
  }

  function renderSlideHeader(slide, index, total) {
    return `<header class="wm-slide-head">
      <div><p class="wm-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div>
      <span class="wm-slide-number">${index + 1}/${total}</span>
    </header>`;
  }

  function renderStageBody(problem, slide) {
    const small = problem.smallCapacity;
    const large = problem.largeCapacity;
    const residual = problem.residual;
    const target = problem.targetAmount;
    if (slide.id === "read") {
      return `<div class="wm-intro-layout">
        <p class="wm-full-problem">${slide.fullProblem}</p>
        <div class="wm-intro-scene">
          ${renderBasin("read-source", 1n, 1n, { source: true })}
          ${renderBottle("read-small", "small", small, 0n)}
          ${renderBottle("read-large", "large", large, 0n)}
          ${renderBasin("read-target", 0n, target)}
        </div>
      </div>`;
    }
    if (slide.id === "fill") {
      return `<div class="wm-process-scene wm-fill-scene">
        <span class="wm-step-note">${copy("fillLargeFirst")}</span>
        ${renderBasin("fill-source", 1n, 1n, { source: true })}
        <div class="wm-pour-flow is-animated is-right" aria-label="${tr("从装水盆把大瓶装满", "Fill the large bottle from the source basin")}"><span class="wm-pour-arrow" aria-hidden="true">→</span><span class="wm-flow-dots" aria-hidden="true"><i></i><i></i><i></i></span><small>${tr("装满大瓶", "Fill the large bottle")}</small></div>
        ${renderBottle("fill-large", "large", large, large, { startAmount: 0n })}
      </div>`;
    }
    if (slide.id === "residual") {
      return `<div class="wm-process-scene">
        <span class="wm-step-note">${copy("fillSmallFromLarge")}</span>
        ${renderBottle("residual-small", "small", small, small, { startAmount: 0n })}
        <div class="wm-pour-flow is-animated is-left" aria-label="${tr("从大瓶倒向小瓶", "Pour from the large bottle into the small bottle")}"><span class="wm-pour-arrow" aria-hidden="true">←</span><span class="wm-flow-dots" aria-hidden="true"><i></i><i></i><i></i></span><small>${tr("倒到小瓶装满", "Stop when the small bottle is full")}</small></div>
        ${renderBottle("residual-large", "large", large, residual, { startAmount: large, motion: "left" })}
      </div>`;
    }
    if (slide.id === "save") {
      return `<div class="wm-process-scene wm-save-scene">
        <span class="wm-step-note">${copy("saveResidual")}</span>
        ${renderBottle("save-large", "large", large, 0n, { startAmount: residual, motion: "right" })}
        <div class="wm-pour-flow is-animated is-right" aria-label="${tr("把剩下的水倒入空盆", "Pour the remaining water into the empty basin")}"><span class="wm-pour-arrow" aria-hidden="true">→</span><span class="wm-flow-dots" aria-hidden="true"><i></i><i></i><i></i></span><small>${formatInteger(residual)} ${copy("milliliters")}</small></div>
        ${renderBasin("save-target", residual, target, { startAmount: 0n })}
        <div class="wm-gap-card wm-gap-result"><span>${tr("离目标还差", "Still needed")}</span><strong>${formatInteger(problem.remainingAfterResidual)}</strong><span>${copy("milliliters")} · ${tr("刚好一满大瓶", "exactly one full large bottle")}</span></div>
      </div>`;
    }
    if (slide.id === "refill") {
      return `<div class="wm-gap-scene">
        ${renderBasin("refill-target", residual, target)}
        <span class="wm-plus-sign" aria-hidden="true">＋</span>
        ${renderBottle("refill-large", "large", large, large, { startAmount: 0n })}
      </div>`;
    }
    return `<div class="wm-final-scene">
      <div class="wm-final-transfer">
        ${renderBottle("answer-large", "large", large, 0n, { startAmount: large, motion: "right" })}
        <div class="wm-pour-flow is-animated is-right" aria-label="${tr("把一满大瓶倒入盆", "Pour the full large bottle into the basin")}"><span class="wm-pour-arrow" aria-hidden="true">→</span><span class="wm-flow-dots" aria-hidden="true"><i></i><i></i><i></i></span><small>${formatInteger(large)} ${copy("milliliters")}</small></div>
        ${renderBasin("answer-target", target, target, { startAmount: residual })}
      </div>
      <div class="wm-final-proof">
        <div class="wm-final-equation"><span>${formatInteger(residual)}</span><span>＋</span><span>${formatInteger(large)}</span><span>＝</span><strong>${formatInteger(target)} ${copy("milliliters")}</strong></div>
        <div class="wm-check-list">
          <span>✓ ${formatInteger(large)} − ${formatInteger(small)} = ${formatInteger(problem.checkedDifference)}</span>
          <span>✓ ${formatInteger(problem.checkedTotal)} = ${formatInteger(target)}</span>
        </div>
        <div class="wm-answer-banner">${copy("answer", { residual: formatInteger(residual), large: formatInteger(large), target: formatInteger(target) })}</div>
        <button class="wm-explore-entry" type="button" data-action="open-explore">
          <span>${copy("explore")}</span>
          <small>${copy("exploreHint")}</small>
          <strong aria-hidden="true">→</strong>
        </button>
      </div>
    </div>`;
  }

  function renderUnitChain(solution, fundamentalUnit) {
    const steps = unitSteps(solution.bottleACapacity, solution.bottleBCapacity);
    const expressions = steps.map((step) => {
      const left = formatInteger(step.larger);
      const right = formatInteger(step.smaller);
      const answer = formatInteger(step.remainder);
      return step.quotient === 1n
        ? `${left} − ${right} = <strong>${answer}</strong>`
        : `${left} − ${right} × ${formatInteger(step.quotient)} = <strong>${answer}</strong>`;
    });
    if (!expressions.length) {
      expressions.push(
        `${formatInteger(solution.bottleACapacity)} ÷ ${formatInteger(fundamentalUnit)} = ${formatInteger(solution.bottleACapacity / fundamentalUnit)}`,
        `${formatInteger(solution.bottleBCapacity)} ÷ ${formatInteger(fundamentalUnit)} = ${formatInteger(solution.bottleBCapacity / fundamentalUnit)}`
      );
    }
    return `<div class="wm-unit-chain" aria-label="${copy("exploreUnit")}">
      <div class="wm-unit-steps">${expressions.map((expression) => `<span>${expression}</span>`).join('<i aria-hidden="true">→</i>')}</div>
      <strong class="wm-unit-result"><small>${copy("exploreUnit")}</small>${formatInteger(fundamentalUnit)} ${copy("milliliters")}</strong>
    </div>`;
  }

  function renderExploreSimulator(solution) {
    if (!solution.valid) {
      const fundamentalUnit = solution.fundamentalUnit || explorationResult("1").fundamentalUnit;
      const message = solution.reason === "not-measurable"
        ? copy("exploreNotMeasurable", { unit: formatInteger(fundamentalUnit) })
        : solution.reason === "search-too-large"
          ? copy("exploreTooLarge", { unit: formatInteger(fundamentalUnit) })
          : copy("exploreInvalid");
      return `<div class="wm-explore-error" role="alert"><strong>×</strong><p>${message}</p></div>`;
    }

    exploreStep = Math.max(0, Math.min(exploreStep, solution.minimumOperations));
    const operation = exploreStep > 0 ? solution.path[exploreStep - 1] : null;
    const amounts = operation ? operation.after : solution.initial;
    const before = operation ? operation.before : solution.initial;
    const bottleASize = solution.bottleACapacity > solution.bottleBCapacity ? "large" : "small";
    const bottleBSize = solution.bottleBCapacity > solution.bottleACapacity ? "large" : "small";
    const instruction = operation ? operationText(operation, solution) : copy("exploreInitial");
    const fromClass = operation ? ` is-from-${operation.from}` : "";
    const toClass = operation ? ` is-to-${operation.to}` : "";

    return `<div class="wm-explore-simulator">
      <div class="wm-explore-operation ${operation ? "is-running" : ""}">
        <span>${operation ? operation.number : "●"}</span>
        <strong>${instruction}</strong>
        ${operation ? `<span class="wm-explore-flow-dots" aria-hidden="true"><i></i><i></i><i></i></span>` : ""}
      </div>
      <div class="wm-explore-vessels${fromClass}${toClass}">
        <div class="wm-explore-vessel-slot" data-explore-vessel="source">${renderBasin(`explore-${exploreStep}-source`, 1n, 1n, { source: true })}</div>
        <div class="wm-explore-vessel-slot" data-explore-vessel="a">${renderBottle(`explore-${exploreStep}-a`, bottleASize, solution.bottleACapacity, amounts.bottleA, { startAmount: before.bottleA, motion: operationMotion(operation, "a") })}</div>
        <div class="wm-explore-vessel-slot" data-explore-vessel="b">${renderBottle(`explore-${exploreStep}-b`, bottleBSize, solution.bottleBCapacity, amounts.bottleB, { startAmount: before.bottleB, motion: operationMotion(operation, "b") })}</div>
        <div class="wm-explore-vessel-slot" data-explore-vessel="target">${renderBasin(`explore-${exploreStep}-target`, amounts.targetBasin, solution.targetAmount, { startAmount: before.targetBasin })}</div>
      </div>
      ${exploreStep === solution.minimumOperations ? `<div class="wm-explore-success">✓ ${copy("exploreReached", { target: formatInteger(solution.targetAmount) })}</div>` : ""}
    </div>`;
  }

  function renderExploreBoard(solution, fundamentalUnit) {
    if (!solution.valid) {
      const message = solution.reason === "not-measurable"
        ? copy("exploreNotMeasurable", { unit: formatInteger(fundamentalUnit) })
        : solution.reason === "search-too-large"
          ? copy("exploreTooLarge", { unit: formatInteger(fundamentalUnit) })
          : copy("exploreInvalid");
      board.innerHTML = `<p class="wm-board-label">${copy("exploreQuestion")}</p>
        <h2>${copy("exploreUnit")}：${formatInteger(fundamentalUnit)} ${copy("milliliters")}</h2>
        <p class="wm-board-lead">${message}</p>
        <div class="wm-formula"><span class="wm-board-label">${copy("blackboard")}</span><span class="wm-formula-line">${copy("exploreAny", { unit: formatInteger(fundamentalUnit), doubleUnit: formatInteger(fundamentalUnit * 2n), tripleUnit: formatInteger(fundamentalUnit * 3n) })}</span></div>`;
      return;
    }

    const operation = exploreStep > 0 ? solution.path[exploreStep - 1] : null;
    const amounts = operation ? operation.after : solution.initial;
    const smallAmount = solution.bottleACapacity < solution.bottleBCapacity ? amounts.bottleA : amounts.bottleB;
    const largeAmount = solution.bottleACapacity < solution.bottleBCapacity ? amounts.bottleB : amounts.bottleA;
    const question = operation ? operationText(operation, solution) : copy("exploreQuestion");
    const lead = operation
      ? copy("exploreState", { small: formatInteger(smallAmount), large: formatInteger(largeAmount), target: formatInteger(amounts.targetBasin) })
      : copy("exploreRule", { unit: formatInteger(fundamentalUnit) });
    const proof = copy("exploreProof", { checked: solution.checkedThrough, count: solution.minimumOperations });
    board.innerHTML = `<p class="wm-board-label">${copy("exploreMode")}</p>
      <h2>${question}</h2>
      <p class="wm-board-lead">${lead}</p>
      <div class="wm-explore-minimum">${copy("exploreMinimum", { count: solution.minimumOperations })}</div>
      <div class="wm-formula"><span class="wm-board-label">${copy("blackboard")}</span>
        <span class="wm-formula-line">${copy("exploreAny", { unit: formatInteger(fundamentalUnit), doubleUnit: formatInteger(fundamentalUnit * 2n), tripleUnit: formatInteger(fundamentalUnit * 3n) })}</span>
        <span class="wm-formula-line wm-minimum-proof">${proof}</span>
      </div>`;
  }

  function renderExploration(problem) {
    const solution = explorationResult();
    const fallback = explorationResult("1");
    const fundamentalUnit = solution.fundamentalUnit || fallback.fundamentalUnit;
    const targetText = solution.targetAmount ? formatInteger(solution.targetAmount) : escapeHtml(exploreTarget || "?");
    renderStaticCopy(problem);
    app.querySelector("[data-target-summary]").textContent = solution.targetAmount ? formatInteger(solution.targetAmount) : exploreTarget || "?";
    app.querySelector("[data-copy='targetLead']").textContent = copy("exploreTargetLead");
    renderExploreProgress(solution);
    renderExploreControls(solution);
    stage.innerHTML = `<article class="wm-slide wm-explore-slide" data-slide="explore">
      <header class="wm-slide-head">
        <div><p class="wm-slide-kicker">${copy("exploreMode")}</p><h2>${copy("exploreTitle", { target: targetText })}</h2></div>
        <span class="wm-slide-number">${solution.valid ? `${exploreStep}/${solution.minimumOperations}` : "?"}</span>
      </header>
      <div class="wm-stage-body"><div class="wm-explore-layout">
        <div class="wm-explore-tools">
          ${renderUnitChain(solution.valid || solution.fundamentalUnit ? solution : fallback, fundamentalUnit)}
          <form class="wm-explore-target-form" data-explore-form>
            <label for="wm-explore-target">${copy("exploreGoalLabel")}</label>
            <span><input id="wm-explore-target" name="exploreTarget" type="text" inputmode="numeric" autocomplete="off" value="${escapeHtml(exploreTarget)}" /><b>${copy("milliliters")}</b></span>
            <button type="submit">${copy("exploreSolve")}</button>
          </form>
        </div>
        ${renderExploreSimulator(solution)}
      </div></div>
    </article>`;
    renderExploreBoard(solution, fundamentalUnit);
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="wm-board-label">${copy("currentQuestion")}</p>
      <h2>${slide.question}</h2>
      <p class="wm-board-lead">${slide.lead}</p>
      <div class="wm-formula"><span class="wm-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="wm-formula-line">${line}</span>`).join("")}</div>`;
  }

  function renderStaticCopy(problem) {
    document.documentElement.lang = language();
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    const title = copy("title", { target: formatInteger(problem.targetAmount) });
    app.querySelector("h1").textContent = title;
    document.title = `${title} - Math Motion Lab`;
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='edit']").setAttribute("aria-label", copy("edit"));
    app.querySelector("[data-action='fullscreen']").setAttribute("aria-label", copy("fullscreen"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelector("[data-small-summary]").textContent = formatInteger(problem.smallCapacity);
    app.querySelector("[data-large-summary]").textContent = formatInteger(problem.largeCapacity);
    app.querySelector("[data-target-summary]").textContent = formatInteger(problem.targetAmount);
  }

  function renderProgress(slides) {
    progress.classList.remove("is-explore");
    progress.innerHTML = slides.map((slide, index) => `<button class="wm-progress-step ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" type="button" data-step="${index}" ${index === slideIndex ? 'aria-current="step"' : ""}>${index < slideIndex ? "✓ " : ""}${slide.label}</button>`).join("");
  }

  function renderExploreProgress(solution) {
    const atProof = solution.valid && exploreStep === solution.minimumOperations;
    const inRoute = solution.valid && exploreStep > 0 && !atProof;
    const items = [
      { label: copy("exploreProgressUnit"), current: !solution.valid || exploreStep === 0, complete: solution.valid && exploreStep > 0 },
      { label: copy("exploreProgressRoute"), current: inRoute, complete: atProof },
      { label: copy("exploreProgressProof"), current: atProof, complete: false }
    ];
    progress.classList.add("is-explore");
    progress.innerHTML = items.map((item) => `<span class="wm-progress-step ${item.complete ? "is-complete" : ""} ${item.current ? "is-current" : ""}" ${item.current ? 'aria-current="step"' : ""}>${item.complete ? "✓ " : ""}${item.label}</span>`).join("");
  }

  function renderControls(slides) {
    prevButton.disabled = slideIndex === 0;
    nextButton.disabled = false;
    nextLabel.textContent = slideIndex === slides.length - 1 ? copy("replay") : copy("next");
    pageCount.textContent = copy("pageCount", { current: slideIndex + 1, total: slides.length });
  }

  function renderExploreControls(solution) {
    prevButton.disabled = false;
    nextButton.disabled = !solution.valid;
    nextLabel.textContent = solution.valid && exploreStep === solution.minimumOperations ? copy("exploreReplay") : copy("exploreNextOperation");
    pageCount.textContent = solution.valid
      ? exploreStep === 0
        ? copy("exploreReadyCount", { total: solution.minimumOperations })
        : copy("exploreStepCount", { current: exploreStep, total: solution.minimumOperations })
      : copy("exploreBack");
  }

  function render() {
    const problem = result();
    if (!problem.valid) return;
    if (mode === "explore") {
      renderExploration(problem);
      return;
    }
    const slides = buildSlides(problem);
    slideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
    const slide = slides[slideIndex];
    renderStaticCopy(problem);
    renderProgress(slides);
    renderControls(slides);
    stage.innerHTML = `<article class="wm-slide" data-slide="${slide.id}">${renderSlideHeader(slide, slideIndex, slides.length)}<div class="wm-stage-body">${renderStageBody(problem, slide)}</div></article>`;
    renderBoard(slide);
  }

  function goNext() {
    if (mode === "explore") {
      const solution = explorationResult();
      if (!solution.valid) return;
      exploreStep = exploreStep === solution.minimumOperations ? 0 : exploreStep + 1;
      render();
      return;
    }
    const slides = buildSlides(result());
    slideIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
    render();
  }

  function goPrevious() {
    if (mode === "explore") {
      if (exploreStep > 0) {
        exploreStep -= 1;
      } else {
        mode = "lesson";
        slideIndex = buildSlides(result()).length - 1;
      }
      render();
      return;
    }
    if (slideIndex === 0) return;
    slideIndex -= 1;
    render();
  }

  function openExploration() {
    const fundamentalUnit = explorationResult("1").fundamentalUnit;
    exploreTarget = fundamentalUnit.toString();
    exploreStep = 0;
    mode = "explore";
    render();
  }

  function solveExploration() {
    const input = app.querySelector("[name='exploreTarget']");
    if (!input) return;
    exploreTarget = input.value.trim();
    exploreStep = 0;
    render();
  }

  function openSettings() {
    app.querySelector("[data-setting='bottleA']").value = state.bottleA;
    app.querySelector("[data-setting='bottleB']").value = state.bottleB;
    app.querySelector("[data-setting='target']").value = state.target;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-bottle-a") return copy("invalidBottleA");
    if (problem.reason === "invalid-bottle-b") return copy("invalidBottleB");
    if (problem.reason === "invalid-target") return copy("invalidTarget");
    if (problem.reason === "equal-capacities") return copy("equalCapacities");
    if (problem.reason === "unsupported-target") {
      return copy("unsupportedTarget", { target: formatInteger(problem.supportedTarget) });
    }
    return copy("genericError");
  }

  function applySettings() {
    const nextValues = {
      bottleA: app.querySelector("[data-setting='bottleA']").value.trim(),
      bottleB: app.querySelector("[data-setting='bottleB']").value.trim(),
      target: app.querySelector("[data-setting='target']").value.trim()
    };
    const problem = result(nextValues);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }
    state.bottleA = problem.bottleACapacity.toString();
    state.bottleB = problem.bottleBCapacity.toString();
    state.target = problem.targetAmount.toString();
    slideIndex = 0;
    mode = "lesson";
    exploreStep = 0;
    settingsDialog.close();
    render();
  }

  app.addEventListener("submit", (event) => {
    if (!event.target.matches("[data-explore-form]")) return;
    event.preventDefault();
    solveExploration();
  });

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
    if (action === "open-explore") openExploration();
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
