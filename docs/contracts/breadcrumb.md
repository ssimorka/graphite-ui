---
component: Breadcrumb
version: 1.2.0
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
  - name: maxItems
    type: number
    default: "4"
    notes: The defined max length. A longer trail keeps its first crumb and its tail and collapses the middle behind one overflow button.
tokens:
  - name: on-surface
    usage: The current page crumb, at full strength.
  - name: on-surface-variant
    usage: Non-current crumbs and the separators, at the lower tone-step.
  - name: spacing
    usage: Gaps between crumbs and separators.
  - name: primary
    usage: The focus ring on crumb links and the overflow button, through the page-level focus variable.
composition_rules:
  - Last item is always non-interactive and visually distinct — it represents "here," not a link.
  - The collapsed middle is reachable. The overflow is a button named for what it hides ("Show 3 more breadcrumbs") that expands the trail in place and moves focus to the first crumb it revealed. Once the reader has asked for the whole trail, it may wrap; collapsed, it never does.
prohibitions:
  - No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
---

### Breadcrumb
- **Slots:** Ordered list of crumb items (required, minimum 1), current-page indicator (required, non-clickable).
- **Props:** separator style (fixed, defined once — not per-instance); `maxItems` (number, default 4), the defined max length.
- **Tokens:** `on-surface-variant` for non-current crumbs and separators, full `on-surface` for the current page; the spacing scale for gaps; `primary`, through `--graphite-focus`, for the focus ring on links and the overflow button.
- **Composition rules:** Last item is always non-interactive and visually distinct — it represents "here," not a link. The collapsed middle sits behind a real button, named for how many crumbs it hides, that expands the trail in place and moves focus to the first revealed crumb. The kit's overflow item opens a menu of the hidden crumbs instead. Expanding in place reaches the same crumbs without one; matching the kit's menu (rule 7) is open work.
- **Prohibitions:** No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
