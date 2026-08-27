# UI shell

App-level navigation shell shared across products: Header (top nav bar), Left panel (sidebar navigation), and Right panel (contextual detail panel). Part of the Carbon "UI shell" — a common set of persistent interaction patterns.

**Figma node IDs:**

| Component | Page | Node ID |
|---|---|---|
| UI shell - Header | "02 Components – UI shell - Header" | `92123:1663` |
| UI shell - Header menu | same page | `2213:15047` |
| UI shell - Header menu item | same page | `2133:9531` |
| UI shell - Header sub-menu item | same page | `2133:9888` |
| UI shell - Header actions | same page | `2133:10716` |
| UI shell - Left panel | "02 Components – UI shell - Left panel" | `6227:297201` |
| UI shell - Left panel menu item | same page | `2346:16194` |
| UI shell - Right panel item | "02 Components – UI shell - Right panel" | `2282:13907` |

**Figma:** [UI shell - Header](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=92123-1663)

## Variant properties — Header

| Property | Type | Notes |
|---|---|---|
| Site prefix / Site prefix text | Boolean + Text | e.g. "Simorka Designs" prefix before the site name |
| Site name | Text | product name |
| Navigation / Actions / Menu | Boolean | shows/hides each header section |
| Open | Variant (False, True) | mobile/collapsed menu state |

## Header sub-components

| Component | Key properties |
|---|---|
| Header menu | State (Enabled, Hover, Active, Focus, Disabled), Open |
| Header menu item | Type (Link, Sub-menu), State, Selected, Open |
| Header sub-menu item | State (Enabled, Hover, Focus, Active, Selected, Disabled) |
| Header actions | State, Open, optional Badge notification |

## Variant properties — Left panel

| Property | Options |
|---|---|
| Compact | False, True |

## Left panel menu item

| Property | Options |
|---|---|
| Type | Link, Sub-menu, Compact, Divider |
| Level | Level 1, Level 2 |
| State | Enabled, Hover, Focus, Active, Selected, Softly selected, Disabled |
| Selected / Expanded / Compact / Divider | Boolean flags |

## Right panel item

| Property | Options |
|---|---|
| Type | Link, Divider |
| State | Enabled, Hover, Focus, Active, Selected, Disabled |
| Selected / Divider | Boolean flags |

## When to use

- **Header** — persistent top bar: product name, primary nav, and global actions (search, notifications, account).
- **Left panel** — primary in-app navigation; use `Compact` for a collapsed/icon-only rail.
- **Right panel** — contextual detail or settings panel that doesn't replace the main view.
- `Softly selected` (Left panel) — for indicating a section is active without full Selected emphasis, e.g. a parent of the current page.

## Do / Don't

- Do keep Header, Left panel, and Right panel visually and behaviorally consistent across products — that consistency is the entire point of "UI shell."
- Don't customize UI shell components per-product beyond the `Site name`/`Site prefix text` content — it undermines the shared pattern.

---
*Generated from Figma component sets under nodes `92123:*`, `2213:*`, `2133:*`, `6227:*`, `2346:*`, `2282:*` — regenerate if variant properties change.*
