# Math Lab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Math Motion Lab into a desktop-first math experiment lab with a shared teaching shell, reusable geometry/quantity model code, migrated existing lessons, and one new quantity-model lesson.

**Architecture:** Keep the project as a static HTML/CSS/JavaScript site. Add focused shared modules for catalog/i18n data, core UI helpers, and pure math models; keep each lesson as its own HTML page that plugs into the shared shell conventions. This proves the future engine/template architecture without introducing a build system.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, SVG, localStorage, Node.js for model smoke tests.

---

## Scope Decisions

- Keep one HTML file per lesson in this implementation. A data-driven single lesson runner can come later after more templates exist.
- Introduce shared JavaScript modules as plain scripts, not ES modules, so opening `index.html` directly still works.
- Use existing lessons as geometry proof points: parallel/intersecting lines and square-to-rectangle perimeter.
- Add one new quantity proof point: equal sharing and fraction blocks in `lessons/division-fractions.html`.
- Do not add a backend, build tool, account system, progress tracking, CMS, or full grade-level curriculum.
- Because this folder is currently not a git repository, commit steps are written as "checkpoint" steps. If a git repository is initialized later, run the listed `git add`/`git commit` commands.

## File Structure

- Create: `assets/lab-data.js`
  - Owns bilingual strings, lesson catalog metadata, category metadata, and problem defaults.
- Create: `assets/lab-core.js`
  - Owns language helpers, DOM text application, playback helper, SVG drag helper, numeric formatting, and shared UI utilities.
- Create: `assets/lab-models.js`
  - Owns pure geometry and quantity calculation functions. This file must not touch the DOM.
- Modify: `assets/styles.css`
  - Replaces the current generic card/playback look with catalog and teaching-lab layout styles.
- Replace: `index.html`
  - Becomes an experiment catalog driven by `MathLabData`.
- Modify: `lessons/parallel-lines.html`
  - Migrates to the teaching-lab layout and uses `MathLabModels.geometry`.
- Modify: `lessons/squares-rectangle.html`
  - Migrates to the teaching-lab layout and uses `MathLabModels.geometry` for perimeter state.
- Create: `lessons/division-fractions.html`
  - Adds the first quantity-model lesson.
- Create: `tests/model-tests.js`
  - Runs pure model smoke tests in Node.
- Modify: `README.md`
  - Replace corrupted Chinese and document preview/test instructions.

## Task 1: Shared Catalog And I18n Data

**Files:**
- Create: `assets/lab-data.js`
- Test: `tests/model-tests.js` will use this indirectly after Task 3

- [ ] **Step 1: Create the data file**

Create `assets/lab-data.js` with this structure:

