---
component: Text area
version: 1.0.0
wave: 2
inherits: Text input
slots:
  - inherited_from: Text input
props:
  - inherited_from: Text input
  - name: resize
    values: [vertical, none]
    notes: Never horizontal, which breaks layout containers.
tokens:
  - inherited_from: Text input
composition_rules:
  - inherited_from: Text input
prohibitions:
  - inherited_from: Text input
  - No auto-resize beyond a defined max-height without an explicit scroll affordance.
---

### Text area
- Same contract as Text input, with one addition:
- **Props:** resize (vertical, none) — never horizontal, which breaks layout containers.
- **Prohibitions:** No auto-resize beyond a defined max-height without an explicit scroll affordance.
