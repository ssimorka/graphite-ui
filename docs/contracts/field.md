---
component: Field
version: 1.2.0
wave: 3
slots:
  - name: Label
    required: true
    notes: Field always owns the label content. Atoms that place their own label mark themselves `ownsLabel`; Field passes the text to those instead of rendering a second one.
  - name: Input-family atom
    required: true
    notes: One of Input, Textarea, Checkbox, Radio Group, Switch, or Select.
  - name: Help text
    required: false
  - name: Error text
    required: false
    notes: Replaces help text when present.
props:
  - name: required
    values: boolean
  - name: state
    notes: Inherits from child input.
tokens:
  - name: on-surface
    usage: Help text.
  - name: danger
    usage: Error text, matching the error border its child input takes.
  - name: spacing
    usage: Gaps between label, control, and message.
  - notes: The control itself introduces no tokens — it inherits from whichever atom it wraps.
composition_rules:
  - "This is the contract that actually prevents drift at the form level: Field is the only place Label + input + error text are allowed to compose."
  - No page should hand-assemble a label next to an input outside this wrapper.
  - Exactly one label exists per field, and Field decides what it says. Where it renders is the atom's business — above the control for Input and Textarea, beside or above it for the atoms that place their own.
prohibitions:
  - No error text present without the child input also being in `error` state — text and visual state must move together, never one without the other.
---

### Field
- **Slots:** Label (required), one input-family atom (required — Input, Textarea, Checkbox, Radio Group, Switch, or Select), help text (optional), error text (optional, replaces help text when present).
- **Props:** required (boolean), state (inherits from child input).
- **Tokens:** The wrapped control introduces none — it inherits from whichever atom it wraps. Field's own text does: `on-surface` for help text and `danger` for error text, matching the border its child takes, plus the spacing scale for the gaps between label, control, and message.
- **Composition rules:** This is the contract that actually prevents drift at the form level: Field is the only place Label + input + error text are allowed to compose. No page should hand-assemble a label next to an input outside this wrapper. Exactly one label exists per field and Field decides what it says; where it renders is the atom's business, since a checkbox label sits beside its control and a text field's sits above it.
- **Prohibitions:** No error text present without the child input also being in `error` state — text and visual state must move together, never one without the other.
