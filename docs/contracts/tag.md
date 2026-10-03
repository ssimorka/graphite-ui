---
component: Tag
version: 3.0.0
wave: 1
slots:
  - name: Label
    required: true
    notes: Short text, or a number capped at `max`.
  - name: Icon
    required: false
    notes: The kit's leading Icon, a 16px glyph before the label. Decorative.
props:
  - name: variant
    values: [neutral, primary, secondary, info, success, danger, warning, high-contrast, outline]
    notes: The kit's Tag - Read-only colours by role (Gray, Purple, Teal, Blue, Green, Red, High contrast, Outline), plus warning, which the kit does not draw. The operational form takes the first six.
  - name: size
    values: [sm, md, lg]
    notes: 18, 24 and 32px, the kit's Small, Medium and Large. The label is 12/16 Regular at every size, inset 8 (12 at Large).
  - name: disabled
    values: boolean
  - name: icon
    type: ReactNode
  - name: max
    type: number
    default: "99"
    notes: The cap for a numeric label. A number above it shows as the cap with a plus (99+), and the full number stays in the accessibility tree as visually hidden text.
  - name: onDismiss
    notes: The kit's Dismissible. A trailing close button, named "Remove <label>", that calls it.
  - name: selected / onSelectedChange
    notes: The selectable form only, the kit's Tag - Selectable. A toggle button with aria-pressed.
  - name: onClick
    notes: The operational form only, the kit's Tag - Operational. A tag that opens or does something.
tokens:
  - name: surface-variant
    usage: Fill on the neutral tag and on an unselected or disabled selectable tag.
  - name: on-surface-variant
    usage: Label on the neutral tag and an unselected selectable tag.
  - name: primary-container
    usage: Fill on the primary tag and a selected selectable tag.
  - name: on-primary-container
    usage: Their label.
  - name: secondary-container
    usage: Fill on the secondary (Teal) tag.
  - name: on-secondary-container
    usage: Its label.
  - name: info-container
    usage: Fill on the info (Blue) tag.
  - name: on-info-container
    usage: Its label.
  - name: success-container
    usage: Fill on the success variant.
  - name: on-success-container
    usage: Its label.
  - name: danger-container
    usage: Fill on the danger variant.
  - name: on-danger-container
    usage: Its label.
  - name: warning-container
    usage: Fill on the warning variant.
  - name: on-warning-container
    usage: Its label.
  - name: on-background
    usage: Fill on the high-contrast tag, the inverse pair.
  - name: background
    usage: Label on the high-contrast tag.
  - name: surface
    usage: Fill on the outline tag, and a disabled close button.
  - name: on-surface
    usage: Label on the outline tag.
  - name: outline
    usage: The 1px edge on the outline tag, an unselected selectable tag and a neutral operational tag.
  - name: primary
    usage: The primary operational tag's edge and hover fill, the Tag focus ring (the kit binds primary here rather than the focus step), and the disabled fill, edge and label through its disabled steps.
  - name: on-primary
    usage: The label on a hovered primary or danger operational tag.
  - name: secondary
    usage: The secondary operational tag's edge.
  - name: info
    usage: The info operational tag's edge.
  - name: success
    usage: The success operational tag's edge.
  - name: danger
    usage: The danger operational tag's edge and hover fill.
  - name: spacing
    usage: The label inset, the icon inset and the close button's padding.
  - name: radius
    usage: Pill shape, via `full`.
  - name: text
    usage: The label, Caption/1 12/16 Regular at every size.
composition_rules:
  - Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container.
prohibitions:
  - The warning variant has no counterpart in the kit. Tag - Read-only ships Blue, Teal, Green, Purple, Red, Gray, High contrast and Outline, and no orange among them. It is kept rather than dropped, because removing a variant is breaking, but it is the one colour here the kit does not vouch for.
  - No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex.
---

### Tag
- **Slots:** Label (required, short text or number); an optional leading Icon.
- **One contract, three forms, one pill.** The kit's Tag page holds three public sets, and this contract governs all three as forms of Tag, exported together from `tag.tsx` the way Accordion's parts are: the read-only tag, the kit's Tag - Read-only; the selectable form, Tag - Selectable; and the operational form, Tag - Operational (#224). They share the pill, the 12/16 Regular label and the three sizes (18 / 24 / 32).
- **Props:** `variant` (neutral, primary, secondary, info, success, danger, warning, high-contrast, outline); `size` (sm, md, lg); `disabled`; `icon`; `max` (default 99); `onDismiss` for the kit's close button. The selectable form takes `selected` / `onSelectedChange`; the operational form takes `onClick` and the first six colours.
- **Tokens:** every Read-only colour is a container role with its on-container label; high-contrast is the inverse pair (`on-background` / `background`) and outline is `surface` with a 1px `outline` edge. The operational form adds a 1px edge in the colour at full strength; the selectable form is `surface-variant` with an `outline` edge, `primary-container` when selected. Disabled is the disabled fill and edge with the disabled label, for every colour.
- **Kit facts followed as drawn:** the Tag focus ring is `primary`, not the focus step; the operational form fills on hover only for primary and danger, the other four being drawn identical to rest; a single-digit count stays round. **Slips recorded, not copied:** the kit binds the hovered primary operational tag's label to the disabled tone (the code uses on-primary, as Button does), sits its label 1px above centre (centred here), and leaves an AI label switched on in one High contrast variant.
- **Composition rules:** Numeric badges cap display at a defined max (e.g. "99+") rather than overflowing their container. The visible "99+" is hidden from assistive tech and the full number is read instead, as text.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex.
