---
component: Item
version: 1.1.0
wave: 4
slots:
  - name: Leading
    required: false
    notes: Avatar or icon.
  - name: Title
    required: true
    notes: Typography.
  - name: Description
    required: false
  - name: Trailing
    required: false
    notes: Badge, Button, or a control.
props:
  - name: density
    values: [compact, default]
tokens:
  - name: density
    usage: Row density steps. Resolves to `--graphite-density-*`.
  - name: on-surface
    usage: Title.
  - name: surface
    usage: Hover state as a tone-step shift if the item is interactive.
composition_rules:
  - This is the row primitive Table and any future list views should compose from, not reimplement.
prohibitions:
  - No more than one trailing control cluster — if multiple actions are needed, use Dropdown Menu (Wave 5) as the trailing slot instead of stacking buttons.
---

### Item
- **Slots:** Leading (optional — Avatar or icon), title (required, Typography), description (optional), trailing (optional — Badge, Button, or a control).
- **Props:** density (compact, default).
- **Tokens:** `on-surface` for title, `surface` hover state as a tone-step shift if the item is interactive.
- **Composition rules:** This is the row primitive Table and any future list views should compose from, not reimplement.
- **Prohibitions:** No more than one trailing control cluster — if multiple actions are needed, use Dropdown Menu (Wave 5) as the trailing slot instead of stacking buttons.
