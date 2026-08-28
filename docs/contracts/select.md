---
component: Select
version: 2.0.0
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
    values: [default, disabled, error]
  - name: label
    notes: Required. There is no shape in which this control exists unlabelled, and no wrapper left to supply one.
  - name: helpText
    notes: Supporting copy. Suppressed while errorText is present.
  - name: errorText
    notes: Its presence resolves the error state, so error text and error styling cannot be shown apart. This was Field's guarantee and it survives Field.
tokens:
  - inherited_from: Text input
    usage: Closed trigger.
composition_rules:
  - Label and supporting text are the control's own, not a wrapper's. Removing Field removed the only place they used to compose; the kit's shape is that each form control carries them, so the rule that error text and error state derive from one value is enforced inside the control instead.
  - Depends on the overlay elevation pattern from Wave 5 — flag this as a soft dependency even though Select ships in Wave 2, since its open state borrows Wave 5's surface treatment. Build the trigger first, wire the menu once Wave 5 lands.
prohibitions:
  - No native-select-breaking custom styling that loses keyboard navigation.
---

### Select
- **Slots:** Label (required), option list (required, minimum 2 options).
- **Props:** size (sm, md, lg), state (default, disabled, error).
- **Tokens:** Same as Text input for the closed trigger. The open menu is the browser's own and takes no token from this system — see the composition rule.
- **Composition rules:** The soft dependency on Wave 5's overlay surface resolved the other way. Wave 5 has landed, and Select still renders a native `select`: the platform menu is what keeps type-ahead, arrow keys and mobile pickers working, which its prohibition exists to protect. Replacing it with an overlay-surfaced listbox would mean rebuilding all of that as a combobox, and would be a contract change here rather than a free upgrade.
- **Prohibitions:** No native-select-breaking custom styling that loses keyboard navigation.
