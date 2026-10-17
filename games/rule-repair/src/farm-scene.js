import {
  RULE_ORDER,
  completedPairs,
  currentLegComparison,
  currentRabbitCount,
  currentTrialLegs,
  transferComplete
} from "./game-state.js";

const RULE_COPY = Object.freeze({
  baseline: { title: "全部暂定为鸡", short: "全设为鸡" },
  difference: { title: "实际腿数减去鸡腿", short: "找腿数差" },
  pair: { title: "每两条腿分成一组", short: "两条一组" },
  repair: { title: "一组修正一只兔", short: "一组一兔" }
});

const SHUFFLED_RULES = ["repair", "difference", "baseline", "pair"];

function legSvg() {
  return `
    <svg viewBox="0 0 58 86" aria-hidden="true">
      <path class="paper-leg" d="M18 5h24l-3 44 11 19-9 12-13-16-10 17-10-11 11-22z" />
      <path class="paper-leg-fold" d="M19 48h20M28 64l-9-16m9 16 11-15" />
    </svg>`;
}

function animalSvg(type) {
  return `
    <svg class="animal-svg" viewBox="0 0 100 138" aria-hidden="true">
      <ellipse class="animal-shadow" cx="50" cy="129" rx="34" ry="6" />
      <g class="rabbit-parts">
        <path class="animal-ear" d="M35 37C24 18 28 5 38 8c7 3 6 18 6 29z" />
        <path class="animal-ear" d="M54 36C55 15 63 4 71 11c6 6-2 20-8 31z" />
        <circle class="animal-tail" cx="79" cy="93" r="12" />
        <path class="animal-leg" d="M29 104v22m14-22v23m15-23v23m14-23v22" />
      </g>
      <ellipse class="animal-body" cx="53" cy="86" rx="32" ry="34" />
      <circle class="animal-head" cx="49" cy="48" r="24" />
      <circle class="animal-eye" cx="42" cy="45" r="3.5" />
      <circle class="animal-eye" cx="58" cy="45" r="3.5" />
      <g class="chicken-parts">
        <path class="animal-comb" d="M32 28c-3-10 6-15 11-7 1-12 14-11 14 1 7-7 14 1 10 9z" />
        <path class="animal-beak" d="m70 49 17 8-18 7z" />
        <path class="animal-wing" d="M31 75c-12 13-8 31 11 32 8-9 8-23-11-32z" />
        <path class="animal-leg" d="M39 108v19m23-19v19" />
      </g>
    </svg>
    <span class="animal-label">${type === "rabbit" ? "兔" : "鸡"}</span>`;
}

function animalButton(state, index, options = {}) {
  const isRabbit = state.rabbitFlags[index];
  const type = isRabbit ? "rabbit" : "chicken";
  const repaired = state.repairedAnimals.includes(index);
  const targetable = options.targetable && !isRabbit;
  const disabled = options.interactive || targetable ? "" : "disabled";
  const action = options.interactive || targetable ? `data-animal-index="${index}"` : "";
  const label = options.interactive
    ? `第 ${index + 1} 只动物，现在是${isRabbit ? "兔" : "鸡"}，点击切换`
    : `第 ${index + 1} 只${isRabbit ? "兔" : "鸡"}`;

  return `
    <button class="animal-button is-${type}${repaired ? " is-repaired" : ""}${targetable ? " is-targetable" : ""}"
      style="--tilt:${index % 2 === 0 ? -1.5 : 1.2}deg"
      type="button" ${action} ${disabled} aria-label="${label}">
      ${animalSvg(type)}
    </button>`;
}

function animalGrid(state, options = {}) {
  return `<div class="animal-grid">${state.rabbitFlags.map((_, index) => animalButton(state, index, options)).join("")}</div>`;
}

