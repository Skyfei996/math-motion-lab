# Geometry Canvas

## Scope and structure

- Follow the user-provided global AGENTS.md and the project rules in `../../CLAUDE.md`.
- `index.html`, `styles.css`, and `lesson.js` own this canvas UI. Preserve its existing paper/grid visual direction and free-form interaction; do not add a lesson slideshow.
- `canvas-models.js` owns the pure geometry for text/image object transforms, bounds, and straight-line image cutting. Keep existing shared segment models in `../../assets/lab-models.js`.
- Keep both `speaker-script.zh-CN.md` and `speaker-script.en-US.md` synchronized with controls. Design and acceptance live in `../../docs/perimeter-shape-design.md`.
- Store imported image pixels in canvas/library data only, never as generated source files. Screenshots and temporary fixtures belong in the system temporary directory and are not committed.

## Object contract

- Stacking uses one layer per connected segment group, curve, text object, or image piece. The layer menu moves selected layers forward/backward by one unselected layer or to the front/back, preserving their relative order. Selecting any edge targets its entire connected group for stacking; fills, outlines, labels, and endpoints travel together. Rotation/cut overlays remain above scene layers. New objects appear on top; splitting preserves the source layer and joining segment groups uses the higher layer.
- Persist numeric `layer` values with segments, curves, and objects in undo snapshots, clipboard, and library entries. Inserting saved/copied objects places them above the current scene while preserving their internal order. Legacy entries without layers remain readable. No-op stacking must not add undo history; unavailable directions are disabled.

- Rotation uses an explicit operation panel: choose whole shape or segment, select the target, set a pivot with a dedicated action, then drag the visible rotation handle or apply an angle clockwise/counterclockwise. Selecting a target must never move the pivot. Whole-shape selection includes every connected edge; rotation preserves lengths and distances to the pivot. Keep pivot selection separate from object selection.

- Text and image pieces participate in selection, translation, rotation, undo, copy/paste, removal, fit, and library persistence. Existing saved segment/curve entries remain readable.
- The shape picker creates sectors from a positive radius and a central angle in degrees (`0 < sweepAngle <= 360`, default 180). Keep `sweepAngle` separate from the object's rotation `angle`. Partial sectors are a closed arc plus two radii, with perimeter `sweepAngle / 360 * 2 * Math.PI * radius + 2 * radius`; 360 degrees renders a circle without radial edges and has perimeter `2 * Math.PI * radius`. Legacy `semicircle` entries remain readable as 180-degree sectors. Bounds include arc endpoints, contained extrema, and the center for partial sectors.
- Images start as convex rectangles. Each cut splits selected pieces along an infinite straight line into convex closed polygons without moving the image texture. Repeated cuts and cuts after rotation use local image coordinates. Tangential/outside/zero-length cuts leave objects and undo history unchanged.
- Text accepts literal Unicode, including Chinese and mathematical symbols; never interpolate user text as SVG/HTML markup.
- Report library persistence failures visibly; do not claim an unsuccessful save succeeded.

## Validation

Run `node tests/model-tests.js`, `node tests/perimeter-ui-tests.js`, `node tests/canvas-model-tests.js`, and `node tests/canvas-browser-tests.cjs` from the project root. The browser suite starts its own local static server; use the existing Playwright package and an installed browser (or `MATH_BROWSER_PATH`). Run the project lesson-package validator and check the task diff for whitespace errors.

Browser validation covers both desktop sizes (1366×768 and 1440×900), Chinese/English controls, text editing/IME isolation, sector angles (90/180/270/360 and decimals), perimeter, invalid angle rejection, rotated bounds, legacy semicircles, repeated image cutting, image alignment after transforms, undo, mixed-object copy/paste, and library reload. Inspect screenshots and console errors before delivery.

## Known mistakes

- 2026-10-20: Rotation copied a native DOMPoint with object spread and lost its prototype coordinates. A plain-object mock hid the failure. Convert canvas points explicitly to `{ x, y }`; retain a regression mock with prototype coordinate getters. Do not equate simulated pointer tests with browser acceptance. Object selection, pivot selection, and the rotation gesture must be separate visible actions.
