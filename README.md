# Math Motion Lab

## Purpose

Math Motion Lab is a lightweight static math experiment lab for explaining primary school math with interactive visual models.

The project is meant to stay simple and easy to inspect. It can run directly from local HTML files, while shared data, layout behavior, language switching, model logic, and visual style live in the common assets.

## Current Direction

- Desktop-first experience for parent- or teacher-led explanation.
- New or redesigned lessons use one readable lesson folder containing the page, print scripts, and lesson-only assets.
- Shared lab layout, language switching, math models, and visual style are reused across lessons.
- The first version covers geometry and quantity models.
- Future expansion can include triangles, division, fractions, decimals, word problems, and probability.

## Preview Instructions

Open these files directly in a browser:

- `index.html`
- `lessons/parallel-lines.html`
- `lessons/squares-rectangle.html`
- `lessons/division-fractions.html`
- `lessons/租车怎样最省钱/index.html`
- `lessons/周长不变形状变/index.html`

No build step is required for the current static version.

## Test Instructions

Run the model tests with Node:

```bash
node tests/model-tests.js
node tests/perimeter-ui-tests.js
```

Expected output:

```text
model tests passed
perimeter UI tests passed
```

## Current File Structure

```text
index.html
courses.html
assets/
  styles.css
  catalog-preferences.js
  course-manager.css
  course-manager.js
  lab-data.js
  lab-core.js
  lab-models.js
lessons/
  README.md
  parallel-lines.html
  squares-rectangle.html
  division-fractions.html
  租车怎样最省钱/
    index.html
    styles.css
    lesson.js
    speaker-script.zh-CN.md
    speaker-script.en-US.md
  周长不变形状变/
    index.html
    styles.css
    lesson.js
    speaker-script.zh-CN.md
    speaker-script.en-US.md
tests/
  model-tests.js
  perimeter-ui-tests.js
docs/
  superpowers/
    specs/
      2026-06-24-math-lab-redesign-design.md
    plans/
      2026-06-24-math-lab-redesign.md
DEVELOPMENT_TASK.md
README.md
```

## Extension Guidance

Before adding a new lesson, read `docs/teaching-flow-design-guidelines.md`.
For new word-problem or teaching-flow pages, design the walkthrough first and wait for user confirmation before writing code.
Use the per-lesson folder structure in `lessons/README.md`. Keep the Chinese and English printable speaker scripts synchronized with the page whenever the lesson flow, controls, calculations, or answer changes.

When adding a new lesson, choose an existing engine first:

- Use the geometry engine for lines, angles, shapes, area, and future triangle lessons.
- Use the quantity engine for division, fractions, decimals, and word-problem representations.
- Add a future probability engine when lessons need random events, sample spaces, or outcome comparisons.

Add a new engine or page template only when the existing geometry or quantity model cannot describe the lesson clearly. Keep lesson-specific code small, and move shared behavior into `assets/lab-core.js`, `assets/lab-data.js`, or `assets/lab-models.js` when it becomes useful across more than one lesson.
