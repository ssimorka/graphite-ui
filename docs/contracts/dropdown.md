---
component: Dropdown
version: 1.1.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Input Label in on-surface-variant, above the trigger (Fixed), beside it (Inline) or inside it (Fluid). It names the combobox and its list.
  - name: Trigger
    required: true
    notes: The kit's Dropdown input. The value (or the Prompt text) in Body/3 on-surface, and a 16px chevron that turns over while open; in Error and Warning the status glyph comes before the chevron.
  - name: List
    required: true
    notes: The kit's private _Dropdown menu list, under the trigger at its width, on surface with the overlay shadow, seven rows tall before it scrolls. Rows are the private _Dropdown list item at the trigger's height.
  - name: Supporting text
    required: false
    notes: Help, error or warning text under the trigger (beside it, Inline).
props:
  - name: kind
    notes: Two exports share this contract. The Dropdown is the select-only choice. The combo box form is the kit's Combo box (Default and Fluid), a single choice found by typing: the trigger is a text input that filters the list as the reader types (a label containing the text matches), with a 16px clear (cross-small) and a 1 × 16 outline divider before the chevron once a value is chosen. Only a listed option becomes the value; leaving the field puts the chosen label back. Its onChange takes null when cleared, and its Prompt text is "Filter...".
  - name: options
    notes: Each a value and a label, optionally disabled.
  - name: value / onChange
    notes: Controlled. The chosen value, or null.
  - name: placeholder
    notes: The kit's Prompt text, "Choose an option" by default.
  - name: size
    values: [sm, md, lg]
    notes: The kit's Size, the trigger and the rows at 32, 40 or 48. Large by default.
  - name: layout
    values: [fixed, inline, fluid]
    notes: The kit's Style (Fixed, Inline) and its Dropdown - Fluid set.
  - name: helpText / errorText / warningText
    notes: Through the shared field-message rule.
  - name: disabled
    values: boolean
  - name: readOnly
    values: boolean
    notes: Readable, not changeable; the chevron is hidden, and an empty value reads "No option selected", as the kit draws it.
tokens:
  - name: surface-variant
    usage: The trigger's fill, and a row under the pointer or the keyboard.
  - name: outline
    usage: The trigger's bottom rule, the rule 16 in at the top of each row, and the combo box's divider before the chevron.
  - name: surface
    usage: The list's fill.
  - name: on-surface
    usage: The value and Prompt text, the chevron, and the active and selected rows' labels.
  - name: on-surface-variant
    usage: The label, help text and the rows' labels at rest; the combo box's empty-field text and "No matches".
  - name: primary-container
    usage: The selected row's fill.
  - name: primary
    usage: The focus ring and the active row's border through primary-focus; the disabled fill and content through primary-disabled and primary-disabled-content.
  - name: danger
    usage: The error ring, the error text and the error glyph's triangle.
  - name: warning
    usage: The warning glyph's triangle.
  - name: on-warning
    usage: The "!" on the warning glyph.
  - name: background
    usage: The "!" on the error glyph.
  - name: shadow
    usage: The list's overlay shadow.
  - name: motion
    usage: The list's entrance and the chevron's turn.
  - name: text
    usage: Body/3 for the value and rows.
  - name: spacing
    usage: The trigger's padding, the row height and padding, the rule's 16 inset, the Inline gaps.
composition_rules:
  - The combo box form is the editable ARIA combobox with list autocomplete. Typing filters and opens the list; arrows move; Enter chooses; Escape closes an open list, or clears what was typed on a closed one; the clear button is named "Clear selected item". A filter that leaves nothing shows "No matches".
  - The ARIA select-only combobox. Focus stays on the trigger; the active option is its aria-activedescendant; the list is a listbox of options. Arrow Down, Arrow Up, Enter or Space open it; arrows, Home and End move; Enter or Space chooses; Escape closes; typing jumps to the next option that starts with what was typed.
  - Select stays the native single choice and the default. Use Dropdown when the choice needs the kit's list rather than the platform's.
  - The kit's remaining Dropdown kinds (Multi-select, Filterable multi-select) extend this contract as they land, each in its own version.
prohibitions:
  - No dropdown without a label.
  - No dropdown for actions. That is a Menu or a Menu button.
---

### Dropdown
- **Slots:** Label (required), trigger (required), list (required), supporting text.
- **Props:** options, value / onChange, placeholder, size (sm, md, lg), layout (fixed, inline, fluid), helpText / errorText / warningText, disabled, readOnly.
- **Tokens:** `surface-variant` trigger with an `outline` rule; `surface` list with the overlay `shadow`; `primary-container` selected; `on-surface` and `on-surface-variant` text.
- **Composition rules:** The select-only combobox; Select stays the native default; the other kinds extend this contract.
- **Prohibitions:** No unlabelled dropdown; no dropdown of actions.
- **Kit parity** (#287, 1.0.0): the Dropdown kind, Dropdown - Default (`14032:290635`) and - Fluid (`14505:302528`), with the private menu list, list item (Single select) and chevron sets, on every axis but Skeleton, which has no counterpart by rule. 1.1.0 (#287, part 2) adds the Combo box kind, Dropdown - Combo box - Default (`14032:290976`) and - Fluid (`14505:304219`). Multi-select and Filterable multi-select follow in their own PRs. Recorded rather than copied, or kept as drawn: the trigger is drawn on surface-variant with an outline rule, not the field shell's elevation-01 and outline-strong, consistently across all eight Dropdown sets, so it is kept as the Dropdown's own (rule 7). The Prompt text binds on-surface, the value's colour, where other fields' placeholders are quieter; kept as drawn. The AI layer and AI label instanced in these variants belong to the permanently ungoverned AI sets and are not built. The Fluid label's tooltip trigger is not drawn, as the other fields' Fluid labels do not take one.