```js
(function () {
  const languages = {
    "zh-CN": {
      common: {
        back: "返回目录",
        languageToggle: "EN",
        play: "演示",
        pause: "暂停",
        replay: "重播",
        reset: "复原",
        categoryAll: "全部",
        observe: "观察",
        conclusion: "结论",
        controls: "实验控制",
        parameters: "参数",
        formula: "算式",
        dragHint: "可以拖动画面里的对象，也可以调整右侧参数。"
      },
      home: {
        title: "Math Motion Lab",
        subtitle: "把小学数学变成可拖动、可观察、可讲解的实验台。",
        intro: "适合家长或老师在电脑前给孩子讲题。先从几何和数量模型开始，后续可以继续扩展分数、小数、速度、概率等实验。",
        catalogTitle: "实验目录",
        futureTitle: "预留扩展",
        futureCopy: "后续可以继续增加三角形、分数、小数、行程问题和概率实验。"
      },
      categories: {
        geometry: "几何",
        quantity: "数与运算",
        fractions: "分数与小数",
        wordProblems: "应用题",
        probability: "概率"
      },
      lessons: {
        parallel: {
          title: "平行线与相交线",
          summary: "拖动角度和间距，观察两条直线会不会相交。",
          grade: "四年级",
          interaction: "拖线 / 调角度"
        },
        squares: {
          title: "两个正方形合成长方形",
          summary: "拖动正方形合并，观察为什么周长会少两条边。",
          grade: "四年级",
          interaction: "拖方块 / 改边长"
        },
        divisionFractions: {
          title: "平均分与分数",
          summary: "把整体平均分，理解除法和分数来自同一件事。",
          grade: "四年级",
          interaction: "分组 / 切块"
        }
      },
      parallel: {
        modeLabel: "直线关系",
        angleLabel: "夹角",
        distanceLabel: "距离",
        extendLabel: "显示延长线",
        parallelMode: "平行",
        intersectMode: "相交",
        observationParallel: "两条线方向相同，距离保持不变。",
        observationIntersect: "两条线方向不同，延长后会出现交点。",
        conclusionParallel: "结论：平行线不会相交。",
        conclusionIntersect: "结论：不平行的两条直线会相交。"
      },
      squares: {
        sideLabel: "边长",
        unitLabel: "单位",
        gapLabel: "合并距离",
        showHiddenLabel: "显示隐藏边",
        observation: "两个正方形贴合后，中间两条边变成内部边。",
        conclusion: "周长减少 2 条边，也就是 {reduced} {unit}。"
      },
      divisionFractions: {
        totalLabel: "总数",
        groupsLabel: "分成几组",
        fractionPartsLabel: "整体分成几份",
        selectedPartsLabel: "取其中几份",
        observationDivision: "{total} 个物品平均分成 {groups} 组，每组 {each} 个。",
        observationFraction: "把一个整体平均分成 {denominator} 份，取 {numerator} 份，就是 {numerator}/{denominator}。",
        conclusionDivision: "{total} ÷ {groups} = {each}",
        conclusionFraction: "{numerator}/{denominator} 表示 {denominator} 份中的 {numerator} 份。"
      },
      units: {
        cm: "厘米",
        m: "米"
      }
    },
    "en-US": {
      common: {
        back: "Catalog",
        languageToggle: "中文",
        play: "Demo",
        pause: "Pause",
        replay: "Replay",
        reset: "Reset",
        categoryAll: "All",
        observe: "Observe",
        conclusion: "Conclusion",
        controls: "Controls",
        parameters: "Parameters",
        formula: "Formula",
        dragHint: "Drag objects on the stage or adjust the controls."
      },
      home: {
        title: "Math Motion Lab",
        subtitle: "A hands-on teaching lab for primary school math.",
        intro: "Built for parent-led or teacher-led explanation on desktop. Start with geometry and quantity models, then grow into fractions, decimals, speed, probability, and more.",
        catalogTitle: "Experiment Catalog",
        futureTitle: "Ready To Grow",
        futureCopy: "Future experiments can add triangles, fractions, decimals, word problems, and probability."
      },
      categories: {
        geometry: "Geometry",
        quantity: "Number & Operations",
        fractions: "Fractions & Decimals",
        wordProblems: "Word Problems",
        probability: "Probability"
      },
      lessons: {
        parallel: {
          title: "Parallel and Intersecting Lines",
          summary: "Adjust angle and distance to see whether two straight lines meet.",
          grade: "Grade 4",
          interaction: "Drag lines / adjust angle"
        },
        squares: {
          title: "Two Squares Become a Rectangle",
          summary: "Join two squares and see why the perimeter loses two sides.",
          grade: "Grade 4",
          interaction: "Drag square / edit side"
        },
        divisionFractions: {
          title: "Equal Sharing and Fractions",
          summary: "Share a whole equally and connect division with fractions.",
          grade: "Grade 4",
          interaction: "Group / partition"
        }
      },
      parallel: {
        modeLabel: "Line relation",
        angleLabel: "Angle",
        distanceLabel: "Distance",
        extendLabel: "Show extensions",
        parallelMode: "Parallel",
        intersectMode: "Intersect",
        observationParallel: "The lines have the same direction, so their distance stays fixed.",
        observationIntersect: "The lines have different directions, so their extensions meet.",
        conclusionParallel: "Conclusion: parallel lines do not intersect.",
        conclusionIntersect: "Conclusion: non-parallel straight lines intersect."
      },
      squares: {
        sideLabel: "Side",
        unitLabel: "Unit",
        gapLabel: "Join distance",
        showHiddenLabel: "Show hidden sides",
        observation: "When the squares touch, two middle sides become internal sides.",
        conclusion: "The perimeter decreases by 2 sides, or {reduced} {unit}."
      },
      divisionFractions: {
        totalLabel: "Total",
        groupsLabel: "Groups",
        fractionPartsLabel: "Equal parts",
        selectedPartsLabel: "Selected parts",
        observationDivision: "{total} items shared into {groups} groups gives {each} in each group.",
        observationFraction: "A whole split into {denominator} equal parts, with {numerator} selected, is {numerator}/{denominator}.",
        conclusionDivision: "{total} ÷ {groups} = {each}",
        conclusionFraction: "{numerator}/{denominator} means {numerator} of {denominator} equal parts."
      },
      units: {
        cm: "cm",
        m: "m"
      }
    }
  };

  const catalog = [
    {
      id: "parallel",
      href: "lessons/parallel-lines.html",
      category: "geometry",
      accent: "blue",
      preview: "lines"
    },
    {
      id: "squares",
      href: "lessons/squares-rectangle.html",
      category: "geometry",
      accent: "gold",
      preview: "squares"
    },
    {
      id: "divisionFractions",
      href: "lessons/division-fractions.html",
      category: "quantity",
      accent: "teal",
      preview: "blocks"
    }
  ];

  const categories = ["geometry", "quantity", "fractions", "wordProblems", "probability"];

  window.MathLabData = {
    languages,
    catalog,
    categories,
    defaultLanguage: "zh-CN",
    storageKey: "math-lab-language"
  };
})();
```

- [ ] **Step 2: Verify the file loads as a plain script**

Run: `node -e "global.window=global; require('./assets/lab-data.js'); console.log(MathLabData.catalog.length)"`

Expected output: `3`

- [ ] **Step 3: Checkpoint**

If this directory is a git repository:

