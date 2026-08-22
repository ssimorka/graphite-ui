---
foundation: Spacing
version: 2.0.0
source: Graphite UI Kit › Spacing (14 variables, 1 mode)
snapshot: docs/tokens/figma-snapshot.json
declared_in: app/globals.scss
checked_by: scripts/token-drift.mjs
# Verified against app/globals.scss by token-drift.mjs, so this cannot go stale
# the way the counts in the parent README did.
variable_count: 17  # 14 --graphite-space-* plus 3 --graphite-density-*
variables:
  - name: --graphite-space-00 … --graphite-space-13
    count: 14
    unit: rem
    usage: The raw scale. 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160px.
  - name: --graphite-density-compact | -default | -spacious
    count: 3
    usage: Semantic steps that alias into the scale. Components bind here, not to a raw step.
composition_rules:
  - Components bind to a density step where one fits. A raw step is for the cases the three semantic steps do not cover, not the default reach.
  - The suffix is Carbon's step index, not a pixel value. --graphite-space-02 is step 2, which is 4px.
prohibitions:
  - Never use a spacing token as a border-radius. It is a category error the value diff cannot see, because the numbers agree. Use --graphite-radius-*.
  - Do not convert the scale to px. The rem is what makes it answer to a reader who has changed their root font size.
---

### Spacing

**Source.** The kit's `Spacing` collection. Before #72 these were interpolated
from Carbon's `$spacing-*`; they now come from the snapshot, and the kit is the
authority. The numbers were identical either way at the time of the swap —
verified step by step against Carbon's own `_spacing.scss` — so nothing moved.
The point of the change was to make a future divergence in Carbon's scale
*drift to catch* rather than a value to inherit silently.

**Unit.** rem, at the kit's px ÷ 16. The kit stores px; emitting px raw would
drop the rem scaling the scale has always had and change behaviour for anyone
running a non-default root size.

**`--graphite-space-00`.** New in #72. The kit carries an explicit zero and
Carbon has no counterpart, so the code scale previously started at 01.

**Known gap.** `app/globals.scss` still reaches past these tokens to Carbon
directly — 147 uses of `spacing.$spacing-NN` across 134 declarations — so the
site chrome inherits Carbon's scale, not the kit's. They agree today. `token-drift` reports
this as a warning rather than a failure; closing it is its own piece of work.
