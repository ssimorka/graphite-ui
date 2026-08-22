---
component: Avatar
version: 1.2.0
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
  - Image failure always falls back to initials, never to a broken image icon or blank circle.
prohibitions:
  - No status dot without an accessible label describing the status (not color alone).
---

### Avatar
- **Slots:** Image (optional), initials fallback (required if no image), status dot (optional).
- **Props:** size (sm, md, lg), shape (circle, square).
- **Tokens:** `surface` for the fallback background, `on-surface` for fallback initials text; the spacing scale for the size steps.
- **Composition rules:** Image failure always falls back to initials, never to a broken image icon or blank circle.
- **Prohibitions:** No status dot without an accessible label describing the status (not color alone).
