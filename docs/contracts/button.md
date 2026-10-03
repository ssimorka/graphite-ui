---
component: Button
version: 2.5.0
wave: 0
slots:
  - name: Children
    required: true
    notes: The label, and any icons, as children. Icons are children rather than named slots, so a caller composes them instead of choosing from a fixed pair.
props:
  - name: variant
    values: [primary, secondary, ghost, danger, danger-ghost]
    notes: Defaults to secondary. A primary default would make breaking the one-primary rule the path of least resistance.
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
    usage: Fill on the primary variant, and the label colour on ghost — the kit binds Style=Ghost's text to `primary`, not to a neutral. Its hover step is ghost's label on hover and press; its focus step is the ring on primary and ghost; its disabled step is the fill on every filled style and the label on the ghost styles, which stay unfilled.
  - name: on-primary
    usage: Label on primary, secondary and danger, and on danger-ghost once hover or press fills it. One label colour across the filled styles, as the kit has it.
  - name: secondary
    usage: Fill on the secondary variant, which the kit renders filled rather than outlined. Its focus step is secondary's ring.
  - name: surface-variant
    usage: Hover and pressed background on ghost.
  - name: danger
    usage: Fill on the destructive variant, and the tone steps it takes on hover and press. The label on danger-ghost, which takes those same steps as its fill when touched. Its focus step is the ring on both danger styles.
  - name: background
    usage: The 1px line inside the focus ring on the filled styles, so the ring reads against its own fill.
  - name: spacing
    usage: Padding, gap to icons, and the minimum touch target.
  - name: motion
    usage: Transition duration and easing, shared with the pages so a button moves the way its surroundings do.
  - name: radius
    usage: Corner. The kit is square-cornered, so this resolves to `radius-none`.
composition_rules:
  - "One primary action per group. A group of buttons — a Modal footer, a toolbar — may contain at most one `primary`. Everything else is secondary, ghost, or danger. ButtonGroup enforces this, and Modal wraps its footer in it."
  - Hover and pressed are tone-step moves on the same ramp as the resting fill, never a different color. This is the logic Text input's focus border, Toggle's on state, and Menu's item hover all refer back to.
  - Never smaller than the defined minimum touch target, whatever the size prop. Checkbox refers back to this.
  - Variants are declared once as a recipe and exported, so a sibling component can render something button-shaped without restating the rules or forking the styles.
prohibitions:
  - No two primary buttons in one group. The second one is not an emphasis choice, it is a missing decision about which action the group is for.
  - No destructive action on the primary variant. Destructive work takes `danger`, so that "the emphasised action" and "the dangerous action" never look like the same thing.
  - No button whose accessible name comes only from an icon. The `icon` size changes the shape, never the naming requirement.
---

### Button

The dependency that predates the waves, and the reference implementation for
the component API conventions in `README.md`.

- **Slots:** Children (required) — the label, plus any icons, composed by the
  caller rather than chosen from a fixed leading/trailing pair.
- **Props:** variant (primary, secondary, ghost, danger, danger-ghost —
  defaults to secondary), size (sm, md, lg, xl, 2xl, expressive, and icon-only
  icon-sm, icon, icon-lg, icon-xl, icon-expressive), asChild, className, type.
- **Tokens:** `primary` fills the primary variant and also colours the ghost
  label; `secondary` fills secondary, which the kit renders filled rather than
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
- **Focus follows the kit too:** a 2px ring inside the edge in the style's own
  focus colour, with a 1px background line inside it on the filled styles. The
  kit binds Secondary's ring to `state/success-focus-ring`; every other style
  uses its own family's, so that reads as a slip, and the code draws
  secondary's.
- **Composition rules:** One primary action per group — a Modal footer or a
  toolbar may hold at most one, and ButtonGroup enforces it. Hover
  and pressed are tone-step moves on the resting fill's own ramp, never a new
  color; this is the logic Text input's focus border, Toggle's on state and Dropdown
  Menu's item hover all refer back to. The minimum touch target holds at every
  size, which is the rule Checkbox cites. The variant recipe is exported, so a
  sibling can render something button-shaped without restating the rules.
- **Prohibitions:** No two primary buttons in one group — the second is not an
  emphasis choice, it is a missing decision about what the group is for. No
  destructive action on the primary variant, so that "the emphasised action"
  and "the dangerous action" never look alike. No button whose accessible name
  comes only from an icon; the `icon` size changes the shape, not the naming
  requirement.
