# Math Motion Lab Redesign Design

## Purpose

Math Motion Lab will be redesigned from a pair of isolated animation pages into a desktop-first teaching lab for primary school math. The main user is a parent or teacher explaining concepts to a child at a computer. The experience should support guided explanation, direct manipulation, and future growth from grade 4 topics into grade 5 and beyond.

The redesign should prioritize teaching flow over visual decoration. The interface should make it obvious what can be changed, what is being observed, and what mathematical conclusion follows from the current state.

## Current Context

The project is a static HTML prototype with:

- `index.html` as the home page.
- `lessons/parallel-lines.html` and `lessons/squares-rectangle.html` as independent lesson pages.
- `assets/styles.css` for shared styling.
- `assets/site.js` for home page language switching.
- `assets/lesson.js` for lesson language text and playback controls.

Current problems include:

- The home page and docs contain corrupted Chinese text.
- The lesson pages are too playback-oriented for the desired exploratory teaching style.
- The visual design feels generic and does not clearly support a desktop teaching workflow.
- The structure is tied to individual pages rather than reusable experiment models.

## Product Direction

The product direction is a "math experiment lab":

- Desktop-first, for live explanation by a parent or teacher.
- Organized as an expandable catalog of math experiments and concrete problems.
- Built around direct manipulation: dragging, sliders, inputs, toggles, and visible measurements.
- Supports Chinese and English, but Chinese teaching quality is the first priority.
- Keeps implementation lightweight for now; no build system is required in the first redesign.

## Core Architecture

The redesign should separate the system into four conceptual layers.

### 1. Teaching Shell

The teaching shell is shared by all lesson pages. It provides:

- Header, navigation, and language switching.
- Main experiment stage.
- Parameter panel.
- Observation and conclusion panel.
- Optional playback or replay controls.
- Consistent responsive behavior.

The shell should not know the details of triangle geometry, division, fractions, or probability. It only provides a stable teaching workspace.

### 2. Experiment Engines

An experiment engine owns the domain-specific interaction and calculation rules for a family of math concepts.

Initial engines:

- Geometry engine: points, lines, angles, triangles, parallel and intersecting lines, perimeter, area.
- Quantity model engine: grouping, equal sharing, division, fractions, decimals, number lines, unit blocks, distance-speed-time models.

Future engine:

- Random experiment engine: probability, frequency, dice, coins, spinners, drawing balls, repeated trials, simple statistics.

The design must allow future engines to be added without redesigning the whole app.

### 3. Experiment Templates

An experiment template is a reusable teaching pattern inside an engine.

Examples:

- Triangle and angle lab.
- Three-side triangle validity lab.
- Parallel and intersecting lines lab.
- Square-to-rectangle perimeter lab.
- Equal sharing division lab.
- Fraction block and number line lab.
- Speed-distance-time timeline lab.
- Future probability trial lab.

Each template defines:

- The visual stage model.
- Parameters exposed to the user.
- Drag behaviors.
- Derived observations.
- Conclusion text and formulas.

### 4. Problem Data

Concrete problems should be expressed as data loaded into templates.

Examples:

- "Can sides 3, 4, and 7 form a triangle?"
- "Two squares with side length 5 cm combine into a rectangle. How much does the perimeter decrease?"
- "12 apples are equally shared by 3 children."
- "What does 1/2 + 1/4 mean visually?"

This keeps future growth manageable: new problems should usually be added by choosing a template and filling in defaults, labels, and explanation text.

## Home Page Design

The home page should become an experiment catalog, not a marketing landing page.

It should show:

- Math Motion Lab identity.
- Language toggle.
- Knowledge categories, such as Geometry, Number and Operations, Fractions and Decimals, Word Problems, and future Probability.
- Experiment cards with compact visual previews.
- Clear labels for grade level, topic, and interaction type.

First version scope:

- Keep the catalog simple because there are few lessons.
- Do not add accounts, search, favorites, or progress tracking yet.
- Make future categories visible in structure without pretending unfinished content exists.

## Lesson Page Design

Each lesson page should use a desktop teaching lab layout.

### Main Stage

The main stage is the largest visual area. It should show the mathematical model and support direct manipulation when appropriate.

Examples:

- Drag triangle vertices.
- Drag line endpoints or angle handles.
- Drag a square toward another square.
- Drag or adjust fraction blocks.
- Move an object along a distance-time line.

### Parameter Panel

The parameter panel exposes precise controls.

Examples:

- Side lengths.
- Units.
- Angle size.
- Line distance.
- Number of groups.
- Total quantity.
- Fraction numerator and denominator.
- Speed, time, and distance values.

Use controls that match the data:

- Sliders for continuous values.
- Inputs for exact numbers.
- Select menus for units and modes.
- Toggles for visual overlays.
- Segmented buttons for mode selection.

### Observation Panel

The observation panel translates the current stage state into math language.

Examples:

- "These lines intersect."
- "This angle is obtuse."
- "3 + 4 is not greater than 7, so these sides cannot form a triangle."
- "The hidden internal sides are no longer part of the outside perimeter."
- "12 divided into 3 equal groups gives 4 in each group."

This panel should update immediately when the user drags or changes parameters.

### Playback Controls

Playback should become an auxiliary feature, not the main interaction model.

Use it for:

- Auto-demonstrating a process.
- Resetting to the starting state.
- Replaying a concept after exploration.

The core lesson should remain useful even without pressing play.

## Initial Implementation Scope

The first implementation should prove the new architecture without trying to cover every topic.

Recommended first scope:

1. Redesign the shared teaching shell and home catalog.
2. Create or refactor the geometry model so it can support:
   - Existing parallel and intersecting lines.
   - Existing square-to-rectangle perimeter lesson.
   - Future triangle and angle experiments.
3. Create the first quantity model template for:
   - Equal sharing division.
   - Introductory fraction blocks or number line.
4. Keep existing static-file deployment.

The first implementation does not need a full authoring system or real database.

## Future Expansion

The architecture must support adding new experiment engines.

Future examples:

- Probability and statistics through a random experiment engine.
- Measurement and unit conversion through a measurement engine or quantity extension.
- Multi-step word problems through a problem-solving template.

New engines should plug into the same shell, catalog, language handling, and observation panel conventions.

## Non-Goals For The First Redesign

- No account system.
- No learning record or scoring system.
- No full CMS or backend.
- No large framework migration unless implementation proves static HTML has become a blocker.
- No full coverage of all grade 4 and grade 5 topics in the first pass.

## UX Principles

- Teaching clarity beats decoration.
- Every visible control should affect the model in an understandable way.
- Dragging should teach intuition; inputs should provide precision.
- The child should see cause and effect immediately.
- The parent or teacher should be able to explain from the screen without reading long paragraphs.
- Use restrained but polished visuals: clean typography, stable layout, strong stage focus, and purposeful color.

## Acceptance Criteria

The redesign is successful when:

- The home page reads as an expandable math experiment catalog.
- Lesson pages share a consistent teaching lab layout.
- Existing lessons can be migrated into the new structure.
- At least one geometry template and one quantity model template can fit naturally into the architecture.
- The observation panel updates based on current parameters or dragged state.
- Playback exists as a helpful demonstration, not the only way to use the lesson.
- The architecture can clearly add a future probability engine without changing the shell.
- Chinese text is readable and not corrupted.
- The desktop teaching experience is comfortable and uncluttered.

## Open Implementation Decisions

The implementation plan should decide:

- Whether to keep one HTML file per lesson or introduce data-driven lesson loading.
- How much common JavaScript should move into engine/template modules.
- Whether the first quantity model should use fraction blocks, a number line, or both.
- Whether to repair existing lessons first or build a new flagship triangle/division lesson first.