```bash
git add assets/lab-data.js
git commit -m "feat: add math lab catalog data"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 2: Pure Math Models

**Files:**
- Create: `assets/lab-models.js`
- Create: `tests/model-tests.js`

- [ ] **Step 1: Create pure model helpers**

Create `assets/lab-models.js`:

```js
(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function squarePerimeterState(side) {
    const cleanSide = Number.isFinite(Number(side)) && Number(side) > 0 ? Number(side) : 5;
    return {
      side: cleanSide,
      before: cleanSide * 8,
      after: cleanSide * 6,
      reduced: cleanSide * 2,
      length: cleanSide * 2,
      width: cleanSide
    };
  }

  function lineRelationState(mode, angleDeg, distance) {
    const cleanMode = mode === "intersect" ? "intersect" : "parallel";
    const cleanAngle = cleanMode === "parallel" ? 0 : clamp(Number(angleDeg) || 24, 5, 75);
    const cleanDistance = clamp(Number(distance) || 140, 60, 220);
    return {
      mode: cleanMode,
      angleDeg: cleanAngle,
      distance: cleanDistance,
      intersects: cleanMode === "intersect",
      hasFixedDistance: cleanMode === "parallel"
    };
  }

  function equalSharingState(total, groups) {
    const cleanTotal = Math.max(1, Math.round(Number(total) || 12));
    const cleanGroups = Math.max(1, Math.round(Number(groups) || 3));
    return {
      total: cleanTotal,
      groups: cleanGroups,
      each: Math.floor(cleanTotal / cleanGroups),
      remainder: cleanTotal % cleanGroups,
      dividesEvenly: cleanTotal % cleanGroups === 0
    };
  }

  function fractionState(numerator, denominator) {
    const cleanDenominator = Math.max(1, Math.round(Number(denominator) || 4));
    const cleanNumerator = clamp(Math.round(Number(numerator) || 1), 0, cleanDenominator);
    return {
      numerator: cleanNumerator,
      denominator: cleanDenominator,
      value: round(cleanNumerator / cleanDenominator, 3)
    };
  }

  function canFormTriangle(a, b, c) {
    const sides = [Number(a), Number(b), Number(c)].sort((x, y) => x - y);
    if (sides.some((side) => !Number.isFinite(side) || side <= 0)) {
      return { valid: false, reason: "invalid-side" };
    }
    const valid = sides[0] + sides[1] > sides[2];
    return {
      valid,
      reason: valid ? "ok" : "sum-not-greater",
      sortedSides: sides
    };
  }

  window.MathLabModels = {
    clamp,
    round,
    geometry: {
      squarePerimeterState,
      lineRelationState,
      canFormTriangle
    },
    quantity: {
      equalSharingState,
      fractionState
    }
  };
})();
```

- [ ] **Step 2: Create model tests**

Create `tests/model-tests.js`:

```js
const assert = require("assert");

global.window = global;
require("../assets/lab-models.js");

const { geometry, quantity } = MathLabModels;

assert.deepStrictEqual(geometry.squarePerimeterState(5), {
  side: 5,
  before: 40,
  after: 30,
  reduced: 10,
  length: 10,
  width: 5
});

assert.strictEqual(geometry.lineRelationState("parallel", 30, 100).intersects, false);
assert.strictEqual(geometry.lineRelationState("intersect", 30, 100).intersects, true);

assert.deepStrictEqual(quantity.equalSharingState(12, 3), {
  total: 12,
  groups: 3,
  each: 4,
  remainder: 0,
  dividesEvenly: true
});

assert.deepStrictEqual(quantity.equalSharingState(14, 3), {
  total: 14,
  groups: 3,
  each: 4,
  remainder: 2,
  dividesEvenly: false
});

assert.deepStrictEqual(quantity.fractionState(2, 4), {
  numerator: 2,
  denominator: 4,
  value: 0.5
});

assert.strictEqual(geometry.canFormTriangle(3, 4, 7).valid, false);
assert.strictEqual(geometry.canFormTriangle(3, 4, 5).valid, true);

console.log("model tests passed");
```

- [ ] **Step 3: Run failing or passing test check**

Run: `node tests/model-tests.js`

Expected output: `model tests passed`

- [ ] **Step 4: Checkpoint**

If this directory is a git repository:

```bash
git add assets/lab-models.js tests/model-tests.js
git commit -m "feat: add math model helpers"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 3: Shared Core UI Helpers

**Files:**
- Create: `assets/lab-core.js`

- [ ] **Step 1: Create core helpers**

Create `assets/lab-core.js`:

```js
(function () {
  function getLanguage() {
    return localStorage.getItem(MathLabData.storageKey) || MathLabData.defaultLanguage;
  }

  function setLanguage(language) {
    localStorage.setItem(MathLabData.storageKey, language);
    document.documentElement.lang = language;
    applyText();
  }

  function text(path, values = {}) {
    const language = getLanguage();
    const parts = path.split(".");
    let current = MathLabData.languages[language];
    for (const part of parts) current = current?.[part];
    const template = typeof current === "string" ? current : path;
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  }

  function applyText(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = text(node.dataset.i18n);
    });
    root.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.textContent = text("common.languageToggle");
    });
  }

  function bindLanguageToggle(onChange) {
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = getLanguage() === "zh-CN" ? "en-US" : "zh-CN";
        setLanguage(next);
        onChange?.(next);
      });
    });
  }

  function numberText(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0";
    return Number.isInteger(number) ? String(number) : String(MathLabModels.round(number, 2));
  }

  function fillSelectUnits(select) {
    select.querySelectorAll("option").forEach((option) => {
      option.textContent = text(`units.${option.value}`);
    });
  }

  function createPlayback({ duration = 2400, onProgress, onReset }) {
    let progress = 0;
    let playing = false;
    let frameId = 0;
    let lastTime = 0;

    function render() {
      onProgress(progress, playing);
    }

    function tick(now) {
      if (!lastTime) lastTime = now;
      const delta = now - lastTime;
      lastTime = now;
      progress = MathLabModels.clamp(progress + delta / duration, 0, 1);
      render();
      if (playing && progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        playing = false;
        lastTime = 0;
        render();
      }
    }

    return {
      playPause() {
        if (progress >= 1) progress = 0;
        playing = !playing;
        lastTime = 0;
        render();
        if (playing) frameId = requestAnimationFrame(tick);
      },
      reset() {
        playing = false;
        cancelAnimationFrame(frameId);
        progress = 0;
        lastTime = 0;
        onReset?.();
        render();
      },
      setProgress(value) {
        playing = false;
        cancelAnimationFrame(frameId);
        progress = MathLabModels.clamp(value, 0, 1);
        lastTime = 0;
        render();
      },
      getProgress() {
        return progress;
      }
    };
  }

  function makeSvgDraggable(svg, handle, callbacks) {
    let dragging = false;

    function pointFromEvent(event) {
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    }

    handle.addEventListener("pointerdown", (event) => {
      dragging = true;
      handle.setPointerCapture(event.pointerId);
      callbacks.onStart?.(pointFromEvent(event));
    });

    handle.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      callbacks.onMove?.(pointFromEvent(event));
    });

    handle.addEventListener("pointerup", (event) => {
      dragging = false;
      handle.releasePointerCapture(event.pointerId);
      callbacks.onEnd?.(pointFromEvent(event));
    });
  }

  window.MathLab = {
    getLanguage,
    setLanguage,
    text,
    applyText,
    bindLanguageToggle,
    numberText,
    fillSelectUnits,
    createPlayback,
    makeSvgDraggable
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.documentElement.lang = getLanguage();
    applyText();
  });
})();
```

