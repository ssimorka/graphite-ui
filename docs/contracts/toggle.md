---
component: Toggle
version: 3.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Describes the setting being toggled, 16 above the switch. The control renders it itself. There is no wrapper to take it from — the kit builds label text into each form control.
  - name: Value
    required: false
    notes: The kit's Show value, on by default. The state as text (On, Off), Body/3, 8 after the switch. Decorative, since the switch announces its own state.
  - name: Supporting text
    required: false
    notes: Help text, or error text. The kit calls this Helper / Error text and builds it into the control the same way.
props:
  - name: checked
  - name: disabled
  - name: readOnly
    values: boolean
    notes: The kit's Read-only. The switch stays focusable, carries aria-readonly and never reports a change. No track fill, a 1px rule inside it in the disabled tone, an on-surface thumb.
  - name: size
    values: [default, sm]
    notes: The kit's Size. Default is 48 by 24 with an 18px thumb; Small is 32 by 16 with a 10px thumb that carries the kit's check when on. Both keep a 32px hit area.
  - name: hideLabel
    values: boolean
    notes: The kit's Toggle only. The label is hidden from view, not from assistive tech, so the switch keeps its name; the value goes with it.
  - name: showValue
    values: boolean
    notes: The kit's Show value. True by default, as the kit has it.
  - name: valueText
    notes: The value's two strings, On and Off by default.
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText is present.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - name: success
    usage: Fill when on, as the kit binds it (D3 on #219). The thumb's position, not the colour, is what says on, so no meaning rests on colour alone.
  - name: outline
    usage: Fill when off.
  - name: on-primary
    usage: The thumb while enabled, the kit's icon-on-color.
  - name: primary
    usage: The focus ring, through the family's focus step. Its disabled step is the track when disabled, on or off alike as the kit draws it, and its disabled content is the thumb, the read-only rule and the dimmed text, so the thumb stays visible and its position still tells on from off.
  - name: text
    usage: The value at Body/3.
  - name: spacing
    usage: Track and thumb dimensions.
  - name: radius
    usage: Track corner. The thumb is a shape, not a radius step.
  - name: on-surface-variant
    usage: Label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
  - name: on-surface
    usage: The value text, the read-only thumb, and the check on the Small thumb.
  - name: danger
    usage: Error ring around the track, and error text. One role for both, so the two cannot drift apart.
  - name: motion
    usage: Duration for the track fill and the thumb travel. The easing stays a plain ease rather than the settle curve, because a switch is a short mechanical move and not something entering the viewport.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Label text describes the setting being controlled ("Notifications"), not the state itself ("On/Off"). The state is the value text's job, beside the switch, and the switch position's.
prohibitions:
  - No switch used for an action that isn't reversible immediately — that's a Button's job, not a Toggle's.
---

### Toggle
- **Slots:** Label (required, describes the setting being toggled).
- **Props:** checked, disabled, readOnly, size (default, sm), hideLabel, showValue, valueText.
- **Tokens:** `success` fill when on and `outline` when off, as the kit binds them, with `on-primary` for the thumb and the spacing scale for track dimensions.
- **Kit parity** (#233, 3.0.0, a major: on is `success` rather than `primary`, the label moved above the switch, and the value text is on by default). The kit's focus ring is an unbound Carbon blue and its disabled label and value bind the disabled fill step; neither is copied: the ring is `primary-focus` and dimmed text is disabled content, as on every other form control. The kit's Small label sits 17 above the track; built at 16, as Default. The motion tokens carry the duration of both the track fill and the thumb travel, so the switch moves at the same speed as the controls around it; the easing stays a plain ease, because a switch is a short mechanical move rather than something entering the viewport.
- **Composition rules:** Label text describes the setting being controlled ("Notifications"), not the state itself ("On/Off"): that is the value text's job.
- **Prohibitions:** No switch used for an action that isn't reversible immediately — that's a Button's job, not a Toggle's.
