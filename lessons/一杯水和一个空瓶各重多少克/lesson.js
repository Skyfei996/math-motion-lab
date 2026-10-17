(function () {
  "use strict";

  const app = document.querySelector("[data-cup-weight-app]");
  const solve = window.MathLabModels?.quantity?.cupBottleWeightState;
  if (!app || typeof solve !== "function") {
    throw new Error("Cup and bottle weight model is unavailable.");
  }

  const DEFAULTS = Object.freeze({
    firstCups: "3",
    firstTotal: "440",
    secondCups: "5",
    secondTotal: "600"
  });

  const copy = {
    "zh-CN": {
      labName: "Math Motion Lab · 称重实验",
      title: "一杯水和一个空瓶各重多少克",
      edit: "修改题目",
      fullscreen: "全屏",
      exitFullscreen: "退出全屏",
      condition: "称重记录",
      conditionAria: "当前题目条件",
      navigationAria: "课件翻页",
      stageTitle: "杯水与空瓶称重比较舞台",
      cupsOfWater: "杯水",
      cups: "杯",
      sameBottle: "同一个空瓶",
      grams: "克",
      blackboard: "称重板书",
      clickHint: "点击舞台空白处继续",
      prev: "上一步",
      next: "下一步",
      restart: "重新讲解",
      parameters: "题目参数",
      settingsTitle: "修改两次称重",
      settingsLead: "应用后会重新计算，并从第1步开始讲解。",
      firstWeighing: "第一次称重",
      secondWeighing: "第二次称重",
      cupCount: "倒入杯数",
      totalWeight: "连瓶总重",
      validityTitle: "有效题目需要满足",
      validityPositive: "杯数和总重量都是大于0的整数",
      validityDifferent: "两次倒入的杯数不同，杯数更多时总重量也更大",
      validityWhole: "一杯水和空瓶的重量都是大于0的整数克",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      back: "返回课程目录",
      fewerRecord: "{round}：杯数较少",
      moreRecord: "{round}：杯数较多",
      firstRound: "第一次",
      secondRound: "第二次",
      fullProblem:
        "用同一个杯子往同一个空瓶里倒水。第一次倒入{firstCups}杯水，连瓶共重{firstTotal}克；第二次倒入{secondCups}杯水，连瓶共重{secondTotal}克。一杯水和一个空瓶各重多少克？",
      openingPrompt: "先说一说：题目告诉了我们什么？要找什么？",
      progress: "第 {current} 步 / 共 {total} 步",
      sameParts: "相同：空瓶＋{cups}杯水",
      extraCups: "多出的{cups}杯水",
      differenceMatch: "{cups}杯＝{weight}克",
      oneCupLabel: "每杯{weight}克",
      bottleResult: "空瓶重{weight}克",
      stageDescription:
        "同一个空瓶中倒入{fewerCups}杯水时共重{fewerTotal}克，倒入{moreCups}杯水时共重{moreTotal}克。",
      errors: {
        "invalid-first-cups": "第一次倒入杯数必须是大于0的整数。",
        "invalid-first-total": "第一次连瓶总重必须是大于0的整数克。",
        "invalid-second-cups": "第二次倒入杯数必须是大于0的整数。",
        "invalid-second-total": "第二次连瓶总重必须是大于0的整数克。",
        "same-cup-count": "两次倒入杯数不能相同，否则无法比较一杯水的重量。",
        "weight-direction-mismatch": "杯数更多的一次，总重量也必须更大。请检查两次称重记录。",
        "non-whole-cup-weight": "两次总重量的差不能平均分给杯数差，无法得到整数克的一杯水。",
        "non-positive-bottle-weight": "按这些数据算出的空瓶重量不大于0克，请检查称重记录。"
      }
    },
    "en-US": {
      labName: "Math Motion Lab · Weighing Lab",
      title: "How Much Do One Cup of Water and the Empty Bottle Weigh?",
      edit: "Edit problem",
      fullscreen: "Full screen",
      exitFullscreen: "Exit full screen",
      condition: "Weighing records",
      conditionAria: "Current problem conditions",
      navigationAria: "Lesson navigation",
      stageTitle: "Cup of water and empty bottle weighing stage",
      cupsOfWater: " cups of water",
      cups: " cups",
      sameBottle: "the same empty bottle",
      grams: " g",
      blackboard: "Weighing board",
      clickHint: "Click the open stage to continue",
      prev: "Previous step",
      next: "Next step",
      restart: "Restart lesson",
      parameters: "Problem values",
      settingsTitle: "Edit the two weighings",
      settingsLead: "Applying new values recalculates the lesson and returns to Step 1.",
      firstWeighing: "First weighing",
      secondWeighing: "Second weighing",
      cupCount: "Cups poured",
      totalWeight: "Bottle and water",
      validityTitle: "A valid problem needs",
      validityPositive: "Every cup count and total weight is a positive whole number",
      validityDifferent: "The cup counts differ, and more cups give a greater total weight",
      validityWhole: "One cup of water and the empty bottle both weigh a positive whole number of grams",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      back: "Back to catalog",
      fewerRecord: "{round}: fewer cups",
      moreRecord: "{round}: more cups",
      firstRound: "First weighing",
      secondRound: "Second weighing",
      fullProblem:
        "The same cup is used to pour water into the same empty bottle. With {firstCups} cups of water, the bottle and water weigh {firstTotal} g. With {secondCups} cups, they weigh {secondTotal} g. How much do one cup of water and the empty bottle each weigh?",
      openingPrompt: "First restate what we know and what we need to find.",
      progress: "Step {current} of {total}",
      sameParts: "Same: bottle + {cups} cups",
      extraCups: "{cups} extra cups",
      differenceMatch: "{cups} cups = {weight} g",
      oneCupLabel: "{weight} g each",
      bottleResult: "Empty bottle: {weight} g",
      stageDescription:
        "The same bottle weighs {fewerTotal} grams with {fewerCups} cups of water and {moreTotal} grams with {moreCups} cups.",
      errors: {
        "invalid-first-cups": "The first cup count must be a positive whole number.",
        "invalid-first-total": "The first total weight must be a positive whole number of grams.",
        "invalid-second-cups": "The second cup count must be a positive whole number.",
        "invalid-second-total": "The second total weight must be a positive whole number of grams.",
        "same-cup-count": "The two cup counts must differ so that one cup's weight can be compared.",
        "weight-direction-mismatch": "The weighing with more cups must also have the greater total weight.",
        "non-whole-cup-weight": "The weight difference cannot be shared evenly across the extra cups.",
        "non-positive-bottle-weight": "These values make the empty bottle weigh zero or less. Check the records."
      }
    }
  };

  const stage = app.querySelector("[data-stage]");
  const dialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");
  const settingsForm = app.querySelector(".cw-settings-form");
  const prevButton = app.querySelector('[data-action="prev"]');
  const nextButton = app.querySelector('[data-action="next"]');
  const nextLabel = app.querySelector("[data-next-label]");
  const languageButton = app.querySelector('[data-action="language"]');
  const fullscreenButton = app.querySelector('[data-action="fullscreen"]');
  const fullscreenLabel = fullscreenButton.querySelector("[data-copy]");
  const chapterLabel = app.querySelector("[data-chapter]");
  const stepKicker = app.querySelector("[data-step-kicker]");
  const stepTitle = app.querySelector("[data-step-title]");
  const stepCount = app.querySelector("[data-step-count]");
  const currentQuestion = app.querySelector("[data-current-question]");
  const progressTrack = app.querySelector("[data-progress-track]");
  const progressCopy = app.querySelector("[data-progress-copy]");
  const boardContent = app.querySelector("[data-board-content]");
  const liveCopy = app.querySelector("[data-live-copy]");
  const fullProblem = app.querySelector("[data-full-problem]");
  const openingPrompt = app.querySelector("[data-opening-prompt]");
  const stageDescription = app.querySelector("[data-stage-description]");
  const matchLabel = app.querySelector("[data-match-label]");
  const extraTitle = app.querySelector("[data-extra-title]");
  const differenceMatch = app.querySelector("[data-difference-match]");
  const bottleResultLabel = app.querySelector("[data-bottle-result-label]");
  const fewerUnits = app.querySelector("[data-fewer-water-units]");
  const moreUnits = app.querySelector("[data-more-water-units]");
  const differenceUnits = app.querySelector("[data-difference-units]");

  let language = readStoredLanguage();
  let params = { ...DEFAULTS };
  let problem = solveValues(params);
  let currentStep = 0;
  let navigationLocked = false;
  let revealTimer = 0;

  function readStoredLanguage() {
    try {
      return localStorage.getItem("math-lab-language") === "en-US" ? "en-US" : "zh-CN";
    } catch {
      return "zh-CN";
    }
  }

  function storeLanguage() {
    try {
      localStorage.setItem("math-lab-language", language);
    } catch {
      // Storage can be unavailable in a local private session.
    }
  }

  function interpolate(template, values = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
  }

  function t(key, values) {
    return interpolate(copy[language][key], values);
  }

  function value(number) {
    return number.toString();
  }

  function solveValues(values) {
    return solve(values.firstCups, values.firstTotal, values.secondCups, values.secondTotal);
  }

  function sourceName(source) {
    return source === "first" ? t("firstRound") : t("secondRound");
  }

  function buildSteps() {
    const fewerCups = value(problem.fewerCups);
    const moreCups = value(problem.moreCups);
    const cupDifference = value(problem.cupDifference);
    const weightDifference = value(problem.weightDifference);
    const cupWaterWeight = value(problem.cupWaterWeight);
    const fewerWaterWeight = value(problem.fewerWaterWeight);
    const bottleWeight = value(problem.bottleWeight);

    if (language === "en-US") {
      return [
        {
          id: "intro",
          chapter: "Understand the problem",
          title: "Read both weighing records",
          question: "What do we know, and what do we need to find?",
          live: "The complete problem and both weighing records are on the stage."
        },
        {
          id: "compare",
          chapter: "Compare the records",
          title: "Line up the matching parts",
          question: `What is exactly the same in the ${fewerCups}-cup and ${moreCups}-cup weighings?`,
          live: `The same empty bottle and ${fewerCups} cups of water are aligned.`
        },
        {
          id: "weight-difference",
          chapter: "Compare the records",
          title: "Find the extra weight",
          question: `How many more grams does the ${moreCups}-cup weighing show?`,
          live: `${problem.moreTotalWeight} minus ${problem.fewerTotalWeight} equals ${weightDifference} grams.`
        },
        {
          id: "cup-difference",
          chapter: "Compare the records",
          title: "Find the extra cups",
          question: `Which water accounts for the extra ${weightDifference} grams?`,
          live: `After matching the common parts, ${cupDifference} extra cups remain.`
        },
        {
          id: "unit-weight",
          chapter: "Compare the records",
          title: "Find one cup's weight",
          question: `If ${cupDifference} cups weigh ${weightDifference} grams, how much does one cup weigh?`,
          live: `${weightDifference} divided by ${cupDifference} equals ${cupWaterWeight} grams for one cup.`
        },
        {
          id: "fewer-water",
          chapter: "Work back",
          title: `Find the weight of ${fewerCups} cups`,
          question: `How much do the ${fewerCups} cups in the lighter weighing weigh altogether?`,
          live: `${cupWaterWeight} times ${fewerCups} equals ${fewerWaterWeight} grams.`
        },
        {
          id: "bottle-weight",
          chapter: "Work back",
          title: "Find the empty bottle's weight",
          question: `The lighter weighing totals ${problem.fewerTotalWeight} grams. What remains after removing the water's weight?`,
          live: `${problem.fewerTotalWeight} minus ${fewerWaterWeight} equals ${bottleWeight} grams for the bottle.`
        },
        {
          id: "final",
          chapter: "Check and answer",
          title: "Check both records",
          question: "Do the two results make both original weighing records true?",
          live: `Both checks pass. One cup of water weighs ${cupWaterWeight} grams, and the empty bottle weighs ${bottleWeight} grams.`
        }
      ];
    }

    return [
      {
        id: "intro",
        chapter: "认识题目",
        title: "读清两次称重",
        question: "题目告诉了我们什么？要找什么？",
        live: "舞台完整显示题目和两次称重记录。"
      },
      {
        id: "compare",
        chapter: "比较差量",
        title: "把相同部分对齐",
        question: `${fewerCups}杯和${moreCups}杯的两次称重中，哪些部分完全相同？`,
        live: `相同的空瓶和${fewerCups}杯水已经对齐。`
      },
      {
        id: "weight-difference",
        chapter: "比较差量",
        title: "求多出的重量",
        question: `倒${moreCups}杯水时，比倒${fewerCups}杯水时多重多少克？`,
        live: `${problem.moreTotalWeight}减${problem.fewerTotalWeight}等于${weightDifference}克。`
      },
      {
        id: "cup-difference",
        chapter: "比较差量",
        title: "找到多出的杯数",
        question: `多出的${weightDifference}克，正好是哪一部分水的重量？`,
        live: `去掉相同部分后，只剩多出的${cupDifference}杯水。`
      },
      {
        id: "unit-weight",
        chapter: "比较差量",
        title: "求一杯水的重量",
        question: `${cupDifference}杯水重${weightDifference}克，1杯水重多少克？`,
        live: `${weightDifference}除以${cupDifference}等于${cupWaterWeight}克。`
      },
      {
        id: "fewer-water",
        chapter: "还原重量",
        title: `求${fewerCups}杯水的重量`,
        question: `较轻的一次倒了${fewerCups}杯水，这些水一共重多少克？`,
        live: `${cupWaterWeight}乘${fewerCups}等于${fewerWaterWeight}克。`
      },
      {
        id: "bottle-weight",
        chapter: "还原重量",
        title: "求空瓶的重量",
        question: `连瓶共重${problem.fewerTotalWeight}克，去掉水重后还剩多少克？`,
        live: `${problem.fewerTotalWeight}减${fewerWaterWeight}等于${bottleWeight}克。`
      },
      {
        id: "final",
        chapter: "检验作答",
        title: "代回两次称重",
        question: "把两个结果代回去，两次称重都符合原题吗？",
        live: `两次检验都正确。一杯水重${cupWaterWeight}克，空瓶重${bottleWeight}克。`
      }
    ];
  }

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attributes).forEach(([name, attributeValue]) => {
      element.setAttribute(name, String(attributeValue));
    });
    return element;
  }

  function appendUnit(container, x, y, width, height, role, label) {
    const rect = svgElement("rect", {
      class: `cw-water-unit is-${role}`,
      x,
      y,
      width,
      height,
      rx: 4
    });
    container.append(rect);

    if (label && height >= 27) {
      const text = svgElement("text", {
        class: `cw-water-unit-label is-${role}`,
        x: x + width / 2,
        y: y + height / 2 + 6,
        "text-anchor": "middle"
      });
      text.textContent = label;
      container.append(text);
    }
  }

  function renderWaterUnits(container, cups, commonCups, isMore) {
    container.replaceChildren();
    const bottom = 357;
    const totalHeight = 202;
    const maxCups = problem.moreCups;
    const heightRatio = Number((cups * 10000n) / maxCups) / 10000;
    const fillHeight = totalHeight * heightRatio;
    const canRenderIndividualCups = maxCups <= 6n;

    if (canRenderIndividualCups) {
      const numericCups = Number(cups);
      const unitHeight = totalHeight / Number(maxCups);
      for (let index = 0; index < numericCups; index += 1) {
        const role = isMore && BigInt(index) >= commonCups ? "extra" : "common";
        appendUnit(
          container,
          -61,
          bottom - (index + 1) * unitHeight,
          122,
          unitHeight - 2,
          role,
          numericCups <= 5 ? (language === "zh-CN" ? "1杯" : "1 cup") : ""
        );
      }
      return;
    }

    const commonRatio = Number((commonCups * 10000n) / maxCups) / 10000;
    const commonHeight = isMore ? totalHeight * commonRatio : fillHeight;
    appendUnit(
      container,
      -61,
      bottom - commonHeight,
      122,
      commonHeight,
      "common",
      language === "zh-CN" ? `${commonCups}杯` : `${commonCups} cups`
    );
    if (isMore) {
      const extraHeight = fillHeight - commonHeight;
      appendUnit(
        container,
        -61,
        bottom - fillHeight,
        122,
        extraHeight,
        "extra",
        language === "zh-CN" ? `${cups - commonCups}杯` : `${cups - commonCups} cups`
      );
    }
  }

  function renderDifferenceUnits() {
    differenceUnits.replaceChildren();
    if (currentStep < 3) return;

    const difference = problem.cupDifference;
    if (difference <= 4n) {
      const count = Number(difference);
      const gap = 7;
      const available = 126;
      const unitWidth = (available - gap * (count - 1)) / count;
      for (let index = 0; index < count; index += 1) {
        const rect = svgElement("rect", {
          class: "cw-difference-unit",
          x: 497 + index * (unitWidth + gap),
          y: 250,
          width: unitWidth,
          height: 32,
          rx: 6
        });
        differenceUnits.append(rect);
      }
    } else {
      const rect = svgElement("rect", {
        class: "cw-difference-unit",
        x: 502,
        y: 250,
        width: 116,
        height: 32,
        rx: 6
      });
      const text = svgElement("text", {
        class: "cw-difference-unit-label",
        x: 560,
        y: 272,
        "text-anchor": "middle"
      });
      text.textContent = language === "zh-CN" ? `${difference}杯` : `${difference} cups`;
      differenceUnits.append(rect, text);
    }
  }

  function renderProblemData() {
    const firstCups = value(problem.firstCups);
    const firstTotal = value(problem.firstTotalWeight);
    const secondCups = value(problem.secondCups);
    const secondTotal = value(problem.secondTotalWeight);
    const fewerCups = value(problem.fewerCups);
    const fewerTotal = value(problem.fewerTotalWeight);
    const moreCups = value(problem.moreCups);
    const moreTotal = value(problem.moreTotalWeight);

    app.querySelector("[data-first-cups-summary]").textContent = firstCups;
    app.querySelector("[data-first-total-summary]").textContent = firstTotal;
    app.querySelector("[data-second-cups-summary]").textContent = secondCups;
    app.querySelector("[data-second-total-summary]").textContent = secondTotal;
    app.querySelector("[data-fewer-cups-label]").textContent =
      language === "zh-CN" ? `${fewerCups}杯水` : `${fewerCups} cups`;
    app.querySelector("[data-more-cups-label]").textContent =
      language === "zh-CN" ? `${moreCups}杯水` : `${moreCups} cups`;
    app.querySelector("[data-fewer-total-label]").textContent =
      language === "zh-CN" ? `${fewerTotal}克` : `${fewerTotal} g`;
    app.querySelector("[data-more-total-label]").textContent =
      language === "zh-CN" ? `${moreTotal}克` : `${moreTotal} g`;
    app.querySelector("[data-fewer-record-label]").textContent = t("fewerRecord", {
      round: sourceName(problem.fewerSource)
    });
    app.querySelector("[data-more-record-label]").textContent = t("moreRecord", {
      round: sourceName(problem.moreSource)
    });
    fullProblem.textContent = t("fullProblem", {
      firstCups,
      firstTotal,
      secondCups,
      secondTotal
    });
    openingPrompt.textContent = t("openingPrompt");
    stageDescription.textContent = t("stageDescription", {
      fewerCups,
      fewerTotal,
      moreCups,
      moreTotal
    });

    renderWaterUnits(fewerUnits, problem.fewerCups, problem.fewerCups, false);
    renderWaterUnits(moreUnits, problem.moreCups, problem.fewerCups, true);
  }

  function createBoardLine(text, className = "") {
    const line = document.createElement("p");
    line.className = `cw-board-line ${className}`.trim();
    line.textContent = text;
    return line;
  }

  function renderBoard() {
    window.clearTimeout(revealTimer);
    boardContent.classList.remove("is-waiting");
    boardContent.replaceChildren();
    if (currentStep <= 1) return;

    const fewerCups = value(problem.fewerCups);
    const moreCups = value(problem.moreCups);
    const cupDifference = value(problem.cupDifference);
    const weightDifference = value(problem.weightDifference);
    const cupWaterWeight = value(problem.cupWaterWeight);
    const fewerWaterWeight = value(problem.fewerWaterWeight);
    const bottleWeight = value(problem.bottleWeight);
    const fewerTotal = value(problem.fewerTotalWeight);
    const moreTotal = value(problem.moreTotalWeight);

    const lines = [];
    if (currentStep === 1) {
      lines.push(
        createBoardLine(
          language === "zh-CN"
            ? `两次都有：同一个空瓶＋${fewerCups}杯水`
            : `Both have: the same empty bottle + ${fewerCups} cups`,
          "is-support"
        )
      );
    } else if (currentStep === 2) {
      lines.push(createBoardLine(`${moreTotal} − ${fewerTotal} ＝ ${weightDifference}${t("grams")}`));
    } else if (currentStep === 3) {
      lines.push(createBoardLine(`${moreTotal} − ${fewerTotal} ＝ ${weightDifference}${t("grams")}`, "is-support"));
      lines.push(createBoardLine(`${moreCups} − ${fewerCups} ＝ ${cupDifference}${t("cups")}`));
    } else if (currentStep === 4) {
      lines.push(
        createBoardLine(
          language === "zh-CN"
            ? `${weightDifference}克平均分给${cupDifference}杯`
            : `Share ${weightDifference} g equally across ${cupDifference} cups`,
          "is-support"
        )
      );
      lines.push(createBoardLine(`${weightDifference} ÷ ${cupDifference} ＝ ${cupWaterWeight}${t("grams")}`));
    } else if (currentStep === 5) {
      lines.push(createBoardLine(`${cupWaterWeight} × ${fewerCups} ＝ ${fewerWaterWeight}${t("grams")}`));
      lines.push(
        createBoardLine(
          language === "zh-CN" ? `${fewerCups}杯水共重${fewerWaterWeight}克` : `${fewerCups} cups weigh ${fewerWaterWeight} g`,
          "is-support"
        )
      );
    } else if (currentStep === 6) {
      lines.push(createBoardLine(`${fewerTotal} − ${fewerWaterWeight} ＝ ${bottleWeight}${t("grams")}`));
      lines.push(
        createBoardLine(
          language === "zh-CN" ? `剩下的是空瓶的重量` : "The remaining weight is the empty bottle",
          "is-support"
        )
      );
    } else {
      const firstCheck = `${bottleWeight}＋${value(problem.firstCups)}×${cupWaterWeight}＝${value(problem.checkedFirstTotal)}${t("grams")}`;
      const secondCheck = `${bottleWeight}＋${value(problem.secondCups)}×${cupWaterWeight}＝${value(problem.checkedSecondTotal)}${t("grams")}`;
      const answer =
        language === "zh-CN"
          ? `答：一杯水重${cupWaterWeight}克，空瓶重${bottleWeight}克。`
          : `Answer: one cup of water weighs ${cupWaterWeight} g, and the empty bottle weighs ${bottleWeight} g.`;
      const checkOne = document.createElement("span");
      checkOne.className = "cw-check-line";
      checkOne.textContent = `✓ ${firstCheck}`;
      const checkTwo = document.createElement("span");
      checkTwo.className = "cw-check-line";
      checkTwo.textContent = `✓ ${secondCheck}`;
      lines.push(checkOne, checkTwo, createBoardLine(answer, "is-answer"));
    }

    boardContent.append(...lines);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      boardContent.classList.add("is-waiting");
      revealTimer = window.setTimeout(() => boardContent.classList.remove("is-waiting"), 240);
    }
  }

  function renderLanguage() {
    document.documentElement.lang = language;
    document.title =
      language === "zh-CN"
        ? "一杯水和一个空瓶各重多少克 - Math Motion Lab"
        : "Cup of Water and Empty Bottle Weight - Math Motion Lab";
    app.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (copy[language][key]) element.textContent = copy[language][key];
    });
    app.querySelectorAll("[data-aria-copy]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.ariaCopy));
    });
    app.querySelector("[data-svg-title]").textContent = t("stageTitle");
    languageButton.textContent = language === "zh-CN" ? "EN" : "中文";
    app.querySelector('[data-action="back"]').setAttribute("aria-label", t("back"));
    app.querySelector('[data-action="close-settings"]').setAttribute("aria-label", t("close"));
    fullscreenLabel.textContent = document.fullscreenElement ? t("exitFullscreen") : t("fullscreen");
  }

  function renderStep() {
    const steps = buildSteps();
    const step = steps[currentStep];

    stage.className = `cw-stage is-step-${step.id}`;
    stage.setAttribute("aria-label", `${step.question} ${t("clickHint")}`);
    chapterLabel.textContent = step.chapter;
    stepKicker.textContent =
      language === "zh-CN" ? `第${currentStep + 1}步 · ${step.chapter}` : `Step ${currentStep + 1} · ${step.chapter}`;
    stepTitle.textContent = step.title;
    currentQuestion.textContent = step.question;
    stepCount.textContent = `${currentStep + 1} / ${steps.length}`;
    progressCopy.textContent = t("progress", { current: currentStep + 1, total: steps.length });
    progressTrack.style.setProperty("--progress", `${((currentStep + 1) / steps.length) * 100}%`);
    prevButton.disabled = currentStep === 0;
    nextLabel.textContent = currentStep === steps.length - 1 ? t("restart") : t("next");
    liveCopy.textContent = step.live;

    const canShowMatch = currentStep >= 1;
    const canShowDifference = currentStep >= 3;
    const canShowBottle = currentStep >= 6;
    matchLabel.textContent = canShowMatch ? t("sameParts", { cups: value(problem.fewerCups) }) : "";
    extraTitle.textContent = canShowDifference ? t("extraCups", { cups: value(problem.cupDifference) }) : "";
    differenceMatch.textContent = canShowDifference
      ? currentStep >= 4
        ? `${t("differenceMatch", {
            cups: value(problem.cupDifference),
            weight: value(problem.weightDifference)
          })} · ${t("oneCupLabel", { weight: value(problem.cupWaterWeight) })}`
        : t("differenceMatch", {
            cups: value(problem.cupDifference),
            weight: value(problem.weightDifference)
          })
      : "";
    bottleResultLabel.textContent = canShowBottle ? t("bottleResult", { weight: value(problem.bottleWeight) }) : "";

    renderDifferenceUnits();
    renderBoard();
  }

  function renderAll() {
    renderLanguage();
    renderProblemData();
    renderStep();
  }

  function lockNavigation() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    navigationLocked = true;
    window.setTimeout(() => {
      navigationLocked = false;
    }, 320);
  }

  function goToStep(nextStep) {
    if (navigationLocked) return;
    const total = buildSteps().length;
    const bounded = Math.max(0, Math.min(nextStep, total - 1));
    if (bounded === currentStep) return;
    currentStep = bounded;
    renderStep();
    lockNavigation();
  }

  function advance() {
    if (navigationLocked) return;
    const total = buildSteps().length;
    if (currentStep === total - 1) {
      currentStep = 0;
      renderStep();
      lockNavigation();
      return;
    }
    goToStep(currentStep + 1);
  }

  function openSettings() {
    settingsForm.elements.firstCups.value = params.firstCups;
    settingsForm.elements.firstTotal.value = params.firstTotal;
    settingsForm.elements.secondCups.value = params.secondCups;
    settingsForm.elements.secondTotal.value = params.secondTotal;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsForm.querySelectorAll("input").forEach((input) => input.removeAttribute("aria-invalid"));
    dialog.showModal();
    settingsForm.elements.firstCups.focus();
  }

  function closeSettings() {
    dialog.close();
  }

  function applySettings() {
    const nextParams = {
      firstCups: settingsForm.elements.firstCups.value.trim(),
      firstTotal: settingsForm.elements.firstTotal.value.trim(),
      secondCups: settingsForm.elements.secondCups.value.trim(),
      secondTotal: settingsForm.elements.secondTotal.value.trim()
    };
    const result = solveValues(nextParams);
    if (!result.valid) {
      settingsError.textContent = copy[language].errors[result.reason] || result.reason;
      settingsError.hidden = false;
      settingsForm.querySelectorAll("input").forEach((input) => input.setAttribute("aria-invalid", "true"));
      return;
    }

    params = nextParams;
    problem = result;
    currentStep = 0;
    settingsError.hidden = true;
    dialog.close();
    renderAll();
    stage.focus();
  }

  function toggleLanguage() {
    language = language === "zh-CN" ? "en-US" : "zh-CN";
    storeLanguage();
    renderAll();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      liveCopy.textContent =
        language === "zh-CN" ? "浏览器未允许进入全屏。" : "The browser did not allow full-screen mode.";
    }
  }

  app.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === "prev") goToStep(currentStep - 1);
      if (action === "next") advance();
      if (action === "edit") openSettings();
      if (action === "language") toggleLanguage();
      if (action === "fullscreen") toggleFullscreen();
      if (action === "close-settings" || action === "cancel-settings") closeSettings();
      if (action === "apply-settings") applySettings();
      return;
    }

    if (event.target.closest("[data-stage]") && !dialog.open) advance();
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advance();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (dialog.open || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(event.target.tagName)) return;
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      advance();
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goToStep(currentStep - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goToStep(0);
    }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSettings();
  });

  document.addEventListener("fullscreenchange", renderLanguage);

  renderAll();
})();
