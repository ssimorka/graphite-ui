# Notification

Communicates status or feedback in three forms: Inline (embedded in page content), Toast (temporary, auto-dismissing), and Callout (persistent, page-level banner).

**Figma node IDs (page "02 Components – Notification"):**

| Component | Node ID |
|---|---|
| Notification - Inline | `4179:105911` |
| Notification - Toast | `84336:35011` |
| Notification - Callout | `84336:36580` |

**Figma:** [Notification - Inline](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=4179-105911)
**Internal building block (do not use directly):** `Notification action button item`

## Variant properties — Inline

| Property | Options |
|---|---|
| Status | Info, Success, Warning, Error |
| High contrast | False, True |
| Long message | False, True |
| Actionable | False, True |

## Variant properties — Toast

| Property | Options |
|---|---|
| Status | Info, Success, Warning, Error |
| High contrast | False, True |
| Actionable | False, True |

Includes a `Time text` property (timestamp) not present on Inline.

## Variant properties — Callout

| Property | Options |
|---|---|
| Status | Info, Warning |
| High contrast | False, True |
| Long message | False, True |

Callout supports only Info/Warning status — not Success/Error — reflecting its use for ongoing/informational states rather than transactional feedback.

## When to use

- **Inline** — feedback tied to a specific piece of content (e.g. above a form section).
- **Toast** — transient, auto-dismissing feedback after an action (e.g. "Changes saved").
- **Callout** — persistent, page-level messaging that stays until dismissed or resolved (e.g. "Your trial ends in 3 days").

## Do / Don't

- Do use `Actionable = True` only when there's a real follow-up action — don't add a button just to fill space.
- Don't use Toast for messages the user must act on — toasts disappear; use Callout or Modal for anything requiring a response.

---
*Generated from Figma component sets `4179:105911` / `84336:35011` / `84336:36580` — regenerate if variant properties change.*
