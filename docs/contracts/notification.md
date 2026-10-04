---
component: Notification
version: 3.0.1
wave: 5
slots:
  - name: Icon
    required: true
    notes: Drawn from the variant, as the kit draws one in every variant (Failed and Succeeded status icons, the warning triangle, fi-rs-info). The icon prop overrides it; nothing removes it.
  - name: Title
    required: false
  - name: Body
    required: true
props:
  - name: variant
    values: [info, danger, warning, success]
    notes: The kit's Status. Its Error is danger here, the name every status role uses.
  - name: kind
    values: [inline, callout]
    notes: The kit's Notification - Inline and Notification - Callout sets. A callout has no close control and no action, and the kit draws it for info and warning only.
  - name: highContrast
    values: boolean
    notes: The kit's High contrast. The fill inverts to on-background with background text and no edge.
  - name: action
    type: "{ label: string; onClick: () => void }"
    notes: The kit's Actionable. A small ghost button in Body/3 before the close control.
  - name: onClose
    type: "() => void"
    notes: Optional. When set, a close button labelled "Dismiss notification" renders at the trailing edge and calls it. Without it the notification has no close control and lasts until the caller stops rendering it.
tokens:
  - name: on-surface
    usage: Title and message on every status container, as the kit binds them (D6 on #219). Swept across 288 sources, both modes, AA and AAA, the worst pair is 9.78:1.
  - name: danger
    usage: Icon, 1px edge and 3px stripe on the danger variant.
  - name: warning
    usage: Icon, edge and stripe on the warning variant.
  - name: success
    usage: Icon, edge and stripe on the success variant.
  - name: info
    usage: Icon, edge and stripe on the info variant.
  - name: danger-container
    usage: Fill on the danger variant; the stripe and icon on it in high contrast.
  - name: warning-container
    usage: Fill on the warning variant; the stripe and icon on it in high contrast.
  - name: success-container
    usage: Fill on the success variant; the stripe and icon on it in high contrast.
  - name: info-container
    usage: Fill on the info variant; the stripe and icon on it in high contrast.
  - name: on-warning
    usage: The "!" on the warning triangle.
  - name: on-warning-container
    usage: The "!" on the warning triangle in high contrast.
  - name: on-background
    usage: The high-contrast fill.
  - name: background
    usage: High-contrast text and close glyph.
  - name: primary-container
    usage: The action label in high contrast, standing in for the kit's inverse link. (The action label and close glyph are otherwise primary, the kit's link-primary and icon-interactive, drawn by Button's ghost style; that label clears AA on every container but falls to 6.34:1 at AAA for some sources. Recorded, not hidden.)
  - name: text
    usage: Title at Title/5 SemiBold and message at Body/3.
  - name: spacing
    usage: The 16 inset and icon gap, the 48 row, and the action's margins.
  - name: radius
    usage: Container corner.
composition_rules:
  - Not an overlay, though the source document lists it with them. It renders inline in the page flow, with nothing to trap focus in and no Escape or click-outside dismissal. Its one dismiss pattern is the explicit close control, present only when `onClose` is set.
  - Not a toast — Notification is inline and persistent until dismissed or the condition changes. The kit's Notification - Toast set is its own component with its own timing, docs/contracts/toast.md (#272).
  - The status is said three ways: the container and its edge and stripe, the icon, and the words. Colour is never the only signal.
prohibitions:
  - No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Tag.
---

> **Shared Wave 5 overlay base** — quoted from the source document, which lists Notification among the five Wave 5 overlay components:
>
> All five below share one base pattern: a `surface` token at an elevated tone-step, a defined focus-trap behavior, and a defined dismiss pattern (Escape key, click-outside, or explicit close control depending on the component). Define that shared base once as an internal "Overlay" contract, then each component below only needs to declare what's different.
>
> Notification does not inherit that base, and until 2.3.0 this contract wrongly said it did. It is inline and persistent, so it takes plain `surface` rather than the elevated one, has no focus to trap, and is dismissed only through its optional close control. Of the base's three dismiss patterns it keeps the explicit close control and nothing else.

### Notification
- **Slots:** Icon (drawn from the variant), title (optional), body (required).
- **Props:** variant (info, danger, warning, success), kind (inline, callout), highContrast, action, `onClose` (optional), which renders a 48px ghost close labelled "Dismiss notification".
- **Tokens:** each status takes its `*-container` fill, its base role for the icon, 1px edge and 3px stripe, and `on-surface` text (D6); high contrast takes `on-background` with `background` text and the container for stripe and icon. `primary` (through Button's ghost) for the action and close glyph, and `primary-container` for the action in high contrast.
- **Kit parity** (#236, 3.0.0, a major: info is a status container like the rest, text is on-surface rather than on-*-container, the icon is built in and the close is the kit's 48px ghost). Recorded rather than copied: the close glyph is a plus in the kit (built as a cross); the high-contrast close stays primary in the kit (built in background, Carbon's icon-inverse); the inverse stripe, icon and link stops are not roles in the engine, so the status and primary containers stand in, swept at 3:1 or better; the status icons mix Carbon and Flaticon at 16 and 20; the title-to-message gap is 2.75 (built at 4).
- **Composition rules:** Not an overlay: inline, with no focus trap and no Escape or click-outside dismissal. Not a toast — Notification is inline and persistent until dismissed (through `onClose`, when the caller provides it) or the condition changes. Toast is a Tier 2 component with its own timing contract.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Tag.
