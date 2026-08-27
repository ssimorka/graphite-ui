# Tabs

Lets users navigate between views within the same context. Horizontal Tabs is the primary component; Vertical tabs is a related but separate component on the same page.

**Figma:** [Tabs](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3890-50605)
**Figma node ID:** `3890:50605` — page "02 Components – Tabs"
**Internal building blocks (do not use directly):** `_Tabs button item`, `_Horizontal tabs items`, `_Vertical tabs items`

## Variant properties — Tabs

| Property | Options |
|---|---|
| Style | Contained, Line |
| Type | Text + Icon, Icon only |
| Alignment | Auto-width, Grid aware |

Also carries `Previous` / `Next` boolean flags for the scroll-arrow controls when tabs overflow the container.

## Individual tab item properties (`_Horizontal tabs items`)

| Property | Options |
|---|---|
| Style | Contained, Line |
| Type | Icon only, Text + Icon |
| Size | Large, Medium |
| Alignment | Auto-width, Grid aware |
| State | Enabled, Hover, Focus, Selected, Disabled, Skeleton |

Only the "Inline – icon only" tab variant offers two sizes (Medium and Large); other type/style combinations come in one default size only.

## When to use

- **Line** style — lower-emphasis navigation, common for in-page sections.
- **Contained** style — higher-emphasis, filled tab backgrounds.
- To make tab items stretch to fill the container: set the parent to fill container, select the `_Tabs base` component, and set its width resizing to fill container.

## Do / Don't

- Do keep tab count reasonable — the `Previous`/`Next` overflow controls exist because scrolling too many tabs isn't a great pattern, not an excuse to add unlimited tabs.
- Don't mix Icon only and Text + Icon tabs within the same tab group.

---
*Generated from Figma component sets `3890:50605` / `5662:278514` / `103086:4853` / `75769:1965` — regenerate if variant properties change.*
