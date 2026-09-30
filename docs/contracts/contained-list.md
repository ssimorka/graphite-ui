---
component: Contained list
version: 1.3.0
wave: 4
slots:
  - name: Leading
    required: false
    notes: An icon, tag or other short marker.
  - name: Title
    required: true
    notes: Typography.
  - name: Description
    required: false
  - name: Trailing
    required: false
    notes: Tag, Button, or a control.
props:
  - name: density
    values: [compact, default]
  - name: interactive
    type: boolean
    default: "false"
    notes: Visual only. Adds the pointer cursor and the surface-variant hover tone-step. The row takes no role, no tab stop and no click handler, so the caller supplies the interactive element.
tokens:
  - name: density
    usage: Row density steps. Resolves to `--graphite-density-*`.
  - name: on-surface
    usage: Title.
  - name: surface
    usage: Resting background.
  - name: surface-variant
    usage: Hover state — the tone-step shift of surface, not a separate color.
  - name: on-surface-variant
    usage: Description text, at the lower tone-step beneath the title.
  - name: spacing
    usage: Gaps between leading, text, and trailing slots.
composition_rules:
  - This is the row primitive Data table and any future list views should compose from, not reimplement.
  - "`interactive` is a visual signal, not behavior. A row that responds to a click gets that from an element the caller supplies: wrap the row in a link when the whole row goes somewhere, or put the Button in the trailing slot when the row has one action. Setting `interactive` without one of those promises a click that nothing answers."
prohibitions:
  - No more than one trailing control cluster — if multiple actions are needed, use Menu (Wave 5) as the trailing slot instead of stacking buttons.
---

### Contained list
- **Slots:** Leading (optional — an icon, tag or other short marker), title (required, Typography), description (optional), trailing (optional — Tag, Button, or a control).
- **Props:** density (compact, default); `interactive` (boolean, default false), which adds the hover tone-step and pointer and nothing else.
- **Tokens:** `on-surface` for title, `surface` at rest with `surface-variant` as the tone-step hover shift if the item is interactive, `on-surface-variant` for the description; the density steps for row padding and the spacing scale for slot gaps.
- **Composition rules:** This is the row primitive Data table and any future list views should compose from, not reimplement. `interactive` is visual only: the row has no role, focus or click handler of its own, so the link or button that answers the click is the caller's.
- **Prohibitions:** No more than one trailing control cluster — if multiple actions are needed, use Menu (Wave 5) as the trailing slot instead of stacking buttons.
