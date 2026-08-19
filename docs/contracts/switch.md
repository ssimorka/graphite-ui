---
component: Switch
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Describes the setting being toggled.
props:
  - name: checked
  - name: disabled
tokens:
  - name: primary
    usage: Fill when on.
  - name: outline
    usage: Fill when off. Same tone-step logic as Button's active state, not a separate green/gray convention.
composition_rules:
  - Label text describes the state being controlled ("Notifications"), not the state itself ("On/Off") — the switch position already communicates that.
prohibitions:
  - No switch used for an action that isn't reversible immediately — that's a Button's job, not a Switch's.
---

### Switch
- **Slots:** Label (required, describes the setting being toggled).
- **Props:** checked, disabled.
- **Tokens:** `primary` fill when on, `outline` fill when off — same tone-step logic as Button's active state, not a separate green/gray convention.
- **Composition rules:** Label text describes the state being controlled ("Notifications"), not the state itself ("On/Off") — the switch position already communicates that.
- **Prohibitions:** No switch used for an action that isn't reversible immediately — that's a Button's job, not a Switch's.
