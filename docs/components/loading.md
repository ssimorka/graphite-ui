# Loading

Two forms: `Loading` (spinner) and `Inline loading` (status text + icon sequence: active → success/error/finished).

**Figma node IDs (page "02 Components – Loading"):**

| Component | Node ID |
|---|---|
| Loading | `78017:897920` |
| Inline loading | `3238:28455` |

**Figma:** [Loading](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=78017-897920)
**Internal building blocks (do not use directly):** `_Loading base`, `_Loading animation`

## Variant properties — Loading

| Property | Options |
|---|---|
| Spinner | Large, Small |

## Variant properties — Inline loading

| Property | Options |
|---|---|
| Size | Inline (only option) |
| State | Active, Error, Finished, Inactive |

Per the component's note: states other than `Active` only apply to the Inline size variant.

## When to use

- **Loading** (spinner) — full-area or component-area loading state (page load, panel refresh).
- **Inline loading** — inline with a label, for action feedback (e.g. "Saving..." → "Saved" or "Error").

## Do / Don't

- Do transition Inline loading through its states (Active → Finished/Error) rather than swapping in a separate success/error message component.
- Don't use the large Loading spinner for small inline actions — use Inline loading or the Skeleton state on the relevant component instead.

---
*Generated from Figma component sets `78017:897920` / `3238:28455` — regenerate if variant properties change.*
