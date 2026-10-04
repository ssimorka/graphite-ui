---
component: Search
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: The field's accessible name. The Default set draws none, so it names the input for assistive tech; Fluid paints it inside the box.
  - name: Search icon
    required: true
    notes: The kit's 16px fi-rs-search, leading on Default, trailing on Fluid. Decorative.
  - name: Clear
    required: false
    notes: The kit's 16px fi-rs-cross-small, shown once there is a value, named "Clear search". Escape clears too.
props:
  - name: size
    values: [sm, md, lg]
    notes: The kit's Size, 32, 40 and 48 tall, with the icon 8, 12 or 16 in. Large by default, as the kit has it.
  - name: layout
    values: [default, fluid]
    notes: The kit's Search - Default and Search - Fluid sets. Fluid is one 64px box with the label inside; size does not apply to it.
  - name: expandable
    values: boolean
    notes: The kit's Expandable. Collapsed to the icon in a square of the field's height until pressed; it collapses again when it loses focus empty, or on Escape when empty. Default layout only.
  - name: value / defaultValue / onChange
    notes: Controlled or not. onChange receives the string.
  - name: onSubmit
    notes: Enter. Running the search is the caller's.
  - name: disabled
    values: boolean
tokens:
  - name: elevation
    usage: The field, elevation-01 (the kit's field), and the clear's hover, elevation-02.
  - name: outline
    usage: The rest rule on the bottom, plain outline as the Search set draws it (Text input's is outline-strong); the placeholder, through outline-strong.
  - name: on-surface
    usage: The value and the clear glyph.
  - name: on-surface-variant
    usage: The search icon, the Fluid label, and the placeholder on hover, the kit's Hover state.
  - name: surface-variant
    usage: The collapsed expandable square's hover.
  - name: primary
    usage: The focus ring, through the family's focus step, 2px inside; the disabled fill and content, through its disabled steps.
  - name: danger
    usage: Inherited through the shared field shell's error ring. The kit's Search draws no error state, so the component never applies it.
  - name: text
    usage: The value at Body/3, the Fluid label at 12/16.
  - name: spacing
    usage: Heights, the icon inset and the Fluid box.
  - name: radius
    usage: Field corner, through the shared field shell.
composition_rules:
  - Built on the shared field shell, so it lines up with Text input and Select. Where the Search set draws differently, it says so in the stylesheet, next to the value.
  - Wrapped in role="search", so it is a landmark. The value is the caller's to act on; the component never filters anything itself.
  - Clearing returns focus to the field, so the reader can type again without reaching for it.
prohibitions:
  - No Search without a label. The Default set draws none, so the label is the only name the field has.
---

### Search
- **Slots:** Label (required, the accessible name; painted on Fluid), search icon, clear (when there is a value).
- **Props:** size (sm, md, lg), layout (default, fluid), expandable, value / defaultValue / onChange, onSubmit, disabled.
- **Tokens:** the field shell's `elevation-01` fill and focus ring, a plain `outline` rest rule, `on-surface-variant` icon and hover placeholder, `surface-variant` for the collapsed square's hover.
- **Composition rules:** On the shared field shell; a `search` landmark; clearing returns focus to the field.
- **Prohibitions:** No Search without a label.
- **Kit parity** (#267, 1.0.0): built from Search - Default (`2805:21056`, Size × State × Expandable × Expanded) and Search - Fluid (`15503:270751`). Recorded rather than copied: the Default set colours its placeholder in the disabled tone, which reads as disabled and disagrees with the Fluid set and Text input; the code uses the shell's `outline-strong`. Skeleton has no counterpart by rule. Contained list's header takes it as its search mode (#238), and Data table's toolbar composes it (#239).
