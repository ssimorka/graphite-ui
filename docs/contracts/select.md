---
component: Select
version: 3.0.0
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
    notes: The kit's Read-only. The trigger stays focusable and carries aria-readonly while refusing to open or change. It must not trade away keyboard focus.
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
  - Select is the single choice in a form, on the field shell, and the default. It opens the kit's list, the same one Dropdown does. Use Dropdown for the kit's Dropdown sets, whose trigger is drawn differently, and for a Combo box or Multi-select (dropdown.md, #287).
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Depends on the overlay elevation pattern from Wave 5, through Dropdown's list. This was flagged as a soft dependency when Select shipped in Wave 2 (build the trigger first, wire the menu once Wave 5 lands); 3.0.0 is that wiring.
prohibitions:
  - No list that loses the select-only combobox's keyboard. Arrow keys, Home and End move; Enter or Space opens and chooses; Escape closes; typing jumps to a matching option; focus never leaves the trigger.
---

### Select
- **Slots:** Label (required), option list (required, minimum 2 options).
- **Props:** size (sm, md, lg), state (default, disabled, error).
- **Tokens:** Same as Text input for the closed trigger, including the shared field shell. The trigger's hover fill, which the kit draws for Select and not for Text input, is `elevation-02` (the kit's `field-hover`), the elevation ladder's hover rung; it used to be approximated with `surface-variant`. The open list is Dropdown's own, styled in Dropdown's stylesheet, so its tokens are declared in dropdown.md rather than here: `surface` and the overlay shadow, `surface-variant` for the hovered and keyboard row, `primary-container` and the check for the chosen one.
- **The rest of the kit** (#227): the kit's 16px `fi-rs-angle-small-down` chevron 16 from the edge, dimmed when disabled or read-only; Error and Warning draw the shared status icon 8 before it. Select's own Disabled fills the trigger with the disabled tone and drops the edge (Text input keeps its fill: each set is its own most specific artefact). Read-only is no fill and a plain `outline` rule. The kit draws an empty trigger in every variant but Read-only, a slip; the value is shown, styled as Read-only draws it.
- **The kit's list** (3.0.0, a major: the composition rule and the prohibition both change). Select rendered a native `select` until here, on the grounds that the platform menu kept type-ahead, arrow keys and mobile pickers working. The platform list could not take the kit's look, though: it drew white in both themes, and in the dark one the options inherited light text on it and were close to unreadable. Select now keeps its own trigger, the field shell and every axis above, and opens Dropdown's list through the select-only combobox Dropdown already is (the `useSelectOnly` hook and the list in `dropdown.tsx`, the kit's private `_Dropdown menu list`, both governed by dropdown.md), so the two answer the keyboard identically. Kept from the native element: an uncontrolled Select starts on its first option and keeps its own choice, and `name` still submits with a form, through a hidden input. The list is drawn on `<body>` against the trigger and follows it through scroll and resize, flipping above when there is no room below, so a scrolling or clipping container (a table bar, a modal body, a popover) cannot cut it off; the platform list never could be. Traded away: the phone's own picker, which a list drawn by the page cannot summon. The keyboard the prohibition protected is all still there; the prohibition now names it rather than the element.
- **Composition rules:** The single choice in a form and the default; opens the kit's list, Dropdown's own; Dropdown for its own sets and the other kinds.
- **Prohibitions:** No list that loses the select-only combobox's keyboard.
