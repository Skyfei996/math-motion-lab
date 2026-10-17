# Pi discovery: design and content contract

## Current contract: animated scenes (2026-09-08)

This section supersedes the original seven-chapter implementation below. The user confirmed eight scenes and the six-beat rope sequence, and explicitly accepts geometric drawings instead of raster illustration when they can actually perform the actions. This is authorization to implement the confirmed storyboard, not to publish it.

### Design Read

- Audience: primary-school child with a parent, assuming only counting and comparing lengths; no formula fluency required.
- Job: show a circle in everyday life, make measuring a curved edge intelligible, then explain the motivation for improved tools.
- Base: the user's approved pi-discovery palette and precise linework. Interaction reference: the already reviewed storytelling continuity principle; no old lesson code or visual skin.
- Keep: porcelain paper, ink outlines, cobalt and burnt orange. Adapt: full-width vector stage, recognizable bicycle/plate/moon, one concrete action per stop. Avoid: raster paintings as mathematical evidence, numeric dashboards, arbitrary reading sliders, automatic chapter progression.
- Low text density; medium motion, slow enough to follow rope and rigid rods. Formula details remain optional.

### Visual Build Sheet

- Focus: the same orange circumference becomes a straight length; a blue diameter rod becomes the comparison unit.
- Layers: pale room/road context; persistent SVG wheel and tools; attached labels; one question above and one brief observation below; previous/replay/next plus eight chapter shortcuts.
- Grammar: code-native circular wheels with spokes, rigid straight rods, flexible rope; common round linecaps and restrained flat fills. No raster assets or new runtime dependencies.
- Color jobs: ink physical outlines; orange circumference/outside/error; cobalt diameter/inside/computed position; muted context. Labels accompany each meaning.
- Stable frame: header, stage, question area, caption and navigation retain their geometry. Within a scene, persistent SVG groups are changed by attributes; only the semantic delta moves.
- Hover/focus: outline; press: 1 px travel; blocked during an action: explicit disabled button; replay repeats only the current action. No decorative loops.
- Opening key state: bicycle, tabletop plate and round moon; ask where else a child sees circles. No pi digits. Objects are clickable.
- Core key state: wheel at left, marked orange rope straight along the bench, three diameter rods underneath and a visible residual of (pi - 3) diameters. Both desktops preserve exact ratios.
- Final key state: wheel rolls without slipping; an actual endpoint and the position predicted using 3.14 separate across repeated turns. Diameter 1 m, explicit distance scale, error magnified only in a labeled inset.
- Desktop fit: full viewport grid, SVG viewBox 1120 × 460, at 1366×768 and 1440×900; no teaching scroll. Standard SVG text 20–24 units, one 30–36 px question.

### Scene-led deliverables

- Persistent Scene: one wheel anchors measuring, geometry and rolling; workbench and SVG root are stable through related stops.
- State Delta Map: recognize circles → isolate wheel → rigid ruler across/against edge → trace rim → wrap rope → mark meeting → straighten at constant length → take diameter rod → place rods 1/2/3 → inspect remainder → compare smaller circle → name ratio → inspect loose rope/mark/ruler → inner/outer straight paths → double sides → methods and actual finite calculation → rolling/clock/sky/navigation → accumulation and verification.
- Narration Sync: the question describes what to inspect; next-button label names the imminent action; after the action the caption names the visible evidence. Every numbered stop has a matching bilingual script section.
- Representation Change: circle remains while rope straightens; the diameter rod translates rigidly to the rope; polygon edges visibly divide before approaching the circle; optional computation is explicitly a new method rather than a fake geometric morph.
- Motion Meaning: wheel translation matches rotation; rope curves reduce while arc length stays fixed; rods translate without stretching; outside polygon remains tangent; computed error and the inset share a single model.
- Reduced Motion: same exact endpoints, labels, numbering and evidence immediately; replay and navigation remain operable. Background-tab animation completes to the current stop and cannot advance chapters.

### Content accuracy

- Rope measurement is a present-day illustrative experiment, not a documented reconstruction of a named ancient mathematician. https://arxiv.org/abs/1805.01505
- Early approximation methods are incompletely documented. Archimedes used inner/outer polygon bounds. https://mathshistory.st-andrews.ac.uk/HistTopics/Pi_through_the_ages/
- Multiple measured circles suggest a pattern, not a universal proof. Full moon is a round appearance, not a claim that the Moon is a flat circle.
- Fraction/method detail is optional. Wallis is computed honestly; Machin remains labeled supplementary, not Newton's historical procedure. No unverified modern digit record.
- Application is ideal no-slip rolling with a 1 m diameter wheel. GPS illustration only shows a use of mathematics; it is not a GPS error model.

