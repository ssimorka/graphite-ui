---
component: Text input
version: 2.0.0
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
  - name: surface
    usage: Background.
  - name: outline
    usage: Border at rest.
  - name: primary
    usage: Border on focus (tone-step, not a new color).
  - name: danger
    usage: Error border.
  - name: on-surface
    usage: Value text.
  - name: spacing
    usage: Field padding and height steps.
  - name: radius
    usage: Field corner. Inherited by Select and Text area.
  - name: on-surface-variant
    usage: Label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Focus state border is always a tone-step move on `primary`, matching the hover logic already proven on Button.
prohibitions:
  - No placeholder text used as a label substitute. The label is required on the control itself, never optional as a stand-in.
---

### Text input
- **Slots:** None beyond the value itself. Leading/trailing icon optional.
- **Props:** type (text, email, password, number, etc.), size (sm, md, lg), state (default, focus, disabled, error, invalid).
- **Tokens:** `surface` background, `on-surface` value text, `outline` border at rest, `primary` border on focus (tone-step, not a new color), `danger` for the error border; the spacing scale for padding and height.
- **Composition rules:** Focus state border is always a tone-step move on `primary`, matching the hover logic already proven on Button.
- **Prohibitions:** No placeholder text used as a label substitute. The label is required on the control itself, never optional as a stand-in.
