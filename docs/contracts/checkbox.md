---
component: Checkbox
version: 3.1.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Always paired, never a bare checkbox. The control renders it itself. There is no wrapper to take it from — the kit builds label text into each form control.
  - name: Supporting text
    required: false
    notes: Help, warning or error text, 8 below the row. The kit calls this Helper / Warning / Error text and builds it into the control the same way; warning and error lead with the shared 16px status icon.
props:
  - name: checked
  - name: indeterminate
  - name: disabled
    notes: The glyph, the label and the help text all take the disabled tone; a checked box stays filled.
  - name: readOnly
    values: boolean
    notes: The kit's Read-only. Native checkboxes ignore readonly, so the box stays focusable, carries aria-readonly and never reports a change. It draws the empty box in the disabled tone with the mark on it.
  - name: indented
    values: boolean
    notes: The kit's Indented, a 28 step in (one 20px frame and its 8 gap), for a child under an indeterminate parent.
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText or warningText is present.
  - name: warningText
    notes: Resolves the kit's Warning, outranked by an error. The box is unchanged; the warning is carried by the message's status icon.
  - name: invalid
    values: boolean
    notes: The error state without a message of its own, for a box whose group carries the message (Checkbox group, #273). The ring and aria-invalid as for errorText.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - name: on-surface
    usage: The box, its ring when unchecked and its fill when checked or indeterminate, which the kit binds to icon-primary; the label text; warning text. The check and dash are knocked out of the fill, so they show what the box sits on.
  - name: primary
    usage: The focus ring, through the family's focus step, a 2px stroke centred on the 20px frame; and the disabled and read-only tone, through its disabled-content step.
  - name: on-surface-variant
    usage: Helper text, which the kit binds to onSurfaceVariant rather than onSurface.
  - name: danger
    usage: The error ring, at the ring's own weight and over the fill when checked; the error text; the error status icon's triangle. One role for all three, so they cannot drift apart.
  - name: warning
    usage: The warning status icon's triangle.
  - name: on-warning
    usage: The "!" on the warning status icon.
  - name: background
    usage: The "!" on the error status icon.
  - name: text
    usage: The label at Body/3.
  - name: spacing
    usage: The row and stack gaps, and the 32px touch target around the 20px frame.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Indeterminate state is visually distinct from both checked and unchecked, not a color swap — a distinct glyph (dash) inside the same box.
  - The box is the kit's glyph, a 15px box with a 1.25 corner inside a 20px frame, not a bordered element. The check and the dash are cut out of the fill rather than drawn on it.
prohibitions:
  - No custom checkbox smaller than the defined minimum touch target, same rule as Button.
---

### Checkbox
- **Slots:** Label (required — always paired, never a bare checkbox).
- **Props:** checked, indeterminate, disabled, readOnly, indented, warningText.
- **Tokens:** `on-surface` for the box (ring and knock-out fill) and the label, `primary-focus` for the ring, `danger` and `warning` for status; the spacing scale for gaps and the touch target.
- **Kit parity** (#229, 3.0.0, a major because the primary-filled check the contract promised is gone): the box is the kit's on-surface glyph. The kit's sibling Checkbox group set has no counterpart: there is no current demand for one (rule 6), so a list of checkboxes is laid out in the caller's own container and the group set is carried on #240.
- **Composition rules:** Indeterminate state is visually distinct from both checked and unchecked, not a color swap — a distinct glyph (dash) inside the same box.
- **Prohibitions:** No custom checkbox smaller than the defined minimum touch target, same rule as Button.
