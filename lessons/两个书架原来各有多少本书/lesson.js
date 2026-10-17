(() => {
  "use strict";

  const app = document.querySelector("[data-shelf-app]");
  const solve = window.MathLabModels?.quantity?.bookshelfMultipleState;
  if (!app || typeof solve !== "function" || !window.MathLab) return;

  const DEFAULTS = Object.freeze({
    removedFromFirst: "200",
    addedToSecond: "40",
    multiple: "3"
  });

  const values = {
    removedFromFirst: DEFAULTS.removedFromFirst,
    addedToSecond: DEFAULTS.addedToSecond,
    multiple: DEFAULTS.multiple
  };

  const copy = {
    "zh-CN": {
      labName: "Math Motion Lab · 场景讲解",
      title: "两个书架原来各有多少本书",
      edit: "编辑题目",
      fullscreen: "全屏",
      clickHint: "点击舞台空白处继续",
      prev: "上一步",
      next: "下一步",
      replay: "重新讲解",
      parameters: "题目参数",
      settingsTitle: "编辑书架倍数问题",
      settingsLead: "应用后会检查是否得到整数本答案，并从第1步重新讲解。",
      removedLabel: "第一个书架取出",
      addedLabel: "第二个书架放入",
      multipleLabel: "变化后的倍数",
      booksUnit: "本",
      timesUnit: "倍",
      validityTitle: "有效题目需要满足",
      validityPositive: "取出、放入都是正整数，倍数不小于2",
      validityWhole: "变化后的相差本数能平均分成“倍数减1”份",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      firstShelf: "第一个书架",
      secondShelf: "第二个书架",
      unknown: "？本",
      changedUnknown: "变化后：？本",
      part: "1份",
      parts: "{count}份",
      bookCount: "{count}本",
      originalBookCount: "原来：{count}本",
      changedBookCount: "变化后：{count}本",
      originalEqual: "原来一样多",
      afterMultiple: "变化后是{count}倍",
      partsRatio: "1份 : {count}份",
      takeOut: "取出{count}本",
      putIn: "放入{count}本",
      differenceBooks: "相差{count}本",
      differenceParts: "多{count}份",
      partsMatchBooks: "{parts}份 = {books}本",
      allParts: "共{count}份",
      everyPart: "每份{count}本",
      answer: "答：两个书架原来各有 {count} 本书。",
      invalidRemoved: "第一个书架取出的本数必须是大于0的整数。",
      invalidAdded: "第二个书架放入的本数必须是大于0的整数。",
      invalidMultiple: "变化后的倍数必须是不小于2的整数。",
      nonWholePart: "相差{gap}本不能平均分成{parts}份，不能得到整数本答案。",
      genericError: "请输入能得到整数本答案的题目数据。"
    },
    "en-US": {
      labName: "Math Motion Lab · Scene Lesson",
      title: "How Many Books Did Each Shelf Start With?",
      edit: "Edit problem",
      fullscreen: "Full screen",
      clickHint: "Click the stage to continue",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      parameters: "Problem values",
      settingsTitle: "Edit the bookshelf problem",
      settingsLead: "The values are checked for a whole-book answer, then the lesson restarts at step 1.",
      removedLabel: "Take from the first shelf",
      addedLabel: "Add to the second shelf",
      multipleLabel: "Multiple after the changes",
      booksUnit: "books",
      timesUnit: "times",
      validityTitle: "A valid problem must satisfy",
      validityPositive: "The removed and added counts are positive whole numbers, and the multiple is at least 2",
      validityWhole: "The final difference splits evenly into “multiple minus 1” parts",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      firstShelf: "First shelf",
      secondShelf: "Second shelf",
      unknown: "? books",
      changedUnknown: "After: ? books",
      part: "1 part",
      parts: "{count} parts",
      bookCount: "{count} books",
      originalBookCount: "At first: {count}",
      changedBookCount: "After: {count}",
      originalEqual: "Equal at the start",
      afterMultiple: "{count} times after the changes",
      partsRatio: "1 part : {count} parts",
      takeOut: "Take out {count}",
      putIn: "Add {count}",
      differenceBooks: "{count}-book difference",
      differenceParts: "{count} extra parts",
      partsMatchBooks: "{parts} parts = {books} books",
      allParts: "{count} parts in all",
      everyPart: "{count} books per part",
      answer: "Answer: Each shelf originally had {count} books.",
      invalidRemoved: "The number taken from the first shelf must be a whole number greater than 0.",
      invalidAdded: "The number added to the second shelf must be a whole number greater than 0.",
      invalidMultiple: "The final multiple must be a whole number of at least 2.",
      nonWholePart: "A difference of {gap} books cannot be split evenly into {parts} parts, so there is no whole-book answer.",
      genericError: "Enter values that give a whole-book answer."
    }
  };

  const stage = app.querySelector("[data-stage]");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");
  const prevButton = app.querySelector('[data-action="prev"]');
  const nextButton = app.querySelector('[data-action="next"]');
  const nextLabel = app.querySelector("[data-next-label]");
  const progressTrack = app.querySelector("[data-progress-track]");
  const question = app.querySelector("[data-question]");
  const chapter = app.querySelector("[data-chapter]");
  const stepTitle = app.querySelector("[data-step-title]");
  const stepCount = app.querySelector("[data-step-count]");
  const liveCopy = app.querySelector("[data-live-copy]");
  const stageDescription = app.querySelector("[data-stage-description]");

  const parts = {
    problemCopy: app.querySelector('[data-part="problem-copy"]'),
    middleEvidence: app.querySelector('[data-part="middle-evidence"]'),
    removeLabel: app.querySelector('[data-part="remove-label"]'),
    addLabel: app.querySelector('[data-part="add-label"]'),
    differenceBrace: app.querySelector('[data-part="difference-brace"]'),
    equation: app.querySelector('[data-part="equation"]'),
    firstCheck: app.querySelector('[data-check="first"]'),
    secondCheck: app.querySelector('[data-check="second"]'),
    multipleCheck: app.querySelector('[data-check="multiple"]'),
    answer: app.querySelector('[data-part="answer"]')
  };

  const scene = {
    firstReturn: [],
    secondAdded: [],
    firstPartLabels: [],
    secondPartLabels: [],
    secondPartSummary: null,
    differenceOverlay: null
  };

  const geometry = {
    innerX: 18,
    innerY: 20,
    innerWidth: 304,
    innerHeight: 150,
    secondGlobalX: 670,
    shelfGlobalY: 180
  };

  let currentStep = 0;
  let currentProblem = solve(values.removedFromFirst, values.addedToSecond, values.multiple);

  function language() {
    return MathLab.getLanguage();
  }

  function localCopy(key, replacements = {}) {
    const template = copy[language()]?.[key] ?? copy["zh-CN"][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(replacements[name] ?? `{${name}}`));
  }

  function tr(zh, en) {
    return language() === "zh-CN" ? zh : en;
  }

  function formatInteger(value) {
    try {
      return new Intl.NumberFormat(language()).format(value);
    } catch (error) {
      return value.toString();
    }
  }

  function ratio(numerator, denominator) {
    const scaled = (numerator * 1000000n) / denominator;
    return Number(scaled) / 1000000;
  }

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    return element;
  }

  function buildSteps(problem) {
    const removed = formatInteger(problem.removedFromFirst);
    const added = formatInteger(problem.addedToSecond);
    const multiple = formatInteger(problem.multiple);
    const gap = formatInteger(problem.gap);
    const differenceParts = formatInteger(problem.differenceParts);
    const firstAfter = formatInteger(problem.firstAfter);
    const secondAfter = formatInteger(problem.secondAfter);
    const original = formatInteger(problem.originalEach);

    return [
      {
        chapter: tr("读题", "Read"),
        title: tr("先读懂完整题目", "Read the whole problem"),
        question: tr("题目告诉了我们什么？最后要找什么？", "What facts do we know, and what must we find?"),
        live: tr("两个书架原来一样多，经过一减一加以后形成倍数关系。", "The shelves start equal, then one loses books while the other gains books."),
        view: { problemCopy: true, firstState: "original", secondState: "original", middle: "equal", firstCount: "unknown", secondCount: "unknown", removeLabel: true, addLabel: true }
      },
      {
        chapter: tr("取书", "Remove"),
        title: tr(`第一个书架取出${removed}本`, `Take ${removed} from the first shelf`),
        question: tr(`第一个书架取出${removed}本以后，书会怎样变化？`, `What changes when ${removed} books leave the first shelf?`),
        live: tr(`第一个书架少了${removed}本，留下的书明显变少。`, `The first shelf now has ${removed} fewer books.`),
        view: { firstState: "after", secondState: "original", firstCount: "changedUnknown", secondCount: "unknown", removeLabel: true }
      },
      {
        chapter: tr("放书", "Add"),
        title: tr(`第二个书架再放入${added}本`, `Add ${added} to the second shelf`),
        question: tr(`第二个书架再放入${added}本，两个书架的差距怎样变化？`, `How does adding ${added} books change the gap?`),
        live: tr(`一边减少，一边增加，两个书架之间的差距继续扩大。`, `One shelf loses books while the other gains books, so the gap grows.`),
        view: { firstState: "after", secondState: "after", firstCount: "changedUnknown", secondCount: "changedUnknown", addLabel: true, middle: "multiple" }
      },
      {
        chapter: tr("找差", "Difference"),
        title: tr(`两个变化合成${gap}本的差`, `The two changes make a gap of ${gap}`),
        question: tr("变化后相差多少本？为什么要把两个变化相加？", "What is the final difference, and why do we add both changes?"),
        live: tr(`${removed}加${added}等于${gap}，这就是变化后两个书架的差。`, `${removed} plus ${added} is ${gap}, the difference after both changes.`),
        view: { firstState: "after", secondState: "after", firstCount: "changedUnknown", secondCount: "changedUnknown", brace: "books", equation: `${removed} + ${added} = ${gap}` }
      },
      {
        chapter: tr("定1份", "One part"),
        title: tr("把第一个书架变化后的数量看作1份", "Treat the first shelf as one part"),
        question: tr("变化后的第一个书架可以看作几份？", "How many parts does the first shelf represent?"),
        live: tr("把第一个书架变化后的全部书看作1份。", "Treat all the books left on the first shelf as one part."),
        view: { firstState: "after", secondState: "after", firstCount: "onePart", secondCount: "changedUnknown", partLabels: "first" }
      },
      {
        chapter: tr("看倍数", "Multiple"),
        title: tr(`第二个书架正好是${multiple}个同样的份`, `The second shelf has ${multiple} equal parts`),
        question: tr(`第二个书架是第一个的${multiple}倍，应该分成几份？`, `If the second has ${multiple} times as many, how many equal parts should it have?`),
        live: tr(`第一个是1份，第二个就是${multiple}个同样大小的份。`, `The first shelf is one part, so the second has ${multiple} equal parts.`),
        view: { firstState: "after", secondState: "after", firstCount: "onePart", secondCount: "parts", partLabels: "parts", middle: "parts" }
      },
      {
        chapter: tr("找份差", "Extra parts"),
        title: tr(`${multiple}份比1份多${differenceParts}份`, `${multiple} parts are ${differenceParts} more than 1`),
        question: tr(`第二个书架比第一个书架多出几份？`, `How many extra parts does the second shelf have?`),
        live: tr(`${multiple}减1等于${differenceParts}，相差部分由${differenceParts}份组成。`, `${multiple} minus 1 is ${differenceParts}; the difference contains ${differenceParts} parts.`),
        view: { firstState: "after", secondState: "after", firstCount: "onePart", secondCount: "parts", partLabels: "parts", differenceOverlay: true, brace: "parts", equation: `${multiple} − 1 = ${differenceParts}` }
      },
      {
        chapter: tr("建立对应", "Match"),
        title: tr(`${differenceParts}份对应${gap}本`, `${differenceParts} parts match ${gap} books`),
        question: tr(`刚才找到的${gap}本，正好对应书架上的哪一部分？`, `Which part of the shelves matches the ${gap}-book difference?`),
        live: tr(`右边多出的${differenceParts}份，正好就是变化后的${gap}本差距。`, `The ${differenceParts} extra parts are exactly the ${gap}-book difference.`),
        view: { firstState: "after", secondState: "after", firstCount: "onePart", secondCount: "parts", partLabels: "parts", differenceOverlay: true, brace: "match", equation: `${differenceParts} ${tr("份", "parts")} = ${gap} ${tr("本", "books")}` }
      },
      {
        chapter: tr("求1份", "Find one part"),
        title: tr(`每份是${firstAfter}本`, `Each part has ${firstAfter} books`),
        question: tr(`把${gap}本平均分成${differenceParts}份，每份是多少本？`, `Share ${gap} books among ${differenceParts} parts. How many are in each part?`),
        live: tr(`${gap}除以${differenceParts}等于${firstAfter}，所以第一个书架变化后有${firstAfter}本。`, `${gap} divided by ${differenceParts} is ${firstAfter}, the first shelf's amount after the change.`),
        view: { firstState: "after", secondState: "after", firstCount: "firstAfter", secondCount: "secondAfter", partLabels: "values", differenceOverlay: true, brace: "match", equation: `${gap} ÷ ${differenceParts} = ${firstAfter}` }
      },
      {
        chapter: tr("倒推原数", "Work back"),
        title: tr(`把取出的${removed}本补回去`, `Restore the ${removed} removed books`),
        question: tr(`第一个书架变化后有${firstAfter}本，原来有多少本？`, `The first shelf has ${firstAfter} books after the change. How many did it have at first?`),
        live: tr(`${firstAfter}加${removed}等于${original}，第一个书架原来有${original}本。`, `${firstAfter} plus ${removed} is ${original}, the first shelf's starting amount.`),
        view: { firstState: "original", secondState: "after", firstCount: "original", secondCount: "secondAfter", equation: `${firstAfter} + ${removed} = ${original}` }
      },
      {
        chapter: tr("恢复原来", "Restore"),
        title: tr("两个书架原来一样多", "The shelves started equal"),
        question: tr(`第一个书架原来有${original}本，第二个书架原来呢？`, `If the first started with ${original}, what about the second?`),
        live: tr(`题目说两个书架原来一样多，所以第二个书架原来也有${original}本。`, `The problem says the shelves started equal, so the second also started with ${original}.`),
        view: { firstState: "original", secondState: "original", firstCount: "original", secondCount: "original", middle: "equal", equation: `${original} = ${original}` }
      },
      {
        chapter: tr("检验", "Check"),
        title: tr("检查第一个书架的变化", "Check the first shelf"),
        question: tr(`从${original}本取出${removed}本，结果对吗？`, `Does removing ${removed} from ${original} give the right result?`),
        live: tr(`${original}减${removed}等于${firstAfter}，第一个书架的变化正确。`, `${original} minus ${removed} is ${firstAfter}; the first change is correct.`),
        view: { firstState: "after", secondState: "original", firstCount: "firstAfter", secondCount: "original", removeLabel: true, equation: `${original} − ${removed} = ${firstAfter}`, checks: 1 }
      },
      {
        chapter: tr("检验", "Check"),
        title: tr("检查第二个书架的变化", "Check the second shelf"),
        question: tr(`在${original}本的基础上放入${added}本，结果对吗？`, `Does adding ${added} to ${original} give the right result?`),
        live: tr(`${original}加${added}等于${secondAfter}，第二个书架的变化正确。`, `${original} plus ${added} is ${secondAfter}; the second change is correct.`),
        view: { firstState: "after", secondState: "after", firstCount: "firstAfter", secondCount: "secondAfter", addLabel: true, equation: `${original} + ${added} = ${secondAfter}`, checks: 2 }
      },
      {
        chapter: tr("检验", "Check"),
        title: tr(`变化后确实是${multiple}倍`, `The final multiple is ${multiple}`),
        question: tr(`变化后的${secondAfter}本是${firstAfter}本的几倍？`, `How many times ${firstAfter} is ${secondAfter}?`),
        live: tr(`${secondAfter}除以${firstAfter}等于${multiple}，倍数关系也正确。`, `${secondAfter} divided by ${firstAfter} is ${multiple}; the multiple also matches.`),
        view: { firstState: "after", secondState: "after", firstCount: "firstAfter", secondCount: "secondAfter", middle: "multiple", equation: `${secondAfter} ÷ ${firstAfter} = ${multiple}`, checks: 3 }
      },
      {
        chapter: tr("结论", "Answer"),
        title: tr("写出完整答案", "State the complete answer"),
        question: tr("所有条件都检验正确，完整答案是什么？", "All conditions match. What is the complete answer?"),
        live: tr(`两个书架原来各有${original}本书。`, `Each shelf originally had ${original} books.`),
        view: { firstState: "after", secondState: "after", firstCount: "firstAfter", secondCount: "secondAfter", middle: "multiple", checks: 3, answer: true }
      }
    ];
  }

  function setVisible(element, visible) {
    element?.classList.toggle("is-visible", Boolean(visible));
  }

  function makeBook(role, rowIndex, slotIndex, rowTop, rowBottom, innerX, innerWidth) {
    const booksPerRow = 18;
    const widthFactors = [0.58, 0.68, 0.62, 0.72];
    const heightOffsets = [5, 1, 8, 3];
    const slotWidth = innerWidth / booksPerRow;
    const tone = (slotIndex + rowIndex * 2) % widthFactors.length;
    const width = slotWidth * widthFactors[tone];
    const height = Math.max(16, rowBottom - rowTop - 9 - heightOffsets[tone]);
    return svgElement("rect", {
      class: `shelf-book is-${role} tone-${tone}`,
      x: innerX + slotIndex * slotWidth + (slotWidth - width) / 2,
      y: rowBottom - height - 4,
      width,
      height,
      rx: 1.6
    });
  }

  function makeBookRange(className, role, startValue, endValue, totalValue, physicalRows) {
    const group = svgElement("g", {
      class: `shelf-book-segment ${className}`
    });
    const { innerX, innerY, innerWidth, innerHeight } = geometry;
    const booksPerRow = 18;
    const bottom = innerY + innerHeight;
    const rowHeight = innerHeight / physicalRows;
    const startPosition = ratio(startValue, totalValue) * physicalRows;
    const endPosition = ratio(endValue, totalValue) * physicalRows;

    for (let rowIndex = 0; rowIndex < physicalRows; rowIndex += 1) {
      const localStart = Math.max(0, Math.min(1, startPosition - rowIndex));
      const localEnd = Math.max(0, Math.min(1, endPosition - rowIndex));
      const startSlot = Math.round(localStart * booksPerRow);
      const endSlot = Math.round(localEnd * booksPerRow);
      if (endSlot <= startSlot) continue;

      const rowBottom = bottom - rowIndex * rowHeight;
      const rowTop = rowBottom - rowHeight;
      for (let slotIndex = startSlot; slotIndex < endSlot; slotIndex += 1) {
        group.append(makeBook(role, rowIndex, slotIndex, rowTop, rowBottom, innerX, innerWidth));
      }
    }

    return group;
  }

  function makeText(className, x, y, content) {
    const text = svgElement("text", {
      class: className,
      x,
      y,
      "text-anchor": "middle"
    });
    text.textContent = content;
    return text;
  }

  function buildBookcaseGeometry(problem) {
    const firstLayer = app.querySelector("[data-first-rows]");
    const secondLayer = app.querySelector("[data-second-rows]");
    firstLayer.replaceChildren();
    secondLayer.replaceChildren();

    scene.firstReturn = [];
    scene.secondAdded = [];
    scene.firstPartLabels = [];
    scene.secondPartLabels = [];
    scene.secondPartSummary = null;
    scene.differenceOverlay = null;

    const { innerX, innerY, innerWidth, innerHeight } = geometry;
    const multipleNumber = problem.multiple <= 20n ? Number(problem.multiple) : 20;
    const exactRows = problem.multiple <= 6n;
    const physicalRows = exactRows ? Number(problem.multiple) : 4;
    const oneRatio = ratio(problem.firstAfter, problem.secondAfter);
    const bottom = innerY + innerHeight;
    const oneTop = bottom - innerHeight * oneRatio;

    for (const layer of [firstLayer, secondLayer]) {
      layer.append(svgElement("rect", {
        class: "shelf-row-background",
        x: innerX,
        y: innerY,
        width: innerWidth,
        height: innerHeight
      }));
    }

    const firstBase = makeBookRange(
      "shelf-first-base",
      "first",
      0n,
      problem.firstAfter,
      problem.secondAfter,
      physicalRows
    );
    const firstReturn = makeBookRange(
      "shelf-first-return",
      "first",
      problem.firstAfter,
      problem.originalEach,
      problem.secondAfter,
      physicalRows
    );
    firstLayer.append(firstBase, firstReturn);
    scene.firstReturn.push(firstReturn);

    const secondBase = makeBookRange(
      "shelf-second-base",
      "second",
      0n,
      problem.originalEach,
      problem.secondAfter,
      physicalRows
    );
    const secondAdded = makeBookRange(
      "shelf-second-added is-hidden",
      "added",
      problem.originalEach,
      problem.secondAfter,
      problem.secondAfter,
      physicalRows
    );
    secondLayer.append(secondBase, secondAdded);
    scene.secondAdded.push(secondAdded);

    const differenceOverlay = svgElement("rect", {
      class: "shelf-difference-overlay",
      x: innerX + 2,
      y: innerY + 2,
      width: innerWidth - 4,
      height: Math.max(0, oneTop - innerY - 4),
      rx: 7
    });
    secondLayer.append(differenceOverlay);
    scene.differenceOverlay = differenceOverlay;

    for (let index = 1; index < physicalRows; index += 1) {
      const y = innerY + (innerHeight * index) / physicalRows;
      for (const layer of [firstLayer, secondLayer]) {
        layer.append(svgElement("rect", {
          class: "shelf-row-board",
          x: innerX - 3,
          y: y - 3,
          width: innerWidth + 6,
          height: 7,
          rx: 2
        }));
      }
    }

    const firstLabelY = oneTop + (bottom - oneTop) / 2 + 6;
    const firstLabel = makeText("shelf-part-label is-first", innerX + innerWidth / 2, firstLabelY, localCopy("part"));
    firstLayer.append(firstLabel);
    scene.firstPartLabels.push(firstLabel);

    if (problem.multiple <= 6n) {
      for (let index = 0; index < multipleNumber; index += 1) {
        const rowBottom = bottom - innerHeight * (index / multipleNumber);
        const rowTop = bottom - innerHeight * ((index + 1) / multipleNumber);
        const label = makeText(
          "shelf-part-label is-second",
          innerX + innerWidth / 2,
          rowTop + (rowBottom - rowTop) / 2 + 6,
          localCopy("part")
        );
        secondLayer.append(label);
        scene.secondPartLabels.push(label);
      }
    } else {
      const summary = makeText(
        "shelf-part-label is-second",
        innerX + innerWidth / 2,
        innerY + innerHeight / 2 + 6,
        localCopy("allParts", { count: formatInteger(problem.multiple) })
      );
      secondLayer.append(summary);
      scene.secondPartSummary = summary;
    }

    const braceX = 646;
    const braceTop = geometry.shelfGlobalY + innerY;
    const braceBottom = geometry.shelfGlobalY + oneTop;
    const middle = (braceTop + braceBottom) / 2;
    const bracePath = [
      `M${braceX} ${braceTop}`,
      `h-12`,
      `v${Math.max(0, middle - braceTop - 15)}`,
      "q0 15-14 15",
      "q14 0 14 15",
      `v${Math.max(0, braceBottom - middle - 15)}`,
      "h12"
    ].join(" ");
    app.querySelector("[data-difference-brace-path]").setAttribute("d", bracePath);
    const braceLabel = app.querySelector("[data-difference-brace-label]");
    braceLabel.setAttribute("x", "622");
    braceLabel.setAttribute("y", String(middle + 6));
    braceLabel.setAttribute("text-anchor", "end");
  }

  function buildProgress() {
    const stepTotal = 15;
    progressTrack.style.setProperty("--step-count", String(stepTotal));
    for (let index = 0; index < stepTotal; index += 1) {
      const segment = document.createElement("span");
      segment.className = "shelf-progress-segment";
      segment.setAttribute("aria-hidden", "true");
      progressTrack.append(segment);
    }
  }

  function problemLines(problem) {
    const removed = formatInteger(problem.removedFromFirst);
    const added = formatInteger(problem.addedToSecond);
    const multiple = formatInteger(problem.multiple);
    if (language() === "zh-CN") {
      return [
        `两个书架原来一样多；第一个取出${removed}本，第二个放入${added}本。`,
        `变化后第二个是第一个的${multiple}倍。两个书架原来各有多少本？`
      ];
    }
    return [
      `The shelves start equal. Take ${removed} from the first and add ${added} to the second.`,
      `Then the second has ${multiple} times as many. How many books did each start with?`
    ];
  }

  function countText(mode, owner, problem) {
    const firstAfter = formatInteger(problem.firstAfter);
    const secondAfter = formatInteger(problem.secondAfter);
    const original = formatInteger(problem.originalEach);
    const multiple = formatInteger(problem.multiple);
    if (mode === "unknown") return localCopy("unknown");
    if (mode === "changedUnknown") return localCopy("changedUnknown");
    if (mode === "onePart") return localCopy("part");
    if (mode === "parts") return localCopy("parts", { count: multiple });
    if (mode === "firstAfter") return localCopy("changedBookCount", { count: firstAfter });
    if (mode === "secondAfter") return localCopy("changedBookCount", { count: secondAfter });
    if (mode === "original") return localCopy("originalBookCount", { count: original });
    return owner === "first" ? firstAfter : secondAfter;
  }

  function renderStaticCopy() {
    document.documentElement.lang = language();
    document.title = `${localCopy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (copy[language()]?.[key]) element.textContent = localCopy(key);
    });
    app.querySelector('[data-action="back"]').setAttribute("aria-label", tr("返回课程目录", "Back to catalog"));
    app.querySelector('[data-action="close-settings"]').setAttribute("aria-label", localCopy("close"));
    app.querySelector("[data-first-name]").textContent = localCopy("firstShelf");
    app.querySelector("[data-second-name]").textContent = localCopy("secondShelf");
  }

  function renderPartLabels(mode, problem) {
    const onePart = formatInteger(problem.firstAfter);
    const firstVisible = mode === "first" || mode === "parts" || mode === "values";
    const secondVisible = mode === "parts" || mode === "values";

    scene.firstPartLabels.forEach((label) => {
      label.textContent = mode === "values" ? localCopy("bookCount", { count: onePart }) : localCopy("part");
      label.classList.toggle("is-visible", firstVisible);
    });

    scene.secondPartLabels.forEach((label) => {
      label.textContent = mode === "values" ? localCopy("bookCount", { count: onePart }) : localCopy("part");
      label.classList.toggle("is-visible", secondVisible);
    });

    if (scene.secondPartSummary) {
      scene.secondPartSummary.textContent = mode === "values"
        ? `${localCopy("allParts", { count: formatInteger(problem.multiple) })} · ${localCopy("everyPart", { count: onePart })}`
        : localCopy("allParts", { count: formatInteger(problem.multiple) });
      scene.secondPartSummary.classList.toggle("is-visible", secondVisible);
    }
  }

  function renderBookState(view, previousStep) {
    const movingForward = currentStep > previousStep;

    scene.firstReturn.forEach((segment) => {
      const firstIsAfter = view.firstState === "after";
      segment.classList.toggle("is-ghost", firstIsAfter);
      segment.classList.remove("is-hidden", "is-moving-out", "is-moving-in");
      if (movingForward && firstIsAfter && (currentStep === 1 || currentStep === 11)) {
        segment.classList.add("is-moving-out");
      }
      if (movingForward && !firstIsAfter && currentStep === 9) {
        segment.classList.add("is-moving-in");
      }
    });

    scene.secondAdded.forEach((segment) => {
      const secondIsAfter = view.secondState === "after";
      segment.classList.toggle("is-hidden", !secondIsAfter);
      segment.classList.remove("is-moving-in");
      if (movingForward && secondIsAfter && (currentStep === 2 || currentStep === 12)) {
        segment.classList.add("is-moving-in");
      }
    });
  }

  function renderMiddle(mode, problem) {
    const symbol = app.querySelector("[data-equality-symbol]");
    const label = app.querySelector("[data-equality-label]");
    const multiple = formatInteger(problem.multiple);
    setVisible(parts.middleEvidence, Boolean(mode));
    if (mode === "equal") {
      symbol.textContent = "=";
      label.textContent = localCopy("originalEqual");
    }
    if (mode === "multiple") {
      symbol.textContent = `1 : ${multiple}`;
      label.textContent = localCopy("afterMultiple", { count: multiple });
    }
    if (mode === "parts") {
      symbol.textContent = `1 : ${multiple}`;
      label.textContent = localCopy("partsRatio", { count: multiple });
    }
  }

  function renderBrace(mode, problem) {
    const label = app.querySelector("[data-difference-brace-label]");
    setVisible(parts.differenceBrace, Boolean(mode));
    if (mode === "books") {
      label.textContent = localCopy("differenceBooks", { count: formatInteger(problem.gap) });
    }
    if (mode === "parts") {
      label.textContent = localCopy("differenceParts", { count: formatInteger(problem.differenceParts) });
    }
    if (mode === "match") {
      label.textContent = localCopy("partsMatchBooks", {
        parts: formatInteger(problem.differenceParts),
        books: formatInteger(problem.gap)
      });
    }
  }

  function renderChecks(count, problem) {
    const firstAfter = formatInteger(problem.firstAfter);
    const secondAfter = formatInteger(problem.secondAfter);
    const original = formatInteger(problem.originalEach);
    const removed = formatInteger(problem.removedFromFirst);
    const added = formatInteger(problem.addedToSecond);
    const multiple = formatInteger(problem.multiple);

    app.querySelector("[data-first-check]").textContent = `${original} − ${removed} = ${firstAfter}`;
    app.querySelector("[data-second-check]").textContent = `${original} + ${added} = ${secondAfter}`;
    app.querySelector("[data-multiple-check]").textContent = `${secondAfter} ÷ ${firstAfter} = ${multiple}`;
    setVisible(parts.firstCheck, count >= 1);
    setVisible(parts.secondCheck, count >= 2);
    setVisible(parts.multipleCheck, count >= 3);
  }

  function renderStep(previousStep = currentStep) {
    const problem = currentProblem;
    const steps = buildSteps(problem);
    const step = steps[currentStep];
    const view = step.view;

    renderStaticCopy();
    const lines = problemLines(problem);
    app.querySelector('[data-problem-line="one"]').textContent = lines[0];
    app.querySelector('[data-problem-line="two"]').textContent = lines[1];
    app.querySelector("[data-remove-label]").textContent = localCopy("takeOut", { count: formatInteger(problem.removedFromFirst) });
    app.querySelector("[data-add-label]").textContent = localCopy("putIn", { count: formatInteger(problem.addedToSecond) });

    question.textContent = step.question;
    chapter.textContent = step.chapter;
    stepTitle.textContent = step.title;
    liveCopy.textContent = step.live;
    stageDescription.textContent = step.live;
    app.querySelector("[data-first-count]").textContent = countText(view.firstCount, "first", problem);
    app.querySelector("[data-second-count]").textContent = countText(view.secondCount, "second", problem);

    setVisible(parts.problemCopy, view.problemCopy);
    setVisible(parts.removeLabel, view.removeLabel);
    setVisible(parts.addLabel, view.addLabel);
    renderMiddle(view.middle, problem);
    renderBrace(view.brace, problem);
    setVisible(parts.equation, Boolean(view.equation));
    app.querySelector("[data-equation]").textContent = view.equation || "";
    renderPartLabels(view.partLabels, problem);
    scene.differenceOverlay?.classList.toggle("is-visible", Boolean(view.differenceOverlay));
    renderBookState(view, previousStep);
    renderChecks(view.checks || 0, problem);

    setVisible(parts.answer, view.answer);
    app.querySelector("[data-answer]").textContent = localCopy("answer", { count: formatInteger(problem.originalEach) });

    const isFinal = currentStep === steps.length - 1;
    stage.dataset.final = String(isFinal);
    prevButton.disabled = currentStep === 0;
    nextLabel.textContent = isFinal ? localCopy("replay") : localCopy("next");
    stepCount.textContent = `${currentStep + 1} / ${steps.length}`;

    Array.from(progressTrack.children).forEach((segment, index) => {
      segment.classList.toggle("is-complete", index < currentStep);
      segment.classList.toggle("is-current", index === currentStep);
    });
  }

  function goToStep(nextStep) {
    const steps = buildSteps(currentProblem);
    const bounded = Math.max(0, Math.min(nextStep, steps.length - 1));
    if (bounded === currentStep) return;
    const previousStep = currentStep;
    currentStep = bounded;
    renderStep(previousStep);
  }

  function advance() {
    const steps = buildSteps(currentProblem);
    if (currentStep === steps.length - 1) {
      const previousStep = currentStep;
      currentStep = 0;
      renderStep(previousStep);
      return;
    }
    goToStep(currentStep + 1);
  }

  function openSettings() {
    app.querySelector('[data-setting="removedFromFirst"]').value = values.removedFromFirst;
    app.querySelector('[data-setting="addedToSecond"]').value = values.addedToSecond;
    app.querySelector('[data-setting="multiple"]').value = values.multiple;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-removed") return localCopy("invalidRemoved");
    if (problem.reason === "invalid-added") return localCopy("invalidAdded");
    if (problem.reason === "invalid-multiple") return localCopy("invalidMultiple");
    if (problem.reason === "non-whole-part") {
      return localCopy("nonWholePart", {
        gap: formatInteger(problem.gap),
        parts: formatInteger(problem.differenceParts)
      });
    }
    return localCopy("genericError");
  }

  function applySettings() {
    const nextValues = {
      removedFromFirst: app.querySelector('[data-setting="removedFromFirst"]').value.trim(),
      addedToSecond: app.querySelector('[data-setting="addedToSecond"]').value.trim(),
      multiple: app.querySelector('[data-setting="multiple"]').value.trim()
    };
    const problem = solve(nextValues.removedFromFirst, nextValues.addedToSecond, nextValues.multiple);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }

    values.removedFromFirst = problem.removedFromFirst.toString();
    values.addedToSecond = problem.addedToSecond.toString();
    values.multiple = problem.multiple.toString();
    currentProblem = problem;
    currentStep = 0;
    settingsDialog.close();
    buildBookcaseGeometry(problem);
    renderStep();
  }

  function isInteractiveTarget(target) {
    return target instanceof Element && Boolean(target.closest("button, a, input"));
  }

  stage.addEventListener("click", (event) => {
    if (!isInteractiveTarget(event.target) && stage.dataset.final !== "true") advance();
  });

  stage.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && stage.dataset.final !== "true") {
      event.preventDefault();
      event.stopPropagation();
      advance();
    }
  });

  app.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "prev") goToStep(currentStep - 1);
    if (action === "next") advance();
    if (action === "edit") openSettings();
    if (action === "apply-settings") applySettings();
    if (action === "close-settings" || action === "cancel-settings") settingsDialog.close();
    if (action === "fullscreen") {
      const request = document.fullscreenElement ? document.exitFullscreen?.() : app.requestFullscreen?.();
      request?.catch?.(() => {});
    }
  });

  document.addEventListener("keydown", (event) => {
    if (settingsDialog.open) return;
    const interactiveTarget = isInteractiveTarget(event.target);
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      if (stage.dataset.final !== "true") advance();
    }
    if (event.key === " " && !interactiveTarget) {
      event.preventDefault();
      if (stage.dataset.final !== "true") advance();
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goToStep(currentStep - 1);
    }
  });

  MathLab.bindLanguageToggle(() => {
    buildBookcaseGeometry(currentProblem);
    renderStep();
  });

  buildProgress();
  buildBookcaseGeometry(currentProblem);
  renderStep();
})();
