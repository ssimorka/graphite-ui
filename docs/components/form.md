# Form

Layout wrapper for composing form fields — on a page, or inside a modal.

**Figma node IDs (page "02 Components – Form"):**

| Component | Node ID |
|---|---|
| Form on page | `3897:51336` |
| Form modal - Default | `4260:102550` |
| Form modal - Fluid | `16827:270697` |

**Figma:** [Form on page](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3897-51336)

## Variant properties — Form on page

| Property | Options |
|---|---|
| Columns | 1, 2 |

Width is manually adjusted per instance — this component doesn't lock to a fixed container size.

## Variant properties — Form modal - Default

| Property | Options |
|---|---|
| Type | Single button, Two buttons |

Per the component's Figma note: form fields inside a modal span 100% or 50% of the modal width, with 16px padding on the left and right.

## When to use

- **Form on page** — standalone forms (settings pages, account creation).
- **Form modal** — forms scoped to a task inside a Modal overlay; use `Single button` for a single confirm/save action, `Two buttons` when you need Cancel + Confirm.

## Do / Don't

- Do keep field widths consistent within a column — don't mix 100%-width and 50%-width fields in the same row without a clear reason.
- Don't use 2-column layouts for short forms (3 fields or fewer) — the visual benefit doesn't outweigh the added scanning complexity.

---
*Generated from Figma component sets `3897:51336` / `4260:102550` / `16827:270697` — regenerate if variant properties change.*
