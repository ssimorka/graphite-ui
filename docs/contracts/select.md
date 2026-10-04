---
component: Select
version: 2.4.1
wave: 2
slots:
  - name: Label
    required: true
    notes: The control renders it itself. There is no wrapper to take it from — the kit builds label text into each form control.
  - name: Option list
    required: true
    notes: Minimum 2 options.
  - name: Supporting text
    required: false
    notes: Help text, or error text. The kit calls this Helper / Error text and builds it into the control the same way.
props:
  - name: size
    values: [sm, md, lg]
  - name: state
    values: [default, disabled, error, warning]
  - name: layout
    values: [fixed, inline, fluid]
    notes: The kit's Style axis (Default, Inline) and its Select - Fluid set. Inline's trigger has no fill and no edge at rest and hugs its value; Fluid is a 64px box with the label inside.
  - name: hideLabel
    values: boolean
    notes: The kit's bare Select menu, which draws only the value (Pagination's page picker, #268). The label stays the accessible name, hidden from view; it is still required.
  - name: readOnly
    values: boolean
    notes: The kit's Read-only. A native select has no readonly attribute, so the trigger stays focusable and carries aria-readonly while refusing to open or change. It must not trade away keyboard focus.
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText or warningText is present.
  - name: warningText
    notes: Resolves the warning state, outranked by an error.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - inherited_from: Text input
    usage: Closed trigger.
  - name: on-surface-variant
    usage: Label and helper text, which the kit binds to onSurfaceVariant rather than onSurface.
composition_rules:
  - Select is the native single choice and the default. When a choice needs the kit's own list (Dropdown, Combo box, Multi-select), use Dropdown (dropdown.md, #287).
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Depends on the overlay elevation pattern from Wave 5 — flag this as a soft dependency even though Select ships in Wave 2, since its open state borrows Wave 5's surface treatment. Build the trigger first, wire the menu once Wave 5 lands.
prohibitions:
  - No native-select-breaking custom styling that loses keyboard navigation.
---

### Select
- **Slots:** Label (required), option list (required, minimum 2 options).
- **Props:** size (sm, md, lg), state (default, disabled, error).
- **Tokens:** Same as Text input for the closed trigger, including the shared field shell. The trigger's hover fill, which the kit draws for Select and not for Text input, is `elevation-02` (the kit's `field-hover`), the elevation ladder's hover rung; it used to be approximated with `surface-variant`. The open menu is the browser's own and takes no token from this system — see the composition rule.
- **The rest of the kit** (#227): the kit's 16px `fi-rs-angle-small-down` chevron 16 from the edge, dimmed when disabled or read-only; Error and Warning draw the shared status icon 8 before it. Select's own Disabled fills the trigger with the disabled tone and drops the edge (Text input keeps its fill: each set is its own most specific artefact). Read-only is no fill and a plain `outline` rule. The kit draws an empty trigger in every variant but Read-only, a slip; the value is shown, styled as Read-only draws it.
- **Composition rules:** The soft dependency on Wave 5's overlay surface resolved the other way. Wave 5 has landed, and Select still renders a native `select`: the platform menu is what keeps type-ahead, arrow keys and mobile pickers working, which its prohibition exists to protect. Replacing it with an overlay-surfaced listbox would mean rebuilding all of that as a combobox, and would be a contract change here rather than a free upgrade.
- **Prohibitions:** No native-select-breaking custom styling that loses keyboard navigation.
