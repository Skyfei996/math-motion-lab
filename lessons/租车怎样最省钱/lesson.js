(function () {
  const app = document.querySelector("[data-rental-app]");
  if (!app) return;

  const defaults = {
    teachers: 15,
    students: 355,
    bigCapacity: 40,
    bigPrice: 720,
    smallCapacity: 25,
    smallPrice: 500
  };

  const state = { ...defaults };
  let stepIndex = 0;
  let revealed = false;
  let hintOpen = false;
  let selectedPlanIndex = 0;

  const ui = {
    "zh-CN": {
      labName: "小学数学互动课堂",
      title: "租车怎样最省钱",
      back: "返回课程目录",
      edit: "编辑题目",
      fullscreen: "全屏讲解",
      hint: "老师提示",
      prev: "上一步",
      next: "下一步",
      reveal: "揭晓",
      revealed: "已揭晓",
      start: "开始统计",
      restart: "重新讲解",
      settingsTitle: "编辑题目",
      settingsLead: "修改后会从第一步重新讲解。",
      peopleGroup: "出行人数",
      vehicleGroup: "车辆信息",
      teachers: "老师人数",
      students: "学生人数",
      bigCapacity: "大车座位",
      bigPrice: "大车租金",
      smallCapacity: "小车座位",
      smallPrice: "小车租金",
      cancel: "取消",
      apply: "应用并重新讲解",
      close: "关闭",
      invalid: "请输入正确的正整数，老师和学生总人数不能为0。",
      tooMany: "这组数字会产生超过20种方案，请增加大车座位数或减少人数。",
      stepCount: "第 {current} 站 / 共 {total} 站"
    },
    "en-US": {
      labName: "Primary Math Classroom",
      title: "How to Rent Vehicles for Less",
      back: "Back to lessons",
      edit: "Edit problem",
      fullscreen: "Fullscreen",
      hint: "Teacher tip",
      prev: "Back",
      next: "Next",
      reveal: "Reveal",
      revealed: "Revealed",
      start: "Count everyone",
      restart: "Start over",
      settingsTitle: "Edit problem",
      settingsLead: "Applying changes restarts the lesson.",
      peopleGroup: "Travellers",
      vehicleGroup: "Vehicle details",
      teachers: "Teachers",
      students: "Students",
      bigCapacity: "Large vehicle seats",
      bigPrice: "Large vehicle price",
      smallCapacity: "Small vehicle seats",
      smallPrice: "Small vehicle price",
      cancel: "Cancel",
      apply: "Apply and restart",
      close: "Close",
      invalid: "Enter valid whole numbers. The total number of travellers must be greater than 0.",
      tooMany: "These numbers create more than 20 plans. Increase the large vehicle capacity or reduce the group size.",
      stepCount: "Stop {current} of {total}"
    }
  };

  const assetBase = "../../素材/单个透明PNG/";
  const teacherAssets = ["teacher_01.png", "teacher_02.png", "teacher_04.png"];
  const studentAssets = ["student_01.png", "student_02.png", "student_03.png", "student_04.png", "student_05.png", "student_06.png"];
  const vehicleAssets = { big: "vehicle_01.png", small: "vehicle_02.png" };

  const stage = app.querySelector("[data-stage]");
  const journey = app.querySelector("[data-journey]");
  const hintBox = app.querySelector("[data-teacher-hint]");
  const progressText = app.querySelector("[data-progress-text]");
  const settingsDialog = app.querySelector("[data-settings-dialog]");
  const settingsError = app.querySelector("[data-settings-error]");
  const controls = {
    prev: app.querySelector("[data-action='prev']"),
    reveal: app.querySelector("[data-action='reveal']"),
    next: app.querySelector("[data-action='next']")
  };

  function language() {
    return MathLab.getLanguage();
  }

  function copy(key) {
    return ui[language()]?.[key] || ui["zh-CN"][key] || key;
  }

  function tr(zh, en) {
    return language() === "zh-CN" ? zh : en;
  }

  function format(template, values = {}) {
    return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  }

  function number(value) {
    return MathLab.numberText(value);
  }

  function money(value) {
    return language() === "zh-CN" ? `${number(value)}元` : `${number(value)}`;
  }

  function result() {
    return MathLabModels.quantity.vehicleRentalState(
      state.teachers,
      state.students,
      state.bigCapacity,
      state.bigPrice,
      state.smallCapacity,
      state.smallPrice
    );
  }

  function buildSteps(current) {
    const startName = current.startType === "big" ? tr("大车", "large vehicle") : tr("小车", "small vehicle");
    const fillName = current.startType === "big" ? tr("小车", "small vehicle") : tr("大车", "large vehicle");
    const steps = [
      {
        id: "intro",
        label: tr("读题", "Read"),
        title: tr("先看清题目", "Read the problem"),
        question: tr("先找出要坐车的人和两种车的信息，不急着猜答案。", "Find the travellers and the two vehicle choices before guessing."),
        hint: tr("请学生说一说：题目告诉了我们哪些信息？最后要解决什么问题？", "Ask students what information is given and what the question asks."),
        requiresReveal: false
      },
      {
        id: "total",
        label: tr("算人数", "Count"),
        title: tr("一共有多少人要坐车？", "How many people need seats?"),
        question: tr("老师和学生都要上车，应该用什么方法计算总人数？", "Teachers and students all need seats. How do we find the total?"),
        hint: tr("先让学生口答算式，再点击揭晓。", "Let students say the addition before revealing it."),
        requiresReveal: true
      },
      {
        id: "singlePlans",
        label: tr("先试两种", "Try both"),
        title: tr("全部租大车和全部租小车，哪种更便宜？", "Which single-vehicle plan costs less?"),
        question: tr("两种都要计算，不能一开始就认定大车或者小车更省钱。", "Calculate both choices instead of assuming one is cheaper."),
        hint: tr("强调“暂时更便宜”只是选择一个有顺序的起点，还不是最终答案。", "Stress that this only chooses an orderly starting point, not the final answer."),
        requiresReveal: true
      }
    ];

    if (current.teachingPlans.length > 1) {
      steps.push({
        id: "replace",
        planIndex: 1,
        label: tr("少一辆", "One fewer"),
        title: tr(`少租一辆${startName}，怎样把座位补够？`, `How do we replace one ${startName}?`),
        question: tr(`先算现有${startName}有多少座位，再看还差多少座位。`, `Count the ${startName} seats, then find how many seats are missing.`),
        hint: tr(`让学生先算“还差多少人”，再判断最少需要几辆${fillName}。`, `Find the missing seats before choosing the fewest ${fillName}s.`),
        requiresReveal: true
      });
    }

    if (current.teachingPlans.length > 2) {
      steps.push({
        id: "replace",
        planIndex: 2,
        label: tr("再少一辆", "One fewer again"),
        title: tr(`再少一辆${startName}，会更省钱吗？`, `Will one fewer ${startName} cost less?`),
        question: tr("座位够坐以后，还要把这个方案的租金算出来。", "After checking the seats, calculate the price of this plan."),
        hint: tr("这一步先不要说它一定最省，只说“目前最少”。", "Call it the lowest so far, not the final minimum yet."),
        requiresReveal: true
      });
    }

    steps.push(
      {
        id: "comparison",
        label: tr("全部方案", "All plans"),
        title: tr("把所有情况都试一遍", "Try every possible case"),
        question: tr(`${startName}从最多一直试到0辆，每一种情况下，${fillName}都只租够用的数量。`, `Try every ${startName} count down to zero and use only enough ${fillName}s.`),
        hint: tr("先让学生观察哪根价格柱最低，再点击揭晓。", "Ask which price bar is lowest before revealing it."),
        requiresReveal: true
      },
      {
        id: "proof",
        label: tr("为什么最低", "Why lowest"),
        title: tr("为什么可以确定它最省钱？", "Why can we be certain?"),
        question: tr("要从“有没有漏掉”和“有没有多租车”两个方面检查。", "Check that no case was missed and no extra vehicle was rented."),
        hint: tr("依次让学生回答三个检查问题，再揭晓完整结论。", "Let students answer the three checks before revealing the conclusion."),
        requiresReveal: true
      },
      {
        id: "answer",
        label: tr("规范作答", "Answer"),
        title: tr("写出完整答案", "Write the complete answer"),
        question: tr("先说租车方案，再写最少需要多少钱。", "State the vehicle plan, then the minimum price."),
        hint: tr("请学生完整读出答案，并检查单位是否写对。", "Have students read the complete answer and check the unit."),
        requiresReveal: false
      }
    );

    return steps;
  }

  function peopleImages(assets) {
    return assets.map((file, index) => `<img src="${assetBase}${file}" alt="" aria-hidden="true" style="--item:${index}">`).join("");
  }

  function renderFleet(count, type, arriving = false) {
    const cleanCount = Math.max(0, count);
    const visible = Math.min(cleanCount, 5);
    const name = type === "big" ? tr("大车", "large") : tr("小车", "small");
    if (cleanCount === 0) {
      return `<div class="rental-fleet"><span class="rental-fleet-more">${tr("0辆", "0")}</span></div>`;
    }
    let html = '<div class="rental-fleet">';
    for (let index = 0; index < visible; index += 1) {
      const arrivingClass = arriving && index === visible - 1 ? " is-arriving" : "";
      html += `<div class="rental-vehicle ${type === "small" ? "is-small" : "is-big"}${arrivingClass}">
        <img src="${assetBase}${vehicleAssets[type]}" alt="${name}${index + 1}">
      </div>`;
    }
    if (cleanCount > visible) html += `<span class="rental-fleet-more">+${cleanCount - visible}</span>`;
    html += "</div>";
    return html;
  }

  function seatMeter(current, seats) {
    const maximum = Math.max(current.totalPeople, seats, 1);
    const width = Math.min(100, (seats / maximum) * 100);
    const markerRight = Math.max(0, 100 - (current.totalPeople / maximum) * 100);
    const enough = seats >= current.totalPeople;
    return `<div class="rental-seat-meter ${enough ? "is-enough" : "is-short"}">
      <div class="rental-seat-track">
        <div class="rental-seat-fill" style="width:${width}%"></div>
      </div>
      <div class="rental-seat-marker" style="right:${markerRight}%"><span>${tr("需要", "Need")} ${number(current.totalPeople)}</span></div>
      <div class="rental-seat-caption">
        <span>${tr("现有座位", "Seats now")} ${number(seats)}</span>
        <strong>${enough ? tr("座位够坐", "Enough seats") : tr(`还差${current.totalPeople - seats}个座位`, `${current.totalPeople - seats} seats short`)}</strong>
      </div>
    </div>`;
  }

  function renderIntro(current) {
    return `<div class="rental-story-grid">
      <div class="rental-scene">
        <div class="rental-people-scene">
          <div class="rental-people-group">
            <div class="rental-people-images">${peopleImages(teacherAssets)}</div>
            <span class="rental-people-label">${tr("老师", "Teachers")} ${number(current.teachers)}</span>
          </div>
          <span class="rental-math-sign">+</span>
          <div class="rental-people-group">
            <div class="rental-people-images">${peopleImages(studentAssets)}</div>
            <span class="rental-people-label">${tr("学生", "Students")} ${number(current.students)}</span>
          </div>
        </div>
      </div>
      <div class="rental-problem-card">
        <p>${tr(
          `学校组织 <strong>${current.teachers}</strong> 位老师和 <strong>${current.students}</strong> 名学生去参观。`,
          `A school trip has <strong>${current.teachers}</strong> teachers and <strong>${current.students}</strong> students.`
        )}</p>
        <p>${tr(
          `大车每辆坐 ${current.bigCapacity} 人，租金 ${money(current.bigPrice)}；小车每辆坐 ${current.smallCapacity} 人，租金 ${money(current.smallPrice)}。`,
          `A large vehicle seats ${current.bigCapacity} and costs ${money(current.bigPrice)}. A small vehicle seats ${current.smallCapacity} and costs ${money(current.smallPrice)}.`
        )}</p>
        <div class="rental-question-ribbon">${tr("怎样租车最省钱？", "Which plan costs the least?")}</div>
      </div>
    </div>`;
  }

  function renderTotal(current) {
    return `<div class="rental-story-grid">
      <div class="rental-scene">
        <div class="rental-people-scene">
          <div class="rental-people-group">
            <div class="rental-people-images">${peopleImages(teacherAssets)}</div>
            <span class="rental-people-label">${number(current.teachers)} ${tr("位老师", "teachers")}</span>
          </div>
          <span class="rental-math-sign">+</span>
          <div class="rental-people-group">
            <div class="rental-people-images">${peopleImages(studentAssets)}</div>
            <span class="rental-people-label">${number(current.students)} ${tr("名学生", "students")}</span>
          </div>
        </div>
      </div>
      <div class="rental-board">
        <p class="rental-board-label">${tr("先算总人数", "FIND THE TOTAL")}</p>
        <p class="rental-board-line">${number(current.teachers)} + ${number(current.students)} = ${revealed ? `<strong>${number(current.totalPeople)}</strong>` : "?"}</p>
        ${revealed ? `<p class="rental-board-line is-result">${tr(`一共有 ${current.totalPeople} 人要坐车`, `${current.totalPeople} people need seats`)}</p>` : ""}
      </div>
    </div>`;
  }

  function singlePlanDetails(current, type) {
    const isBig = type === "big";
    const capacity = isBig ? current.bigCapacity : current.smallCapacity;
    const price = isBig ? current.bigPrice : current.smallPrice;
    const plan = isBig ? current.allBigPlan : current.allSmallPlan;
    const count = isBig ? plan.big : plan.small;
    const quotient = Math.floor(current.totalPeople / capacity);
    const remainder = current.totalPeople % capacity;
    const division = remainder === 0
      ? `${current.totalPeople} ÷ ${capacity} = ${quotient}`
      : tr(`${current.totalPeople} ÷ ${capacity} = ${quotient}（辆）……${remainder}（人）`, `${current.totalPeople} ÷ ${capacity} = ${quotient} remainder ${remainder}`);
    const countReason = remainder === 0
      ? tr(`正好需要 ${count} 辆`, `Exactly ${count} are needed`)
      : tr(`还有 ${remainder} 人没座位，所以需要 ${count} 辆`, `${remainder} people remain, so ${count} are needed`);
    return { capacity, price, plan, count, division, countReason };
  }

  function renderSinglePlans(current) {
    const big = singlePlanDetails(current, "big");
    const small = singlePlanDetails(current, "small");
    const startIsBig = current.startType === "big";
    const costsEqual = big.plan.cost === small.plan.cost;
    const startName = startIsBig ? tr("全租大车", "all large vehicles") : tr("全租小车", "all small vehicles");
    const comparison = costsEqual
      ? tr(`${money(big.plan.cost)} = ${money(small.plan.cost)}`, `${money(big.plan.cost)} = ${money(small.plan.cost)}`)
      : startIsBig
        ? `${money(big.plan.cost)} < ${money(small.plan.cost)}`
        : `${money(small.plan.cost)} < ${money(big.plan.cost)}`;
    const startNote = costsEqual
      ? tr(`两种方案费用一样，可以从${startName}开始有顺序地试；这还不是最后答案。`, `Both cost the same. Start with ${startName} to test in order; this is not the final answer.`)
      : tr(`${comparison}，${startName}暂时更便宜，所以从这里开始逐辆替换；这还不是最后答案。`, `${comparison}. ${startName} is cheaper for now, so start replacing from here; this is not the final answer.`);

    function planCard(type, details) {
      const isBig = type === "big";
      const name = isBig ? tr("全部租大车", "All large vehicles") : tr("全部租小车", "All small vehicles");
      const startClass = revealed && current.startType === type ? " is-start" : "";
      return `<section class="rental-single-plan-card ${isBig ? "" : "is-small"}${startClass}">
        <div>
          <img src="${assetBase}${vehicleAssets[type]}" alt="${name}">
          <strong>${revealed ? `${details.count}${tr("辆", "")}` : "?"}</strong>
        </div>
        <div>
          <h3>${name}</h3>
          <p>${details.division}</p>
          ${revealed ? `<p>${details.countReason}</p><p>${details.count} × ${money(details.price)}</p><span class="rental-single-plan-cost">${money(details.plan.cost)}</span>` : `<p>${tr("先算需要几辆，再算租金。", "Find the vehicle count, then the cost.")}</p>`}
        </div>
      </section>`;
    }

    return `<div class="rental-single-plan-grid">
      ${planCard("big", big)}
      ${planCard("small", small)}
    </div>
    ${revealed ? `<div class="rental-start-note">${startNote}</div>` : ""}`;
  }

  function fillerVehicleReason(remainingPeople, capacity, count, vehicleName) {
    const quotient = Math.floor(remainingPeople / capacity);
    const remainder = remainingPeople % capacity;
    if (remainingPeople === 0) return tr(`不需要${vehicleName}`, `No ${vehicleName} is needed`);
    if (remainder === 0) {
      return `${remainingPeople} ÷ ${capacity} = ${quotient}${tr("（辆）", "")}`;
    }
    return tr(
      `${remainingPeople} ÷ ${capacity} = ${quotient}（辆）……${remainder}（人），所以需要 ${count} 辆`,
      `${remainingPeople} ÷ ${capacity} = ${quotient} remainder ${remainder}, so ${count} are needed`
    );
  }

  function renderReplacement(current, planIndex) {
    const plan = current.teachingPlans[planIndex];
    const primaryIsBig = current.startType === "big";
    const primaryType = primaryIsBig ? "big" : "small";
    const fillerType = primaryIsBig ? "small" : "big";
    const primaryName = primaryIsBig ? tr("大车", "large vehicle") : tr("小车", "small vehicle");
    const fillerName = primaryIsBig ? tr("小车", "small vehicle") : tr("大车", "large vehicle");
    const primaryCount = primaryIsBig ? plan.big : plan.small;
    const fillerCount = primaryIsBig ? plan.small : plan.big;
    const primaryCapacity = primaryIsBig ? current.bigCapacity : current.smallCapacity;
    const fillerCapacity = primaryIsBig ? current.smallCapacity : current.bigCapacity;
    const primarySeats = primaryIsBig ? plan.bigSeats : plan.smallSeats;
    const remainingPeople = Math.max(0, current.totalPeople - primarySeats);
    const shownSeats = revealed ? plan.seats : primarySeats;
    return `<div class="rental-calc-layout">
      <div class="rental-scene">
        <div class="rental-fleet-pair">
          <section class="rental-fleet-box ${primaryType === "small" ? "is-small" : ""}">
            <h3>${primaryName} · ${primaryCount}${tr("辆", "")}</h3>
            ${renderFleet(primaryCount, primaryType)}
          </section>
          <section class="rental-fleet-box ${fillerType === "small" ? "is-small" : ""}">
            <h3>${fillerName} · ${revealed ? fillerCount : "?"}${tr("辆", "")}</h3>
            ${revealed ? renderFleet(fillerCount, fillerType, true) : `<div class="rental-total-orb is-hidden">?</div>`}
          </section>
        </div>
        ${seatMeter(current, shownSeats)}
        ${revealed ? `<span class="${plan.emptySeats === 0 ? "rental-enough-badge" : "rental-empty-badge"}">${plan.emptySeats === 0 ? tr("座位正好", "Exact fit") : tr(`空 ${plan.emptySeats} 个座位`, `${plan.emptySeats} empty seats`)}</span>` : ""}
      </div>
      <div class="rental-board">
        <p class="rental-board-label">${tr("把座位补够", "FILL THE MISSING SEATS")}</p>
        <p class="rental-board-line">${primaryCount} × ${primaryCapacity} = <strong>${primarySeats}</strong>${tr("个座位", " seats")}</p>
        <p class="rental-board-line">${current.totalPeople} - ${primarySeats} = <strong>${remainingPeople}</strong>${tr("个座位还没补", " seats missing")}</p>
        ${revealed ? `<p class="rental-board-line">${fillerVehicleReason(remainingPeople, fillerCapacity, fillerCount, fillerName)}</p>` : `<p class="rental-board-line">${tr(`最少需要几辆${fillerName}？`, `How many ${fillerName}s are needed?`)}</p>`}
        ${revealed ? `<p class="rental-board-line is-result">${plan.big} × ${current.bigPrice} + ${plan.small} × ${current.smallPrice} = <strong>${money(plan.cost)}</strong></p>` : ""}
      </div>
    </div>`;
  }

  function renderComparison(current) {
    const costs = current.teachingPlans.map((plan) => plan.cost);
    const min = Math.min(...costs);
    const max = Math.max(...costs);
    const bars = current.teachingPlans
      .map((plan, index) => {
        const height = max === min ? 72 : 42 + ((plan.cost - min) / (max - min)) * 54;
        const best = current.bestPlans.includes(plan);
        const classes = ["rental-plan-bar"];
        if (revealed && best) classes.push("is-best");
        if (revealed && !best) classes.push("is-muted");
        if (selectedPlanIndex === index) classes.push("is-selected");
        const label = tr(`${plan.big}大 ${plan.small}小，${money(plan.cost)}`, `${plan.big} large, ${plan.small} small, cost ${money(plan.cost)}`);
        return `<button type="button" class="${classes.join(" ")}" data-plan-index="${index}" aria-label="${label}">
          <span class="rental-plan-column"><span style="--bar-height:${height}%">${money(plan.cost)}</span></span>
          <span class="rental-plan-label"><strong>${plan.big}${tr("大", "L")} + ${plan.small}${tr("小", "S")}</strong>${plan.seats}${tr("座", " seats")}</span>
        </button>`;
      })
      .join("");
    const selected = current.teachingPlans[selectedPlanIndex] || current.teachingPlans[0];
    return `<div class="rental-plan-chart" style="--plan-count:${current.teachingPlans.length}" role="group" aria-label="${tr("所有租车方案的费用比较", "Cost comparison for all plans")}">
      ${bars}
    </div>
    <div class="rental-selected-plan" aria-live="polite">
      <span><strong>${selected.big}${tr("辆大车", " large")}</strong> + <strong>${selected.small}${tr("辆小车", " small")}</strong></span>
      <span>${selected.seats}${tr("个座位", " seats")} · ${selected.emptySeats}${tr("个空座", " empty")}</span>
      <span>${selected.big} × ${current.bigPrice} + ${selected.small} × ${current.smallPrice} = <strong>${money(selected.cost)}</strong></span>
    </div>`;
  }

  function renderProof(current) {
    const primaryIsBig = current.startType === "big";
    const primaryName = primaryIsBig ? tr("大车", "large vehicle") : tr("小车", "small vehicle");
    const fillerName = primaryIsBig ? tr("小车", "small vehicle") : tr("大车", "large vehicle");
    const primaryLimit = primaryIsBig ? current.allBigCount : current.allSmallCount;
    const fillerPrice = primaryIsBig ? current.smallPrice : current.bigPrice;
    const checks = [
      {
        title: tr(`${primaryName}数量列全了`, `Every ${primaryName} count`),
        text: tr(`从 ${primaryLimit} 辆${primaryName}一直试到0辆，没有漏掉。`, `Every count from ${primaryLimit} ${primaryName}s to zero was tried.`)
      },
      {
        title: tr(`${fillerName}只租够用的`, `Only enough ${fillerName}s`),
        text: tr(`每一种情况下，${fillerName}都是刚好补够座位；再多1辆就会多花${money(fillerPrice)}。`, `Each plan uses only enough ${fillerName}s. One extra costs ${money(fillerPrice)} more.`)
      },
      {
        title: tr("全部价格比过了", "Every price compared"),
        text: tr(`${money(current.best.cost)}是所有方案中的最低价格。`, `${money(current.best.cost)} is the lowest price in the full list.`)
      }
    ];
    return `<div class="rental-proof-grid">
      ${checks
        .map(
          (check, index) => `<section class="rental-proof-item ${revealed ? "is-checked" : ""}" style="animation-delay:${index * 120}ms">
            <span class="rental-proof-number">${revealed ? "✓" : index + 1}</span>
            <h3>${check.title}</h3>
            <p>${revealed ? check.text : tr("先检查这一点。", "Check this point first.")}</p>
          </section>`
        )
        .join("")}
    </div>
    ${revealed ? `<div class="rental-proof-result">${tr("没有漏掉方案 ＋ 没有多租车 ＋ 比过全部价格 ＝ 可以确定最省钱", "No plan missed + no extra vehicle + every price compared = certainly the lowest")}</div>` : ""}`;
  }

  function planAnswer(plan) {
    return tr(`${plan.big}辆大车和${plan.small}辆小车`, `${plan.big} large and ${plan.small} small vehicles`);
  }

  function renderAnswer(current) {
    const bestPlanBlocks = current.bestPlans
      .map(
        (plan) => `<section class="rental-fleet-pair">
          <div class="rental-fleet-box"><h3>${tr("大车", "Large")} · ${plan.big}${tr("辆", "")}</h3>${renderFleet(plan.big, "big")}</div>
          <div class="rental-fleet-box is-small"><h3>${tr("小车", "Small")} · ${plan.small}${tr("辆", "")}</h3>${renderFleet(plan.small, "small")}</div>
        </section>`
      )
      .join("");
    const planText = current.bestPlans.map(planAnswer).join(tr("，或者", ", or "));
    return `<div class="rental-answer-layout">
      <div class="rental-scene">${bestPlanBlocks}</div>
      <div class="rental-answer-card">
        <span class="rental-answer-stamp">${tr("最省钱", "LOWEST COST")}</span>
        <p>${tr(`答：租<strong>${planText}</strong>最省钱，最少需要<strong>${money(current.best.cost)}</strong>。`, `Answer: Rent <strong>${planText}</strong>. The minimum cost is <strong>${money(current.best.cost)}</strong>.`)}</p>
        <div class="rental-board-line">${current.bestPlans[0].big} × ${current.bigPrice} + ${current.bestPlans[0].small} × ${current.smallPrice} = ${money(current.best.cost)}</div>
      </div>
    </div>`;
  }

  function renderStageBody(current, step) {
    if (step.id === "intro") return renderIntro(current);
    if (step.id === "total") return renderTotal(current);
    if (step.id === "singlePlans") return renderSinglePlans(current);
    if (step.id === "replace") return renderReplacement(current, step.planIndex);
    if (step.id === "comparison") return renderComparison(current);
    if (step.id === "proof") return renderProof(current);
    return renderAnswer(current);
  }

  function renderStaticCopy(current) {
    document.documentElement.lang = language();
    document.title = `${copy("title")} - Math Motion Lab`;
    app.querySelectorAll("[data-copy]").forEach((node) => {
      node.textContent = copy(node.dataset.copy);
    });
    app.querySelector("[data-action='back']").setAttribute("aria-label", copy("back"));
    app.querySelector("[data-action='close-settings']").setAttribute("aria-label", copy("close"));
    app.querySelector("[data-problem-strip]").innerHTML = `
      <span class="rental-problem-fact">👥 ${current.teachers}${tr("位老师", " teachers")} + ${current.students}${tr("名学生", " students")} = ${current.totalPeople}${tr("人", " people")}</span>
      <span class="rental-problem-fact is-big">🚌 ${tr("大车", "Large")}：${current.bigCapacity}${tr("座", " seats")} / ${money(current.bigPrice)}</span>
      <span class="rental-problem-fact is-small">🚐 ${tr("小车", "Small")}：${current.smallCapacity}${tr("座", " seats")} / ${money(current.smallPrice)}</span>
      <strong class="rental-problem-question">${tr("怎样租车最省钱？", "Which plan costs the least?")}</strong>`;
  }

  function renderJourney(steps) {
    journey.style.setProperty("--step-count", steps.length);
    journey.innerHTML = steps
      .map((step, index) => `<button type="button" class="rental-step-button ${index < stepIndex ? "is-complete" : ""} ${index === stepIndex ? "is-active" : ""}" data-step-index="${index}" aria-current="${index === stepIndex ? "step" : "false"}">${index < stepIndex ? "✓ " : ""}${step.label}</button>`)
      .join("");
  }

  function renderControls(steps, step) {
    controls.prev.disabled = stepIndex === 0;
    controls.prev.textContent = copy("prev");
    controls.next.disabled = stepIndex >= steps.length - 1 || (step.requiresReveal && !revealed);
    controls.next.textContent = copy("next");

    if (step.id === "intro") {
      controls.reveal.disabled = false;
      controls.reveal.textContent = copy("start");
    } else if (step.id === "answer") {
      controls.reveal.disabled = false;
      controls.reveal.textContent = copy("restart");
    } else {
      controls.reveal.disabled = revealed;
      controls.reveal.textContent = revealed ? copy("revealed") : copy("reveal");
    }

    progressText.textContent = format(copy("stepCount"), { current: stepIndex + 1, total: steps.length });
  }

  function render() {
    const current = result();
    const steps = buildSteps(current);
    stepIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
    const step = steps[stepIndex];
    if (step.id === "answer") revealed = true;
    selectedPlanIndex = Math.max(0, Math.min(selectedPlanIndex, current.teachingPlans.length - 1));

    renderStaticCopy(current);
    renderJourney(steps);
    renderControls(steps, step);
    hintBox.textContent = step.hint;
    hintBox.hidden = !hintOpen;
    app.querySelector("[data-action='hint']").setAttribute("aria-expanded", String(hintOpen));

    stage.innerHTML = `<section class="rental-stage-panel">
      <header class="rental-stage-head">
        <div>
          <p class="rental-stage-kicker">${step.label}</p>
          <h2 class="rental-stage-title">${step.title}</h2>
          <p class="rental-stage-question">${step.question}</p>
        </div>
        <span class="rental-stage-count">${stepIndex + 1} / ${steps.length}</span>
      </header>
      <div class="rental-stage-canvas">${renderStageBody(current, step)}</div>
    </section>`;
  }

  function goToStep(index) {
    const steps = buildSteps(result());
    stepIndex = Math.max(0, Math.min(index, steps.length - 1));
    revealed = steps[stepIndex].id === "answer";
    hintOpen = false;
    selectedPlanIndex = 0;
    render();
  }

  function revealOrAdvance() {
    const steps = buildSteps(result());
    const step = steps[stepIndex];
    if (step.id === "intro") {
      goToStep(stepIndex + 1);
      return;
    }
    if (step.id === "answer") {
      goToStep(0);
      return;
    }
    if (!revealed) {
      revealed = true;
      if (step.id === "comparison") {
        const current = result();
        selectedPlanIndex = current.teachingPlans.indexOf(current.bestPlans[0]);
      }
      render();
    }
  }

  function openSettings() {
    Object.entries(state).forEach(([key, value]) => {
      const input = app.querySelector(`[data-setting='${key}']`);
      if (input) input.value = value;
    });
    settingsError.hidden = true;
    settingsError.textContent = "";
    settingsDialog.showModal();
  }

  function applySettings() {
    const next = {};
    Object.keys(defaults).forEach((key) => {
      next[key] = Number(app.querySelector(`[data-setting='${key}']`).value);
    });
    const wholeNonnegative = Number.isInteger(next.teachers) && next.teachers >= 0 && Number.isInteger(next.students) && next.students >= 0;
    const positive = [next.bigCapacity, next.bigPrice, next.smallCapacity, next.smallPrice].every((value) => Number.isInteger(value) && value > 0);
    if (!wholeNonnegative || !positive || next.teachers + next.students <= 0) {
      settingsError.textContent = copy("invalid");
      settingsError.hidden = false;
      return;
    }
    const nextResult = MathLabModels.quantity.vehicleRentalState(
      next.teachers,
      next.students,
      next.bigCapacity,
      next.bigPrice,
      next.smallCapacity,
      next.smallPrice
    );
    if (nextResult.teachingPlans.length > 20) {
      settingsError.textContent = copy("tooMany");
      settingsError.hidden = false;
      return;
    }
    Object.assign(state, next);
    settingsDialog.close();
    goToStep(0);
  }

  app.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === "prev") goToStep(stepIndex - 1);
      if (action === "next") goToStep(stepIndex + 1);
      if (action === "reveal") revealOrAdvance();
      if (action === "hint") {
        hintOpen = !hintOpen;
        render();
      }
      if (action === "edit") openSettings();
      if (action === "close-settings" || action === "cancel-settings") settingsDialog.close();
      if (action === "apply-settings") applySettings();
      if (action === "fullscreen") document.documentElement.requestFullscreen?.().catch(() => {});
    }

    const stepButton = event.target.closest("[data-step-index]");
    if (stepButton) goToStep(Number(stepButton.dataset.stepIndex));

    const planButton = event.target.closest("[data-plan-index]");
    if (planButton) {
      selectedPlanIndex = Number(planButton.dataset.planIndex);
      render();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (settingsDialog.open || /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement?.tagName || "")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (stepIndex > 0) goToStep(stepIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const steps = buildSteps(result());
      const step = steps[stepIndex];
      if (stepIndex < steps.length - 1 && (!step.requiresReveal || revealed)) goToStep(stepIndex + 1);
    }
    if (event.key === " ") {
      event.preventDefault();
      const steps = buildSteps(result());
      const step = steps[stepIndex];
      if (step.id === "intro" || step.id === "answer" || !revealed) revealOrAdvance();
      else if (stepIndex < steps.length - 1) goToStep(stepIndex + 1);
    }
  });

  MathLab.bindLanguageToggle(() => render());
  render();
})();
