---
component: Accordion
version: 1.1.0
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
  - name: on-surface
    usage: Trigger label, panel copy and the indicator glyph, all Text/text-primary and Icon/icon-primary in the kit.
  - name: outline
    usage: The rule between items and the outer rule when flush is false, through its subtle step (the kit's Border/border-subtle-00).
  - name: elevation
    usage: The trigger's hover fill, elevation-02 (the kit's Layer/layer-hover-01). The item itself is transparent.
  - name: primary
    usage: The focus ring on the trigger, through the page-level focus variable, and the disabled title, copy and indicator, through its disabled-content step.
  - name: spacing
    usage: Trigger and panel padding.
  - name: text
    usage: Trigger label and panel copy, both Body/3 at every size; size changes the trigger height only.
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
- **Tokens:** `on-surface` for the title, copy and indicator; `outline-subtle` for the rules; `elevation-02` for the hover fill on a transparent item; `primary` for the focus ring and the disabled tone; `spacing`, `text` (Body/3) and `motion` for geometry, type and the transition.
- **Composition rules:** A trigger and its panel are one pair, labelled to each other. `multiple` for independent panels, `single` where opening one makes the others irrelevant.
- **Prohibitions:** No hiding required content, no nesting, no non-button trigger, no open state carried by the indicator alone, no hardcoded motion.

### Naming note
The kit gives the optional panel control the name of its instance-swap slot. This contract names it for what it is, because `drift-check` treats a capitalised word that matches a component export as a dependency the contract must declare, and that word is also the name of a utility export.

### Where this came from
Adopted under rule 6's demand test: the home page's FAQ used Carbon's Accordion, and it is the one new contract `docs/SHADCN-MIGRATION.md` budgets for. The shape is the kit's Site design (Graphite UI Site 11814:17, "Component page — Accordion"), which draws Size (Small, Medium, Large), Alignment (Right, Left), Flush and Expanded across 5 sets and 120 variants. The kit now has that set, `Accordion item` (`2154:8478`, 120 variants), so rule 8 question 1 applies and the kit wins (#222): title and copy are Body/3 on-surface, the indicator is the kit's `fi-rs-angle-small-down` on-surface, hover is elevation-02, the item is transparent, flush keeps each item's top rule and drops only the inset, and a disabled item dims its copy. One kit slip is recorded rather than copied: the kit leaves the disabled chevron at full strength, and the code dims it with the title.
