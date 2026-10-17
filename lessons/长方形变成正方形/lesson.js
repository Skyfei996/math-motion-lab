(function () {
  const app = document.querySelector("[data-rectangle-square-app]");
  if (!app || !window.MathLab || !window.MathLabModels) return;

  const COPY = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "长方形变成正方形",
      edit: "修改题目",
      fullscreen: "全屏讲解",
      prev: "上一页",
      next: "下一页",
      replay: "重新开始",
      pageCount: "第 {current} 页 / 共 {total} 页",
      parameters: "题目参数",
      settingsTitle: "换一道题试一试",
      settingsLead: "应用后会回到第1页，重新演示切分和重组。",
      areaLabel: "长方形面积（正整数）",
      factorLabel: "长除以、宽乘以的同一个数（2～10）",
      squareMetres: "平方米",
      methodTitle: "怎样选一组适合小学课堂的数？",
      methodCopy: "面积要能由同一个整数相乘得到，而且边长要能被变化数字整除。",
      cancel: "取消",
      apply: "应用并重新讲解",
      currentQuestion: "本页问题",
      blackboard: "板书",
      back: "返回课程目录",
      close: "关闭",
      invalidArea: "请输入一个正整数面积。",
      invalidFactor: "变化数字请输入2～10之间的正整数。",
      notSquare: "这个面积不能由同一个整数相乘得到，请换一个面积。",
      nonWholeWidth: "反推原来的宽会出现小数，请换一个面积或变化数字。"
    },
    "en-US": {
      labName: "Elementary math classroom",
      title: "A Rectangle Becomes a Square",
      edit: "Change problem",
      fullscreen: "Present full screen",
      prev: "Previous",
      next: "Next",
      replay: "Start over",
      pageCount: "Page {current} of {total}",
      parameters: "Problem values",
      settingsTitle: "Try a different problem",
      settingsLead: "Applying new values returns to page 1 and rebuilds the cut-and-move demonstration.",
      areaLabel: "Rectangle area (positive whole number)",
      factorLabel: "Number used to divide the length and multiply the width (2–10)",
      squareMetres: "square metres",
      methodTitle: "How do I choose classroom-friendly values?",
      methodCopy: "The area must be a whole number times itself, and the side length must be divisible by the change number.",
      cancel: "Cancel",
      apply: "Apply and restart",
      currentQuestion: "Question for this page",
      blackboard: "Working",
      back: "Back to catalog",
      close: "Close",
      invalidArea: "Enter a positive whole-number area.",
      invalidFactor: "Enter a whole-number change from 2 to 10.",
      notSquare: "This area is not a whole number multiplied by itself. Try another area.",
      nonWholeWidth: "The original width would be a decimal. Change the area or the change number."
    }
  };

  const state = { area: "225", factor: "5" };
  let slideIndex = 0;
  let renderedSlideIndex = 0;

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

  function problem() {
    return MathLabModels.geometry.rectangleToSquareState(state.area, state.factor);
  }

  function number(value) {
    return MathLab.numberText(value);
  }

  function lengthUnit() {
    return tr("米", "metres");
  }

  function areaUnit() {
    return tr("平方米", "square metres");
  }

  function buildSlides(values) {
    const side = number(values.squareSide);
    const factor = number(values.factor);
    const area = number(values.area);
    const originalLength = number(values.originalLength);
    const originalWidth = number(values.originalWidth);
    const rangeStart = number(Math.max(1, values.rangeStart));
    const rangeEnd = number(values.rangeEnd);
    const tensPart = Math.floor(values.squareSide / 10) * 10;
    const onesPart = values.squareSide - tensPart;
    const multiplicationLines = tensPart > 0 && onesPart > 0
      ? [`${side} × ${tensPart} = ${values.squareSide * tensPart}`, `${side} × ${onesPart} = ${values.squareSide * onesPart}`, `${values.squareSide * tensPart} + ${values.squareSide * onesPart} = ${area}`]
      : [`${side} × ${side} = ${area}`];

    return [
      {
        id: "read",
        type: "read",
        label: tr("读题", "Read"),
        title: tr("题目改变了两条边", "The problem changes both sides"),
        question: tr("长和宽分别发生了什么变化？", "What happens to the length and the width?"),
        lead: tr(`长除以${factor}，宽乘以${factor}，最后变成正方形。`, `The length is divided by ${factor}, the width is multiplied by ${factor}, and the result is a square.`),
        formula: [tr(`长：除以${factor}`, `Length: divide by ${factor}`), tr(`宽：乘以${factor}`, `Width: multiply by ${factor}`)]
      },
      {
        id: "cut",
        type: "cut",
        label: tr("切成长条", "Cut"),
        title: tr(`“长除以${factor}”可以怎样画出来？`, `How can we draw “length divided by ${factor}”?`),
        question: tr(`把长平均分成${factor}份，每一份有多长？`, `If the length is split into ${factor} equal parts, how long is each part?`),
        lead: tr(`沿着长切成${factor}块，每块的长正好是原来长的${factor}分之一。`, `Cut along the length to make ${factor} equal pieces. Each piece is one ${factor}th of the original length.`),
        formula: [tr(`原来的长 ÷ ${factor} = 每块的长`, `Original length ÷ ${factor} = each piece's length`)]
      },
      {
        id: "focus",
        type: "focus",
        label: tr("留下这一份", "Keep one part"),
        title: tr(`先看其中一份：这就是“长除以${factor}”`, `Focus on one part: this is “length divided by ${factor}”`),
        question: tr(`原来的长平均分成${factor}份，只看一份，它是原来的几分之一？`, `The original length is split into ${factor} equal parts. What fraction is one part?`),
        lead: tr(`金色这一份没有变短或变宽。它的长正好是原来长的${factor}分之一。`, `The gold piece has not changed its shape. Its length is exactly one ${factor}th of the original length.`),
        formula: [tr(`原来的长 ÷ ${factor} = 金色纸条的长`, `Original length ÷ ${factor} = the gold strip's length`)]
      },
      {
        id: "stack",
        type: "stack",
        label: tr("移动纸条", "Move"),
        title: tr(`“宽乘以${factor}”可以怎样看见？`, `How can we see “width multiplied by ${factor}”?`),
        question: tr(`把${factor}块一块一块叠起来，新图形的宽会怎样？`, `When the ${factor} pieces are stacked, what happens to the new width?`),
        lead: tr(`每块的宽没有变，${factor}个宽接在一起，就是原来的宽乘以${factor}。`, `The width of each piece stays the same. Joining ${factor} widths makes the original width multiplied by ${factor}.`),
        formula: [tr(`${factor}个原来的宽 = 原来的宽 × ${factor}`, `${factor} original widths = original width × ${factor}`)]
      },
      {
        id: "area",
        type: "area",
        label: tr("面积不变", "Same area"),
        title: tr("形状变了，面积为什么没有变？", "Why does the area stay the same when the shape changes?"),
        question: tr("切开再重新排列，有没有增加或拿走纸片？", "Did we add or remove any piece while cutting and rearranging?"),
        lead: tr(`还是原来的${factor}块，一块不少，一块不多，所以总面积仍是${area}${areaUnit()}。`, `They are still the same ${factor} pieces—none added and none removed—so the total area is still ${area} ${areaUnit()}.`),
        formula: [tr(`原长方形面积 = 正方形面积 = ${area}${areaUnit()}`, `Rectangle area = square area = ${area} ${areaUnit()}`)]
      },
      {
        id: "examples-small",
        type: "examples-small",
        label: tr("先算1到10", "First 1 to 10"),
        title: tr("先从熟悉的小数字开始：一个数自己乘自己", "Start with familiar numbers: a number times itself"),
        question: tr("从1×1算到10×10，结果是怎样慢慢变大的？", "From 1×1 to 10×10, how do the products grow?"),
        lead: tr("正方形两条边一样长，所以我们要找的是“同一个数 × 同一个数”。先把1到10算一遍。", "A square has equal sides, so we need “the same number × the same number.” First work through 1 to 10."),
        formula: [tr("1×1=1，2×2=4，……，10×10=100", "1×1=1, 2×2=4, …, 10×10=100")]
      },
      {
        id: "examples-large",
        type: "examples-large",
        label: tr("再算11到20", "Then 11 to 20"),
        title: values.squareSide <= 20 ? tr(`继续往上找，什么时候会遇到${area}？`, `Keep going. When do we reach ${area}?`) : tr("继续算到20，先建立一张常用结果表", "Continue to 20 and build a useful table"),
        question: values.squareSide <= 20 ? tr(`从11×11算到20×20，哪个结果正好是${area}？`, `From 11×11 to 20×20, which product is exactly ${area}?`) : tr(`20×20只有400，${area}还要继续往上找吗？`, `20×20 is only 400. Must we keep going to reach ${area}?`),
        lead: values.squareSide <= 20 ? tr(`按顺序算，不用乱猜。小于${area}就继续，大于${area}就说明已经走过了。`, `Work in order instead of guessing. Continue while the product is below ${area}; once it is above, we have gone too far.`) : tr("1到20的结果是常用例子；更大的面积在下一页用整十数先定范围。", "The 1-to-20 table gives useful examples. For a larger area, the next page uses tens to narrow the range."),
        formula: [`${side} × ${side} = ${area}`]
      },
      {
        id: "range",
        type: "range",
        label: tr("先定范围", "Find the range"),
        title: tr("不必从1开始：先把边长夹在一个小范围里", "Do not start at 1: first trap the side in a small range"),
        question: tr(`${rangeStart}自己乘自己还没有到${area}，${rangeEnd}自己乘自己已经到了或超过了${area}，边长会在哪里？`, `The square of ${rangeStart} is still below ${area}, while the square of ${rangeEnd} reaches or passes it. Where must the side be?`),
        lead: tr(`边长只要在${rangeStart}到${rangeEnd}之间找，候选数一下就少了很多。`, `Now we only search from ${rangeStart} to ${rangeEnd}, leaving far fewer candidates.`),
        formula: [`${rangeStart} × ${rangeStart} = ${Math.max(1, values.rangeStart) ** 2}`, `${rangeEnd} × ${rangeEnd} = ${values.rangeEnd ** 2}`]
      },
      {
        id: "ones-filter",
        type: "ones-filter",
        label: tr("再看个位", "Check the ones digit"),
        title: tr(`面积末尾是${values.resultOnes}，边长的个位可以先猜什么？`, `The area ends in ${values.resultOnes}. What can we guess about the side's ones digit?`),
        question: tr(`面积个位是${values.resultOnes}，哪些个位自己乘自己也会得到${values.resultOnes}？`, `The area's ones digit is ${values.resultOnes}. Which ones digits give ${values.resultOnes} when squared?`),
        lead: tr("只看个位是在缩小范围，不是在直接宣布答案。筛完以后，还要把完整的候选数乘回去。", "The ones digit narrows the range; it does not prove the answer. We still multiply the full candidate back."),
        formula: [tr(`范围内的候选：${values.rangeCandidates.join("、")}`, `Candidates in the range: ${values.rangeCandidates.join(", ")}`), `${side} × ${side} = ${area}`]
      },
      {
        id: "multiply",
        type: "multiply",
        label: tr(`把${side}×${side}算清楚`, "Work it out"),
        title: tr(`${side}×${side}不是背出来的，可以拆成两块来算`, `${side}×${side} need not be memorized; split it into two parts`),
        question: tr(`怎样确认${side}×${side}真的等于${area}？`, `How can we confirm that ${side}×${side} really equals ${area}?`),
        lead: tensPart > 0 && onesPart > 0
          ? tr(`把一个${side}拆成${tensPart}和${onesPart}，分别计算，再把两块面积合起来。`, `Split one ${side} into ${tensPart} and ${onesPart}, calculate the two areas, then join them.`)
          : tr("把边长乘回去，确认得到的面积和题目完全一样。", "Multiply the side by itself and confirm that it gives the stated area."),
        formula: multiplicationLines
      },
      {
        id: "answer",
        type: "answer",
        label: tr("回答原题", "Answer"),
        title: tr("现在可以完整回答原题了", "Now we can answer the original problem"),
        question: tr("正方形的面积和边长分别是多少？", "What are the square's area and side length?"),
        lead: tr("纸片只重新排列，所以面积不变；同一个数乘自己得到这个面积，所以找到了边长。", "The pieces were only rearranged, so the area stayed the same. The side is the number that times itself gives that area."),
        formula: [tr(`正方形面积：${area}${areaUnit()}`, `Square area: ${area} ${areaUnit()}`), tr(`正方形边长：${side}${lengthUnit()}`, `Square side: ${side} ${lengthUnit()}`)]
      },
      {
        id: "reverse-length",
        type: "reverse-length",
        label: tr("反推原长", "Original length"),
        title: tr("知道正方形边长，还能找回原来的长", "The square side lets us recover the original length"),
        question: tr(`正方形边长是原来的长除以${factor}，倒过来应该怎样算？`, `The square side is the original length divided by ${factor}. How do we reverse it?`),
        lead: tr(`把${side}${lengthUnit()}乘回${factor}，就得到原来的长。纸条也会依次回到原位。`, `Multiply ${side} ${lengthUnit()} by ${factor} to recover the original length. The strips also return to their original places.`),
        formula: [`${side} × ${factor} = ${originalLength}${lengthUnit()}`]
      },
      {
        id: "reverse-width",
        type: "reverse-width",
        label: tr("反推原宽", "Original width"),
        title: tr("再找回原来的宽", "Now recover the original width"),
        question: tr(`正方形边长是原来的宽乘以${factor}，倒过来怎样算？`, `The square side is the original width multiplied by ${factor}. How do we reverse it?`),
        lead: tr(`把${side}${lengthUnit()}平均分成${factor}份，就得到原来的宽。`, `Split ${side} ${lengthUnit()} into ${factor} equal parts to recover the original width.`),
        formula: [`${side} ÷ ${factor} = ${originalWidth}${lengthUnit()}`]
      },
      {
        id: "verify",
        type: "verify",
        label: tr("反向验证", "Check backwards"),
        title: tr("把原来的长和宽放回题目，全部检查一遍", "Put the original dimensions back into the problem and check everything"),
        question: tr("原面积对不对？变化后的两条边是不是都等于正方形边长？", "Is the original area correct? Do both changed sides equal the square side?"),
        lead: tr("面积和两条变化都能对上，说明答案经得住反向检查。", "The area and both side changes match, so the answer passes the reverse check."),
        formula: [`${originalLength} × ${originalWidth} = ${area}`, `${originalLength} ÷ ${factor} = ${side}；${originalWidth} × ${factor} = ${side}`]
      },
      {
        id: "fast-method",
        type: "fast-method",
        label: tr("改题也会做", "Use it again"),
        title: tr("如果面积换成别的数，怎样更快找到正方形边长？", "If the area changes, how can we find the square side faster?"),
        question: tr("先定范围、再看个位、最后乘回验证，这三个步骤各有什么用？", "What does each step do: find the range, check the ones digit, then multiply back?"),
        lead: tr(`这道题先锁定${rangeStart}到${rangeEnd}，再看个位，最后只检查少数候选数。换题时仍然可以照这个顺序。`, `This problem first narrows the side to ${rangeStart}–${rangeEnd}, then checks the ones digit, and finally tests only a few candidates. The same order works after changing the values.`),
        formula: [tr("① 定范围　② 看个位　③ 乘回去验证", "1. Find the range  2. Check the ones digit  3. Multiply back")]
      }
    ];
  }

  function pieceGeometry(values) {
    const factor = values.factor;
    const squareSize = Math.min(250, 680 / factor);
    const pieceWidth = squareSize;
    const pieceHeight = squareSize / factor;
    const originalWidth = pieceWidth * factor;
    return {
      factor,
      squareSize,
      pieceWidth,
      pieceHeight,
      originalX: (900 - originalWidth) / 2,
      originalY: (430 - squareSize) / 2,
      originalWidth,
      squareX: (900 - originalWidth) / 2,
      squareY: (430 - squareSize) / 2
    };
  }

  const PIECE_COLORS = ["#f4e5bd", "#eeddb1", "#f4e5bd", "#eeddb1", "#f4e5bd", "#eeddb1", "#f4e5bd", "#eeddb1", "#f4e5bd", "#eeddb1"];

  function piecesSvg(values, mode) {
    const g = pieceGeometry(values);
    const groups = Array.from({ length: g.factor }, (_, index) => {
      const sourceX = g.originalX + index * g.pieceWidth;
      const targetY = g.squareY + index * g.pieceHeight;
      const dx = g.squareX - sourceX;
      const dy = targetY - g.originalY;
      const finalTransform = mode === "square" ? `translate(${dx} ${dy})` : "";
      const motionClass = mode === "stack" ? "is-stacking" : mode === "reverse" ? "is-unstacking" : "";
      return `<g class="rs-piece-group ${motionClass}" style="--dx:${dx}px;--dy:${dy}px;--delay:${index * 120}ms" ${finalTransform ? `transform="${finalTransform}"` : ""}>
        <rect x="${sourceX}" y="${g.originalY}" width="${g.pieceWidth}" height="${g.pieceHeight}" fill="${PIECE_COLORS[index]}" />
        <text x="${sourceX + g.pieceWidth / 2}" y="${g.originalY + g.pieceHeight / 2 + 5}">${index + 1}</text>
      </g>`;
    }).join("");
    const cutLines = Array.from({ length: g.factor - 1 }, (_, index) => {
      const x = g.originalX + (index + 1) * g.pieceWidth;
      return `<line class="rs-cut-line" style="--delay:${index * 130}ms" x1="${x}" y1="${g.originalY - 16}" x2="${x}" y2="${g.originalY + g.pieceHeight + 16}" />`;
    }).join("");
    const showCuts = mode === "cut";
    const showSquare = mode === "square" || mode === "stack";
    const label = mode === "reverse"
      ? tr("把纸条依次排回原来的位置", "Move each strip back to its original place")
      : mode === "stack"
        ? tr("同一批纸条：只移动，不增不减", "The same strips: moved, not added or removed")
        : tr(`沿着长平均分成${g.factor}块`, `Split the length into ${g.factor} equal pieces`);
    const viewBox = mode === "square"
      ? `${g.squareX - 140} ${g.squareY - 92} ${g.squareSize + 280} ${g.squareSize + 184}`
      : "0 0 760 440";

    return `<svg class="rs-geometry-svg" viewBox="${viewBox}" role="img" aria-label="${label}">
      <path class="rs-stage-baseline" d="M54 355 H706" />
      ${groups}
      ${showCuts ? cutLines : ""}
      ${showSquare ? `<rect class="rs-square-outline" x="${g.squareX}" y="${g.squareY}" width="${g.squareSize}" height="${g.squareSize}" />` : ""}
      <text class="rs-svg-caption" x="380" y="402">${label}</text>
    </svg>`;
  }

  function renderRead(values) {
    return `<div class="rs-read-scene">
      <div class="rs-read-rectangle" aria-label="${tr("一个面积已知的长方形", "A rectangle with a known area")}">
        <span>${number(values.area)} ${areaUnit()}</span>
      </div>
      <div class="rs-change-row">
        <span>${tr("长", "Length")} ÷ ${values.factor}</span>
        <span class="rs-change-arrow" aria-hidden="true">→</span>
        <span>${tr("宽", "Width")} × ${values.factor}</span>
        <span class="rs-change-arrow" aria-hidden="true">→</span>
        <span class="rs-square-placeholder">?</span>
      </div>
    </div>`;
  }

  function renderSquare(values) {
    const g = pieceGeometry(values);
    return `<div class="rs-square-scene">
      ${piecesSvg(values, "square")}
      <span class="rs-side-tag is-top" style="--square-size:${g.squareSize}px">${tr(`长 ÷ ${values.factor}`, `length ÷ ${values.factor}`)}</span>
      <span class="rs-side-tag is-side">${tr(`宽 × ${values.factor}`, `width × ${values.factor}`)}</span>
    </div>`;
  }

  function miniPieces(values, shape) {
    const cells = Array.from({ length: values.factor }, (_, index) => `<span style="background:${PIECE_COLORS[index]}">${index + 1}</span>`).join("");
    return `<div class="rs-mini-shape is-${shape}" style="--factor:${values.factor}">${cells}</div>`;
  }

  function renderArea(values) {
    return `<div class="rs-area-proof">
      <section><strong>${tr("原来的排列", "Original arrangement")}</strong>${miniPieces(values, "rectangle")}<span>${values.factor}${tr("块", " pieces")}</span></section>
      <span class="rs-equals" aria-hidden="true">=</span>
      <section><strong>${tr("新的排列", "New arrangement")}</strong>${miniPieces(values, "square")}<span>${values.factor}${tr("块", " pieces")}</span></section>
      <p>${tr("没有增加，也没有拿走", "Nothing added and nothing removed")}</p>
    </div>`;
  }

  function renderFindSide(values) {
    const lower = Math.max(1, values.rangeStart);
    const upper = values.rangeEnd;
    const candidates = values.rangeCandidates.map((candidate) => `<span class="rs-candidate ${candidate === values.squareSide ? "is-answer" : ""}">${candidate} × ${candidate} = ${candidate * candidate}</span>`).join("");
    return `<div class="rs-range-search">
      <section><span>${lower} × ${lower}</span><strong>${lower * lower}</strong></section>
      <div class="rs-range-line"><span>${number(values.area)}</span></div>
      <section><span>${upper} × ${upper}</span><strong>${upper * upper}</strong></section>
      <div class="rs-candidate-row">${candidates}</div>
    </div>`;
  }

  function renderAnswer(values) {
    return `<div class="rs-answer-scene">
      <div class="rs-answer-square"><span>${values.squareSide} ${lengthUnit()}</span><strong>${values.area}<small>${areaUnit()}</small></strong></div>
      <div class="rs-answer-lines">
        <p><span>✓</span>${tr(`正方形面积是${values.area}${areaUnit()}`, `The square's area is ${values.area} ${areaUnit()}`)}</p>
        <p><span>✓</span>${tr(`正方形边长是${values.squareSide}${lengthUnit()}`, `The square's side length is ${values.squareSide} ${lengthUnit()}`)}</p>
      </div>
    </div>`;
  }

  function renderReverseLength(values) {
    return `<div class="rs-reverse-scene">${piecesSvg(values, "reverse")}
      <div class="rs-dimension-equation"><span>${values.squareSide}</span><b>× ${values.factor}</b><strong>= ${values.originalLength} ${lengthUnit()}</strong></div>
    </div>`;
  }

  function renderReverseWidth(values) {
    const g = pieceGeometry(values);
    return `<div class="rs-width-scene">${piecesSvg(values, "plain")}
      <div class="rs-width-brace" style="--top:${g.originalY}px;--height:${Math.max(18, g.pieceHeight)}px"><span>${values.originalWidth} ${lengthUnit()}</span></div>
      <div class="rs-dimension-equation"><span>${values.squareSide}</span><b>÷ ${values.factor}</b><strong>= ${values.originalWidth} ${lengthUnit()}</strong></div>
    </div>`;
  }

  function renderVerify(values) {
    return `<div class="rs-verify-grid">
      <section><span class="rs-check-mark">✓</span><h3>${tr("检查原面积", "Check the original area")}</h3><strong>${values.originalLength} × ${values.originalWidth} = ${values.originalArea}</strong><p>${tr("与题目给出的面积相同", "Matches the given area")}</p></section>
      <section><span class="rs-check-mark">✓</span><h3>${tr("检查变成正方形", "Check the new square")}</h3><strong>${values.originalLength} ÷ ${values.factor} = ${values.transformedLength}</strong><strong>${values.originalWidth} × ${values.factor} = ${values.transformedWidth}</strong><p>${tr("两条边一样长", "The two sides are equal")}</p></section>
    </div>`;
  }

  function renderSquareTable(values) {
    return `<div class="rs-square-table">${values.squareTable.map((item, index) => `<div class="rs-square-cell ${item.value === values.squareSide ? "is-target" : ""}" style="--delay:${index * 45}ms"><span>${item.value} × ${item.value}</span><strong>${item.square}</strong></div>`).join("")}</div>`;
  }

  function renderOnesFilter(values) {
    const digitCells = Array.from({ length: 10 }, (_, digit) => {
      const squareDigit = (digit * digit) % 10;
      const active = values.possibleOnes.includes(digit);
      return `<div class="rs-digit-cell ${active ? "is-active" : ""}"><span>${digit} × ${digit}</span><strong>…${squareDigit}</strong></div>`;
    }).join("");
    const checks = values.rangeCandidates.map((candidate) => `<span class="rs-filter-check ${candidate === values.squareSide ? "is-match" : ""}">${candidate} × ${candidate} = ${candidate * candidate}${candidate === values.squareSide ? " ✓" : ""}</span>`).join("");
    return `<div class="rs-ones-filter"><div class="rs-digit-grid">${digitCells}</div><div class="rs-filter-result"><span>${tr(`面积个位：${values.resultOnes}`, `Area ones digit: ${values.resultOnes}`)}</span>${checks}</div></div>`;
  }

  function renderFastMethod(values) {
    const digitExamples = [
      { digits: 1, text: "1～9", bounds: "1×1 ～ 9×9" },
      { digits: 2, text: "10～99", bounds: "10×10 ～ 99×99" },
      { digits: 3, text: "100～999", bounds: "100×100 ～ 999×999" }
    ];
    return `<div class="rs-fast-method">
      <div class="rs-digit-bands">${digitExamples.map((item) => `<section class="${item.digits === values.sideDigits ? "is-current" : ""}"><span>${tr(`${item.digits}位数`, `${item.digits}-digit`)}</span><strong>${item.text}</strong><small>${item.bounds}</small></section>`).join("")}</div>
      <div class="rs-method-track"><span><b>1</b>${tr("定范围", "Find range")}</span><i>→</i><span><b>2</b>${tr("看个位", "Check ones")}</span><i>→</i><span><b>3</b>${tr("乘回验证", "Multiply back")}</span></div>
      <p>${tr(`本题：${Math.max(1, values.rangeStart)}～${values.rangeEnd} → 个位${values.possibleOnes.join("或")} → ${values.squareSide}`, `This problem: ${Math.max(1, values.rangeStart)}–${values.rangeEnd} → ones digit ${values.possibleOnes.join(" or ")} → ${values.squareSide}`)}</p>
    </div>`;
  }

  function renderSquareExamples(values, start, end) {
    const items = values.squareTable
      .filter((item) => item.value >= start && item.value <= end)
      .map((item, index) => {
        const relation = item.square === values.area ? "is-target" : item.square < values.area ? "is-below" : "is-above";
        const sign = item.square === values.area ? "✓" : item.square < values.area ? "↑" : "过了";
        return `<div class="rs-square-example ${relation}" style="--delay:${index * 55}ms"><span>${item.value} × ${item.value}</span><strong>${item.square}</strong><small>${language() === "zh-CN" ? sign : item.square === values.area ? "match" : item.square < values.area ? "keep going" : "too far"}</small></div>`;
      }).join("");
    return `<div class="rs-square-example-grid">${items}</div>`;
  }

  function renderRangeSearch(values) {
    const lower = Math.max(1, values.rangeStart);
    const upper = values.rangeEnd;
    const side = values.squareSide;
    return `<div class="rs-range-search-v2">
      <section><span>${lower} × ${lower}</span><strong>${lower * lower}</strong><small>${tr("还没到", "still below")}</small></section>
      <div class="rs-range-ruler"><span>${lower}</span><b style="--position:${upper === lower ? 50 : ((side - lower) / (upper - lower)) * 100}%">${side}</b><span>${upper}</span></div>
      <section><span>${upper} × ${upper}</span><strong>${upper * upper}</strong><small>${upper * upper === values.area ? tr("正好", "exact") : tr("到了或超过", "reaches or passes")}</small></section>
      <p>${tr(`只在 ${lower}～${upper} 之间找`, `Search only from ${lower} to ${upper}`)}</p>
    </div>`;
  }

  function continuitySvg(values) {
    const g = pieceGeometry(values);
    const side = number(values.squareSide);
    const factor = number(values.factor);
    const tensPart = Math.floor(values.squareSide / 10) * 10;
    const onesPart = values.squareSide - tensPart;
    const splitWidth = tensPart > 0 && onesPart > 0 ? g.squareSize * tensPart / values.squareSide : g.squareSize;
    const pieces = Array.from({ length: g.factor }, (_, index) => {
      const sourceX = g.originalX + index * g.pieceWidth;
      const dx = g.squareX - sourceX;
      const dy = index * g.pieceHeight;
      return `<g class="rs-continuity-piece ${index === 0 ? "is-key-piece" : ""}" data-piece="${index}" style="--dx:${dx}px;--dy:${dy}px;--piece-delay:${index * 125}ms">
        <rect x="${sourceX}" y="${g.originalY}" width="${g.pieceWidth}" height="${g.pieceHeight}" />
        <text x="${sourceX + g.pieceWidth / 2}" y="${g.originalY + g.pieceHeight / 2 + 5}">${index + 1}</text>
      </g>`;
    }).join("");
    const cuts = Array.from({ length: g.factor - 1 }, (_, index) => {
      const x = g.originalX + (index + 1) * g.pieceWidth;
      return `<line class="rs-continuity-cut" style="--cut-delay:${index * 90}ms" x1="${x}" y1="${g.originalY - 16}" x2="${x}" y2="${g.originalY + g.pieceHeight + 16}" />`;
    }).join("");
    const slots = Array.from({ length: g.factor }, (_, index) => `<rect class="rs-stack-slot" x="${g.squareX}" y="${g.squareY + index * g.pieceHeight}" width="${g.pieceWidth}" height="${g.pieceHeight}" />`).join("");
    return `<svg class="rs-continuity-svg" viewBox="0 0 900 430" role="img" aria-label="${tr("同一个长方形被切开并重新排成正方形", "The same rectangle is cut and rearranged into a square")}">
      <rect class="rs-original-ghost" x="${g.originalX}" y="${g.originalY}" width="${g.originalWidth}" height="${g.pieceHeight}" />
      <g class="rs-stack-slots">${slots}</g>
      <g class="rs-cut-guides">${cuts}</g>
      <g class="rs-continuity-pieces">${pieces}</g>
      <rect class="rs-source-outline" x="${g.originalX}" y="${g.originalY}" width="${g.originalWidth}" height="${g.pieceHeight}" />
      <rect class="rs-continuity-square-outline" x="${g.squareX}" y="${g.squareY}" width="${g.squareSize}" height="${g.squareSize}" />
      <g class="rs-area-split">
        <rect class="rs-split-tens" x="${g.squareX}" y="${g.squareY}" width="${splitWidth}" height="${g.squareSize}" />
        <rect class="rs-split-ones" x="${g.squareX + splitWidth}" y="${g.squareY}" width="${Math.max(0, g.squareSize - splitWidth)}" height="${g.squareSize}" />
        ${onesPart > 0 ? `<text x="${g.squareX + splitWidth / 2}" y="${g.squareY + g.squareSize / 2}">${side}×${tensPart}</text><text x="${g.squareX + splitWidth + (g.squareSize - splitWidth) / 2}" y="${g.squareY + g.squareSize / 2}">${side}×${onesPart}</text>` : ""}
      </g>
      <g class="rs-square-dimensions">
        <line x1="${g.squareX}" y1="${g.squareY - 22}" x2="${g.squareX + g.squareSize}" y2="${g.squareY - 22}" />
        <text x="${g.squareX + g.squareSize / 2}" y="${g.squareY - 31}">${tr(`长÷${factor} = ${side}${lengthUnit()}`, `length÷${factor} = ${side} ${lengthUnit()}`)}</text>
        <line x1="${g.squareX - 22}" y1="${g.squareY}" x2="${g.squareX - 22}" y2="${g.squareY + g.squareSize}" />
        <text class="is-vertical-label" x="${g.squareX - 36}" y="${g.squareY + g.squareSize / 2}">${tr(`宽×${factor} = ${side}${lengthUnit()}`, `width×${factor} = ${side} ${lengthUnit()}`)}</text>
      </g>
      <g class="rs-original-dimensions">
        <line x1="${g.originalX}" y1="${g.originalY + g.pieceHeight + 30}" x2="${g.originalX + g.originalWidth}" y2="${g.originalY + g.pieceHeight + 30}" />
        <text x="${g.originalX + g.originalWidth / 2}" y="${g.originalY + g.pieceHeight + 53}">${tr(`原来的长 ${values.originalLength}${lengthUnit()}`, `original length ${values.originalLength} ${lengthUnit()}`)}</text>
        <line x1="${g.originalX - 24}" y1="${g.originalY}" x2="${g.originalX - 24}" y2="${g.originalY + g.pieceHeight}" />
        <text x="${g.originalX - 32}" y="${g.originalY - 16}">${tr(`原宽 ${values.originalWidth}${lengthUnit()}`, `width ${values.originalWidth} ${lengthUnit()}`)}</text>
      </g>
      <text class="rs-continuity-area" x="${g.originalX + g.originalWidth / 2}" y="${g.originalY - 31}">${values.area} ${areaUnit()}</text>
      <text class="rs-continuity-caption" x="450" y="409">${tr(`始终是同一批 ${factor} 块纸片`, `Always the same ${factor} pieces`)}</text>
    </svg>`;
  }

  function geometryCallout(values, slide) {
    const factor = values.factor;
    const side = values.squareSide;
    const tensPart = Math.floor(side / 10) * 10;
    const onesPart = side - tensPart;
    if (slide.id === "read") return `<div class="rs-scene-card"><span>${tr("原长方形", "original rectangle")}</span><strong>${values.area} ${areaUnit()}</strong><small>${tr("先不猜长和宽", "No need to guess its dimensions yet")}</small></div>`;
    if (slide.id === "cut") return `<div class="rs-scene-card"><span>${tr("沿着长平均分", "split along the length")}</span><strong>${factor} ${tr("份", "parts")}</strong><small>${tr("每份一样大", "all parts are equal")}</small></div>`;
    if (slide.id === "focus") return `<div class="rs-scene-card is-gold"><span>${tr("只看金色这一份", "focus on the gold part")}</span><strong>${tr(`原长 ÷ ${factor}`, `length ÷ ${factor}`)}</strong><small>${tr("纸条本身没有变形", "the strip itself did not change")}</small></div>`;
    if (slide.id === "stack") {
      const meter = Array.from({ length: factor }, (_, index) => `<span style="--meter-delay:${index * 150}ms"><b>${index + 1}</b>${tr("个宽", "widths")}</span>`).join("");
      return `<div class="rs-stack-meter"><p>${tr("一块一块移到金色纸条下面", "Move the pieces under the gold strip one by one")}</p><div>${meter}</div><strong>${factor}${tr("个原宽", " original widths")} = ${tr(`原宽 × ${factor}`, `original width × ${factor}`)}</strong></div>`;
    }
    if (slide.id === "area") return `<div class="rs-area-count"><span>${tr(`原来：${factor}块`, `Before: ${factor} pieces`)}</span><b>=</b><span>${tr(`现在：${factor}块`, `Now: ${factor} pieces`)}</span><strong>${tr(`面积仍是 ${values.area} ${areaUnit()}`, `Area is still ${values.area} ${areaUnit()}`)}</strong></div>`;
    if (slide.id === "multiply") {
      if (tensPart > 0 && onesPart > 0) return `<div class="rs-calc-cards"><span>${side}×${tensPart}<b>= ${side * tensPart}</b></span><i>+</i><span>${side}×${onesPart}<b>= ${side * onesPart}</b></span><i>=</i><strong>${values.area}</strong></div>`;
      return `<div class="rs-calc-cards"><span>${side}×${side}</span><i>=</i><strong>${values.area}</strong></div>`;
    }
    if (slide.id === "answer") return `<div class="rs-answer-lines-v2"><p><span>✓</span>${tr(`正方形面积：${values.area}${areaUnit()}`, `Square area: ${values.area} ${areaUnit()}`)}</p><p><span>✓</span>${tr(`正方形边长：${side}${lengthUnit()}`, `Square side: ${side} ${lengthUnit()}`)}</p></div>`;
    if (slide.id === "reverse-length") return `<div class="rs-dimension-equation-v2"><span>${side}</span><b>× ${factor}</b><strong>= ${values.originalLength} ${lengthUnit()}</strong></div>`;
    if (slide.id === "reverse-width") return `<div class="rs-dimension-equation-v2"><span>${side}</span><b>÷ ${factor}</b><strong>= ${values.originalWidth} ${lengthUnit()}</strong></div>`;
    if (slide.id === "verify") return `<div class="rs-verify-compact"><p><span>✓</span><b>${values.originalLength} × ${values.originalWidth} = ${values.area}</b><small>${tr("原面积正确", "original area matches")}</small></p><p><span>✓</span><b>${values.originalLength} ÷ ${factor} = ${side}</b><small>${tr("新长正确", "new length matches")}</small></p><p><span>✓</span><b>${values.originalWidth} × ${factor} = ${side}</b><small>${tr("新宽正确", "new width matches")}</small></p></div>`;
    return "";
  }

  function renderSlideBody(values, slide) {
    if (slide.type === "examples-small") return renderSquareExamples(values, 1, 10);
    if (slide.type === "examples-large") return renderSquareExamples(values, 11, 20);
    if (slide.type === "range") return renderRangeSearch(values);
    if (slide.type === "ones-filter") return renderOnesFilter(values);
    if (slide.type === "fast-method") return renderFastMethod(values);
    return "";
  }

  function ensureStageShell() {
    if (stage.querySelector("[data-stage-shell]")) return;
    stage.innerHTML = `<article class="rs-slide" data-stage-shell>
      <header class="rs-slide-head"><div><p class="rs-slide-kicker" data-stage-kicker></p><h2 data-stage-title></h2></div><span class="rs-slide-number" data-stage-number></span></header>
      <div class="rs-stage-body rs-stage-body-v2">
        <div class="rs-continuity-scene" data-continuity-scene><div data-continuity-svg></div><div class="rs-geometry-callout" data-geometry-callout></div></div>
        <div class="rs-exploration-layer" data-exploration-layer hidden></div>
      </div>
    </article>`;
  }

  function renderStage(values, slide, slides, direction) {
    ensureStageShell();
    stage.querySelector("[data-stage-kicker]").textContent = slide.label;
    stage.querySelector("[data-stage-title]").textContent = slide.title;
    stage.querySelector("[data-stage-number]").textContent = `${slideIndex + 1}/${slides.length}`;

    const scene = stage.querySelector("[data-continuity-scene]");
    const exploration = stage.querySelector("[data-exploration-layer]");
    const geometryIds = new Set(["read", "cut", "focus", "stack", "area", "multiply", "answer", "reverse-length", "reverse-width", "verify"]);
    const isGeometry = geometryIds.has(slide.id);
    scene.hidden = !isGeometry;
    exploration.hidden = isGeometry;

    if (!isGeometry) {
      exploration.innerHTML = renderSlideBody(values, slide);
      return;
    }

    const signature = `${values.area}:${values.factor}:${language()}`;
    const svgHost = scene.querySelector("[data-continuity-svg]");
    if (svgHost.dataset.signature !== signature) {
      svgHost.innerHTML = continuitySvg(values);
      svgHost.dataset.signature = signature;
    }

    const stacked = ["stack", "area", "multiply", "answer"].includes(slide.id);
    const showCuts = ["cut", "focus", "reverse-length", "reverse-width", "verify"].includes(slide.id);
    const showFocus = ["focus", "stack", "area", "reverse-length", "reverse-width", "verify"].includes(slide.id);
    const showSquare = ["stack", "area", "multiply", "answer"].includes(slide.id);
    const showOriginalDimensions = ["reverse-length", "reverse-width", "verify"].includes(slide.id);
    const classes = ["rs-continuity-scene"];
    if (stacked) classes.push("is-stacked");
    if (showCuts) classes.push("show-cuts");
    if (showFocus) classes.push("show-focus");
    if (showSquare) classes.push("show-square");
    if (slide.id === "area") classes.push("show-ghost");
    if (slide.id === "multiply") classes.push("show-split");
    if (showOriginalDimensions) classes.push("show-original-dimensions");
    if (["stack", "area", "multiply", "answer"].includes(slide.id)) classes.push("show-square-dimensions");
    if (["read", "area"].includes(slide.id)) classes.push("show-area");
    if (slide.id === "verify") classes.push("show-checks");
    scene.className = classes.join(" ");
    scene.querySelectorAll("[data-piece]").forEach((piece, index) => {
      const order = direction >= 0 ? index : values.factor - 1 - index;
      piece.style.setProperty("--piece-delay", `${Math.max(0, order) * 125}ms`);
    });
    scene.querySelector("[data-geometry-callout]").innerHTML = geometryCallout(values, slide);
  }


  function slideHeader(slide, index, total) {
    return `<header class="rs-slide-head"><div><p class="rs-slide-kicker">${slide.label}</p><h2>${slide.title}</h2></div><span class="rs-slide-number">${index + 1}/${total}</span></header>`;
  }

  function renderBoard(slide) {
    board.innerHTML = `<p class="rs-board-label">${copy("currentQuestion")}</p><h2>${slide.question}</h2><p class="rs-board-lead">${slide.lead}</p><div class="rs-formula"><span class="rs-board-label">${copy("blackboard")}</span>${slide.formula.map((line) => `<span class="rs-formula-line">${line}</span>`).join("")}</div>`;
  }

  function renderProblemStrip(values) {
    app.querySelector("[data-problem-strip]").innerHTML = `<strong>${tr("一个长方形的面积是", "A rectangle has an area of")} <span>${values.area}</span> ${areaUnit()}</strong><span>${tr(`长除以${values.factor}，宽乘以${values.factor}`, `Divide the length by ${values.factor} and multiply the width by ${values.factor}`)}</span><strong>${tr("它变成正方形：面积和边长是多少？", "It becomes a square. What are its area and side length?")}</strong>`;
  }

  function renderStaticCopy(values) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy(node.dataset.copy); });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    renderProblemStrip(values);
  }

  function renderProgress(slides) {
    const dots = slides.map((slide, index) => `<span class="rs-progress-dot ${index < slideIndex ? "is-complete" : ""} ${index === slideIndex ? "is-current" : ""}" title="${slide.label}" ${index === slideIndex ? 'aria-current="step"' : ""}></span>`).join("");
    progress.innerHTML = `<strong class="rs-progress-current">${slideIndex + 1}. ${slides[slideIndex].label}</strong><div class="rs-progress-track">${dots}</div>`;
  }

  function renderControls(slides) {
    prevButton.disabled = slideIndex === 0;
    nextLabel.textContent = slideIndex === slides.length - 1 ? copy("replay") : copy("next");
    pageCount.textContent = copy("pageCount", { current: slideIndex + 1, total: slides.length });
  }

  function render() {
    const values = problem();
    if (!values.valid) return;
    const slides = buildSlides(values);
    slideIndex = Math.max(0, Math.min(slideIndex, slides.length - 1));
    const slide = slides[slideIndex];
    renderStaticCopy(values);
    renderProgress(slides);
    renderControls(slides);
    renderStage(values, slide, slides, slideIndex - renderedSlideIndex);
    renderBoard(slide);
    renderedSlideIndex = slideIndex;
  }

  function goNext() {
    const slides = buildSlides(problem());
    slideIndex = slideIndex === slides.length - 1 ? 0 : slideIndex + 1;
    render();
  }

  function goPrevious() {
    if (slideIndex === 0) return;
    slideIndex -= 1;
    render();
  }

  function openSettings() {
    app.querySelector("[data-setting='area']").value = state.area;
    app.querySelector("[data-setting='factor']").value = state.factor;
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function errorMessage(values) {
    if (values.reason === "invalid-area") return copy("invalidArea");
    if (values.reason === "invalid-factor") return copy("invalidFactor");
    if (values.reason === "not-square") return copy("notSquare");
    return copy("nonWholeWidth");
  }

  function applySettings() {
    const nextArea = app.querySelector("[data-setting='area']").value.trim();
    const nextFactor = app.querySelector("[data-setting='factor']").value.trim();
    const values = MathLabModels.geometry.rectangleToSquareState(nextArea, nextFactor);
    if (!values.valid) {
      settingsError.textContent = errorMessage(values);
      settingsError.hidden = false;
      return;
    }
    state.area = String(values.area);
    state.factor = String(values.factor);
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
