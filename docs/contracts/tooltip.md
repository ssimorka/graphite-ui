---
component: Tooltip
version: 2.0.0
wave: 5
slots:
  - name: Trigger
    required: true
    notes: Any focusable element. With type definition it is the term as text, and the Tooltip renders the kit's dotted-underline button for it.
  - name: Content
    required: true
    notes: Short text only.
props:
  - name: placement
    values: [top, bottom, left, right]
    notes: The kit's Position. Definition opens above or below only; left and right fall back to bottom.
  - name: align
    values: [start, center, end]
    notes: The kit's Alignment, for top and bottom. The caret stays on the trigger's centre; start and end put it 16 from that edge of the bubble.
  - name: type
    values: [standard, icon, definition]
    notes: The kit's Type. Standard is padded 16 with the 12 by 6 caret 8 from the trigger. Icon, for an icon-only button, is padded 2 by 16, at least 64 wide, with the 8 by 4 caret 4 away. Definition is padded 8 by 16 with the large caret 4 away.
  - name: delay
    notes: Behaviour the kit cannot draw; the code keeps it.
tokens:
  - name: on-background
    usage: The bubble and caret, the kit's background-inverse. Tooltip is the overlay the kit draws inverse (overlay.md 2.0.0), so it needs no edge and no shadow.
  - name: background
    usage: The bubble's text, the kit's icon-inverse.
  - name: text
    usage: The kit's Tooltip style, 12/16 Medium, for the bubble and the definition term.
  - name: on-surface-variant
    usage: The definition term, the kit's text-secondary.
  - name: secondary
    usage: The definition term's dotted rule at rest, the kit's button-secondary.
  - name: primary
    usage: The definition term's rule on hover and focus (the kit's interactive), and its focus ring, through the family's focus step.
  - name: spacing
    usage: Padding per type and the gap from the trigger.
  - name: radius
    usage: Bubble corner.
  - name: motion
    usage: The entrance fade. Opacity only — the four placement classes each carry their own `transform`, so an animation that moved would overwrite the placement.
composition_rules:
  - inherited_from: Wave 5 shared Overlay base
    rule: A `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component).
  - Never contains interactive content — a Tooltip you can click into is a Popover.
  - `aria-describedby` goes on the trigger itself, the element that takes focus, and keeps any description the trigger already had.
  - The pointer can move from the trigger onto the bubble without it closing (WCAG 1.4.13, hoverable).
  - The caret is the kit's, in the bubble's fill, on the trigger's centre.
prohibitions:
  - No tooltip as the only source of critical information — it must be supplementary to visible content.
---

> **Shared Wave 5 overlay base** — quoted from the source document, applies to all five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.

### Tooltip
- **Slots:** Trigger (required, any focusable element), content (required, short text only).
- **Props:** placement (top, bottom, left, right), align (start, center, end), type (standard, icon, definition), delay.
- **Tokens:** `on-background` bubble with `background` text, no edge; the spacing scale for padding and trigger offset; `secondary` and `primary` for the definition term's rule.
- **Kit parity** (#232, 2.0.0, a major: the bubble is inverse with no edge, and Standard's padding grew from 2 by 16 to 16). The kit's Definition Top Center variant draws no bubble and its Top Start sits 26 off the trigger; both are slips, built from Bottom Center and Standard's Start rule. Max width 288 is the code's own: the kit's text runs to any width.
- **Composition rules:** Never contains interactive content — a Tooltip you can click into is a Popover.
- **Prohibitions:** No tooltip as the only source of critical information — it must be supplementary to visible content.
