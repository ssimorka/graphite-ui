---
component: Overlay
version: 1.1.0
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
  - The elevated surface is `surface-elevated` and the edge is `outline`. Each overlay declares those in its own contract rather than inheriting them silently, so the drift check can hold it to them.
  - Overlays enter on one shared fade — the fast motion step on the shared easing — and each overlay declares `motion` in its own contract for the same reason it declares its surface. The fade is opacity only: Tooltip carries its placement in `transform`, a different value per side, so an entrance that moved would overwrite the position it was moving to.
  - There is no exit transition, deliberately. Every overlay unmounts its content on close, and Popover depends on that: its no-nesting prohibition is enforced by a throw that only fires because content does not exist until it is open. Holding a closed overlay mounted to animate it out would move that throw to prerender.
  - Focus returns to the element that opened the overlay when it closes, in every case, trapped or not.
  - Escape dismisses any overlay that is dismissible at all, and it is always the outermost open overlay that closes first.
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
  `surface-elevated` for the surface, `outline` for the edge — is declared by
  each overlay in its own contract, so no overlay can quietly use a token it
  has not declared.
- **Composition rules:** Focus always returns to the trigger on close. Escape
  always closes the outermost open overlay first. Dismiss behavior comes from
  here, never from the component.
- **Prohibitions:** No overlay defines its own dismiss behavior. One that needs
  a different pattern is a different component, not a variant of this one.

### Why the code binds surfaceElevated and the kit's components do not

Worth recording, because reading the component sets alone would suggest the
opposite. Carbon's Popover and Menu fill with `Layer/layer-01`, which the
binding table in `theme-provider.tsx` feeds from `surface` — not from
`surfaceElevated`. Taken literally, governance rule 7 would move the overlays
onto `surface`.

It should not. The kit's own semantic layer is explicit about this: the
`surfaceElevated` variable's description reads *"Shared overlay surface:
Tooltip, Popover, Dropdown Menu, Dialog."* It was added in #92 for exactly
these four. The components still bind `layer-01` because they are Carbon's,
un-migrated — the same reason they still carry Carbon's variant axes.

So the kit says two things and the more specific one wins: a variable authored
to name these components beats a component binding inherited from Carbon. When
those sets are eventually rebuilt they should bind `surfaceElevated`, and this
note stops the next reader "correcting" the code toward `layer-01` in the
meantime.

### How the shared surface resolves in the kit (#92)

`surfaceElevated` now exists in the kit's `Graphite Semantic` collection,
aliased to `neutral/050` in Light and `neutral/700` in Dark — the same two
stops `elevation/01` uses.

It is snapped rather than exact. The engine asks for neutral tone 100 in Light
and tone 24 in Dark, and neither is on the 050-900 ramp, so both were moved to
the nearest grid stop the same way `surface` already snaps its dark ground to
`neutral/800`. The alternative was two new intermediate primitives, which the
ramp constraint rules out.

**The consequence is load-bearing.** In Light, `surface-elevated` resolves to
the same value as `surface`, so an overlay has no fill separation from the page
behind it and its edge has to be drawn. That is why every overlay declares
`outline`, Tooltip included as of 1.4.0 — an overlay that declares only
`surface-elevated` is invisible in Light.
