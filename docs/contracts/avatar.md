---
component: Avatar
version: 1.3.0
wave: 1
slots:
  - name: Image
    required: false
  - name: Initials fallback
    required: true
    notes: Required if no image.
  - name: Status dot
    required: false
props:
  - name: size
    values: [sm, md, lg]
  - name: shape
    values: [circle, square]
  - name: className
    notes: Merged after the size and shape classes, so a caller can extend without forking. Used by the site header to tint the source-color trigger.
tokens:
  - name: surface
    usage: Fallback background.
  - name: on-surface
    usage: Fallback initials text.
  - name: spacing
    usage: Size steps for sm, md, and lg.
  - name: radius
    usage: Corner on the square variant. The circle variant is a shape, not a radius step.
composition_rules:
  - Image failure always falls back to initials, never to a broken image icon or blank circle. This includes an image that fails before hydration: server-rendered markup starts loading immediately, so an onError handler attached later never fires and the component must re-check on mount.
prohibitions:
  - No status dot without an accessible label describing the status (not color alone).
---

### Avatar
- **Slots:** Image (optional), initials fallback (required if no image), status dot (optional).
- **Props:** size (sm, md, lg), shape (circle, square), className.
- **Tokens:** `surface` for the fallback background, `on-surface` for fallback initials text; the spacing scale for the size steps.
- **Composition rules:** Image failure always falls back to initials, never to a broken image icon or blank circle.
- **Prohibitions:** No status dot without an accessible label describing the status (not color alone).
