---
component: Label
version: 1.0.0
wave: 1
slots:
  - name: Text
    required: true
  - name: Required-field indicator
    required: false
props:
  - name: size
    values: [sm, md, lg]
    notes: Inherits from paired input where possible.
tokens:
  - name: on-surface
    usage: Text color.
composition_rules:
  - Always associates with exactly one form control via `for`/`id`.
  - Never floats unassociated in a form context.
prohibitions:
  - No color other than `on-surface` or its disabled tone-step.
  - No decorative styling that could be mistaken for a tooltip trigger.
---

### Label
- **Slots:** Text (required). Optional required-field indicator.
- **Props:** size (sm, md, lg) — inherits from paired input where possible.
- **Tokens:** `on-surface` for text color.
- **Composition rules:** Always associates with exactly one form control via `for`/`id`. Never floats unassociated in a form context.
- **Prohibitions:** No color other than `on-surface` or its disabled tone-step. No decorative styling that could be mistaken for a tooltip trigger.
