---
component: Textarea
version: 1.0.0
wave: 2
inherits: Input
slots:
  - inherited_from: Input
props:
  - inherited_from: Input
  - name: resize
    values: [vertical, none]
    notes: Never horizontal, which breaks layout containers.
tokens:
  - inherited_from: Input
composition_rules:
  - inherited_from: Input
prohibitions:
  - inherited_from: Input
  - No auto-resize beyond a defined max-height without an explicit scroll affordance.
---

### Textarea
- Same contract as Input, with one addition:
- **Props:** resize (vertical, none) — never horizontal, which breaks layout containers.
- **Prohibitions:** No auto-resize beyond a defined max-height without an explicit scroll affordance.
