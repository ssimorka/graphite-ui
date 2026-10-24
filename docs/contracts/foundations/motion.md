---
foundation: Motion
version: 1.0.0
source: Graphite UI Kit › Motion (10 variables, 1 mode)
snapshot: docs/tokens/figma-snapshot.json
declared_in: app/globals.scss
checked_by: scripts/token-drift.mjs, scripts/naming-check.mjs
# Verified against app/globals.scss by token-drift.mjs: the kit's ten plus two
# code-only values (indeterminate, travel).
variable_count: 12  # 12 --graphite-motion-*
variables:
  - name: --graphite-motion-duration-instant | -fast | -base | -slow | -emphasis
    count: 5
    values: 0ms, 120ms, 200ms, 300ms, 400ms
    usage: Instant for anything opened by keyboard or used many times a session. Fast for small local changes and exits. Base for things entering. Slow for larger surfaces. Emphasis is the cap.
  - name: --graphite-motion-delay-tooltip
    value: 500ms
    usage: First tooltip hover only. Once one is showing, the next appears instantly while the pointer moves between targets.
  - name: --graphite-motion-easing-out
    value: cubic-bezier(0.2, 0, 0, 1)
    usage: Enter and exit. The default.
  - name: --graphite-motion-easing-in-out
    value: cubic-bezier(0.4, 0, 0.2, 1)
    usage: Something already on screen moving across it.
  - name: --graphite-motion-easing-linear
    value: linear
    usage: Progress only.
  - name: --graphite-motion-spring-sheet
    value: linear() curve, critically damped
    usage: Code only. Drag-driven sheets and drawers, at duration-slow. Figma prototypes use duration-slow with easing-out in its place.
  - name: --graphite-motion-indeterminate
    value: 1400ms
    usage: Code only. The period of a loop (Progress bar's sweep, spinners), not a transition, so the cap does not apply.
  - name: --graphite-motion-travel
    value: 1, or 0 under reduced motion
    usage: Code only. Multiplies every movement distance, so reduced motion turns a rise into a fade.
rules:
  - Motion shows where something came from or where it went. If it teaches nothing, don't animate it.
  - Anything opened by keyboard or used many times a session appears instantly. Menus, command search, tabs, sidebar items, toggles.
  - An exit can carry a short confirmation. The picked item flashes, then the menu closes.
  - Things enter from their source. Popover from its trigger, sheet from the bottom edge, toast from the bottom.
  - Enter and exit use Out. Things moving across the screen use In-out. Linear only for progress. Never ease in.
  - Anything the user drags can be caught mid-motion.
  - Most motion is 120 to 200ms. Nothing runs past 400ms.
  - Tooltips wait on first hover, then show instantly while the pointer moves between targets.
  - Reduced motion. Movement becomes a fade or nothing. Feedback stays.
  - One toast at a time, bottom only. Overlays never stack on overlays.
  - No bounce anywhere. Graphite is a tool.
prohibitions:
  - Never write a raw duration, cubic-bezier() or keyword easing in a stylesheet. naming-check fails on it. A real exception carries `motion-allow: <reason>` in the comment directly above.
  - Never ease in. An exit is Out at fast, not In.
  - Never overshoot. No back curves, no springs with a damping ratio under 1.
  - Never write a movement distance without --graphite-motion-travel, or reduced motion cannot reach it.
  - Do not add a duration past emphasis. Raise it with the kit, which owns the scale.
---

### Motion

**Source.** The kit's `Motion` collection, added 2026-10-24. Before it existed
the kit had no motion variables at all, so a designer re-invented a number per
frame and the code carried ninety literals, half of them past the 400ms cap or
on overshooting springs. Every one now reads a token.

**Units.** Figma has no time type, so durations are number variables in ms and
carry the unit only here. token-drift requires the `ms`: `0.12s` is the same
time but reads differently from the kit, and a bare `120` is not a CSS time.
Easings and the spring are string variables that hold the CSS verbatim, which
is also what their Dev Mode code syntax hands a developer.

**The spring is code only.** A Figma prototype cannot play a `linear()` curve,
and a drag has no fixed duration anyway. In the kit, `duration/slow` with
`easing/out` stands in for it. The curve is a critically damped spring
(damping ratio 1) sampled at 20 points, settled to 0.1% at the end, so it
arrives fast and never overshoots.

**Reduced motion is one layer.** `globals.scss` sets
`--graphite-motion-travel: 0` under `prefers-reduced-motion: reduce` and
narrows every transition to properties that do not move anything. A component
cannot forget it: a rise written as
`translateY(calc(8px * var(--graphite-motion-travel)))` becomes a fade on its
own, and a sliding thumb jumps while its color still eases.
`[data-motion='reduce']` applies the same to a subtree. The adopter's theme
file carries the same block.

**Distances are not tokens yet.** The kit has no distance scale, so travels
still borrow the spacing scale (`--graphite-space-03` for an 8px rise) and
multiply it by travel. Whether the kit wants a `distance/*` group is open.
