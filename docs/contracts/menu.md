---
component: Menu
version: 2.1.0
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
    notes: Not implemented. An item cannot open a nested menu; the items type has no field for one. Recorded here so the slot does not read as shipped.
props:
  - name: placement
    values: [bottom, top]
    notes: Behaviour the kit does not draw; the code keeps it (rule 7's tie-break).
  - name: align
    values: [start, end]
    notes: Which edge of the trigger the menu lines up with. Start by default; end is the kit's Overflow Alignment=End (#286).
  - name: flush
    values: boolean
    notes: Sits the menu on its trigger with no gap, as the kit's Menu buttons draw it. Otherwise it stands 4 off.
  - name: size
    values: [lg, md, sm, xs]
    notes: The kit's Size, rows of 50, 42, 34 and 26 (Carbon's padding around Body/3, two over Carbon's rows, recorded as drawn). Medium by default, as the other form controls are.
  - name: items
    notes: Each item takes label, onSelect, disabled, destructive, and the kit's Complex parts, shortcut (the trailing Shortcut combo) and selected (the leading check, which makes the item a menuitemcheckbox and indents every row so the labels align). Simple and Complex are what the items hold, not a switch.
tokens:
  - inherited_from: Popover
    usage: The `elevation-01` surface and the `shadow-overlay` lift, with no edge (Popover 2.0.0).
  - name: elevation
    usage: Item hover, elevation-02, the kit's layer-hover-01, one rung up the ladder from the panel's elevation-01. The same tone-step move as Button's hover.
  - name: outline
    usage: The separator, through its subtle step (outline-subtle, the kit's border-subtle-00). No longer the panel's edge, which went with Popover's in 2.0.0.
  - name: on-surface-variant
    usage: Item labels and shortcuts at rest, the kit's text-secondary.
  - name: on-surface
    usage: Item labels on hover, the selected check, and the destructive row's delete icon.
  - name: primary
    usage: The focus ring, through the family's focus step, 2px inside the row; and disabled labels, through its disabled-content step.
  - name: danger
    usage: The destructive row's hover fill, the kit's Danger hover.
  - name: on-danger
    usage: The destructive row's label and icon on its danger fill. The kit binds text-on-color, which resolves to onPrimary; on a danger fill the right role is on-danger.
  - name: text
    usage: Labels and shortcuts at Body/3 at every size.
  - name: spacing
    usage: Row padding and gaps, the panel's 4 above and below, and the separator's 4 after it.
  - name: radius
    usage: Panel corner, and the corner on each item.
  - name: motion
    usage: The shared overlay entrance, inherited from Popover along with the surface. Declared here too so the drift check can hold this component to it rather than trusting the inheritance.
composition_rules:
  - The kit's Menu buttons (Menu button, Combo button, Overflow) are their own contract, menu-button.md (#286), which fixes the trigger and passes the rest here.
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Contained list hover uses the same tone-step logic as Button hover, not a separate highlight convention. Focus is a 2px ring inside the row, as the kit draws it, with no fill of its own.
  - A destructive item is neutral at rest and carries the kit's trailing delete icon, which is what sets it apart; on hover it fills with danger.
prohibitions:
  - No destructive action (delete, remove) styled identically to a neutral action — destructive items need the status-role treatment once Wave 0 ships; until then, they get explicit confirmation via Modal rather than a one-click destructive menu item.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Menu
- **Slots:** Trigger (required), menu items (required, minimum 1), optional separators and sub-menus. Sub-menus are not implemented yet.
- **Props:** placement, size (lg, md, sm, xs); items carry shortcut and selected for the kit's Complex rows.
- **Tokens:** Same as Popover, plus `on-surface-variant` for labels at rest, `elevation-02` for hover, `primary-focus` for the inset focus ring, `danger` and `on-danger` for the destructive hover, `outline-subtle` for separators, and the spacing scale for padding.
- **Composition rules:** Contained list hover uses the same tone-step logic as Button hover, not a separate highlight convention; focus is a ring inside the row.
- **Kit parity** (#231, 2.0.0, a major: focus is no longer a fill, and a destructive label is no longer red at rest). The kit's Caret trailing slot is a sub-menu trigger, still unbuilt (see Sub-menus).
- **Prohibitions:** No destructive action (delete, remove) styled identically to a neutral action — destructive items need the status-role treatment once Wave 0 ships; until then, they get explicit confirmation via Modal rather than a one-click destructive menu item.