function peekAnimal(index) {
  return `
    <svg class="animal-peek" style="--index:${index}" viewBox="0 0 80 100" aria-hidden="true">
      <path class="peek-head" d="M14 92c1-31 5-50 26-51 22 0 28 22 27 51z" />
      <circle class="peek-eye" cx="32" cy="61" r="3.2" />
      <circle class="peek-eye" cx="49" cy="61" r="3.2" />
    </svg>`;
}

function legBalance(state) {
  const current = currentTrialLegs(state);
  const comparison = currentLegComparison(state);
  const status = comparison.relation === "match"
    ? "正好对上"
    : comparison.relation === "missing"
      ? `还差 ${comparison.amount} 条`
      : `多出 ${comparison.amount} 条`;

  return `
    <div class="leg-balance is-${comparison.relation}" aria-live="polite">
      <span>当前腿数</span>
      <strong>${current} / ${state.problem.legs}</strong>
      <span>${status}</span>
    </div>`;
}

function renderArrival(state) {
  return `
    <div class="arrival-scene">
      <span class="arrival-scene__label">围栏后只看得见 ${state.problem.heads} 个脑袋</span>
      <div class="peek-row">${Array.from({ length: state.problem.heads }, (_, index) => peekAnimal(index)).join("")}</div>
    </div>`;
}

function renderExplore(state) {
  return `
    <div class="animal-yard">
      <div class="yard-heading">
        <h2 class="scene-title">让动物变身，观察腿数</h2>
        <p class="scene-subtitle">点击任意纸偶，在鸡和兔之间切换</p>
      </div>
      ${animalGrid(state, { interactive: true })}
      ${legBalance(state)}
    </div>`;
}

function renderBaseline(state) {
  return `
    <div class="animal-yard">
      <div class="yard-heading">
        <h2 class="scene-title">先建立一个统一起点</h2>
        <p class="scene-subtitle">把所有动物暂时看成鸡，不代表它们真的全是鸡</p>
      </div>
      ${animalGrid(state)}
      <div class="workbench-equation">${state.problem.heads} × 2 = ${state.problem.baselineLegs} 条腿</div>
    </div>`;
}

function renderPair(state) {
  const totalPlaced = state.pairTrayCounts.reduce((sum, count) => sum + count, 0);
  const loose = state.problem.extraLegs - totalPlaced;
  const tokens = Array.from({ length: loose }, (_, index) => `
    <button class="leg-token" style="--tilt:${index % 2 === 0 ? -5 : 4}deg" type="button"
      draggable="true" data-leg-token="${index}" aria-label="一条没有主人的腿，点击自动放入托盘">
      ${legSvg()}
    </button>`).join("");
  const trays = state.pairTrayCounts.map((count, index) => `
    <div class="pair-tray${count === 2 ? " is-complete" : ""}" data-pair-tray="${index}" tabindex="0"
      aria-label="第 ${index + 1} 个托盘，已有 ${count} 条腿">
      <span>第 ${index + 1} 组 · ${count}/2</span>
      <div class="tray-legs">${Array.from({ length: count }, () => `<span class="leg-chip">${legSvg()}</span>`).join("")}</div>
    </div>`).join("");

  return `
    <div class="pair-workbench">
      <div class="workbench-heading">
        <div><h2 class="scene-title">给多出的腿分组</h2><p class="scene-subtitle">每只兔比鸡多 2 条腿</p></div>
        <div class="workbench-equation">${state.problem.legs} − ${state.problem.baselineLegs} = ${state.problem.extraLegs} 条</div>
      </div>
      <div class="workbench-surface">
        <div class="leg-pile" aria-label="还有 ${loose} 条腿没有分组">${tokens || `<div class="notice-strip">散落的腿都分完了</div>`}</div>
        <div class="pair-trays">${trays}</div>
      </div>
    </div>`;
}

