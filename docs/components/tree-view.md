# Tree view

Hierarchical list for nested navigation or selection — branch nodes expand/collapse, leaf nodes are terminal.

**Figma:** [Tree view](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=11948-286738)
**Figma node ID:** `11948:286738` (wrapper), `11828:285325` (Branch node item) — page "02 Components – Tree view"
**Internal building blocks (do not use directly):** `_Tree view spacer - Branch node`, `_Tree view spacer - Leaf node`

## Variant properties — Tree view (wrapper)

| Property | Options |
|---|---|
| Icon | True, False |

## Variant properties — Branch node item

| Property | Options |
|---|---|
| Node | Branch, Leaf |
| Size | Small, Extra small |
| State | Enabled, Hover, Focus, Active, Selected, Selected + Hover, Disabled |
| Selected | False, True |
| Open | False, True |

Indentation spacers support 4 levels (Level 1–4) with or without an icon.

## When to use

- Use for hierarchical structures deeper than a simple list — file trees, nested categories, org structures.
- Set `Node = Branch` for expandable parents, `Leaf` for terminal items.

## Do / Don't

- Do keep nesting to the 4 supported levels — deeper hierarchies should be restructured or paginated.
- Don't use Tree view for a flat list — use List or Structured list instead, they're lighter weight.

---
*Generated from Figma component sets `11948:286738` / `11828:285325` — regenerate if variant properties change.*
