---
component: Toast
version: 1.1.0
wave: 5
slots:
  - name: Icon
    required: true
    notes: The status icon, Notification's (Failed, Succeeded and Informative at 16, the warning triangle at 20), 14 in from the left and the top.
  - name: Title
    required: true
    notes: Title/5 SemiBold, over the message.
  - name: Message
    required: false
    notes: Body/3.
  - name: Time stamp
    required: false
    notes: The kit's Time text, Body/3, 24 under the message. Not drawn with an action, as the kit draws it.
  - name: Action
    required: false
    notes: The kit's Actionable, Notification's action (the kit's Notification action button item, a small ghost Button with a 1px edge), 24 under the message with its edge at the text's.
  - name: Close
    required: false
    notes: The kit's Close, a 48px ghost icon-only Button flush in the top right, named "Dismiss notification".
props:
  - name: variant
    values: [info, success, warning, danger]
    notes: The kit's Status. Its Error is danger here, as in Notification.
  - name: highContrast
    values: boolean
    notes: The kit's High contrast. Off by default, as Notification's is; the kit's Toast set defaults it on.
  - name: title / body / timestamp
    notes: The kit's Title text, Message text and Time text.
  - name: action
    type: "{ label: string; onClick: () => void }"
  - name: onClose
    type: "() => void"
  - name: duration
    notes: Given when the toast is shown through the host. 6000 ms by default; danger toasts stay until closed unless a duration is given. The countdown holds while the pointer or focus is on the toast and resumes where it stopped.
tokens:
  - name: on-surface
    usage: Title, message and time stamp on every status container (Notification's D6 sweep covers it); the action label (Text/text-primary) and close glyph (Icon/icon-primary).
  - name: info
    usage: Icon and stripe on the info variant.
  - name: success
    usage: Icon and stripe on the success variant.
  - name: warning
    usage: Icon and stripe on the warning variant. The triangle and its "!" at rest are drawn by Notification's status icon.
  - name: danger
    usage: Icon and stripe on the danger variant.
  - name: info-container
    usage: Fill on the info variant; its stripe in high contrast.
  - name: success-container
    usage: Fill on the success variant; its stripe and icon in high contrast.
  - name: warning-container
    usage: Fill on the warning variant; its stripe in high contrast.
  - name: danger-container
    usage: Fill on the danger variant; its stripe and icon in high contrast, and the warning triangle in high contrast (Support/support-error-inverse, as Notification's).
  - name: on-info
    usage: The info icon in high contrast.
  - name: on-background
    usage: The high-contrast fill, the "!" cut out of the warning triangle on it, and the action's edge on the status containers (Border/border-inverse).
  - name: background
    usage: High-contrast text, close glyph and focus ring.
  - name: on-primary
    usage: The action label in high contrast (Text/text-on-color).
  - name: primary
    usage: Its disabled state, primary-disabled, is the action's edge in high contrast (Border/border-disabled).
  - name: shadow
    usage: The overlay shadow (the kit's DROP_SHADOW 0 2 6).
  - name: motion
    usage: The arrival, a short fade and drop, none under reduced motion.
  - name: text
    usage: Title/5 SemiBold and Body/3.
  - name: spacing
    usage: The 14 inset and icon gap, the 24 gap, the padding and the host's placement.
  - name: radius
    usage: Square corners.
composition_rules:
  - A toast is shown through the toaster host, which the app wraps once; the host stacks toasts at the top right, newest on top, in a polite live region. A danger toast is an alert.
  - Status colours and icons are Notification's, so a toast and a notification of the same status read the same.
  - Timing never hides what must be acted on. Danger stays until closed by default, and nothing that needs a response belongs in a toast.
prohibitions:
  - No toast that is the only route to an action. The action must also be reachable where the reader is working.
  - No toast that dismisses itself while the pointer or focus is on it.
---

### Toast
- **Slots:** Icon (required), title (required), message, time stamp, action, close.
- **Props:** variant (info, success, warning, danger), highContrast, title / body / timestamp, action, onClose; duration through the host.
- **Tokens:** the status role and its container, as Notification's; `on-background` and `background` in high contrast; the overlay `shadow`.
- **Composition rules:** One host, top right, polite; danger is an alert; Notification's colours; timing never hides what must be acted on.
- **Prohibitions:** No toast as the only route to an action; no dismissing under the pointer or focus.
- **Kit parity, 2026-10-17** (1.1.0, minor: token dependencies only). The action and close follow the kit's Toast, which the kit's Inline and Callout now copy, so the change is recorded once in Notification's 3.1.0: an outlined action (`on-surface` on an `on-background` edge; `on-primary` on a `primary-disabled` edge in high contrast) where it was a ghost `primary` (`primary-container`), an `on-surface` close glyph, the Informative status icon (`on-info` in high contrast), and the high-contrast warning triangle on `danger-container`. The action no longer pulls 16 left: with an edge, the kit puts the edge, not the label, at the text's edge. Not yet followed: the kit's Toast draws Warning as a 16px status icon, where the code shares Notification's 20px triangle.
- **Kit parity** (#272, 1.0.0): the one Toast set, Notification - Toast (`84336:35011`), on every axis. Recorded rather than copied: the set defaults High contrast on, where Notification - Inline defaults it off; the code keeps one default, off, for both.