function renderRepair(state) {
  const pairs = Array.from({ length: state.problem.pairCount }, (_, index) => {
    const used = state.usedPairIndexes.includes(index);
    const selected = state.selectedPair === index;
    return `
      <button class="repair-pair${selected ? " is-selected" : ""}" type="button" data-repair-pair="${index}"
        draggable="${used ? "false" : "true"}" ${used ? "disabled" : ""} aria-label="第 ${index + 1} 组两条腿${used ? "，已经使用" : ""}">
        <span class="leg-chip">${legSvg()}</span><span class="leg-chip">${legSvg()}</span>
      </button>`;
  }).join("");
  const complete = state.repairedAnimals.length === state.problem.rabbits;

  return `
    <div class="repair-bench">
      <div class="workbench-heading">
        <div><h2 class="scene-title">把每组腿还给主人</h2><p class="scene-subtitle">拿起一组，再选择一只鸡</p></div>
        ${complete ? `<div class="workbench-equation">${state.problem.chickens} 只鸡 + ${state.problem.rabbits} 只兔</div>` : ""}
      </div>
      <div class="workbench-surface">
        <div class="animal-yard">
          ${animalGrid(state, { targetable: state.selectedPair !== null })}
          ${complete ? `
            <div class="repair-summary">
              <div><span>脑袋检查</span><strong>${state.problem.chickens} + ${state.problem.rabbits} = ${state.problem.heads}</strong></div>
              <div><span>腿数检查</span><strong>${state.problem.checkedLegs} = ${state.problem.legs}</strong></div>
            </div>` : legBalance(state)}
        </div>
        <div class="repair-pairs" aria-label="两腿分组">${pairs}</div>
      </div>
    </div>`;
}

function evidenceIcon(type) {
  if (type === "six-legs") {
    return `<svg viewBox="0 0 100 90" aria-hidden="true"><g transform="translate(10 4) scale(.36)">${legSvg().replace(/<svg[^>]*>|<\/svg>/g, "")}</g><g transform="translate(39 4) scale(.36)">${legSvg().replace(/<svg[^>]*>|<\/svg>/g, "")}</g><g transform="translate(68 4) scale(.36)">${legSvg().replace(/<svg[^>]*>|<\/svg>/g, "")}</g></svg>`;
  }
  if (type === "three-pairs") {
    return `<svg viewBox="0 0 100 90" aria-hidden="true">
      <rect x="7" y="18" width="24" height="54" rx="8" fill="#dff4ea" stroke="#267c61" stroke-width="3" />
      <rect x="38" y="18" width="24" height="54" rx="8" fill="#dff4ea" stroke="#267c61" stroke-width="3" />
      <rect x="69" y="18" width="24" height="54" rx="8" fill="#dff4ea" stroke="#267c61" stroke-width="3" />
      <path d="M15 31v26m9-26v26M46 31v26m9-26v26M77 31v26m9-26v26" stroke="#bb814b" stroke-width="5" stroke-linecap="round" />
    </svg>`;
  }
  return `<svg viewBox="0 0 100 90" aria-hidden="true"><circle cx="32" cy="45" r="22" fill="#a9b7c7" stroke="#756a53" stroke-width="3"/><path d="M24 26 17 6m29 20 7-20" stroke="#a9b7c7" stroke-width="12" stroke-linecap="round"/><text x="67" y="58" fill="#14233b" font-size="36" font-weight="900">3</text></svg>`;
}

function renderMisconception(state) {
  const cards = [
    { id: "six-legs", title: "六条散腿", detail: "只看得出差了多少腿" },
    { id: "three-pairs", title: "三组两条腿", detail: "每组刚好修正一只兔" },
    { id: "three-rabbits", title: "最后三只兔", detail: "这是结果，还不是理由" }
  ];

  return `
    <div class="evidence-bench">
      <div class="evidence-bench__question">
        <h2 class="scene-title">小错说：“多出 6 条腿，所以有 6 只兔。”</h2>
        <p class="scene-subtitle">哪一份现场证据能指出这条规则的问题？</p>
      </div>
      <div class="evidence-table">
        ${cards.map((card, index) => `
          <button class="evidence-card${state.evidenceSolved && card.id === "three-pairs" ? " is-correct" : ""}"
            style="--tilt:${[-1.5, 1.2, -0.8][index]}deg" type="button" data-evidence="${card.id}">
            ${evidenceIcon(card.id)}
            <strong>${card.title}</strong>
            <span>${card.detail}</span>
          </button>`).join("")}
      </div>
      <div class="notice-strip">${state.notice}</div>
    </div>`;
}

