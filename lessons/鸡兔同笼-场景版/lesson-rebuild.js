(() => {
  "use strict";

  const content = window.ChickenRabbitLessonContent;
  if (!content) throw new Error("ChickenRabbitLessonContent is unavailable.");

  const { steps, solved } = content;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const languageNames = { "zh-CN": "EN", "en-US": "中" };
  let language = "zh-CN";
  let currentStep = 0;

  const local = (value) => value[language === "zh-CN" ? "zh" : "en"];
  const isZh = () => language === "zh-CN";
  const n = (value) => String(value);

  function escapeText(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function deltaClass(active, kind = "reveal") {
    return active ? ` cr-delta cr-delta-${kind}` : "";
  }

  function chickenIcon(x, y, scale = 1) {
    return `
      <g class="cr-animal-icon" transform="translate(${x} ${y}) scale(${scale})" aria-hidden="true">
        <path class="cr-icon-chicken" d="M4 24C4 10 15 2 29 4c8 1 14 6 17 13 7 1 12 6 12 13 0 8-7 14-15 14H20C11 44 4 36 4 24Z"/>
        <path class="cr-icon-comb" d="M21 5c0-6 7-7 8-1 3-6 10-2 8 3"/>
        <circle class="cr-icon-eye" cx="39" cy="22" r="2.6"/>
        <path class="cr-icon-beak" d="m51 23 11 5-11 5Z"/>
        <path class="cr-icon-leg" d="M22 43v12m14-12v12M17 55h10m4 0h10"/>
      </g>`;
  }

  function rabbitIcon(x, y, scale = 1) {
    return `
      <g class="cr-animal-icon" transform="translate(${x} ${y}) scale(${scale})" aria-hidden="true">
        <path class="cr-icon-rabbit-ear" d="M18 17C10-5 18-12 28 13M43 17c8-22 0-29-10-4"/>
        <path class="cr-icon-rabbit" d="M7 28c0-12 10-20 24-20s25 8 25 22c0 15-10 25-25 25S7 45 7 28Z"/>
        <circle class="cr-icon-eye" cx="23" cy="29" r="2.6"/>
        <circle class="cr-icon-eye" cx="42" cy="29" r="2.6"/>
        <path class="cr-icon-nose" d="m33 34 5 4-5 4-5-4Z"/>
        <path class="cr-icon-mouth" d="M33 42v5m0 0c-4 0-7-2-8-5m8 5c4 0 7-2 8-5"/>
      </g>`;
  }

  function oneLegIcon(x, y, scale = 1) {
    return `
      <g class="cr-animal-icon" transform="translate(${x} ${y}) scale(${scale})" aria-hidden="true">
        <path class="cr-icon-horn" d="M18 10 14 1 27 7"/>
        <path class="cr-icon-one" d="M7 30C7 14 18 5 33 5c17 0 28 10 28 26 0 15-10 25-27 25S7 45 7 30Z"/>
        <path class="cr-icon-arm" d="m9 35-7 7m57-7 7 6"/>
        <path class="cr-icon-leg" d="M34 55v14M27 69h14"/>
        <circle class="cr-icon-eye" cx="24" cy="29" r="3"/>
        <circle class="cr-icon-eye" cx="43" cy="29" r="3"/>
        <circle class="cr-icon-cheek" cx="18" cy="38" r="3.2"/>
        <circle class="cr-icon-cheek" cx="49" cy="38" r="3.2"/>
        <path class="cr-icon-mouth" d="M25 39c5 6 12 6 17 0"/>
      </g>`;
  }

  function fourSnakeIcon(x, y, scale = 1) {
    return `
      <g class="cr-animal-icon" transform="translate(${x} ${y}) scale(${scale})" aria-hidden="true">
        <path class="cr-icon-horn" d="m18 13-2-10 12 7m27 0 7-8 3 13"/>
        <path class="cr-icon-snake" d="M6 31C6 16 18 8 34 9c9-7 21-4 26 5 12 0 19 8 18 19-1 14-12 22-28 22H25C13 55 6 45 6 31Z"/>
        <path class="cr-icon-tail" d="M76 34q11 2 8 12"/>
        <circle class="cr-icon-eye" cx="50" cy="28" r="2.8"/>
        <circle class="cr-icon-eye" cx="64" cy="28" r="2.8"/>
        <path class="cr-icon-mouth" d="M51 38q7 6 14 0"/>
        <path class="cr-icon-leg" d="M18 51v15m14-12v14m17-14v14m14-17v15M13 66h10m4 2h10m7 0h10m4-2h10"/>
      </g>`;
  }

  function legPaths(x, y, lowLegs, high, scale = 1, delta = false) {
    const spread = lowLegs === 1 ? [0] : [-12, 12];
    const base = spread
      .map((offset) => `<path class="cr-leg cr-leg-low${deltaClass(delta, "draw")}" d="M${x + offset * scale} ${y + 22 * scale} L${x + offset * 1.28 * scale} ${y + 68 * scale}"/>`)
      .join("");
    if (!high) return base;

    const extraOffsets = lowLegs === 1 ? [-13, 13, 0] : [-4, 4];
    const extra = extraOffsets
      .map((offset, index) => {
        const endOffset = offset + (index % 2 === 0 ? -4 : 4);
        return `<path class="cr-leg cr-leg-high${deltaClass(delta, "draw")}" d="M${x + offset * scale} ${y + 22 * scale} L${x + endOffset * scale} ${y + 69 * scale}"/>`;
      })
      .join("");
    return base + extra;
  }

  function unit(x, y, options = {}) {
    const {
      lowLegs = 2,
      high = false,
      scale = 1,
      headOnly = false,
      deltaHead = false,
      deltaLegs = false,
      muted = false
    } = options;
    return `
      <g class="cr-unit${high ? " is-high" : ""}${muted ? " is-muted" : ""}">
        <circle class="cr-head${deltaClass(deltaHead, "pop")}" cx="${x}" cy="${y}" r="${25 * scale}"/>
        ${headOnly ? "" : legPaths(x, y, lowLegs, high, scale, deltaLegs)}
      </g>`;
  }

  function topBrace(x1, x2, y, label, active = false) {
    const mid = (x1 + x2) / 2;
    return `
      <path class="cr-brace${deltaClass(active, "draw")}" d="M${x1} ${y}q0-15 18-15h${mid - x1 - 38}q16 0 20-20q4 20 20 20h${x2 - mid - 38}q18 0 18 15"/>
      <text class="cr-brace-label${deltaClass(active)}" x="${mid}" y="${y - 42}" text-anchor="middle">${escapeText(label)}</text>`;
  }

  function bottomBrace(x1, x2, y, label, tone = "", active = false) {
    const mid = (x1 + x2) / 2;
    return `
      <path class="cr-brace ${tone}${deltaClass(active, "draw")}" d="M${x1} ${y}q0 15 18 15h${mid - x1 - 38}q16 0 20 20q4-20 20-20h${x2 - mid - 38}q18 0 18-15"/>
      <text class="cr-brace-label ${tone}${deltaClass(active)}" x="${mid}" y="${y + 52}" text-anchor="middle">${escapeText(label)}</text>`;
  }

  function formula(x, y, text, options = {}) {
    const { tone = "", active = false, anchor = "start", size = "normal", pulse = false } = options;
    return `<text class="cr-formula ${tone} is-${size}${deltaClass(active, "write")}${pulse ? " is-pulse" : ""}" x="${x}" y="${y}" text-anchor="${anchor}">${escapeText(text)}</text>`;
  }

  function label(x, y, text, options = {}) {
    const { tone = "", active = false, anchor = "start", size = "normal" } = options;
    return `<text class="cr-label ${tone} is-${size}${deltaClass(active)}" x="${x}" y="${y}" text-anchor="${anchor}">${escapeText(text)}</text>`;
  }

  function arrow(x1, y1, x2, y2, active = false, vertical = false) {
    const marker = vertical ? "url(#cr-arrow-down)" : "url(#cr-arrow)";
    return `<path class="cr-arrow${deltaClass(active, "draw")}" d="M${x1} ${y1} L${x2} ${y2}" marker-end="${marker}"/>`;
  }

  function checkMark(x, y, active = false) {
    return `
      <g class="cr-check${deltaClass(active, "pop")}" transform="translate(${x} ${y})">
        <circle r="16"/>
        <path d="m-7 0 5 6L9-7"/>
      </g>`;
  }

  function handCircle(x, y, width, height, active = false) {
    return `<ellipse class="cr-hand-circle${deltaClass(active, "draw")}" cx="${x}" cy="${y}" rx="${width / 2}" ry="${height / 2}" transform="rotate(-2 ${x} ${y})"/>`;
  }

  function redBox(x, y, width, height, active = false) {
    return `<rect class="cr-red-box${deltaClass(active, "draw")}" x="${x}" y="${y}" width="${width}" height="${height}" rx="8" pathLength="1"/>`;
  }

  function sceneHeading(title, subtitle = "", options = {}) {
    const { active = false, center = false } = options;
    const x = center ? 700 : 305;
    return `
      <text class="cr-scene-heading${deltaClass(active, "write")}" x="${x}" y="48" text-anchor="${center ? "middle" : "start"}">${escapeText(title)}</text>
      ${subtitle ? `<text class="cr-scene-subheading" x="${x}" y="78" text-anchor="${center ? "middle" : "start"}">${escapeText(subtitle)}</text>` : ""}`;
  }

  function animalPair(problemKey, x = 78, y = 86) {
    if (problemKey === "transfer") {
      return oneLegIcon(x, y, 0.78) + fourSnakeIcon(x + 88, y + 12, 0.72);
    }
    return chickenIcon(x, y + 4, 0.82) + rabbitIcon(x + 88, y, 0.82);
  }

  function anchor(problemKey, scene, options = {}) {
    const p = solved[problemKey];
    const { intro = false, focusHeads = false, focusLegs = false, circles = "" } = options;
    const low = local(p.lowName);
    const high = local(p.highName);
    const headsText = isZh() ? `${p.heads} 只` : `${p.heads} animals`;
    const legsText = isZh() ? `${p.legs} 条腿` : `${p.legs} legs`;
    const question = isZh()
      ? `${low}和${high}各有多少只？`
      : `How many ${low}s and ${high}s?`;
    return `
      <g class="cr-anchor">
        ${animalPair(problemKey)}
        <path class="cr-anchor-brace" d="M64 159q0 15 17 15h41q14 0 18 18 4-18 18-18h42q17 0 17-15"/>
        <text class="cr-anchor-number${focusHeads ? " is-pulse" : ""}" x="140" y="222" text-anchor="middle">${headsText}</text>
        <text class="cr-anchor-number${focusLegs ? " is-pulse" : ""}" x="140" y="266" text-anchor="middle">${legsText}</text>
        ${focusHeads || circles.includes("heads") ? handCircle(140, 214, 130, 45, scene === 1 || circles === "heads") : ""}
        ${focusLegs || circles.includes("legs") ? handCircle(140, 258, 146, 45, circles === "legs") : ""}
        ${intro ? `
          <path class="cr-anchor-rule" d="M57 304H223"/>
          ${label(58, 340, isZh() ? "已知" : "KNOWN", { tone: "is-muted", size: "small" })}
          ${label(58, 376, isZh() ? `共有 ${p.heads} 只，${p.legs} 条腿` : `${p.heads} animals, ${p.legs} legs`, { size: "medium" })}
          ${label(58, 432, isZh() ? "要找" : "FIND", { tone: "is-muted", size: "small" })}
          ${label(58, 468, question, { size: "medium" })}
        ` : `
          ${label(58, 326, isZh() ? "已知总量" : "GIVEN TOTALS", { tone: "is-muted", size: "small" })}
          ${label(58, 360, isZh() ? "头数不变" : "Heads stay fixed", { size: "medium" })}
        `}
      </g>`;
  }

  function fullProblem(problemKey, active = false) {
    const p = solved[problemKey];
    const low = local(p.lowName);
    const high = local(p.highName);
    const line1 = isZh()
      ? `笼子里有${low}和${high}，一共 ${p.heads} 只。`
      : `A cage holds ${low}s and ${high}s, ${p.heads} animals in all.`;
    const line2 = isZh()
      ? `它们一共有 ${p.legs} 条腿。`
      : `Together they have ${p.legs} legs.`;
    const task = isZh()
      ? `求：${low}和${high}各有多少只？`
      : `Find the number of ${low}s and ${high}s.`;
    if (!isZh() && problemKey === "transfer") {
      return `
        ${sceneHeading("Read the whole problem", "", { active })}
        <g class="${deltaClass(active)}">
          <text class="cr-problem-line" x="326" y="146">A cage holds one-legged creatures</text>
          <text class="cr-problem-line" x="326" y="198">and four-legged snakes, 30 animals in all.</text>
          <text class="cr-problem-line" x="326" y="250">Together they have 90 legs.</text>
          <path class="cr-problem-rule" d="M326 292H1070"/>
          <text class="cr-problem-task" x="326" y="350">Find how many one-legged creatures</text>
          <text class="cr-problem-task" x="326" y="400">and four-legged snakes there are.</text>
          <text class="cr-problem-prompt" x="326" y="468">First restate: What is known? What must we find?</text>
        </g>`;
    }
    return `
      ${sceneHeading(isZh() ? "先读懂题目" : "Read the whole problem", "", { active })}
      <g class="${deltaClass(active)}">
        <text class="cr-problem-line" x="326" y="164">${escapeText(line1)}</text>
        <text class="cr-problem-line" x="326" y="224">${escapeText(line2)}</text>
        <path class="cr-problem-rule" d="M326 270H1070"/>
        <text class="cr-problem-task" x="326" y="342">${escapeText(task)}</text>
        <text class="cr-problem-prompt" x="326" y="430">${escapeText(isZh() ? "请先说一说：知道什么？要找什么？" : "First restate: What is known? What must we find?")}</text>
      </g>`;
  }

  function smallRow(scene, options = {}) {
    const { lowerCopies = false } = options;
    let highCount = 0;
    if (scene >= 14 && scene <= 22) highCount = Math.min(scene - 13, 3);
    if (scene >= 17 && scene <= 22) highCount = 3;
    if (scene >= 24) highCount = Math.min(scene - 23, 3);
    if (scene === 23) highCount = 0;
    const row = Array.from({ length: 10 }, (_, index) => {
      const high = !lowerCopies && index < highCount && scene <= 22;
      return unit(325 + index * 78, 157, {
        lowLegs: 2,
        high,
        headOnly: scene < 8,
        deltaHead: scene === 2,
        deltaLegs: scene === 8 || (high && scene === 13 + highCount)
      });
    }).join("");
    if (!lowerCopies || scene < 24) return row;
    const copies = Array.from({ length: highCount }, (_, index) => {
      const x = 325 + index * 78;
      return `
        ${arrow(x, 238, x, 319, scene === 24 + index, true)}
        ${unit(x, 354, { lowLegs: 2, high: true, scale: 0.82, deltaLegs: scene === 24 + index })}
        ${label(x, 444, "+2", { tone: "is-alert", anchor: "middle", active: scene === 24 + index, size: "medium" })}
      `;
    }).join("");
    return row + copies;
  }

  function specimen(x, y, lowLegs, high, name, active, question = false) {
    return `
      <g>
        ${unit(x, y, { lowLegs, high, scale: 1.25, headOnly: question, deltaLegs: active })}
        ${question ? label(x, y + 102, "?", { tone: "is-question", anchor: "middle", active, size: "large" }) : ""}
        ${!question ? label(x, y + 126, name, { anchor: "middle", active, size: "medium" }) : ""}
      </g>`;
  }

  function transformDemo(x, y, lowLegs, change, activeScene, scene, names = {}) {
    const isOne = lowLegs === 1;
    const plusScene = names.plusScene ?? activeScene + 1;
    const lowText = names.low || (isZh() ? `${lowLegs} 条腿` : `${lowLegs} ${lowLegs === 1 ? "leg" : "legs"}`);
    const highText = names.high || (isZh() ? `${lowLegs + change} 条腿` : `${lowLegs + change} legs`);
    return `
      ${unit(x, y, { lowLegs, high: false, scale: 0.9 })}
      ${names.hideLabels ? "" : label(x, y + 96, lowText, { anchor: "middle", size: "small" })}
      ${arrow(x + 74, y + 28, x + 210, y + 28, scene === activeScene)}
      ${scene >= plusScene ? label(x + 142, y - 8, `+${change}`, { tone: "is-alert", anchor: "middle", active: scene === plusScene, size: "large" }) : ""}
      ${unit(x + 286, y, { lowLegs, high: true, scale: 0.9, deltaLegs: scene === activeScene })}
      ${names.hideLabels ? "" : label(x + 286, y + 96, highText, { anchor: "middle", size: "small" })}
    `;
  }

  function renderSmall(scene) {
    const p = solved.small;
    if (scene === 0) return anchor("small", scene, { intro: true }) + fullProblem("small", true);

    let body = anchor("small", scene, {
      focusHeads: scene === 1,
      focusLegs: scene === 10
    });
    if (scene === 1) {
      body += sceneHeading(isZh() ? "先看“10 只”" : "Focus on the 10 animals", isZh() ? "每只动物都有一个头" : "Every animal has one head", { active: true });
      body += label(706, 286, isZh() ? "10 只 ＝ 10 个头" : "10 animals = 10 heads", { anchor: "middle", active: true, size: "large" });
      return body;
    }

    if (scene >= 2 && scene <= 2) {
      body += sceneHeading(isZh() ? "一个圆，表示一个头" : "One circle represents one head", "", { active: true });
      body += smallRow(scene);
      body += topBrace(296, 1052, 115, isZh() ? "10 个头" : "10 heads", true);
      return body;
    }

    if (scene >= 3 && scene <= 6) {
      body += sceneHeading(isZh() ? "同一个头，腿数不同" : "Same kind of head, different legs");
      body += `<g class="cr-faint-row">${smallRow(2)}</g>`;
      body += specimen(500, 338, 2, false, isZh() ? "鸡：2 条腿" : "Chicken: 2 legs", scene === 4, scene === 3);
      if (scene >= 5) body += specimen(830, 338, 2, scene >= 6, isZh() ? "兔：4 条腿" : "Rabbit: 4 legs", scene === 6, scene === 5);
      if (scene >= 6) body += label(665, 520, isZh() ? "兔比鸡多 2 条腿" : "A rabbit has 2 more legs", { tone: "is-alert", anchor: "middle", active: true, size: "medium" });
      return body;
    }

    if (scene >= 7 && scene <= 21) {
      body += sceneHeading(
        scene < 12 ? (isZh() ? "假设：10 只全是鸡" : "Assume all 10 are chickens") : (isZh() ? "调整：把鸡逐只变成兔" : "Adjust: change chickens into rabbits"),
        ""
      );
      body += smallRow(scene);
      body += topBrace(296, 1052, 115, isZh() ? "10 只" : "10 animals", scene === 7);

      if (scene >= 9) {
        body += formula(326, scene >= 17 ? 365 : 318, isZh() ? "假设：10×2＝20条" : "Assume: 10×2 = 20 legs", {
          tone: "is-low",
          active: scene === 9,
          pulse: scene === 10
        });
      }
      if (scene >= 11) {
        body += formula(680, scene >= 17 ? 365 : 318, isZh() ? "比较：26−20＝6条" : "Compare: 26−20 = 6 legs", {
          tone: "is-alert",
          active: scene === 11,
          pulse: scene === 10
        });
      }
      if (scene >= 13 && scene <= 13) {
        body += transformDemo(470, 390, 2, 2, 13, 13, {
          low: isZh() ? "鸡：2 条腿" : "Chicken: 2 legs",
          high: isZh() ? "兔：4 条腿" : "Rabbit: 4 legs",
          plusScene: 13
        });
        body += label(760, 548, isZh() ? "一次调整，多 2 条腿" : "One adjustment adds 2 legs", { tone: "is-alert", anchor: "middle", active: true, size: "medium" });
      }
      if (scene >= 14 && scene <= 16) {
        const count = scene - 13;
        body += label(690, 404, isZh() ? `已调整 ${count} 次，共补 ${count * 2} 条` : `${count} adjustment${count > 1 ? "s" : ""}, ${count * 2} legs added`, {
          tone: "is-alert",
          anchor: "middle",
          active: true,
          size: "large"
        });
        body += label(690, 454, isZh() ? `还差 ${6 - count * 2} 条` : `${6 - count * 2} legs still missing`, { anchor: "middle", active: true, size: "medium" });
      }
      if (scene >= 17) {
        body += bottomBrace(300, 502, 268, isZh() ? "3 只兔" : "3 rabbits", "is-high", scene === 17);
      }
      if (scene >= 18) {
        body += bottomBrace(520, 1056, 268, isZh() ? "7 只鸡" : "7 chickens", "is-low", scene === 18);
        body += formula(360, 410, isZh() ? "10−3＝7只鸡" : "10−3 = 7 chickens", { active: scene === 18 });
      }
      if (scene >= 19) {
        const text = scene >= 20
          ? (isZh() ? "检验：3×4＋7×2＝26条" : "Check: 3×4 + 7×2 = 26 legs")
          : (isZh() ? "检验：3×4＋7×2" : "Check: 3×4 + 7×2");
        body += formula(360, 488, text, { active: scene === 19 || scene === 20, size: "large" });
      }
      if (scene >= 20) {
        body += checkMark(835, 478, scene === 20);
        body += label(865, 485, isZh() ? "头数、腿数都符合" : "Heads and legs both match", { tone: "is-success", active: scene === 20, size: "small" });
      }
      if (scene >= 21) {
        body += `<path class="cr-answer-line${deltaClass(true, "draw")}" d="M385 558Q690 542 1015 558"/>`;
        body += label(700, 552, isZh() ? "鸡有 7 只，兔有 3 只。" : "7 chickens and 3 rabbits.", { tone: "is-answer", anchor: "middle", active: true, size: "large" });
      }
      return body;
    }

    body += sceneHeading(isZh() ? "回看：一次一次地调整" : "Rewind: adjust one unit at a time");
    body += smallRow(scene, { lowerCopies: true });
    body += topBrace(296, 1052, 115, isZh() ? "仍然是 10 个头" : "Still 10 heads");
    if (scene === 22) {
      body += label(690, 468, isZh() ? "先擦去答案，只看变化过程" : "Clear the answer and watch the change", { anchor: "middle", active: true, size: "large" });
    }
    if (scene === 23) {
      body += label(690, 302, isZh() ? "回到全鸡：20 条腿" : "Back to all chickens: 20 legs", { tone: "is-low", anchor: "middle", active: true, size: "large" });
    }
    if (scene >= 24) {
      body += formula(770, 404, isZh() ? `20＋${Math.min(scene - 23, 3)}×2${scene >= 26 ? "＝26条" : ""}` : `20 + ${Math.min(scene - 23, 3)}×2${scene >= 26 ? " = 26 legs" : ""}`, {
        tone: "is-alert",
        active: scene >= 24 && scene <= 26,
        size: "large"
      });
    }
    if (scene >= 27) {
      body += redBox(282, 248, 790, 250, true);
      body += label(677, 535, isZh() ? "每调整 1 次，总腿数增加 2 条" : "Each adjustment adds 2 legs", { tone: "is-alert", anchor: "middle", active: true, size: "large" });
    }
    return body;
  }

  function compressedRow(problemKey, scene, milestones) {
    const p = solved[problemKey];
    const xs = [338, 410, 482, 554, 762, 834, 906, 978];
    const y = 146;
    const headOnly = scene < milestones.legs;
    const units = xs.map((x) => unit(x, y, {
      lowLegs: p.lowLegs,
      headOnly,
      deltaHead: scene === milestones.heads,
      deltaLegs: scene === milestones.legs
    })).join("");
    return units + `<text class="cr-ellipsis" x="657" y="160" text-anchor="middle">•••</text>`;
  }

  function renderFormal(scene) {
    const p = solved.formal;
    if (scene === 0) return anchor("formal", scene, { intro: true }) + fullProblem("formal", true);

    let body = anchor("formal", scene, { focusHeads: scene === 2, focusLegs: scene === 6 });
    const title = scene >= 21 ? (isZh() ? "假设法" : "Assumption Method") : (isZh() ? "35 头 94 腿" : "35 heads and 94 legs");
    body += sceneHeading(title, scene >= 21 ? (isZh() ? "先假设，再比较、调整、检验" : "Assume, compare, adjust, and check") : "", { active: scene === 21, center: scene >= 21 });
    body += compressedRow("formal", scene, { heads: 1, legs: 4 });
    if (scene >= 2) body += topBrace(306, 1010, 107, isZh() ? "35 只" : "35 animals", scene === 2);
    if (scene >= 3) body += bottomBrace(306, 1010, 232, isZh() ? "实际：94 条腿" : "Actual: 94 legs", "is-alert", scene === 3);
    if (scene === 4) body += label(658, 305, isZh() ? "假设：全部是鸡" : "Assume: all chickens", { tone: "is-low", anchor: "middle", active: true, size: "medium" });
    if (scene >= 5) body += formula(322, 335, isZh() ? "35×2＝70条" : "35×2 = 70 legs", { tone: "is-low", active: scene === 5, pulse: scene === 6 });
    if (scene >= 7) body += formula(675, 335, isZh() ? "比较：94−70＝24条" : "Compare: 94−70 = 24 legs", { tone: "is-alert", active: scene === 7, pulse: scene === 6 });
    if (scene >= 8) body += label(322, 398, isZh() ? "调整：" : "Adjust:", { tone: "is-muted", active: scene === 8, size: "medium" });
    if (scene >= 9) {
      body += transformDemo(438, 420, 2, 2, 10, scene, {
        low: isZh() ? "鸡：2 条腿" : "Chicken: 2 legs",
        high: isZh() ? "兔：4 条腿" : "Rabbit: 4 legs",
        hideLabels: scene >= 12
      });
      if (scene === 9) body += `<path class="cr-extract-path${deltaClass(true, "draw")}" d="M338 218Q350 315 438 380" marker-end="url(#cr-arrow)"/>`;
    }
    if (scene >= 12) {
      const rabbitText = scene >= 13
        ? (isZh() ? "24÷2＝12只兔" : "24÷2 = 12 rabbits")
        : "24÷2";
      body += formula(790, 420, rabbitText, { active: scene === 12 || scene === 13, size: "medium" });
    }
    if (scene >= 14) body += formula(790, 468, isZh() ? "35−12＝23只鸡" : "35−12 = 23 chickens", { active: scene === 14, size: "medium" });
    if (scene >= 15) {
      const verifyText = scene >= 16
        ? (isZh() ? "检验：12×4＋23×2＝94条" : "Check: 12×4 + 23×2 = 94 legs")
        : (isZh() ? "检验：12×4＋23×2" : "Check: 12×4 + 23×2");
      body += formula(365, 557, verifyText, { active: scene === 15 || scene === 16, size: "large" });
      if (scene >= 16) {
        body += checkMark(820, 548, scene === 16);
        body += label(850, 555, isZh() ? "35 个头、94 条腿都符合" : "Both 35 heads and 94 legs match", { tone: "is-success", active: scene === 16, size: "small" });
      }
    }
    if (scene >= 17) body += redBox(286, 86, 750, 180, scene === 17);
    if (scene >= 18) body += redBox(648, 298, 388, 62, scene === 18);
    if (scene >= 19) body += redBox(288, 365, 750, 128, scene === 19);
    if (scene >= 20) body += redBox(332, 518, 704, 60, scene === 20);
    return body;
  }

  function renderTransfer(scene, summaryScene = null) {
    const p = solved.transfer;
    const isSummary = summaryScene !== null;
    if (!isSummary && scene === 0) return anchor("transfer", scene, { intro: true }) + fullProblem("transfer", true);

    const activeScene = isSummary ? summaryScene : scene;
    let body = anchor("transfer", scene, {
      focusHeads: false,
      focusLegs: false,
      circles: isSummary && activeScene >= 3 ? (activeScene >= 4 ? "heads legs" : "heads") : ""
    });
    const title = isSummary
      ? (activeScene >= 5
        ? (isZh() ? "假设法解鸡兔同笼—头和与腿和" : "Assumption Method — Head and Leg Totals")
        : (isZh() ? "假设法解鸡兔同笼" : "Assumption Method for Head-and-Leg Problems"))
      : (isZh() ? "30 头 90 腿：换了对象，结构不变" : "30 heads, 90 legs: new objects, same structure");
    body += sceneHeading(title, isSummary ? (isZh() ? "对象名称可以变，数量关系不变" : "Names may change; the relationship remains") : "", { active: isSummary && (activeScene === 0 || activeScene === 5), center: isSummary });
    body += `<g class="${isSummary ? "cr-summary-scene" : ""}">`;
    body += compressedRow("transfer", scene, { heads: 1, legs: 2 });
    if (scene >= 1) body += topBrace(306, 1010, 107, isSummary ? "" : (isZh() ? "30 只" : "30 animals"), !isSummary && scene === 1);
    if (scene >= 1) body += bottomBrace(306, 1010, 232, isZh() ? "实际：90 条腿" : "Actual: 90 legs", "is-alert");
    if (!isSummary && scene === 2) body += label(658, 305, isZh() ? "假设：全是一腿兽" : "Assume: all one-legged creatures", { tone: "is-low", anchor: "middle", active: true, size: "medium" });
    if (scene >= 3) body += formula(322, 335, isZh() ? "30×1＝30条" : "30×1 = 30 legs", { tone: "is-low", active: !isSummary && scene === 3 });
    if (scene >= 4) body += formula(665, 335, isZh() ? "比较：90−30＝60条" : "Compare: 90−30 = 60 legs", { tone: "is-alert", active: !isSummary && scene === 4, pulse: isSummary && activeScene === 1 });
    if (scene >= 5) {
      body += transformDemo(438, 420, 1, 3, 6, scene, {
        low: isZh() ? "一腿兽：1 条腿" : "One-legged: 1 leg",
        high: isZh() ? "四腿蛇：4 条腿" : "Four-legged: 4 legs",
        plusScene: 6,
        hideLabels: scene >= 7
      });
      if (!isSummary && scene === 5) body += `<path class="cr-extract-path${deltaClass(true, "draw")}" d="M338 218Q350 315 438 380" marker-end="url(#cr-arrow)"/>`;
    }
    if (scene >= 7) body += formula(790, 420, isZh() ? "60÷3＝20只四腿蛇" : "60÷3 = 20 four-legged snakes", { active: !isSummary && scene === 7, size: "medium" });
    if (scene >= 8) body += formula(790, 468, isZh() ? "30−20＝10只一腿兽" : "30−20 = 10 one-legged creatures", { active: !isSummary && scene === 8, size: "medium" });
    if (scene >= 9) {
      const text = scene >= 10
        ? (isZh() ? "检验：20×4＋10×1＝90条" : "Check: 20×4 + 10×1 = 90 legs")
        : (isZh() ? "检验：20×4＋10×1" : "Check: 20×4 + 10×1");
      body += formula(365, 557, text, { active: !isSummary && (scene === 9 || scene === 10), pulse: isSummary && activeScene === 2, size: "large" });
      if (scene >= 10) {
        body += checkMark(820, 548, !isSummary && scene === 10);
        body += label(850, 555, isZh() ? "30 个头、90 条腿都符合" : "Both 30 heads and 90 legs match", { tone: "is-success", size: "small" });
      }
    }
    body += `</g>`;
    if (!isSummary && scene >= 11) {
      body += `
        <g class="cr-feedback${deltaClass(true, "pop")}" transform="translate(260 520)">
          <circle r="24"/>
          <circle cx="-8" cy="-4" r="2.5"/>
          <circle cx="8" cy="-4" r="2.5"/>
          <path d="M-10 7q10 10 20 0"/>
        </g>`;
    }
    if (isSummary && activeScene === 1) body += redBox(642, 296, 395, 62, true);
    if (isSummary && activeScene === 2) body += redBox(332, 518, 704, 60, true);
    if (isSummary && activeScene >= 3) {
      body += handCircle(140, 214, 130, 45, activeScene === 3);
      body += label(240, 218, isZh() ? "头和" : "head total", { tone: "is-alert", active: activeScene === 3, size: "small" });
    }
    if (isSummary && activeScene >= 4) {
      body += handCircle(140, 258, 146, 45, activeScene === 4);
      body += label(240, 264, isZh() ? "腿和" : "leg total", { tone: "is-alert", active: activeScene === 4, size: "small" });
    }
    return body;
  }

  function renderScene(step) {
    if (step.phase === "small") return renderSmall(step.scene);
    if (step.phase === "formal") return renderFormal(step.scene);
    if (step.phase === "transfer") return renderTransfer(step.scene);
    return renderTransfer(11, step.scene);
  }

  document.body.innerHTML = `
    <a class="cr-skip-link" href="#cr-stage">${isZh() ? "跳到讲题舞台" : "Skip to lesson stage"}</a>
    <main class="cr-app" data-cr-app>
      <header class="cr-header">
        <div class="cr-brand">
          <a class="cr-icon-button" href="../../index.html" data-back aria-label="${isZh() ? "返回课程目录" : "Back to course catalog"}">←</a>
          <div>
            <p>${isZh() ? "Math Motion Lab · 教师点击课件" : "Math Motion Lab · Teacher-paced lesson"}</p>
            <h1>${isZh() ? "鸡兔同笼" : "Chickens and Rabbits"}</h1>
          </div>
        </div>
        <div class="cr-tools">
          <span class="cr-chapter" data-chapter></span>
          <button class="cr-tool-button" type="button" data-language>${languageNames[language]}</button>
          <button class="cr-tool-button" type="button" data-fullscreen>${isZh() ? "全屏" : "Full screen"}</button>
        </div>
      </header>

      <section class="cr-question-bar" aria-live="polite">
        <span class="cr-question-index" data-question-index></span>
        <strong data-step-title></strong>
        <span class="cr-question-copy" data-question></span>
      </section>

      <section id="cr-stage" class="cr-stage" role="button" tabindex="0" data-stage aria-describedby="cr-stage-hint">
        <svg class="cr-canvas" viewBox="0 0 1120 600" role="img" aria-labelledby="cr-svg-title cr-svg-desc">
          <title id="cr-svg-title">${isZh() ? "鸡兔同笼动态讲解舞台" : "Animated chickens and rabbits lesson stage"}</title>
          <desc id="cr-svg-desc" data-svg-desc></desc>
          <defs>
            <filter id="cr-paper-shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#73562c" flood-opacity=".14"/>
            </filter>
            <pattern id="cr-paper-grain" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M3 18c14-4 25 4 39-1M26 52c12-5 26 3 41-2M-8 36c10-3 18 2 28-1" fill="none" stroke="#765c34" stroke-opacity=".055" stroke-width="1.1"/>
              <circle cx="58" cy="22" r="1" fill="#765c34" fill-opacity=".06"/>
              <circle cx="14" cy="63" r=".8" fill="#fff" fill-opacity=".45"/>
            </pattern>
            <marker id="cr-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
              <path d="M0 0 12 6 0 12Z" class="cr-arrow-head"/>
            </marker>
            <marker id="cr-arrow-down" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
              <path d="M0 0 12 6 0 12Z" class="cr-arrow-head"/>
            </marker>
          </defs>
          <rect class="cr-paper" x="6" y="6" width="1108" height="588" rx="18" filter="url(#cr-paper-shadow)"/>
          <rect class="cr-grain" x="6" y="6" width="1108" height="588" rx="18" fill="url(#cr-paper-grain)"/>
          <path class="cr-stage-divider" d="M267 52V548"/>
          <g data-scene-layer></g>
        </svg>
        <span id="cr-stage-hint" class="cr-stage-hint">${isZh() ? "点击舞台空白处继续" : "Click the blank stage to continue"}</span>
      </section>

      <footer class="cr-footer">
        <button class="cr-nav-button" type="button" data-prev>
          <span aria-hidden="true">←</span><span data-prev-label>${isZh() ? "上一步" : "Previous"}</span>
        </button>
        <div class="cr-step-status" aria-live="polite">
          <strong data-step-count></strong>
          <span>${isZh() ? "每次点击只推进一个动作" : "One teaching action per click"}</span>
        </div>
        <button class="cr-nav-button is-primary" type="button" data-next>
          <span data-next-label>${isZh() ? "下一步" : "Next"}</span><span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>`;

  document.body.classList.add("cr-ready");

  const app = document.querySelector("[data-cr-app]");
  const stage = document.querySelector("[data-stage]");
  const sceneLayer = document.querySelector("[data-scene-layer]");
  const chapter = document.querySelector("[data-chapter]");
  const questionIndex = document.querySelector("[data-question-index]");
  const stepTitle = document.querySelector("[data-step-title]");
  const question = document.querySelector("[data-question]");
  const stepCount = document.querySelector("[data-step-count]");
  const svgDescription = document.querySelector("[data-svg-desc]");
  const previousButton = document.querySelector("[data-prev]");
  const nextButton = document.querySelector("[data-next]");
  const previousLabel = document.querySelector("[data-prev-label]");
  const nextLabel = document.querySelector("[data-next-label]");
  const languageButton = document.querySelector("[data-language]");
  const fullscreenButton = document.querySelector("[data-fullscreen]");
  const stageHint = document.querySelector(".cr-stage-hint");
  const brandEyebrow = document.querySelector(".cr-brand p");
  const brandTitle = document.querySelector(".cr-brand h1");
  const backButton = document.querySelector("[data-back]");
  const statusHint = document.querySelector(".cr-step-status span");

  function updateLanguageShell() {
    document.documentElement.lang = language;
    languageButton.textContent = languageNames[language];
    fullscreenButton.textContent = isZh() ? "全屏" : "Full screen";
    previousLabel.textContent = isZh() ? "上一步" : "Previous";
    brandEyebrow.textContent = isZh() ? "Math Motion Lab · 教师点击课件" : "Math Motion Lab · Teacher-paced lesson";
    brandTitle.textContent = isZh() ? "鸡兔同笼" : "Chickens and Rabbits";
    backButton.setAttribute("aria-label", isZh() ? "返回课程目录" : "Back to course catalog");
    stageHint.textContent = isZh() ? "点击舞台空白处继续" : "Click the blank stage to continue";
    statusHint.textContent = isZh() ? "每次点击只推进一个动作" : "One teaching action per click";
    document.querySelector(".cr-skip-link").textContent = isZh() ? "跳到讲题舞台" : "Skip to lesson stage";
    document.getElementById("cr-svg-title").textContent = isZh() ? "鸡兔同笼动态讲解舞台" : "Animated chickens and rabbits lesson stage";
  }

  function render() {
    const step = steps[currentStep];
    updateLanguageShell();
    chapter.textContent = local(step.chapter);
    questionIndex.textContent = isZh() ? `当前提问 ${currentStep + 1}` : `Question ${currentStep + 1}`;
    stepTitle.textContent = local(step.title);
    question.textContent = local(step.ask);
    stepCount.textContent = `${currentStep + 1} / ${steps.length}`;
    svgDescription.textContent = local(step.screen);
    sceneLayer.innerHTML = renderScene(step);
    previousButton.disabled = currentStep === 0;
    const isFinal = currentStep === steps.length - 1;
    nextLabel.textContent = isFinal
      ? (isZh() ? "重新讲解" : "Replay")
      : (isZh() ? "下一步" : "Next");
    stage.dataset.final = String(isFinal);
    stage.dataset.step = String(currentStep);
    stage.setAttribute("aria-label", `${local(step.title)}。${local(step.ask)}`);
  }

  function goTo(index) {
    const bounded = Math.max(0, Math.min(steps.length - 1, index));
    if (bounded === currentStep) return;
    currentStep = bounded;
    render();
  }

  function advance() {
    if (currentStep === steps.length - 1) {
      currentStep = 0;
      render();
      return;
    }
    goTo(currentStep + 1);
  }

  function isControl(target) {
    return target instanceof Element && Boolean(target.closest("button, a"));
  }

  stage.addEventListener("click", (event) => {
    if (!isControl(event.target) && currentStep < steps.length - 1) advance();
  });

  stage.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && currentStep < steps.length - 1) {
      event.preventDefault();
      event.stopPropagation();
      advance();
    }
  });

  previousButton.addEventListener("click", () => goTo(currentStep - 1));
  nextButton.addEventListener("click", advance);
  languageButton.addEventListener("click", () => {
    language = language === "zh-CN" ? "en-US" : "zh-CN";
    render();
  });
  fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await app.requestFullscreen();
  });

  document.addEventListener("keydown", (event) => {
    if (isControl(event.target)) return;
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      if (currentStep < steps.length - 1) advance();
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      goTo(currentStep - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(steps.length - 1);
    }
  });

  window.__chickenRabbitLesson = {
    get currentStep() {
      return currentStep;
    },
    get stepCount() {
      return steps.length;
    },
    goTo,
    advance,
    setLanguage(nextLanguage) {
      if (nextLanguage === "zh-CN" || nextLanguage === "en-US") {
        language = nextLanguage;
        render();
      }
    }
  };

  render();
})();
