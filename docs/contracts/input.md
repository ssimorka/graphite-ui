---
component: Input
version: 1.2.0
wave: 2
slots:
  - name: Value
    required: true
    notes: None beyond the value itself.
  - name: Leading icon
    required: false
  - name: Trailing icon
    required: false
props:
  - name: type
    values: [text, email, password, number, "etc."]
  - name: size
    values: [sm, md, lg]
  - name: state
    values: [default, focus, disabled, error, invalid]
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
composition_rules:
  - Focus state border is always a tone-step move on `primary`, matching the hover logic already proven on Button.
prohibitions:
  - No placeholder text used as a label substitute — Label is required in the Field composition (Wave 3), never optional as a stand-in.
---

### Input
- **Slots:** None beyond the value itself. Leading/trailing icon optional.
- **Props:** type (text, email, password, number, etc.), size (sm, md, lg), state (default, focus, disabled, error, invalid).
- **Tokens:** `surface` background, `on-surface` value text, `outline` border at rest, `primary` border on focus (tone-step, not a new color), `danger` for the error border; the spacing scale for padding and height.
- **Composition rules:** Focus state border is always a tone-step move on `primary`, matching the hover logic already proven on Button.
- **Prohibitions:** No placeholder text used as a label substitute — Label is required in the Field composition (Wave 3), never optional as a stand-in.
