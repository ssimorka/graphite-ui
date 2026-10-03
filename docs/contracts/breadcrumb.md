---
component: Breadcrumb
version: 1.3.0
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
  - name: icon
    type: ReactNode
    notes: The kit's Show Icon slot, a 16px glyph before the first crumb (the kit draws fi-rs-bread-slice). Optional and decorative.
tokens:
  - name: on-surface
    usage: The current page crumb, the separators and the leading icon (Text/text-primary and Icon/icon-primary in the kit), and a link's colour while pressed.
  - name: spacing
    usage: Gaps between crumbs and separators.
  - name: primary
    usage: Link crumbs and the overflow glyph (Link/link-primary), their hover through primary-hover, and the 1px focus ring through the page-level focus variable.
  - name: text
    usage: Every crumb and separator in Body/3.
composition_rules:
  - Last item is always non-interactive and visually distinct — it represents "here," not a link.
  - The collapsed middle is reachable. The overflow is a menu button named for what it hides ("Show 3 more breadcrumbs") that opens a Menu of the hidden crumbs, as the kit's Overflow item does; selecting one navigates to it. The trail itself never wraps.
prohibitions:
  - No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
---

### Breadcrumb
- **Slots:** Ordered list of crumb items (required, minimum 1), current-page indicator (required, non-clickable).
- **Props:** separator style (fixed, defined once — not per-instance); `maxItems` (number, default 4), the defined max length; `icon`, the kit's optional Show Icon.
- **Tokens:** `primary` for link crumbs, underlined, with `primary-hover` on hover; `on-surface` for the current page, the separators and the icon; Body/3 throughout; 8px either side of a separator; a 1px focus ring outside the label, through `--graphite-focus`.
- **The kit's shape** (#223): link crumbs are underlined at rest because the item set draws every link state that way; the composite's one un-underlined first crumb reads as a slip. The kit's Current state keeps the underline too, which would make "here" look clickable, so that one is recorded and not copied.
- **Composition rules:** Last item is always non-interactive and visually distinct — it represents "here," not a link. The collapsed middle sits behind a menu button, named for how many crumbs it hides, that opens a Menu of them: the kit's Overflow item, `fi-rs-menu-dots` at 12px on the baseline. This replaces the earlier expand-in-place behaviour.
- **Prohibitions:** No breadcrumb trail exceeding a defined max length without a truncation pattern (collapse middle items behind an overflow, don't just wrap).
