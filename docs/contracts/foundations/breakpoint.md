---
foundation: Breakpoint
version: 1.1.0
source: Graphite UI Kit › Breakpoint (4 modes) + Breakpoint LG–XL (2 modes)
snapshot: docs/tokens/figma-snapshot.json
declared_in: app/globals.scss
checked_by: scripts/token-drift.mjs
# Verified against app/globals.scss by token-drift.mjs, so this cannot go stale
# the way the counts in the parent README did.
variable_count: 5  # 5 --graphite-breakpoint-*
variables:
  - name: --graphite-breakpoint-sm
    value: 320px
  - name: --graphite-breakpoint-md
    value: 672px
  - name: --graphite-breakpoint-lg
    value: 1056px
  - name: --graphite-breakpoint-xl
    value: 1312px
  - name: --graphite-breakpoint-max
    value: 1584px
composition_rules:
  - lg and xl are two tokens, not one lg-xl. The kit keeps them in a separate collection the main one aliases into per mode; collapsing them would flatten a distinction the kit makes.
  - A max-width bound sits one below the next breakpoint up — 671px is md minus one. token-drift knows this convention and accepts both forms.
prohibitions:
  - These cannot drive a media query. A custom property does not resolve in an @media condition; a rule written as `@media (max-width: var(--graphite-breakpoint-md))` silently never matches.
  - Do not add the Modal sizing variables from the same collection. They are modal geometry keyed by breakpoint, not breakpoints.
---

### Breakpoint

**Source.** The kit's `Breakpoint` collection for `sm`, `md` and `max`, and the
separate `Breakpoint LG–XL` collection — which the main one aliases into per
mode — for `lg` and `xl`.

**Unit.** px, matching the kit directly, for the same reason as radius: these
are reference values rather than layout inputs, so there is nothing for a rem
to buy.

**The limitation worth understanding.** CSS custom properties do not work in
media query conditions. These tokens therefore cannot govern a single
breakpoint in this codebase; they exist so the numbers have one authoritative
home, and so JS can read them. Every `@media` rule still carries its number
literally.

`token-drift` closes that gap from two sides.

It scans `@media` conditions and warns when one matches no kit breakpoint
(accepting both a breakpoint and one-below-it, per the convention above). One
currently does not — a `max-width: 419px` rule in `app/globals.scss` that
corresponds to nothing in the kit.

That scan cannot see `@include breakpoint.breakpoint(lg)`, because the mixin
compiles to a media query at build time and there is no literal number in the
source to read. So the check reads Carbon's `$grid-breakpoints` map directly
and compares it to the kit instead — if the two ever diverge, every one of
those 15 media queries is following Carbon, and this fails. They agree as of
`@carbon/grid` 11.56.0: 320 / 672 / 1056 / 1312 / 1584.

Note Carbon calls the 1312px stop **`xlg`** where the kit and these tokens call
it `xl`. The check maps between them; anyone reading the mixin calls should
know the names do not line up.

**Scope.** The `Breakpoint` collection holds four variables and only one,
`Viewport size`, is a breakpoint. The other three — `Modal min-width`,
`Modal max-width`, `Modal text margin right` — alias into the `Modal`
collection across mode names that do not correspond (`SM (320px)` against
`Large`), so the snapshot records a default-mode fallback for them. They are
modal geometry that happens to be keyed by breakpoint, and they are
deliberately not part of this foundation.
