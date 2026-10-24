---
component: Button
version: 2.7.0
wave: 0
slots:
  - name: Children
    required: true
    notes: The label, and any icons, as children. Icons are children rather than named slots, so a caller composes them instead of choosing from a fixed pair.
props:
  - name: variant
    values: [primary, outlined, ghost, secondary, secondary-outlined, secondary-ghost, danger, danger-ghost]
    notes: Two colour families with the same three ranks, filled, outlined and text. Violet is primary, outlined, ghost; green is secondary, secondary-outlined, secondary-ghost. Danger and danger-ghost sit outside the families. Defaults to secondary. A primary default would make breaking the one-primary rule the path of least resistance.
  - name: size
    values: [sm, md, lg, xl, 2xl, expressive, icon-sm, icon, icon-lg, icon-xl, icon-expressive]
    notes: The kit's Size axis, plus Icon only at each size it draws one. Text sizes are 32/42/50/66/82 and Expressive 50 (16/24 type); icon-only squares are 32/40/48/64 and Expressive 44, on the grid where the text sizes sit 2px over it. Extra large and 2x large top-align the label and icon, 16px down.
  - name: asChild
    values: boolean
    notes: Render the button's props onto its single child instead of emitting a button element.
  - name: className
    notes: Merged after the variant recipe, so a caller can extend without forking.
  - name: type
    values: [button, submit, reset]
    notes: Defaults to button, and only when this component owns the element.
tokens:
  - name: primary
    usage: "Fill on the primary variant, and the label and 1px border on outlined. The label colour on ghost too: the kit binds Style=Ghost's text to `primary`, not to a neutral. Its hover step is the label on ghost and outlined on hover and press. Its focus step is the ring on every style except the danger ones, as the kit binds it. Its disabled step is the fill on every filled style and the label on the unfilled styles."
  - name: on-primary
    usage: Label on primary, secondary and danger, and on danger-ghost once hover or press fills it. One label colour across the filled styles, as the kit has it.
  - name: secondary
    usage: Fill on the secondary variant, which the kit renders filled. The label and 1px border on secondary-outlined, and the label on secondary-ghost. Its hover step is the label on those two on hover and press.
  - name: surface-variant
    usage: Hover and pressed background on ghost, outlined and their green counterparts.
  - name: outline
    usage: The subtle step is the disabled border on both outlined styles.
  - name: danger
    usage: Fill on the destructive variant, and the tone steps it takes on hover and press. The label on danger-ghost, which takes those same steps as its fill when touched. Its focus step is the ring on both danger styles.
  - name: background
    usage: The 1px line inside the focus ring on the filled styles, so the ring reads against its own fill.
  - name: spacing
    usage: Padding, gap to icons, and the minimum touch target.
  - name: motion
    usage: The hover and press color, at the fast step. The press itself is instant.
  - name: radius
    usage: Corner. The kit is square-cornered, so this resolves to `radius-none`.
motion:
  - trigger: Hover, press
    property: Background and label color
    duration: duration-fast
    easing: easing-out
    reduced: "Unchanged: color is feedback. The 1px press displacement is removed."
composition_rules:
  - "One filled button per group. A group of buttons (a Modal footer, a toolbar) holds at most one of primary, secondary and danger. ButtonGroup enforces this, and Modal wraps its footer in it."
  - "The filled button goes last: trailing in a row, at the bottom of a stack. Its partners come from its own family: primary pairs with outlined or ghost, secondary with secondary-outlined or secondary-ghost, danger with ghost. Outlined is for a real alternative (Cancel, Back, Not now), text for skipping a step or a tool (Skip, Learn more)."
  - Pick the primary by the view's job. The button that finishes it is primary; actions that explore or branch off are outlined or ghost.
  - Hover and pressed are tone-step moves on the same ramp as the resting fill, never a different color. This is the logic Text input's focus border, Toggle's on state, and Menu's item hover all refer back to.
  - Never smaller than the defined minimum touch target, whatever the size prop. Checkbox refers back to this.
  - Variants are declared once as a recipe and exported, so a sibling component can render something button-shaped without restating the rules or forking the styles.
prohibitions:
  - No two primary buttons in one group. The second one is not an emphasis choice, it is a missing decision about which action the group is for.
  - No two filled buttons side by side, of any family. Demote one to outlined or ghost from the same family.
  - No mixed families in one group. A secondary's partner is never violet, and a primary's never green.
  - No destructive action on the primary variant. Destructive work takes `danger`, so that "the emphasised action" and "the dangerous action" never look like the same thing.
  - No button whose accessible name comes only from an icon. The `icon` size changes the shape, never the naming requirement.
