---
component: Radio button group
version: 1.2.0
wave: 2
slots:
  - name: Option label
    required: true
    notes: One per option.
  - name: Group label
    required: true
    notes: When wrapped in a Field, the label text comes from Field; this component still renders it, in its own position.
props:
  - name: orientation
    values: [vertical, horizontal]
  - name: disabled
    notes: Per-option or group-level.
tokens:
  - name: primary
    usage: Fill. Same as Checkbox.
  - name: outline
    usage: Border. Same as Checkbox.
  - name: on-surface
    usage: Group label text.
  - name: spacing
    usage: Control size and the gap between options.
composition_rules:
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
