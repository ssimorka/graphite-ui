---
component: Popover
version: 2.0.0
wave: 5
slots:
  - name: Trigger
    required: true
  - name: Content
    required: true
    notes: Can include interactive elements.
props:
  - name: placement
    values: [top, bottom, left, right]
    notes: The kit's Position. The panel does not flip when it runs out of room.
  - name: align
    values: [start, center, end]
    notes: The kit's Alignment, Center by default as the kit orders it. The caret stays on the trigger's centre; Start and End put it 16 from that edge of the panel.
  - name: variant
    values: [default, tab-tip]
    notes: The kit's Popover and Popover - Tab tip sets. Tab tip opens below only, aligned start or end, and joins the open trigger to the panel with no gap and no caret, the trigger taking the panel's fill.
  - name: modal
    values: boolean
    notes: Whether it traps focus.
  - name: defaultOpen
    values: boolean
    notes: Starts open. For documentation surfaces that need to show the open state; dismissal still comes from the shared Overlay base.
  - name: label
    values: string
    notes: The accessible name of a modal Popover's dialog. Ignored without modal, where the panel has no role to name.
tokens:
  - name: elevation
    usage: The panel and caret fill, elevation-01, the kit's Layer/layer-01; and the open Tab tip trigger, which takes the same fill.
  - name: shadow
    usage: The lift, shadow-overlay, the kit's Shadows/Menu, cast by the panel and caret as one shape (or by trigger and panel together on a Tab tip). No edge.
  - name: spacing
    usage: Padding, 16.
  - name: radius
    usage: Panel corner.
  - name: motion
    usage: The entrance fade, shared with the other overlays. No exit: content unmounts on close, which is what keeps the no-nesting throw off the prerender path.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Inherits the shared Overlay dismiss pattern exactly — no custom close behavior per instance.
  - Its own trigger is not outside it. A press on the trigger while open is left to the trigger, which toggles the panel closed.
  - The caret is the kit's 12 by 6, in the panel's fill, on the trigger's centre, its base 4 from the trigger, so the panel starts 10 out.
prohibitions:
  - No Popover nested inside another Popover.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Popover
- **Slots:** Trigger (required), content (required, can include interactive elements).
- **Props:** placement, align (start, center, end), variant (default, tab-tip), modal (boolean — whether it traps focus), defaultOpen (boolean — starts open, for documentation surfaces), label (string — names a modal Popover's dialog).
- **Tokens:** `elevation-01` fill, `shadow-overlay` lift and no edge (overlay.md 2.0.0); the spacing scale for padding.
- **Kit parity** (#230, 2.0.0, a major: the edge is gone and the default alignment moved from start to the kit's center): the caret, the three alignments and the Tab tip set. Popover item's Shadow=False and Zero radius=false are drawn by no Popover variant and stay unexposed.
- **Composition rules:** Inherits the shared Overlay dismiss pattern exactly — no custom close behavior per instance.
- **Prohibitions:** No Popover nested inside another Popover.
