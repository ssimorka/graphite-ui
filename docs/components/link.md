# Link

Text link for inline or standalone navigation actions. Inline links carry an underline and never pair with an icon — use them inside body copy. Standalone links have no underline and can optionally pair with an icon.

**Figma:** [Link component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=50111-991)
**Figma node ID:** `50111:991` (component set, page "02 Components – Link")

## Variant properties

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| State | Enabled, Hover, Focus, Active, Visited, Disabled |
| Inverse | False, True |

## Other properties

| Property | Type | Default |
|---|---|---|
| Icon | Boolean | true |
| Swap icon | Instance swap | — |
| Link text | Text | "Link" |
| Inline | Boolean | false |

## When to use

- **Inline** (`Inline = True`) — for links embedded in a sentence or paragraph. No icon.
- **Standalone** — for links that act on their own, e.g. "View all," "Learn more." Can carry a leading or trailing icon.
- **Inverse** — for links on dark or colored backgrounds.

## Do / Don't

- Do use `Visited` state where link history is meaningful (e.g. content archives).
- Don't pair an icon with an Inline link — the variant doesn't support it.
- Don't use Link for a primary action — use Button instead.

---
*Generated from Figma component set `50111:991` — regenerate if variant properties change.*
