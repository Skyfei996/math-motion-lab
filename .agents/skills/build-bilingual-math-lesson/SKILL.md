---
name: build-bilingual-math-lesson
description: Create, visually direct, modify, or review primary-school math lesson packages with design-reference discovery, a scene-led visual system, material-aware interaction feedback, a clear teaching storyboard, one readable lesson folder, co-located lesson-only HTML/CSS/JS, and synchronized printable Chinese and English speaker scripts. Use when building or redesigning a lesson webpage; changing its visual direction, steps, controls, parameters, calculations, branching logic, or final answers; or creating or updating speaker-script.zh-CN.md and speaker-script.en-US.md.
---

# Build Bilingual Math Lesson

## Read project rules first

Read these files completely before changing a lesson:

1. `CLAUDE.md`
2. `lessons/README.md`
3. `docs/teaching-flow-design-guidelines.md`
4. `docs/scene-led-teaching-reference.md`
5. `DESIGN.md`

Treat user instructions as authoritative when they override a project default.

## Discover visual references before designing

For every new lesson or visual redesign, read [`references/design-resource-map.md`](references/design-resource-map.md) completely and follow its routing rules. Do not scan or load the entire `design-skill/` directory.

Inspect sources in this order:

1. the project `DESIGN.md` visual contract;
2. the strongest existing lesson with a similar teaching structure;
3. only the design references selected by the resource map;
4. user-provided screenshots, URLs, or style notes.

Before proposing the storyboard, output a concise `Design Read` containing:

- artifact type, teacher/student audience, target grade, and teaching job;
- visual mood, information density, and motion intensity;
- one base visual reference and at most one interaction reference;
- `Keep`, `Adapt`, and `Avoid` decisions;
- the lesson-specific visual idea that will make the mathematical relationship visible.

State when no imported reference fits and explain why. Do not silently start from a generic aesthetic. Borrow controllable qualities such as hierarchy, rhythm, palette roles, component behavior, or material feeling; never copy a brand's logo, mascot, proprietary assets, exact page composition, or product copy.

For a small maintenance change that preserves the existing visual direction, inspect the current lesson and state that the established direction remains the source of truth; do not redesign it.

## Turn the Design Read into a buildable visual system

For every new lesson or visual redesign, read [`references/visual-build-sheet.md`](references/visual-build-sheet.md) completely. After the `Design Read` and before implementation, produce its `Visual Build Sheet` and define three static key states: the opening state, the core reasoning state, and the final verification state.

Start from the mathematical relationship and build a coherent stage around it. Treat navigation, controls, and status as supporting UI around that stage. Define the scene layers, object grammar, material language, semantic color roles, and motion meanings before choosing decorative details. Prefer code-native SVG, HTML, CSS, or canvas for interactive mathematical objects; use raster artwork only when it has a clear teaching or atmospheric role.

For a small maintenance change, reuse the lesson's established visual system and verify that the change does not introduce a conflicting object, material, color, or motion language.

## Use one lesson folder

Place every new or redesigned lesson in a readable, human-facing folder:

```text
lessons/<lesson-title>/
  index.html
  speaker-script.zh-CN.md
  speaker-script.en-US.md
  styles.css
  lesson.js
```

Require the first three files. Add `styles.css` or `lesson.js` only when the lesson needs page-specific code.

Keep reusable models, shared styles, common data, and shared controls in `assets/`. Keep code used by only one lesson inside that lesson folder. Update the course catalog and cache-busting query strings when paths or assets change.

Never load, fetch, embed, or display either speaker script in the webpage. The scripts are independent printable materials.

## Follow the lesson workflow

1. Identify the target grade, mathematical goal, adjustable parameters, branches, and success criteria.
2. Discover relevant visual references and produce the `Design Read`.
3. Produce the `Visual Build Sheet` and three static key states.
4. Design both the visual contract and teaching storyboard, then receive confirmation before a large implementation.
5. Build or update the tested mathematical model.
6. Build the page so each step has one core question and the visual, calculation, and wording change together.
7. Verify every parameter-dependent branch before writing the final scripts.
8. Derive both speaker scripts from the verified page.
9. Validate the package, visual quality, and project tests before delivery.

Do not use concepts beyond the target grade in student-facing content. Keep rigorous reasoning in concrete, age-appropriate language.

## Enforce the opening-step contract

Step 1 must be a dedicated problem-introduction state inside the mathematical stage. It must dynamically show the complete problem: context and actors or objects, every given condition with numbers and units, any action direction or relationship, and the exact task to solve. End with one prompt asking students to restate what is known and what must be found.

A persistent problem-summary strip, page title, progress label, settings panel, or speaker script does not satisfy this contract. Step 1 must not start teaching a method, pattern, derived formula, transformation process, or isolated sub-question; expressions that belong to the original problem statement remain visible. Begin analysis on Step 2. When parameters change, regenerate the complete introduction and return to Step 1.

## Enforce the viewport contract

At `1366×768` and `1440×900` with browser zoom at `100%`, the opening state, densest reasoning state, and final verification state must each fit within one desktop viewport with the complete primary previous/next navigation visible. The desktop page must satisfy `document.documentElement.scrollHeight <= window.innerHeight + 1`, and each primary navigation button's bounding rectangle must be fully inside the viewport.

