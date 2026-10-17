(function () {
  const app = document.querySelector("[data-chicken-rabbit-app]");
  if (!app || !window.MathLabModels || !window.MathLab) return;

  const stage = app.querySelector("[data-stage]");
  const board = app.querySelector("[data-board]");
  const progress = app.querySelector("[data-progress]");
  const pageCount = app.querySelector("[data-page-count]");
  const nextLabel = app.querySelector("[data-next-label]");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");
  const prevButton = app.querySelector("[data-action='prev']");
  const nextButton = app.querySelector("[data-action='next']");

  const state = { heads: "8", legs: "22" };
  let slideIndex = 0;

  const copies = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "鸡兔同笼",
      back: "返回课程目录",
      edit: "编辑题目",
      fullscreen: "全屏讲解",
      parameters: "题目参数",
      headsUnit: "个头",
      legsUnit: "条腿",
      problemQuestion: "鸡和兔各有多少只？",
      prev: "上一页",
      next: "下一页",
      replay: "重新播放",
      settingsTitle: "编辑鸡兔同笼",
      settingsLead: "数量不设上限，应用后会从第 1 页重新讲解。",
      headsLabel: "头的总数",
      legsLabel: "腿的总数",
      validityTitle: "有效题目需要满足",
      validityPositive: "头数和腿数都是正整数",
      validityEven: "腿数是偶数",
      validityRange: "腿数不少于头数×2，不多于头数×4",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      pageCount: "第 {current} 页 / 共 {total} 页",
      currentQuestion: "本页问题",
      blackboard: "本页板书",
      eachSymbol: "每个图形代表 {count} 只动物",
      exactSymbols: "每个图形代表 1 只动物，可以逐个数",
      remainderSymbol: "最后一个图形单独代表余下的 {count} 只",
      chickenCount: "鸡：{count} 只",
      rabbitCount: "兔：{count} 只",
      invalidHeads: "头数必须是大于 0 的整数。",
      invalidLegs: "腿数必须是大于 0 的整数。",
      oddLegs: "腿数必须是偶数，因为鸡和兔的腿数都是偶数。",
      tooFewLegs: "腿数太少。{heads} 个头至少需要 {minimum} 条腿。",
      tooManyLegs: "腿数太多。{heads} 个头最多只能有 {maximum} 条腿。",
      headAria: "一个头",
      chickenAria: "一只鸡的结构：一个头，两条腿",
      rabbitAria: "一只兔的结构：一个头，四条腿",
      groupBadge: "×{count}",
      pairGroups: "{count} 组",
      noExtra: "没有多出的腿，也就没有需要配对的腿。",
      answer: "答：鸡有 {chickens} 只，兔有 {rabbits} 只。"
    },
    "en-US": {
      labName: "Elementary Math Interactive Classroom",
      title: "Chickens and Rabbits",
      back: "Back to catalog",
      edit: "Edit problem",
      fullscreen: "Fullscreen",
      parameters: "Problem values",
      headsUnit: "heads",
      legsUnit: "legs",
      problemQuestion: "How many chickens and rabbits are there?",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      settingsTitle: "Edit chickens and rabbits",
      settingsLead: "There is no mathematical maximum. Applying changes restarts at page 1.",
      headsLabel: "Total heads",
      legsLabel: "Total legs",
      validityTitle: "A valid problem must satisfy",
      validityPositive: "Heads and legs are positive whole numbers",
      validityEven: "The number of legs is even",
      validityRange: "Legs are at least heads×2 and at most heads×4",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      pageCount: "Page {current} of {total}",
      currentQuestion: "Question",
      blackboard: "Blackboard",
      eachSymbol: "Each symbol represents {count} animals",
      exactSymbols: "Each symbol represents 1 animal, so they can be counted one by one",
      remainderSymbol: "The final symbol represents the remaining {count} animals",
      chickenCount: "Chickens: {count}",
      rabbitCount: "Rabbits: {count}",
      invalidHeads: "Heads must be a whole number greater than 0.",
      invalidLegs: "Legs must be a whole number greater than 0.",
      oddLegs: "Legs must be even because chickens and rabbits both have an even number of legs.",
      tooFewLegs: "Too few legs. {heads} heads need at least {minimum} legs.",
      tooManyLegs: "Too many legs. {heads} heads can have at most {maximum} legs.",
      headAria: "one head",
      chickenAria: "a chicken structure with one head and two legs",
      rabbitAria: "a rabbit structure with one head and four legs",
      groupBadge: "×{count}",
      pairGroups: "{count} groups",
      noExtra: "There are no extra legs, so there are no pairs to make.",
      answer: "Answer: {chickens} chickens and {rabbits} rabbits."
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

  function result() {
    return MathLabModels.quantity.chickenRabbitState(state.heads, state.legs);
  }

  function ceilDivide(value, divisor) {
    return (value + divisor - 1n) / divisor;
  }

  function niceCeiling(value) {
    if (value <= 1n) return 1n;
    const power = 10n ** BigInt(value.toString().length - 1);
    for (const multiplier of [1n, 2n, 5n, 10n]) {
      const candidate = power * multiplier;
      if (candidate >= value) return candidate;
    }
    return power * 10n;
  }

  function groupingFor(heads) {
    const maximumTiles = 200n;
    const unit = heads <= maximumTiles ? 1n : niceCeiling(ceilDivide(heads, maximumTiles));
    return { unit, grouped: unit > 1n };
  }

  function gridColumns(tileCount) {
    if (tileCount <= 4) return Math.max(1, tileCount);
    if (tileCount <= 8) return tileCount;
    if (tileCount <= 12) return 6;
    if (tileCount <= 30) return 6;
    if (tileCount <= 60) return 10;
    if (tileCount <= 120) return 15;
    if (tileCount <= 160) return 20;
    return 25;
  }

  function mobileGridColumns(tileCount) {
    if (tileCount <= 4) return Math.max(1, tileCount);
    if (tileCount <= 12) return 4;
    if (tileCount <= 30) return 6;
    if (tileCount <= 80) return 8;
    return 10;
  }

  function ratioPercent(value, maximum) {
    if (maximum <= 0n) return 0;
    return Number((value * 10000n) / maximum) / 100;
  }

  function headSvg() {
    const headWord = tr("头", "HEAD");
    return `<svg class="cr-head-svg" viewBox="0 0 120 120" role="img" aria-label="${copy("headAria")}">
      <path d="M22 91 Q60 70 98 91" fill="none" stroke="#d8cdb9" stroke-width="5" stroke-linecap="round" />
      <circle cx="60" cy="50" r="32" fill="#fff1c9" stroke="#243149" stroke-width="5" />
      <circle cx="48" cy="43" r="3.5" fill="#243149" />
      <circle cx="72" cy="43" r="3.5" fill="#243149" />
      <text x="60" y="61" fill="#243149" font-size="25" font-weight="900" text-anchor="middle">1</text>
      <text x="60" y="77" fill="#667085" font-size="10" font-weight="900" text-anchor="middle">${headWord}</text>
    </svg>`;
  }

  function creatureSvg(type, options = {}) {
    const isRabbit = type === "rabbit";
    const showExtra = Boolean(options.showExtra);
    const headWord = tr("头", "HEAD");
    const aria = copy(isRabbit ? "rabbitAria" : "chickenAria");
    const headFill = isRabbit ? "#66a7d9" : "#f4b942";
    const bodyFill = isRabbit ? "#cce8f7" : "#ffe3a0";
    const legColor = isRabbit ? "#275a87" : "#a45d00";
    const baseLegColor = showExtra ? "#a45d00" : legColor;
    const extraLegColor = showExtra ? "#d96c4b" : legColor;
    const earsOrCrest = isRabbit
      ? `<ellipse cx="47" cy="15" rx="8" ry="23" fill="#9fd1ef" stroke="#243149" stroke-width="4" />
         <ellipse cx="73" cy="15" rx="8" ry="23" fill="#9fd1ef" stroke="#243149" stroke-width="4" />`
      : `<path d="M43 30 L49 17 L57 30 L65 16 L71 31" fill="#f4b942" stroke="#243149" stroke-width="4" stroke-linejoin="round" />
         <path d="M87 50 L101 57 L87 64 Z" fill="#d96c4b" stroke="#243149" stroke-width="3" stroke-linejoin="round" />`;
    const legs = isRabbit
      ? `<path d="M39 83 V109 M81 83 V109" stroke="${baseLegColor}" stroke-width="7" stroke-linecap="round" />
         <path d="M53 83 V109 M67 83 V109" stroke="${extraLegColor}" stroke-width="7" stroke-linecap="round" />
         <circle cx="39" cy="111" r="5" fill="#243149" /><circle cx="53" cy="111" r="5" fill="#243149" />
         <circle cx="67" cy="111" r="5" fill="#243149" /><circle cx="81" cy="111" r="5" fill="#243149" />`
      : `<path d="M46 83 V109 M74 83 V109" stroke="${legColor}" stroke-width="8" stroke-linecap="round" />
         <circle cx="46" cy="111" r="5" fill="#243149" /><circle cx="74" cy="111" r="5" fill="#243149" />`;
    return `<svg class="cr-creature-svg" viewBox="0 0 120 120" role="img" aria-label="${aria}">
      ${earsOrCrest}
      <circle cx="60" cy="48" r="27" fill="${headFill}" stroke="#243149" stroke-width="5" />
      <text x="60" y="54" fill="#243149" font-size="22" font-weight="900" text-anchor="middle">1</text>
      <text x="60" y="68" fill="#243149" font-size="8" font-weight="900" text-anchor="middle">${headWord}</text>
      <rect x="31" y="70" width="58" height="22" rx="11" fill="${bodyFill}" stroke="#243149" stroke-width="5" />
      ${legs}
    </svg>`;
  }

  function tileParts(count, unit) {
    const parts = [];
    const full = count / unit;
    const remainder = count % unit;
    for (let index = 0; index < Number(full); index += 1) parts.push(unit);
    if (remainder > 0n) parts.push(remainder);
    return parts;
  }

  function renderPopulation(problem, populations, options = {}) {
    const grouping = groupingFor(problem.heads);
    const tiles = [];
    populations.forEach((population) => {
      tileParts(population.count, grouping.unit).forEach((amount) => {
        tiles.push({ type: population.type, amount });
      });
    });
    const columns = gridColumns(tiles.length);
    const dense = tiles.length > 60;
    const tileHtml = tiles
      .map((tile, index) => {
        const visual = tile.type === "head" ? headSvg() : creatureSvg(tile.type, options);
        const badge = grouping.grouped || tile.amount !== 1n
          ? `<span class="cr-group-badge">${copy("groupBadge", { count: formatInteger(tile.amount) })}</span>`
          : "";
        return `<div class="${tile.type === "head" ? "cr-head-tile" : `cr-creature-tile is-${tile.type}`}" style="--tile-index:${index}" aria-hidden="true">${visual}${badge}</div>`;
      })
      .join("");
    const caption = grouping.grouped
      ? copy("eachSymbol", { count: formatInteger(grouping.unit) })
      : copy("exactSymbols");
    const remainders = populations
      .map((population) => population.count % grouping.unit)
      .filter((value) => value > 0n);
    const remainderCaption = remainders.length
      ? `<span class="cr-caption-chip">${copy("remainderSymbol", { count: formatInteger(remainders[remainders.length - 1]) })}</span>`
      : "";
    const populationCaption = populations
      .filter((population) => population.type !== "head")
      .map((population) => `<span class="cr-caption-chip is-${population.type}">${copy(population.type === "chicken" ? "chickenCount" : "rabbitCount", { count: formatInteger(population.count) })}</span>`)
      .join("");
    return `<div class="cr-population-wrap">
      <div class="cr-population-grid" role="img" aria-label="${caption}" style="--grid-columns:${columns};--mobile-grid-columns:${mobileGridColumns(tiles.length)};--grid-gap:${dense ? "3px" : "7px"};--tile-radius:${dense ? "6px" : "13px"};--tile-padding:${dense ? "1px" : "5px"}">${tileHtml}</div>
      <div class="cr-population-caption"><span class="cr-caption-chip">${caption}</span>${remainderCaption}${populationCaption}</div>
    </div>`;
  }

  function renderLegComparison(problem) {
    const maximum = problem.legs > problem.allChickenLegs ? problem.legs : problem.allChickenLegs;
    const rows = [
      {
        label: tr("实际腿数", "Actual legs"),
        value: problem.legs,
        color: "#d96c4b"
      },
      {
        label: tr("全当鸡", "All chickens"),
        value: problem.allChickenLegs,
        color: "#f4b942"
      }
    ];
    return `<div class="cr-leg-comparison">
      ${rows.map((row) => `<div class="cr-leg-row">
        <div class="cr-leg-row-label"><span>${row.label}</span><strong>${formatInteger(row.value)}</strong></div>
        <div class="cr-leg-track" aria-hidden="true"><div class="cr-leg-fill" style="--bar-width:${ratioPercent(row.value, maximum)}%;--bar-color:${row.color}"></div></div>
        <span>${tr("条", "legs")}</span>
      </div>`).join("")}
      <div class="cr-leg-difference">${tr("多出", "Extra")}<br>${formatInteger(problem.extraLegs)} ${tr("条", "legs")}</div>
    </div>`;
  }

  function renderCreatureComparison() {
    return `<div class="cr-compare-creatures">
      <section class="cr-creature-card is-chicken">
        ${creatureSvg("chicken")}
        <h3>${tr("鸡", "Chicken")}</h3>
        <p>${tr("已经有2条，不用再补", "Already has 2; add 0")}</p>
      </section>
      <div class="cr-compare-arrow" aria-hidden="true">→</div>
      <section class="cr-creature-card is-rabbit">
        ${creatureSvg("rabbit", { showExtra: true })}
        <h3>${tr("兔", "Rabbit")}</h3>
        <p>${tr("已经有2条，还要补2条", "Already has 2; add 2")}</p>
      </section>
    </div>`;
  }

  function renderPairGrid(problem) {
    if (problem.rabbits === 0n) {
      return `<div class="cr-stage-note">${copy("noExtra")}</div>`;
    }
    const grouping = groupingFor(problem.heads);
    const parts = tileParts(problem.rabbits, grouping.unit);
    const columns = gridColumns(parts.length);
    const tiles = parts.map((amount, index) => `<div class="cr-pair-tile" style="--tile-index:${index}">
      <span class="cr-pair-legs" aria-hidden="true"><span class="cr-pair-leg"></span><span class="cr-pair-leg"></span></span>
      <span class="cr-pair-label">${copy("pairGroups", { count: formatInteger(amount) })}</span>
    </div>`).join("");
    const caption = grouping.grouped
      ? tr(`每个“2条腿”图形代表 ${formatInteger(grouping.unit)} 组`, `Each two-leg symbol represents ${formatInteger(grouping.unit)} groups`)
      : tr("每个图形就是一组2条腿", "Each symbol is one pair of legs");
    return `<div class="cr-pair-grid" role="img" aria-label="${caption}" style="--grid-columns:${columns};--mobile-grid-columns:${mobileGridColumns(parts.length)};--pair-height:${parts.length > 80 ? "48px" : "76px"}">${tiles}</div>
      <div class="cr-population-caption"><span class="cr-caption-chip">${caption}</span></div>`;
  }

  function buildSlides(problem) {
    const h = formatInteger(problem.heads);
    const l = formatInteger(problem.legs);
    const assumed = formatInteger(problem.allChickenLegs);
    const extra = formatInteger(problem.extraLegs);
    const rabbits = formatInteger(problem.rabbits);
    const chickens = formatInteger(problem.chickens);
    return [
      {
        id: "intro",
        label: tr("读题", "Read"),
        title: tr("先只看头和腿", "Start with heads and legs"),
        question: tr(`笼子里有 ${h} 个头、${l} 条腿，我们要找什么？`, `There are ${h} heads and ${l} legs. What are we trying to find?`),
        lead: tr("现在还不知道哪些是鸡、哪些是兔，只把每一个头清楚地摆出来。", "We do not yet know which are chickens or rabbits. First, show every head clearly."),
        formula: [`${h} ${tr("个头", "heads")}`, `${l} ${tr("条腿", "legs")}`]
      },
      {
        id: "all-chickens",
        label: tr("全当鸡", "All chickens"),
        title: tr("给每个头先配2条腿", "Give every head 2 legs"),
        question: tr("如果这些动物全是鸡，一共需要多少条腿？", "If every animal were a chicken, how many legs would there be?"),
        lead: tr("无论最后是鸡还是兔，它都至少有2条腿。先给每个头放上这2条。", "Whether it is a chicken or a rabbit, it has at least 2 legs. Give every head those first 2 legs."),
        formula: [`${h} × 2 = ${assumed}`, `${tr("假设腿数", "Assumed legs")} = ${assumed}`]
      },
      {
        id: "extra-legs",
        label: tr("找多腿", "Find extra"),
        title: tr("实际比假设多了多少条腿？", "How many extra legs are there?"),
        question: tr(`实际有 ${l} 条，已经放了 ${assumed} 条，还差多少条？`, `There are ${l} actual legs and ${assumed} assumed legs. How many remain?`),
        lead: tr("这些多出来的腿还没有主人。下一步要弄清楚：它们为什么能帮助我们找到兔子。", "These extra legs do not have owners yet. Next, we will see why they identify the rabbits."),
        formula: [`${l} − ${assumed} = ${extra}`, `${tr("多出的腿", "Extra legs")} = ${extra}`]
      },
      {
        id: "compare",
        label: tr("比一比", "Compare"),
        title: tr("兔子不是多4条，而是多2条", "A rabbit adds 2, not 4"),
        question: tr("同样已经分到2条腿，鸡和兔还分别缺几条？", "After both receive 2 legs, how many more does each need?"),
        lead: tr("兔子的4条腿里，有2条已经在“全当鸡”时算过了。现在只需要补另外2条。", "Of a rabbit's 4 legs, 2 were already counted in the all-chicken assumption. Only 2 more must be added."),
        formula: [`${tr("鸡", "Chicken")}: 2 − 2 = 0`, `${tr("兔", "Rabbit")}: 4 − 2 = 2`]
      },
      {
        id: "pairs",
        label: tr("两条一组", "Make pairs"),
        title: tr("把多出的腿两条一组", "Group the extra legs in pairs"),
        question: tr(`${extra} 条多出来的腿，可以分成多少组？`, `How many pairs can be made from ${extra} extra legs?`),
        lead: tr("这里除以2是在数“多出的腿有几组”，还不是在用兔子的全部4条腿做除法。", "Dividing by 2 counts pairs of extra legs. It does not divide by all 4 legs of a rabbit."),
        formula: [`${extra} ÷ 2 = ${rabbits}`, `${rabbits} ${tr("组", "pairs")}`]
      },
      {
        id: "rabbits",
        label: tr("找到兔", "Find rabbits"),
        title: tr("一组多余腿，对应一只兔", "One extra pair means one rabbit"),
        question: tr("为什么多出的腿除以2，就得到兔子的数量？", "Why does extra legs divided by 2 give the rabbit count?"),
        lead: tr("每只兔在已经分到2条腿以后，恰好还需要补2条。每补一组，就把一只“假设的鸡”变成真正的兔。", "After receiving the first 2 legs, each rabbit needs exactly 2 more. Every pair changes one assumed chicken into a rabbit."),
        formula: [
          `${tr("兔子数", "Rabbits")} = ${tr("多出的腿", "extra legs")} ÷ ${tr("每只兔多出的腿", "extra per rabbit")}`,
          `${extra} ÷ 2 = <strong>${rabbits}</strong>`
        ]
      },
      {
        id: "chickens",
        label: tr("找到鸡", "Find chickens"),
        title: tr("剩下的就是鸡", "The rest are chickens"),
        question: tr(`${h} 只动物中有 ${rabbits} 只兔，还剩多少只鸡？`, `Out of ${h} animals, ${rabbits} are rabbits. How many chickens remain?`),
        lead: tr("总只数没有改变。找到兔子以后，用总数减去兔子数，就得到鸡的数量。", "The total number of animals has not changed. Subtract the rabbits from the total to find the chickens."),
        formula: [`${h} − ${rabbits} = <strong>${chickens}</strong>`, `${tr("鸡的数量", "Chicken count")} = ${chickens}`]
      },
      {
        id: "answer",
        label: tr("验证", "Check"),
        title: tr("头数和腿数都要对上", "Both totals must match"),
        question: tr("算出的鸡和兔，头数、腿数都符合原题吗？", "Do the calculated chickens and rabbits match both totals?"),
        lead: tr("只有头数和腿数同时对上，答案才算检查完成。", "The answer is confirmed only when both the head total and leg total match."),
        formula: [
          `${chickens} + ${rabbits} = ${formatInteger(problem.checkedHeads)}`,
          `${chickens} × 2 + ${rabbits} × 4 = ${formatInteger(problem.checkedLegs)}`
        ]
      }
    ];
  }

  function slideHeader(slide, index, total) {
    return `<header class="cr-slide-head">
      <div><p class="cr-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div>
      <span class="cr-slide-number">${index + 1}/${total}</span>
    </header>`;
  }

  function renderSlideBody(problem, slide) {
    if (slide.id === "intro") {
      return `<div class="cr-scale-banner">
        <div><span>${tr("头的总数", "Total heads")}</span><strong>${formatInteger(problem.heads)}</strong></div>
        <div><span>${tr("腿的总数", "Total legs")}</span><strong>${formatInteger(problem.legs)}</strong></div>
      </div>${renderPopulation(problem, [{ type: "head", count: problem.heads }])}`;
    }
    if (slide.id === "all-chickens") {
      return `${renderPopulation(problem, [{ type: "chicken", count: problem.heads }])}`;
    }
    if (slide.id === "extra-legs") return renderLegComparison(problem);
    if (slide.id === "compare") return renderCreatureComparison();
    if (slide.id === "pairs") return renderPairGrid(problem);
    if (slide.id === "rabbits") {
      return `<div class="cr-one-to-one">
        <div class="cr-pair-tile"><span class="cr-pair-legs" aria-hidden="true"><span class="cr-pair-leg"></span><span class="cr-pair-leg"></span></span><span class="cr-pair-label">${tr("1组多余腿", "1 extra pair")}</span></div>
        <div class="cr-one-to-one-arrow" aria-hidden="true">→</div>
        <div class="cr-creature-card is-rabbit">${creatureSvg("rabbit", { showExtra: true })}<h3>${tr("1只兔", "1 rabbit")}</h3></div>
      </div><div class="cr-one-to-one-equation">${tr("每一组2条腿，都只会补给一只兔。", "Every pair of 2 legs is added to exactly one rabbit.")}</div>`;
    }
    if (slide.id === "chickens") {
      return `<div class="cr-split-summary">
        <div class="is-chicken"><span>${tr("剩下的鸡", "Chickens left")}</span><strong>${formatInteger(problem.chickens)}</strong></div>
        <div class="is-rabbit"><span>${tr("已经找到的兔", "Rabbits found")}</span><strong>${formatInteger(problem.rabbits)}</strong></div>
      </div>${renderPopulation(problem, [
        { type: "chicken", count: problem.chickens },
        { type: "rabbit", count: problem.rabbits }
      ])}`;
    }
    return `<div class="cr-split-summary">
      <div class="is-chicken"><span>${tr("鸡", "Chickens")}</span><strong>${formatInteger(problem.chickens)}</strong></div>
      <div class="is-rabbit"><span>${tr("兔", "Rabbits")}</span><strong>${formatInteger(problem.rabbits)}</strong></div>
    </div>
    <div class="cr-check-grid">
      <section class="cr-check-card"><span>✓ ${tr("头数检查", "Head check")}</span><strong>${formatInteger(problem.chickens)} + ${formatInteger(problem.rabbits)} = ${formatInteger(problem.checkedHeads)}</strong></section>
      <section class="cr-check-card"><span>✓ ${tr("腿数检查", "Leg check")}</span><strong>${formatInteger(problem.chickens)} × 2 + ${formatInteger(problem.rabbits)} × 4 = ${formatInteger(problem.checkedLegs)}</strong></section>
    </div>
    <div class="cr-answer-banner"><p>${copy("answer", { chickens: formatInteger(problem.chickens), rabbits: formatInteger(problem.rabbits) })}</p></div>`;
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="cr-board-label">${copy("currentQuestion")}</p>
      <h2>${slide.question}</h2>
      <p class="cr-board-lead">${slide.lead}</p>
      <div class="cr-formula"><span class="cr-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="cr-formula-line">${line}</span>`).join("")}</div>`;
  }

  function renderStaticCopy(problem) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelector("[data-heads-summary]").textContent = formatInteger(problem.heads);
    app.querySelector("[data-legs-summary]").textContent = formatInteger(problem.legs);
  }

  function renderProgress(slides) {
    progress.innerHTML = slides.map((slide, index) => `<span class="cr-progress-step ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" ${index === slideIndex ? 'aria-current="step"' : ""}>${index < slideIndex ? "✓ " : ""}${slide.label}</span>`).join("");
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
    stage.innerHTML = `<article class="cr-slide">${slideHeader(slide, slideIndex, slides.length)}${renderSlideBody(problem, slide)}</article>`;
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
    app.querySelector("[data-setting='heads']").value = state.heads;
    app.querySelector("[data-setting='legs']").value = state.legs;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-heads") return copy("invalidHeads");
    if (problem.reason === "invalid-legs") return copy("invalidLegs");
    if (problem.reason === "odd-legs") return copy("oddLegs");
    if (problem.reason === "too-few-legs") {
      return copy("tooFewLegs", { heads: formatInteger(problem.heads), minimum: formatInteger(problem.minimumLegs) });
    }
    if (problem.reason === "too-many-legs") {
      return copy("tooManyLegs", { heads: formatInteger(problem.heads), maximum: formatInteger(problem.maximumLegs) });
    }
    return tr("请输入有效的头数和腿数。", "Enter valid head and leg totals.");
  }

  function applySettings() {
    const nextHeads = app.querySelector("[data-setting='heads']").value.trim();
    const nextLegs = app.querySelector("[data-setting='legs']").value.trim();
    const problem = MathLabModels.quantity.chickenRabbitState(nextHeads, nextLegs);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }
    state.heads = problem.heads.toString();
    state.legs = problem.legs.toString();
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
