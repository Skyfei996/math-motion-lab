const lessonText = {
  "zh-CN": {
    "common.back": "\u8fd4\u56de",
    "common.play": "\u64ad\u653e",
    "common.pause": "\u6682\u505c",
    "common.reset": "\u91cd\u7f6e",
    "common.step": "\u4e0b\u4e00\u6b65",
    "common.replay": "\u91cd\u64ad",
    "common.stepLabel": "\u7b2c {step} \u6b65 / \u5171 {total} \u6b65",
    "parallel.tag": "\u51e0\u4f55\u89c2\u5bdf",
    "parallel.title": "\u5e73\u884c\u7ebf\u4e0e\u76f8\u4ea4\u7ebf",
    "parallel.intro": "\u5207\u6362\u4e24\u79cd\u7ebf\uff0c\u89c2\u5bdf\u963f\u5c9a\u548c\u8587\u6708\u6cbf\u7740\u81ea\u5df1\u7684\u9053\u8def\u524d\u8fdb\u65f6\uff0c\u4f1a\u4e0d\u4f1a\u8d70\u5230\u540c\u4e00\u4e2a\u70b9\u3002",
    "parallel.modeParallel": "\u5e73\u884c\u7ebf",
    "parallel.modeIntersect": "\u76f8\u4ea4\u7ebf",
    "parallel.parallel.0": "\u4e24\u6761\u7ebf\u65b9\u5411\u76f8\u540c\uff0c\u8ddd\u79bb\u4e00\u76f4\u4fdd\u6301\u4e00\u6837\u3002",
    "parallel.parallel.1": "\u963f\u5c9a\u548c\u8587\u6708\u9762\u5bf9\u9762\u8d70\uff0c\u4f46\u4ed6\u4eec\u5728\u4e0d\u540c\u7684\u5e73\u884c\u9053\u8def\u4e0a\u3002",
    "parallel.parallel.2": "\u8d70\u5230\u6700\u540e\uff0c\u4ed6\u4eec\u4ecd\u7136\u4e0d\u4f1a\u78b0\u5230\u540c\u4e00\u4e2a\u70b9\u3002",
    "parallel.parallel.3": "\u7ed3\u8bba\uff1a\u5e73\u884c\u7ebf\u6c38\u4e0d\u76f8\u4ea4\u3002",
    "parallel.intersect.0": "\u4e24\u6761\u7ebf\u65b9\u5411\u4e0d\u540c\uff0c\u5ef6\u957f\u540e\u4f1a\u6709\u4e00\u4e2a\u4ea4\u70b9\u3002",
    "parallel.intersect.1": "\u963f\u5c9a\u548c\u8587\u6708\u6cbf\u7740\u4e0d\u540c\u9053\u8def\uff0c\u6b63\u5411\u540c\u4e00\u4e2a\u4f4d\u7f6e\u9760\u8fd1\u3002",
    "parallel.intersect.2": "\u4ed6\u4eec\u5728\u7ea2\u8272\u4ea4\u70b9\u76f8\u9047\u3002",
    "parallel.intersect.3": "\u7ed3\u8bba\uff1a\u4e0d\u5e73\u884c\u7684\u4e24\u6761\u76f4\u7ebf\u4f1a\u76f8\u4ea4\u3002",
    "parallel.formulaParallel": "\u5e73\u884c\uff1a\u65b9\u5411\u76f8\u540c\uff0c\u8ddd\u79bb\u4e0d\u53d8\u3002",
    "parallel.formulaIntersect": "\u76f8\u4ea4\uff1a\u65b9\u5411\u4e0d\u540c\uff0c\u5b58\u5728\u4ea4\u70b9\u3002",
    "squares.tag": "\u5468\u957f\u5e94\u7528\u9898",
    "squares.title": "\u4e24\u4e2a\u6b63\u65b9\u5f62\u5408\u6210\u957f\u65b9\u5f62",
    "squares.intro": "\u8f93\u5165\u8fb9\u957f\u548c\u5355\u4f4d\uff0c\u89c2\u5bdf\u4e24\u4e2a\u6b63\u65b9\u5f62\u5408\u5e76\u65f6\uff0c\u5468\u957f\u4e3a\u4ec0\u4e48\u4f1a\u51cf\u5c11\u4e24\u6761\u8fb9\u3002",
    "squares.sideLabel": "\u8fb9\u957f",
    "squares.unitLabel": "\u5355\u4f4d",
    "squares.question": "\u8fb9\u957f\u4e3a {side} {unit} \u7684\u4e24\u4e2a\u6b63\u65b9\u5f62\uff0c\u5408\u5e76\u6210\u4e00\u4e2a\u957f\u65b9\u5f62\u4e4b\u540e\uff0c\u5468\u957f\u51cf\u5c11\u591a\u5c11\uff1f",
    "squares.0": "\u5148\u770b\u9898\u76ee\uff1a\u4e24\u4e2a\u5b8c\u5168\u4e00\u6837\u7684\u6b63\u65b9\u5f62\uff0c\u6bcf\u6761\u8fb9\u90fd\u662f {side} {unit}\u3002",
    "squares.1": "\u5408\u5e76\u524d\uff0c\u6bcf\u4e2a\u6b63\u65b9\u5f62\u6709 4 \u6761\u8fb9\uff0c\u6240\u4ee5\u603b\u5468\u957f\u662f 4 x {side} + 4 x {side} = {before} {unit}\u3002",
    "squares.2": "\u53f3\u8fb9\u7684\u6b63\u65b9\u5f62\u5411\u5de6\u79fb\u52a8\uff0c\u51c6\u5907\u548c\u5de6\u8fb9\u7684\u6b63\u65b9\u5f62\u8d34\u5728\u4e00\u8d77\u3002",
    "squares.3": "\u4e2d\u95f4\u4e24\u6761\u8fb9\u8d34\u5408\u540e\u53d8\u6210\u5185\u90e8\u8fb9\uff0c\u4e0d\u518d\u5c5e\u4e8e\u5916\u8fb9\u754c\u3002",
    "squares.4": "\u51cf\u5c11\u7684\u957f\u5ea6\u662f 2 x {side} = {reduced} {unit}\u3002",
    "squares.5": "\u5408\u5e76\u540e\u7684\u957f\u65b9\u5f62\u957f {length} {unit}\u3001\u5bbd {side} {unit}\uff0c\u5468\u957f\u662f {after} {unit}\u3002",
    "squares.6": "\u7b54\u6848\uff1a\u5468\u957f\u51cf\u5c11 {reduced} {unit}\u3002",
    "squares.formula.0": "\u9898\u76ee\n{question}",
    "squares.formula.1": "\u5408\u5e76\u524d\u5468\u957f\n4 x {side} + 4 x {side} = {before} {unit}",
    "squares.formula.2": "\u79fb\u52a8\u4e2d\n\u53f3\u8fb9\u6b63\u65b9\u5f62\u5411\u5de6\u8d34\u8fd1\u3002",
    "squares.formula.3": "\u8d34\u5408\u8fb9\n\u4e2d\u95f4\u6709 2 \u6761\u8fb9\u53d8\u6210\u5185\u90e8\u8fb9\u3002",
    "squares.formula.4": "\u51cf\u5c11\u957f\u5ea6\n2 x {side} = {reduced} {unit}",
    "squares.formula.5": "\u5408\u5e76\u540e\u5468\u957f\n2 x ({length} + {side}) = {after} {unit}",
    "squares.formula.6": "\u6700\u7ec8\u7b54\u6848\n{before} - {after} = {reduced} {unit}",
    "unit.cm": "\u5398\u7c73",
    "unit.m": "\u7c73",
    "squares.slideLeft": "\u5411\u5de6\u79fb\u52a8"
  },
  "en-US": {
    "common.back": "Back",
    "common.play": "Play",
    "common.pause": "Pause",
    "common.reset": "Reset",
    "common.step": "Next",
    "common.replay": "Replay",
    "common.stepLabel": "Step {step} of {total}",
    "parallel.tag": "Geometry",
    "parallel.title": "Parallel and Intersecting Lines",
    "parallel.intro": "Switch between the two line types and watch whether Aran and Veela can reach the same point.",
    "parallel.modeParallel": "Parallel",
    "parallel.modeIntersect": "Intersecting",
    "parallel.parallel.0": "The two lines have the same direction, so the distance stays the same.",
    "parallel.parallel.1": "Aran and Veela walk toward each other, but they stay on different parallel paths.",
    "parallel.parallel.2": "Even at the end, they do not touch the same point.",
    "parallel.parallel.3": "Conclusion: parallel lines never meet.",
    "parallel.intersect.0": "The two lines have different directions, so they have a crossing point.",
    "parallel.intersect.1": "Aran and Veela follow different paths toward the same place.",
    "parallel.intersect.2": "They meet at the red crossing point.",
    "parallel.intersect.3": "Conclusion: non-parallel straight lines intersect.",
    "parallel.formulaParallel": "Parallel: same direction, fixed distance.",
    "parallel.formulaIntersect": "Intersecting: different directions, one crossing point.",
    "squares.tag": "Perimeter word problem",
    "squares.title": "Two Squares Become a Rectangle",
    "squares.intro": "Enter the side length and unit, then watch why the perimeter loses two sides when the squares join.",
    "squares.sideLabel": "Side",
    "squares.unitLabel": "Unit",
    "squares.question": "Two squares each have side length {side} {unit}. After joining them into one rectangle, how much does the perimeter decrease?",
    "squares.0": "Start with the problem: two equal squares, each side is {side} {unit}.",
    "squares.1": "Before joining, each square has 4 sides, so the total perimeter is 4 x {side} + 4 x {side} = {before} {unit}.",
    "squares.2": "The right square slides left and gets ready to touch the first square.",
    "squares.3": "The two touching sides become inside edges, so they are no longer part of the outside boundary.",
    "squares.4": "The decrease is 2 x {side} = {reduced} {unit}.",
    "squares.5": "The new rectangle is {length} {unit} long and {side} {unit} wide, so its perimeter is {after} {unit}.",
    "squares.6": "Answer: the perimeter decreases by {reduced} {unit}.",
    "squares.formula.0": "Problem\n{question}",
    "squares.formula.1": "Before joining\n4 x {side} + 4 x {side} = {before} {unit}",
    "squares.formula.2": "Sliding\nThe right square moves left.",
    "squares.formula.3": "Touching sides\n2 sides become inside edges.",
    "squares.formula.4": "Decrease\n2 x {side} = {reduced} {unit}",
    "squares.formula.5": "After joining\n2 x ({length} + {side}) = {after} {unit}",
    "squares.formula.6": "Final answer\n{before} - {after} = {reduced} {unit}",
    "unit.cm": "cm",
    "unit.m": "m",
    "squares.slideLeft": "Slide left"
  }
};

