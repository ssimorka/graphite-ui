---
component: Checkbox
version: 1.1.0
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
  - name: on-primary
    usage: Check and indeterminate dash glyphs, drawn on the primary fill.
  - name: spacing
    usage: Box size and the minimum touch target.
composition_rules:
  - Indeterminate state is visually distinct from both checked and unchecked, not a color swap — a distinct glyph (dash) inside the same box.
prohibitions:
  - No custom checkbox smaller than the defined minimum touch target, same rule as Button.
---

### Checkbox
- **Slots:** Label (required — always paired, never a bare checkbox).
- **Props:** checked, indeterminate, disabled.
- **Tokens:** `primary` fill when checked, `outline` border when unchecked, `on-primary` for the check and dash glyphs; the spacing scale for box size and touch target.
- **Composition rules:** Indeterminate state is visually distinct from both checked and unchecked, not a color swap — a distinct glyph (dash) inside the same box.
- **Prohibitions:** No custom checkbox smaller than the defined minimum touch target, same rule as Button.
