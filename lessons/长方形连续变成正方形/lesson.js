(function () {
  const app = document.querySelector("[data-app]");
  if (!app) return;

  const elements = {
    stage: app.querySelector("[data-stage]"),
    stageTag: app.querySelector("[data-stage-tag]"),
    stageTitle: app.querySelector("[data-stage-title]"),
    diagramWrap: app.querySelector("[data-diagram-wrap]"),
    problemStrip: app.querySelector("[data-problem-strip]"),
    progress: app.querySelector("[data-progress]"),
    question: app.querySelector("[data-question]"),
    explanation: app.querySelector("[data-explanation]"),
    formulas: app.querySelector("[data-formula-list]"),
    teacherCue: app.querySelector("[data-teacher-cue]"),
    pageCount: app.querySelector("[data-page-count]"),
    nextLabel: app.querySelector("[data-next-label]"),
    prevButton: app.querySelector('[data-action="prev"]'),
    nextButton: app.querySelector('[data-action="next"]'),
    settingsDialog: app.querySelector("[data-settings-dialog]"),
    settingsError: app.querySelector("[data-settings-error]"),
    areaInput: app.querySelector('[data-setting="area"]'),
    factorInput: app.querySelector('[data-setting="factor"]')
  };

  const copy = {
    "zh-CN": {
      eyebrow: "小学数学互动课堂",
      title: "同一个长方形，怎样变成正方形？",
      edit: "修改题目",
      fullscreen: "全屏讲解",
      questionLabel: "本页问题",
      boardLabel: "本页板书",
      prev: "上一页",
      next: "下一页",
      finish: "讲解完成",
      parameters: "题目参数",
      settingsTitle: "换一组数重新演示",
      settingsLead: "应用后会回到第1页，图形按新比例重新生成。",
      areaLabel: "长方形面积",
      factorLabel: "长除以、宽乘以的同一个数（2～10）",
      squareMetres: "平方米",
      methodTitle: "怎样选择适合课堂演示的数？",
      methodCopy: "面积应是一个整数乘自己，正方形边长还要能被变化数字整除。",
      cancel: "取消",
      apply: "应用并重新讲解",
      backLabel: "返回课程目录",
      closeLabel: "关闭",
      problemStart: "一个长方形的面积是",
      problemChange: (factor) => `长 ÷ ${factor}　宽 × ${factor}`,
      problemEnd: "变成正方形：面积和边长是多少？",
      progressLabel: (index, total, label) => `第${index}步，共${total}步：${label}`,
      pageCount: (index, total) => `第 ${index} / ${total} 页`,
      originalLength: "原来的长",
      originalWidth: "原来的宽",
      equalParts: (factor) => `沿着长平均分成 ${factor} 份`,
      onePart: (factor) => `留下 1 份 = 原来长的 1/${factor}`,
      growWidth: (factor) => `宽 × ${factor}`,
      proofLength: (factor) => `长度：只留 1/${factor}`,
      proofWidth: (factor) => `宽度：扩大 ${factor} 倍`,
      proofMain: (factor) => `1/${factor} × ${factor} = 1`,
      unknownSide: "？米",
      sideText: (side) => `${side}米`,
      answerArea: (area) => `面积 ${area} 平方米`,
      answerSide: (side) => `边长 ${side} 米`,
      svgLabel: (factor) => `同一个长方形先沿长平均分成${factor}份，留下第一份，再把宽扩大${factor}倍成为正方形`,
      cuePrefix: "教师提示：",
      invalidArea: "请输入正整数面积。",
      invalidFactor: "变化数字请输入2到10之间的整数。",
      notSquare: "这个面积不能由同一个整数乘自己得到，请换一个面积。",
      nonWholeWidth: "正方形边长不能被变化数字整除，原来的宽会出现小数，请换一组数。"
    },
    "en-US": {
      eyebrow: "Primary Maths Motion Lab",
      title: "How Does the Same Rectangle Become a Square?",
      edit: "Change values",
      fullscreen: "Full screen",
      questionLabel: "Question",
      boardLabel: "Working",
      prev: "Previous",
      next: "Next",
      finish: "Lesson complete",
      parameters: "Problem values",
      settingsTitle: "Try another set of values",
      settingsLead: "Applying values returns to page 1 and redraws the same proportional model.",
      areaLabel: "Rectangle area",
      factorLabel: "Use the same factor to divide the length and multiply the width (2–10)",
      squareMetres: "square metres",
      methodTitle: "Which values work well for this lesson?",
      methodCopy: "The area should be a whole number times itself, and the square side should divide evenly by the factor.",
      cancel: "Cancel",
      apply: "Apply and restart",
      backLabel: "Back to lesson catalog",
      closeLabel: "Close",
      problemStart: "A rectangle has an area of",
      problemChange: (factor) => `length ÷ ${factor}　width × ${factor}`,
      problemEnd: "It becomes a square. What are its area and side length?",
      progressLabel: (index, total, label) => `Step ${index} of ${total}: ${label}`,
      pageCount: (index, total) => `Page ${index} / ${total}`,
      originalLength: "original length",
      originalWidth: "original width",
      equalParts: (factor) => `Split the length into ${factor} equal parts`,
      onePart: (factor) => `Keep 1 part = 1/${factor} of the length`,
      growWidth: (factor) => `width × ${factor}`,
      proofLength: (factor) => `Length: keep 1/${factor}`,
      proofWidth: (factor) => `Width: grow by ${factor}`,
      proofMain: (factor) => `1/${factor} × ${factor} = 1`,
      unknownSide: "? m",
      sideText: (side) => `${side} m`,
      answerArea: (area) => `Area ${area} m²`,
      answerSide: (side) => `Side ${side} m`,
      svgLabel: (factor) => `The same rectangle is split into ${factor} equal lengths, one part is kept, and its width grows by ${factor} to make a square`,
      cuePrefix: "Teacher cue: ",
      invalidArea: "Enter a positive whole-number area.",
      invalidFactor: "Enter a whole-number factor from 2 to 10.",
      notSquare: "This area is not a whole number times itself. Try another area.",
      nonWholeWidth: "The square side does not divide evenly by the factor, so the original width would be a decimal. Try another set of values."
    }
  };

  const state = {
    area: 225,
    factor: 5,
    slideIndex: 0,
    values: null,
    slides: []
  };

  function language() {
    return MathLab.getLanguage();
  }

  function t(key) {
    return copy[language()][key];
  }

  function tr(zh, en) {
    return language() === "zh-CN" ? zh : en;
  }

  function number(value) {
    return MathLab.numberText(value);
  }

  function lengthUnit() {
    return tr("米", "m");
  }

  function areaUnit() {
    return tr("平方米", "m²");
  }

  function buildSlides(values) {
    const area = number(values.area);
    const factor = number(values.factor);
    const side = number(values.squareSide);
    const originalLength = number(values.originalLength);
    const originalWidth = number(values.originalWidth);
    const sideValue = Number(values.squareSide);
    const previousSide = Math.max(1, sideValue - 1);
    const nextSide = sideValue + 1;
    const tensPart = Math.floor(sideValue / 10) * 10;
    const onesPart = sideValue - tensPart;
    const onesCandidates = values.possibleOnes.join(tr("、", ", ")) || tr("没有", "none");
    const rangeCandidates = values.rangeCandidates.join(tr("、", ", ")) || tr("还要继续找", "keep searching");
    const splitCalculation = tensPart > 0 && onesPart > 0
      ? [`${side} × ${tensPart} = ${sideValue * tensPart}`, `${side} × ${onesPart} = ${sideValue * onesPart}`, `${sideValue * tensPart} + ${sideValue * onesPart} = ${area}`]
      : [`${side} × ${side} = ${area}`];

    return [
      {
        id: "read",
        label: tr("看原图", "Start"),
        title: tr("先看完整的长方形", "Begin with one complete rectangle"),
        question: tr("一开始，长方形被分开了吗？", "Has the rectangle been split yet?"),
        explanation: tr(
          `没有。现在只看同一个完整长方形，它的面积是${area}${areaUnit()}。后面的每一步都在这个图形上发生。`,
          `No. We begin with one complete rectangle of area ${area} ${areaUnit()}. Every later change happens to this same diagram.`
        ),
        formulas: [tr(`原长方形面积 = ${area}${areaUnit()}`, `Rectangle area = ${area} ${areaUnit()}`)],
        cue: tr("先让学生指出哪一条是长、哪一条是宽，不要提前切分。", "Ask students to point out the length and width. Do not split the shape yet.")
      },
      {
        id: "divide",
        label: tr(`分${factor}份`, `Split ${factor}`),
        title: tr(`就在原长方形上，把长平均分成${factor}份`, `Split the original length into ${factor} equal parts`),
        question: tr(`每一份的长是原来长的几分之一？`, `What fraction of the original length is each part?`),
        explanation: tr(
          `长方形没有移动，也没有缩放，只增加了${Number(values.factor) - 1}条分割线。每一份同样长。`,
          `The rectangle has not moved or changed scale. Only ${Number(values.factor) - 1} dividing lines have appeared, making equal lengths.`
        ),
        formulas: [tr(`原来的长 ÷ ${factor} = 每份的长`, `Original length ÷ ${factor} = each part's length`)],
        cue: tr("沿着长从左到右数完所有等份。", "Count every equal part from left to right.")
      },
      {
        id: "retain",
        label: tr("留1份", "Keep 1"),
        title: tr(`高亮第一份：长只留下原来的1/${factor}`, `Highlight the first part: keep 1/${factor} of the length`),
        question: tr(`金色这一份的宽有没有改变？`, `Has the width of the gold part changed?`),
        explanation: tr(
          `还没有。金色部分只是把长缩小到原来的1/${factor}；其余部分变淡，帮助我们记住它来自同一个长方形。`,
          `Not yet. The gold part only makes the length 1/${factor} of the original. The other parts fade so we can still see where it came from.`
        ),
        formulas: [tr(`新的长 = 原来的长 ÷ ${factor}`, `New length = original length ÷ ${factor}`)],
        cue: tr("强调“只看一份”，此时不要把宽也一起改变。", "Stress that we are keeping one part only; the width has not changed yet.")
      },
      {
        id: "grow",
        label: tr(`宽×${factor}`, `Width ×${factor}`),
        title: tr(`从金色这一份原地向上，把宽扩大${factor}倍`, `Grow the gold part upward so its width is ${factor} times as large`),
        question: tr(`现在竖直方向一共有几个原来的宽？`, `How many original widths are now stacked vertically?`),
        explanation: tr(
          `底部金色仍是刚才那一份，上面用青绿色补出另外${Number(values.factor) - 1}个宽。总高度正好是原来宽的${factor}倍。`,
          `The gold band at the bottom is the same part as before. The ${Number(values.factor) - 1} teal bands add the remaining widths, making the total height ${factor} times the original width.`
        ),
        formulas: [tr(`新的宽 = 原来的宽 × ${factor}`, `New width = original width × ${factor}`)],
        cue: tr("让学生观察新图形的横边和竖边已经一样长。", "Ask students to notice that the new horizontal and vertical sides now match.")
      },
      {
        id: "area",
        label: tr("看面积", "Area"),
        title: tr("长缩小、宽扩大，两个变化正好抵消", "The shorter length and greater width exactly balance"),
        question: tr("新图形的面积比原来大、比原来小，还是一样大？", "Is the new area greater, smaller, or the same?"),
        explanation: tr(
          `长只取原来的1/${factor}，宽又变成原来的${factor}倍。先除以${factor}，再乘${factor}，面积回到原来那么大。`,
          `The length becomes 1/${factor} of the original while the width becomes ${factor} times as large. Dividing by ${factor} and then multiplying by ${factor} restores the original area.`
        ),
        formulas: [
          tr(`（原面积 ÷ ${factor}）× ${factor} = 原面积`, `(original area ÷ ${factor}) × ${factor} = original area`),
          tr("新图形面积 = 原长方形面积", "New area = original rectangle area")
        ],
        cue: tr("先让学生判断面积，再显示“正好抵消”的板书。", "Let students predict the area before reading the balancing calculation.")
      },
      {
        id: "side",
        label: tr("找边长", "Find side"),
        title: tr("这个正方形的边长是多少？", "What is the side length of this square?"),
        question: tr(`哪一个数乘自己，正好等于${area}？`, `Which number times itself equals ${area}?`),
        explanation: tr(
          `正方形的两条边一样长。先把两条边都留成问号，用“同一个数 × 同一个数”寻找边长。`,
          `A square has equal sides. Keep both labels as question marks and look for the same number multiplied by itself.`
        ),
        formulas: [tr(`□${lengthUnit()} × □${lengthUnit()} = ${area}${areaUnit()}`, `□ ${lengthUnit()} × □ ${lengthUnit()} = ${area} ${areaUnit()}`)],
        cue: tr("先不要求孩子直接算出答案，下一页从小数开始逐个试。", "Do not expect an immediate answer. The next page starts with small examples.")
      },
      {
        id: "square-1-10",
        label: tr("算1～10", "Try 1–10"),
        title: tr("先把1到10分别和自己相乘", "First multiply each number from 1 to 10 by itself"),
        question: tr(`从1×1到10×10，哪个结果最接近${area}？`, `From 1 × 1 to 10 × 10, which result is closest to ${area}?`),
        explanation: tr(
          sideValue <= 10
            ? `按顺序计算时，${side}×${side}正好得到${area}。先记住这个位置，再继续看后面的结果为什么会超过。`
            : `结果从1、4、9不断增大。10×10=100，${area}还没有出现，所以边长比10大。`,
          sideValue <= 10
            ? `${side} × ${side} gives ${area} exactly. Mark that position, then compare it with the larger products.`
            : `The results grow from 1 to 4 to 9 and onward. Since 10 × 10 = 100 and ${area} has not appeared, the side is greater than 10.`
        ),
        formulas: [tr("1×1=1，2×2=4，……，10×10=100", "1×1=1, 2×2=4, …, 10×10=100")],
        cue: tr("逐格读出算式和结果，让学生先感受结果越来越大。", "Read the products in order so students notice that they keep growing.")
      },
      {
        id: "square-11-20",
        label: tr("算11～20", "Try 11–20"),
        title: tr("继续算11到20，看看什么时候遇到目标面积", "Continue from 11 to 20 and look for the target area"),
        question: tr(`哪一个“自己乘自己”正好等于${area}？`, `Which number times itself equals ${area}?`),
        explanation: tr(
          sideValue >= 11 && sideValue <= 20
            ? `从11开始继续比较，结果越来越接近${area}。算到${side}时，把它记为最值得验证的候选；下一页再把${side}×${side}拆开算清。`
            : sideValue < 11
              ? `目标已经在1到10中出现；11到20的结果都更大，可以用来确认不必继续找。`
              : `算到20×20=400仍没有到${area}，说明边长大于20；后面用整十数继续缩小范围。`,
          sideValue >= 11 && sideValue <= 20
            ? `Continue from 11 as the products move closer to ${area}. Mark ${side} as the strongest candidate, then split ${side} × ${side} on the next page to verify it.`
            : sideValue < 11
              ? `The target already appeared from 1 to 10. Every product from 11 to 20 is larger, confirming that we can stop.`
              : `Even 20 × 20 = 400 is below ${area}, so the side is greater than 20. Later we will use tens to narrow the range.`
        ),
        formulas: [sideValue >= 11 && sideValue <= 20
          ? tr(`11×11=121，……，${side}×${side}=?`, `11×11=121, …, ${side}×${side}=?`)
          : sideValue < 11
            ? tr("目标已经在1～10中出现", "The target already appeared from 1 to 10")
            : tr(`20×20=400，仍小于${area}`, `20×20=400, still below ${area}`)],
        cue: tr("不要跳到15；按11、12、13、14、15的顺序计算。", "Do not jump straight to the target. Work through 11, 12, 13, 14, then 15.")
      },
      {
        id: "multiply-target",
        label: tr(`算清${side}×${side}`, `Work out ${side}×${side}`),
        title: tr(`${side}×${side}怎样一步一步算出来？`, `How can we calculate ${side} × ${side} step by step?`),
        question: tr(`不靠背答案，怎样确认结果真的是${area}？`, `Without memorising it, how can we confirm that the result is ${area}?`),
        explanation: tr(
          tensPart > 0 && onesPart > 0
            ? `把${side}拆成${tensPart}和${onesPart}。先算${side}×${tensPart}，再算${side}×${onesPart}，最后把两部分合起来。`
            : `把${side}和自己相乘，按已经学过的乘法一步一步算出${area}。`,
          tensPart > 0 && onesPart > 0
            ? `Split ${side} into ${tensPart} and ${onesPart}. Multiply by each part, then join the two results.`
            : `Multiply ${side} by itself using familiar multiplication steps to obtain ${area}.`
        ),
        formulas: splitCalculation,
        cue: tr("让学生先完成两部分乘法，再做加法。", "Have students calculate the two parts before adding them.")
      },
      {
        id: "neighbors",
        label: tr("前后比较", "Check neighbours"),
        title: tr(`再比较${previousSide}、${side}和${nextSide}`, `Now compare ${previousSide}, ${side}, and ${nextSide}`),
        question: tr(`为什么边长不能是${previousSide}或${nextSide}？`, `Why can the side not be ${previousSide} or ${nextSide}?`),
        explanation: tr(
          `${previousSide}×${previousSide}=${previousSide * previousSide}，还没有到${area}；${side}×${side}=${area}；${nextSide}×${nextSide}=${nextSide * nextSide}，已经超过。`,
          `${previousSide} × ${previousSide} = ${previousSide * previousSide}, which is below ${area}; ${side} × ${side} = ${area}; ${nextSide} × ${nextSide} = ${nextSide * nextSide}, which is above it.`
        ),
        formulas: [`${previousSide}×${previousSide}=${previousSide * previousSide}`, `${side}×${side}=${area}`, `${nextSide}×${nextSide}=${nextSide * nextSide}`],
        cue: tr("用“小了、刚好、大了”说明15不是猜出来的。", "Use 'too small, exact, too large' to show that the result was proved, not guessed.")
      },
      {
        id: "answer",
        label: tr("核心答案", "Core answer"),
        title: tr("现在可以回答原题了", "Now we can answer the original problem"),
        question: tr("正方形的面积和边长分别是多少？", "What are the square's area and side length?"),
        explanation: tr(
          `长除以${factor}、宽乘以${factor}，面积不变，所以正方形面积是${area}${areaUnit()}。又因为${side}×${side}=${area}，边长是${side}${lengthUnit()}。`,
          `Dividing the length by ${factor} and multiplying the width by ${factor} keeps the area unchanged, so the square's area is ${area} ${areaUnit()}. Since ${side} × ${side} = ${area}, its side is ${side} ${lengthUnit()}.`
        ),
        formulas: [`${side}${lengthUnit()} × ${side}${lengthUnit()} = ${area}${areaUnit()}`, tr(`答：面积是${area}${areaUnit()}，边长是${side}${lengthUnit()}。`, `Answer: area ${area} ${areaUnit()}; side length ${side} ${lengthUnit()}.`)],
        cue: tr("主问题在这里完整作答；后面的页面统一标记为答案后拓展。", "Give the complete core answer here. Every later page is labelled as an extension."),
        answer: true
      },
      {
        id: "original-length",
        label: tr("拓展·原长", "Extend: length"),
        title: tr("知道正方形边长，倒推原来的长", "Use the square side to recover the original length"),
        question: tr(`原来的长除以${factor}以后是${side}${lengthUnit()}，原来的长是多少？`, `The original length divided by ${factor} is ${side} ${lengthUnit()}. What was the original length?`),
        explanation: tr(`把${side}${lengthUnit()}乘回${factor}，得到原来的长是${originalLength}${lengthUnit()}。`, `Multiply ${side} ${lengthUnit()} by ${factor}. The original length was ${originalLength} ${lengthUnit()}.`),
        formulas: [`${side} × ${factor} = ${originalLength}${lengthUnit()}`],
        cue: tr("沿着淡色原长方形的长边读出75米。", "Trace the faint original rectangle and read its recovered length.")
      },
      {
        id: "original-width",
        label: tr("拓展·原宽", "Extend: width"),
        title: tr("再倒推原来的宽", "Now recover the original width"),
        question: tr(`原来的宽乘以${factor}以后是${side}${lengthUnit()}，原来的宽是多少？`, `The original width multiplied by ${factor} is ${side} ${lengthUnit()}. What was the original width?`),
        explanation: tr(`把${side}${lengthUnit()}平均分成${factor}份，每份是${originalWidth}${lengthUnit()}，所以原来的宽是${originalWidth}${lengthUnit()}。`, `Split ${side} ${lengthUnit()} into ${factor} equal parts. Each part is ${originalWidth} ${lengthUnit()}, so that was the original width.`),
        formulas: [`${side} ÷ ${factor} = ${originalWidth}${lengthUnit()}`],
        cue: tr("强调这次除法中的一份表示一个原来的宽。", "Explain that one equal part represents one original width.")
      },
      {
        id: "original-check",
        label: tr("拓展·验面积", "Extend: check"),
        title: tr("把原来的长和宽乘起来，再检查变化", "Multiply the original dimensions and check both changes"),
        question: tr("原面积和变化后的两条边都能对上吗？", "Do the original area and both changed sides match?"),
        explanation: tr(`${originalLength}×${originalWidth}=${area}，原面积正确；${originalLength}÷${factor}=${side}，${originalWidth}×${factor}=${side}，变化后确实是正方形。`, `${originalLength} × ${originalWidth} = ${area}, so the original area is correct. Also, ${originalLength} ÷ ${factor} = ${side} and ${originalWidth} × ${factor} = ${side}, so the transformed shape is a square.`),
        formulas: [`${originalLength} × ${originalWidth} = ${area}${areaUnit()}`, `${originalLength} ÷ ${factor} = ${side}`, `${originalWidth} × ${factor} = ${side}`],
        cue: tr("三条算式全部通过，反推结果才可靠。", "All three checks must pass before the recovered dimensions are accepted.")
      },
      {
        id: "fast-table",
        label: tr("拓展·回看表", "Extend: table"),
        title: tr("不必每次都从1开始乱试", "We do not need to guess from 1 every time"),
        question: tr("1～20的结果表能给我们哪些线索？", "What clues can the 1-to-20 table give us?"),
        explanation: tr(`把1～20放在一起，可以同时观察结果大小和个位。目标${area}所在的位置会被确认色标出。`, `Putting 1 to 20 together lets us compare size and ones digits. The position matching ${area} is marked as confirmed.`),
        formulas: [tr("先看范围，再看个位，最后乘回验证", "Check the range, then the ones digit, then multiply back")],
        cue: tr("这次不逐格重算，而是把表当作寻找规律的地图。", "This time, use the table as a map of patterns instead of recalculating every cell.")
      },
      {
        id: "ones-filter",
        label: tr("拓展·看个位", "Extend: ones"),
        title: tr(`面积个位是${values.resultOnes}，边长个位可能是什么？`, `The area ends in ${values.resultOnes}. What can the side end in?`),
        question: tr(`0～9中，哪些个位自己乘自己，结果个位是${values.resultOnes}？`, `Which digits from 0 to 9 give a product ending in ${values.resultOnes} when multiplied by themselves?`),
        explanation: tr(`逐个看个位相乘的结果，保留下来的个位是${onesCandidates}。这一步只缩小范围，还没有证明完整边长。`, `Check each digit times itself. The possible ending digits are ${onesCandidates}. This narrows the search but does not yet prove the full side length.`),
        formulas: [tr(`边长个位候选：${onesCandidates}`, `Possible side endings: ${onesCandidates}`)],
        cue: tr("提醒学生：只看个位不能直接宣布答案。", "Remind students that the ones digit alone cannot prove the answer.")
      },
      {
        id: "digit-range",
        label: tr("拓展·看位数", "Extend: digits"),
        title: tr("再判断边长是一位数、两位数还是三位数", "Now decide whether the side has one, two, or three digits"),
        question: tr(`根据${area}的大小，边长大约有几位？`, `From the size of ${area}, about how many digits does the side have?`),
        explanation: tr(`9×9=81，10×10=100；99×99=9801，100×100=10000。${area}落在相应的两道门之间，所以边长是${values.sideDigits}位数。`, `Nine times nine is 81 and ten times ten is 100; ninety-nine times ninety-nine is 9801 and one hundred times one hundred is 10000. ${area} lies between the matching gates, so the side has ${values.sideDigits} digit${values.sideDigits === 1 ? "" : "s"}.`),
        formulas: ["9×9=81　|　10×10=100", "99×99=9801　|　100×100=10000", tr(`边长是${values.sideDigits}位数`, `The side has ${values.sideDigits} digit${values.sideDigits === 1 ? "" : "s"}`)],
        cue: tr("位数只能给出大范围，下一页再和整十数、个位线索合并。", "Digit count gives only a broad range. Combine it with tens and ones clues on the next page.")
      },
      {
        id: "method-summary",
        label: tr("拓展·快速找", "Extend: combine"),
        title: tr("把范围、位数和个位线索合在一起", "Combine range, digit, and ones clues"),
        question: tr(`怎样从少数候选中快速确认${side}？`, `How can we quickly confirm ${side} from only a few candidates?`),
        explanation: tr(`先用${values.rangeStart}×${values.rangeStart}和${values.rangeEnd}×${values.rangeEnd}把边长夹在${values.rangeStart}到${values.rangeEnd}之间；再用个位留下${rangeCandidates}；最后把候选乘回去，${side}×${side}=${area}。`, `Use ${values.rangeStart} × ${values.rangeStart} and ${values.rangeEnd} × ${values.rangeEnd} to trap the side between ${values.rangeStart} and ${values.rangeEnd}. The ones digit leaves ${rangeCandidates}. Multiply the candidates back: ${side} × ${side} = ${area}.`),
        formulas: [tr(`范围：${values.rangeStart}～${values.rangeEnd}`, `Range: ${values.rangeStart}–${values.rangeEnd}`), tr(`个位筛选：${rangeCandidates}`, `Ones filter: ${rangeCandidates}`), `${side} × ${side} = ${area}`],
        cue: tr("最后把快速方法和前面逐个计算得到的答案对照。", "Finish by comparing the fast method with the earlier step-by-step calculation."),
        answer: true
      }
    ];
  }

  function numberLabMarkup(values) {
    const area = number(values.area);
    const side = number(values.squareSide);
    const sideValue = Number(values.squareSide);
    const tensPart = Math.floor(sideValue / 10) * 10;
    const onesPart = sideValue - tensPart;
    const previousSide = Math.max(1, sideValue - 1);
    const nextSide = sideValue + 1;
    const tableCells = values.squareTable.map((entry) => {
      const classes = ["square-cell", entry.value > 10 ? "is-upper" : "is-lower"];
      const isTarget = entry.square === values.area;
      if (isTarget) classes.push("is-target");
      return `<div class="${classes.join(" ")}" data-square-value="${entry.value}"><b>${entry.value} × ${entry.value}</b><span${isTarget ? ' class="target-result"' : ""}>= ${entry.square}</span>${isTarget ? '<span class="target-question">= ?</span>' : ""}</div>`;
    }).join("");
    const onesCells = Array.from({ length: 10 }, (_, digit) => {
      const resultOnes = (digit * digit) % 10;
      const possible = values.possibleOnes.includes(digit);
      return `<div class="ones-cell${possible ? " is-possible" : ""}"><b>${digit} × ${digit}</b><span>${tr("个位", "ends in")} ${resultOnes}</span></div>`;
    }).join("");
    const splitBlocks = tensPart > 0 && onesPart > 0
      ? `<div class="split-block is-tens" style="--part:${tensPart}"><b>${side} × ${tensPart}</b><span>${sideValue * tensPart}</span></div><div class="split-block is-ones" style="--part:${onesPart}"><b>${side} × ${onesPart}</b><span>${sideValue * onesPart}</span></div>`
      : `<div class="split-block is-whole" style="--part:${sideValue}"><b>${side} × ${side}</b><span>${area}</span></div>`;
    const rangeCandidates = values.rangeCandidates.join(tr("、", ", ")) || tr("继续寻找", "keep searching");
    const possibleOnes = values.possibleOnes.join(tr("、", ", ")) || tr("没有", "none");

    return `
      <section class="number-lab" aria-label="${tr("自己乘自己结果实验台", "Number-times-itself lab")}">
        <div class="known-answer-chip">${tr(`已知结论：面积${area}${areaUnit()}，边长${side}${lengthUnit()}`, `Known result: area ${area} ${areaUnit()}, side ${side} ${lengthUnit()}`)}</div>

        <section class="number-panel square-table-panel">
          <header class="lab-heading">
            <span>${tr("自己乘自己结果表", "Number-times-itself table")}</span>
            <strong>${tr(`目标面积：${area}`, `Target area: ${area}`)}</strong>
          </header>
          <div class="square-grid">${tableCells}</div>
          <p class="table-range-note">${tr(`10×10=100　20×20=400　目标=${area}`, `10×10=100　20×20=400　target=${area}`)}</p>
        </section>

        <section class="number-panel multiplication-panel">
          <div class="calculation-title">${side} × ${side}</div>
          <div class="area-split" style="--total:${sideValue}">${splitBlocks}</div>
          <div class="calculation-sum">
            ${tensPart > 0 && onesPart > 0 ? `${sideValue * tensPart} + ${sideValue * onesPart} = ${area}` : `${side} × ${side} = ${area}`}
          </div>
        </section>

        <section class="number-panel neighbors-panel">
          <div class="neighbor-card is-low"><span>${tr("小了", "Too small")}</span><b>${previousSide} × ${previousSide}</b><strong>${previousSide * previousSide}</strong></div>
          <div class="neighbor-card is-exact"><span>${tr("刚好", "Exact")}</span><b>${side} × ${side}</b><strong>${area}</strong></div>
          <div class="neighbor-card is-high"><span>${tr("大了", "Too large")}</span><b>${nextSide} × ${nextSide}</b><strong>${nextSide * nextSide}</strong></div>
        </section>

        <section class="number-panel ones-panel">
          <header class="lab-heading">
            <span>${tr(`目标面积个位是 ${values.resultOnes}`, `Target area ends in ${values.resultOnes}`)}</span>
            <strong>${tr(`保留个位：${possibleOnes}`, `Keep endings: ${possibleOnes}`)}</strong>
          </header>
          <div class="ones-grid">${onesCells}</div>
        </section>

        <section class="number-panel digits-panel">
          <div class="digit-gate${values.sideDigits === 1 ? " is-current" : ""}"><span>${tr("一位数边长", "One-digit side")}</span><b>9 × 9 = 81</b><small>${tr("最大到81", "up to 81")}</small></div>
          <div class="gate-arrow" aria-hidden="true">→</div>
          <div class="digit-gate${values.sideDigits === 2 ? " is-current" : ""}"><span>${tr("两位数边长", "Two-digit side")}</span><b>10 × 10 = 100</b><b>99 × 99 = 9801</b></div>
          <div class="gate-arrow" aria-hidden="true">→</div>
          <div class="digit-gate${values.sideDigits >= 3 ? " is-current" : ""}"><span>${tr("三位数边长", "Three-digit side")}</span><b>100 × 100 = 10000</b><small>${tr("从10000开始", "starts at 10000")}</small></div>
        </section>

        <section class="number-panel method-panel">
          <div class="method-step"><span>1</span><small>${tr("看位数", "Digits")}</small><b>${values.sideDigits}${tr("位数", " digits")}</b></div>
          <div class="method-arrow" aria-hidden="true">→</div>
          <div class="method-step"><span>2</span><small>${tr("夹范围", "Range")}</small><b>${values.rangeStart}～${values.rangeEnd}</b></div>
          <div class="method-arrow" aria-hidden="true">→</div>
          <div class="method-step"><span>3</span><small>${tr("看个位", "Ones")}</small><b>${rangeCandidates}</b></div>
          <div class="method-arrow" aria-hidden="true">→</div>
          <div class="method-step is-confirmed"><span>4</span><small>${tr("乘回验证", "Verify")}</small><b>${side}×${side}=${area}</b></div>
        </section>
      </section>
    `;
  }

  function diagramMarkup(values) {
    const factor = Number(values.factor);
    const originalWidthPx = 760;
    const squareSidePx = originalWidthPx / factor;
    const originalHeightPx = squareSidePx / factor;
    const x = 110;
    const baseY = 320;
    const originalBottom = baseY + originalHeightPx;
    const squareTop = originalBottom - squareSidePx;
    const squareRight = x + squareSidePx;
    const guideY = Math.min(542, originalBottom + 40);
    const verticalGuideX = x - 34;
    const retainLabelY = originalBottom > 460 ? baseY - 80 : originalBottom + 30;
    const labels = copy[language()];
    const showBandNumbers = originalHeightPx >= 15;
    const pieces = [];
    const cuts = [];
    const pieceNumbers = [];
    const bands = [];
    const bandNumbers = [];

    for (let index = 0; index < factor; index += 1) {
      const pieceX = x + index * squareSidePx;
      pieces.push(`<rect class="original-piece${index === 0 ? " is-retained" : ""}" data-piece="${index + 1}" x="${pieceX}" y="${baseY}" width="${squareSidePx}" height="${originalHeightPx}" />`);
      pieceNumbers.push(`<text class="piece-number" x="${pieceX + squareSidePx / 2}" y="${baseY + originalHeightPx / 2}">${index + 1}</text>`);
      if (index > 0) {
        cuts.push(`<line class="cut-line" x1="${pieceX}" y1="${baseY}" x2="${pieceX}" y2="${originalBottom}" />`);
      }
    }

    for (let level = 1; level < factor; level += 1) {
      const bandY = baseY - level * originalHeightPx;
      bands.push(`<rect class="expansion-band" style="--delay:${(level - 1) * 70}ms" data-band="${level + 1}" x="${x}" y="${bandY}" width="${squareSidePx}" height="${originalHeightPx}" />`);
    }

    if (showBandNumbers) {
      for (let level = 0; level < factor; level += 1) {
        const labelY = baseY - level * originalHeightPx + originalHeightPx / 2;
        bandNumbers.push(`<text class="band-number" x="${x + squareSidePx / 2}" y="${labelY}">${level + 1}</text>`);
      }
    }

    const answerSide = labels.sideText(number(values.squareSide));
    const proofX = 590;

    return `
      <div class="visual-stage">
      <svg class="geometry-svg" viewBox="0 0 1000 560" role="img" aria-label="${labels.svgLabel(factor)}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#7b8794" />
          </marker>
          <marker id="arrow-teal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f8f84" />
          </marker>
          <marker id="arrow-ink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#172033" />
          </marker>
        </defs>

        <line class="stage-floor" x1="70" y1="${originalBottom + 16}" x2="920" y2="${originalBottom + 16}" />

        <g class="original-guide">
          <line class="guide-line" x1="${x + 6}" y1="${baseY - 38}" x2="${x + originalWidthPx - 6}" y2="${baseY - 38}" marker-start="url(#arrow-gray)" marker-end="url(#arrow-gray)" />
          <text class="dimension-text" x="${x + originalWidthPx / 2}" y="${baseY - 55}">${labels.originalLength}</text>
          <line class="guide-line" x1="${x - 24}" y1="${baseY + 2}" x2="${x - 24}" y2="${originalBottom - 2}" marker-start="url(#arrow-gray)" marker-end="url(#arrow-gray)" />
          <text class="dimension-text original-width-text" x="${x - 60}" y="${baseY + originalHeightPx / 2}">${labels.originalWidth}</text>
        </g>

        <g class="original-shape">
          ${pieces.join("")}
          ${cuts.join("")}
          ${pieceNumbers.join("")}
          <rect class="original-outline" x="${x}" y="${baseY}" width="${originalWidthPx}" height="${originalHeightPx}" />
        </g>

        <g class="retain-label">
          <rect x="${x}" y="${retainLabelY}" width="${Math.max(190, squareSidePx)}" height="42" rx="10" />
          <text x="${x + Math.max(190, squareSidePx) / 2}" y="${retainLabelY + 27}">${labels.onePart(factor)}</text>
        </g>

        <g class="expanded-shape">
          ${bands.join("")}
          ${bandNumbers.join("")}
          <rect class="square-outline" x="${x}" y="${squareTop}" width="${squareSidePx}" height="${squareSidePx}" />
        </g>

        <g class="grow-guide">
          <line class="guide-line" x1="${squareRight + 28}" y1="${squareTop + 5}" x2="${squareRight + 28}" y2="${originalBottom - 5}" marker-start="url(#arrow-teal)" marker-end="url(#arrow-teal)" />
          <text x="${squareRight + 92}" y="${squareTop + squareSidePx / 2 + 8}">${labels.growWidth(factor)}</text>
        </g>

        <g class="area-proof">
          <rect x="${proofX}" y="82" width="300" height="128" rx="16" />
          <text class="proof-small" x="${proofX + 150}" y="116">${labels.proofLength(factor)}</text>
          <text class="proof-small" x="${proofX + 150}" y="148">${labels.proofWidth(factor)}</text>
          <text class="proof-main" x="${proofX + 150}" y="188">${labels.proofMain(factor)}</text>
        </g>

        <g class="side-guide">
          <line class="guide-line" x1="${x + 6}" y1="${guideY}" x2="${squareRight - 6}" y2="${guideY}" marker-start="url(#arrow-ink)" marker-end="url(#arrow-ink)" />
          <text class="side-unknown-text" x="${x + squareSidePx / 2}" y="${guideY - 13}">${labels.unknownSide}</text>
          <text class="side-answer-text" x="${x + squareSidePx / 2}" y="${guideY - 13}">${answerSide}</text>
          <line class="guide-line" x1="${verticalGuideX}" y1="${squareTop + 6}" x2="${verticalGuideX}" y2="${originalBottom - 6}" marker-start="url(#arrow-ink)" marker-end="url(#arrow-ink)" />
          <text class="side-unknown-text" x="${verticalGuideX - 12}" y="${squareTop + squareSidePx / 2}" transform="rotate(-90 ${verticalGuideX - 12} ${squareTop + squareSidePx / 2})">${labels.unknownSide}</text>
          <text class="side-answer-text" x="${verticalGuideX - 12}" y="${squareTop + squareSidePx / 2}" transform="rotate(-90 ${verticalGuideX - 12} ${squareTop + squareSidePx / 2})">${answerSide}</text>
        </g>

        <g class="reverse-length-evidence">
          <line class="guide-line" x1="${x + 6}" y1="${baseY - 38}" x2="${x + originalWidthPx - 6}" y2="${baseY - 38}" marker-start="url(#arrow-ink)" marker-end="url(#arrow-ink)" />
          <text x="${x + originalWidthPx / 2}" y="${baseY - 55}">${number(values.originalLength)}${lengthUnit()}</text>
        </g>

        <g class="reverse-width-evidence">
          <line class="guide-line" x1="${x + originalWidthPx / 2}" y1="${originalBottom + 2}" x2="${x + originalWidthPx / 2}" y2="${originalBottom + 34}" />
          <text x="${x + originalWidthPx / 2}" y="${originalBottom + 58}">${tr(`原宽 ${number(values.originalWidth)}${lengthUnit()}`, `Original width ${number(values.originalWidth)} ${lengthUnit()}`)}</text>
        </g>

        <g class="reverse-check-evidence">
          <rect x="${proofX}" y="228" width="300" height="154" rx="16" />
          <text class="check-title" x="${proofX + 150}" y="264">${tr("三条检查全部通过", "All three checks pass")}</text>
          <text x="${proofX + 150}" y="302">${number(values.originalLength)} × ${number(values.originalWidth)} = ${number(values.area)}</text>
          <text x="${proofX + 150}" y="336">${number(values.originalLength)} ÷ ${factor} = ${number(values.squareSide)}</text>
          <text x="${proofX + 150}" y="370">${number(values.originalWidth)} × ${factor} = ${number(values.squareSide)}</text>
        </g>

        <g class="answer-badge">
          <rect x="${proofX}" y="82" width="300" height="116" rx="16" />
          <text class="answer-main" x="${proofX + 150}" y="125">${labels.answerArea(number(values.area))}</text>
          <text class="answer-sub" x="${proofX + 150}" y="166">${labels.answerSide(number(values.squareSide))}</text>
        </g>
      </svg>
      ${numberLabMarkup(values)}
      </div>
    `;
  }

  function applyStaticCopy() {
    app.querySelectorAll("[data-copy]").forEach((node) => {
      const value = t(node.dataset.copy);
      if (typeof value === "string") node.textContent = value;
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", t("backLabel"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", t("closeLabel"));
    document.title = `${t("title")} - Math Motion Lab`;
  }

  function renderProblem() {
    const area = number(state.values.area);
    const factor = number(state.values.factor);
    elements.problemStrip.innerHTML = `
      <strong>${t("problemStart")} ${area} ${areaUnit()}</strong>
      <span class="problem-change">${t("problemChange")(factor)}</span>
      <strong>${t("problemEnd")}</strong>
    `;
  }

  function renderProgress() {
    elements.progress.innerHTML = `
      <ol class="progress-list${state.slides.length > 10 ? " is-long" : ""}" style="--step-count:${state.slides.length}">
        ${state.slides.map((slide, index) => {
          const status = index === state.slideIndex ? "is-current" : index < state.slideIndex ? "is-complete" : "";
          return `<li><button class="progress-button ${status}" type="button" data-slide-index="${index}" ${index === state.slideIndex ? 'aria-current="step"' : ""} aria-label="${t("progressLabel")(index + 1, state.slides.length, slide.label)}"><span class="progress-number">${index + 1}</span><span class="progress-label">${slide.label}</span></button></li>`;
        }).join("")}
      </ol>
    `;
  }

  function renderSlide() {
    const slide = state.slides[state.slideIndex];
    elements.stage.dataset.step = slide.id;
    elements.stage.setAttribute("aria-label", `${slide.label}：${slide.title}`);
    elements.stageTag.textContent = `${state.slideIndex + 1}. ${slide.label}`;
    elements.stageTitle.textContent = slide.title;
    elements.question.textContent = slide.question;
    elements.explanation.textContent = slide.explanation;
    elements.formulas.innerHTML = slide.formulas.map((formula, index) => `<div class="formula-line${slide.answer && index === slide.formulas.length - 1 ? " is-answer" : ""}">${formula}</div>`).join("");
    elements.teacherCue.textContent = `${t("cuePrefix")}${slide.cue}`;
    elements.pageCount.textContent = t("pageCount")(state.slideIndex + 1, state.slides.length);
    elements.nextLabel.textContent = state.slideIndex === state.slides.length - 1 ? t("finish") : t("next");
    elements.prevButton.disabled = state.slideIndex === 0;
    elements.nextButton.disabled = state.slideIndex === state.slides.length - 1;
    renderProgress();
  }

  function rebuildLesson({ rebuildDiagram = true } = {}) {
    state.values = MathLabModels.geometry.rectangleToSquareState(state.area, state.factor);
    state.slides = buildSlides(state.values);
    applyStaticCopy();
    renderProblem();
    if (rebuildDiagram) elements.diagramWrap.innerHTML = diagramMarkup(state.values);
    renderSlide();
  }

  function goToSlide(nextIndex) {
    const clamped = Math.max(0, Math.min(state.slides.length - 1, nextIndex));
    if (clamped === state.slideIndex) return;
    state.slideIndex = clamped;
    renderSlide();
  }

  function settingsMessage(result) {
    const messages = {
      "invalid-area": "invalidArea",
      "invalid-factor": "invalidFactor",
      "not-square": "notSquare",
      "non-whole-width": "nonWholeWidth"
    };
    return t(messages[result.reason] || "invalidArea");
  }

  function openSettings() {
    elements.areaInput.value = String(state.area);
    elements.factorInput.value = String(state.factor);
    elements.settingsError.hidden = true;
    elements.settingsDialog.showModal();
    elements.areaInput.focus();
  }

  function closeSettings() {
    elements.settingsDialog.close();
    app.querySelector('[data-action="edit"]').focus();
  }

  function applySettings() {
    const result = MathLabModels.geometry.rectangleToSquareState(elements.areaInput.value.trim(), elements.factorInput.value.trim());
    if (!result.valid) {
      elements.settingsError.textContent = settingsMessage(result);
      elements.settingsError.hidden = false;
      return;
    }
    state.area = result.area;
    state.factor = result.factor;
    state.slideIndex = 0;
    elements.settingsDialog.close();
    rebuildLesson();
    app.querySelector('[data-action="edit"]').focus();
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }

  app.addEventListener("click", (event) => {
    const slideButton = event.target.closest("[data-slide-index]");
    if (slideButton) {
      goToSlide(Number(slideButton.dataset.slideIndex));
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "prev") goToSlide(state.slideIndex - 1);
    if (action === "next") goToSlide(state.slideIndex + 1);
    if (action === "edit") openSettings();
    if (action === "fullscreen") toggleFullscreen();
    if (action === "close-settings" || action === "cancel-settings") closeSettings();
    if (action === "apply-settings") applySettings();
  });

  document.addEventListener("keydown", (event) => {
    if (elements.settingsDialog.open) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(state.slideIndex - 1);
    }
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      goToSlide(state.slideIndex + 1);
    }
  });

  elements.settingsDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSettings();
  });

  MathLab.bindLanguageToggle(() => {
    state.slides = buildSlides(state.values);
    rebuildLesson();
  });

  rebuildLesson();
})();
