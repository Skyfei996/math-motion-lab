(function () {
  const app = document.querySelector("[data-number-card-app]");
  if (!app || !window.MathLabModels || !window.MathLab) return;

  const stage = app.querySelector("[data-stage]");
  const board = app.querySelector("[data-board]");
  const progress = app.querySelector("[data-progress]");
  const pageCount = app.querySelector("[data-page-count]");
  const nextLabel = app.querySelector("[data-next-label]");
  const prevButton = app.querySelector("[data-action='prev']");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");

  const state = { quotient: "17", remainder: "6", totalSum: "479" };
  let slideIndex = 0;

  const copies = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "数字换卡破案",
      skipStage: "跳到讲题舞台",
      back: "返回课程目录",
      edit: "编辑题目",
      fullscreen: "全屏讲解",
      quotient: "商",
      remainder: "余数",
      fourNumberSum: "四数和",
      problemQuestion: "求被除数和除数",
      currentProblem: "当前题目",
      progressLabel: "讲解进度",
      prev: "上一页",
      next: "下一页",
      replay: "重新播放",
      parameters: "题目参数",
      settingsTitle: "编辑数字换卡题",
      settingsLead: "应用后会检查是否能得到符合余数规则的整数答案，并从第1页重新讲解。",
      quotientLabel: "商",
      remainderLabel: "余数",
      totalLabel: "被除数、除数、商和余数的和",
      validityTitle: "有效题目需要满足",
      validityWhole: "商和总和是正整数，余数是0或正整数",
      validityDivisor: "换卡后能平均分成整数个相同的除数",
      validityRemainder: "余数必须小于算出的除数",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      pageCount: "第 {current} 页 / 共 {total} 页",
      currentQuestion: "本页问题",
      blackboard: "本页板书",
      dividend: "被除数",
      divisor: "除数",
      hidden: "待破案",
      divisionMachine: "除法拆解机",
      insideDividend: "藏在被除数里面",
      listedRemainder: "四个数中的余数",
      quotientCard: "四个数中的商",
      originalDivisor: "原题中的1个除数",
      sameClueTwice: "同一个余数线索，在总和中影响了两个位置",
      exactSameClueTwice: "虽然都是0，两个位置的来源仍然不同",
      knownBasket: "已知数篮子",
      equalDivisorCards: "{count}个相同的除数",
      compressedCards: "中间省略，共{count}个",
      oneDivisor: "1个除数",
      divisorValue: "除数 = {value}",
      dividendValue: "被除数 = {value}",
      passed: "检查通过",
      answer: "答：被除数是 {dividend}，除数是 {divisor}。",
      invalidQuotient: "商必须是大于0的整数。",
      invalidRemainder: "余数必须是0或正整数。",
      invalidTotal: "四个数的和必须是大于0的整数。",
      totalTooSmall: "总和太小，连商和两处余数的已知数都放不下。",
      nonWholeDivisor: "去掉已知数后，剩余数量不能平均分成 {parts} 个除数，得不到整数答案。",
      remainderNotLess: "算出的除数是 {divisor}，余数 {remainder} 没有小于除数，不符合有余数除法的规则。"
    },
    "en-US": {
      labName: "Elementary Math Interactive Classroom",
      title: "The Number-Card Mystery",
      skipStage: "Skip to lesson stage",
      back: "Back to catalog",
      edit: "Edit problem",
      fullscreen: "Fullscreen",
      quotient: "Quotient",
      remainder: "Remainder",
      fourNumberSum: "Four-number sum",
      problemQuestion: "Find the dividend and divisor",
      currentProblem: "Current problem",
      progressLabel: "Lesson progress",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      parameters: "Problem values",
      settingsTitle: "Edit the number-card mystery",
      settingsLead: "The values are checked for whole-number answers and a valid remainder, then the lesson restarts at page 1.",
      quotientLabel: "Quotient",
      remainderLabel: "Remainder",
      totalLabel: "Sum of dividend, divisor, quotient, and remainder",
      validityTitle: "A valid problem must satisfy",
      validityWhole: "The quotient and sum are positive whole numbers; the remainder is zero or positive",
      validityDivisor: "The swapped cards split into a whole-number divisor",
      validityRemainder: "The remainder is less than the calculated divisor",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      pageCount: "Page {current} of {total}",
      currentQuestion: "Question",
      blackboard: "Blackboard",
      dividend: "Dividend",
      divisor: "Divisor",
      hidden: "Mystery card",
      divisionMachine: "Division unpacker",
      insideDividend: "Inside the dividend",
      listedRemainder: "Remainder in the four-number sum",
      quotientCard: "Quotient in the four-number sum",
      originalDivisor: "The original divisor card",
      sameClueTwice: "The same remainder clue affects two places in the total",
      exactSameClueTwice: "Both values are zero, but the two places still have different sources",
      knownBasket: "Known-number basket",
      equalDivisorCards: "{count} equal divisor cards",
      compressedCards: "Middle cards hidden; {count} in all",
      oneDivisor: "1 divisor",
      divisorValue: "Divisor = {value}",
      dividendValue: "Dividend = {value}",
      passed: "Check passed",
      answer: "Answer: the dividend is {dividend}, and the divisor is {divisor}.",
      invalidQuotient: "The quotient must be a whole number greater than 0.",
      invalidRemainder: "The remainder must be zero or a positive whole number.",
      invalidTotal: "The four-number sum must be a whole number greater than 0.",
      totalTooSmall: "The total is too small to hold the quotient and both remainder contributions.",
      nonWholeDivisor: "After removing the known numbers, the remainder cannot be shared among {parts} divisor cards as a whole number.",
      remainderNotLess: "The calculated divisor is {divisor}, but the remainder {remainder} is not smaller than it."
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
    return MathLabModels.quantity.quotientRemainderSumState(values.quotient, values.remainder, values.totalSum);
  }

  function numberCard(role, value, options = {}) {
    const roleLabel = copy(role);
    const classes = ["nc-number-card", `is-${role}`];
    if (options.hidden) classes.push("is-hidden");
    if (options.small) classes.push("is-small");
    if (options.delta) classes.push("nc-delta");
    const number = options.hidden ? "?" : formatInteger(value);
    const note = options.hidden ? copy("hidden") : roleLabel;
    return `<div class="${classes.join(" ")}" aria-label="${roleLabel}: ${number}"><span>${note}</span><strong>${number}</strong></div>`;
  }

  function divisorTile(value = null, extraClass = "") {
    return `<span class="nc-divisor-tile ${extraClass}" aria-hidden="true"><small>${copy("divisor")}</small><strong>${value === null ? "?" : formatInteger(value)}</strong></span>`;
  }

  function tileGroup(count, value = null, extraClass = "") {
    const compressed = count > 18n;
    const visible = compressed ? 6 : Number(count);
    const columns = Math.min(9, Math.max(1, visible));
    const tiles = Array.from({ length: visible }, (_, index) => divisorTile(value, index === visible - 1 && extraClass ? extraClass : "")).join("");
    const summary = compressed ? `<span class="nc-compressed-tile">…<small>${copy("compressedCards", { count: formatInteger(count) })}</small></span>` : "";
    return `<div class="nc-tile-group" style="--tile-columns:${columns}" role="img" aria-label="${copy("equalDivisorCards", { count: formatInteger(count) })}">${tiles}${summary}</div>`;
  }

  function mergedTileGroup(problem) {
    const compressed = problem.equalParts > 18n;
    if (compressed) {
      return `<div class="nc-merged-compressed" role="img" aria-label="${copy("equalDivisorCards", { count: formatInteger(problem.equalParts) })}">
        <span>${formatInteger(problem.quotient)} × ${copy("divisor")}</span><b>＋</b><span class="is-new">${copy("oneDivisor")}</span><b>＝</b><strong>${formatInteger(problem.equalParts)} × ${copy("divisor")}</strong>
      </div>`;
    }
    const total = Number(problem.equalParts);
    const tiles = Array.from({ length: total }, (_, index) => divisorTile(null, index === total - 1 ? "is-original" : "")).join("");
    return `<div class="nc-tile-group is-merged nc-delta" style="--tile-columns:${Math.min(9, total)}" role="img" aria-label="${copy("equalDivisorCards", { count: formatInteger(problem.equalParts) })}">${tiles}</div>`;
  }

  function buildSlides(problem) {
    const q = formatInteger(problem.quotient);
    const r = formatInteger(problem.remainder);
    const total = formatInteger(problem.totalSum);
    const parts = formatInteger(problem.equalParts);
    const known = formatInteger(problem.knownNumbersTotal);
    const partsTotal = formatInteger(problem.equalPartsTotal);
    const divisor = formatInteger(problem.divisor);
    const dividend = formatInteger(problem.dividend);
    const exact = problem.remainder === 0n;

    return [
      {
        id: "intro",
        label: tr("读题", "Read"),
        title: tr("四张数字卡，两张还没翻开", "Four cards, with two still hidden"),
        question: tr("题目已经告诉了我们哪两个数？还要找哪两个数？", "Which two numbers are known, and which two must we find?"),
        lead: tr(`商是${q}，余数是${r}，被除数、除数、商和余数的和是${total}。先认清四张卡的身份，不急着计算。`, `The quotient is ${q}, the remainder is ${r}, and all four numbers add to ${total}. First identify the four roles without calculating yet.`),
        formula: [`${copy("dividend")} ÷ ${copy("divisor")} = ${q} ${copy("remainder")} ${r}`, `${copy("dividend")} + ${copy("divisor")} + ${q} + ${r} = ${total}`]
      },
      {
        id: "unpack",
        label: tr("拆开", "Unpack"),
        title: exact ? tr("被除数正好装着整份除数", "The dividend contains whole divisor groups") : tr("被除数里装着整份和余下部分", "The dividend holds full groups and a leftover"),
        question: tr(`商${q}余${r}，说明被除数里面藏着什么？`, `With quotient ${q} and remainder ${r}, what is packed inside the dividend?`),
        lead: exact
          ? tr(`能完整取出${q}个除数，并且没有剩余。`, `We can take out ${q} complete divisor groups with nothing left over.`)
          : tr(`能完整取出${q}个除数，取完后还剩${r}。`, `We can take out ${q} complete divisor groups and still have ${r} left.`),
        formula: [`${copy("dividend")} = ${q} × ${copy("divisor")} + ${r}`]
      },
      {
        id: "swap",
        label: tr("换卡", "Swap"),
        title: tr("不知道卡面，也能按里面的内容替换", "Swap the unknown card for what it contains"),
        question: tr("把被除数卡换开以后，四数总和变成了什么？", "After swapping the dividend card, what does the four-number sum contain?"),
        lead: tr("我们还不知道被除数的数字，却已经知道它由哪些部分组成。把整张卡换成这些部分，数量不会改变。", "We do not know the dividend yet, but we know its parts. Replacing the card with those parts keeps the total unchanged."),
        formula: [`${q} × ${copy("divisor")} + ${r} + ${copy("divisor")} + ${q} + ${r} = ${total}`]
      },
      {
        id: "two-remainders",
        label: tr("看两个余数", "Two places"),
        title: exact ? tr("两个位置都写0，来源仍不同", "Both places show zero, but for different reasons") : tr(`为什么换卡后出现了两个${r}？`, `Why does ${r} appear twice after the swap?`),
        question: tr(`两个${r}分别从哪里来？`, `Where does each ${r} come from?`),
        lead: exact
          ? tr("一个0来自被除数拆开后的剩余部分，另一个0是四个数中单独参加相加的余数。它们都不改变总和，但身份不同。", "One zero is the leftover inside the unpacked dividend; the other is the remainder listed among the four numbers. Neither changes the sum, but their roles differ.")
          : tr(`这不是做除法剩下了两堆${r}。一个${r}在被除数里面，另一个${r}是题目要求单独相加的余数。`, `Division did not produce two leftover piles. One ${r} is inside the dividend, while the other is the remainder added as one of the four numbers.`),
        formula: [`[${q} × ${copy("divisor")} + ${r}] + ${copy("divisor")} + ${q} + ${r} = ${total}`]
      },
      {
        id: "group",
        label: tr("同类归队", "Group matches"),
        title: tr("除数和除数站一队，已知数站一队", "Put matching divisor cards together"),
        question: tr(`为什么现在共有${parts}个相同的除数？`, `Why are there now ${parts} equal divisor cards?`),
        lead: tr(`被除数里面有${q}个除数，原题中还有1个除数，合起来是${parts}个。其余已知数是${r}、${q}、${r}。`, `The dividend contains ${q} divisor cards, and the original sum has one more. That makes ${parts}. The other known numbers are ${r}, ${q}, and ${r}.`),
        formula: [`${q} + 1 = ${parts} ${tr("个除数", "divisor cards")}`, `${r} + ${q} + ${r} = ${known}`]
      },
      {
        id: "remove-known",
        label: tr("搬走已知数", "Remove known"),
        title: tr(`先从${total}中搬走已知的${known}`, `Remove the known ${known} from ${total}`),
        question: tr(`剩下的${partsTotal}表示什么？`, `What does the remaining ${partsTotal} represent?`),
        lead: tr(`总和可以看成“${parts}个除数＋${known}”。搬走已知数后，留下的全都是相同的除数。`, `The total is “${parts} divisor cards plus ${known}.” After removing the known numbers, only equal divisor cards remain.`),
        formula: [`${total} − ${known} = <strong>${partsTotal}</strong>`, `${parts} ${tr("个除数合起来", "divisor cards together")} = ${partsTotal}`]
      },
      {
        id: "find-divisor",
        label: tr("求除数", "Find divisor"),
        title: tr(`把${partsTotal}平均放进${parts}张卡`, `Share ${partsTotal} among ${parts} equal cards`),
        question: tr("每一张除数卡是多少？余数符合规则吗？", "What is each divisor card worth, and is the remainder valid?"),
        lead: tr(`每张卡同样大，所以用${partsTotal}除以${parts}。还要检查余数必须小于除数。`, `All cards are equal, so divide ${partsTotal} by ${parts}. Then check that the remainder is smaller than the divisor.`),
        formula: [`${partsTotal} ÷ ${parts} = <strong>${divisor}</strong>`, `${r} < ${divisor}　✓`]
      },
      {
        id: "find-dividend",
        label: tr("拼回被除数", "Rebuild"),
        title: tr("把除数卡和余数重新装回去", "Pack the divisor cards and remainder back together"),
        question: tr(`有${q}个${divisor}，再加${r}，被除数是多少？`, `What is the dividend after packing ${q} groups of ${divisor} and ${r} more?`),
        lead: tr("现在除数已经找到了，按除法拆解机留下的线索，把被除数重新拼回来。", "Now that the divisor is known, use the unpacking clue to rebuild the dividend."),
        formula: [`${divisor} × ${q} + ${r} = <strong>${dividend}</strong>`]
      },
      {
        id: "verify",
        label: tr("双重验证", "Double check"),
        title: tr("两把锁都打开，答案才成立", "The answer is confirmed only when both locks open"),
        question: tr("除法关系和四数总和都符合原题吗？", "Do both the division relationship and the four-number sum match?"),
        lead: tr("先检查商和余数，再检查四个数的和。两项都正确，才能完整作答。", "Check the quotient and remainder first, then check the sum of all four numbers. Both must be correct."),
        formula: [`${dividend} ÷ ${divisor} = ${formatInteger(problem.checkedQuotient)} ${copy("remainder")} ${formatInteger(problem.checkedRemainder)}`, `${dividend} + ${divisor} + ${q} + ${r} = ${formatInteger(problem.checkedSum)}`]
      }
    ];
  }

  function slideHeader(slide, index, total) {
    return `<header class="nc-slide-head"><div><p class="nc-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div><span class="nc-slide-number">${index + 1}/${total}</span></header>`;
  }

  function equationSymbol(symbol) {
    return `<span class="nc-equation-symbol" aria-hidden="true">${symbol}</span>`;
  }

  function renderSlideBody(problem, slide) {
    const q = formatInteger(problem.quotient);
    const r = formatInteger(problem.remainder);
    const total = formatInteger(problem.totalSum);
    const parts = formatInteger(problem.equalParts);
    const known = formatInteger(problem.knownNumbersTotal);
    const partsTotal = formatInteger(problem.equalPartsTotal);
    const divisor = formatInteger(problem.divisor);
    const dividend = formatInteger(problem.dividend);

    if (slide.id === "intro") {
      return `<div class="nc-opening-scene">
        <p class="nc-full-problem">${tr(
          `两数相除，商为${q}，余数为${r}。被除数、除数、商和余数的和是${total}。被除数和除数分别是多少？`,
          `Two numbers are divided. The quotient is ${q}, the remainder is ${r}, and the dividend, divisor, quotient, and remainder add to ${total}. What are the dividend and divisor?`
        )}</p>
        <div class="nc-opening-division">${numberCard("dividend", 0n, { hidden: true })}${equationSymbol("÷")}${numberCard("divisor", 0n, { hidden: true })}${equationSymbol("=")}${numberCard("quotient", problem.quotient, { small: true })}${equationSymbol(tr("余", "R"))}${numberCard("remainder", problem.remainder, { small: true })}</div>
        <div class="nc-opening-sum">${numberCard("dividend", 0n, { hidden: true, small: true })}${equationSymbol("+")}${numberCard("divisor", 0n, { hidden: true, small: true })}${equationSymbol("+")}${numberCard("quotient", problem.quotient, { small: true })}${equationSymbol("+")}${numberCard("remainder", problem.remainder, { small: true })}${equationSymbol("=")}<strong>${total}</strong></div>
        <p class="nc-opening-prompt">${tr("说一说：知道什么？要找什么？", "Tell the class: What is known, and what must be found?")}</p>
      </div>`;
    }

    if (slide.id === "unpack") {
      return `<div class="nc-machine-scene">
        <div class="nc-machine-input">${numberCard("dividend", 0n, { hidden: true })}</div>
        <div class="nc-machine-arrow"><span aria-hidden="true">→</span><small>${copy("divisionMachine")}</small></div>
        <div class="nc-machine-output nc-delta">
          ${tileGroup(problem.quotient)}
          <div class="nc-output-plus">${equationSymbol("+")}${numberCard("remainder", problem.remainder, { small: true })}</div>
        </div>
      </div>`;
    }

    if (slide.id === "swap") {
      return `<div class="nc-swap-scene">
        <div class="nc-swap-line is-before">${numberCard("dividend", 0n, { hidden: true, small: true })}${equationSymbol("+")}${numberCard("divisor", 0n, { hidden: true, small: true })}${equationSymbol("+")}${numberCard("quotient", problem.quotient, { small: true })}${equationSymbol("+")}${numberCard("remainder", problem.remainder, { small: true })}${equationSymbol("=")}<strong>${total}</strong></div>
        <div class="nc-swap-arrow"><span aria-hidden="true">↓</span><strong>${tr("打开被除数卡，按内容换卡", "Open the dividend and swap in its contents")}</strong></div>
        <div class="nc-swap-line is-after nc-delta"><span class="nc-group-card"><b>${q}</b><small>× ${copy("divisor")}</small></span>${equationSymbol("+")}${numberCard("remainder", problem.remainder, { small: true })}${equationSymbol("+")}${numberCard("divisor", 0n, { hidden: true, small: true })}${equationSymbol("+")}${numberCard("quotient", problem.quotient, { small: true })}${equationSymbol("+")}${numberCard("remainder", problem.remainder, { small: true })}${equationSymbol("=")}<strong>${total}</strong></div>
      </div>`;
    }

    if (slide.id === "two-remainders") {
      return `<div class="nc-two-remainders">
        <section class="nc-remainder-source nc-delta"><span class="nc-source-tag">①</span>${numberCard("remainder", problem.remainder)}<h3>${copy("insideDividend")}</h3><p>${q} × ${copy("divisor")} <b>＋ ${r}</b></p></section>
        <div class="nc-not-same-piles"><span aria-hidden="true">＝</span><strong>${problem.remainder === 0n ? copy("exactSameClueTwice") : copy("sameClueTwice")}</strong></div>
        <section class="nc-remainder-source nc-delta"><span class="nc-source-tag">②</span>${numberCard("remainder", problem.remainder)}<h3>${copy("listedRemainder")}</h3><p>${copy("dividend")} + ${copy("divisor")} + ${q} <b>＋ ${r}</b></p></section>
      </div>`;
    }

    if (slide.id === "group") {
      return `<div class="nc-group-scene">
        <section class="nc-group-lane"><div class="nc-lane-label"><strong>${tr("除数归队", "Group divisor cards")}</strong><span>${q} + 1 = ${parts}</span></div>${mergedTileGroup(problem)}<p><span class="nc-origin-key"></span>${copy("originalDivisor")}</p></section>
        <section class="nc-known-basket nc-delta"><div><small>${copy("insideDividend")}</small><strong>${r}</strong></div>${equationSymbol("+")}<div><small>${copy("quotientCard")}</small><strong>${q}</strong></div>${equationSymbol("+")}<div><small>${copy("listedRemainder")}</small><strong>${r}</strong></div>${equationSymbol("=")}<div class="is-total"><small>${copy("knownBasket")}</small><strong>${known}</strong></div></section>
      </div>`;
    }

    if (slide.id === "remove-known") {
      return `<div class="nc-remove-scene">
        <div class="nc-total-equation"><span class="nc-parts-card"><strong>${parts}</strong><small>${tr("个相同的除数", "equal divisor cards")}</small></span>${equationSymbol("+")}<span class="nc-known-card"><strong>${known}</strong><small>${copy("knownBasket")}</small></span>${equationSymbol("=")}<b>${total}</b></div>
        <div class="nc-remove-arrow"><span aria-hidden="true">↓</span><strong>${total} − ${known}</strong></div>
        <div class="nc-parts-total nc-delta"><strong>${partsTotal}</strong><span>= ${copy("equalDivisorCards", { count: parts })}</span></div>
      </div>`;
    }

    if (slide.id === "find-divisor") {
      return `<div class="nc-find-divisor-scene">
        ${tileGroup(problem.equalParts, problem.divisor)}
        <div class="nc-each-result nc-delta"><span>${partsTotal} ÷ ${parts}</span><strong>${copy("divisorValue", { value: divisor })}</strong></div>
        <div class="nc-remainder-rule"><span>✓</span><strong>${copy("remainder")} ${r} &lt; ${copy("divisor")} ${divisor}</strong></div>
      </div>`;
    }

    if (slide.id === "find-dividend") {
      return `<div class="nc-rebuild-scene">
        <div class="nc-rebuild-parts">${tileGroup(problem.quotient, problem.divisor)}<div class="nc-output-plus">${equationSymbol("+")}${numberCard("remainder", problem.remainder, { small: true })}</div></div>
        <div class="nc-rebuild-arrow"><span aria-hidden="true">→</span><small>${tr("重新装回被除数", "Pack the dividend")}</small></div>
        <div class="nc-dividend-result nc-delta">${numberCard("dividend", problem.dividend)}<p>${divisor} × ${q} + ${r} = ${dividend}</p></div>
      </div>`;
    }

    return `<div class="nc-verify-scene">
      <section class="nc-lock-card"><span class="nc-lock-icon" aria-hidden="true">✓</span><div><small>${tr("第一把锁：除法关系", "Lock 1: division")}</small><strong>${dividend} ÷ ${divisor} = ${formatInteger(problem.checkedQuotient)} ${copy("remainder")} ${formatInteger(problem.checkedRemainder)}</strong><p>${copy("passed")}</p></div></section>
      <section class="nc-lock-card"><span class="nc-lock-icon" aria-hidden="true">✓</span><div><small>${tr("第二把锁：四数总和", "Lock 2: four-number sum")}</small><strong>${dividend} + ${divisor} + ${q} + ${r} = ${formatInteger(problem.checkedSum)}</strong><p>${copy("passed")}</p></div></section>
      <div class="nc-answer-banner nc-delta">${copy("answer", { dividend, divisor })}</div>
    </div>`;
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="nc-board-label">${copy("currentQuestion")}</p><h2>${slide.question}</h2><p class="nc-board-lead">${slide.lead}</p><div class="nc-formula"><span class="nc-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="nc-formula-line">${line}</span>`).join("")}</div>`;
  }

  function renderStaticCopy(problem) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelector(".nc-problem-strip").setAttribute("aria-label", copy("currentProblem"));
    progress.setAttribute("aria-label", copy("progressLabel"));
    app.querySelector("[data-quotient-summary]").textContent = formatInteger(problem.quotient);
    app.querySelector("[data-remainder-summary]").textContent = formatInteger(problem.remainder);
    app.querySelector("[data-total-summary]").textContent = formatInteger(problem.totalSum);
  }

  function renderProgress(slides) {
    progress.innerHTML = slides.map((slide, index) => `<button class="nc-progress-step ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" type="button" data-action="jump" data-index="${index}" ${index === slideIndex ? 'aria-current="step"' : ""}><span>${index < slideIndex ? "✓" : index + 1}</span>${slide.label}</button>`).join("");
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
    stage.innerHTML = `<article class="nc-slide">${slideHeader(slide, slideIndex, slides.length)}${renderSlideBody(problem, slide)}</article>`;
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
    app.querySelector("[data-setting='quotient']").value = state.quotient;
    app.querySelector("[data-setting='remainder']").value = state.remainder;
    app.querySelector("[data-setting='totalSum']").value = state.totalSum;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-quotient") return copy("invalidQuotient");
    if (problem.reason === "invalid-remainder") return copy("invalidRemainder");
    if (problem.reason === "invalid-total-sum") return copy("invalidTotal");
    if (problem.reason === "total-too-small") return copy("totalTooSmall");
    if (problem.reason === "non-whole-divisor") return copy("nonWholeDivisor", { parts: formatInteger(problem.equalParts) });
    if (problem.reason === "remainder-not-less") {
      return copy("remainderNotLess", { divisor: formatInteger(problem.divisor), remainder: formatInteger(problem.remainder) });
    }
    return tr("请输入能得到整数答案的有效数据。", "Enter values that produce valid whole-number answers.");
  }

  function applySettings() {
    const nextState = {
      quotient: app.querySelector("[data-setting='quotient']").value.trim(),
      remainder: app.querySelector("[data-setting='remainder']").value.trim(),
      totalSum: app.querySelector("[data-setting='totalSum']").value.trim()
    };
    const problem = result(nextState);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }
    state.quotient = problem.quotient.toString();
    state.remainder = problem.remainder.toString();
    state.totalSum = problem.totalSum.toString();
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
    if (action === "jump") {
      slideIndex = Number(button.dataset.index);
      render();
    }
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
