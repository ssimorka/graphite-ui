---
component: Breadcrumb
version: 1.1.0
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
    usage: The current page crumb, at full strength.
  - name: on-surface-variant
    usage: Non-current crumbs and the separators, at the lower tone-step.
  - name: spacing
    usage: Gaps between crumbs and separators.
composition_rules:
  - Last item is always non-interactive and visually distinct — it represents "here," not a link.
prohibitions:
  - No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
---

### Breadcrumb
- **Slots:** Ordered list of crumb items (required, minimum 1), current-page indicator (required, non-clickable).
- **Props:** separator style (fixed, defined once — not per-instance).
- **Tokens:** `on-surface-variant` for non-current crumbs and separators, full `on-surface` for the current page; the spacing scale for gaps.
- **Composition rules:** Last item is always non-interactive and visually distinct — it represents "here," not a link.
- **Prohibitions:** No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
