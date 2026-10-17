(() => {
  "use strict";

  const app = document.querySelector("[data-box-app]");
  const solve = window.MathLabModels?.quantity?.boxTransferDifferenceState;
  if (!app || typeof solve !== "function" || !window.MathLab) return;

  const DEFAULTS = Object.freeze({
    totalBags: "90",
    movedToSecond: "4",
    firstStillMore: "6"
  });

  const values = {
    totalBags: DEFAULTS.totalBags,
    movedToSecond: DEFAULTS.movedToSecond,
    firstStillMore: DEFAULTS.firstStillMore
  };

  const copy = {
    "zh-CN": {
      labName: "Math Motion Lab · 教师点击课件",
      title: "甲乙两箱原来各有多少袋洗衣粉",
      edit: "编辑题目",
      fullscreen: "全屏",
      clickHint: "点击舞台空白处继续",
      prev: "上一步",
      next: "下一步",
      replay: "重新讲解",
      paceHint: "每次点击只推进一个动作",
      parameters: "题目参数",
      settingsTitle: "编辑两箱移袋问题",
      settingsLead: "应用后会检查能否得到正整数袋答案，并从第1步重新讲解。",
      totalLabel: "两箱共有",
      movedLabel: "从甲箱移到乙箱",
      differenceLabel: "移动后甲箱仍多",
      bagsUnit: "袋",
      validityTitle: "有效题目需要满足",
      validityPositive: "三个数都是正整数，且相差袋数小于总袋数",
      validityWhole: "总袋数减去相差袋数后，可以平均分成两份",
      validityTransfer: "乙箱原来的袋数必须大于0",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      firstBox: "甲箱",
      secondBox: "乙箱",
      unknownCount: "？袋",
      equalCount: "相同部分：{count}袋",
      afterCount: "移动后：{count}袋",
      originalCount: "原来：{count}袋",
      totalCount: "共{count}袋",
      movedBags: "{count}袋",
      movedCaption: "从甲箱移到乙箱",
      returnedCaption: "把移走的袋子还给甲箱",
      differenceCount: "多出的{count}袋",
      equalLabel: "拿走多出的部分后，两箱一样多",
      ghostLabel: "按题意再移{count}袋",
      answerChecks: "✓ 总数正确　✓ 移动后的相差也正确",
      answer: "答：甲箱原来有{first}袋，乙箱原来有{second}袋。",
      invalidTotal: "两箱总袋数必须是大于0的整数。",
      invalidTransfer: "移动袋数必须是大于0的整数。",
      invalidDifference: "移动后的相差袋数必须是大于0的整数。",
      differenceTooLarge: "相差袋数必须小于两箱总袋数。",
      nonWholeHalf: "{total}减去{difference}等于{remaining}，不能平均分成两份，无法得到整数袋答案。",
      transferTooLarge: "移动{moved}袋后，乙箱原来的袋数将不大于0，请减小移动袋数。",
      genericError: "请输入能得到正整数袋答案的题目数据。"
    },
    "en-US": {
      labName: "Math Motion Lab · Teacher-paced lesson",
      title: "How Many Detergent Bags Were in Each Box?",
      edit: "Edit problem",
      fullscreen: "Full screen",
      clickHint: "Click the blank stage to continue",
      prev: "Previous",
      next: "Next",
      replay: "Replay",
      paceHint: "One teaching action per click",
      parameters: "Problem values",
      settingsTitle: "Edit the two-box transfer problem",
      settingsLead: "The values are checked for positive whole-bag answers, then the lesson restarts at step 1.",
      totalLabel: "Total in both boxes",
      movedLabel: "Move from A to B",
      differenceLabel: "A still has this many more",
      bagsUnit: "bags",
      validityTitle: "A valid problem must satisfy",
      validityPositive: "All three values are positive whole numbers, and the difference is less than the total",
      validityWhole: "The total minus the difference can be shared equally between two boxes",
      validityTransfer: "Box B's original count must be greater than 0",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      firstBox: "Box A",
      secondBox: "Box B",
      unknownCount: "? bags",
      equalCount: "Equal part: {count} bags",
      afterCount: "After: {count} bags",
      originalCount: "At first: {count} bags",
      totalCount: "{count} bags in all",
      movedBags: "{count} bags",
      movedCaption: "Move from Box A to Box B",
      returnedCaption: "Return the moved bags to Box A",
      differenceCount: "{count} extra bags",
      equalLabel: "Without the extra part, the boxes are equal",
      ghostLabel: "Check by moving {count} bags again",
      answerChecks: "✓ The total matches　✓ The final difference matches",
      answer: "Answer: Box A had {first} bags and Box B had {second} bags.",
      invalidTotal: "The total must be a whole number greater than 0.",
      invalidTransfer: "The moved amount must be a whole number greater than 0.",
      invalidDifference: "The final difference must be a whole number greater than 0.",
      differenceTooLarge: "The difference must be smaller than the total.",
      nonWholeHalf: "{total} minus {difference} is {remaining}, which cannot be shared equally between two boxes.",
      transferTooLarge: "Moving {moved} bags would make Box B's original count non-positive. Use a smaller moved amount.",
      genericError: "Enter values that give positive whole-bag answers."
    }
  };

  const stage = app.querySelector("[data-stage]");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");
  const previousButton = app.querySelector('[data-action="prev"]');
  const nextButton = app.querySelector('[data-action="next"]');
  const nextLabel = app.querySelector("[data-next-label]");
  const questionIndex = app.querySelector("[data-question-index]");
  const chapter = app.querySelector("[data-chapter]");
  const stepTitle = app.querySelector("[data-step-title]");
  const question = app.querySelector("[data-question]");
  const stepCount = app.querySelector("[data-step-count]");
  const progressTrack = app.querySelector("[data-progress-track]");
  const liveCopy = app.querySelector("[data-live-copy]");
  const stageDescription = app.querySelector("[data-stage-description]");

  const parts = {
    problemCopy: app.querySelector('[data-part="problem-copy"]'),
    sceneCopy: app.querySelector('[data-part="scene-copy"]'),
    totalEvidence: app.querySelector('[data-part="total-evidence"]'),
    transferRail: app.querySelector('[data-part="transfer-rail"]'),
    differenceEvidence: app.querySelector('[data-part="difference-evidence"]'),
    equalEvidence: app.querySelector('[data-part="equal-evidence"]'),
    verification: app.querySelector('[data-part="verification"]'),
    formulaBoard: app.querySelector('[data-part="formula-board"]'),
    answer: app.querySelector('[data-part="answer"]')
  };

  const scene = {
    firstBase: app.querySelector("[data-a-base]"),
    firstExcessGroup: app.querySelector("[data-a-excess-group]"),
    firstExcess: app.querySelector("[data-a-excess]"),
    firstExcessLabel: app.querySelector("[data-a-excess-label]"),
    firstTransfer: app.querySelector("[data-a-transfer]"),
    firstUnknown: app.querySelector("[data-a-unknown]"),
    secondOriginal: app.querySelector("[data-b-original]"),
    secondTransfer: app.querySelector("[data-b-transfer]"),
    secondUnknown: app.querySelector("[data-b-unknown]"),
    firstCount: app.querySelector("[data-first-count]"),
    secondCount: app.querySelector("[data-second-count]"),
    bundle: app.querySelector("[data-transfer-bundle]"),
    bundleRect: app.querySelector("[data-transfer-bundle-rect]"),
    transferForwardPath: app.querySelector('[data-transfer-path="forward"]'),
    transferBackwardPath: app.querySelector('[data-transfer-path="backward"]'),
    differencePath: app.querySelector("[data-difference-brace-path]"),
    differenceLabel: app.querySelector("[data-difference-label]"),
    equalLine: app.querySelector("[data-equal-line]"),
    equalTicks: app.querySelector("[data-equal-ticks]"),
    ghostPath: app.querySelector("[data-ghost-path]"),
    firstAfterMark: app.querySelector("[data-after-first-mark]"),
    secondAfterMark: app.querySelector("[data-after-second-mark]")
  };

  const geometry = {
    trackX: 210,
    trackWidth: 720,
    firstTrackY: 250,
    secondTrackY: 385,
    trackHeight: 68,
    transferFirstTransform: "",
    transferSecondTransform: "",
    transferFirstCssTransform: "",
    transferSecondCssTransform: ""
  };

  let currentStep = 0;
  let currentProblem = solve(values.totalBags, values.movedToSecond, values.firstStillMore);

  function language() {
    return MathLab.getLanguage();
  }

  function tr(zh, en) {
    return language() === "zh-CN" ? zh : en;
  }

  function localCopy(key, replacements = {}) {
    const template = copy[language()]?.[key] ?? copy["zh-CN"][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(replacements[name] ?? `{${name}}`));
  }

  function formatInteger(value) {
    try {
      return new Intl.NumberFormat(language()).format(value);
    } catch (error) {
      return value.toString();
    }
  }

  function amountRatio(value, maximum) {
    return Number((value * 1000000n) / maximum) / 1000000;
  }

  function setVisible(element, visible) {
    element?.classList.toggle("is-visible", Boolean(visible));
  }

  function buildSteps(problem) {
    const total = formatInteger(problem.totalBags);
    const moved = formatInteger(problem.movedToSecond);
    const difference = formatInteger(problem.firstStillMore);
    const remaining = formatInteger(problem.remainingAfterExcess);
    const equal = formatInteger(problem.equalShare);
    const firstAfter = formatInteger(problem.firstAfter);
    const secondAfter = formatInteger(problem.secondAfter);
    const firstOriginal = formatInteger(problem.firstOriginal);
    const secondOriginal = formatInteger(problem.secondOriginal);
    const bag = (count) => tr(`${count}袋`, `${count} ${count === "1" ? "bag" : "bags"}`);

    return [
      {
        chapter: tr("读题", "Read"),
        title: tr("先读懂完整题目", "Read the whole problem"),
        question: tr("题目告诉了我们什么？最后要找什么？", "What facts do we know, and what must we find?"),
        live: tr(
          `甲乙两箱共有${total}袋，从甲移${moved}袋到乙后，甲仍比乙多${difference}袋。`,
          `The boxes hold ${total} bags in all. After moving ${bag(moved)} from A to B, A still has ${difference} more.`
        ),
        view: {
          problem: true,
          aState: "original",
          bState: "original",
          concealed: true,
          firstCount: localCopy("unknownCount"),
          secondCount: localCopy("unknownCount")
        }
      },
      {
        chapter: tr("总数不变", "Keep the total"),
        title: tr("移动后，总数变不变？", "Does moving bags change the total?"),
        question: tr(
          `只是把${moved}袋从一个箱子放到另一个箱子，两箱总数会变吗？`,
          `If ${moved} bags only move from one box to the other, does the total change?`
        ),
        live: tr(
          `没有袋子进入或离开两个箱子，所以移动前后总数仍是${total}袋。`,
          `No bag enters or leaves the two boxes, so the total stays ${total}.`
        ),
        view: {
          heading: tr("只换位置，总数不变", "The bags change place, not the total"),
          note: tr("所有洗衣粉仍在这两个箱子里", "Every bag is still inside these two boxes"),
          total: true,
          aState: "original",
          bState: "original",
          concealed: true,
          firstCount: localCopy("unknownCount"),
          secondCount: localCopy("unknownCount"),
          formulas: [tr(`移动前后：总数仍是${bag(total)}`, `Before and after: ${bag(total)} in all`)]
        }
      },
      {
        chapter: tr("移动", "Move"),
        title: tr(`把${moved}袋从甲箱移到乙箱`, `Move ${moved} bags from A to B`),
        question: tr(
          `这${moved}袋应该从哪里出发，移到哪里？`,
          `Where do these ${moved} bags start, and where do they go?`
        ),
        live: tr(
          `${moved}袋离开甲箱，进入乙箱；总数没有改变。`,
          `${moved} bags leave Box A and enter Box B; the total does not change.`
        ),
        view: {
          heading: tr(`甲箱 → 乙箱：移动${moved}袋`, `Box A → Box B: move ${moved} bags`),
          note: tr("看清移动方向", "Follow the direction of the move"),
          total: true,
          transfer: true,
          transferPosition: "second",
          transferDirection: "forward",
          aState: "after",
          bState: "after",
          concealed: true,
          firstCount: localCopy("unknownCount"),
          secondCount: localCopy("unknownCount"),
          formulas: [tr(`甲箱 → 乙箱：${bag(moved)}`, `Box A → Box B: ${bag(moved)}`)]
        }
      },
      {
        chapter: tr("看相差", "Compare"),
        title: tr(`移动后，甲箱仍多${difference}袋`, `After the move, A still has ${difference} more`),
        question: tr(
          `移动完成后，甲箱比乙箱多出的部分是多少袋？`,
          `After the move, how many extra bags does Box A have?`
        ),
        live: tr(
          `红色这一段就是甲箱比乙箱多出的${difference}袋。`,
          `The red segment is the ${difference}-bag excess in Box A.`
        ),
        view: {
          heading: tr(`移动后：甲箱比乙箱多${difference}袋`, `After the move: A has ${difference} more than B`),
          note: tr("相同部分之外，甲箱还多一小段", "Beyond the equal part, Box A has one extra segment"),
          total: true,
          transfer: true,
          transferPosition: "second",
          transferDirection: "forward",
          difference: true,
          aState: "after",
          bState: "after",
          concealed: false,
          firstCount: localCopy("unknownCount"),
          secondCount: localCopy("unknownCount"),
          formulas: [
            tr(
              `甲箱比乙箱多${bag(difference)}`,
              `Box A has ${difference} more ${difference === "1" ? "bag" : "bags"}`
            )
          ]
        }
      },
      {
        chapter: tr("去掉多出", "Set aside"),
        title: tr(`暂时拿走甲箱多出的${difference}袋`, `Set aside A's ${difference} extra bags`),
        question: tr(
          `把甲箱多出的${difference}袋暂时拿走，两个箱子会怎样？`,
          `If we set aside A's ${difference} extra bags, how will the boxes compare?`
        ),
        live: tr(
          `拿走多出的${difference}袋后，甲箱剩下的部分和乙箱一样多。`,
          `Without the ${difference} extra bags, the amount left in A equals B.`
        ),
        view: {
          heading: tr(`先拿走多出的${difference}袋`, `First set aside the ${difference} extra bags`),
          note: tr("现在只看两个相同的部分", "Now focus on the two equal parts"),
          total: true,
          equal: true,
          excessAway: true,
          aState: "after",
          bState: "after",
          concealed: false,
          firstCount: localCopy("unknownCount"),
          secondCount: localCopy("unknownCount"),
          formulas: [tr(`拿走${bag(difference)}后，两箱一样多`, `Without ${bag(difference)}, the boxes are equal`)]
        }
      },
      {
        chapter: tr("求相同部分", "Equal parts"),
        title: tr(`两箱一样多的部分共有${remaining}袋`, `The equal parts total ${remaining} bags`),
        question: tr(
          `从总数里去掉多出的${difference}袋，还剩多少袋？`,
          `How many bags remain after removing the ${difference}-bag excess from the total?`
        ),
        live: tr(
          `${total}减${difference}等于${remaining}，这是两个相同部分的总数。`,
          `${total} minus ${difference} is ${remaining}, the total of the two equal parts.`
        ),
        view: {
          heading: tr("先求两个相同部分的总数", "Find the total of the two equal parts"),
          note: tr("总数减去多出的部分", "Subtract the extra part from the total"),
          total: true,
          equal: true,
          excessAway: true,
          aState: "after",
          bState: "after",
          concealed: false,
          firstCount: localCopy("unknownCount"),
          secondCount: localCopy("unknownCount"),
          formulas: [tr(`${total}－${difference}＝${bag(remaining)}`, `${total} − ${difference} = ${bag(remaining)}`)]
        }
      },
      {
        chapter: tr("平均分", "Share equally"),
        title: tr(`每个相同部分是${equal}袋`, `Each equal part has ${equal} bags`),
        question: tr(
          `把${remaining}袋平均分成两份，每份是多少袋？`,
          `If ${remaining} bags are shared equally into two parts, how many are in each part?`
        ),
        live: tr(
          `${remaining}除以2等于${equal}，所以乙箱移动后有${equal}袋。`,
          `${remaining} divided by 2 is ${equal}, so Box B has ${equal} bags after the move.`
        ),
        view: {
          heading: tr("把相同部分平均分成两份", "Share the equal total into two parts"),
          note: tr("一份对应一个箱子的相同部分", "Each part matches the equal amount in one box"),
          total: true,
          equal: true,
          excessAway: true,
          aState: "after",
          bState: "after",
          concealed: false,
          firstCount: localCopy("equalCount", { count: equal }),
          secondCount: localCopy("equalCount", { count: equal }),
          formulas: [tr(`${remaining}÷2＝${bag(equal)}`, `${remaining} ÷ 2 = ${bag(equal)}`)]
        }
      },
      {
        chapter: tr("补回相差", "Restore excess"),
        title: tr(`甲箱移动后有${firstAfter}袋`, `Box A has ${firstAfter} bags after the move`),
        question: tr(
          `乙箱移动后有${equal}袋，甲箱还要补回多出的${difference}袋，甲箱有多少袋？`,
          `Box B has ${equal} after the move. What does A have after restoring its ${difference} extra bags?`
        ),
        live: tr(
          `${equal}加${difference}等于${firstAfter}，所以移动后甲箱有${firstAfter}袋，乙箱有${secondAfter}袋。`,
          `${equal} plus ${difference} is ${firstAfter}, so after the move A has ${firstAfter} and B has ${secondAfter}.`
        ),
        view: {
          heading: tr(`把多出的${difference}袋放回甲箱`, `Return the ${difference} extra bags to Box A`),
          note: tr("得到移动后的两箱数量", "This gives both counts after the move"),
          total: true,
          difference: true,
          aState: "after",
          bState: "after",
          concealed: false,
          firstCount: localCopy("afterCount", { count: firstAfter }),
          secondCount: localCopy("afterCount", { count: secondAfter }),
          formulas: [tr(`${equal}＋${difference}＝${bag(firstAfter)}`, `${equal} + ${difference} = ${bag(firstAfter)}`)]
        }
      },
      {
        chapter: tr("倒推甲箱", "Work back A"),
        title: tr(`把移走的${moved}袋还给甲箱`, `Return the ${moved} moved bags to Box A`),
        question: tr(
          `甲箱移动后有${firstAfter}袋，把移走的${moved}袋还回去，原来有多少袋？`,
          `Box A has ${firstAfter} after the move. What was its original count when the ${moved} bags are returned?`
        ),
        live: tr(
          `${firstAfter}加${moved}等于${firstOriginal}，甲箱原来有${firstOriginal}袋。`,
          `${firstAfter} plus ${moved} is ${firstOriginal}, so Box A originally had ${firstOriginal} bags.`
        ),
        view: {
          heading: tr(`反向还原：把${moved}袋还给甲箱`, `Reverse the move: return ${moved} bags to Box A`),
          note: tr("倒推要做相反的动作", "Working back uses the opposite action"),
          total: true,
          transfer: true,
          transferPosition: "first",
          transferDirection: "backward",
          aState: "original",
          bState: "original",
          concealed: false,
          firstCount: localCopy("originalCount", { count: firstOriginal }),
          secondCount: tr(`${secondAfter}－${moved}`, `${secondAfter} − ${moved}`),
          formulas: [tr(`${firstAfter}＋${moved}＝${bag(firstOriginal)}`, `${firstAfter} + ${moved} = ${bag(firstOriginal)}`)]
        }
      },
      {
        chapter: tr("倒推乙箱", "Work back B"),
        title: tr(`乙箱原来有${secondOriginal}袋`, `Box B originally had ${secondOriginal} bags`),
        question: tr(
          `乙箱移动后有${secondAfter}袋，去掉后来收到的${moved}袋，原来有多少袋？`,
          `Box B has ${secondAfter} after the move. What was its original count before it received ${moved} bags?`
        ),
        live: tr(
          `${secondAfter}减${moved}等于${secondOriginal}，乙箱原来有${secondOriginal}袋。`,
          `${secondAfter} minus ${moved} is ${secondOriginal}, so Box B originally had ${secondOriginal} bags.`
        ),
        view: {
          heading: tr(`乙箱减去后来收到的${moved}袋`, `Remove the ${moved} bags that Box B received`),
          note: tr("两个箱子都回到原来的状态", "Both boxes are back at their original states"),
          total: true,
          aState: "original",
          bState: "original",
          concealed: false,
          firstCount: localCopy("originalCount", { count: firstOriginal }),
          secondCount: localCopy("originalCount", { count: secondOriginal }),
          formulas: [tr(`${secondAfter}－${moved}＝${bag(secondOriginal)}`, `${secondAfter} − ${moved} = ${bag(secondOriginal)}`)]
        }
      },
      {
        chapter: tr("检验总数", "Check the total"),
        title: tr(`原来的总数正好是${total}袋`, `The original total is ${total} bags`),
        question: tr(
          `把甲箱原来的${firstOriginal}袋和乙箱原来的${secondOriginal}袋相加，符合总数吗？`,
          `Do the original counts, ${firstOriginal} and ${secondOriginal}, add to the given total?`
        ),
        live: tr(
          `${firstOriginal}加${secondOriginal}等于${total}，总数条件正确。`,
          `${firstOriginal} plus ${secondOriginal} is ${total}, so the total condition matches.`
        ),
        view: {
          heading: tr("先检验原来的总数", "First check the original total"),
          note: tr("两个原数相加", "Add the two original counts"),
          total: true,
          aState: "original",
          bState: "original",
          concealed: false,
          firstCount: localCopy("originalCount", { count: firstOriginal }),
          secondCount: localCopy("originalCount", { count: secondOriginal }),
          formulas: [
            tr(`${firstOriginal}＋${secondOriginal}＝${bag(total)}`, `${firstOriginal} + ${secondOriginal} = ${bag(total)}`),
            tr("✓ 与题目总数相同", "✓ The total matches")
          ]
        }
      },
      {
        chapter: tr("检验移动", "Check the move"),
        title: tr(`移动后确实相差${difference}袋`, `After the move, the difference is ${difference}`),
        question: tr(
          `按题意再从甲箱移${moved}袋到乙箱，移动后的两数和相差数都正确吗？`,
          `Move ${moved} bags from A to B again. Do both final counts and their difference match?`
        ),
        live: tr(
          `甲箱变成${firstAfter}袋，乙箱变成${secondAfter}袋，两箱相差${difference}袋，移动条件也正确。`,
          `A becomes ${firstAfter}, B becomes ${secondAfter}, and their difference is ${difference}. The move condition matches.`
        ),
        view: {
          heading: tr("再按题意移动一次来检验", "Repeat the move to check the condition"),
          note: tr("虚线标出移动后的数量位置", "Dashed marks show the counts after the move"),
          total: true,
          verification: true,
          aState: "original",
          bState: "original",
          concealed: false,
          firstCount: localCopy("originalCount", { count: firstOriginal }),
          secondCount: localCopy("originalCount", { count: secondOriginal }),
          formulas: [
            tr(
              `${firstOriginal}－${moved}＝${firstAfter}，${secondOriginal}＋${moved}＝${secondAfter}`,
              `${firstOriginal} − ${moved} = ${firstAfter},  ${secondOriginal} + ${moved} = ${secondAfter}`
            ),
            tr(`${firstAfter}－${secondAfter}＝${bag(difference)} ✓`, `${firstAfter} − ${secondAfter} = ${bag(difference)} ✓`)
          ]
        }
      },
      {
        chapter: tr("结论", "Answer"),
        title: tr("写出完整答案", "State the complete answer"),
        question: tr(
          "总数和移动后的相差都检验正确，完整答案是什么？",
          "Both conditions match. What is the complete answer?"
        ),
        live: tr(
          `甲箱原来有${firstOriginal}袋，乙箱原来有${secondOriginal}袋。`,
          `Box A originally had ${firstOriginal} bags, and Box B originally had ${secondOriginal} bags.`
        ),
        view: {
          heading: tr("回到原来的两箱，写出答案", "Return to the original boxes and state the answer"),
          note: tr("答案来自刚才的倒推，并且已经代回检验", "The answer comes from working back and has been checked"),
          total: true,
          aState: "original",
          bState: "original",
          concealed: false,
          firstCount: localCopy("originalCount", { count: firstOriginal }),
          secondCount: localCopy("originalCount", { count: secondOriginal }),
          answer: true
        }
      }
    ];
  }

  function problemLines(problem) {
    const total = formatInteger(problem.totalBags);
    const moved = formatInteger(problem.movedToSecond);
    const difference = formatInteger(problem.firstStillMore);
    if (language() === "zh-CN") {
      return {
        one: `甲、乙两箱共有${total}袋洗衣粉。`,
        two: `从甲箱取${moved}袋放入乙箱后，甲箱仍比乙箱多${difference}袋。`,
        three: "",
        task: "求：甲、乙两箱原来各有多少袋？",
        prompt: "请先说一说：知道什么？要找什么？"
      };
    }
    return {
      one: `Box A and Box B hold ${total} bags of detergent in all.`,
      two: `Move ${moved} bags from Box A to Box B.`,
      three: `After the move, Box A still has ${difference} more bags than Box B.`,
      task: "Find how many bags were originally in each box.",
      prompt: "First restate: What is known? What must we find?"
    };
  }

  function renderStaticCopy() {
    document.documentElement.lang = language();
    document.title = `${localCopy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((element) => {
      const key = element.dataset.copy;
      if (copy[language()]?.[key]) element.textContent = localCopy(key);
    });
    app.querySelector("[data-language-toggle]").textContent = language() === "zh-CN" ? "EN" : "中";
    app.querySelector('[data-action="back"]').setAttribute("aria-label", tr("返回课程目录", "Back to course catalog"));
    app.querySelector('[data-action="close-settings"]').setAttribute("aria-label", localCopy("close"));
    app.querySelector("[data-first-name]").textContent = localCopy("firstBox");
    app.querySelector("[data-second-name]").textContent = localCopy("secondBox");
    document.querySelector(".box-skip-link").textContent = tr("跳到讲题舞台", "Skip to lesson stage");
  }

  function buildProgress() {
    for (let index = 0; index < 13; index += 1) {
      const segment = document.createElement("span");
      segment.setAttribute("aria-hidden", "true");
      progressTrack.append(segment);
    }
  }

  function renderGeometry(problem) {
    const maximum = problem.firstOriginal;
    const width = (value) => geometry.trackWidth * amountRatio(value, maximum);
    const baseWidth = width(problem.equalShare);
    const differenceWidth = width(problem.firstStillMore);
    const movedWidth = width(problem.movedToSecond);
    const secondOriginalWidth = width(problem.secondOriginal);
    const firstAfterWidth = width(problem.firstAfter);
    const secondAfterWidth = width(problem.secondAfter);

    scene.firstBase.setAttribute("width", String(baseWidth));
    scene.firstExcess.setAttribute("x", String(geometry.trackX + baseWidth));
    scene.firstExcess.setAttribute("width", String(differenceWidth));
    scene.firstExcessLabel.setAttribute("x", String(geometry.trackX + baseWidth + differenceWidth / 2));
    scene.firstExcessLabel.textContent = localCopy("movedBags", { count: formatInteger(problem.firstStillMore) });
    scene.firstTransfer.setAttribute("x", String(geometry.trackX + baseWidth + differenceWidth));
    scene.firstTransfer.setAttribute("width", String(movedWidth));

    scene.secondOriginal.setAttribute("width", String(secondOriginalWidth));
    scene.secondTransfer.setAttribute("x", String(geometry.trackX + secondOriginalWidth));
    scene.secondTransfer.setAttribute("width", String(movedWidth));

    const differenceCenter = geometry.trackX + baseWidth + differenceWidth / 2;
    const braceWidth = Math.max(58, differenceWidth);
    const braceStart = differenceCenter - braceWidth / 2;
    const braceEnd = differenceCenter + braceWidth / 2;
    scene.differencePath.setAttribute(
      "d",
      `M${braceStart} 238v12M${braceStart} 244H${braceEnd}M${braceEnd} 238v12`
    );
    scene.differenceLabel.setAttribute("x", String(differenceCenter));
    scene.differenceLabel.setAttribute("y", "229");
    scene.differenceLabel.textContent = localCopy("differenceCount", {
      count: formatInteger(problem.firstStillMore)
    });

    const equalEndX = geometry.trackX + baseWidth;
    scene.equalLine.setAttribute(
      "d",
      `M${equalEndX} ${geometry.firstTrackY - 12}V${geometry.secondTrackY + geometry.trackHeight + 12}`
    );
    scene.equalTicks.setAttribute(
      "d",
      `M${equalEndX - 11} ${geometry.firstTrackY}h22M${equalEndX - 11} ${geometry.secondTrackY}h22`
    );

    const firstTransferX = geometry.trackX + baseWidth + differenceWidth;
    const secondTransferX = geometry.trackX + secondOriginalWidth;
    const firstTransferCenter = firstTransferX + movedWidth / 2;
    const secondTransferCenter = secondTransferX + movedWidth / 2;
    geometry.transferFirstTransform = `translate(${firstTransferX} ${geometry.firstTrackY})`;
    geometry.transferSecondTransform = `translate(${secondTransferX} ${geometry.secondTrackY})`;
    geometry.transferFirstCssTransform = `translate(${firstTransferX}px, ${geometry.firstTrackY}px)`;
    geometry.transferSecondCssTransform = `translate(${secondTransferX}px, ${geometry.secondTrackY}px)`;
    scene.bundleRect.setAttribute("width", String(movedWidth));
    app.querySelector("[data-transfer-label]").setAttribute("x", String(movedWidth / 2));
    app
      .querySelector("[data-transfer-label]")
      .setAttribute("y", String(geometry.trackHeight / 2 + 7));
    scene.transferForwardPath.setAttribute(
      "d",
      `M${firstTransferCenter} ${geometry.firstTrackY + geometry.trackHeight + 8}C${firstTransferCenter + 72} 344 ${
        secondTransferCenter + 72
      } 362 ${secondTransferCenter} ${geometry.secondTrackY - 8}`
    );
    scene.transferBackwardPath.setAttribute(
      "d",
      `M${secondTransferCenter} ${geometry.secondTrackY - 8}C${secondTransferCenter + 72} 362 ${
        firstTransferCenter + 72
      } 344 ${firstTransferCenter} ${geometry.firstTrackY + geometry.trackHeight + 8}`
    );
    scene.ghostPath.setAttribute(
      "d",
      `M${firstTransferCenter} ${geometry.firstTrackY + geometry.trackHeight + 8}C${firstTransferCenter + 72} 344 ${
        secondTransferCenter + 72
      } 362 ${secondTransferCenter} ${geometry.secondTrackY - 8}`
    );

    const firstAfterX = geometry.trackX + firstAfterWidth;
    const secondAfterX = geometry.trackX + secondAfterWidth;
    scene.firstAfterMark.setAttribute(
      "d",
      `M${firstAfterX} ${geometry.firstTrackY - 8}v${geometry.trackHeight + 16}`
    );
    scene.secondAfterMark.setAttribute(
      "d",
      `M${secondAfterX} ${geometry.secondTrackY - 8}v${geometry.trackHeight + 16}`
    );
  }

  function renderProblemCopy(problem) {
    const lines = problemLines(problem);
    Object.entries(lines).forEach(([name, value]) => {
      app.querySelector(`[data-problem-line="${name}"]`).textContent = value;
    });
  }

  function renderQuantities(view, previousView, movingForward) {
    const problem = currentProblem;
    const maximum = problem.firstOriginal;
    const width = (value) => geometry.trackWidth * amountRatio(value, maximum);
    const firstAmount = view.aState === "original" ? problem.firstOriginal : problem.firstAfter;
    const secondAmount = view.bState === "original" ? problem.secondOriginal : problem.secondAfter;
    const concealed = Boolean(view.concealed);

    scene.firstUnknown.setAttribute("width", String(width(firstAmount)));
    scene.secondUnknown.setAttribute("width", String(width(secondAmount)));
    setVisible(scene.firstUnknown, concealed);
    setVisible(scene.secondUnknown, concealed);

    setVisible(scene.firstBase, !concealed);
    setVisible(scene.firstExcessGroup, !concealed);
    setVisible(scene.firstTransfer, !concealed && view.aState === "original");
    setVisible(scene.secondOriginal, !concealed);
    setVisible(scene.secondTransfer, !concealed && view.bState === "after");
    scene.firstExcessGroup.classList.toggle("is-set-aside", Boolean(view.excessAway));

    const firstChanged = previousView && previousView.firstCount !== view.firstCount;
    const secondChanged = previousView && previousView.secondCount !== view.secondCount;
    scene.firstCount.textContent = view.firstCount;
    scene.secondCount.textContent = view.secondCount;
    scene.firstCount.classList.toggle("is-known", !view.firstCount.includes("?") && !view.firstCount.includes("？"));
    scene.secondCount.classList.toggle("is-known", !view.secondCount.includes("?") && !view.secondCount.includes("？"));
    scene.firstCount.classList.remove("is-delta");
    scene.secondCount.classList.remove("is-delta");
    if (movingForward && firstChanged) {
      void scene.firstCount.getBoundingClientRect();
      scene.firstCount.classList.add("is-delta");
    }
    if (movingForward && secondChanged) {
      void scene.secondCount.getBoundingClientRect();
      scene.secondCount.classList.add("is-delta");
    }
  }

  function renderTransfer(view, movingForward) {
    const visible = Boolean(view.transfer);
    setVisible(parts.transferRail, visible);
    parts.transferRail.classList.toggle("is-backward", view.transferDirection === "backward");
    app.querySelector("[data-transfer-caption]").textContent =
      view.transferDirection === "backward" ? localCopy("returnedCaption") : localCopy("movedCaption");
    app.querySelector("[data-transfer-label]").textContent = formatInteger(currentProblem.movedToSecond);

    const atSecond = view.transferPosition === "second";
    scene.bundle.getAnimations().forEach((animation) => animation.cancel());
    scene.bundle.setAttribute(
      "transform",
      atSecond ? geometry.transferSecondTransform : geometry.transferFirstTransform
    );
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!visible || !movingForward || reducedMotion) return;

    if (currentStep === 2) {
      scene.bundle.animate(
        [
          { transform: geometry.transferFirstCssTransform },
          { transform: geometry.transferSecondCssTransform }
        ],
        { duration: 520, easing: "cubic-bezier(0.2, 0.82, 0.22, 1)" }
      );
    }
    if (currentStep === 8) {
      scene.bundle.animate(
        [
          { transform: geometry.transferSecondCssTransform },
          { transform: geometry.transferFirstCssTransform }
        ],
        { duration: 520, easing: "cubic-bezier(0.2, 0.82, 0.22, 1)" }
      );
    }
  }

  function renderFormula(view, movingForward) {
    const formulas = view.formulas || [];
    setVisible(parts.formulaBoard, formulas.length > 0 && !view.answer);
    ["one", "two"].forEach((name, index) => {
      const line = app.querySelector(`[data-formula-line="${name}"]`);
      line.textContent = formulas[index] || "";
      line.classList.remove("is-delta");
      if (movingForward && formulas[index]) {
        void line.getBoundingClientRect();
        line.classList.add("is-delta");
      }
    });
  }

  function renderEvidence(view) {
    setVisible(parts.problemCopy, Boolean(view.problem));
    setVisible(parts.sceneCopy, !view.problem);
    setVisible(parts.totalEvidence, Boolean(view.total));
    setVisible(parts.differenceEvidence, Boolean(view.difference));
    setVisible(parts.equalEvidence, Boolean(view.equal));
    setVisible(parts.verification, Boolean(view.verification));
    app.querySelector("[data-scene-heading]").textContent = view.heading || "";
    app.querySelector("[data-scene-note]").textContent = view.note || "";
    app.querySelector("[data-total-label]").textContent = localCopy("totalCount", {
      count: formatInteger(currentProblem.totalBags)
    });
    app.querySelector("[data-equal-label]").textContent = localCopy("equalLabel");
    app.querySelector("[data-ghost-label]").textContent = localCopy("ghostLabel", {
      count: formatInteger(currentProblem.movedToSecond)
    });
  }

  function renderAnswer(view) {
    setVisible(parts.answer, Boolean(view.answer));
    if (!view.answer) return;
    app.querySelector("[data-answer-checks]").textContent = localCopy("answerChecks");
    app.querySelector("[data-answer]").textContent = localCopy("answer", {
      first: formatInteger(currentProblem.firstOriginal),
      second: formatInteger(currentProblem.secondOriginal)
    });
  }

  function renderStep(previousStep = currentStep) {
    const steps = buildSteps(currentProblem);
    const step = steps[currentStep];
    const previousView = steps[previousStep]?.view;
    const movingForward = currentStep > previousStep;

    renderStaticCopy();
    renderProblemCopy(currentProblem);
    renderGeometry(currentProblem);

    chapter.textContent = step.chapter;
    stepTitle.textContent = step.title;
    question.textContent = step.question;
    questionIndex.textContent = tr(`当前提问 ${currentStep + 1}`, `Question ${currentStep + 1}`);
    stepCount.textContent = `${currentStep + 1} / ${steps.length}`;
    liveCopy.textContent = step.live;
    stageDescription.textContent = step.live;
    stage.setAttribute("aria-label", `${step.title}。${step.question}`);

    renderEvidence(step.view);
    renderQuantities(step.view, previousView, movingForward);
    renderTransfer(step.view, movingForward);
    renderFormula(step.view, movingForward);
    renderAnswer(step.view);

    const isFinal = currentStep === steps.length - 1;
    stage.dataset.step = String(currentStep);
    stage.dataset.final = String(isFinal);
    previousButton.disabled = currentStep === 0;
    nextLabel.textContent = isFinal ? localCopy("replay") : localCopy("next");
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
    app.querySelector('[data-setting="totalBags"]').value = values.totalBags;
    app.querySelector('[data-setting="movedToSecond"]').value = values.movedToSecond;
    app.querySelector('[data-setting="firstStillMore"]').value = values.firstStillMore;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(problem) {
    if (problem.reason === "invalid-total") return localCopy("invalidTotal");
    if (problem.reason === "invalid-transfer") return localCopy("invalidTransfer");
    if (problem.reason === "invalid-difference") return localCopy("invalidDifference");
    if (problem.reason === "difference-too-large") return localCopy("differenceTooLarge");
    if (problem.reason === "non-whole-half") {
      return localCopy("nonWholeHalf", {
        total: formatInteger(problem.totalBags),
        difference: formatInteger(problem.firstStillMore),
        remaining: formatInteger(problem.remainingAfterExcess)
      });
    }
    if (problem.reason === "transfer-too-large") {
      return localCopy("transferTooLarge", { moved: formatInteger(problem.movedToSecond) });
    }
    return localCopy("genericError");
  }

  function applySettings() {
    const nextValues = {
      totalBags: app.querySelector('[data-setting="totalBags"]').value.trim(),
      movedToSecond: app.querySelector('[data-setting="movedToSecond"]').value.trim(),
      firstStillMore: app.querySelector('[data-setting="firstStillMore"]').value.trim()
    };
    const problem = solve(nextValues.totalBags, nextValues.movedToSecond, nextValues.firstStillMore);
    if (!problem.valid) {
      settingsError.textContent = errorMessage(problem);
      settingsError.hidden = false;
      return;
    }

    values.totalBags = problem.totalBags.toString();
    values.movedToSecond = problem.movedToSecond.toString();
    values.firstStillMore = problem.firstStillMore.toString();
    currentProblem = problem;
    currentStep = 0;
    settingsDialog.close();
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
    if (event.key === "Home") {
      event.preventDefault();
      goToStep(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goToStep(buildSteps(currentProblem).length - 1);
    }
  });

  MathLab.bindLanguageToggle(() => renderStep());

  window.__boxTransferLesson = {
    get currentStep() {
      return currentStep;
    },
    get stepCount() {
      return buildSteps(currentProblem).length;
    },
    get problem() {
      return currentProblem;
    },
    goTo: goToStep,
    advance,
    applyValues(totalBags, movedToSecond, firstStillMore) {
      const problem = solve(totalBags, movedToSecond, firstStillMore);
      if (!problem.valid) return problem;
      values.totalBags = problem.totalBags.toString();
      values.movedToSecond = problem.movedToSecond.toString();
      values.firstStillMore = problem.firstStillMore.toString();
      currentProblem = problem;
      currentStep = 0;
      renderStep();
      return problem;
    }
  };

  buildProgress();
  renderStep();
})();