function renderTeach(state) {
  const slots = RULE_ORDER.map((ruleId, index) => {
    const placed = state.ruleTrack[index];
    return `
      <div class="rule-slot${placed ? " is-filled" : ""}">
        ${placed
          ? `<div><small>步骤 ${index + 1}</small><strong>${RULE_COPY[placed].title}</strong></div>`
          : `<strong>步骤 ${index + 1}</strong>`}
      </div>`;
  }).join("");
  const cards = SHUFFLED_RULES.map((ruleId, index) => `
    <button class="rule-card" style="--tilt:${index % 2 ? 1.2 : -1.1}deg" type="button" data-rule-card="${ruleId}"
      ${state.ruleTrack.includes(ruleId) ? "disabled" : ""}>
      ${RULE_COPY[ruleId].short}
    </button>`).join("");

  return `
    <div class="rule-machine">
      <div class="rule-machine__heading">
        <h2 class="scene-title">把可靠的方法装进规则轨道</h2>
        <p class="scene-subtitle">从最先发生的动作开始，依次放入四张纸片</p>
      </div>
      <div class="rule-track">${slots}</div>
      <div>
        <div class="rule-cards">${cards}</div>
        <div class="notice-strip">${state.notice}</div>
      </div>
    </div>`;
}

function renderTransfer(state) {
  const problem = state.transfer;
  const calculations = [
    ["统一起点", `${problem.heads} × 2 = ${problem.baselineLegs} 条`],
    ["找出差量", `${problem.legs} − ${problem.baselineLegs} = ${problem.extraLegs} 条`],
    ["两条一组", `${problem.extraLegs} ÷ 2 = ${problem.pairCount} 组`],
    ["修正动物", `${problem.chickens} 只鸡，${problem.rabbits} 只兔`]
  ];

  return `
    <div class="transfer-bench">
      <article class="transfer-case">
        <span class="transfer-case__stamp">新现场</span>
        <h2>北坡围栏</h2>
        <p>小错必须独立处理一份新记录。答案和刚才完全不同。</p>
        <div class="transfer-case__numbers">
          <div><span>脑袋</span><strong>${problem.heads}</strong></div>
          <div><span>腿</span><strong>${problem.legs}</strong></div>
        </div>
      </article>
      <div class="transfer-machine">
        ${state.transferRun ? `
          <div class="calculation-folds">
            ${calculations.map(([label, value], index) => `
              <div class="calculation-fold" style="--index:${index}"><i>${index + 1}</i><span>${label}</span><strong>${value}</strong></div>`).join("")}
          </div>
          <div class="transfer-checks">
            <button class="check-seal${state.transferChecks.heads ? " is-checked" : ""}" type="button" data-transfer-check="heads">
              ${state.transferChecks.heads ? "已核对" : "核对"}：${problem.chickens} + ${problem.rabbits} = ${problem.heads} 个脑袋
            </button>
            <button class="check-seal${state.transferChecks.legs ? " is-checked" : ""}" type="button" data-transfer-check="legs">
              ${state.transferChecks.legs ? "已核对" : "核对"}：${problem.chickens * 2} + ${problem.rabbits * 4} = ${problem.legs} 条腿
            </button>
          </div>` : `
          <div class="transfer-machine__idle">
            <div>
              <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="27"/><path d="M50 8v15m0 54v15M8 50h15m54 0h15M20 20l11 11m38 38 11 11m0-60L69 31M31 69 20 80"/></svg>
              <strong>规则机器等待启动</strong>
            </div>
          </div>`}
      </div>
    </div>`;
}

