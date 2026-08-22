---
foundation: Radius
version: 1.1.0
source: Graphite UI Kit › Radius (8 variables, 1 mode)
snapshot: docs/tokens/figma-snapshot.json
declared_in: app/globals.scss
checked_by: scripts/token-drift.mjs
# Verified against app/globals.scss by token-drift.mjs, so this cannot go stale
# the way the counts in the parent README did.
variable_count: 8  # 8 --graphite-radius-*
variables:
  - name: --graphite-radius-none
    value: 0
  - name: --graphite-radius-2 | -4 | -6 | -8 | -16 | -20
    count: 6
    unit: px
    usage: The suffix is the pixel value, not an index.
  - name: --graphite-radius-full
    value: 999px
    usage: Pills a box. The kit's own value, not the more common 9999px.
composition_rules:
  - The suffix is the pixel value and is left unpadded to keep it readable as one. Do not pad it to two digits to match --graphite-space-NN, where the number means the opposite thing.
prohibitions:
  - Never express a radius with a spacing token. See the migration note below.
  - Do not "correct" --graphite-radius-full to 9999px. It is 999px because the kit says 999.
  - Do not treat 50% as a radius step. A circle is a shape, not a point on this scale.
---

### Radius

**Source.** The kit's `Radius` collection. Carbon has no radius scale, so
unlike spacing these numbers have no second source to reconcile against — the
kit is the only authority, and always was.

**Unit.** px, matching the kit directly. This is the deliberate opposite of the
spacing decision: a spacing step should track the reader's font size, and a
corner radius has no reason to. Keeping px also leaves `token-drift` comparing
against the snapshot without a root-font assumption in the middle.

**Naming.** `--graphite-radius-16` is 16px. `--graphite-space-06` is Carbon
*step* 6, which is 24px. The two conventions collide by accident of shape, so
radius is left unpadded — `--graphite-radius-2`, not `-02` — to keep the
difference visible at a glance.

**Migration complete (#78).** Every `border-radius` in the component layer now
references this scale. It was 17 declarations across 16 files expressing radius
through `--graphite-space-*`; sixteen were value-identical renames, and `badge`
moved from a 24px corner to `full`. That one looked like a design decision
until the box was measured: the badge is 24px tall and its radius equalled its
height, so it was always a pill, and its own contract said so — *"the pill
radius step"*. `full` renders identically and stays correct if the badge ever
changes height.

**The five `50%` circles are deliberately unmigrated.** `avatar` (twice),
`radio-group`, `switch` and one site-header dot. All five sit on boxes that are
square by construction, so `--graphite-radius-full` would render identically —
but 50% is the honest expression of "circle", and this scale has no circle
step. See the prohibition above.

`token-drift` reported the tangle as a warning while it lasted, and could not
have reported it as an error: every value agreed with the kit throughout — 4px
is 4px whichever token carries it. That is precisely why the prohibition is
written down rather than left to the checker, and why it stays written down now
that the count is zero.
