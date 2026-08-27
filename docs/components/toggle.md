# Toggle

Binary on/off control. Use only for actions that take effect immediately when flipped — not for choices that need a form submit.

**Figma:** [Toggle component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3038-25739)
**Figma node ID:** `3038:25739` (component set, page "02 Components – Toggle")
**Internal building blocks (do not use directly):** `_Toggle switch - Small` (`3393:33067`), `_Toggle item` (`11412:330975`)

## Variant properties

| Property | Options |
|---|---|
| Size | Default, Small |
| State | Enabled, Focus, Disabled, Skeleton, Read-only |
| Toggle only | False, True |
| Toggled | False, True |

## Other properties

| Property | Type | Default |
|---|---|---|
| Label text / Show label | Text + Boolean | "Label" / true |
| State text / Show value | Text + Boolean | "Current state" / true |

## When to use

- `Toggle only = True` for compact contexts (table rows, dense settings lists) where the label lives elsewhere.
- Use the default (with label + state text) for standalone settings screens.

## Do / Don't

- Do use Toggle for immediate, self-contained state changes ("Enable notifications").
- Don't use Toggle inside a form that requires a submit step — use Checkbox instead.

---
*Generated from Figma component set `3038:25739` — regenerate if variant properties change.*
