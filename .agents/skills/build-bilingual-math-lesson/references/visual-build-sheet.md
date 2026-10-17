# Visual Build Sheet

Read this file for every new lesson or substantial visual redesign. Use it after the `Design Read` and before writing HTML, CSS, SVG, canvas, or animation code. A small maintenance change may reuse the lesson's existing visual system.

## Purpose

Turn an aesthetic direction into a visual system an agent can implement and verify. The goal is not to make a lesson resemble a game. The goal is to give mathematical ideas a concrete world, consistent objects, and meaningful feedback without letting atmosphere compete with reasoning.

The most reliable visual quality comes from three decisions:

1. build a mathematical scene rather than a dashboard of generic cards;
2. draw related objects with one reusable grammar rather than mixing unrelated assets;
3. make interaction feedback obey the apparent material rather than adding motion for decoration.

## Start with the mathematical stage

Write the relationship that must become visible before naming a theme or style. Decide what students should notice, compare, move, group, transform, or verify.

The page should normally read in this order:

1. the mathematical stage;
2. the current question and visual evidence;
3. the operation the teacher or student can perform;
4. navigation and status;
5. atmosphere and decoration.

If the decorative layer is noticed before the current mathematical relationship, reduce its contrast, scale, movement, or detail.

## Define one scene with clear layers

Describe the composition as layers rather than as a list of components:

- **Atmosphere:** sky, wall, paper texture, terrain, room light, or another low-contrast environmental field;
- **Context:** objects that explain where the mathematics lives, such as a fence, shelf, workbench, number line, or measuring surface;
- **Mathematical objects:** the countable, movable, comparable, or transformable objects;
- **Evidence:** labels, braces, highlights, paths, equations, and annotations tied directly to those objects;
- **Controls:** the few actions needed at the current step;
- **Feedback:** success, error, locked rules, transformations, and reveals.

Atmosphere may establish mood, but mathematical objects and evidence must own the highest useful contrast.

## Define an object grammar

Related objects should look as if one illustrator made them for one world. Specify:

- base shapes and proportions;
- outline color and width;
- corner radius or curvature;
- highlight and shadow direction;
- depth treatment: flat, cut paper, soft volume, chalk, wood, metal, or another single material family;
- the parts that remain stable across states;
- the parts allowed to change when the mathematics changes.

Create a shared base before drawing variants. For example, animal counters can share body geometry, outline, eye style, and ground shadow while ears, beaks, tails, or feet distinguish species. A guide character can keep one silhouette and change only its face, light, pose, or speech state.

Do not mix emoji, stock icons, glossy 3D art, flat SVG, and skeuomorphic controls in the same focal scene unless the `Design Read` explicitly explains the contrast.

## Assign colors jobs

Name every important color by its job, not only by its hex value:

- background and environmental depth;
- current focus;
- known information;
- unknown or question;
- student-controlled value;
- success or confirmed rule;
- warning or contradiction;
- inactive or unavailable state.

A color keeps the same job across the lesson. Do not reuse the success color as a decorative accent or change the identity color of a mathematical category between steps.

## Make motion follow material and meaning

Use motion as state feedback. Define it before implementation:

| Event | Direction | Typical duration | Meaning |
| --- | --- | ---: | --- |
| Hover | small lift, tilt, glow, or posture change | 160–220 ms | this object is available |
| Press | short downward travel with reduced shadow | 80–140 ms | the surface was physically pressed |
| Mathematical change | move, regroup, flip, unfold, or transform along a readable path | 200–320 ms per meaningful beat | the representation changed |
| Incorrect attempt | brief material-specific shake, recoil, or mismatch highlight | 200–320 ms | inspect the conflicting evidence |
| Reveal | one purposeful entrance or uncovering motion | 200–320 ms | new evidence is now available |
| Disabled | no travel; reduced contrast with an explicit reason | none | this action is unavailable |

A paper object may bend, flip, or tremble. A wooden button may depress and shorten its shadow. A soft character may squash slightly. A metal object may shift rigidly and reflect light. Do not apply the same generic bounce to every element. Never use a shake or color change as the only error explanation; pair it with the conflicting evidence and a concrete correction cue.

