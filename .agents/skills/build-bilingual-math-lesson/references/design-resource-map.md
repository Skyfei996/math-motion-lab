# Math Lesson Design Resource Map

Use this map to select only the design references needed for the current lesson. The imported `design-skill/` directory is a large reference library, not a runtime dependency and not a single automatically active skill.

## Selection rules

1. Treat the root `DESIGN.md` as the base system for every lesson.
2. Inspect one existing lesson with a similar teaching structure before opening external references.
3. Select at most one base visual reference and one interaction reference from this map.
4. Read selected files completely. Do not load the entire `design-skill/` tree.
5. Record `Keep`, `Adapt`, and `Avoid` decisions in the `Design Read`.
6. Use references for hierarchy, rhythm, material, palette roles, component behavior, and motion attitude. Do not copy brand identity or exact layouts.
7. Check the nearest `LICENSE` or provenance documentation before copying code, fonts, images, icons, or templates. Reading a design document for inspiration does not authorize copying bundled assets.

## Core workflow references

| Need | Read | Use it for | Do not inherit automatically |
|---|---|---|---|
| Build or substantially redesign a lesson UI | `design-skill/open-design-main/skills/frontend-design/SKILL.md` | Audience-first direction, one coherent aesthetic, typography/layout craft, anti-generic review | React, Tailwind, third-party dependencies when the project is static HTML |
| User provides screenshots, URLs, brands, or “make it feel like this” | `design-skill/open-design-main/skills/reference-design-contract/SKILL.md` | Keep/Change/Do-not-copy evidence discipline | Its three-file output contract unless the task needs those files |
| Request is vague, such as “more designed” or “more playful” | `design-skill/open-design-main/skills/design-brief/SKILL.md` | Resolve mood, density, palette role, typography, layout, and exclusions | Its closed vocabulary and preset token values; project `DESIGN.md` remains authoritative |
| Final UI and accessibility review | `design-skill/open-design-main/skills/web-design-guidelines/SKILL.md` and its `references/guidelines.md` | Labels, focus, forms, motion, responsive behavior, content overflow, semantics | Marketing-specific capitalization or copy rules that conflict with Chinese classroom language |
| Explore real product design systems | `design-skill/awesome-design-md-main/README.md` | Discover a candidate reference and understand the nine-section DESIGN.md schema | Copying a product's full identity or choosing a brand only because it looks fashionable |

## Lesson visual routing

| Lesson signal | Base visual candidate | Optional interaction candidate | Borrow | Avoid |
|---|---|---|---|---|
| Teacher-led explanation, worksheet or blackboard feeling | `design-skill/open-design-main/plugins/_official/design-systems/paper/DESIGN.md` or `design-skill/open-design-main/design-systems/kami/DESIGN.md` | Project classroom controls | Warm material, restrained hierarchy, print-like rhythm, strong number alignment | Dense editorial body type, proprietary fonts, making the page look like a report |
| Lower-grade, friendly, tactile interaction | `design-skill/open-design-main/plugins/_official/design-systems/friendly/DESIGN.md` | `design-skill/open-design-main/plugins/_official/design-systems/duolingo/DESIGN.md` | Rounded clarity, large targets, tactile press feedback, visible progress | Owl green identity, mascot, streaks, gems, excessive gamification |
| Sequential reasoning where each step changes the scene | Project `DESIGN.md` | `design-skill/open-design-main/plugins/_official/design-systems/storytelling/DESIGN.md` | Narrative progression, visual continuity, one focal change per step | Marketing-style emotional copy or decorative scene changes |
| Existing lesson needs polish without changing its identity | Current lesson and strongest related lesson | `design-skill/open-design-main/skills/frontend-design/SKILL.md` redesign workflow | Typography, spacing, hierarchy, state completeness | Replacing the information architecture, controls, or teaching order without approval |
| User names a specific visual reference | Project `DESIGN.md` | `reference-design-contract` workflow | Observable properties tied to the teaching goal | Logos, exact compositions, claims, copy, proprietary assets |

Choose between `paper` and `kami`; do not read both unless their differences materially affect the direction. Use Duolingo only as an interaction reference, not as the base identity of Math Motion Lab.

## Conditional and unsuitable sources

- `design-skill/open-design-main/skills/taste-skill/SKILL.md`: only consult brief inference, anti-default discipline, accessibility, or redesign review when needed. Its primary scope is landing pages and portfolios; its React/Tailwind, dark-mode, motion, icon, and SVG rules do not govern lesson pages.
- `design-skill/open-design-main/skills/soft-skill/SKILL.md`: do not use for a normal lesson surface. Its agency-style motion, luxury spacing, nested-card, and animation mandates compete with teaching clarity.
- `design-consultation`, `design-review`, `plan-design-review`, `ui-skills`, `design-md`, `theme-factory`, and `color-expert`: local files are mainly catalog entries that require separate upstream bundles. Do not claim their full workflow is available from the imported folder.
- Design systems named after companies are reference analyses, not endorsed component libraries. Prefer project tokens and native HTML/CSS/SVG.

## Efficient discovery

When the map does not contain an obvious match, search names and descriptions before opening files:

```powershell
rg -n "playful|education|paper|storytelling|friendly|accessible" design-skill/open-design-main -g "SKILL.md" -g "DESIGN.md"
```

Return a shortlist of no more than three candidates. Read the strongest candidate completely, then stop when it provides enough direction. Do not browse references to collect styles without a decision.

## Required Design Read

Use this structure before the teaching storyboard:

```text
Design Read

Artifact: teacher-controlled / student-interactive / printable companion
Audience: teacher, student age or grade
Teaching job: the mathematical relationship the screen must make visible
Mood: concrete visual language, not only an adjective
Density: low / medium / high, with reason
Motion: low / medium / high, with reason
Base system: project DESIGN.md plus one selected visual reference
Interaction reference: optional, at most one
Keep: reusable qualities supported by evidence
Adapt: changes needed for the math, age, language, or static stack
Avoid: brand identity, unsuitable patterns, and teaching distractions
Lesson-specific visual: one sentence describing the mathematical stage
```

If no imported reference improves the result, write `Base system: project DESIGN.md; no additional reference fits` and explain the mismatch. This still proves that reference discovery happened.

## Dual quality gate

Do not approve a design that passes only one side:

- **Teaching gate:** one question per step, age-appropriate language, visible mathematical evidence, parameter branches, answer timing, and final verification.
- **Visual gate:** coherent reference choice, semantic color, readable type, intentional spacing, clear control hierarchy, complete interaction states, responsive behavior, and no copied brand identity.

