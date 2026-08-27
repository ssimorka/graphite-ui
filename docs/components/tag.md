# Tag

Labels, categorizes, or organizes items using keywords. Three forms: Read-only (display only), Selectable (toggleable, like a filter chip), and Operational (triggers an action).

**Figma node IDs (page "02 Components – Tag"):**

| Component | Node ID |
|---|---|
| Tag - Read-only | `16031:269750` |
| Tag - Selectable | `46254:7550` |
| Tag - Operational | `46254:10165` |

**Figma:** [Tag - Read-only](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=16031-269750)
**Internal building block (do not use directly):** `_Tag close button`

## Variant properties — Read-only

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| Color | Blue, Cyan, Teal, Green, Purple, Red, Gray, Cool gray, Warm gray, High contrast, Outline |
| State | Enabled, Disabled, Skeleton |

Also carries a `Dismissible` boolean for an inline close/remove action.

## Variant properties — Selectable

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Selected, Disabled, Skeleton |
| Selected | False, True |

Selectable tags don't carry a `Color` property — their color comes from selection state, not a manual choice.

## Variant properties — Operational

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| Color | Blue, Cyan, Teal, Green, Purple, Red, Gray |
| State | Enabled, Hover, Focus, Disabled, Skeleton |

## When to use

- **Read-only** — static categorization labels (status, category).
- **Selectable** — filter chips the user toggles on/off.
- **Operational** — a tag that itself is a trigger (e.g. opens a menu or performs an action on click).

## Do / Don't

- Do reserve `High contrast` / `Outline` colors (Read-only only) for cases needing extra visual weight against busy backgrounds.
- Don't use a Read-only tag with `Dismissible = True` as a substitute for Selectable — dismiss removes the tag entirely, it doesn't represent a toggle state.

---
*Generated from Figma component sets `16031:269750` / `46254:7550` / `46254:10165` — regenerate if variant properties change.*
