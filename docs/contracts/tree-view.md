---
component: Tree view
version: 1.0.0
wave: 4
slots:
  - name: Nodes
    required: true
    notes: The tree's content, as data rather than children. A node with children is the kit's Branch node, which opens and closes; one without is a Leaf. A node with an href is a link, so the tree can be a site's navigation.
  - name: Node text
    required: true
    notes: The kit's Node text, Body/3, one line, ending in an ellipsis when it runs out of room.
  - name: Icon
    required: false
    notes: The kit's Icon axis. A Branch draws the folder, a Leaf the document, 8 after the caret; on by default, as the kit's Tree view is.
props:
  - name: label
    notes: Required. The tree's accessible name; a tree with no name is a list of words.
  - name: nodes
    notes: "{ id, label, href?, disabled?, children? }[], any depth. The kit draws four levels; deeper levels keep the same step."
  - name: size
    values: [sm, xs]
    notes: The kit's Size, Small (32) and Extra small (24). Small by default.
  - name: icons
    type: boolean
    default: "true"
    notes: The kit's Icon axis on Tree view and on every node. Also sets the indent step, 24 with icons and 16 without, as the kit's spacers do.
  - name: selected
    notes: The id of the selected node, the kit's Selected. A site's navigation passes the current page. Its ancestors open.
  - name: onSelect
    notes: Called with a node's id when it is activated. A link node also navigates, natively.
  - name: defaultExpanded
    notes: Branch ids open at first. The reader opens and closes them from there.
tokens:
  - name: elevation
    usage: The row at rest (elevation-01, the kit's layer-01), hover (elevation-02, layer-hover-01) and active (elevation-03, layer-active-01).
  - name: primary
    usage: The selected row's 4px inset bar at the left edge (the kit's interactive); the focus ring, 2px inside the row, through the family's focus step; and disabled text and icons, through its disabled-content step.
  - name: primary-container
    usage: The selected row (the kit's layer-selected-01).
  - name: on-surface-variant
    usage: Text, caret and icons at rest (the kit's text-secondary and icon-secondary).
  - name: on-surface
    usage: Text, caret and icons on hover, active and selected (the kit's text-primary and icon-primary).
  - name: text
    usage: Node text at Body/3 at both sizes.
  - name: spacing
    usage: Row heights, the 16 right padding, the indent steps and the 8 gaps.
composition_rules:
  - The ARIA navigation tree. One tab stop, the selected node or else the first; the arrow keys move between visible nodes, Right opens a branch or steps into it, Left closes it or steps out to the parent, Home and End go to the ends, Enter and Space activate, and a typed letter jumps to the next node that starts with it.
  - A node is a link only through its href. The tree does not route; a node without one reports its id through onSelect and the caller decides.
  - Navigation Menu stays the horizontal, flat case (a site header's links). Tree view is the hierarchical one, which is what a docs sidebar is.
prohibitions:
  - No second tab stop inside the tree. Focus moves by arrow keys, never by Tab, so a long tree costs one keystroke to pass.
  - No hierarchy shown by indent alone. Every branch carries aria-expanded and its group, and every node its aria-level, so the shape is announced as well as drawn.
---

### Tree view
- **Slots:** Nodes (required, data), each with node text (required) and an optional icon.
- **Props:** label (required), nodes, size (sm, xs), icons, selected, onSelect, defaultExpanded.
- **Tokens:** `elevation-01` at rest, `elevation-02` on hover and `elevation-03` while pressed; `primary-container` with a 4px `primary` bar for the selected row; `on-surface-variant` for text and glyphs at rest and `on-surface` on hover, press and selection; `primary`'s focus step for the ring and its disabled-content step for a disabled node.
- **Kit parity** (1.0.0, #240's definition of done applied to a set rule 6 used to hold back): Tree view (`11948:286738`) and Branch node item (`11828:285325`), with the private Branch and Leaf spacers, on every axis the kit draws: Node, Size, State, Selected, Open and Icon. Recorded rather than copied: Selected + Hover fills `state/primary-container-hover`, a step the engine does not generate, so a selected row ignores hover, as Data table's selected rows do. The kit's Show Badge indicator property is defined on the set and drives no layer in any variant, so there is nothing to build. Hover, Focus and Active are pseudo-classes (rule 7). The kit draws four levels; the code takes any depth at the same step. The caret is the kit's caret-right, turning to caret-down when open; Bold and Solid carry no caret, folder or document, so they borrow Regular's.
- **Composition rules:** The ARIA navigation tree, with one tab stop and the arrow keys inside. A link only through href. Navigation Menu keeps the flat, horizontal case.
- **Prohibitions:** No second tab stop inside the tree. No hierarchy shown by indent alone.
