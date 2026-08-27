# Code snippet

Displays code in three forms: Single line, Inline (within body text), and Multi-line (block, with optional line numbers and copy action).

**Figma node IDs (page "02 Components – Code snippet"):**

| Component | Node ID |
|---|---|
| Code snippet - Single line | `4266:103999` |
| Code snippet - Inline | `4266:104904` |
| Code snippet - Multi-line | `4257:168802` |

**Figma:** [Code snippet - Multi-line](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=4257-168802)
**Internal building blocks (do not use directly):** `_Code snippet tooltip`, `_Code snippet - Inline item`, `_Code snippet ghost button`

## Variant properties — Single line

| Property | Options |
|---|---|
| State | Enabled, Focus, Disabled |

Manually adjust the width of the snippet as needed — no fixed-width variant.

## Variant properties — Inline

| Property | Options |
|---|---|
| State | Enabled, Hover, Focus, Active, Active + Copied, Disabled |
| Tooltip | False, True |

To edit the snippet text, unlock the tooltip layer first.

## Variant properties — Multi-line

| Property | Options |
|---|---|
| State | Enabled, Disabled, Skeleton |
| Expanded | False, True |

Also carries `Copy` and `Numbers` booleans for the copy button and line-number gutter. Manually adjust width/height as needed.

## When to use

- **Inline** — a short code reference within a sentence.
- **Single line** — a standalone one-line command or value (e.g. a CLI command).
- **Multi-line** — a full code block, optionally with line numbers, collapsible via `Expanded`.

## Do / Don't

- Do show the copy action (`Copy = True`) on any snippet users are likely to paste elsewhere, like CLI commands.
- Don't use Code snippet for non-code content just to get monospace styling — it carries copy/expand affordances that don't make sense for prose.

---
*Generated from Figma component sets `4266:103999` / `4266:104904` / `4257:168802` — regenerate if variant properties change.*
