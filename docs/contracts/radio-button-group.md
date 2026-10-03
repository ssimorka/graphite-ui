---
component: Radio button group
version: 2.1.0
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
    notes: Help, warning or error text, 8 below the options. The kit calls this Helper / Warning / Error text and builds it into the control the same way; warning and error lead with the shared 16px status icon.
props:
  - name: orientation
    values: [vertical, horizontal]
    notes: The kit's Horizontal axis. Options sit 8 apart down the page and 16 apart across it.
  - name: controlPosition
    values: [left, right]
    notes: The kit's Position on the Radio button set, which names the side the radio sits on. Right draws the label first.
  - name: disabled
    notes: Per-option or group-level. A disabled selected option keeps its dot, in the disabled tone.
  - name: readOnly
    values: boolean
    notes: The kit's Read-only group. The radios stay focusable, the group carries aria-readonly, and a change is never reported, so the selection cannot move.
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText or warningText is present.
  - name: warningText
    notes: Resolves the kit's Warning group, outranked by an error.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - name: on-surface
    usage: The ring, the selected dot, the option labels and warning text. The kit binds the radio glyph to icon-primary, which resolves to onSurface, not to primary.
  - name: primary
    usage: The focus ring, through the family's focus step, 2px outside the 20px frame; and the disabled and read-only tone, through its disabled-content step.
  - name: on-surface-variant
    usage: Group label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
  - name: danger
    usage: Error ring on every option, as the kit's Invalid group draws it, the error text, and the error status icon's triangle. One role for all three, so they cannot drift apart.
  - name: warning
    usage: The warning status icon's triangle.
  - name: on-warning
    usage: The "!" on the warning status icon.
  - name: background
    usage: The "!" on the error status icon.
  - name: text
    usage: Option labels at Body/3.
  - name: spacing
    usage: The gap between options, the label-to-radio gap, and the message offset.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Exactly one option selected at a time within a group is enforced by the component, not left to implementation.
prohibitions:
  - No radio group rendered without a group-level label — individual option labels aren't sufficient for screen readers.
---

### Radio button group
- **Slots:** One label per option (required), group label (required).
- **Props:** orientation (vertical, horizontal), controlPosition (left, right), disabled (per-option or group-level), readOnly, warningText.
- **Tokens:** `on-surface` ring and dot, `primary-focus` ring, `danger` and `warning` status, the spacing scale for option gaps.
- **Kit parity** (#228): the kit's radio is an on-surface ring and dot, not a primary fill; that composition changed in 2.1.0 with no prop removed, so it is a minor. The kit's vertical groups draw their label inside the first option rather than as a group label, a slip with the same pixels; the code keeps one legend.
- **Composition rules:** Exactly one option selected at a time within a group is enforced by the component, not left to implementation.
- **Prohibitions:** No radio group rendered without a group-level label — individual option labels aren't sufficient for screen readers.