- [ ] **Step 2: Verify script dependency order**

Any page using `assets/lab-core.js` must load scripts in this order:

```html
<script src="assets/lab-data.js"></script>
<script src="assets/lab-models.js"></script>
<script src="assets/lab-core.js"></script>
```

Lesson pages under `lessons/` must use:

```html
<script src="../assets/lab-data.js"></script>
<script src="../assets/lab-models.js"></script>
<script src="../assets/lab-core.js"></script>
```

- [ ] **Step 3: Run model tests again**

Run: `node tests/model-tests.js`

Expected output: `model tests passed`

- [ ] **Step 4: Checkpoint**

If this directory is a git repository:

```bash
git add assets/lab-core.js
git commit -m "feat: add shared lab UI helpers"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 4: Teaching Lab Visual System

**Files:**
- Modify: `assets/styles.css`

- [ ] **Step 1: Replace CSS with lab-focused sections**

Replace `assets/styles.css` with CSS organized into these sections:

```css
:root {
  --ink: #172033;
  --muted: #667085;
  --paper: #f6f7f3;
  --panel: #ffffff;
  --line: #d8ded2;
  --blue: #2563eb;
  --teal: #0f9f8f;
  --gold: #f2b84b;
  --rose: #e25563;
  --green: #2f855a;
  --shadow: 0 14px 34px rgba(23, 32, 51, 0.1);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

.home-shell,
.lesson-shell {
  width: min(1220px, calc(100% - 32px));
  margin: 0 auto;
  padding: 18px 0 32px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 48px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 850;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  background: var(--ink);
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link,
.language-button,
.lab-button,
.segmented-button,
.field-input,
.field-select {
  min-height: 38px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  color: var(--ink);
}

.nav-link,
.language-button,
.lab-button,
.segmented-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 800;
}

.nav-link,
.language-button,
.lab-button {
  padding: 0 14px;
}

.lab-button.primary {
  color: #fff;
  border-color: var(--blue);
  background: var(--blue);
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
  gap: 28px;
  align-items: end;
  padding: 34px 0 24px;
}

.home-title {
  margin: 0 0 12px;
  font-size: 3.2rem;
  line-height: 1;
  letter-spacing: 0;
}

.home-subtitle,
.home-copy {
  max-width: 680px;
  color: var(--muted);
  line-height: 1.7;
}

.category-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0;
}

.category-pill {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  font-weight: 800;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.experiment-card {
  display: grid;
  grid-template-rows: 150px 1fr;
  overflow: hidden;
  min-height: 312px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.experiment-preview {
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--line);
  background: #eef4ff;
}

.experiment-body {
  padding: 18px;
}

.experiment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-chip {
  padding: 5px 8px;
  border-radius: 999px;
  background: #eef1ea;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 850;
}

.experiment-body h2 {
  margin: 0 0 8px;
  font-size: 1.28rem;
}

.experiment-body p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.lesson-titlebar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: end;
  padding: 26px 0 18px;
}

.lesson-titlebar h1 {
  margin: 0 0 8px;
  font-size: 2.35rem;
  line-height: 1.08;
  letter-spacing: 0;
}

.lesson-titlebar p {
  margin: 0;
  max-width: 760px;
  color: var(--muted);
  line-height: 1.65;
}

.lab-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 14px;
}

.stage-panel,
.side-panel,
.control-card,
.observation-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  box-shadow: var(--shadow);
}

.stage-panel {
  min-height: 580px;
  overflow: hidden;
}

.stage-svg {
  display: block;
  width: 100%;
  min-height: 580px;
  background: #fbfcf8;
  touch-action: none;
}

.side-panel {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 12px;
}

.control-card,
.observation-card {
  box-shadow: none;
  padding: 14px;
}

.panel-heading {
  margin: 0 0 10px;
  font-size: 0.86rem;
  font-weight: 900;
  color: var(--muted);
}

.field-stack {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 850;
}

.field-input,
.field-select {
  width: 100%;
  padding: 0 10px;
  font-weight: 800;
}

