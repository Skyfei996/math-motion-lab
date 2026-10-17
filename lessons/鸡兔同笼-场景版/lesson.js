(() => {
  "use strict";

  const DEFAULT_PROBLEM = Object.freeze({
    heads: "10",
    legs: "26"
  });

  const solve = window.MathLabModels?.quantity?.chickenRabbitState;
  if (typeof solve !== "function") {
    throw new Error("MathLabModels.quantity.chickenRabbitState is unavailable.");
  }

  const problem = solve(DEFAULT_PROBLEM.heads, DEFAULT_PROBLEM.legs);
  if (!problem.valid) {
    throw new Error(`Invalid chicken-rabbit problem: ${problem.reason}`);
  }

  const number = (value) => Number(value);
  const textNumber = (value) => value.toString();
  const values = Object.freeze({
    heads: number(problem.heads),
    legs: number(problem.legs),
    allChickenLegs: number(problem.allChickenLegs),
    extraLegs: number(problem.extraLegs),
    extraLegsPerRabbit: number(problem.extraLegsPerRabbit),
    rabbits: number(problem.rabbits),
    chickens: number(problem.chickens)
  });

  const copy = {
    "zh-CN": {
      labName: "Math Motion Lab · 场景讲解",
      title: "鸡兔同笼",
      fullscreen: "全屏",
      clickHint: "点击舞台空白处继续",
      prev: "上一步",
      next: "下一步",
      replay: "重新讲解",
      knownLabel: "已知",
      knownText: "总数和腿数",
      findLabel: "要找",
      findText: "鸡和兔各有几只",
      chickenName: "鸡：2 条腿",
      rabbitName: "兔：4 条腿",
      extraLegsLabel: `多出来的 ${values.extraLegs} 条腿`,
      transformCaption: `每变成 1 只兔，只需再补 ${values.extraLegsPerRabbit} 条腿`,
      stageLabel: "鸡兔同笼互动讲解舞台",
      answer: `答：鸡有 ${values.chickens} 只，兔有 ${values.rabbits} 只。`
    },
    "en-US": {
      labName: "Math Motion Lab · Scene Lesson",
      title: "Chickens and Rabbits",
      fullscreen: "Full screen",
      clickHint: "Click the stage to continue",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      knownLabel: "KNOWN",
      knownText: "animals and legs",
      findLabel: "FIND",
      findText: "chickens and rabbits",
      chickenName: "Chicken: 2 legs",
      rabbitName: "Rabbit: 4 legs",
      extraLegsLabel: `${values.extraLegs} extra legs`,
      transformCaption: `Changing 1 chicken into a rabbit adds ${values.extraLegsPerRabbit} legs`,
      stageLabel: "Interactive chickens and rabbits lesson stage",
      answer: `Answer: ${values.chickens} chickens and ${values.rabbits} rabbits.`
    }
  };

  const steps = [
    {
      chapter: { zh: "读题", en: "Read" },
      title: { zh: "先抓住两条信息", en: "Start with two facts" },
      question: {
        zh: `笼子里有 ${values.heads} 只动物、${values.legs} 条腿，鸡和兔各有多少只？`,
        en: `${values.heads} animals have ${values.legs} legs. How many chickens and rabbits?`
      },
      live: {
        zh: `题目给出动物总数 ${values.heads} 只和腿的总数 ${values.legs} 条。`,
        en: `The problem gives ${values.heads} animals and ${values.legs} legs.`
      },
      view: { context: true, task: true }
    },
    {
      chapter: { zh: "画头", en: "Heads" },
      title: { zh: `一只一个头，画出 ${values.heads} 个头`, en: `Draw ${values.heads} heads` },
      question: {
        zh: `不管是鸡还是兔，每只动物都有 1 个头。`,
        en: `Every animal has exactly one head.`
      },
      live: {
        zh: `用 ${values.heads} 个圆表示 ${values.heads} 只动物。`,
        en: `${values.heads} circles represent the ${values.heads} animals.`
      },
      view: { context: true, row: true }
    },
    {
      chapter: { zh: "比较", en: "Compare" },
      title: { zh: "鸡和兔的不同在哪里？", en: "What is different?" },
      question: {
        zh: "鸡有 2 条腿，兔有 4 条腿。",
        en: "A chicken has 2 legs; a rabbit has 4."
      },
      live: {
        zh: "鸡和兔的头数相同，关键差别在腿数。",
        en: "Their heads are alike; the useful difference is their number of legs."
      },
      view: { context: true, row: true, specimens: true }
    },
    {
      chapter: { zh: "假设", en: "Assume" },
      title: { zh: "先假设全部是鸡", en: "Assume all are chickens" },
      question: {
        zh: `如果 ${values.heads} 只全是鸡，一共有多少条腿？`,
        en: `If all ${values.heads} animals were chickens, how many legs?`
      },
      live: {
        zh: `${values.heads} 乘 2 等于 ${values.allChickenLegs}，先给每只动物画两条基础腿。`,
        en: `${values.heads} times 2 is ${values.allChickenLegs}; give every animal two base legs.`
      },
      view: { context: true, row: true, baseLegs: true, baseline: true }
    },
    {
      chapter: { zh: "找差", en: "Difference" },
      title: { zh: `还差 ${values.extraLegs} 条腿`, en: `${values.extraLegs} legs are missing` },
      question: {
        zh: `实际有 ${values.legs} 条腿，比全是鸡多出多少条？`,
        en: `How many more than the all-chicken total?`
      },
      live: {
        zh: `${values.legs} 减 ${values.allChickenLegs} 等于 ${values.extraLegs}，这 ${values.extraLegs} 条腿需要补回去。`,
        en: `${values.legs} minus ${values.allChickenLegs} is ${values.extraLegs}; these are the extra legs to place.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        baseline: true,
        difference: true,
        workbench: "loose"
      }
    },
    {
      chapter: { zh: "替换", en: "Replace" },
      title: { zh: `变 1 只兔，只多 ${values.extraLegsPerRabbit} 条腿`, en: `One rabbit adds ${values.extraLegsPerRabbit} legs` },
      question: {
        zh: "把一只鸡换成一只兔，原来的两条腿不用重算。",
        en: "Replace one chicken with one rabbit; keep its two base legs."
      },
      live: {
        zh: `兔比鸡多 ${values.extraLegsPerRabbit} 条腿，所以每补 ${values.extraLegsPerRabbit} 条腿就得到一只兔。`,
        en: `A rabbit has ${values.extraLegsPerRabbit} more legs than a chicken, so each extra pair makes one rabbit.`
      },
      view: { context: true, row: true, baseLegs: true, transform: true, focusToken: 0 }
    },
    {
      chapter: { zh: "分组", en: "Group" },
      title: { zh: "把多出的腿两条一组", en: "Group the extra legs in pairs" },
      question: {
        zh: `${values.extraLegs} 条多出的腿，可以分成几组？`,
        en: `How many pairs can we make from ${values.extraLegs} extra legs?`
      },
      live: {
        zh: `把 ${values.extraLegs} 条腿按每组 ${values.extraLegsPerRabbit} 条圈起来。`,
        en: `Circle the ${values.extraLegs} extra legs in groups of ${values.extraLegsPerRabbit}.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        difference: true,
        workbench: "grouped"
      }
    },
    {
      chapter: { zh: "对应", en: "Match" },
      title: { zh: "一组补腿，对应一只兔", en: "One pair makes one rabbit" },
      question: {
        zh: "先把第一组两条腿补到第一只动物上。",
        en: "Add the first pair to the first animal."
      },
      live: {
        zh: "第一只动物从两条腿变成四条腿，因此它是一只兔。",
        en: "The first animal now has four legs, so it is a rabbit."
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        extraTokens: 1,
        focusToken: 0,
        workbench: "grouped",
        distributedPairs: 1
      }
    },
    {
      chapter: { zh: "求兔", en: "Rabbits" },
      title: { zh: `${values.rabbits} 组补腿，得到 ${values.rabbits} 只兔`, en: `${values.rabbits} pairs make ${values.rabbits} rabbits` },
      question: {
        zh: `把所有补腿组放回去，一共有几只兔？`,
        en: `Place every extra pair. How many rabbits appear?`
      },
      live: {
        zh: `${values.extraLegs} 除以 ${values.extraLegsPerRabbit} 等于 ${values.rabbits}，所以有 ${values.rabbits} 只兔。`,
        en: `${values.extraLegs} divided by ${values.extraLegsPerRabbit} is ${values.rabbits}, so there are ${values.rabbits} rabbits.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        extraTokens: values.rabbits,
        rabbitCalculation: true
      }
    },
    {
      chapter: { zh: "求鸡", en: "Chickens" },
      title: { zh: `剩下的是 ${values.chickens} 只鸡`, en: `${values.chickens} animals remain chickens` },
      question: {
        zh: `总数减去兔的只数，就是鸡的只数。`,
        en: `Subtract the rabbits from the total to find the chickens.`
      },
      live: {
        zh: `${values.heads} 减 ${values.rabbits} 等于 ${values.chickens}，所以有 ${values.chickens} 只鸡。`,
        en: `${values.heads} minus ${values.rabbits} is ${values.chickens}, so there are ${values.chickens} chickens.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        extraTokens: values.rabbits,
        groupBraces: true,
        rabbitCalculation: true,
        chickenCalculation: true
      }
    },
    {
      chapter: { zh: "检验", en: "Check" },
      title: { zh: "先检查头数", en: "Check the heads" },
      question: {
        zh: `${values.rabbits} 只兔和 ${values.chickens} 只鸡，头数对吗？`,
        en: `Do ${values.rabbits} rabbits and ${values.chickens} chickens give the right number of heads?`
      },
      live: {
        zh: `${values.rabbits} 加 ${values.chickens} 等于 ${textNumber(problem.checkedHeads)}，头数正确。`,
        en: `${values.rabbits} plus ${values.chickens} is ${textNumber(problem.checkedHeads)}; the head count is correct.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        extraTokens: values.rabbits,
        groupBraces: true,
        rabbitCalculation: true,
        chickenCalculation: true,
        headCheck: true
      }
    },
    {
      chapter: { zh: "检验", en: "Check" },
      title: { zh: "再检查腿数", en: "Check the legs" },
      question: {
        zh: `${values.rabbits} 只兔和 ${values.chickens} 只鸡，腿数也对吗？`,
        en: `Do those animals also give the right number of legs?`
      },
      live: {
        zh: `${values.rabbits} 乘 4 加 ${values.chickens} 乘 2 等于 ${textNumber(problem.checkedLegs)}，腿数正确。`,
        en: `${values.rabbits} times 4 plus ${values.chickens} times 2 is ${textNumber(problem.checkedLegs)}; the leg count is correct.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        extraTokens: values.rabbits,
        groupBraces: true,
        rabbitCalculation: true,
        chickenCalculation: true,
        headCheck: true,
        legCheck: true
      }
    },
    {
      chapter: { zh: "结论", en: "Answer" },
      title: { zh: "写出完整答案", en: "State the answer" },
      question: {
        zh: "头数、腿数都检验正确，可以作答。",
        en: "Both checks pass, so we can state the answer."
      },
      live: {
        zh: `鸡有 ${values.chickens} 只，兔有 ${values.rabbits} 只。`,
        en: `There are ${values.chickens} chickens and ${values.rabbits} rabbits.`
      },
      view: {
        context: true,
        row: true,
        baseLegs: true,
        extraTokens: values.rabbits,
        groupBraces: true,
        rabbitCalculation: true,
        chickenCalculation: true,
        headCheck: true,
        legCheck: true,
        answer: true
      }
    }
  ];

  const app = document.querySelector("[data-scene-app]");
  const stage = document.querySelector("[data-stage]");
  const languageButton = document.querySelector('[data-action="language"]');
  const fullscreenButton = document.querySelector('[data-action="fullscreen"]');
  const prevButton = document.querySelector('[data-action="prev"]');
  const nextButton = document.querySelector('[data-action="next"]');
  const nextLabel = document.querySelector("[data-next-label]");
  const chapterLabel = document.querySelector("[data-chapter]");
  const stepTitle = document.querySelector("[data-step-title]");
  const stepCount = document.querySelector("[data-step-count]");
  const liveCopy = document.querySelector("[data-live-copy]");
  const stageDescription = document.querySelector("[data-stage-description]");
  const progressTrack = document.querySelector("[data-progress-track]");
  const questionGroup = document.querySelector(".scene-question-group");
  const questionText = document.querySelector('[data-svg-copy="question"]');

  const parts = {
    context: document.querySelector('[data-part="context"]'),
    task: document.querySelector('[data-part="task"]'),
    row: document.querySelector('[data-part="row"]'),
    specimens: document.querySelector('[data-part="specimens"]'),
    baseline: document.querySelector('[data-formula="baseline"]'),
    difference: document.querySelector('[data-formula="difference"]'),
    workbench: document.querySelector('[data-part="extra-workbench"]'),
    transform: document.querySelector('[data-part="transform-demo"]'),
    groupBraces: document.querySelector('[data-part="group-braces"]'),
    rabbitCalculation: document.querySelector("[data-calc-rabbits]"),
    chickenCalculation: document.querySelector("[data-calc-chickens]"),
    headCheck: document.querySelector('[data-check="heads"]'),
    legCheck: document.querySelector('[data-check="legs"]'),
    answer: document.querySelector('[data-part="answer"]')
  };

  let language = "zh-CN";
  let currentStep = 0;
  let tokens = [];
  let extraBits = [];
  let pairCapsules = [];

  function buildTokenRow() {
    const row = document.querySelector("[data-token-row]");
    const startX = 337;
    const spacing = 72;

    for (let index = 0; index < values.heads; index += 1) {
      const token = document.createElementNS("http://www.w3.org/2000/svg", "g");
      token.setAttribute("class", "scene-token");
      token.setAttribute("data-token-index", String(index));
      token.setAttribute("transform", `translate(${startX + index * spacing} 205)`);

      const figure = document.createElementNS("http://www.w3.org/2000/svg", "g");
      figure.setAttribute("class", "scene-token-figure");

      const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      head.setAttribute("class", "scene-token-head");
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "0");
      head.setAttribute("r", "25");

      const baseLegs = document.createElementNS("http://www.w3.org/2000/svg", "path");
      baseLegs.setAttribute("class", "scene-leg is-base");
      baseLegs.setAttribute("d", "M-10 22-16 67M10 22 16 67");

      const extraLegs = document.createElementNS("http://www.w3.org/2000/svg", "path");
      extraLegs.setAttribute("class", "scene-leg is-extra");
      extraLegs.setAttribute("d", "M-4 23-6 69M4 23 6 69");

      figure.append(head, baseLegs, extraLegs);
      token.append(figure);
      row.append(token);
    }

    tokens = Array.from(row.querySelectorAll(".scene-token"));
  }

  function buildExtraLegs() {
    const bitLayer = document.querySelector("[data-extra-leg-bits]");
    const capsuleLayer = document.querySelector("[data-pair-capsules]");

    for (let index = 0; index < values.extraLegs; index += 1) {
      const bit = document.createElementNS("http://www.w3.org/2000/svg", "g");
      bit.setAttribute("class", "scene-extra-bit");
      bit.setAttribute("data-extra-index", String(index));

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "-4");
      line.setAttribute("y1", "-18");
      line.setAttribute("x2", "4");
      line.setAttribute("y2", "18");
      bit.append(line);
      bitLayer.append(bit);
    }

    for (let index = 0; index < values.rabbits; index += 1) {
      const capsule = document.createElementNS("http://www.w3.org/2000/svg", "g");
      capsule.setAttribute("class", "scene-pair-capsule");
      capsule.setAttribute("data-pair-index", String(index));
      capsule.setAttribute("transform", `translate(${438 + index * 110} 490)`);

      const outline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      outline.setAttribute("width", "78");
      outline.setAttribute("height", "60");
      outline.setAttribute("rx", "18");

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", "39");
      label.setAttribute("y", "75");
      label.setAttribute("text-anchor", "middle");
      label.textContent = "+2";

      capsule.append(outline, label);
      capsuleLayer.append(capsule);
    }

    extraBits = Array.from(bitLayer.querySelectorAll(".scene-extra-bit"));
    pairCapsules = Array.from(capsuleLayer.querySelectorAll(".scene-pair-capsule"));
    positionExtraBits("loose", 0);
  }

  function buildProgress() {
    progressTrack.style.setProperty("--step-count", String(steps.length));
    for (let index = 0; index < steps.length; index += 1) {
      const segment = document.createElement("span");
      segment.className = "scene-progress-segment";
      segment.setAttribute("aria-hidden", "true");
      progressTrack.append(segment);
    }
  }

  function overBracePath(start, end, y) {
    const middle = (start + end) / 2;
    return [
      `M${start} ${y}`,
      `Q${start} ${y - 14} ${start + 20} ${y - 14}`,
      `H${middle - 22}`,
      `Q${middle - 7} ${y - 14} ${middle} ${y - 32}`,
      `Q${middle + 7} ${y - 14} ${middle + 22} ${y - 14}`,
      `H${end - 20}`,
      `Q${end} ${y - 14} ${end} ${y}`
    ].join(" ");
  }

  function underBracePath(start, end, y) {
    const middle = (start + end) / 2;
    return [
      `M${start} ${y}`,
      `Q${start} ${y + 12} ${start + 18} ${y + 12}`,
      `H${middle - 20}`,
      `Q${middle - 7} ${y + 12} ${middle} ${y + 29}`,
      `Q${middle + 7} ${y + 12} ${middle + 20} ${y + 12}`,
      `H${end - 18}`,
      `Q${end} ${y + 12} ${end} ${y}`
    ].join(" ");
  }

  function updateBraceGeometry() {
    const startX = 337;
    const spacing = 72;
    const rowStart = startX - 25;
    const rowEnd = startX + (values.heads - 1) * spacing + 25;
    const rabbitEnd = startX + (values.rabbits - 1) * spacing + 25;
    const chickenStart = rabbitEnd + 10;

    document.querySelector(".scene-row-brace").setAttribute("d", overBracePath(rowStart, rowEnd, 148));
    document.querySelector("[data-row-total]").setAttribute("x", String((rowStart + rowEnd) / 2));

    const rabbitBrace = document.querySelector(".scene-under-brace.is-rabbit");
    const chickenBrace = document.querySelector(".scene-under-brace.is-chicken");
    rabbitBrace.setAttribute("d", underBracePath(rowStart, rabbitEnd, 292));
    chickenBrace.setAttribute("d", underBracePath(chickenStart, rowEnd, 292));
    document.querySelector("[data-rabbit-label]").setAttribute("x", String((rowStart + rabbitEnd) / 2));
    document.querySelector("[data-chicken-label]").setAttribute("x", String((chickenStart + rowEnd) / 2));
  }

  function updateCalculatedText() {
    const isChinese = language === "zh-CN";
    document.querySelector("[data-given-heads]").textContent =
      isChinese ? `${values.heads} 只` : `${values.heads} animals`;
    document.querySelector("[data-given-legs]").textContent =
      isChinese ? `${values.legs} 条腿` : `${values.legs} legs`;
    document.querySelector("[data-row-total]").textContent = String(values.heads);
    document.querySelector("[data-baseline-formula]").textContent =
      `${values.heads} × 2 = ${values.allChickenLegs}${isChinese ? " 条" : " legs"}`;
    document.querySelector("[data-difference-formula]").textContent =
      `${values.legs} − ${values.allChickenLegs} = ${values.extraLegs}${isChinese ? " 条" : " legs"}`;
    document.querySelector("[data-rabbit-label]").textContent =
      isChinese ? `${values.rabbits} 只兔` : `${values.rabbits} rabbits`;
    document.querySelector("[data-chicken-label]").textContent =
      isChinese ? `${values.chickens} 只鸡` : `${values.chickens} chickens`;
    document.querySelector("[data-calc-rabbits]").textContent =
      `${values.extraLegs} ÷ ${values.extraLegsPerRabbit} = ${values.rabbits}${isChinese ? " 只兔" : " rabbits"}`;
    document.querySelector("[data-calc-chickens]").textContent =
      `${values.heads} − ${values.rabbits} = ${values.chickens}${isChinese ? " 只鸡" : " chickens"}`;
    document.querySelector("[data-head-check]").textContent =
      `${values.rabbits} + ${values.chickens} = ${textNumber(problem.checkedHeads)}${isChinese ? " 只" : " animals"}`;
    document.querySelector("[data-leg-check]").textContent =
      `${values.rabbits} × 4 + ${values.chickens} × 2 = ${textNumber(problem.checkedLegs)}${isChinese ? " 条" : " legs"}`;
  }

  function positionExtraBits(mode, distributedPairs = 0) {
    extraBits.forEach((bit, index) => {
      const pairIndex = Math.floor(index / values.extraLegsPerRabbit);
      const withinPair = index % values.extraLegsPerRabbit;
      let x;
      let y;

      if (mode === "grouped") {
        x = 460 + pairIndex * 110 + withinPair * 22;
        y = 520;
      } else {
        x = 452 + index * 52;
        y = 520 + (index % 2) * 5;
      }

      const absorbed = pairIndex < distributedPairs;
      if (absorbed) {
        x = 337 + pairIndex * 72 + (withinPair === 0 ? -7 : 7);
        y = 252;
      }

      bit.style.transform = `translate(${x}px, ${y}px)`;
      bit.classList.toggle("is-absorbed", absorbed);
    });

    pairCapsules.forEach((capsule, index) => {
      capsule.classList.toggle("is-used", index < distributedPairs);
    });
  }

  function setVisible(element, visible) {
    element?.classList.toggle("is-visible", Boolean(visible));
  }

  function renderLanguage() {
    const currentCopy = copy[language];
    const step = steps[currentStep];
    const stepLanguage = language === "zh-CN" ? "zh" : "en";

    document.documentElement.lang = language;
    document.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (currentCopy[key]) element.textContent = currentCopy[key];
    });
    document.querySelectorAll("[data-svg-copy]").forEach((element) => {
      const key = element.dataset.svgCopy;
      if (key !== "question" && currentCopy[key]) element.textContent = currentCopy[key];
    });

    languageButton.textContent = language === "zh-CN" ? "EN" : "中";
    stage.setAttribute("aria-label", currentCopy.stageLabel);
    questionText.textContent = step.question[stepLanguage];
    chapterLabel.textContent = step.chapter[stepLanguage];
    stepTitle.textContent = step.title[stepLanguage];
    liveCopy.textContent = step.live[stepLanguage];
    stageDescription.textContent = step.live[stepLanguage];
    nextLabel.textContent = currentStep === steps.length - 1 ? currentCopy.replay : currentCopy.next;
    document.querySelector("[data-answer]").textContent = currentCopy.answer;
    updateCalculatedText();
  }

  function renderStep(previousStep = currentStep) {
    const step = steps[currentStep];
    const view = step.view;
    const movingForward = currentStep > previousStep;

    questionGroup.classList.add("is-visible");
    setVisible(parts.context, view.context);
    setVisible(parts.task, view.task);
    setVisible(parts.row, view.row);
    setVisible(parts.specimens, view.specimens);
    setVisible(parts.baseline, view.baseline);
    setVisible(parts.difference, view.difference);
    setVisible(parts.workbench, Boolean(view.workbench));
    setVisible(parts.transform, view.transform);
    setVisible(parts.groupBraces, view.groupBraces);
    setVisible(parts.rabbitCalculation, view.rabbitCalculation);
    setVisible(parts.chickenCalculation, view.chickenCalculation);
    setVisible(parts.headCheck, view.headCheck);
    setVisible(parts.legCheck, view.legCheck);
    setVisible(parts.answer, view.answer);

    parts.workbench.classList.toggle("is-grouped", view.workbench === "grouped");
    const distributedPairs = view.distributedPairs || 0;
    if (view.workbench === "grouped" && movingForward && currentStep === 6) {
      parts.workbench.classList.remove("is-grouped");
      positionExtraBits("loose", 0);
      window.requestAnimationFrame(() => {
        parts.workbench.classList.add("is-grouped");
        positionExtraBits("grouped", distributedPairs);
      });
    } else {
      positionExtraBits(view.workbench === "grouped" ? "grouped" : "loose", distributedPairs);
    }

    const extraTokenCount = view.extraTokens || 0;
    tokens.forEach((token, index) => {
      token.classList.toggle("has-base", Boolean(view.baseLegs));
      token.classList.toggle("has-extra", index < extraTokenCount);
      token.classList.toggle("is-focus", index === view.focusToken);
    });

    if (currentStep === 1 && movingForward) {
      tokens.forEach((token, index) => {
        window.setTimeout(() => {
          token.classList.add("is-new");
          window.setTimeout(() => token.classList.remove("is-new"), 420);
        }, index * 34);
      });
    }

    const isFinal = currentStep === steps.length - 1;
    stage.dataset.final = String(isFinal);
    prevButton.disabled = currentStep === 0;
    stepCount.textContent = `${currentStep + 1} / ${steps.length}`;

    Array.from(progressTrack.children).forEach((segment, index) => {
      segment.classList.toggle("is-complete", index < currentStep);
      segment.classList.toggle("is-current", index === currentStep);
    });

    renderLanguage();
  }

  function goToStep(nextStep) {
    const boundedStep = Math.max(0, Math.min(nextStep, steps.length - 1));
    if (boundedStep === currentStep) return;
    const previousStep = currentStep;
    currentStep = boundedStep;
    renderStep(previousStep);
  }

  function advance() {
    if (currentStep === steps.length - 1) {
      const previousStep = currentStep;
      currentStep = 0;
      renderStep(previousStep);
      return;
    }
    goToStep(currentStep + 1);
  }

  function isInteractiveTarget(target) {
    return target instanceof Element && Boolean(target.closest("button, a"));
  }

  stage.addEventListener("click", (event) => {
    if (!isInteractiveTarget(event.target) && currentStep < steps.length - 1) advance();
  });

  stage.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && currentStep < steps.length - 1) {
      event.preventDefault();
      event.stopPropagation();
      advance();
    }
  });

  prevButton.addEventListener("click", () => goToStep(currentStep - 1));
  nextButton.addEventListener("click", advance);

  languageButton.addEventListener("click", () => {
    language = language === "zh-CN" ? "en-US" : "zh-CN";
    renderLanguage();
  });

  fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await app.requestFullscreen();
    }
  });

  document.addEventListener("keydown", (event) => {
    const interactiveTarget = isInteractiveTarget(event.target);
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      if (currentStep < steps.length - 1) advance();
    }
    if (event.key === " " && !interactiveTarget) {
      event.preventDefault();
      if (currentStep < steps.length - 1) advance();
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goToStep(currentStep - 1);
    }
  });

  buildTokenRow();
  buildExtraLegs();
  buildProgress();
  updateBraceGeometry();
  updateCalculatedText();
  renderStep();
})();