Lessons are desktop-only. Do not add or require phone, tablet, or narrow-viewport layouts or checks unless the user explicitly expands the scope. If a desktop state does not fit, split it into more teaching steps or reduce non-teaching spacing and decoration. Do not solve fit problems by shrinking student text, clipping content, adding an internal teaching-area scrollbar, or assigning a large fixed `min-height` that pushes navigation below the fold.

## Keep two contracts aligned

Maintain both contracts throughout implementation:

- **Teaching contract:** learning goal, cognitive bottleneck, one question per step, visual evidence, calculation, branch behavior, and answer timing.
- **Visual contract:** selected references, scene layers, object grammar, material language, semantic color roles, typography, spacing, component shapes, density, motion meanings, desktop fit behavior, and anti-patterns.

Visual polish must make the mathematical relationship easier to perceive. If a visual effect competes with the current teaching question, remove it. Reuse the project shell and shared components; customize the mathematical stage, not the entire product language.

## Keep the frame stable between steps

Treat routine previous/next navigation as a state change inside one stable lesson frame, not as a new page entrance.

- Keep unchanged titles, controls, panels, mathematical objects, and stage geometry visually fixed across adjacent steps.
- Never attach fade, opacity, translate, scale, or entrance animation to a slide, stage, board, or other root node that is recreated on every navigation. A one-time lesson mount may enter once; it must not replay on each step.
- Prefer persistent DOM nodes or stable component keys. If a full render is simpler, make the recreated root render immediately at `opacity: 1` with no root animation.
- Animate only the semantic delta: the object that moves, fills, empties, regroups, transforms, highlights new evidence, or reveals a conclusion.
- Do not animate unchanged objects merely to signal that navigation occurred. Navigation state, progress text, and changed evidence already provide that feedback.
- Keep the same rule for reverse navigation and replay. Honor `prefers-reduced-motion` without hiding the final state.

Do not accept screenshots alone as transition validation. Click through adjacent steps at normal speed and verify that unchanged elements do not flash, fade, jump, or briefly disappear while the intended mathematical change remains animated.

For every new lesson or visual redesign, also provide the six scene-led deliverables defined in `docs/scene-led-teaching-reference.md`: `Persistent Scene`, `State Delta Map`, `Narration Sync`, `Representation Change`, `Motion Meaning`, and `Reduced Motion`. Do not begin a large implementation until they are explicit and confirmed with the storyboard.

## Synchronize page and scripts

Map every page step to one numbered section in each script. Keep these details aligned:

- navigation label and step order;
- exact button or control the teacher operates;
- question and pause before reveal;
- words the teacher can read aloud directly;
- expected calculation or visual result;
- every parameter-dependent branch;
- final answer and any tied minimum solutions.

When a page changes, inspect both scripts in the same task. Update both whenever the teaching sequence, controls, wording, calculations, branches, or answer changes. A visual-only change may leave the speech unchanged, but still run the synchronization check.

## Write printable scripts

Start each script with grade, lesson path, suggested duration, default parameters, and a note explaining teacher cues.

Use this Chinese structure:

```markdown
## 第1站：步骤名称

**操作**

说明点击或展示什么。

**提问**

写给学生的问题。

**停顿**

说明何时等待学生回答。

**讲解**

写老师可以直接照读的话。

**页面检查**

写页面应出现的数字或结论。
```

Use this English structure:

```markdown
## Stop 1: Step name

**Action**

State the exact page operation.

**Ask**

Write the question for students.

**Pause**

State when to wait.

**Say**

Write natural classroom English that can be read aloud.

**Screen check**

State the expected number or conclusion.
```

Keep operation labels identical to the current language of the webpage. Write natural English rather than a mechanical translation. Put alternate parameter paths under clearly labeled conditional branches and tell the teacher to read only the matching branch.

## Validate

Run:

```powershell
python .agents/skills/build-bilingual-math-lesson/scripts/validate_lesson_package.py "lessons/<lesson-title>"
node tests/model-tests.js
git diff --check
```

Then open the lesson from the catalog and verify:

- shared and local assets load;
- back navigation works;
- scripts are not referenced by webpage files;
- default and branch calculations are correct;
- Step 1 presents the complete parameter-driven problem inside the mathematical stage and does not begin the method or a partial derivation;
- answer stays hidden until the final step;
- at `1366×768` and `1440×900`, the opening, densest, and final states have no page-level vertical overflow and the full primary navigation is inside the viewport;
- both required desktop viewports have no accidental overlap, clipping, or horizontal overflow;
- the implemented page still matches the approved `Design Read` and project `DESIGN.md`;
- the opening, core reasoning, and final verification states still match the approved `Visual Build Sheet`;
- the mathematical stage has one clear visual focus and does not use decorative effects that compete with the explanation;
- repeated objects follow one drawing grammar, and colors keep the same semantic jobs across states;
- hover, press, transformation, error, and reveal feedback follow the declared material logic instead of generic motion;
- routine previous/next navigation keeps the shared frame stable: unchanged elements preserve their bounding rectangles, the recreated root (if any) has no animation and stays at full opacity, and only the mathematical delta animates;
- interactive controls have hover, active, focus-visible, and disabled states where applicable;
- screenshots of the opening, densest, and final states at both required desktop viewports show no accidental overlap, clipping, unreadable labels, hidden navigation, or broken visual hierarchy;
- the browser console has no new errors.

Do not report completion if the validator, model tests, or relevant browser checks fail.
