---
component: Breadcrumb
version: 1.0.0
wave: 4
slots:
  - name: Ordered list of crumb items
    required: true
    notes: Minimum 1.
  - name: Current-page indicator
    required: true
    notes: Non-clickable.
props:
  - name: separator style
    notes: Fixed, defined once — not per-instance.
tokens:
  - name: on-surface
    usage: At a lower tone-step for non-current crumbs, full `on-surface` for the current page.
composition_rules:
  - Last item is always non-interactive and visually distinct — it represents "here," not a link.
prohibitions:
  - No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
---

### Breadcrumb
- **Slots:** Ordered list of crumb items (required, minimum 1), current-page indicator (required, non-clickable).
- **Props:** separator style (fixed, defined once — not per-instance).
- **Tokens:** `on-surface` at a lower tone-step for non-current crumbs, full `on-surface` for the current page.
- **Composition rules:** Last item is always non-interactive and visually distinct — it represents "here," not a link.
- **Prohibitions:** No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