### Verification for this revision

Run package/model checks, numerical rope-length and rolling tests, and browser tests across all stops at both desktops. Observe actual intermediate motion for driving, tracing, wrapping, straightening, rod placement, polygon refinement and rolling; screenshots alone do not pass. Check reverse/replay/jump cancellation, keyboard, reduced motion, sources, formula details, contrast and no automatic advance.

### Animated-scene delivery checks

- 38 teaching stops across the eight approved scenes; both independent printable scripts map to all 38 stops and exact Chinese button labels.
- Package validator, existing model suite, lesson model suite and browser regression passed. Browser checks cover all stops at 1366×768 and 1440×900, catalog navigation, actual intermediate motion, reverse/replay/jump cancellation, keyboard, dialogs, reduced motion, stable frame, readable button states and no page errors.
- Browser rope samples during unfolding: 678.576–678.583 SVG units versus the exact target 216π; the displayed straight length is 678.584 and the diameter rod is 216. Discretization stays below 0.02 units, and the path stays within the stage.
- Polygon refinement adds supporting lines and moves them inward; tests verify every intermediate outside edge stays outside the circle. The magnifier shows these same paths at the explicitly labeled ×6 or ×60 scale.
- Rolling uses one model for angle, position and error. For ten turns of a 1 m diameter wheel, using 3.14 underestimates by 15.927 mm; using 3.1416 overestimates by 0.073 mm. The separate error inset is labeled ×200.
- Static frames were inspected for opening, rope marks/unfolding, rods, smaller circle, all three measurement-error states, geometry, computation, clock, sky/navigation and final verification. Screenshots are stored only in the OS temporary directory.
- Browser animation assertions wait for real intermediate frames rather than assuming that two fixed wall-clock delays necessarily include separate animation frames.
- Local preview: http://127.0.0.1:8766/lessons/pi-discovery/index.html?v=20260908-2 . No public deployment.

## Scope and approval

2026-09-08: 用户确认独立设计并要求制作可体验版本。旧测量课方案保留在会话历史中作为备选。本课是围绕吴军《给孩子的数学课》第一课的原创互动共读伴侣，不逐段复制原文或插画，也不复用旧课代码。

## Sources

- Book metadata, contents and public chapter excerpt: https://xbsu.com/206802-9787521744125.htm
- Wallis product verification: https://mathworld.wolfram.com/WallisFormula.html
- Machin formula and arctangent series verification: https://mathworld.wolfram.com/PiFormulas.html
- Practical precision, explicitly supplementary: https://www.jpl.nasa.gov/edu/news/how-many-decimals-of-pi-do-we-really-need/

Only paraphrase the chapter's high-level route: measurement, geometry, sequences, calculus, computers, then precision. Do not repeat questionable historical claims, transcription errors or outdated computing records. The chapter excerpt's Wallis first factor is incorrect; use 2/1 × 2/3. The implemented fast series is Machin's formula, a supplementary illustration, not a reconstruction of Newton's calculation. Series may be explored without reading formulas.

## Design Read

- Artifact / audience: interactive science reading companion for a primary-school child and parent; basic length and arithmetic assumed, advanced terms offered without derivations.
- Teaching job: understand why people change mathematical tools, distinguish measurement from bounds and computation, choose precision for a purpose.
- Base visual: original science-exhibit editorial design, based on the approved concept image in conversation. No inherited classroom shell, assets or brand.
- Interaction reference: storytelling's continuous object and meaningful transition principle only.
- Keep: one focal action, pause and revisit. Adapt: teacher-led steps become independent explorable chapters. Avoid: worksheets, dashboards, decorative animation and imitated historical handwriting.
- Low text density, medium semantic motion. Cool porcelain, ink, cobalt lower estimate and burnt-orange upper estimate.

## Visual Build Sheet

- Focus: a persistent circle and estimate rail connect different tools.
- Layers: quiet background / geometric objects / attached measurements / local controls / restrained chapter navigation.
- Grammar: accurate flat SVG, consistent 2–3 px lines, tabular numbers, serif Chinese display titles and sans body text, light tactile press feedback.
- Color jobs: cobalt inner/lower, orange outer/upper, ink reference circle, blue main action. Text and markers accompany color.
- Stable frame: header, reading column, figure area and footer never animate on chapter navigation. Only changed mathematical children move.
- Hover: visible boundary; press: 1 px depression; reveal: new attached evidence; incorrect estimate: visible mismatch with explanation; disabled: explicit state, readable colors.
- Opening: one circle/round object, book/chapter title, full exploration question and entry action. No invented school word problem.
- Core: inner/outer polygons, bounded estimate, doubling and local magnification.
- Final: actual and approximate circumferences, selectable diameter, precision and task tolerance; factual error scale, explicit local magnification.
- Fit: 1366×768 and 1440×900, no page/internal teaching scroll; split information into dialog if explanatory, never hide navigation.

