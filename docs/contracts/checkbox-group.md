---
component: CheckboxGroup
version: 1.0.0
wave: 2
slots:
  - name: Group label
    required: true
    notes: The fieldset's legend, Input Label in on-surface-variant, 8 above the options. It names the group.
  - name: Options
    required: true
    notes: The governed Checkbox, one per option, in 22px rows 8 apart (vertical) or 16 across (horizontal).
  - name: Supporting text
    required: false
    notes: One message for the group, 8 under the options; error and warning lead with the 16px status icon, 2 in, the text at 28.
props:
  - name: options
    notes: Each a value and a label, optionally disabled.
  - name: value / onChange
    notes: Controlled. The checked options' values.
  - name: orientation
    values: [vertical, horizontal]
    notes: The kit's Horizontal. Vertical by default.
  - name: label
    notes: Required.
  - name: helpText / errorText / warningText
    notes: Through the shared field-message rule. An error rings every box in danger, as the kit's Invalid group does; a warning leaves the boxes as they are.
  - name: disabled
    values: boolean
  - name: readOnly
    values: boolean
    notes: The kit's Read-only, passed to every box.
tokens:
  - name: on-surface-variant
    usage: The group label (Text/text-secondary) and help text.
  - name: on-surface
    usage: Warning text.
  - name: danger
    usage: Error text and the error status icon's triangle.
  - name: warning
    usage: The warning status icon's triangle.
  - name: on-warning
    usage: The "!" on the warning status icon.
  - name: background
    usage: The "!" on the error status icon.
  - name: primary
    usage: The disabled label, through primary-disabled-content.
  - name: spacing
    usage: The 8 and 16 gaps and the message's 2 inset.
composition_rules:
  - The options are the governed Checkbox. Checkbox group passes them read-only, disabled and the error state; it does not restyle them.
  - The message belongs to the group and describes it; no box carries its own.
prohibitions:
  - No checkbox group without a label.
  - No single checkbox in a group. One yes-or-no question is a Checkbox.
---

### CheckboxGroup
- **Slots:** Group label (required), options (required), supporting text.
- **Props:** options, value / onChange, orientation (vertical, horizontal), label, helpText / errorText / warningText, disabled, readOnly.
- **Tokens:** `on-surface-variant` label; the status icon's `danger`, `warning` and `on-warning`; the boxes' own.
- **Composition rules:** Checkbox for the options; one message for the group.
- **Prohibitions:** No unlabelled group; no group of one.
- **Kit parity** (#273, 1.0.0): the one Checkbox group set (`11506:27535`) on every axis. Recorded rather than copied: the kit draws the group label inside the first Checkbox, as it does Radio button group's (#228), and its vertical Enabled variant reads "Group abel".
