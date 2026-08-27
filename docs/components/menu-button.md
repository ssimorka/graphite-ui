# Menu button

Three related trigger components that open a Menu: `Menu button` (single trigger), `Combo button` (primary action + attached menu trigger), and `Overflow` (icon-only "more actions" trigger).

**Figma node IDs (page "02 Components – Menu buttons"):**

| Component | Node ID |
|---|---|
| Menu button | `31420:317548` |
| Combo button | `31753:68447` |
| Overflow | `3717:45725` |

**Figma:** [Menu button](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=31420-317548)
**Reference:** [Carbon Menu button](https://react.carbondesignsystem.com/?path=/docs/components-menubutton--overview) · [Combo button](https://react.carbaondesignsystem.com/?path=/docs/components-combobutton--overview) · [Overflow menu](https://react.carbondesignsystem.com/?path=/docs/components-overflowmenu--overview)

## Variant properties — Menu button / Combo button

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| Position | Bottom, Top |
| Open | False, True |

## Variant properties — Overflow

| Property | Options |
|---|---|
| Size | Large, Medium, Small |
| Position | Bottom, Top |
| Alignment | Start, End |
| State | Enabled, Hover, Focus, Active, Disabled |
| Open | False, True |

## When to use

- **Menu button** — a single button whose only job is opening a menu.
- **Combo button** — a primary action button with a secondary menu attached, for "default action + more options" patterns.
- **Overflow** — icon-only trigger (kebab/ellipsis) for a list of secondary actions, typically in table rows or cards.
- Match `Size` to whatever Menu size the trigger opens.

## Do / Don't

- Do set `Position` to `Top` when the trigger is near the bottom of the viewport and the menu would otherwise get clipped.
- Don't use Overflow as a substitute for a Combo button when there's one clear primary action — Combo button surfaces that primary action directly.

---
*Generated from Figma component sets `31420:317548` / `31753:68447` / `3717:45725` — regenerate if variant properties change.*
