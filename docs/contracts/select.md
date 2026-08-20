---
component: Select
version: 1.2.0
wave: 2
slots:
  - name: Label
    required: true
    notes: When wrapped in a Field, the label text comes from Field; this component still renders it, in its own position.
  - name: Option list
    required: true
    notes: Minimum 2 options.
props:
  - name: size
    values: [sm, md, lg]
  - name: state
    values: [default, disabled, error]
tokens:
  - inherited_from: Input
    usage: Closed trigger.
composition_rules:
  - Depends on the overlay elevation pattern from Wave 5 — flag this as a soft dependency even though Select ships in Wave 2, since its open state borrows Wave 5's surface treatment. Build the trigger first, wire the menu once Wave 5 lands.
prohibitions:
  - No native-select-breaking custom styling that loses keyboard navigation.
---

### Select
- **Slots:** Label (required), option list (required, minimum 2 options).
- **Props:** size (sm, md, lg), state (default, disabled, error).
- **Tokens:** Same as Input for the closed trigger. The open menu is the browser's own and takes no token from this system — see the composition rule.
- **Composition rules:** The soft dependency on Wave 5's overlay surface resolved the other way. Wave 5 has landed, and Select still renders a native `select`: the platform menu is what keeps type-ahead, arrow keys and mobile pickers working, which its prohibition exists to protect. Replacing it with an overlay-surfaced listbox would mean rebuilding all of that as a combobox, and would be a contract change here rather than a free upgrade.
- **Prohibitions:** No native-select-breaking custom styling that loses keyboard navigation.
