---
component: Text input
version: 2.1.0
wave: 2
slots:
  - name: Value
    required: true
    notes: None beyond the value itself.
  - name: Leading icon
    required: false
  - name: Trailing icon
    required: false
  - name: Label
    required: true
    notes: Built into the control, not supplied by a wrapper. The kit ships no standalone label component and no field wrapper; it makes label text a property of the control itself.
  - name: Supporting text
    required: false
    notes: Help text, or error text. The kit calls this Helper / Error text and builds it into the control the same way.
props:
  - name: type
    values: [text, email, password, number, "etc."]
  - name: size
    values: [sm, md, lg]
  - name: state
    values: [default, focus, disabled, error, invalid]
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText is present.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - name: elevation
    usage: The field's fill, elevation-01, the kit's Field/field-01. Select's hover rung, elevation-02, comes through the same inheritance.
  - name: outline
    usage: The bottom rule at rest, through its strong step (outline-strong), which is also the placeholder colour; read-only quietens it to the subtle step. A rule on the bottom only, never a box.
  - name: primary
    usage: The focus ring, through the family's focus step: 2px inside all four sides.
  - name: danger
    usage: The error ring, 2px inside, and the error text.
  - name: on-surface
    usage: Value text.
  - name: text
    usage: The value at Body/3 at every size; size changes the height, never the type.
  - name: spacing
    usage: Field padding and height steps.
  - name: radius
    usage: Field corner. Inherited by Select and Text area.
  - name: on-surface-variant
    usage: Label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Focus is the primary family's focus ring, 2px inside the field, the same inside-ring geometry Button uses. Error is the same ring in danger and holds through focus.
prohibitions:
  - No placeholder text used as a label substitute. The label is required on the control itself, never optional as a stand-in.
---

### Text input
- **Slots:** None beyond the value itself. Leading/trailing icon optional.
- **Props:** type (text, email, password, number, etc.), size (sm, md, lg), state (default, focus, disabled, error, invalid).
- **Tokens:** `elevation-01` fill, `on-surface` value text in Body/3 at every size, an `outline-strong` rule on the bottom edge only (and as the placeholder colour), the `primary` family's focus ring and a `danger` error ring, both 2px inside; the spacing scale for padding and height.
- **The shell is the kit's** (governance rule 7, measured in #220): a bottom-only rule rather than a box, an inside ring rather than an outside one, and one type size across sizes. Disabled keeps the fill, drops the rule and dims the label and helper with the value. Read-only (the native attribute) clears the fill and quietens the rule to `outline-subtle`. The shell is shared with Text area and Select through `_field-shell.scss`.
- **Composition rules:** Focus is the primary family's focus ring, 2px inside, the geometry Button uses. Error is the same ring in danger and holds through focus.
- **Prohibitions:** No placeholder text used as a label substitute. The label is required on the control itself, never optional as a stand-in.