.segmented {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.segmented-button {
  padding: 0 10px;
}

.segmented-button[aria-pressed="true"] {
  color: #fff;
  border-color: var(--ink);
  background: var(--ink);
}

.observation-text {
  margin: 0 0 10px;
  font-size: 1.05rem;
  line-height: 1.65;
}

.formula-box {
  white-space: pre-line;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #f6f7f3;
  font-weight: 850;
  line-height: 1.55;
}

.playback-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.math-line {
  stroke: var(--ink);
  stroke-width: 7;
  stroke-linecap: round;
}

.math-line.alt {
  stroke: #46617a;
}

.guide-line {
  stroke: rgba(23, 32, 51, 0.2);
  stroke-width: 2;
  stroke-dasharray: 8 8;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.svg-label {
  fill: var(--ink);
  font-size: 17px;
  font-weight: 900;
  text-anchor: middle;
}

.svg-muted-label {
  fill: var(--muted);
  font-size: 14px;
  font-weight: 850;
  text-anchor: middle;
}

@media (max-width: 920px) {
  .home-hero,
  .lab-layout,
  .lesson-titlebar {
    grid-template-columns: 1fr;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .stage-panel,
  .stage-svg {
    min-height: 460px;
  }
}

@media (max-width: 560px) {
  .home-shell,
  .lesson-shell {
    width: min(100% - 20px, 1220px);
  }

  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .top-actions {
    width: 100%;
    justify-content: space-between;
  }
}
```

- [ ] **Step 2: Inspect color balance**

Run: `rg -n "#|--" assets/styles.css`

Expected: Colors use several purposeful accents (`blue`, `teal`, `gold`, `rose`, `green`) and are not dominated by one hue family.

- [ ] **Step 3: Checkpoint**

If this directory is a git repository:

```bash
git add assets/styles.css
git commit -m "style: redesign math lab visual system"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 5: Home Catalog

**Files:**
- Replace: `index.html`

- [ ] **Step 1: Replace home page markup**

Replace `index.html` with:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Math Motion Lab</title>
    <link rel="stylesheet" href="assets/styles.css" />
  </head>
  <body>
    <main class="home-shell">
      <header class="topbar">
        <a class="brand" href="index.html" aria-label="Math Motion Lab">
          <span class="brand-mark">M</span>
          <span>Math Motion Lab</span>
        </a>
        <button class="language-button" data-language-toggle type="button">EN</button>
      </header>

      <section class="home-hero">
        <div>
          <h1 class="home-title" data-i18n="home.title">Math Motion Lab</h1>
          <p class="home-subtitle" data-i18n="home.subtitle"></p>
          <p class="home-copy" data-i18n="home.intro"></p>
        </div>
        <div class="observation-card">
          <p class="panel-heading" data-i18n="home.futureTitle"></p>
          <p class="observation-text" data-i18n="home.futureCopy"></p>
        </div>
      </section>

      <section aria-label="Experiment catalog">
        <h2 data-i18n="home.catalogTitle"></h2>
        <div class="category-strip" data-category-strip></div>
        <div class="catalog-grid" data-catalog-grid></div>
      </section>
    </main>

    <script src="assets/lab-data.js"></script>
    <script src="assets/lab-models.js"></script>
    <script src="assets/lab-core.js"></script>
    <script>
      function previewSvg(type) {
        if (type === "squares") {
          return '<svg width="190" height="110" viewBox="0 0 190 110" aria-hidden="true"><rect x="32" y="32" width="48" height="48" fill="#f2b84b" stroke="#172033" stroke-width="4"/><rect x="80" y="32" width="48" height="48" fill="#ffd47a" stroke="#172033" stroke-width="4"/><path d="M80 28 V84" stroke="#e25563" stroke-width="5" stroke-linecap="round"/></svg>';
        }
        if (type === "blocks") {
          return '<svg width="190" height="110" viewBox="0 0 190 110" aria-hidden="true"><rect x="28" y="32" width="132" height="42" rx="8" fill="#dff7f2" stroke="#172033" stroke-width="4"/><path d="M72 32 V74 M116 32 V74" stroke="#172033" stroke-width="3"/><circle cx="50" cy="90" r="5" fill="#0f9f8f"/><circle cx="94" cy="90" r="5" fill="#0f9f8f"/><circle cx="138" cy="90" r="5" fill="#0f9f8f"/></svg>';
        }
        return '<svg width="190" height="110" viewBox="0 0 190 110" aria-hidden="true"><path d="M24 34 L166 48" stroke="#172033" stroke-width="6" stroke-linecap="round"/><path d="M24 82 L166 32" stroke="#46617a" stroke-width="6" stroke-linecap="round"/><circle cx="105" cy="54" r="8" fill="#e25563"/></svg>';
      }

      function renderCatalog() {
        const strip = document.querySelector("[data-category-strip]");
        const grid = document.querySelector("[data-catalog-grid]");
        strip.innerHTML = "";
        grid.innerHTML = "";

        const allButton = document.createElement("button");
        allButton.className = "category-pill";
        allButton.type = "button";
        allButton.textContent = MathLab.text("common.categoryAll");
        strip.appendChild(allButton);

        MathLabData.categories.forEach((category) => {
          const button = document.createElement("button");
          button.className = "category-pill";
          button.type = "button";
          button.textContent = MathLab.text(`categories.${category}`);
          strip.appendChild(button);
        });

        MathLabData.catalog.forEach((lesson) => {
          const card = document.createElement("a");
          card.className = "experiment-card";
          card.href = lesson.href;
          card.innerHTML = `
            <div class="experiment-preview">${previewSvg(lesson.preview)}</div>
            <div class="experiment-body">
              <div class="experiment-meta">
                <span class="meta-chip">${MathLab.text(`categories.${lesson.category}`)}</span>
                <span class="meta-chip">${MathLab.text(`lessons.${lesson.id}.grade`)}</span>
                <span class="meta-chip">${MathLab.text(`lessons.${lesson.id}.interaction`)}</span>
              </div>
              <h2>${MathLab.text(`lessons.${lesson.id}.title`)}</h2>
              <p>${MathLab.text(`lessons.${lesson.id}.summary`)}</p>
            </div>
          `;
          grid.appendChild(card);
        });
      }

      document.addEventListener("DOMContentLoaded", () => {
        renderCatalog();
        MathLab.bindLanguageToggle(renderCatalog);
      });
    </script>
  </body>
</html>
```

- [ ] **Step 2: Open home page manually**

Open: `D:\Study\MyProject\Math\index.html`

Expected:

- Chinese text is readable.
- Three experiment cards appear.
- Language toggle changes home text and card text.
- No corrupted Chinese remains visible.

- [ ] **Step 3: Checkpoint**

If this directory is a git repository:

```bash
git add index.html
git commit -m "feat: redesign home as experiment catalog"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 6: Parallel Lines Teaching Lab

**Files:**
- Replace: `lessons/parallel-lines.html`

- [ ] **Step 1: Replace the lesson with lab layout**

Build `lessons/parallel-lines.html` with:

- Script order: `lab-data.js`, `lab-models.js`, `lab-core.js`.
- A `lab-layout` containing a large SVG stage and right-side controls.
- Controls for mode, angle, distance, and extension visibility.
- Observation and conclusion text from `MathLab.text`.

Use this state shape in the inline script:

```js
const state = {
  mode: "parallel",
  angle: 24,
  distance: 150,
  showExtensions: true
};
```

Use this render contract:

```js
function render() {
  const relation = MathLabModels.geometry.lineRelationState(state.mode, state.angle, state.distance);
  const centerY = 280;
  const offset = relation.distance / 2;
  const angle = relation.mode === "parallel" ? 0 : relation.angleDeg;

  document.getElementById("line-a").setAttribute("transform", `rotate(${-angle / 2} 380 ${centerY - offset})`);
  document.getElementById("line-b").setAttribute("transform", `rotate(${angle / 2} 380 ${centerY + offset})`);
  document.getElementById("line-a").setAttribute("d", `M90 ${centerY - offset} L670 ${centerY - offset}`);
  document.getElementById("line-b").setAttribute("d", `M90 ${centerY + offset} L670 ${centerY + offset}`);

  document.getElementById("meet-dot").style.opacity = relation.intersects ? "1" : "0";
  document.querySelector("[data-observation]").textContent = MathLab.text(
    relation.intersects ? "parallel.observationIntersect" : "parallel.observationParallel"
  );
  document.querySelector("[data-conclusion]").textContent = MathLab.text(
    relation.intersects ? "parallel.conclusionIntersect" : "parallel.conclusionParallel"
  );
}
```

- [ ] **Step 2: Bind controls**

Add event listeners:

```js
document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    render();
  });
});

document.getElementById("angle-input").addEventListener("input", (event) => {
  state.angle = Number(event.target.value);
  render();
});

document.getElementById("distance-input").addEventListener("input", (event) => {
  state.distance = Number(event.target.value);
  render();
});

document.getElementById("extension-input").addEventListener("change", (event) => {
  state.showExtensions = event.target.checked;
  document.querySelectorAll(".guide-line").forEach((line) => {
    line.style.opacity = state.showExtensions ? "1" : "0";
  });
});

MathLab.bindLanguageToggle(render);
render();
```

- [ ] **Step 3: Manual validation**

Open: `D:\Study\MyProject\Math\lessons\parallel-lines.html`

Expected:

- Switching mode changes the observation text.
- Angle slider affects intersect mode.
- Distance slider changes line spacing.
- Language toggle changes labels and observation text.
- Page still works without pressing playback.

- [ ] **Step 4: Checkpoint**

If this directory is a git repository:

```bash
git add lessons/parallel-lines.html
git commit -m "feat: migrate parallel lines to teaching lab"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 7: Square Perimeter Teaching Lab

**Files:**
- Replace: `lessons/squares-rectangle.html`

- [ ] **Step 1: Replace lesson structure**

Build `lessons/squares-rectangle.html` with:

- Side length number input.
- Unit select with `cm` and `m`.
- Join distance range input from `0` to `130`.
- Hidden-side toggle.
- SVG stage with left square fixed and right square position controlled by join distance.

Use this state:

```js
const state = {
  side: 5,
  unit: "cm",
  gap: 130,
  showHidden: true
};
```

- [ ] **Step 2: Implement render**

Use this render contract:

```js
function render() {
  const values = MathLabModels.geometry.squarePerimeterState(state.side);
  const unitText = MathLab.text(`units.${state.unit}`);
  const rightX = 328 + state.gap;
  const joined = state.gap <= 4;

  document.getElementById("right-square").setAttribute("transform", `translate(${rightX} 192)`);
  document.querySelectorAll("[data-side-label]").forEach((node) => {
    node.textContent = `${MathLab.numberText(values.side)} ${unitText}`;
  });
  document.getElementById("hidden-edge").style.opacity = state.showHidden && joined ? "1" : "0";
  document.getElementById("outer-edge").style.opacity = joined ? "1" : "0";

  document.querySelector("[data-observation]").textContent = MathLab.text("squares.observation");
  document.querySelector("[data-conclusion]").textContent = MathLab.text("squares.conclusion", {
    reduced: MathLab.numberText(values.reduced),
    unit: unitText
  });
  document.querySelector("[data-formula]").textContent =
    `4 x ${MathLab.numberText(values.side)} + 4 x ${MathLab.numberText(values.side)} = ${MathLab.numberText(values.before)} ${unitText}\n` +
    `2 x (${MathLab.numberText(values.length)} + ${MathLab.numberText(values.width)}) = ${MathLab.numberText(values.after)} ${unitText}\n` +
    `${MathLab.numberText(values.before)} - ${MathLab.numberText(values.after)} = ${MathLab.numberText(values.reduced)} ${unitText}`;
}
```

- [ ] **Step 3: Bind controls and SVG drag**

Bind input changes:

```js
document.getElementById("side-input").addEventListener("input", (event) => {
  state.side = Number(event.target.value) || 5;
  render();
});

document.getElementById("unit-select").addEventListener("change", (event) => {
  state.unit = event.target.value;
  render();
});

document.getElementById("gap-input").addEventListener("input", (event) => {
  state.gap = Number(event.target.value);
  render();
});

document.getElementById("hidden-input").addEventListener("change", (event) => {
  state.showHidden = event.target.checked;
  render();
});
```

Bind right square drag:

```js
const svg = document.querySelector(".stage-svg");
const rightSquare = document.getElementById("right-square");

MathLab.makeSvgDraggable(svg, rightSquare, {
  onMove(point) {
    state.gap = MathLabModels.clamp(point.x - 328, 0, 130);
    document.getElementById("gap-input").value = state.gap;
    render();
  }
});
```

- [ ] **Step 4: Manual validation**

Open: `D:\Study\MyProject\Math\lessons\squares-rectangle.html`

Expected:

- Changing side from `5` to `8` updates reduced perimeter from `10` to `16`.
- Changing unit changes all labels.
- Dragging the right square changes join distance.
- When joined, hidden edge and outer edge states are visually clear.

- [ ] **Step 5: Run model tests**

Run: `node tests/model-tests.js`

Expected output: `model tests passed`

- [ ] **Step 6: Checkpoint**

If this directory is a git repository:

```bash
git add lessons/squares-rectangle.html
git commit -m "feat: migrate square perimeter to teaching lab"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 8: Equal Sharing And Fractions Lesson

**Files:**
- Create: `lessons/division-fractions.html`
- Modify: `assets/lab-data.js` only if copy needs adjustment
- Test: `tests/model-tests.js`

- [ ] **Step 1: Create quantity lesson page**

Create `lessons/division-fractions.html` with:

- Total input, default `12`.
- Groups input, default `3`.
- Fraction denominator input, default `4`.
- Fraction numerator input, default `1`.
- Stage showing grouped dots for division and a partitioned bar for fractions.
- Observation panel with division and fraction conclusions.

Use this state:

```js
const state = {
  total: 12,
  groups: 3,
  numerator: 1,
  denominator: 4
};
```

- [ ] **Step 2: Implement dot rendering**

Use this helper inside the inline script:

```js
function renderDots(division) {
  const groupLayer = document.getElementById("group-layer");
  groupLayer.innerHTML = "";
  for (let group = 0; group < division.groups; group += 1) {
    const baseX = 90 + group * 150;
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "svg-muted-label");
    label.setAttribute("x", baseX + 42);
    label.setAttribute("y", 116);
    label.textContent = `${group + 1}`;
    groupLayer.appendChild(label);

    for (let index = 0; index < division.each; index += 1) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", baseX + (index % 4) * 26);
      circle.setAttribute("cy", 150 + Math.floor(index / 4) * 26);
      circle.setAttribute("r", "9");
      circle.setAttribute("fill", "#0f9f8f");
      groupLayer.appendChild(circle);
    }
  }
}
```

- [ ] **Step 3: Implement fraction bar rendering**

Use this helper:

```js
function renderFractionBar(fraction) {
  const layer = document.getElementById("fraction-layer");
  layer.innerHTML = "";
  const x = 90;
  const y = 330;
  const width = 520;
  const height = 62;
  const partWidth = width / fraction.denominator;

  for (let index = 0; index < fraction.denominator; index += 1) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x + index * partWidth);
    rect.setAttribute("y", y);
    rect.setAttribute("width", partWidth);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", index < fraction.numerator ? "#f2b84b" : "#fff8e7");
    rect.setAttribute("stroke", "#172033");
    rect.setAttribute("stroke-width", "3");
    layer.appendChild(rect);
  }

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("class", "svg-label");
  label.setAttribute("x", x + width / 2);
  label.setAttribute("y", y + 104);
  label.textContent = `${fraction.numerator}/${fraction.denominator}`;
  layer.appendChild(label);
}
```

- [ ] **Step 4: Implement render and controls**

Use this render:

```js
function render() {
  const division = MathLabModels.quantity.equalSharingState(state.total, state.groups);
  const fraction = MathLabModels.quantity.fractionState(state.numerator, state.denominator);

  document.getElementById("selected-input").max = fraction.denominator;
  renderDots(division);
  renderFractionBar(fraction);

  document.querySelector("[data-division-observation]").textContent = MathLab.text("divisionFractions.observationDivision", division);
  document.querySelector("[data-fraction-observation]").textContent = MathLab.text("divisionFractions.observationFraction", fraction);
  document.querySelector("[data-formula]").textContent =
    `${MathLab.text("divisionFractions.conclusionDivision", division)}\n` +
    `${MathLab.text("divisionFractions.conclusionFraction", fraction)}`;
}
```

Bind controls:

```js
[
  ["total-input", "total"],
  ["groups-input", "groups"],
  ["parts-input", "denominator"],
  ["selected-input", "numerator"]
].forEach(([id, key]) => {
  document.getElementById(id).addEventListener("input", (event) => {
    state[key] = Number(event.target.value);
    render();
  });
});

MathLab.bindLanguageToggle(render);
render();
```

- [ ] **Step 5: Manual validation**

Open: `D:\Study\MyProject\Math\lessons\division-fractions.html`

Expected:

- `12` total and `3` groups shows `4` in each group.
- Changing total to `14` and groups to `3` shows each `4` and a remainder in the formula or observation if implemented.
- Fraction denominator controls partition count.
- Numerator controls selected parts.
- Language toggle updates labels and observations.

- [ ] **Step 6: Run model tests**

Run: `node tests/model-tests.js`

Expected output: `model tests passed`

- [ ] **Step 7: Checkpoint**

If this directory is a git repository:

```bash
git add lessons/division-fractions.html assets/lab-data.js tests/model-tests.js
git commit -m "feat: add equal sharing and fraction lab"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 9: Documentation Cleanup

**Files:**
- Replace: `README.md`

- [ ] **Step 1: Replace README**

Replace `README.md` with:

```md
# Math Motion Lab

Math Motion Lab 是一个轻量的静态网页数学实验台，用来给孩子讲解小学数学概念。

当前方向：

- 桌面端优先，适合家长或老师边讲边操作。
- 每个题目仍然可以是独立 HTML 页面。
- 共享实验台布局、语言切换、数学模型和视觉风格。
- 第一版覆盖几何和数量模型，后续可扩展三角形、除法、分数、小数、行程问题和概率。

## 预览

直接用浏览器打开：

- `index.html`
- `lessons/parallel-lines.html`
- `lessons/squares-rectangle.html`
- `lessons/division-fractions.html`

## 测试

纯数学模型可以用 Node 测试：

```bash
node tests/model-tests.js
```

期望输出：

```text
model tests passed
```

## 文件结构

```text
index.html                         实验目录首页
assets/
  styles.css                       公共视觉样式
  lab-data.js                      中英文字典和实验目录数据
  lab-core.js                      语言、播放、拖拽等公共 UI 工具
  lab-models.js                    纯数学模型计算
lessons/
  parallel-lines.html              平行线与相交线实验
  squares-rectangle.html           正方形合成长方形实验
  division-fractions.html          平均分与分数实验
tests/
  model-tests.js                   数学模型 smoke tests
docs/superpowers/
  specs/                           设计文档
  plans/                           实施计划
```

## 扩展新题目

新增题目时优先选择已有实验模型：

1. 几何类：点、线、角、三角形、周长、面积。
2. 数量类：平均分、分数、小数、数轴、单位块。
3. 未来概率类：硬币、骰子、转盘、抽球、频率统计。

如果题目不能自然放进已有模型，再新增实验引擎或模板。
```

- [ ] **Step 2: Confirm no corrupted Chinese remains in common docs**

Run: `rg -n "�|浜|鍙|骞|绾|鐩|涓|乣" README.md index.html assets lessons docs`

Expected: No output for corruption markers. Legitimate Chinese such as `中文`, `几何`, `分数` is fine.

- [ ] **Step 3: Checkpoint**

If this directory is a git repository:

```bash
git add README.md
git commit -m "docs: update math lab readme"
```

If it is not a git repository, record in the task notes: `Checkpoint only: no git repository present.`

## Task 10: Whole-Site Verification

**Files:**
- Verify: `index.html`
- Verify: `lessons/parallel-lines.html`
- Verify: `lessons/squares-rectangle.html`
- Verify: `lessons/division-fractions.html`
- Verify: `assets/*.js`
- Verify: `assets/styles.css`

- [ ] **Step 1: Run model tests**

Run: `node tests/model-tests.js`

Expected output: `model tests passed`

- [ ] **Step 2: Check script references**

Run: `rg -n "lab-data|lab-models|lab-core|site.js|lesson.js" index.html lessons`

Expected:

- `index.html` references `assets/lab-data.js`, `assets/lab-models.js`, `assets/lab-core.js`.
- Lesson pages reference `../assets/lab-data.js`, `../assets/lab-models.js`, `../assets/lab-core.js`.
- No page still depends on `assets/site.js` or `assets/lesson.js`.

- [ ] **Step 3: Check old corrupted files**

Run: `rg -n "浜|鍙|骞|绾|鐩|乣|�" index.html README.md assets lessons`

Expected: No output.

- [ ] **Step 4: Manual desktop pass**

Open each page in a desktop browser:

- `D:\Study\MyProject\Math\index.html`
- `D:\Study\MyProject\Math\lessons\parallel-lines.html`
- `D:\Study\MyProject\Math\lessons\squares-rectangle.html`
- `D:\Study\MyProject\Math\lessons\division-fractions.html`

Expected:

- Layout is comfortable around 1366px wide.
- Main stage is the visual focus on lesson pages.
- Right panel controls are not cramped.
- Chinese and English toggles work.
- Controls update observations immediately.
- No text overlaps buttons or panels.

- [ ] **Step 5: Manual narrow-width pass**

Resize browser to about 390px wide.

Expected:

- Content stacks vertically.
- Buttons do not overlap.
- Stage remains visible.
- Text remains readable.

- [ ] **Step 6: Final checkpoint**

If this directory is a git repository:

```bash
git add index.html README.md assets lessons tests docs
git commit -m "feat: redesign math motion lab as experiment lab"
```

If it is not a git repository, record in the task notes: `Final checkpoint only: no git repository present.`

## Self-Review

Spec coverage:

- Experiment catalog: Task 5.
- Teaching shell layout: Tasks 4, 6, 7, 8.
- Geometry engine/template proof: Tasks 2, 6, 7.
- Quantity model proof: Tasks 2, 8.
- Future engine extensibility: Tasks 1 and 2 keep data/model boundaries explicit; README documents future probability expansion.
- Chinese corruption cleanup: Tasks 5 and 9.
- Desktop-first UX: Tasks 4 and 10.

Placeholder scan:

- No `TBD`, `TODO`, `fix later`, or intentionally unspecified implementation steps remain.

Type consistency:

- Shared global names are `MathLabData`, `MathLabModels`, and `MathLab`.
- Model namespaces are `MathLabModels.geometry` and `MathLabModels.quantity`.
- Lesson state keys match model function parameters.

