# Progress indicator

Step-by-step flow indicator (e.g. a multi-step form or wizard), horizontal or vertical.

**Figma:** [Progress indicator](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3925-58667)
**Figma node ID:** `3925:58667` — page "02 Components – Progress indicator"
**Internal building blocks (do not use directly):** `_Progress indicator item`, `_Progress indicator step label base`, `_Progress indicator skeleton item`

## Variant properties — Progress indicator (wrapper)

| Property | Options |
|---|---|
| Direction | Horizontal, Vertical |

## Step item properties (`_Progress indicator item`)

| Property | Options |
|---|---|
| State | Incomplete, Current, Completed, Error, Disabled, Skeleton |

Also carries `Optional label` boolean and `Label text` for a caption under/beside each step.

## When to use

- **Horizontal** — for wider layouts (desktop wizards, checkout flows).
- **Vertical** — for narrower layouts or sidebars.
- Pair with a Modal (`Progress = True`) for multi-step modal flows — see Modal component doc.

## Do / Don't

- Do mark exactly one step `Current` at a time, with prior steps `Completed` and later ones `Incomplete`.
- Don't use Progress indicator for a task with unknown or variable step count — its structure assumes a fixed, known sequence.

---
*Generated from Figma component set `3925:58667` — regenerate if variant properties change.*
