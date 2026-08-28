---
component: Toggle
version: 2.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Describes the setting being toggled. The control renders it itself. There is no wrapper to take it from — the kit builds label text into each form control.
  - name: Supporting text
    required: false
    notes: Help text, or error text. The kit calls this Helper / Error text and builds it into the control the same way.
props:
  - name: checked
  - name: disabled
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText is present.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
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
  - name: on-surface-variant
    usage: Label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
  - name: on-surface
    usage: The required-field indicator beside the label.
  - name: danger
    usage: Error text, taking the same role as the control's error border so the two cannot drift apart.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
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
