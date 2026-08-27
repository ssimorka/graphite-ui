# Modal

Overlay dialog for focused tasks or confirmations that interrupt the main flow.

**Figma:** [Modal](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=4080-55366)
**Figma node ID:** `4080:55366` — page "02 Components – Modal"
**Internal building block (do not use directly):** `_Modal footer item`

## Variant properties

| Property | Options |
|---|---|
| Size | Large, Extra small, Mobile, Small, Medium |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Label / Label text | Boolean + Text | optional eyebrow label above the title |
| Title text | Text | modal heading |
| Description / Description text | Boolean + Text | supporting copy |
| Close icon | Boolean | top-right dismiss control |
| Actions | Boolean | shows/hides the footer action row |
| Progress | Boolean | for multi-step modal flows |
| Slot / Swap slot | Boolean + Instance swap | custom content area |

## Footer actions (`_Modal footer item`)

| Property | Options |
|---|---|
| Actions | 1, 2, 3 |
| Cancel | False, True |
| Inline loading | False, True |

## When to use

- **Extra small / Small** — confirmations, simple single-field prompts.
- **Medium / Large** — forms or content-heavy tasks (pairs with `Form modal` — see Form component).
- **Mobile** — full-viewport treatment for small screens.
- Use `Progress = True` for multi-step modal flows and pair with a step indicator inside the slot.

## Do / Don't

- Do set `Inline loading = True` on the footer's primary action while an async submit is in flight, rather than disabling the button silently.
- Don't stack more than one Modal at a time — use a single Modal with internal steps (via `Progress`) instead.

---
*Generated from Figma component sets `4080:55366` / `3906:50587` — regenerate if variant properties change.*
