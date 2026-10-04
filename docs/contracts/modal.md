---
component: Modal
version: 2.0.0
wave: 5
slots:
  - name: Label
    required: false
    notes: The kit's Label, a 12/16 line 4 above the title.
  - name: Title
    required: true
    notes: Body/1 18/28 Regular. Also the dialog's accessible name.
  - name: Close
    required: false
    notes: The kit's Close icon, a 20px cross 16 from the top and right in a 48px target. Shown while the Modal is dismissible; a Modal that cannot be dismissed has no close, so the footer is its way out.
  - name: Progress
    required: false
    notes: The kit's Progress, a block between the header and the body, 16 above and below and 24 before the body.
  - name: Body
    required: true
    notes: Body/3, inset 16, with 48 below it.
  - name: Footer actions
    required: false
    notes: Typically Button. Laid out as the kit's footer, a full-bleed row of 64px columns 1px apart, from the right; a ghost button first is the kit's Cancel, pinned to the left.
props:
  - name: size
    values: [xs, sm, md, lg]
    notes: The kit's Size. Width caps of 320, 384, 512 and 672; under 672px of viewport the dialog is full bleed, the kit's Mobile.
  - name: dismissible
    values: boolean
  - name: loading
    values: string
    notes: The kit's Inline loading. The primary action's column shows this text with the spinner while the action runs.
tokens:
  - name: background
    usage: The panel, as the Modal set binds it (Background/background). The scrim separates it from the page, so it takes neither the overlays' elevation nor their shadow.
  - name: scrim
    usage: Full-screen scrim at a defined opacity over the base surface.
  - name: on-surface
    usage: Title, body and the close glyph.
  - name: on-surface-variant
    usage: The label and the loading text.
  - name: text
    usage: The label at 12/16, the title at Body/1, the body at Body/3.
  - name: spacing
    usage: Padding, the title's clearance of the close, the footer row and size steps.
  - name: radius
    usage: Panel corner.
  - name: motion
    usage: The entrance fade on the scrim, shared with the other overlays. Opacity only, and no exit, since the Modal unmounts on close.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Always traps focus, always returns focus to the trigger on close.
  - The scrim click is the shared base's outside press, not a handler of the Modal's own. dismissible switches it off together with Escape.
  - Size caps the width at 320 (xs), 384 (sm), 512 (md) and 672 (lg). Large is the kit's 671 frame on the grid; the kit draws every size at that width.
  - Footer follows Button's one-primary-action rule, wrapped in the same ButtonGroup that enforces it. One or two actions take two columns from the right; three, or a Cancel, take four. The buttons are the kit's Extra large, held to the 64px row.
prohibitions:
  - No Modal opened from within another Modal — stack depth of one.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Modal
- **Slots:** Label (optional), title (required), close (while dismissible), progress (optional), body (required), footer actions (optional, typically Button).
- **Props:** size (xs, sm, md, lg), dismissible (boolean), loading.
- **Tokens:** `background` panel and `on-surface` text, as the Modal set binds them, over a full-screen `scrim`; the spacing scale for padding and size steps; the shared `motion` fade on entrance.
- **Kit parity** (#237, 2.0.0, a major: the panel moves from `surface-elevated` to `background`, the footer loses its divider and becomes the kit's full-bleed row, and a dismissible Modal grows a close button). Recorded rather than copied: the kit draws every size 671 wide (the code steps the caps); its footer buttons measure 66 in a 64 row (held to 64); and Extra small sets the title with no clearance, under the close (given 44, as Small). The panel's binding replaces the #139 reading, which `overlay.md` 2.0.0 retired once the kit's sets and variables agreed.
- **Composition rules:** Always traps focus, always returns focus to the trigger on close. Footer follows Button's one-primary-action rule, wrapped in the same ButtonGroup that enforces it.
- **Prohibitions:** No Modal opened from within another Modal — stack depth of one.

### How `scrim` resolves in the kit (#92)

The kit variable was named `overlay` and held Carbon's `#161616` at 50% Light /
70% Dark, with a description recording that Graphite had no token of its own.
It is now named `scrim`, matching this contract, and its hue is Graphite's
darkest neutral stop (`#030305`). It stays a literal RGBA rather than an alias
because a Figma variable alias cannot carry an alpha channel.

`app/globals.scss` took the same hue, so `--graphite-scrim` became
`rgb(3 3 5 / 0.55)` rather than flat black — but still flat, and still static.

That gap is now closed, by the second of the two routes this section used to
offer: `scrim` moved into the themed pass. `scrimFor()` in `lib/color.js`
derives it from `neutral` tone 10 and applies the kit's 50% Light / 70% Dark
split. Two things follow. The scrim tracks the source colour like every other
role, where before it was the one role that stayed put while the rest moved.
And the design question the split implied is answered: the scrim does deepen in
dark, because the surface it veils is already dark and an equal alpha separates
the Modal from its background far less.

It is emitted alongside the token map rather than inside it. A scrim has no
`on-` partner and enters no contrast pairing, so putting it in `tokens` would
enter it into both, and it resolves to RGBA rather than a tone in any case.
The declaration in `app/globals.scss` remains, but only as the pre-hydration
fallback, at the dark alpha because `layout.tsx` first-paints `cds--g100`.

The kit variable's description has been updated to match and is awaiting a
library republish.
