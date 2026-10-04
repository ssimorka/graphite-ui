---
component: Slider
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Input Label in on-surface-variant, 8 above. Names the group, and each handle and value input through it.
  - name: Bounds
    required: true
    notes: The min and max values either side of the track, Body/3 on-surface, 8 clear.
  - name: Track
    required: true
    notes: A 2px rail with the selected part filled, a 2×4 middle tick 1 above it, and a handle per value. Each handle is a native range input; the drawing is laid over it.
  - name: Value inputs
    required: false
    notes: The governed Text input at Medium, 96 wide, its label hidden, 16 from the track. One for a single slider, after the track; Min before and Max after for a range.
  - name: Supporting text
    required: false
    notes: Help, error or warning text under the whole row, 8 below.
props:
  - name: value / onChange
    notes: Controlled. A number for the kit's Slider, a two-item tuple for its Slider - Range; the tuple stays ordered, each handle stopping at the other.
  - name: min / max / step
    notes: 0, 100 and 1 by default. Typing into a value input commits once the text is a value in range; leaving it snaps to the nearest allowed value.
  - name: showInputs
    values: boolean
    notes: The kit's Inputs. On by default, as both sets draw them. Without inputs, a range shows each value in a bubble over its handle on hover, focus and press, as the kit's track does.
  - name: label
    notes: Required.
  - name: helpText / errorText / warningText
    notes: Resolved through the shared field-message rule, so text and state cannot be shown apart. Error and warning put the value inputs in their states.
  - name: disabled
    values: boolean
  - name: readOnly
    values: boolean
    notes: The value shows without a handle or the middle tick, and cannot be changed.
tokens:
  - name: on-surface-variant
    usage: The label (Text/text-secondary), and a range handle on hover (Icon/icon-secondary).
  - name: on-surface
    usage: The bounds (Text/text-primary) and a range handle at rest (Icon/icon-primary).
  - name: outline
    usage: The single slider's rail and the middle tick, through the subtle step (Border/border-subtle-00).
  - name: on-background
    usage: The selected part of the rail and the single slider's handle (Border/border-inverse), and the value bubble's fill (Background/background-inverse).
  - name: elevation
    usage: The range rail's ground, elevation-02 (Layer accent/layer-accent-01).
  - name: primary
    usage: The handle and the selected part on focus and press (Border/border-interactive, Miscellaneous/interactive), the focus and press ring through primary-focus, and the disabled family through primary-disabled and primary-disabled-content.
  - name: background
    usage: The gap inside a pressed handle's ring, and the value bubble's text (Icon/icon-inverse).
  - name: danger
    usage: Error text.
  - name: text
    usage: Input Label, Body/3, and Caption/1 in the bubble and the supporting text.
  - name: radius
    usage: The value bubble's 2px corner.
  - name: spacing
    usage: The 16 and 8 gaps, and the bubble's padding.
composition_rules:
  - The value inputs are the governed Text input. Slider does not restyle them; it passes their state.
  - Hover, focus and press are the native input's pseudo-classes (governance rule 7). The kit's Hover, Focus, Active, Focused and Active + status states are what those pseudo-classes draw.
  - Error and warning text sit under the whole row, not under one input.
prohibitions:
  - No slider without a label. Each handle is named from it ("Price, minimum").
  - No slider for a small set of discrete options. That is a Radio button group.
---

### Slider
- **Slots:** Label (required), bounds (required), track (required), value inputs, supporting text.
- **Props:** value / onChange (a number, or a tuple for a range), min / max / step, showInputs, label, helpText / errorText / warningText, disabled, readOnly.
- **Tokens:** `outline-subtle` rail and tick; `on-background` fill and handle; `elevation-02` range ground; `primary` on focus and press; `on-surface` and `on-surface-variant` text and range handles.
- **Composition rules:** Text input for the values; states are pseudo-classes; supporting text under the row.
- **Prohibitions:** No unlabelled slider; no slider for discrete options.
- **Kit parity** (#269, 1.0.0): both public sets, Slider (`3673:40574`) and Slider - Range (`41061:1531`), on every axis but Skeleton, which has no counterpart by rule. Recorded rather than copied: the Slider set draws its one value input 288 wide, which leaves its rail 61; the code gives the input the Range set's 96 and the rail the rest. A range's error and warning fall on both of its inputs, where the kit draws them on the input of the handle in play: the message is about the range, and the code cannot know which value it concerns.
