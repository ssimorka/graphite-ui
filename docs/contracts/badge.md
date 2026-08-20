---
component: Badge
version: 2.0.0
wave: 1
slots:
  - name: Label
    required: true
    notes: Short text or number.
props:
  - name: variant
    values: [neutral, danger, warning, success]
tokens:
  - name: primary
    usage: Default emphasis variant.
  - name: on-surface
    usage: Neutral variant.
  - name: surface
    usage: Neutral variant.
  - name: danger-container
    usage: Background on the danger variant.
  - name: warning-container
    usage: Background on the warning variant.
  - name: success-container
    usage: Background on the success variant.
  - name: on-danger-container
    usage: Text on the danger variant.
  - name: on-warning-container
    usage: Text on the warning variant.
  - name: on-success-container
    usage: Text on the success variant.
composition_rules:
  - Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
prohibitions:
  - No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex.
---

### Badge
- **Slots:** Label (required, short text or number).
- **Props:** variant (neutral, danger, warning, success).
- **Tokens:** `primary` for the default emphasis variant, `on-surface`/`surface` for neutral, and `danger-container`/`warning-container`/`success-container` with the matching `on-*-container` for status variants.
- **Composition rules:** Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex.
