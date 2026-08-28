---
component: Modal
version: 1.4.2
wave: 5
slots:
  - name: Title
    required: true
  - name: Body
    required: true
  - name: Footer actions
    required: false
    notes: Typically Button.
props:
  - name: size
    values: [sm, md, lg]
  - name: dismissible
    values: boolean
tokens:
  - name: surface-elevated
    usage: The shared overlay surface — surface at an elevated tone step.
  - name: scrim
    usage: Full-screen scrim at a defined opacity over the base surface.
  - name: on-surface
    usage: Title and body text.
  - name: outline
    usage: Footer divider.
  - name: spacing
    usage: Padding and size steps.
  - name: radius
    usage: Panel corner.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Always traps focus, always returns focus to the trigger on close.
  - Footer follows Button's one-primary-action rule, wrapped in the same ButtonGroup that enforces it.
prohibitions:
  - No Modal opened from within another Modal — stack depth of one.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Modal
- **Slots:** Title (required), body (required), footer actions (optional, typically Button).
- **Props:** size (sm, md, lg), dismissible (boolean).
- **Tokens:** `surface-elevated`, `on-surface` text, `outline` footer divider, and a full-screen `scrim` at a defined opacity over the base surface; the spacing scale for padding and size steps.
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
