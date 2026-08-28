---
component: Checkbox
version: 2.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Always paired, never a bare checkbox. The control renders it itself. There is no wrapper to take it from — the kit builds label text into each form control.
  - name: Supporting text
    required: false
    notes: Help text, or error text. The kit calls this Helper / Error text and builds it into the control the same way.
props:
  - name: checked
  - name: indeterminate
  - name: disabled
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText is present.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - name: primary
    usage: Fill when checked.
  - name: outline
    usage: Border when unchecked.
  - name: on-primary
    usage: Check and indeterminate dash glyphs, drawn on the primary fill.
  - name: spacing
    usage: Box size and the minimum touch target.
  - name: radius
    usage: Box corner.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
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