Do not use looping decorative motion, background drifting, parallax, or attention-seeking celebrations. If a mathematical transformation needs several beats, keep each beat within the project's normal motion range and make the sequence stoppable or immediately understandable under `prefers-reduced-motion`.

Use a stable-frame rule for step navigation. The classroom shell, stage surface, persistent objects, and unchanged evidence must remain visually continuous. Do not replay a root-level entrance animation when a renderer replaces the current slide or stage on every click. Prefer persistent nodes or stable keys; when a full render is necessary, render the new root immediately at full opacity and animate only the changed mathematical child. A one-time entrance is acceptable only for the first lesson mount or the genuine first reveal of new evidence.

## Design three static key states first

Before coding, describe or sketch these states at both required desktop viewports:

1. **Opening state:** What is the situation, what can be touched, and what question is being set up?
2. **Core reasoning state:** What relationship is students' attention centered on, and what evidence is visible before the answer?
3. **Final verification state:** How does the page prove the conclusion rather than merely announce it?

Each state must work as a still image. Animation should clarify the transition between understandable states, not rescue a weak composition.

## Required Visual Build Sheet

Use this concise format in the proposal or implementation notes:

```markdown
## Visual Build Sheet

- Mathematical focus: [the relationship students must perceive]
- Visual thesis: [the concrete world and material]
- Scene layers: [atmosphere / context / math objects / evidence / controls / feedback]
- Object grammar: [base shapes, outline, shadow, depth, stable parts, changing parts]
- Color jobs: [focus, known, unknown, controlled, success, warning, inactive]
- Motion language:
  - stable frame: [what stays fixed between adjacent steps and how rerenders avoid root animation]
  - hover: [feedback]
  - press: [feedback]
  - mathematical change: [feedback]
  - incorrect attempt: [feedback]
  - reveal: [feedback]
- Opening state: [composition and available action]
- Core reasoning state: [composition and visible evidence]
- Final verification state: [composition and proof]
- Desktop fit rule: [how the composition fits at 1366×768 and 1440×900]
- Avoid: [specific visual and motion anti-patterns]
```

The sheet should be specific enough that another agent can implement it without inventing a second style.

## Build in this order

1. Implement the mathematical objects and evidence in a static core reasoning state.
2. Establish the object grammar with shared SVG groups, CSS classes, variables, or drawing functions.
3. Add the atmosphere and context at lower contrast.
4. Add controls with complete hover, active, focus-visible, disabled, and selected states.
5. Add mathematical transitions, then error and reveal feedback.
6. Add desktop fit rules based on the three key states.
7. Capture and inspect screenshots before adjusting decorative details.

Do not spend time polishing a background while the mathematical stage, labels, or desktop composition remain unresolved.

## Screenshot review

Inspect the opening, core reasoning, and final verification states at `1366×768` and `1440×900`. Check:

- the mathematical focus is identifiable without reading every sentence;
- the eye reaches the current question, visual evidence, and action in that order;
- labels are attached to the objects they explain;
- repeated objects share geometry, line weight, shadows, and depth;
- color jobs remain stable across states;
- shadows and movement directions match the declared material;
- no label, speech bubble, control, or object overlaps accidentally;
- important targets remain large enough to operate;
- decorative detail does not resemble a control;
- the final state visually verifies the answer;
- reduced motion preserves all meaning;
- both desktop viewports preserve the intended hierarchy without clipping or overflow.

If a screenshot looks like a generic web form with themed decoration around it, return to the scene layers and rebuild the mathematical stage before adding more polish.

## Transition stability review

Screenshots cannot reveal navigation flicker. In a real browser, test every adjacent previous/next transition at normal speed, including reverse navigation and replay when present.

- Record `getBoundingClientRect()` for unchanged key elements immediately before and after navigation; their position and size must remain the same unless the mathematical state intentionally changes them.
- Within roughly 50–100 ms after navigation, inspect the shared or recreated root. It must remain at `opacity: 1` and must not run a root-level entrance animation.
- Confirm that the current mathematical delta still has its intended local animation, such as water-level change, movement, regrouping, transformation, or reveal.
- Watch the transition directly. Fail the review if fixed content flashes, fades, jumps, disappears for a frame, or replays an irrelevant entrance effect even when the final screenshots look correct.
