---
foundation: Radius
version: 1.0.0
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

**Migration in progress (#78).** 17 `border-radius` declarations across 16
files still use `--graphite-space-*`. Sixteen of them map cleanly onto kit
values; one does not — `badge` uses 24px, and the kit's scale goes 20 then
`full`. Five further declarations use a hardcoded `50%`, which no fixed radius
expresses: `--graphite-radius-full` only reads as a circle on a square box.
Both are design decisions rather than renames, which is why the migration is
tracked separately.

`token-drift` reports the tangle as a warning. It cannot report it as an error,
because every value still agrees with the kit — 4px is 4px whichever token
carries it. That is precisely why the prohibition above is written down rather
than left to the checker.
