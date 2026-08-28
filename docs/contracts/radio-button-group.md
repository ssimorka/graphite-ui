---
component: Radio button group
version: 2.0.0
wave: 2
slots:
  - name: Option label
    required: true
    notes: One per option.
  - name: Group label
    required: true
    notes: The control renders it itself. There is no wrapper to take it from — the kit builds label text into each form control.
  - name: Supporting text
    required: false
    notes: Help text, or error text. The kit calls this Helper / Error text and builds it into the control the same way.
props:
  - name: orientation
    values: [vertical, horizontal]
  - name: disabled
    notes: Per-option or group-level.
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText is present.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - name: primary
    usage: Fill. Same as Checkbox.
  - name: outline
    usage: Border. Same as Checkbox.
  - name: on-surface
    usage: Group label text.
  - name: spacing
    usage: Control size and the gap between options.
  - name: on-surface-variant
    usage: Label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
  - name: danger
    usage: Error text, taking the same role as the control's error border so the two cannot drift apart.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Exactly one option selected at a time within a group is enforced by the component, not left to implementation.
prohibitions:
  - No radio group rendered without a group-level label — individual option labels aren't sufficient for screen readers.
---

### Radio button group
- **Slots:** One label per option (required), group label (required).
- **Props:** orientation (vertical, horizontal), disabled (per-option or group-level).
- **Tokens:** Same as Checkbox — `primary` fill, `outline` border — plus `on-surface` for the group label and the spacing scale for control size and option gaps.
- **Composition rules:** Exactly one option selected at a time within a group is enforced by the component, not left to implementation.
- **Prohibitions:** No radio group rendered without a group-level label — individual option labels aren't sufficient for screen readers.
