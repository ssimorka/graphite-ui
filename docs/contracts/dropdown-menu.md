---
component: Dropdown Menu
version: 1.2.0
wave: 5
slots:
  - name: Trigger
    required: true
  - name: Menu items
    required: true
    notes: Minimum 1.
  - name: Separators
    required: false
  - name: Sub-menus
    required: false
props:
  - name: placement
tokens:
  - inherited_from: Popover
    usage: Elevated `surface`, `outline` edge.
  - name: on-surface
    usage: Item labels.
  - name: surface-variant
    usage: Item hover and focus, the same tone-step shift Button uses.
  - name: danger
    usage: Destructive items, which must not read as neutral ones.
  - name: spacing
    usage: Item padding and separator gaps.
  - name: radius
    usage: Panel corner, and the corner on each item.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Item hover/focus state uses the same tone-step logic as Button hover, not a separate highlight convention.
prohibitions:
  - No destructive action (delete, remove) styled identically to a neutral action — destructive items need the status-role treatment once Wave 0 ships; until then, they get explicit confirmation via Dialog rather than a one-click destructive menu item.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Dropdown Menu
- **Slots:** Trigger (required), menu items (required, minimum 1), optional separators and sub-menus.
- **Props:** placement.
- **Tokens:** Same as Popover, plus `on-surface` for item labels, `surface-variant` for the hover and focus tone-step, `danger` for destructive items, and the spacing scale for padding.
- **Composition rules:** Item hover/focus state uses the same tone-step logic as Button hover, not a separate highlight convention.
- **Prohibitions:** No destructive action (delete, remove) styled identically to a neutral action — destructive items need the status-role treatment once Wave 0 ships; until then, they get explicit confirmation via Dialog rather than a one-click destructive menu item.