function getLessonLanguage() {
  return localStorage.getItem("math-lab-language") || "zh-CN";
}

function t(key, values = {}) {
  const template = lessonText[getLessonLanguage()]?.[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
}

function applyLessonLanguage() {
  const language = getLessonLanguage();
  document.documentElement.lang = language;
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = language === "zh-CN" ? "EN" : "\u4e2d\u6587";
  });
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setTransform(id, x, y, rotation = 0) {
  const node = document.getElementById(id);
  if (node) node.setAttribute("transform", `translate(${x} ${y}) rotate(${rotation})`);
}

function makePlayback({ totalSteps, duration = 4200, onUpdate }) {
  let progress = 0;
  let playing = false;
  let lastTime = 0;
  let frameId = 0;

  const playButton = document.querySelector("[data-action='play']");
  const resetButton = document.querySelector("[data-action='reset']");
  const stepButton = document.querySelector("[data-action='step']");
  const fill = document.querySelector("[data-progress-fill]");

  function currentStep() {
    return Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
  }

  function updateButtons() {
    if (playButton) {
      const key = playing ? "common.pause" : progress >= 1 ? "common.replay" : "common.play";
      playButton.textContent = `${playing ? "||" : ">"} ${t(key)}`;
    }
    if (resetButton) resetButton.textContent = `Reset ${t("common.reset")}`;
    if (stepButton) stepButton.textContent = `Next ${t("common.step")}`;
  }

  function render() {
    const step = currentStep();
    document.querySelectorAll("[data-step-label]").forEach((node) => {
      node.textContent = t("common.stepLabel", {
        step: String(step + 1),
        total: String(totalSteps)
      });
    });
    if (fill) fill.style.width = `${progress * 100}%`;
    updateButtons();
    onUpdate(progress, step);
  }

  function tick(now) {
    if (!lastTime) lastTime = now;
    const delta = now - lastTime;
    lastTime = now;
    progress = clamp(progress + delta / duration, 0, 1);
    render();
    if (progress < 1 && playing) {
      frameId = requestAnimationFrame(tick);
      return;
    }
    playing = false;
    lastTime = 0;
    render();
  }

  function playPause() {
    if (progress >= 1) progress = 0;
    playing = !playing;
    lastTime = 0;
    render();
    if (playing) frameId = requestAnimationFrame(tick);
  }

  function reset() {
    playing = false;
    cancelAnimationFrame(frameId);
    progress = 0;
    lastTime = 0;
    render();
  }

  function stepForward() {
    playing = false;
    cancelAnimationFrame(frameId);
    const nextStep = Math.min(totalSteps, currentStep() + 1);
    progress = nextStep >= totalSteps ? 1 : nextStep / totalSteps;
    lastTime = 0;
    render();
  }

  playButton?.addEventListener("click", playPause);
  resetButton?.addEventListener("click", reset);
  stepButton?.addEventListener("click", stepForward);

  return {
    render,
    reset,
    setProgress(value) {
      playing = false;
      cancelAnimationFrame(frameId);
      progress = clamp(value, 0, 1);
      lastTime = 0;
      render();
    }
  };
}

function initLanguageControls(onChange) {
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = getLessonLanguage() === "zh-CN" ? "en-US" : "zh-CN";
      localStorage.setItem("math-lab-language", next);
      applyLessonLanguage();
      onChange?.();
    });
  });
}

window.MathLesson = {
  t,
  lerp,
  clamp,
  setTransform,
  makePlayback,
  applyLessonLanguage,
  initLanguageControls,
  getLessonLanguage
};