## Scene / state contract

1. Opening: what methods can help us calculate a curved boundary? Enter measurement.
2. Measurement: diameter 10 cm, unfold the circumference, adjust a simulated ruler reading and record up to five trials. Label as simulation; trials do not establish a universal proof. Reset reading independently.
3. Geometry: start at 6 edges, double through 768, bounds computed with square-root half-angle recurrence rather than Math.PI. Draw coordinates with trigonometry only for display. Show outward-rounded lower/upper values. Reveal historical bounds as notes, not as outputs of the modern floating-point demo.
4. Sequence: Wallis multiplication, initial zero factors gives 2; add one or ten factors, cap at 10000. Display current factor, estimate and residual. Explain this particular sequence is slow.
5. Calculus: compare Wallis to Machin's arctangent series at matching term counts, not equal wall-clock time. A term has different cost in each method. Offer 1, 2, 4, 8 terms and an optional formula note. Mark Machin as supplementary.
6. Computer: step through Machin rounds, show before, correction and after; bounded auto-run pauses on leaving, reset or hidden page. Explain finite precision; no fake digit stream or unlimited calculation claims.
7. Application: use approximate pi values 3, 3.14, 3.1416 with selectable diameter and tolerance. Calculate absolute circumference error; clearly label the magnified discrepancy. Decide suitability from error ≤ tolerance. Supplement book with NASA precision note.

Persistent Scene: circle and estimate rail, stable frame. State Delta Map: unwrap / ruler move / polygon doubling / added factor / alternative computation / repeated round / precision difference. Narration Sync: short reading follows each result, independent printable optional scripts. Representation Change: both polygons and numeric methods produce markers on a common estimate rail, with an explicit label explaining the transition. Motion Meaning: object motion encodes length or estimate change. Reduced Motion: render the same endpoints and labels immediately.

## Verification

- `node tests/pi-discovery-tests.js`: analytic bounds, monotonic narrowing, finite terms, truthful convergence, unit conversion and tolerance branches.
- `node tests/model-tests.js`: existing model regression.
- `python .agents/skills/build-bilingual-math-lesson/scripts/validate_lesson_package.py lessons/pi-discovery`: bilingual package.
- Browser: all chapters, every control, reverse/jump navigation, paused computation on leave, source dialog, keyboard, both target desktop sizes, screenshots, no console errors, no root flicker, contrast states and reduced motion.
- `git diff --check`; only related files staged. No public deployment in this task.

Browser regression is saved as `tests/pi-discovery-browser.cjs`. With the bundled Playwright on `NODE_PATH` and a local static server on port 8766, run `node tests/pi-discovery-browser.cjs`. It checks both desktop sizes, all seven chapters, source dialogs, ruler keyboard behavior, geometric transitions, 36 application branches, automatic calculation pause/completion and reduced motion. Screenshots are written only to the OS temporary directory. Lesson-specific mistakes and fixes are recorded in `lessons/pi-discovery/.Agent.md`.

## 2026-09-08 delivery verification

- New mathematical tests and existing model regression: passed.
- Package validator: seven synchronized Chinese / English stops; scripts are independent of webpage code.
- Browser regression: passed at both desktop sizes, all seven scenes and 36 application combinations; no console errors, scrolling or hidden navigation.
- Screenshots inspected: opening, geometry, comparison and application at both sizes; additional measurement records, polygon maximum and computer completion states.
- Rope path lengths sampled throughout the unfolding: 565.449–565.490 SVG units (polyline discretization difference below 0.1 unit); conceptual arc length remains constant.
- Geometry transition retains the visual frame's bounding rectangle; root opacity remains 1 with no entrance animation. Reduced motion shows the same final geometry.
- Button state review identified and fixed two disabled-state contrast issues; default, selected and immediate disabled states pass the automated contrast gate, including the computation transition.
- A visible in-app browser deliverable is open at `http://127.0.0.1:8766/lessons/pi-discovery/index.html`. The static lesson also works by opening its `index.html` directly. No production deployment.
