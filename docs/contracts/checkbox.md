---
component: Checkbox
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Always paired, never a bare checkbox.
props:
  - name: checked
  - name: indeterminate
  - name: disabled
tokens:
  - name: primary
    usage: Fill when checked.
  - name: outline
    usage: Border when unchecked.
composition_rules:
  - Indeterminate state is visually distinct from both checked and unchecked, not a color swap — a distinct glyph (dash) inside the same box.
prohibitions:
  - No custom checkbox smaller than the defined minimum touch target, same rule as Button.
---

### Checkbox
- **Slots:** Label (required — always paired, never a bare checkbox).
- **Props:** checked, indeterminate, disabled.
- **Tokens:** `primary` fill when checked, `outline` border when unchecked.
- **Composition rules:** Indeterminate state is visually distinct from both checked and unchecked, not a color swap — a distinct glyph (dash) inside the same box.
- **Prohibitions:** No custom checkbox smaller than the defined minimum touch target, same rule as Button.
