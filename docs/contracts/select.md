---
component: Select
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
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
  - name: overlay surface
    usage: Open menu uses the Wave 5 overlay surface token.
    depends_on: Wave 5
composition_rules:
  - Depends on the overlay elevation pattern from Wave 5 — flag this as a soft dependency even though Select ships in Wave 2, since its open state borrows Wave 5's surface treatment. Build the trigger first, wire the menu once Wave 5 lands.
prohibitions:
  - No native-select-breaking custom styling that loses keyboard navigation.
---

### Select
- **Slots:** Label (required), option list (required, minimum 2 options).
- **Props:** size (sm, md, lg), state (default, disabled, error).
- **Tokens:** Same as Input for the closed trigger; open menu uses the Wave 5 overlay surface token.
- **Composition rules:** Depends on the overlay elevation pattern from Wave 5 — flag this as a soft dependency even though Select ships in Wave 2, since its open state borrows Wave 5's surface treatment. Build the trigger first, wire the menu once Wave 5 lands.
- **Prohibitions:** No native-select-breaking custom styling that loses keyboard navigation.
