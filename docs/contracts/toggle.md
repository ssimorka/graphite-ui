---
component: Toggle
version: 1.3.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Describes the setting being toggled. When wrapped in a Field, the label text comes from Field; this component still renders it, in its own position.
props:
  - name: checked
  - name: disabled
tokens:
  - name: primary
    usage: Fill when on.
  - name: outline
    usage: Fill when off. Same tone-step logic as Button's active state, not a separate green/gray convention.
  - name: surface
    usage: Thumb, which must read against both the on and off track.
  - name: spacing
    usage: Track and thumb dimensions.
  - name: radius
    usage: Track corner. The thumb is a shape, not a radius step.
composition_rules:
  - Label text describes the state being controlled ("Notifications"), not the state itself ("On/Off") — the switch position already communicates that.
prohibitions:
  - No switch used for an action that isn't reversible immediately — that's a Button's job, not a Toggle's.
---

### Toggle
- **Slots:** Label (required, describes the setting being toggled).
- **Props:** checked, disabled.
- **Tokens:** `primary` fill when on, `outline` fill when off — same tone-step logic as Button's active state, not a separate green/gray convention — with `surface` for the thumb and the spacing scale for track dimensions.
- **Composition rules:** Label text describes the state being controlled ("Notifications"), not the state itself ("On/Off") — the switch position already communicates that.
- **Prohibitions:** No switch used for an action that isn't reversible immediately — that's a Button's job, not a Toggle's.