function renderRestored(state) {
  return `
    <div class="restored-scene">
      <div class="restored-seal">
        <svg viewBox="0 0 100 100" aria-hidden="true"><path d="m18 52 20 20 45-49" /><circle cx="50" cy="50" r="42" /></svg>
      </div>
      <h2>夜影农场恢复登记</h2>
      <p>你没有把一个答案交给小错，而是教会它一条可以换数字继续使用的规则。</p>
    </div>`;
}

export function renderScene(state) {
  if (state.phase === "arrival") return renderArrival(state);
  if (state.phase === "explore") return renderExplore(state);
  if (state.phase === "baseline") return renderBaseline(state);
  if (state.phase === "pair") return renderPair(state);
  if (state.phase === "repair") return renderRepair(state);
  if (state.phase === "misconception") return renderMisconception(state);
  if (state.phase === "teach") return renderTeach(state);
  if (state.phase === "transfer") return renderTransfer(state);
  return renderRestored(state);
}

export function promptFor(state) {
  if (state.phase === "arrival") return ["现场异常", "点亮调查灯，看看围栏后藏着什么。"];
  if (state.phase === "explore") {
    const comparison = currentLegComparison(state);
    const prompt = comparison.relation === "match"
      ? "腿数已经对上。现在寻找一种不需要逐只猜的方法。"
      : "点击动物让它变身，注意每次腿数改变多少。";
    return ["自由试验", prompt];
  }
  if (state.phase === "baseline") return ["建立起点", "拉下纸杆，把所有动物暂时看成鸡。"];
  if (state.phase === "pair") return ["处理差量", "点击腿纸片自动分组，也可以把它拖进任意托盘。"];
  if (state.phase === "repair") return ["修正假设", "先拿起一组两条腿，再选择一只鸡。"];
  if (state.phase === "misconception") return ["检查规则", "不要只看答案，找出能解释“一组对应一只兔”的证据。"];
  if (state.phase === "teach") return ["组装方法", "按实际发生的顺序，把四个动作接进规则轨道。"];
  if (state.phase === "transfer") return ["陌生现场", state.transferRun ? "核对脑袋和腿，两项都成立才算真正学会。" : "让小错用刚装好的规则处理一组新数字。"];
  return ["案件完成", "农场恢复了安静。这个方法已经通过新数字的考验。"];
}

function primaryButton(action, text, disabled = false) {
  return `<button class="paper-button" type="button" data-action="${action}" ${disabled ? "disabled" : ""}>${text}</button>`;
}

export function renderActions(state) {
  if (state.phase === "arrival") return primaryButton("investigate", "点亮调查灯");
  if (state.phase === "explore") return primaryButton("shortcut", "寻找更快办法", state.attempts < 2);
  if (state.phase === "baseline") return primaryButton("apply-baseline", "全部暂定为鸡", state.baselineApplied);
  if (state.phase === "pair") return primaryButton("start-repair", "把三组腿交给主人", completedPairs(state) !== state.problem.pairCount);
  if (state.phase === "repair") return primaryButton("check-result", "核对登记结果", currentRabbitCount(state) !== state.problem.rabbits);
  if (state.phase === "misconception") return primaryButton("teach-robot", "重新教会小错", !state.evidenceSolved);
  if (state.phase === "teach") return primaryButton("open-transfer", "去陌生现场试一遍", state.ruleTrack.length !== RULE_ORDER.length);
  if (state.phase === "transfer") {
    if (!state.transferRun) return primaryButton("run-transfer", "启动规则机器");
    return primaryButton("restore-farm", "修复登记装置", !transferComplete(state));
  }
  return primaryButton("restart", "重新调查一次");
}

export function progressFor(state) {
  const positions = {
    arrival: ["抵达农场", 6],
    explore: ["自由试验", 18],
    baseline: ["建立起点", 31],
    pair: ["处理差量", 45],
    repair: ["修正动物", 58],
    misconception: ["检查规则", 70],
    teach: ["教会小错", 82],
    transfer: ["迁移验证", 93],
    restored: ["案件完成", 100]
  };
  return positions[state.phase];
}

