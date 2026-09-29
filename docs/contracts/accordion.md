---
component: Accordion
version: 1.0.0
wave: 4
slots:
  - name: Trigger
    required: true
    notes: The heading. It is a button, and it owns the expanded state.
  - name: Indicator
    required: true
    notes: Rotates to show state. Never the only signal that a panel is open.
  - name: Panel
    required: true
    notes: The revealed region, labelled by its own trigger.
  - name: Panel control
    required: false
    notes: One instance-swap slot inside the panel, for a control the content needs.
props:
  - name: type
    type: "'single' | 'multiple'"
    default: "'single'"
    notes: Whether one panel or several may be open at once.
  - name: collapsible
    type: boolean
    default: "false"
    notes: Lets the open panel close again, leaving none open. Only meaningful for single; a multiple accordion can always close every panel.
  - name: size
    type: "'sm' | 'md' | 'lg'"
    default: "'md'"
    notes: The kit's Small, Medium and Large.
  - name: flush
    type: boolean
    default: "false"
    notes: Drops the outer rules and the horizontal inset, so the list sits flush inside a container that already has its own edge.
  - name: align
    type: "'left' | 'right'"
    default: "'right'"
    notes: Which edge the indicator sits on.
  - name: className
    type: string
    notes: Merged after the variant recipe, so a caller can extend without forking.
tokens:
  - name: surface
    usage: Panel and trigger background.
  - name: on-surface
    usage: Trigger label.
  - name: on-surface-variant
    usage: Panel body copy, and the indicator glyph.
  - name: surface-variant
    usage: The rule between items, the outer border when flush is false, and the trigger hover background. The kit's outlineSubtle binds surfaceVariant in this system, so all three are one role. Hover is a tone step on the resting fill, never a new color.
  - name: primary
    usage: The focus ring on the trigger, through the page-level focus variable.
  - name: spacing
    usage: Trigger and panel padding.
  - name: text
    usage: Trigger label and panel copy, on the body ladder.
  - name: motion
    usage: The panel's open and close transition, on the settle curve.
composition_rules:
  - A trigger and its panel are one pair. The panel is labelled by its own trigger, so a screen reader announces the two together rather than an orphaned region.
  - Use `multiple` when the panels are independent of each other. Use `single` when opening one makes the others irrelevant.
  - Use `flush` when the list already sits inside something with a border.
prohibitions:
  - Never hide information the reader needs to finish the task in front of them. An accordion shortens a long page; it is not a place to put required content.
  - No accordion inside an accordion. Two levels of disclosure is a navigation problem wearing a component.
  - The trigger is a real button, so Enter and Space both work. It is never a div with a click handler.
  - The indicator never carries the open state on its own. Pair it with a change the reader can also feel in layout, which the panel opening already is.
  - No hardcoded duration or easing on the panel. The transition binds the motion tokens and falls back to an instant change under prefers-reduced-motion.
---

### Accordion
- **Slots:** Trigger (required, the `title` of an item, or the trigger part when composing by hand), Indicator (required), Panel (required), Panel control (optional, one control inside the panel).
- **Props:** type (single, multiple), collapsible, size (sm, md, lg), flush, align (left, right), className.
- **Tokens:** `surface`, `on-surface`, `on-surface-variant`, `surface-variant` for the fills, text and rules; `primary` only for the focus ring; `spacing`, `text` and `motion` for geometry and the transition.
- **Composition rules:** A trigger and its panel are one pair, labelled to each other. `multiple` for independent panels, `single` where opening one makes the others irrelevant.
- **Prohibitions:** No hiding required content, no nesting, no non-button trigger, no open state carried by the indicator alone, no hardcoded motion.

### Naming note
The kit gives the optional panel control the name of its instance-swap slot. This contract names it for what it is, because `drift-check` treats a capitalised word that matches a component export as a dependency the contract must declare, and that word is also the name of a utility export.

### Where this came from
Adopted under rule 6's demand test: the home page's FAQ used Carbon's Accordion, and it is the one new contract `docs/SHADCN-MIGRATION.md` budgets for. The shape is the kit's Site design (Graphite UI Site 11814:17, "Component page — Accordion"), which draws Size (Small, Medium, Large), Alignment (Right, Left), Flush and Expanded across 5 sets and 120 variants. The Graphite kit has no governed Accordion set yet, so under rule 8 this contract is authoritative until it does.
