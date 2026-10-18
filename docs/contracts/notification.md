---
component: Notification
version: 3.1.0
wave: 5
slots:
  - name: Icon
    required: true
    notes: Drawn from the variant, as the kit draws one in every variant (the Failed, Succeeded and Informative status icons at 16, the warning triangle at 20). The icon prop overrides it; nothing removes it.
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
    notes: The kit's Actionable, its Notification action button item. A small ghost Button in Body/3 with a 1px edge, before the close control.
  - name: onClose
    type: "() => void"
    notes: Optional. When set, a close button labelled "Dismiss notification" renders at the trailing edge and calls it. Without it the notification has no close control and lasts until the caller stops rendering it.
tokens:
  - name: on-surface
    usage: Title and message on every status container, as the kit binds them (D6 on #219), and since 3.1.0 the action label (Text/text-primary) and close glyph (Icon/icon-primary) too. Swept across 288 sources, both modes, AA and AAA, the worst pair is 9.77:1, and 9.99:1 on the action's surface-variant hover.
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
    usage: Fill on the warning variant, and the "!" cut out of its triangle; the stripe and triangle on it in high contrast (the kit's inverse/warning).
  - name: success-container
    usage: Fill on the success variant; the stripe and icon on it in high contrast.
  - name: info-container
    usage: Fill on the info variant; the stripe and icon on it in high contrast (the kit binds infoContainer itself).
  - name: on-background
    usage: The high-contrast fill, and the action's 1px edge on the status containers (Border/border-inverse). Swept across 288 sources, the edge is 9.77:1 at worst.
  - name: background
    usage: High-contrast text, close glyph (Icon/icon-inverse) and focus ring.
  - name: on-primary
    usage: The action label in high contrast (Text/text-on-color), 13.22:1 at worst on the inverse fill.
  - name: primary
    usage: Its disabled state, primary-disabled, is the action's edge in high contrast (Border/border-disabled), 10.04:1 at worst. Nothing else here is primary any more.
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
- **Tokens:** each status takes its `*-container` fill, its base role for the icon, 1px edge and 3px stripe, and `on-surface` text (D6); high contrast takes `on-background` with `background` text and the container for stripe and icon. The action is outlined: `on-surface` label on an `on-background` edge, and in high contrast an `on-primary` label on a `primary-disabled` edge. The close glyph is `on-surface`, and `background` in high contrast.
- **Kit parity** (#236, 3.0.0, a major; its notes on the close, the action and the info icon are superseded by 3.1.0 below: info is a status container like the rest, text is on-surface rather than on-*-container, the icon is built in and the close is the kit's 48px ghost). Recorded rather than copied: the close glyph is a plus in the kit (built as a cross); the high-contrast close stays primary in the kit (built in background, Carbon's icon-inverse); the inverse stripe, icon and link stops are not roles in the engine, so the status and primary containers stand in, swept at 3:1 or better; the status icons mix Carbon and Flaticon at 16 and 20; the title-to-message gap is 2.75 (built at 4).
- **Kit parity, 2026-10-17** (3.1.0, minor: the token dependencies changed, no prop or prohibition did). The kit corrected Inline and Callout to copy Notification - Toast, per Status and High contrast, and the code follows (rule 7). Was a ghost `primary` action (`primary-container` in high contrast) and a `primary` close glyph; now:
  - Action: the kit's Notification action button item, outlined. Light variants: label `on-surface` (Text/text-primary), edge `on-background` (Border/border-inverse). High contrast: label `on-primary` (Text/text-on-color), edge `primary-disabled` (Border/border-disabled). It butts the close, with no gap, as the kit draws it.
  - Close glyph: `on-surface` (Icon/icon-primary); `background` (Icon/icon-inverse) in high contrast, as before.
  - Info icon: the kit's Status icon Informative (Information--square--filled, 49956:12553), a square with the "i" cut out, at 16 and 16 down, in `info`; `info-container` in high contrast. Was fi-rs-info at 20. It is `info-square` in `lib/kit-icons.ts`; `info` (fi-rs-info) stays for the Toggletip trigger. The kit uses Informative for every info status, so the icon is the same in Toast.
  - Warning icon: the kit's Status icon Caution minor at 20, the same triangle as before, `warning`, and in high contrast inverse/warning, which `warning-container` stands in for. The "!" is cut out of the kit's triangle, so the mark takes the fill under it: `warning-container`, or `on-background` in high contrast (was `on-warning` and `on-warning-container`).
  - Inline differs from the template: as of 2026-10-17 the kit's Inline still draws the older Warning yellow icon (Support/support-warning, and Support/support-error-inverse in high contrast), where Toast and Callout draw Caution minor. The code follows Toast and Callout; recorded here rather than copied.
  - Recorded rather than copied: the action's hover. The kit's item fills `surfaceVariant` on hover; that holds on the status containers (label kept `on-surface`, 9.99:1 at worst), but on the inverse fill it would put a light patch under a light label, so high contrast keeps the colours and underlines. The kit's high-contrast focus ring is `background`, and so is the code's. The Callout's long-message info icon sits at 14 in the kit and 16 in its short message; built at 16 for both.
  - Swept across 288 sources, both modes, AA and AAA: every new pair holds at 9.77:1 or better, except the info icon on its container at 6.88:1 (a 3:1 graphic); the high-contrast icons are the containers swept in #260. The AAA shortfall the old ghost label had (6.34:1) is gone with it.
- **Composition rules:** Not an overlay: inline, with no focus trap and no Escape or click-outside dismissal. Not a toast — Notification is inline and persistent until dismissed (through `onClose`, when the caller provides it) or the condition changes. Toast is a Tier 2 component with its own timing contract.
- **Prohibitions:** No status color invented ad hoc — a status variant uses its generated container role, never a hand-picked hex. Same constraint as Tag.
