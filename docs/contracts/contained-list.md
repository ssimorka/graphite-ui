---
component: Contained list
version: 1.2.0
wave: 4
slots:
  - name: Leading
    required: false
    notes: An icon, tag or other short marker.
  - name: Title
    required: true
    notes: Typography.
  - name: Description
    required: false
  - name: Trailing
    required: false
    notes: Tag, Button, or a control.
props:
  - name: density
    values: [compact, default]
tokens:
  - name: density
    usage: Row density steps. Resolves to `--graphite-density-*`.
  - name: on-surface
    usage: Title.
  - name: surface
    usage: Resting background.
  - name: surface-variant
    usage: Hover state — the tone-step shift of surface, not a separate color.
  - name: on-surface-variant
    usage: Description text, at the lower tone-step beneath the title.
  - name: spacing
    usage: Gaps between leading, text, and trailing slots.
composition_rules:
  - This is the row primitive Data table and any future list views should compose from, not reimplement.
prohibitions:
  - No more than one trailing control cluster — if multiple actions are needed, use Menu (Wave 5) as the trailing slot instead of stacking buttons.
---

### Contained list
- **Slots:** Leading (optional — an icon, tag or other short marker), title (required, Typography), description (optional), trailing (optional — Tag, Button, or a control).
- **Props:** density (compact, default).
- **Tokens:** `on-surface` for title, `surface` at rest with `surface-variant` as the tone-step hover shift if the item is interactive, `on-surface-variant` for the description; the density steps for row padding and the spacing scale for slot gaps.
- **Composition rules:** This is the row primitive Data table and any future list views should compose from, not reimplement.
- **Prohibitions:** No more than one trailing control cluster — if multiple actions are needed, use Menu (Wave 5) as the trailing slot instead of stacking buttons.