---

### Button

The dependency that predates the waves, and the reference implementation for
the component API conventions in `README.md`.

- **Slots:** Children (required) — the label, plus any icons, composed by the
  caller rather than chosen from a fixed leading/trailing pair.
- **Props:** variant (primary, outlined, ghost, secondary, secondary-outlined,
  secondary-ghost, danger, danger-ghost; defaults to secondary), size (sm, md, lg, xl, 2xl, expressive, and icon-only
  icon-sm, icon, icon-lg, icon-xl, icon-expressive), asChild, className, type.
- **Two families, three ranks** (2.6.0, 2026-10-17): violet is primary,
  outlined and ghost; green is secondary, secondary-outlined and
  secondary-ghost. The outlined styles take the filled styles' geometry (the
  64px inset and the pinned trailing icon) on no fill, with a 1px border in the
  family colour drawn as an inset shadow, and ghost's hover and press. A tonal
  secondary was tried in the kit and dropped: its container fill measured
  1.23:1 against the page in light and 1.36:1 in dark.
- **Tokens:** `primary` fills the primary variant, and is the label and border
  on outlined and the ghost label; `secondary` fills secondary, which the kit renders filled rather than
  outlined; `danger` fills the destructive variant and supplies its hover and
  pressed steps. `on-primary` is the label on all three filled styles — one
  label colour, not one per variant. `surface-variant` is ghost's hover and
  pressed background, under a label that darkens a step to `primary-hover`.
  Danger ghost is a `danger` label on nothing that fills with danger's hover
  and pressed steps when touched. Disabled, the ghost styles stay unfilled and
  only the label dims. The spacing scale carries padding and the minimum touch
  target, and the motion tokens carry transitions, so a button moves on the
  same curve as the page around it.
- **Geometry follows the kit** (governance rule 7): square corners, an
  asymmetric `0 64px 0 16px` inset on the filled styles that left-aligns the
  label and reserves the trailing icon's slot, with the icon pinned 16px from
  the right edge inside it, and heights of 32/42/50 for sm/md/lg. The ghost
  styles are padded 16 on both sides and let the icon follow the label at
  8px. Icons are 16px at every size. Medium and Large sit two pixels off the
  spacing scale; that is a kit fact, recorded rather than rounded away.
- **The kit's full Size axis** (#221): Extra large (66) and 2x large (82)
  top-align the label and icon 16px down, Expressive (50) sets its label at
  16/24, and Icon only exists at every size the kit draws it (32, 40, 48, 64,
  44). The kit draws 2x large and the icon-only squares without the danger
  styles; it says nothing against them, so the code allows them. Ghost
  Expressive keeps the kit's 12px label-to-icon gap, which looks like a
  leftover 20px icon spacer, built as drawn.
- **Focus follows the kit too:** a 2px ring inside the edge in primary's focus
  colour on every style except the danger ones, which take danger's, with a
  1px background line inside it on the filled styles. On the outlined styles
  the ring replaces the border. The kit bound Secondary's ring to
  `state/success-focus-ring` until 2026-10-17; that slip was fixed in the kit by
  moving it to primary's, so the code moved from secondary's own ring to
  primary's (rule 7).
- **Composition rules:** One filled button per group, last in the group, with
  partners from its own family. A Modal footer or a toolbar may hold at most
  one filled button, and ButtonGroup enforces all three. Hover
  and pressed are tone-step moves on the resting fill's own ramp, never a new
  color; this is the logic Text input's focus border, Toggle's on state and Dropdown
  Menu's item hover all refer back to. The minimum touch target holds at every
  size, which is the rule Checkbox cites. The variant recipe is exported, so a
  sibling can render something button-shaped without restating the rules.
- **Prohibitions:** No two primary buttons in one group: the second is not an
  emphasis choice, it is a missing decision about what the group is for. No two
  filled buttons of any family side by side, and no mixed families. No
  destructive action on the primary variant, so that "the emphasised action"
  and "the dangerous action" never look alike. No button whose accessible name
  comes only from an icon; the `icon` size changes the shape, not the naming
  requirement.
- **Motion** (2026-10-24, 2.7.0). The press stays instant; the hover color now still eases under reduced motion, which only removes the press displacement.
