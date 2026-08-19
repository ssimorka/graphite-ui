---
component: Field
version: 1.0.0
wave: 3
slots:
  - name: Label
    required: true
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
  - notes: No new tokens — inherits from whichever atom it wraps.
composition_rules:
  - "This is the contract that actually prevents drift at the form level: Field is the only place Label + input + error text are allowed to compose."
  - No page should hand-assemble a label next to an input outside this wrapper.
prohibitions:
  - No error text present without the child input also being in `error` state — text and visual state must move together, never one without the other.
---

### Field
- **Slots:** Label (required), one input-family atom (required — Input, Textarea, Checkbox, Radio Group, Switch, or Select), help text (optional), error text (optional, replaces help text when present).
- **Props:** required (boolean), state (inherits from child input).
- **Tokens:** No new tokens — inherits from whichever atom it wraps.
- **Composition rules:** This is the contract that actually prevents drift at the form level: Field is the only place Label + input + error text are allowed to compose. No page should hand-assemble a label next to an input outside this wrapper.
- **Prohibitions:** No error text present without the child input also being in `error` state — text and visual state must move together, never one without the other.
