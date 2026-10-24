---
component: Overlay
version: 2.1.0
wave: 5
internal: true
slots: []
props:
  - name: dismissOn
    values: [escape, outside, close-control]
    notes: Which dismissals a given overlay honours. Every overlay honours at least one.
  - name: trapFocus
    values: boolean
    notes: Modal overlays trap; non-modal ones do not.
tokens: []
composition_rules:
  - The elevated surface is `elevation-01`, the kit's `Layer/layer-01`, and it is lifted by `shadow-overlay`, the kit's `Shadows/Menu` (0 2 6 at 30%), with no edge. Tooltip is the exception the kit draws: it is inverse, `on-background` fill with `background` text. Each overlay declares its surface in its own contract rather than inheriting it silently, so the drift check can hold it to it.
  - "Overlays share one entrance and one exit, `components/ui/_overlay-motion.scss`: they grow out of their source (opacity, and the individual `scale` property from 0.96, with the origin on the caret or the trigger's corner) on Out, and leave at the fast step. Each overlay declares its own `motion:` block and duration, for the same reason it declares its surface. The entrance scales `scale`, never `transform`: Tooltip and Popover carry their placement in `transform`, and an animated transform would overwrite the position it grew from."
  - Anything opened from the keyboard appears with no entrance, as the kit's motion rules require. The base records whether the gesture opening an overlay was a key press (`openedByKeyboard`), so every overlay can tell without threading a flag through each of its open paths.
  - "An exit holds the overlay mounted for the fast step after it closes (`usePresence`), inert and marked data-state=closed, then unmounts it. Presence starts from `open`, so a closed overlay is never rendered at all, on the server or the client: Popover's no-nesting throw still only fires once the outer one has opened, and never at prerender."
  - Under reduced motion the scale rides `--graphite-motion-travel`, so an overlay fades in and out without growing.
  - Focus returns to the element that opened the overlay when it closes, in every case, trapped or not.
  - Escape dismisses any overlay that is dismissible at all, and it is always the outermost open overlay that closes first.
  - Open overlays form a stack in the order they opened. Escape reaches only the most recently opened overlay that honours it or traps focus, so each press closes one layer. A trapping overlay that does not honour Escape (a Modal with dismissible off) still takes the press, so nothing beneath it closes.
  - An outside press closes every overlay it lands outside of, stopping at the first trapping overlay above. A press inside an overlay stacked above does not count as outside the ones below it, so a Menu open in a Modal closes on a press elsewhere in the Modal and the Modal stays.
  - Only the most recently opened trapping overlay wraps Tab.
prohibitions:
  - No overlay defines its own dismiss behavior. An overlay that needs a different one is a different component, not a variant.
---

### Overlay

Not a component. This is the shared base the Wave 5 contracts refer to when
they say each overlay "only needs to declare what's different".

The source document asks for it directly:

> All five below share one base pattern: a `surface` token at an elevated
> tone-step, a defined focus-trap behavior, and a defined dismiss pattern
> (Escape key, click-outside, or explicit close control depending on the
> component). Define that shared base once as an internal "Overlay" contract,
> then each component below only needs to declare what's different.

- **Slots:** None. Overlay is behavior, not markup.
- **Props:** `dismissOn` (which of Escape, click-outside and an explicit close
  control apply), `trapFocus` (modal overlays only).
- **Tokens:** None of its own. The visual half of the shared base —
  `elevation-01` for the surface and `shadow-overlay` for the lift, or the
  inverse pair on Tooltip — is declared by each overlay in its own contract,
  so no overlay can quietly use a token it has not declared.
- **Composition rules:** Focus always returns to the trigger on close. Escape
  always closes the outermost open overlay first, one per press. An outside
  press closes what it lands outside of, but never reaches past a trapping
  overlay. Dismiss behavior comes from here, never from the component.
- **Prohibitions:** No overlay defines its own dismiss behavior. One that needs
  a different pattern is a different component, not a variant of this one.

### The kit's overlay model (2.0.0)

Until 2.0.0 this contract put every overlay on `surface-elevated` with an
`outline` edge, and argued against the kit's component sets to get there: they
filled with `Layer/layer-01`, which then resolved to `surface`, while the
`surfaceElevated` variable's description named the overlays. The variable was
ranked the more specific artefact and won (#139).

That disagreement no longer exists in the kit. `Layer/layer-01` now resolves to
`elevation/01`, which sits on exactly the stops `surfaceElevated` does
(`neutral/050` Light, `neutral/700` Dark). The component sets and the variable
say the same thing, and what they say is the elevation ladder's first rung.
The engine's own `surface-elevated` role is the odd one out: it asks for tone
100 Light and about 24 Dark, off the grid, so binding it is the one choice that
matches neither. Overlays bind `elevation-01` (#241), which matches both.

The edge goes with it. In Light, `elevation-01` equals the ground, so an
overlay still needs separating from the page. The kit does it with a shadow,
`Shadows/Menu`, on Menu and Popover: no stroke at all. That is
`--graphite-shadow-overlay`, a fixed value in `globals.scss` because the kit's
style is plain black in both themes.

**Tooltip is inverse.** Its set binds `Background/background-inverse`, which
resolves to `onBackground`, with `Text/text-inverse` resolving to `background`:
a dark bubble on a light page and the reverse. It needs no shadow, because the
fill already contrasts with the page. Nothing new is generated for it; both are
existing roles.

Component-level parts of the model (Popover's 12×6 caret, its alignments,
Menu's row heights) belong to those components' contracts, not this one. The
overlays move to this model in #230 (Popover), #231 (Menu) and #232 (Tooltip).
Until each lands, its own contract still describes what it renders.

- **Motion** (2026-10-24, 2.1.0). The shared entrance grows from the overlay's source and the overlays gain an exit, held by usePresence; keyboard-opened overlays appear at once.
