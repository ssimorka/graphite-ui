# Menu

Contextual list of actions or options, triggered from a button, icon, or right-click. Overflow menu is consolidated into this component (and Menu button).

**Figma:** [Menu](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=31131-96397)
**Figma node ID:** `31131:96397` — page "02 Components – Menu"
**Internal building blocks (do not use directly):** `_Keyboard shortcut`, `_Menu list item`
**Reference:** [Carbon Menu docs](https://react.carbondesignsystem.com/?path=/docs/components-menu--overview)

## Variant properties

| Property | Options |
|---|---|
| Function | Simple, Complex |
| Size | Large, Medium, Small, Extra small |

Also carries a `Delete` boolean, used when the menu includes a destructive/delete action styled distinctly from the rest of the list.

## Menu item properties (`_Menu list item`)

| Property | Options |
|---|---|
| Size | Large, Medium, Small, Extra small |
| State | Enabled, Hover, Focus, Focus + Hover, Danger hover, Danger hover + Focus, Disabled |

Items also support `Indented` (for sub-groups), `Divider`, and a `Shortcuts or Trigger` slot for keyboard shortcut hints or a sub-menu caret.

## When to use

- **Simple** — flat list of actions.
- **Complex** — supports nested groups, dividers, and keyboard shortcut hints.
- Match `Size` to the size of the triggering button — see Menu button.

## Do / Don't

- Do use the `Danger hover` state for destructive items (e.g. Delete) so they get distinct hover styling from regular actions.
- Don't mix menu sizes within one trigger's open/closed states.

---
*Generated from Figma component sets `31131:96397` / `36234:38344` — regenerate if variant properties change.*
