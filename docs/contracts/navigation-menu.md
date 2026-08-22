---
component: Navigation Menu
version: 1.2.0
wave: 4
slots:
  - name: Top-level items
    required: true
  - name: Nested items per top-level item
    required: false
props:
  - name: orientation
    values: [horizontal, vertical]
tokens:
  - name: primary
    usage: Active/current-page indicator.
  - name: on-surface
    usage: Default items.
  - name: spacing
    usage: Item padding and gaps between levels.
  - name: radius
    usage: Corner on each item.
composition_rules:
  - Depends on the overlay surface pattern (Wave 5) for any nested/flyout menus — same soft dependency as Select.
prohibitions:
  - No more than two nesting levels — a third level should become a dedicated page, not a deeper flyout.
---

### Navigation Menu
- **Slots:** Top-level items (required), nested items per top-level item (optional).
- **Props:** orientation (horizontal, vertical).
- **Tokens:** `primary` for active/current-page indicator, `on-surface` for default items; the spacing scale for padding and level gaps.
- **Composition rules:** Depends on the overlay surface pattern (Wave 5) for any nested/flyout menus — same soft dependency as Select.
- **Prohibitions:** No more than two nesting levels — a third level should become a dedicated page, not a deeper flyout.
