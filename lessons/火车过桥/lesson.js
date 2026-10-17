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
    trainLengthInput: app.querySelector('[data-setting="train-length"]'),
    bridgeLengthInput: app.querySelector('[data-setting="bridge-length"]'),
    speedInput: app.querySelector('[data-setting="speed"]')
  };

  const copy = {
    "zh-CN": {
      eyebrow: "小学数学互动课堂",
      title: "火车过桥：为什么要多走一个车身长？",
      edit: "修改题目",
      fullscreen: "全屏讲解",
      questionLabel: "本页问题",
      boardLabel: "本页板书",
      prev: "上一页",
      next: "下一页",
      finish: "讲解完成",
      parameters: "题目参数",
      settingsTitle: "换一组数重新演示",
      settingsLead: "应用后会回到第1页，并重新生成每一步的路程和时间。",
      trainLengthLabel: "火车长度",
      bridgeLengthLabel: "大桥长度",
      speedLabel: "每秒行驶",
      metres: "米",
      metresPerSecond: "米/秒",
      methodTitle: "课堂演示提示",
      methodCopy: "优先选择能整除的数，动态计数会按整秒显示，学生更容易看清时间和路程的对应关系；不能整除时页面会显示最多两位小数。",
      cancel: "取消",
      apply: "应用并重新讲解",
      backLabel: "返回课程目录",
      closeLabel: "关闭",
      playMotion: "播放动态",
      pauseMotion: "暂停",
      replayMotion: "重新播放",
      elapsedTime: "已用时间",
      travelledDistance: "已走路程",
      extraTime: "额外时间",
      extraDistance: "额外路程",
      cuePrefix: "教师提示：",
      pageCount: (index, total) => `第 ${index} / ${total} 页`,
      progressLabel: (index, total, label) => `第${index}步，共${total}步：${label}`,
      invalidTrainLength: "火车长度请输入正整数。",
      invalidBridgeLength: "大桥长度请输入正整数。",
      invalidSpeed: "每秒行驶的米数请输入正整数。"
    },
    "en-US": {
      eyebrow: "Primary Maths Motion Lab",
      title: "A Train Crossing a Bridge: Why Add One Train Length?",
      edit: "Change values",
      fullscreen: "Full screen",
      questionLabel: "Question",
      boardLabel: "Working",
      prev: "Previous",
      next: "Next",
      finish: "Lesson complete",
      parameters: "Problem values",
      settingsTitle: "Try another set of values",
      settingsLead: "Applying the values returns to page 1 and rebuilds every distance and time.",
      trainLengthLabel: "Train length",
      bridgeLengthLabel: "Bridge length",
      speedLabel: "Distance travelled each second",
      metres: "metres",
      metresPerSecond: "metres/second",
      methodTitle: "Teaching tip",
      methodCopy: "Values that divide evenly produce whole-second motion counters, making the time-distance link easier to see. Other values are shown to at most two decimal places.",
      cancel: "Cancel",
      apply: "Apply and restart",
      backLabel: "Back to lesson catalog",
      closeLabel: "Close",
      playMotion: "Play motion",
      pauseMotion: "Pause",
      replayMotion: "Replay",
      elapsedTime: "Elapsed time",
      travelledDistance: "Distance travelled",
      extraTime: "Extra time",
      extraDistance: "Extra distance",
      cuePrefix: "Teacher cue: ",
      pageCount: (index, total) => `Page ${index} / ${total}`,
      progressLabel: (index, total, label) => `Step ${index} of ${total}: ${label}`,
      invalidTrainLength: "Enter a positive whole-number train length.",
      invalidBridgeLength: "Enter a positive whole-number bridge length.",
      invalidSpeed: "Enter a positive whole-number distance travelled each second."
    }
  };

  const state = {
    trainLength: 800,
    bridgeLength: 1600,
    speed: 40,
    slideIndex: 0,
    values: null,
    slides: []
  };

  const motion = {
    frameId: 0,
    playing: false,
    progress: 0,
    startedAt: 0,
    startedFrom: 0
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

  function metreUnit() {
    return tr("米", "m");
  }

  function secondUnit() {
    return tr("秒", "s");
  }

  function timeText(part) {
    const value = `${number(part.time)}${secondUnit()}`;
    return part.exactAtHundredth ? value : tr(`约${value}`, `about ${value}`);
  }

  function divisionSign(part) {
    return part.exactAtHundredth ? "=" : "≈";
  }

  function fullProblem(values) {
    return tr(
      `一列火车长${number(values.trainLength)}米，每秒行驶${number(values.speed)}米，要通过一座长${number(values.bridgeLength)}米的大桥。从车头刚上桥到车尾完全离开大桥，一共需要多少时间？`,
      `A train is ${number(values.trainLength)} metres long and travels ${number(values.speed)} metres each second. It must cross a bridge ${number(values.bridgeLength)} metres long. How long does it take from the moment the front enters the bridge until the rear has completely left it?`
    );
  }

  function buildSlides(values) {
    const train = number(values.trainLength);
    const bridge = number(values.bridgeLength);
    const speed = number(values.speed);
    const total = number(values.totalDistance);
    const personTime = timeText(values.personCrossing);
    const clearingTime = timeText(values.trainClearing);
    const totalTime = timeText(values.fullCrossing);
    const personEquation = `${bridge} ÷ ${speed} ${divisionSign(values.personCrossing)} ${number(values.personCrossing.time)}`;
    const clearingEquation = `${train} ÷ ${speed} ${divisionSign(values.trainClearing)} ${number(values.trainClearing.time)}`;
    const totalEquation = `(${bridge} + ${train}) ÷ ${speed} ${divisionSign(values.fullCrossing)} ${number(values.fullCrossing.time)}`;

    return [
      {
        id: "read",
        label: tr("读题", "Read"),
        title: tr("先看清开始时刻和结束时刻", "Identify the starting and ending moments"),
        question: tr("题目告诉了我们什么，要找什么？", "What do we know, and what must we find?"),
        explanation: tr("开始是车头刚上桥，结束是车尾完全离开大桥。先不急着计算。", "We start when the front enters the bridge and finish when the rear has completely left it. Do not calculate yet."),
        formulas: [tr(`火车长：${train}米`, `Train length: ${train} m`), tr(`大桥长：${bridge}米`, `Bridge length: ${bridge} m`), tr(`每秒行驶：${speed}米`, `Each second: ${speed} m`)],
        cue: tr("请学生复述已知条件，并用手势指出开始和结束时刻。", "Ask students to restate the facts and point to the start and finish moments.")
      },
      {
        id: "person-start",
        label: tr("人在桥头", "At start"),
        title: tr("先让一个人用同样的速度过桥", "First, let a walker cross at the same speed"),
        question: tr(`人从桥头出发，每秒走${speed}米，多久能走完全桥？`, `A walker starts at the bridge entrance and moves ${speed} metres each second. How long to cross?`),
        explanation: tr("这是帮助理解速度的假想实验。人看成一个位置点，整座桥一直完整显示。", "This is an imaginary model for understanding speed. Treat the walker as one position while the whole bridge stays visible."),
        formulas: [tr("起点：桥头0米处", "Start: 0 m at the bridge entrance"), tr(`每1秒：前进${speed}米`, `Every 1 second: move ${speed} m`)],
        cue: tr("先让学生指认桥头和桥尾，不显示除法。", "Have students identify both ends of the bridge. Do not introduce division yet.")
      },
      {
        id: "person-crossing",
        label: tr("人走过桥", "Walker moves"),
        title: tr("时间增加，走过的路程也跟着增加", "As time increases, distance increases with it"),
        question: tr("播放动态：人走了多久，就走了多远？", "Play the motion: how do time and distance grow together?"),
        explanation: tr(`小人始终在同一座完整的大桥上前进。每过1秒，时间加1秒，路程加${speed}米。`, `The walker moves along the same complete bridge. Every second adds 1 second of time and ${speed} metres of distance.`),
        formulas: [tr(`1秒 → ${speed}米`, `1 second → ${speed} m`), tr(`时间增加 → 路程按每秒${speed}米增加`, `More time → distance grows by ${speed} m each second`)],
        cue: tr("点击“播放动态”，中途可暂停，让学生读出当时的时间和路程。", "Select Play motion. Pause midway and ask students to read the time and distance.")
      },
      {
        id: "person-arrived",
        label: tr("人到桥尾", "Walker arrives"),
        title: tr("走完全桥后，再把过程写成除法", "After crossing, write the process as division"),
        question: tr(`整座桥有${bridge}米，每秒走${speed}米，一共有多少个1秒？`, `The bridge is ${bridge} m and each second covers ${speed} m. How many one-second parts are there?`),
        explanation: tr(`${bridge}米里有多少个“每秒走的${speed}米”，就需要多少秒。所以，时间等于路程除以每秒行驶的路程。`, `The number of ${speed}-metre one-second parts in ${bridge} metres is the number of seconds needed. So time equals distance divided by distance travelled each second.`),
        formulas: [tr("时间 = 1秒路程的个数", "Time = number of one-second distances"), tr("时间 = 路程 ÷ 每秒行驶的路程", "Time = distance ÷ distance travelled each second"), `${personEquation}${secondUnit()}`],
        cue: tr("让学生把除法读成“1600米里有几个40米”。", "Have students read the division as “how many 40-metre parts fit in 1600 metres?”")
      },
      {
        id: "train-before",
        label: tr("过桥前", "Before"),
        title: tr("换成火车：车头在桥头，整列车还在桥外", "Now use the train: its front is at the entrance"),
        question: tr("火车和刚才的人，有什么相同？又有什么不同？", "What is the same as the walker, and what is different?"),
        explanation: tr(`相同：都从桥头出发，速度都是每秒${speed}米。不同：火车有${train}米长。`, `Same: both start at the entrance and move ${speed} metres each second. Different: the train is ${train} metres long.`),
        formulas: [tr("车头位置：桥头", "Front position: bridge entrance"), tr(`车身长度：${train}米`, `Train length: ${train} m`)],
        cue: tr("请学生同时指出车头、车尾和桥头。", "Ask students to point to the front, rear, and bridge entrance.")
      },
      {
        id: "train-crossing",
        label: tr("过桥中", "Crossing"),
        title: tr("车头沿着整座桥前进到桥尾", "The front moves across the whole bridge"),
        question: tr("车头走到桥尾时，整列火车已经完全过桥了吗？", "When the front reaches the far end, has the whole train crossed?"),
        explanation: tr("播放动态观察车头、车尾和桥的位置。计数器只记录车头已经走过的路程和时间。", "Play the motion and watch the front, rear, and bridge. The counters track the front's distance and elapsed time."),
        formulas: [tr(`车头要走：${bridge}米`, `Front travels: ${bridge} m`), tr(`车头到桥尾：${personTime}`, `Front reaches the far end after ${personTime}`)],
        cue: tr("动画结束后先停住，不要马上翻页，让学生找车尾。", "At the end, pause and ask students to find the rear before moving on.")
      },
      {
        id: "train-critical",
        label: tr("看车尾", "Check rear"),
        title: tr("车头到桥尾了，车尾还在桥上", "The front is at the far end, but the rear is still on the bridge"),
        question: tr("车尾还要再走多远，才能完全离开大桥？", "How much farther must the rear move to leave the bridge?"),
        explanation: tr(`车头和车尾之间正好相隔一个车身长，所以车尾还差${train}米。整列火车还要再前进一个车身长。`, `The front and rear are one train length apart, so the rear still has ${train} metres to go. The whole train must move one more train length.`),
        formulas: [tr("还差：1个车身长", "Remaining: 1 train length"), tr(`额外路程：${train}米`, `Extra distance: ${train} m`)],
        cue: tr("沿着金色标线，从车尾指到桥尾，说明这段就是一列车长。", "Trace the gold line from the rear to the far end: it is exactly one train length.")
      },
      {
        id: "train-clearing",
        label: tr("完全离桥", "Rear leaves"),
        title: tr("火车再前进一个车身长，车尾才刚好离桥", "The train moves one more train length so the rear can leave"),
        question: tr(`播放动态：再走${train}米，还要多少时间？`, `Play the motion: how long does the extra ${train} m take?`),
        explanation: tr(`保留车头到桥尾时的淡色位置，再看火车整体向前移动${train}米。车尾到达桥尾，才算完全过桥。`, `Keep the pale position from when the front reached the far end, then move the whole train ${train} metres. The crossing ends only when the rear reaches the far end.`),
        formulas: [`${clearingEquation}${secondUnit()}`, tr(`额外时间：${clearingTime}`, `Extra time: ${clearingTime}`)],
        cue: tr("点击“播放动态”，重点观察车尾从桥上移动到桥尾。", "Select Play motion and focus on the rear moving from the bridge to the far end.")
      },
      {
        id: "answer",
        label: tr("验证答案", "Verify"),
        title: tr("桥长加车长，才是火车完全过桥的路程", "Bridge length plus train length is the complete crossing distance"),
        question: tr("现在怎样完整回答原题？", "How can we now answer the original problem completely?"),
        explanation: tr(`车头先走${bridge}米到桥尾，整列车再走${train}米让车尾离桥，共走${total}米。`, `The front travels ${bridge} m to the far end, then the whole train moves another ${train} m so the rear can leave: ${total} m altogether.`),
        formulas: [`${bridge} + ${train} = ${total}${metreUnit()}`, `${totalEquation}${secondUnit()}`, values.fullCrossing.exactAtHundredth ? `${number(values.fullCrossing.time)} × ${speed} = ${total}${metreUnit()}` : tr(`完整时间：${totalTime}`, `Complete time: ${totalTime}`), tr(`答：需要${totalTime}。`, `Answer: It takes ${totalTime}.`)],
        cue: tr("用乘法倒推完整路程，确认桥长和车长都没有漏。", "Multiply back to confirm that both the bridge and train lengths are included."),
        answer: true
      }
    ];
  }

  function svgDefs() {
    return `
      <defs>
        <marker id="arrow-teal" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10Z" fill="#0f8f84" />
        </marker>
        <marker id="arrow-gold" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10Z" fill="#e2a52f" />
        </marker>
      </defs>
    `;
  }

  function sceneMetrics(values) {
    const bridgeX = 300;
    const bridgeWidth = 420;
    const rawTrainWidth = bridgeWidth * (values.trainLength / values.bridgeLength);
    const trainWidth = Math.max(120, Math.min(250, rawTrainWidth));
    return {
      bridgeX,
      bridgeWidth,
      bridgeEnd: bridgeX + bridgeWidth,
      trainWidth,
      compressed: Math.abs(trainWidth - rawTrainWidth) > 0.5
    };
  }

  function bridgeMarkup(x, y, width) {
    const posts = Array.from({ length: 9 }, (_, index) => x + (width * index) / 8)
      .map((postX) => `<line class="bridge-rail" x1="${postX}" y1="${y - 50}" x2="${postX}" y2="${y - 4}" />`)
      .join("");
    const supports = [x + width * 0.18, x + width * 0.5, x + width * 0.82]
      .map((supportX) => `<path class="bridge-support" d="M${supportX - 28} ${y + 17} L${supportX} ${y + 92} L${supportX + 28} ${y + 17}" />`)
      .join("");
    return `
      <rect class="sky-field" x="${x - 24}" y="${y - 86}" width="${width + 48}" height="190" rx="22" />
      <path class="water-line" d="M${x - 40} ${y + 102} q24 -12 48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t48 0" />
      <rect class="bridge-deck" x="${x}" y="${y - 8}" width="${width}" height="30" rx="4" />
      <line class="bridge-rail" x1="${x}" y1="${y - 50}" x2="${x + width}" y2="${y - 50}" />
      ${posts}
      ${supports}
      <line class="bridge-post" x1="${x}" y1="${y - 84}" x2="${x}" y2="${y + 34}" />
      <line class="bridge-post" x1="${x + width}" y1="${y - 84}" x2="${x + width}" y2="${y + 34}" />
    `;
  }

  function trainMarkup(headX, baselineY, width, className = "") {
    const bodyWidth = Math.max(58, width - 56);
    const windows = [0.2, 0.48, 0.76]
      .map((ratio) => `<rect class="train-window" x="${bodyWidth * ratio - 12}" y="-60" width="24" height="22" rx="4" />`)
      .join("");
    const dividers = [0.34, 0.67]
      .map((ratio) => `<line class="train-divider" x1="${bodyWidth * ratio}" y1="-72" x2="${bodyWidth * ratio}" y2="-18" />`)
      .join("");
    const wheels = [0.15, 0.48, 0.8]
      .map((ratio) => `<circle class="train-wheel" cx="${Math.min(width - 18, width * ratio)}" cy="-11" r="12" />`)
      .join("");
    return `
      <g class="train ${className}" transform="translate(${headX - width} ${baselineY})">
        <rect class="train-body" x="0" y="-72" width="${bodyWidth}" height="54" rx="9" />
        ${windows}
        ${dividers}
        <path class="train-engine" d="M${bodyWidth} -72 H${width - 22} L${width} -48 V-18 H${bodyWidth}Z" />
        <rect class="train-window" x="${width - 48}" y="-58" width="25" height="21" rx="4" />
        ${wheels}
      </g>
    `;
  }

  function personMarkup(x, baselineY, className = "") {
    return `
      <g class="person ${className}" transform="translate(${x} ${baselineY})">
        <circle class="person-head" cx="0" cy="-62" r="14" />
        <path class="person-body" d="M0 -47 V-15" />
        <path class="person-limb" d="M0 -36 L-18 -20 M0 -36 L18 -22 M0 -15 L-15 10 M0 -15 L16 10" />
      </g>
    `;
  }

  function distanceLabel(x, y, width, text) {
    return `<g class="distance-label"><rect x="${x - width / 2}" y="${y - 29}" width="${width}" height="42" rx="10" /><text x="${x}" y="${y}">${text}</text></g>`;
  }

  function openingScene(values) {
    const metrics = sceneMetrics(values);
    return `
      <div class="visual-state opening-state">
        <svg class="scene-svg" viewBox="0 0 1000 390" role="img" aria-label="${tr("车头刚到桥头，火车准备通过大桥", "The front of the train is at the bridge entrance")}">
          ${svgDefs()}
          ${bridgeMarkup(metrics.bridgeX, 220, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeX, 222, metrics.trainWidth)}
          <line class="dimension-line" x1="${metrics.bridgeX + 8}" y1="105" x2="${metrics.bridgeEnd - 8}" y2="105" marker-start="url(#arrow-teal)" marker-end="url(#arrow-teal)" />
          ${distanceLabel(metrics.bridgeX + metrics.bridgeWidth / 2, 88, 190, tr(`大桥 ${number(values.bridgeLength)}米`, `Bridge ${number(values.bridgeLength)} m`))}
          <line class="extra-line" x1="${metrics.bridgeX - metrics.trainWidth + 8}" y1="320" x2="${metrics.bridgeX - 8}" y2="320" marker-start="url(#arrow-gold)" marker-end="url(#arrow-gold)" />
          ${distanceLabel(metrics.bridgeX - metrics.trainWidth / 2, 358, 180, tr(`火车 ${number(values.trainLength)}米`, `Train ${number(values.trainLength)} m`))}
          <g class="speed-sign"><rect x="760" y="132" width="190" height="74" rx="14" /><text x="855" y="165">${tr("每秒行驶", "Each second")}</text><text x="855" y="192">${number(values.speed)}${tr("米", " m")}</text></g>
        </svg>
        <p class="intro-problem"><strong>${fullProblem(values)}</strong><span class="opening-prompt">${tr("请说一说：知道什么？要找什么？", "Tell the class: What do we know, and what must we find?")}</span></p>
      </div>
    `;
  }

  function personStartScene(values) {
    const metrics = sceneMetrics(values);
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 400" role="img" aria-label="${tr("假想小人站在桥头研究每秒行驶的距离", "An imaginary walker stands at the bridge entrance")}">
          ${bridgeMarkup(metrics.bridgeX, 242, metrics.bridgeWidth)}
          ${personMarkup(metrics.bridgeX, 238)}
          <circle class="head-marker" cx="${metrics.bridgeX}" cy="242" r="10" />
          <g class="scene-bubble"><rect x="66" y="70" width="250" height="92" rx="16" /><text x="191" y="106">${tr("假想速度实验", "Imaginary speed test")}</text><text class="muted-text" x="191" y="138">${tr("只看位置，不看身体长度", "Track one position only")}</text></g>
          <g class="speed-sign"><rect x="750" y="110" width="190" height="76" rx="14" /><text x="845" y="143">${tr("每1秒", "Every 1 second")}</text><text x="845" y="172">${tr(`走${number(values.speed)}米`, `move ${number(values.speed)} m`)}</text></g>
          <text class="swap-label" x="${metrics.bridgeX}" y="360">${tr("0米 · 开始", "0 m · start")}</text>
        </svg>
        <p class="scene-note">${tr(`注意：${number(values.speed)}米/秒不是人的真实跑步速度，这只是为了理解速度的假想实验。`, `Note: ${number(values.speed)} m/s is not a realistic running speed. It is an imaginary model for understanding speed.`)}</p>
      </div>
    `;
  }

  function oneSecondScene(values) {
    const speed = Number(values.speed);
    const startX = 170;
    const cellWidth = 165;
    const cells = Array.from({ length: 4 }, (_, index) => {
      const x = startX + index * cellWidth;
      return `<rect class="zoom-cell${index === 0 ? " is-focus" : ""}" x="${x}" y="190" width="${cellWidth}" height="82" /><text class="tick-label" x="${x}" y="302">${number(index * speed)}${tr("米", " m")}</text>`;
    }).join("");
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 390" role="img" aria-label="${tr(`桥头局部放大，小人1秒前进${number(values.speed)}米`, `Zoomed view: the walker moves ${number(values.speed)} metres in 1 second`)}">
          ${svgDefs()}
          <text class="muted-text" x="500" y="64" text-anchor="middle" font-size="20" font-weight="850">${tr("桥头局部放大", "Zoom in near the bridge entrance")}</text>
          <rect class="zoom-strip" x="${startX}" y="190" width="${cellWidth * 4}" height="82" />
          ${cells}
          ${personMarkup(startX, 180, "is-ghost")}
          ${personMarkup(startX + cellWidth, 180, "is-moved")}
          <line class="extra-line" x1="${startX + 20}" y1="112" x2="${startX + cellWidth - 20}" y2="112" marker-start="url(#arrow-gold)" marker-end="url(#arrow-gold)" />
          ${distanceLabel(startX + cellWidth / 2, 96, 180, tr(`1秒走${number(values.speed)}米`, `1 second = ${number(values.speed)} m`))}
        </svg>
        <p class="scene-note">${tr(`时间增加1秒，路程就增加${number(values.speed)}米。`, `Each extra second adds ${number(values.speed)} metres of distance.`)}</p>
      </div>
    `;
  }

  function segmentCells(part) {
    const naturalCount = part.fullSeconds + (part.remainderDistance > 0 ? 1 : 0);
    const compressed = naturalCount > 48;
    const displayedCount = compressed ? 7 : Math.max(1, naturalCount);
    const cells = Array.from({ length: displayedCount }, (_, index) => {
      if (compressed && index === 3) return `<div class="segment-cell">…</div>`;
      const isLast = index === displayedCount - 1;
      const isRemainder = !compressed && isLast && part.remainderDistance > 0;
      let label = "";
      if (!compressed && (index === 0 || (index + 1) % 10 === 0 || isLast)) label = String(index + 1);
      if (compressed && (index === 0 || isLast)) label = index === 0 ? "1" : number(part.fullSeconds);
      return `<div class="segment-cell${isRemainder ? " is-remainder" : ""}">${label ? `<b>${label}</b>` : ""}</div>`;
    }).join("");
    return { cells, displayedCount, compressed };
  }

  function bridgeSegmentsScene(values) {
    const part = values.personCrossing;
    const visual = segmentCells(part);
    const countText = part.dividesEvenly
      ? tr(`${number(part.fullSeconds)}个“1秒小格”`, `${number(part.fullSeconds)} one-second blocks`)
      : tr(`${number(part.fullSeconds)}个整格＋最后${number(part.remainderDistance)}米`, `${number(part.fullSeconds)} full blocks + ${number(part.remainderDistance)} m`);
    return `
      <div class="visual-state">
        <div class="segment-layout">
          <div class="segment-heading"><span>${tr(`大桥全长 ${number(values.bridgeLength)}米`, `Bridge length ${number(values.bridgeLength)} m`)}</span><strong>${tr(`每格 ${number(values.speed)}米 = 1秒`, `Each block ${number(values.speed)} m = 1 second`)}</strong></div>
          <div class="segment-track${visual.compressed ? " is-compressed" : ""}" style="--segments:${visual.displayedCount}" role="img" aria-label="${countText}">${visual.cells}</div>
          <div class="segment-brace"><span>${number(values.bridgeLength)} ÷ ${number(values.speed)}</span><b>${divisionSign(part)} ${number(part.time)}</b><span>${tr("个1秒", "seconds")}</span></div>
        </div>
        <p class="scene-note">${countText}</p>
      </div>
    `;
  }

  function whyDivideScene(values) {
    const part = values.personCrossing;
    return `
      <div class="visual-state">
        <div class="division-layout">
          <section class="meaning-card is-distance"><small>${tr("一共要走", "Total distance")}</small><strong>${number(values.bridgeLength)}${tr("米", " m")}</strong><span>${tr("整座大桥", "the whole bridge")}</span></section>
          <div class="division-symbol" aria-hidden="true">÷</div>
          <section class="meaning-card is-time"><small>${tr("每1秒走", "Each 1 second")}</small><strong>${number(values.speed)}${tr("米", " m")}</strong><span>${tr("一份1秒路程", "one one-second part")}</span></section>
          <p class="meaning-line">${number(values.bridgeLength)} ÷ ${number(values.speed)} ${divisionSign(part)} ${number(part.time)}${tr("份1秒路程，也就是", " one-second parts, so ")} ${timeText(part)}</p>
        </div>
      </div>
    `;
  }

  function swapTrainScene(values) {
    const metrics = sceneMetrics(values);
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 400" role="img" aria-label="${tr("小人位置换成火车车头，车头在桥头", "The walker is replaced by the front of the train at the bridge entrance")}">
          ${bridgeMarkup(metrics.bridgeX, 240, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeX, 242, metrics.trainWidth, "is-final")}
          ${personMarkup(metrics.bridgeX, 118, "is-ghost")}
          <circle class="head-marker" cx="${metrics.bridgeX}" cy="242" r="11" />
          <path class="dimension-line" d="M${metrics.bridgeX} 130 V202" marker-end="url(#arrow-teal)" />
          <text class="swap-label" x="${metrics.bridgeX}" y="105">${tr("小人的位置", "walker's position")}</text>
          <text class="swap-label" x="${metrics.bridgeX + 105}" y="205">${tr("换成车头", "becomes the front")}</text>
          <line class="dimension-line" x1="${metrics.bridgeX + 8}" y1="344" x2="${metrics.bridgeEnd - 8}" y2="344" marker-start="url(#arrow-teal)" marker-end="url(#arrow-teal)" />
          ${distanceLabel(metrics.bridgeX + metrics.bridgeWidth / 2, 382, 190, tr(`先走${number(values.bridgeLength)}米`, `First ${number(values.bridgeLength)} m`))}
        </svg>
        <p class="scene-note">${tr("相同点：车头和小人都从桥头出发。不同点：火车有长度。", "Same: both start at the bridge entrance. Different: the train has length.")}</p>
      </div>
    `;
  }

  function headAtEndScene(values) {
    const metrics = sceneMetrics(values);
    const tailX = metrics.bridgeEnd - metrics.trainWidth;
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 400" role="img" aria-label="${tr("车头到桥尾时，车尾还在桥上", "When the front reaches the far end, the rear is still on the bridge")}">
          ${svgDefs()}
          ${bridgeMarkup(metrics.bridgeX, 240, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeEnd, 242, metrics.trainWidth)}
          <circle class="head-marker" cx="${metrics.bridgeEnd}" cy="242" r="11" />
          <circle class="tail-marker" cx="${tailX}" cy="242" r="11" />
          <text class="swap-label" x="${metrics.bridgeEnd}" y="108">${tr("车头到桥尾", "front at far end")}</text>
          <text class="warning-label" x="${tailX}" y="322">${tr("车尾还在桥上", "rear still on bridge")}</text>
          <line class="extra-line" x1="${tailX + 8}" y1="344" x2="${metrics.bridgeEnd - 8}" y2="344" marker-start="url(#arrow-gold)" marker-end="url(#arrow-gold)" />
          ${distanceLabel((tailX + metrics.bridgeEnd) / 2, 382, 210, tr(`还差${number(values.trainLength)}米`, `${number(values.trainLength)} m remains`))}
        </svg>
        <p class="scene-note">${tr("车头到桥尾不是结束；要等车尾也到桥尾。", "The front reaching the far end is not the finish; the rear must reach it too.")}</p>
      </div>
    `;
  }

  function extraTimeScene(values) {
    const metrics = sceneMetrics(values);
    const finalHead = metrics.bridgeEnd + metrics.trainWidth;
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 400" role="img" aria-label="${tr("火车整体再前进一个车身长，车尾离开大桥", "The train moves one more train length so the rear leaves the bridge")}">
          ${svgDefs()}
          ${bridgeMarkup(metrics.bridgeX, 240, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeEnd, 242, metrics.trainWidth, "is-ghost")}
          ${trainMarkup(finalHead, 242, metrics.trainWidth, "is-final")}
          <circle class="tail-marker" cx="${metrics.bridgeEnd}" cy="242" r="11" />
          <line class="extra-line" x1="${metrics.bridgeEnd + 8}" y1="112" x2="${finalHead - 8}" y2="112" marker-start="url(#arrow-gold)" marker-end="url(#arrow-gold)" />
          ${distanceLabel((metrics.bridgeEnd + finalHead) / 2, 96, 210, tr(`再走${number(values.trainLength)}米`, `Another ${number(values.trainLength)} m`))}
          <text class="swap-label" x="${metrics.bridgeEnd}" y="326">${tr("车尾刚好离桥", "rear just leaves")}</text>
          <g class="speed-sign"><rect x="70" y="92" width="200" height="82" rx="14" /><text x="170" y="127">${number(values.trainLength)} ÷ ${number(values.speed)}</text><text x="170" y="158">${divisionSign(values.trainClearing)} ${timeText(values.trainClearing)}</text></g>
        </svg>
        <p class="scene-note">${tr("火车多出的长度，也要继续按“每秒走多少米”来分。", "Divide the extra train length into the same distance travelled each second.")}</p>
      </div>
    `;
  }

  function motionReadout(timeLabel, distanceLabelText, time, distance) {
    return `
      <div class="motion-readout" aria-live="polite">
        <div class="motion-stat"><small>${timeLabel}</small><strong data-motion-time>0${secondUnit()}</strong></div>
        <div class="motion-stat"><small>${distanceLabelText}</small><strong data-motion-distance>0${metreUnit()}</strong></div>
        <button class="motion-button" type="button" data-action="motion-toggle">${t("playMotion")}</button>
        <span class="motion-status" data-motion-status>${tr("等待播放", "Ready")}</span>
      </div>
    `;
  }

  function personCrossingScene(values) {
    const metrics = sceneMetrics(values);
    return `
      <div class="visual-state motion-stage" data-motion-scene data-motion-duration="4200" data-motion-shift="${metrics.bridgeWidth}" data-model-time="${values.personCrossing.time}" data-model-distance="${values.bridgeLength}">
        <svg class="scene-svg" viewBox="0 0 1000 390" role="img" aria-label="${tr("小人在完整的大桥上从桥头走到桥尾", "The walker moves from one end of the complete bridge to the other")}">
          ${bridgeMarkup(metrics.bridgeX, 226, metrics.bridgeWidth)}
          <line class="travelled-path" data-motion-path x1="${metrics.bridgeX}" y1="276" x2="${metrics.bridgeX}" y2="276" />
          <g class="motion-object" data-motion-object>
            ${personMarkup(metrics.bridgeX, 222)}
            <circle class="head-marker" cx="${metrics.bridgeX}" cy="226" r="9" />
          </g>
          <text class="position-label" x="${metrics.bridgeX}" y="354">${tr("桥头 · 0米", "Entrance · 0 m")}</text>
          <text class="position-label" x="${metrics.bridgeEnd}" y="354">${tr(`桥尾 · ${number(values.bridgeLength)}米`, `Far end · ${number(values.bridgeLength)} m`)}</text>
          <g class="speed-sign"><rect x="55" y="72" width="205" height="74" rx="14" /><text x="158" y="105">${tr("每1秒前进", "Every 1 second")}</text><text x="158" y="133">${number(values.speed)}${tr("米", " m")}</text></g>
        </svg>
        ${motionReadout(t("elapsedTime"), t("travelledDistance"), values.personCrossing.time, values.bridgeLength)}
      </div>
    `;
  }

  function personArrivedScene(values) {
    const metrics = sceneMetrics(values);
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 400" role="img" aria-label="${tr("小人已经走到完整大桥的桥尾", "The walker has reached the far end of the complete bridge")}">
          ${svgDefs()}
          ${bridgeMarkup(metrics.bridgeX, 236, metrics.bridgeWidth)}
          <line class="travelled-path is-complete" x1="${metrics.bridgeX}" y1="288" x2="${metrics.bridgeEnd}" y2="288" />
          ${personMarkup(metrics.bridgeEnd, 232)}
          <circle class="head-marker" cx="${metrics.bridgeEnd}" cy="236" r="10" />
          <line class="dimension-line" x1="${metrics.bridgeX + 8}" y1="340" x2="${metrics.bridgeEnd - 8}" y2="340" marker-start="url(#arrow-teal)" marker-end="url(#arrow-teal)" />
          ${distanceLabel(metrics.bridgeX + metrics.bridgeWidth / 2, 382, 205, tr(`全桥${number(values.bridgeLength)}米`, `Whole bridge ${number(values.bridgeLength)} m`))}
          <g class="speed-sign"><rect x="55" y="84" width="220" height="92" rx="14" /><text x="165" y="118">${number(values.bridgeLength)} ÷ ${number(values.speed)}</text><text x="165" y="151">${divisionSign(values.personCrossing)} ${timeText(values.personCrossing)}</text></g>
          <text class="swap-label" x="${metrics.bridgeEnd}" y="115">${tr("走完全桥", "crossing complete")}</text>
        </svg>
        <p class="scene-note">${tr(`每1秒走${number(values.speed)}米；${number(values.bridgeLength)}米里有多少个${number(values.speed)}米，就用了多少秒。`, `Each second covers ${number(values.speed)} m; count how many such parts fit in ${number(values.bridgeLength)} m to get the time.`)}</p>
      </div>
    `;
  }

  function trainBeforeScene(values) {
    const metrics = sceneMetrics(values);
    const tailX = metrics.bridgeX - metrics.trainWidth;
    return `
      <div class="visual-state">
        <svg class="scene-svg" viewBox="0 0 1000 400" role="img" aria-label="${tr("火车过桥前，车头在桥头，车尾和整列火车在桥外", "Before crossing, the front is at the entrance and the rest of the train is outside")}">
          ${svgDefs()}
          ${bridgeMarkup(metrics.bridgeX, 236, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeX, 238, metrics.trainWidth)}
          <circle class="head-marker" cx="${metrics.bridgeX}" cy="238" r="10" />
          <circle class="tail-marker" cx="${tailX}" cy="238" r="10" />
          <text class="position-label is-head" x="${metrics.bridgeX}" y="112">${tr("车头在桥头", "front at entrance")}</text>
          <text class="position-label is-tail" x="${tailX}" y="330">${tr("车尾在桥外", "rear outside")}</text>
          <line class="extra-line" x1="${tailX + 8}" y1="350" x2="${metrics.bridgeX - 8}" y2="350" marker-start="url(#arrow-gold)" marker-end="url(#arrow-gold)" />
          ${distanceLabel((tailX + metrics.bridgeX) / 2, 390, 190, tr(`车长${number(values.trainLength)}米`, `Train ${number(values.trainLength)} m`))}
        </svg>
        <p class="scene-note">${tr("人只看一个位置点；火车必须同时看车头和车尾。", "A walker is one position; for a train, watch both the front and the rear.")}</p>
      </div>
    `;
  }

  function trainCrossingScene(values) {
    const metrics = sceneMetrics(values);
    const tailX = metrics.bridgeX - metrics.trainWidth;
    return `
      <div class="visual-state motion-stage" data-motion-scene data-motion-duration="4200" data-motion-shift="${metrics.bridgeWidth}" data-model-time="${values.personCrossing.time}" data-model-distance="${values.bridgeLength}">
        <svg class="scene-svg" viewBox="0 0 1000 390" role="img" aria-label="${tr("火车从车头上桥移动到车头抵达桥尾", "The train moves from the front entering to the front reaching the far end")}">
          ${bridgeMarkup(metrics.bridgeX, 226, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeX, 228, metrics.trainWidth, "is-ghost")}
          <line class="travelled-path" data-motion-path x1="${metrics.bridgeX}" y1="282" x2="${metrics.bridgeX}" y2="282" />
          <g class="motion-object" data-motion-object>
            ${trainMarkup(metrics.bridgeX, 228, metrics.trainWidth)}
            <circle class="head-marker" cx="${metrics.bridgeX}" cy="228" r="10" />
            <circle class="tail-marker" cx="${tailX}" cy="228" r="10" />
          </g>
          <text class="position-label" x="${metrics.bridgeX}" y="350">${tr("车头起点", "front starts")}</text>
          <text class="position-label" x="${metrics.bridgeEnd}" y="350">${tr("桥尾", "far end")}</text>
          <g class="scene-bubble"><rect x="48" y="72" width="218" height="78" rx="14" /><text x="157" y="105">${tr("同时看", "Watch both")}</text><text class="muted-text" x="157" y="134">${tr("车头 + 车尾", "front + rear")}</text></g>
        </svg>
        ${motionReadout(t("elapsedTime"), t("travelledDistance"), values.personCrossing.time, values.bridgeLength)}
      </div>
    `;
  }

  function trainCriticalScene(values) {
    return headAtEndScene(values);
  }

  function trainClearingScene(values) {
    const metrics = sceneMetrics(values);
    const startTail = metrics.bridgeEnd - metrics.trainWidth;
    return `
      <div class="visual-state motion-stage" data-motion-scene data-motion-duration="4200" data-motion-shift="${metrics.trainWidth}" data-model-time="${values.trainClearing.time}" data-model-distance="${values.trainLength}">
        <svg class="scene-svg" viewBox="0 0 1000 390" role="img" aria-label="${tr("火车从车头在桥尾的位置再前进一个车身长，直到车尾离桥", "The train moves one more train length until the rear leaves the bridge")}">
          ${bridgeMarkup(metrics.bridgeX, 226, metrics.bridgeWidth)}
          ${trainMarkup(metrics.bridgeEnd, 228, metrics.trainWidth, "is-ghost")}
          <g class="motion-object" data-motion-object>
            ${trainMarkup(metrics.bridgeEnd, 228, metrics.trainWidth)}
            <circle class="head-marker" cx="${metrics.bridgeEnd}" cy="228" r="10" />
            <circle class="tail-marker" cx="${startTail}" cy="228" r="10" />
          </g>
          <line class="extra-line motion-distance-line" data-motion-path x1="${startTail}" y1="322" x2="${startTail}" y2="322" />
          <text class="position-label is-tail" x="${startTail}" y="356">${tr("车尾还在桥上", "rear still on bridge")}</text>
          <text class="position-label is-head" x="${metrics.bridgeEnd}" y="356">${tr("车尾离桥位置", "rear leaves here")}</text>
          <g class="scene-bubble"><rect x="45" y="66" width="225" height="84" rx="14" /><text x="158" y="101">${tr("淡色：刚才位置", "Pale: previous position")}</text><text class="muted-text" x="158" y="131">${tr("实色：正在前进", "Solid: moving now")}</text></g>
        </svg>
        ${motionReadout(t("extraTime"), t("extraDistance"), values.trainClearing.time, values.trainLength)}
      </div>
    `;
  }

  function finalScene(values) {
    const metrics = sceneMetrics(values);
    const finalHead = metrics.bridgeEnd + metrics.trainWidth;
    return `
      <div class="visual-state final-scene-state">
        <svg class="scene-svg final-scene-svg" viewBox="0 0 1000 440" role="img" aria-label="${tr(`车尾刚好离开大桥；桥的正下方标注桥长${number(values.bridgeLength)}米，火车正下方标注车长${number(values.trainLength)}米`, `The rear has just left the bridge; ${number(values.bridgeLength)} metres is aligned below the bridge and ${number(values.trainLength)} metres below the train`)}">
          ${svgDefs()}
          ${bridgeMarkup(metrics.bridgeX, 170, metrics.bridgeWidth)}
          ${trainMarkup(finalHead, 172, metrics.trainWidth)}
          <circle class="tail-marker" cx="${metrics.bridgeEnd}" cy="172" r="11" />
          <text class="swap-label" x="${metrics.bridgeEnd}" y="72">${tr("车尾刚好离桥", "rear just leaves")}</text>
          <path class="dimension-line" d="M${metrics.bridgeEnd} 82 V132" marker-end="url(#arrow-teal)" />
          <g class="aligned-distance-proof">
            <rect class="aligned-distance-part is-bridge" x="${metrics.bridgeX}" y="310" width="${metrics.bridgeWidth}" height="88" />
            <rect class="aligned-distance-part is-train" x="${metrics.bridgeEnd}" y="310" width="${metrics.trainWidth}" height="88" />
            <text class="aligned-distance-label is-bridge" x="${metrics.bridgeX + metrics.bridgeWidth / 2}" y="344"><tspan x="${metrics.bridgeX + metrics.bridgeWidth / 2}">${tr("桥长", "Bridge")}</tspan><tspan x="${metrics.bridgeX + metrics.bridgeWidth / 2}" dy="31">${number(values.bridgeLength)}${tr("米", " m")}</tspan></text>
            <text class="aligned-distance-label is-train" x="${metrics.bridgeEnd + metrics.trainWidth / 2}" y="344"><tspan x="${metrics.bridgeEnd + metrics.trainWidth / 2}">${tr("车长", "Train")}</tspan><tspan x="${metrics.bridgeEnd + metrics.trainWidth / 2}" dy="31">${number(values.trainLength)}${tr("米", " m")}</tspan></text>
            <text class="aligned-proof-caption" x="${(metrics.bridgeX + finalHead) / 2}" y="428">${number(values.bridgeLength)} + ${number(values.trainLength)} = ${number(values.totalDistance)}${tr("米完整路程", " m complete distance")}</text>
          </g>
        </svg>
        <section class="answer-card is-inline"><small>${tr("从车头上桥到车尾完全离桥", "From front entering to rear leaving")}</small><strong>${timeText(values.fullCrossing)}</strong><span>${number(values.totalDistance)} ÷ ${number(values.speed)} ${divisionSign(values.fullCrossing)} ${number(values.fullCrossing.time)}</span></section>
        <p class="scene-note">${values.fullCrossing.exactAtHundredth ? `${number(values.fullCrossing.time)} × ${number(values.speed)} = ${number(values.totalDistance)}${tr("米，正好等于桥长加车长。", " m, exactly the bridge length plus the train length.")}` : tr("最后不足一秒的路程已计入近似时间。", "The final distance taking less than one second is included in the approximate time.")}</p>
      </div>
    `;
  }

  function renderVisual(slide, values) {
    const scenes = {
      read: openingScene,
      "person-start": personStartScene,
      "person-crossing": personCrossingScene,
      "person-arrived": personArrivedScene,
      "train-before": trainBeforeScene,
      "train-crossing": trainCrossingScene,
      "train-critical": trainCriticalScene,
      "train-clearing": trainClearingScene,
      answer: finalScene
    };
    return scenes[slide.id](values);
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
    elements.problemStrip.replaceChildren();
    const first = document.createElement("strong");
    first.textContent = tr(
      `火车长${number(state.values.trainLength)}米 · 大桥长${number(state.values.bridgeLength)}米`,
      `Train ${number(state.values.trainLength)} m · Bridge ${number(state.values.bridgeLength)} m`
    );
    const fact = document.createElement("span");
    fact.className = "problem-fact";
    fact.textContent = tr(`每秒${number(state.values.speed)}米`, `${number(state.values.speed)} m each second`);
    const task = document.createElement("span");
    task.className = "problem-task";
    task.textContent = tr("车头上桥 → 车尾完全离桥", "Front enters → rear completely leaves");
    elements.problemStrip.append(first, fact, task);
  }

  function renderProgress() {
    const list = document.createElement("ol");
    list.className = "progress-list";
    list.style.setProperty("--step-count", state.slides.length);
    state.slides.forEach((slide, index) => {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.className = "progress-button";
      if (index < state.slideIndex) button.classList.add("is-complete");
      if (index === state.slideIndex) button.classList.add("is-current");
      button.type = "button";
      button.dataset.slideIndex = String(index);
      button.setAttribute("aria-label", t("progressLabel")(index + 1, state.slides.length, slide.label));
      if (index === state.slideIndex) button.setAttribute("aria-current", "step");
      const numberNode = document.createElement("span");
      numberNode.className = "progress-number";
      numberNode.textContent = String(index + 1);
      const label = document.createElement("span");
      label.className = "progress-label";
      label.textContent = slide.label;
      button.append(numberNode, label);
      item.append(button);
      list.append(item);
    });
    elements.progress.replaceChildren(list);
  }

  function motionDisplay(scene, progress) {
    const targetTime = Number(scene.dataset.modelTime);
    const targetDistance = Number(scene.dataset.modelDistance);
    const shift = Number(scene.dataset.motionShift);
    let shownProgress = progress;
    let elapsed = targetTime * progress;

    if (Number.isInteger(targetTime) && targetTime > 0) {
      elapsed = progress >= 1 ? targetTime : Math.floor(targetTime * progress);
      shownProgress = elapsed / targetTime;
    } else {
      elapsed = Math.round(elapsed * 100) / 100;
    }

    const travelled = progress >= 1 ? targetDistance : Math.round(targetDistance * shownProgress * 100) / 100;
    const movingObject = scene.querySelector("[data-motion-object]");
    const path = scene.querySelector("[data-motion-path]");
    const timeNode = scene.querySelector("[data-motion-time]");
    const distanceNode = scene.querySelector("[data-motion-distance]");

    if (movingObject) movingObject.style.transform = `translateX(${shift * shownProgress}px)`;
    if (path) path.setAttribute("x2", String(Number(path.getAttribute("x1")) + shift * shownProgress));
    if (timeNode) timeNode.textContent = `${number(elapsed)}${secondUnit()}`;
    if (distanceNode) distanceNode.textContent = `${number(travelled)}${metreUnit()}`;
  }

  function updateMotionControl(scene) {
    const button = scene?.querySelector("[data-action='motion-toggle']");
    const status = scene?.querySelector("[data-motion-status]");
    if (!button || !status) return;
    if (motion.playing) {
      button.textContent = t("pauseMotion");
      status.textContent = tr("正在播放", "Playing");
      button.setAttribute("aria-pressed", "true");
    } else if (motion.progress >= 1) {
      button.textContent = t("replayMotion");
      status.textContent = tr("已到终点", "Complete");
      button.setAttribute("aria-pressed", "false");
    } else if (motion.progress > 0) {
      button.textContent = t("playMotion");
      status.textContent = tr("已暂停", "Paused");
      button.setAttribute("aria-pressed", "false");
    } else {
      button.textContent = t("playMotion");
      status.textContent = tr("等待播放", "Ready");
      button.setAttribute("aria-pressed", "false");
    }
  }

  function setMotionProgress(progress) {
    const scene = elements.diagramWrap.querySelector("[data-motion-scene]");
    if (!scene) return;
    motion.progress = Math.max(0, Math.min(1, progress));
    motionDisplay(scene, motion.progress);
    updateMotionControl(scene);
  }

  function cancelMotion() {
    if (motion.frameId) cancelAnimationFrame(motion.frameId);
    motion.frameId = 0;
    motion.playing = false;
  }

  function motionTick(now) {
    const scene = elements.diagramWrap.querySelector("[data-motion-scene]");
    if (!scene || !motion.playing) return;
    const duration = Number(scene.dataset.motionDuration) || 4200;
    const progress = motion.startedFrom + (now - motion.startedAt) / duration;
    if (progress >= 1) {
      motion.progress = 1;
      motion.playing = false;
      motion.frameId = 0;
      motionDisplay(scene, 1);
      updateMotionControl(scene);
      return;
    }
    motion.progress = progress;
    motionDisplay(scene, progress);
    motion.frameId = requestAnimationFrame(motionTick);
  }

  function toggleMotion() {
    const scene = elements.diagramWrap.querySelector("[data-motion-scene]");
    if (!scene) return;
    if (motion.playing) {
      cancelMotion();
      updateMotionControl(scene);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotionProgress(1);
      return;
    }
    if (motion.progress >= 1) setMotionProgress(0);
    motion.playing = true;
    motion.startedAt = performance.now();
    motion.startedFrom = motion.progress;
    updateMotionControl(scene);
    motion.frameId = requestAnimationFrame(motionTick);
  }

  function initializeMotion() {
    motion.progress = 0;
    motion.startedAt = 0;
    motion.startedFrom = 0;
    const scene = elements.diagramWrap.querySelector("[data-motion-scene]");
    if (!scene) return;
    motionDisplay(scene, 0);
    updateMotionControl(scene);
  }

  function renderSlide() {
    cancelMotion();
    const slide = state.slides[state.slideIndex];
    elements.stage.dataset.step = slide.id;
    elements.stage.setAttribute("aria-label", `${slide.label}：${slide.title}`);
    elements.stageTag.textContent = `${state.slideIndex + 1}. ${slide.label}`;
    elements.stageTitle.textContent = slide.title;
    elements.question.textContent = slide.question;
    elements.explanation.textContent = slide.explanation;
    elements.formulas.replaceChildren();
    slide.formulas.forEach((formula, index) => {
      const line = document.createElement("div");
      line.className = "formula-line";
      if (slide.answer && index === slide.formulas.length - 1) line.classList.add("is-answer");
      line.textContent = formula;
      elements.formulas.append(line);
    });
    elements.teacherCue.textContent = `${t("cuePrefix")}${slide.cue}`;
    elements.pageCount.textContent = t("pageCount")(state.slideIndex + 1, state.slides.length);
    elements.nextLabel.textContent = state.slideIndex === state.slides.length - 1 ? t("finish") : t("next");
    elements.prevButton.disabled = state.slideIndex === 0;
    elements.nextButton.disabled = state.slideIndex === state.slides.length - 1;
    elements.diagramWrap.innerHTML = renderVisual(slide, state.values);
    initializeMotion();
    renderProgress();
  }

  function rebuildLesson({ preserveSlide = false } = {}) {
    state.values = MathLabModels.quantity.trainBridgeState(state.trainLength, state.bridgeLength, state.speed);
    state.slides = buildSlides(state.values);
    if (!preserveSlide) state.slideIndex = 0;
    state.slideIndex = Math.min(state.slideIndex, state.slides.length - 1);
    applyStaticCopy();
    renderProblem();
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
      "invalid-train-length": "invalidTrainLength",
      "invalid-bridge-length": "invalidBridgeLength",
      "invalid-speed": "invalidSpeed"
    };
    return t(messages[result.reason] || "invalidTrainLength");
  }

  function openSettings() {
    elements.trainLengthInput.value = String(state.trainLength);
    elements.bridgeLengthInput.value = String(state.bridgeLength);
    elements.speedInput.value = String(state.speed);
    elements.settingsError.hidden = true;
    elements.settingsDialog.showModal();
  }

  function closeSettings() {
    elements.settingsDialog.close();
  }

  function applySettings() {
    const result = MathLabModels.quantity.trainBridgeState(
      elements.trainLengthInput.value,
      elements.bridgeLengthInput.value,
      elements.speedInput.value
    );
    if (!result.valid) {
      elements.settingsError.textContent = settingsMessage(result);
      elements.settingsError.hidden = false;
      return;
    }
    state.trainLength = result.trainLength;
    state.bridgeLength = result.bridgeLength;
    state.speed = result.speed;
    elements.settingsError.hidden = true;
    closeSettings();
    rebuildLesson();
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    } else {
      await document.documentElement.requestFullscreen?.();
    }
  }

  app.addEventListener("click", (event) => {
    const slideButton = event.target.closest("[data-slide-index]");
    if (slideButton) {
      goToSlide(Number(slideButton.dataset.slideIndex));
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === "prev") goToSlide(state.slideIndex - 1);
    if (action === "next") goToSlide(state.slideIndex + 1);
    if (action === "edit") openSettings();
    if (action === "fullscreen") toggleFullscreen();
    if (action === "motion-toggle") toggleMotion();
    if (action === "close-settings" || action === "cancel-settings") closeSettings();
    if (action === "apply-settings") applySettings();
  });

  document.addEventListener("keydown", (event) => {
    if (elements.settingsDialog.open) return;
    if (event.target.matches("input, textarea, select, button")) return;
    if (event.key === "ArrowLeft") goToSlide(state.slideIndex - 1);
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      goToSlide(state.slideIndex + 1);
    }
  });

  MathLab.bindLanguageToggle(() => rebuildLesson({ preserveSlide: true }));
  rebuildLesson();
})();
