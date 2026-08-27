# Tile

Container component for grouped content, in six interaction modes ranging from static to selectable/expandable.

**Figma:** [Tile](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=20125-279432)
**Figma node ID:** `20125:279432` — page "02 Components – Tile"

## Variant properties

| Property | Options |
|---|---|
| Type | Base, Clickable, Single-select, Multi-select, Expandable, Expandable (Interactive) |
| State | Enabled, Hover, Focus, Disabled, Enabled (expanded), Hover (expanded), Focus (expanded) |
| v12 feature flags | True, False |
| Selected | False, True |

Feature flags (v12): `enable-experimental-tile-contrast`, `enable-v12-tile-default-icons`, `enable-v12-tile-radio-icons` — opt-in behavior/styling changes. Check which are active in this file before assuming default v12 look.

## Other properties

| Property | Type | Notes |
|---|---|---|
| Title / Title text | Boolean + Text | |
| Description / Description text | Boolean + Text | |
| Slot / Swap slot | Boolean + Instance swap | custom content area — hide the Slot layer if unused, hide text layers if not needed |

## When to use

- **Base** — static content grouping, no interaction.
- **Clickable** — whole tile acts as a single action/link.
- **Single-select / Multi-select** — tile acts like a radio button / checkbox (selection state via `Selected`).
- **Expandable** / **Expandable (Interactive)** — reveals more content in place; Interactive variant also supports click actions while expanded.

## Do / Don't

- Do use the `Slot` mechanism for custom content rather than nesting arbitrary layers into the tile.
- Don't mix Single-select and Multi-select tiles within the same group — pick one selection model per group.

---
*Generated from Figma component set `20125:279432` — regenerate if variant properties change.*
