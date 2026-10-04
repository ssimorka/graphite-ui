---
component: Menu buttons
version: 1.0.0
wave: 4
slots:
  - name: Trigger
    required: true
    notes: The governed Button. The Menu button form is a primary Button whose label names the menu, with a trailing chevron; the combo form is the primary action and, 1 apart, a primary icon-only Button with the chevron that opens related actions; the overflow form is a ghost icon-only Button with the menu dots. Icon-only triggers are named ("More actions", "Options").
  - name: Menu
    required: true
    notes: The governed Menu, flush on its trigger. Its rows take the trigger's size.
props:
  - name: items
    notes: Menu's items.
  - name: size
    values: [sm, md, lg]
    notes: The kit's Size. The trigger at 32, 40 or 48 (the kit draws the labelled Large Button at 50, Button's +2), and the menu's rows with it. Large by default, as the kit's sets are.
  - name: placement
    values: [bottom, top]
    notes: The kit's Position.
  - name: label
    notes: The Menu button's text; the combo form's primary action; the overflow form's accessible name ("Options" by default).
  - name: align
    values: [start, end]
    notes: The overflow form's Alignment, which edge of the trigger the menu lines up with. The combo form's menu lines up with the pair's start; the Menu button's with its start.
  - name: onClick / menuLabel
    notes: The combo form's primary action, and the name of its menu button ("More actions" by default).
  - name: disabled
    values: boolean
tokens:
  - name: motion
    usage: The chevron turning over while the menu is open.
composition_rules:
  - The triggers are the governed Button and the menus the governed Menu. These forms fix the trigger and pass the rest to Menu; they restyle neither. Menu keeps its trigger render prop for anything else.
  - The trigger carries aria-haspopup and aria-expanded from Menu, and opens with Enter, Space or Arrow Down.
  - The combo form's pair is joined 1 apart, as the kit draws it, not with Button group's gap.
prohibitions:
  - No icon-only trigger without a name.
  - No menu button for a single action. That is a Button.
---

### Menu buttons
- **Slots:** Trigger (required), menu (required).
- **Props:** items, size (sm, md, lg), placement (bottom, top), label, align (start, end), onClick / menuLabel, disabled.
- **Tokens:** `motion` for the chevron; the Button's and Menu's own.
- **Composition rules:** Button and Menu, flush; Menu's trigger contract; the combo pair 1 apart.
- **Prohibitions:** No unnamed icon trigger; no menu of one.
- **Kit parity** (#286, 1.0.0): the three public sets on the Menu buttons page, Menu button (`31420:317548`), Combo button (`31753:68447`) and Overflow (`3717:45725`), on every axis. Recorded rather than copied: all three draw Button's default fi-rs-plus-small as their glyph, never swapped; the code draws the chevron (angle-small-down) the Menu and Combo buttons mean, and the menu dots for Overflow. Overflow's Hover, Focus and Active are Button's own pseudo-classes. The kit draws no open glyph; the chevron turns over while open, as Carbon's does (rule 7's tie-break).
