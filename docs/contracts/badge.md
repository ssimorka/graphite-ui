---
component: Badge
version: 1.0.0
wave: 1
slots:
  - name: Label
    required: true
    notes: Short text or number.
props:
  - name: variant
    values: [neutral]
    blocked_values: [success, warning, danger]
    blocked_on: Wave 0
tokens:
  - name: primary
    usage: Default emphasis variant.
  - name: on-surface
    usage: Neutral variant.
  - name: surface
    usage: Neutral variant.
composition_rules:
  - Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
prohibitions:
  - No status-only badges (success/warning/danger) until Wave 0 ships — ship neutral and primary variants only for now rather than inventing status hex values ad hoc.
---

### Badge
- **Slots:** Label (required, short text or number).
- **Props:** variant (neutral now; success/warning/danger **[blocked on Wave 0]**).
- **Tokens:** `primary` for the default emphasis variant, `on-surface`/`surface` for neutral.
- **Composition rules:** Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
- **Prohibitions:** No status-only badges (success/warning/danger) until Wave 0 ships — ship neutral and primary variants only for now rather than inventing status hex values ad hoc.
