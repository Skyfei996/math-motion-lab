(function () {
  "use strict";

  const copy = {
    "zh-CN": {
      back: "返回目录", eyebrow: "数与规律", title: "6、10、14、18阶幻方：四块拼接与换位法",
      settings: "选择阶数", settingsTitle: "选择一个 6、10、14、18 阶方阵", orderLabel: "方格边长",
      settingsNote: "更换后会回到读题页，重新生成小方阵、四块和全部换位。", cancel: "取消", apply: "应用",
      questionLabel: "本页问题", previous: "上一步", next: "下一步", replay: "重新开始",
      introQuestion: "知道什么？要完成什么？", introLead: "先读完整题目；空方格不会提前泄露方法。",
      sumQuestion: "每一条线要凑成多少？", sumLead: "先求全部数字的总和，再平均分给每一行。",
      splitQuestion: "为什么先把大方阵分成四块？", splitLead: "边长的一半是奇数，可以先在 A 区做好小幻方。",
      seedQuestion: "小奇数阶方阵怎样在 A 区铺开？", seedLead: "沿用阶梯法，每次铺入一组连续数字。",
      blocksQuestion: "相同排列怎样变成 A、B、C、D 四块？", blocksLead: "排列不变，只给每一块加上不同的号码段。",
      observeQuestion: "四块拼好后，哪些线已经平衡？", observeLead: "先比较一对上下行，再看同一列。",
      measureQuestion: "为什么左边换这些格、右边少换一格？", measureLead: "用一行的差额，算清每次交换增加或减少多少。",
      compareQuestion: "6、10、14、18 阶的换位带怎样一起变化？", compareLead: "小方阵每大一圈，左右换位格各增加一个。",
      ordinaryQuestion: "普通的上下行怎样按同一规则交换？", ordinaryLead: "每次只处理一对上下行，数字沿同一列移到对方位置。",
      specialQuestion: "中间这对行为什么要换另一组格子？", specialLead: "不先换错再恢复；第一格不换，改换小方阵中心格。",
      offsetProofQuestion: "一次上下换位，为什么总是增加或减少固定的数？", offsetProofLead: "把画面拨回四块刚拼好的状态，只比较两个对应位置。",
      balanceProofQuestion: "为什么只换这些列，就能同时修正一对行？", balanceProofLead: "交换次数来自行的差额；同列总和始终不变。",
      diagonalProofQuestion: "为什么中间行必须用中心格替换第一格？", diagonalProofLead: "交换数量不变，但中心格要负责修正两条对角线。",
      verifyQuestion: "横、竖、斜真的都达到幻和了吗？", verifyLead: "逐条高亮检查，最后才写出完整结论。",
      seedAction: "铺下一组", blockAction: "拼入下一块", rowAction: "交换下一对行", specialAction: "执行中间行换位",
      check: "检查下一条线", row: "第 {n} 行", column: "第 {n} 列", diagonal: "主对角线", antiDiagonal: "另一条对角线"
    },
    "en-US": {
      back: "Back to catalog", eyebrow: "Numbers and patterns", title: "6-, 10-, 14-, and 18-Order Magic Squares: Four-Block Method",
      settings: "Choose order", settingsTitle: "Choose a 6-, 10-, 14-, or 18-order square", orderLabel: "Side length",
      settingsNote: "Changing the order returns to the opening and rebuilds the mini square, blocks, and swaps.", cancel: "Cancel", apply: "Apply",
      questionLabel: "Question", previous: "Previous", next: "Next", replay: "Replay",
      introQuestion: "What is known, and what must be made equal?", introLead: "Read the whole task first; the empty board gives away no method.",
      sumQuestion: "What must every line total?", sumLead: "Find the total of all numbers, then share it equally among the rows.",
      splitQuestion: "Why divide the large square into four blocks?", splitLead: "Half the side length is odd, so a mini magic square can begin in block A.",
      seedQuestion: "How does the mini odd square grow inside block A?", seedLead: "Reuse the staircase method, one group of consecutive numbers at a time.",
      blocksQuestion: "How does one arrangement become blocks A, B, C, and D?", blocksLead: "Keep the arrangement and change only the number range in each block.",
      observeQuestion: "After joining the blocks, which lines already balance?", observeLead: "Compare one upper-lower row pair, then inspect a column.",
      measureQuestion: "Why swap these left cells and one fewer on the right?", measureLead: "Use one row deficit and measure what each swap adds or removes.",
      compareQuestion: "How do the swap bands grow at orders 6, 10, 14, and 18?", compareLead: "Each larger mini square adds one left and one right swap position.",
      ordinaryQuestion: "How do ordinary upper-lower row pairs repeat the rule?", ordinaryLead: "Handle one row pair at a time; numbers move to each other in the same column.",
      specialQuestion: "Why does the middle row pair swap a different set of cells?", specialLead: "Do not swap and undo; keep the first cell and swap the mini-square centre instead.",
      offsetProofQuestion: "Why does one vertical swap always add or remove a fixed amount?", offsetProofLead: "Rewind to the four assembled blocks and compare two matching positions.",
      balanceProofQuestion: "Why do only these columns repair both rows?", balanceProofLead: "The swap counts match the row deficit, while each column total stays fixed.",
      diagonalProofQuestion: "Why must the middle row replace the first cell with the centre cell?", diagonalProofLead: "The number of swaps stays fixed, but the centre must repair both diagonals.",
      verifyQuestion: "Do rows, columns, and diagonals all reach the magic sum?", verifyLead: "Highlight one line at a time, then state the complete conclusion.",
      seedAction: "Place next group", blockAction: "Add next block", rowAction: "Swap next row pair", specialAction: "Swap the middle row pair",
      check: "Check next line", row: "Row {n}", column: "Column {n}", diagonal: "Main diagonal", antiDiagonal: "Other diagonal"
    }
  };

  const slides = ["intro", "sum", "split", "seed", "blocks", "observe", "measure", "compare", "ordinary", "special", "offsetProof", "balanceProof", "diagonalProof", "verify"];
  const app = document.querySelector("[data-app]");
  const stage = document.querySelector("[data-stage]");
  const question = document.querySelector("[data-question]");
  const lead = document.querySelector("[data-lead]");
  const progress = document.querySelector("[data-progress]");
  const pageCount = document.querySelector("[data-page-count]");
  const previous = document.querySelector("[data-action='prev']");
  const next = document.querySelector("[data-action='next']");
  const nextLabel = document.querySelector("[data-next-label]");
  const dialog = document.querySelector("[data-dialog]");
  const state = {
    order: 6,
    slide: 0,
    unlocked: 0,
    seedGroups: 0,
    blocksShown: 1,
    ordinaryStep: 0,
    specialDone: false,
    line: 0,
    busy: false,
    movingSwaps: [],
    revealKeys: new Set()
  };

  const lang = () => MathLab.getLanguage();
  const t = (key) => copy[lang()][key] || key;
  const tr = (zh, en) => lang() === "zh-CN" ? zh : en;
  const model = () => MathLabModels.patterns.magicSquareSinglyEvenState(state.order);
  const keyOf = ([row, column]) => `${row}-${column}`;
  const blankCells = (order) => Array.from({ length: order }, () => Array(order).fill(null));
  const cloneCells = (cells) => cells.map((row) => [...row]);

  stage.innerHTML = `
    <div class="se-scene">
      <div class="se-board-wrap" data-board>
        <div class="se-grid" data-grid></div>
        <div class="se-divider" aria-hidden="true"></div>
        <div class="se-block-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span><span>D</span></div>
      </div>
      <section class="se-evidence" data-evidence aria-live="polite"></section>
    </div>`;

  const board = stage.querySelector("[data-board]");
  const gridElement = stage.querySelector("[data-grid]");
  const evidence = stage.querySelector("[data-evidence]");

  function applySwaps(source, swaps) {
    const cells = cloneCells(source);
    swaps.forEach(({ from, to }) => {
      [cells[from[0]][from[1]], cells[to[0]][to[1]]] = [cells[to[0]][to[1]], cells[from[0]][from[1]]];
    });
    return cells;
  }

  function cellsAfterOrdinary(square, count) {
    return applySwaps(square.initialCells, square.ordinarySwapRows.slice(0, count).flatMap((item) => item.swaps));
  }

  function cellsAfterConstruction(square) {
    const ordinary = cellsAfterOrdinary(square, state.ordinaryStep);
    return state.specialDone ? applySwaps(ordinary, square.specialSwapRow.swaps) : ordinary;
  }

  function seedCells(square) {
    const cells = blankCells(square.order);
    const visible = state.seedGroups * square.half;
    square.baseMoves.slice(0, visible).forEach((move) => { cells[move.row][move.column] = move.value; });
    return cells;
  }

  function blockCells(square) {
    const cells = blankCells(square.order);
    const visibleBlocks = ["a", "b", "c", "d"].slice(0, state.blocksShown);
    for (let row = 0; row < square.order; row += 1) {
      for (let column = 0; column < square.order; column += 1) {
        const blockName = row < square.half ? (column < square.half ? "a" : "b") : (column < square.half ? "c" : "d");
        if (visibleBlocks.includes(blockName)) cells[row][column] = square.initialCells[row][column];
      }
    }
    return cells;
  }

  function stageCells(square, slide) {
    if (["intro", "sum", "split"].includes(slide)) return blankCells(square.order);
    if (slide === "seed") return seedCells(square);
    if (slide === "blocks") return blockCells(square);
    if (["ordinary", "special"].includes(slide)) return cellsAfterConstruction(square);
    if (slide === "diagonalProof" || slide === "verify") return square.cells;
    return square.initialCells;
  }

  function currentSwaps(square, slide) {
    if (state.busy) return state.movingSwaps;
    if (slide === "ordinary") return square.ordinarySwapRows[state.ordinaryStep]?.swaps || [];
    if (slide === "special" && !state.specialDone) return square.specialSwapRow.swaps;
    return [];
  }

  function completedSwaps(square, slide) {
    if (!['ordinary', 'special'].includes(slide)) return [];
    const swaps = square.ordinarySwapRows.slice(0, state.ordinaryStep).flatMap((item) => item.swaps);
    if (slide === "special" && state.specialDone) swaps.push(...square.specialSwapRow.swaps);
    return swaps;
  }

  function movementMap(swaps) {
    const map = new Map();
    swaps.forEach(({ from, to }) => { map.set(keyOf(from), to); map.set(keyOf(to), from); });
    return map;
  }

  function renderGrid(square, slide) {
    const cells = stageCells(square, slide);
    const current = new Set(currentSwaps(square, slide).flatMap((item) => [keyOf(item.from), keyOf(item.to)]));
    const completed = new Set(completedSwaps(square, slide).flatMap((item) => [keyOf(item.from), keyOf(item.to)]));
    const moving = movementMap(state.movingSwaps);
    const checkedLine = slide === "verify" ? square.lines[state.line % square.lines.length] : null;
    const checked = new Set((checkedLine?.coordinates || []).map(keyOf));
    const proofLeft = new Set();
    const proofRight = new Set();
    const proofSkip = new Set();
    const proofCenter = new Set();
    const proofMain = new Set();
    const proofAnti = new Set();
    const focusRows = new Set();
    if (slide === "observe" || slide === "measure") { focusRows.add(0); focusRows.add(square.half); }
    if (slide === "ordinary") {
      const row = square.ordinarySwapRows[Math.min(state.ordinaryStep, square.ordinarySwapRows.length - 1)]?.row;
      if (Number.isInteger(row)) { focusRows.add(row); focusRows.add(row + square.half); }
    }
    if (slide === "special") { focusRows.add(square.band); focusRows.add(square.band + square.half); }
    if (slide === "offsetProof") {
      [[0, 0], [square.half, 0]].forEach((cell) => proofLeft.add(keyOf(cell)));
      [[0, square.order - 1], [square.half, square.order - 1]].forEach((cell) => proofRight.add(keyOf(cell)));
    }
    if (slide === "balanceProof") {
      square.ordinarySwapRows[0].swaps.forEach((swap) => {
        const target = swap.from[1] < square.half ? proofLeft : proofRight;
        target.add(keyOf(swap.from));
        target.add(keyOf(swap.to));
      });
    }
    if (slide === "diagonalProof") {
      focusRows.add(square.band);
      focusRows.add(square.band + square.half);
      for (let index = 0; index < square.order; index += 1) {
        proofMain.add(`${index}-${index}`);
        proofAnti.add(`${index}-${square.order - index - 1}`);
      }
      [[square.band, 0], [square.band + square.half, 0]].forEach((cell) => proofSkip.add(keyOf(cell)));
      [[square.band, square.band], [square.band + square.half, square.band]].forEach((cell) => proofCenter.add(keyOf(cell)));
    }
    const showBlocks = !["intro", "sum"].includes(slide);
    const showDivider = !["intro", "sum"].includes(slide);
    const size = square.order >= 18 ? ".68rem" : square.order >= 14 ? ".83rem" : square.order >= 10 ? "1rem" : "1.25rem";

    gridElement.style.setProperty("--order", square.order);
    gridElement.style.setProperty("--number-size", size);
    gridElement.setAttribute("aria-label", `${square.order} by ${square.order} magic square`);
    board.classList.toggle("show-divider", showDivider);
    board.classList.toggle("show-labels", showBlocks);
    board.classList.toggle("is-dense", square.order >= 10);
    board.querySelector(".se-block-labels").hidden = !showBlocks;

    gridElement.innerHTML = cells.map((rowValues, row) => rowValues.map((value, column) => {
      const key = `${row}-${column}`;
      const blockName = row < square.half ? (column < square.half ? "a" : "b") : (column < square.half ? "c" : "d");
      const source = moving.get(key);
      const moveX = source ? source[1] - column : 0;
      const moveY = source ? source[0] - row : 0;
      return `<div class="se-cell ${showBlocks ? `is-${blockName}` : ""} ${value == null ? "is-empty" : ""} ${focusRows.has(row) ? "is-row-focus" : ""} ${current.has(key) ? "is-current" : ""} ${completed.has(key) ? "is-swapped" : ""} ${moving.has(key) ? "is-moving" : ""} ${checked.has(key) ? "is-checked" : ""} ${proofLeft.has(key) ? "is-proof-left" : ""} ${proofRight.has(key) ? "is-proof-right" : ""} ${proofMain.has(key) ? "is-proof-main" : ""} ${proofAnti.has(key) ? "is-proof-anti" : ""} ${proofSkip.has(key) ? "is-proof-skip" : ""} ${proofCenter.has(key) ? "is-proof-center" : ""} ${state.revealKeys.has(key) ? "is-reveal" : ""}" style="--move-x:${moveX};--move-y:${moveY}">${value ?? ""}</div>`;
    }).join("")).join("");
  }

  function lineName(line) {
    if (line.type === "row") return t("row").replace("{n}", line.index + 1);
    if (line.type === "column") return t("column").replace("{n}", line.index + 1);
    return line.index === 0 ? t("diagonal") : t("antiDiagonal");
  }

  function formula(text, tone = "") { return `<p class="se-formula ${tone}">${text}</p>`; }
  function actionButton(action, label, disabled = false) { return `<button class="se-stage-button" type="button" data-stage-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>`; }
  function sumRow(cells, row) { return cells[row].reduce((total, value) => total + value, 0); }

  function blockRanges(square) {
    const area = square.half ** 2;
    return [
      ["A", 1, area],
      ["B", 2 * area + 1, 3 * area],
      ["C", 3 * area + 1, 4 * area],
      ["D", area + 1, 2 * area]
    ];
  }

  function comparisonRows() {
    return [6, 10, 14, 18].map((order) => {
      const square = MathLabModels.patterns.magicSquareSinglyEvenState(order);
      return `<div class="se-compare-row ${order === state.order ? "is-active" : ""}"><b>${order} × ${order}</b><span>${tr("小方阵", "mini")} ${square.half} × ${square.half}</span><span>${tr("左换", "left")} ${square.band}</span><span>${tr("右换", "right")} ${square.rightBand}</span></div>`;
    }).join("");
  }

  function renderEvidence(square, slide) {
    const baseMagic = (square.half * (square.half ** 2 + 1)) / 2;
    const area = square.half ** 2;
    if (slide === "intro") return `<div class="se-copy"><p>${tr(`把 <strong>1 到 ${square.order ** 2}</strong> 分别填入一个 <strong>${square.order} × ${square.order}</strong> 方格。每一行、每一列和两条对角线上的数相加，所得的和都要相等。`, `Put <strong>1 through ${square.order ** 2}</strong> into a <strong>${square.order} by ${square.order}</strong> square. Every row, column, and both diagonals must have the same sum.`)}</p><p class="se-note">${tr("请先复述：知道什么？要找什么？", "Restate what is known and what must be found.")}</p></div>`;
    if (slide === "sum") return `<div class="se-copy is-centered"><p>${tr("所有数字先合在一起，再平均分给每一行。", "Combine all the numbers, then share the total equally among the rows.")}</p>${formula(`1 + 2 + … + ${square.order ** 2} = ${square.totalSum}`)}${formula(`${square.totalSum} ÷ ${square.order} = <strong>${square.magicSum}</strong>`, "is-gold")}</div>`;
    if (slide === "split") return `<div class="se-copy"><p class="se-big-equation">${square.order} = 2 × ${square.half}</p><p>${tr(`${square.half} 是奇数。先在左上角 A 区做一张 ${square.half} × ${square.half} 小幻方，再把同一排列带到另外三块。`, `${square.half} is odd. First build a ${square.half} by ${square.half} mini magic square in block A, then carry its arrangement into the other three blocks.`)}</p></div>`;
    if (slide === "seed") return `<div class="se-copy"><p>${tr(`阶梯法把连续数字每 ${square.half} 个分成一组。每点一次，下一组沿同一条右上阶梯就位。`, `The staircase method groups consecutive numbers in sets of ${square.half}. Each click places the next group along the same up-right track.`)}</p><div class="se-status-line"><b>${state.seedGroups} / ${square.half}</b><span>${tr("组已铺入 A 区", "groups placed in block A")}</span></div>${state.seedGroups === square.half ? formula(`${tr("小方阵幻和", "Mini-square magic sum")} = ${baseMagic}`, "is-success") : actionButton("seed", t("seedAction"), state.busy)}</div>`;
    if (slide === "blocks") return `<div class="se-copy"><div class="se-range-list">${blockRanges(square).map(([name, start, end], index) => `<span class="is-${name.toLowerCase()} ${index < state.blocksShown ? "is-visible" : ""}"><b>${name}</b>${start}–${end}</span>`).join("")}</div><p>${tr("四块保留完全相同的排列，只改变每个位置所用的号码段。", "All four blocks keep exactly the same arrangement; only their number ranges change.")}</p><div class="se-status-line"><b>${state.blocksShown} / 4</b><span>${tr("块已拼入", "blocks assembled")}</span></div>${state.blocksShown < 4 ? actionButton("block", t("blockAction"), state.busy) : formula(`${tr("第一行现在是", "The first row is now")} ${sumRow(square.initialCells, 0)} ≠ ${square.magicSum}`, "is-warning")}</div>`;
    if (slide === "observe") return `<div class="se-copy"><p>${tr("四块拼好后，每一列已经达到幻和；但上半行偏小、下半行偏大。", "After assembly, every column already reaches the magic sum, but upper rows are too small and lower rows are too large.")}</p><div class="se-balance-pair"><span>${tr("上半行", "Upper row")}<b>${square.rowBalance.initialUpperSum}</b></span><span class="is-target">${tr("目标", "Target")}<b>${square.magicSum}</b></span><span>${tr("下半行", "Lower row")}<b>${square.rowBalance.initialLowerSum}</b></span></div>${formula(`${tr("同一列上下换位 → 列的总和不变", "Swap vertically in one column → its total stays fixed")}`, "is-success")}</div>`;
    if (slide === "measure") {
      const additions = Array.from({ length: square.rowBalance.leftCount }, () => `+ ${square.rowBalance.leftChange}`).join(" ");
      const subtractions = Array.from({ length: square.rowBalance.rightCount }, () => `− ${square.rowBalance.rightChange}`).join(" ");
      return `<div class="se-copy"><p>${tr(`左侧每换一格，上半行增加 ${square.rowBalance.leftChange}；右侧每换一格，上半行减少 ${square.rowBalance.rightChange}。`, `Each left swap adds ${square.rowBalance.leftChange} to the upper row; each right swap removes ${square.rowBalance.rightChange}.`)}</p>${formula(`${square.rowBalance.initialUpperSum} ${additions} ${subtractions} = <strong>${square.magicSum}</strong>`, "is-gold")}<p class="se-rule-line">${tr(`所以每对行：左换 ${square.band} 格，右换 ${square.rightBand} 格。`, `So each row pair swaps ${square.band} left cell${square.band === 1 ? "" : "s"} and ${square.rightBand} right cell${square.rightBand === 1 ? "" : "s"}.`)}</p></div>`;
    }
    if (slide === "compare") return `<div class="se-copy"><p>${tr("不是死记四套方法：小方阵每大 2，左边和右边都多换一格。", "These are not four separate recipes: whenever the mini square grows by 2, both swap counts grow by 1.")}</p><div class="se-compare">${comparisonRows()}</div></div>`;
    if (slide === "ordinary") {
      const total = square.ordinarySwapRows.length;
      const active = square.ordinarySwapRows[Math.min(state.ordinaryStep, total - 1)];
      const before = cellsAfterOrdinary(square, Math.min(state.ordinaryStep, total));
      const row = active?.row ?? 0;
      return `<div class="se-copy"><p>${state.ordinaryStep < total ? tr(`现在处理第 ${row + 1} 行和第 ${row + square.half + 1} 行。`, `Now handle rows ${row + 1} and ${row + square.half + 1}.`) : tr("所有普通行已经按同一规则完成。", "Every ordinary row pair now follows the same rule.")}</p><div class="se-status-line"><b>${state.ordinaryStep} / ${total}</b><span>${tr("对普通行已交换", "ordinary row pairs swapped")}</span></div>${state.ordinaryStep < total ? `${formula(`${sumRow(before, row)} ↕ ${sumRow(before, row + square.half)} → ${square.magicSum} / ${square.magicSum}`)}${actionButton("ordinary", t("rowAction"), state.busy)}` : formula(`${tr("普通行全部达到", "All ordinary rows reach")} ${square.magicSum}`, "is-success")}</div>`;
    }
    if (slide === "special") {
      const row = square.specialSwapRow.row;
      const before = cellsAfterOrdinary(square, square.ordinarySwapRows.length);
      const after = applySwaps(before, square.specialSwapRow.swaps);
      return `<div class="se-copy"><p>${tr(`中间这对行保留左起第一格，改换小方阵中心格；右侧仍按原规则。`, `For the middle row pair, keep the first left cell and swap the mini-square centre instead; the right side keeps the same rule.`)}</p><div class="se-special-rule"><span class="is-stay">${tr("第一格不换", "Keep first cell")}</span><span>→</span><span class="is-swap">${tr("改换中心格", "Swap centre cell")}</span></div>${formula(`${sumRow(state.specialDone ? after : before, row)} / ${sumRow(state.specialDone ? after : before, row + square.half)} ${state.specialDone ? `= ${square.magicSum}` : `→ ${square.magicSum}`}`, state.specialDone ? "is-success" : "")}${state.specialDone ? `<p class="se-note">${tr("中间行已就位；接下来回看这套换位为什么成立。", "The middle rows are in place; next, rewind and explain why the swaps work.")}</p>` : actionButton("special", t("specialAction"), state.busy)}</div>`;
    }
    if (slide === "offsetProof") {
      const leftTop = square.initialCells[0][0];
      const leftBottom = square.initialCells[square.half][0];
      const rightTop = square.initialCells[0][square.order - 1];
      const rightBottom = square.initialCells[square.half][square.order - 1];
      return `<div class="se-copy"><p>${tr(`每块有 ${area} 格。四块同一位置的基础排列相同，只是整块增加了不同的号码段。`, `Each block has ${area} cells. Matching positions share the same base arrangement; only the block offset changes.`)}</p><div class="se-proof-pairs"><div class="se-proof-pair is-left"><b>${tr("左侧 A ↕ C", "Left A ↕ C")}</b><span>${leftTop} ↕ ${leftBottom}</span><strong>${tr("上半行", "Upper row")} +${square.rowBalance.leftChange}</strong></div><div class="se-proof-pair is-right"><b>${tr("右侧 B ↕ D", "Right B ↕ D")}</b><span>${rightTop} ↕ ${rightBottom}</span><strong>${tr("上半行", "Upper row")} −${square.rowBalance.rightChange}</strong></div></div>${formula(`${tr("左侧固定差", "Fixed left gap")} = 3 × ${area}；${tr("右侧固定差", "fixed right gap")} = ${area}`, "is-gold")}</div>`;
    }
    if (slide === "balanceProof") {
      const deficit = square.magicSum - square.rowBalance.initialUpperSum;
      const leftTop = square.initialCells[0][0];
      const leftBottom = square.initialCells[square.half][0];
      return `<div class="se-copy"><p>${tr(`上半行还缺 ${deficit}。蓝色左换负责增加，金色右换负责回调，次数刚好补齐这个差额。`, `The upper row is short by ${deficit}. Blue left swaps add, and gold right swaps trim the excess by exactly the needed amount.`)}</p>${formula(`${square.rowBalance.leftChange} × ${square.band} − ${square.rowBalance.rightChange} × ${square.rightBand} = <strong>${deficit}</strong>`, "is-gold")}${formula(`${leftTop} + ${leftBottom} = ${leftBottom} + ${leftTop}`, "is-success")}<p class="se-note">${tr("同一列里的两个数只交换次序，所以列的总和不会改变。", "The two numbers only reverse order inside one column, so its total cannot change.")}</p></div>`;
    }
    if (slide === "diagonalProof") {
      const ordinaryEnd = square.band;
      const specialStart = 2;
      const specialEnd = square.band + 1;
      return `<div class="se-copy"><div class="se-proof-legend"><span class="is-main">${tr("主对角线", "Main diagonal")}</span><span class="is-anti">${tr("另一条对角线", "Other diagonal")}</span></div><p>${tr(`普通规则会换左第 1–${ordinaryEnd} 格；中间行改换第 ${specialStart}–${specialEnd} 格。`, `The ordinary rule swaps left positions 1–${ordinaryEnd}; the middle row uses positions ${specialStart}–${specialEnd}.`)}</p><div class="se-special-rule"><span class="is-stay">${tr("第1格保留", "Keep position 1")}</span><span>→</span><span class="is-swap">${tr(`加入中心第${specialEnd}格`, `Include centre ${specialEnd}`)}</span></div>${formula(`${tr("左侧仍然换", "Left swaps still use")} ${square.band} ${tr("格：", "cells:")} ${square.rowBalance.leftChange} × ${square.band}`, "is-gold")}<p class="se-note">${tr("交换数量没变，所以行和、列和仍正确；中心格同时落在两条大对角线的路径上，负责把斜线也校正。", "The swap count is unchanged, so rows and columns stay correct. The centre pair lies on the two large diagonal paths and repairs them too.")}</p></div>`;
    }
    const line = square.lines[state.line % square.lines.length];
    const lineFormula = square.order >= 10 ? `${tr("高亮线的数相加", "Highlighted line total")} = <strong>${line.sum}</strong>` : `${line.values.join(" + ")} = <strong>${line.sum}</strong>`;
    return `<div class="se-copy"><span class="se-check-name">${lineName(line)}</span>${formula(lineFormula, "is-success")}<p class="se-answer">${tr(`完成：这是一个 ${square.order} 阶幻方，每一行、每一列和两条对角线都等于 ${square.magicSum}。`, `Complete: this is an order-${square.order} magic square. Every row, column, and both diagonals total ${square.magicSum}.`)}</p>${actionButton("line", t("check"))}</div>`;
  }

  function isReady(square, slide) {
    if (slide === "seed") return state.seedGroups === square.half;
    if (slide === "blocks") return state.blocksShown === 4;
    if (slide === "ordinary") return state.ordinaryStep === square.ordinarySwapRows.length;
    if (slide === "special") return state.specialDone;
    return true;
  }

  function render() {
    const square = model();
    const slide = slides[state.slide];
    document.documentElement.lang = lang();
    document.title = `${t("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = t(node.dataset.copy); });
    question.textContent = t(`${slide}Question`);
    lead.textContent = t(`${slide}Lead`);
    renderGrid(square, slide);
    evidence.innerHTML = renderEvidence(square, slide);
    previous.disabled = state.slide === 0 || state.busy;
    next.disabled = state.busy || !isReady(square, slide);
    nextLabel.textContent = state.slide === slides.length - 1 ? t("replay") : t("next");
    pageCount.textContent = `${state.slide + 1} / ${slides.length}`;
    progress.innerHTML = slides.map((_, index) => `<button class="se-dot ${index === state.slide ? "is-current" : ""} ${index < state.slide ? "is-done" : ""}" type="button" data-action="jump" data-index="${index}" aria-label="${index + 1}/${slides.length}" ${index > state.unlocked || state.busy ? "disabled" : ""}>${index < state.slide ? "✓" : index + 1}</button>`).join("");
  }

  function clearLocalMotion(delay = 460) {
    window.setTimeout(() => {
      state.busy = false;
      state.movingSwaps = [];
      state.revealKeys = new Set();
      stage.querySelectorAll(".is-moving,.is-reveal").forEach((cell) => cell.classList.remove("is-moving", "is-reveal"));
      render();
    }, delay);
  }

  function seedNext(square) {
    if (state.busy || state.seedGroups >= square.half) return;
    const start = state.seedGroups * square.half;
    const moves = square.baseMoves.slice(start, start + square.half);
    state.seedGroups += 1;
    state.revealKeys = new Set(moves.map((move) => `${move.row}-${move.column}`));
    state.busy = true;
    render();
    clearLocalMotion(380);
  }

  function addBlock(square) {
    if (state.busy || state.blocksShown >= 4) return;
    const blockIndex = state.blocksShown;
    const blockRow = blockIndex >= 2 ? 1 : 0;
    const blockColumn = blockIndex % 2;
    state.blocksShown += 1;
    state.revealKeys = new Set();
    for (let row = 0; row < square.half; row += 1) {
      for (let column = 0; column < square.half; column += 1) state.revealKeys.add(`${blockRow * square.half + row}-${blockColumn * square.half + column}`);
    }
    state.busy = true;
    render();
    clearLocalMotion(380);
  }

  function swapOrdinary(square) {
    if (state.busy || state.ordinaryStep >= square.ordinarySwapRows.length) return;
    state.movingSwaps = square.ordinarySwapRows[state.ordinaryStep].swaps;
    state.ordinaryStep += 1;
    state.busy = true;
    render();
    clearLocalMotion();
  }

  function swapSpecial(square) {
    if (state.busy || state.specialDone) return;
    state.movingSwaps = square.specialSwapRow.swaps;
    state.specialDone = true;
    state.busy = true;
    render();
    clearLocalMotion();
  }

  function resetLesson(order = state.order) {
    state.order = order;
    state.slide = 0;
    state.unlocked = 0;
    state.seedGroups = 0;
    state.blocksShown = 1;
    state.ordinaryStep = 0;
    state.specialDone = false;
    state.line = 0;
    state.busy = false;
    state.movingSwaps = [];
    state.revealKeys = new Set();
  }

  function move(delta) {
    const square = model();
    if (state.busy) return;
    if (delta > 0 && !isReady(square, slides[state.slide])) return;
    if (state.slide === slides.length - 1 && delta > 0) {
      resetLesson();
      render();
      return;
    }
    state.slide = Math.max(0, Math.min(slides.length - 1, state.slide + delta));
    state.unlocked = Math.max(state.unlocked, state.slide);
    render();
  }

  document.addEventListener("click", (event) => {
    const actionNode = event.target.closest("[data-action]");
    if (actionNode) {
      const action = actionNode.dataset.action;
      if (action === "next") move(1);
      if (action === "prev") move(-1);
      if (action === "jump" && !actionNode.disabled) { state.slide = Number(actionNode.dataset.index); render(); }
      if (action === "settings") { document.querySelector("[data-order]").value = state.order; dialog.showModal(); }
      if (action === "close") dialog.close();
      if (action === "apply") { resetLesson(Number(document.querySelector("[data-order]").value)); dialog.close(); render(); }
      return;
    }
    const action = event.target.closest("[data-stage-action]")?.dataset.stageAction;
    const square = model();
    if (action === "seed") seedNext(square);
    if (action === "block") addBlock(square);
    if (action === "ordinary") swapOrdinary(square);
    if (action === "special") swapSpecial(square);
    if (action === "line") { state.line = (state.line + 1) % square.lines.length; render(); }
  });

  stage.addEventListener("click", (event) => {
    if (!event.target.closest("button") && isReady(model(), slides[state.slide]) && state.slide < slides.length - 1) move(1);
  });

  document.addEventListener("keydown", (event) => {
    if (dialog.open || /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName || "")) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); move(1); }
  });

  MathLab.bindLanguageToggle(render);
  render();
})();
