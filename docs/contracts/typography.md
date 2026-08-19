---
component: Typography
version: 1.0.0
wave: 1
slots:
  - name: Text content
    required: true
props:
  - name: variant
    values: [display, heading-1, heading-2, heading-3, heading-4, body, caption]
  - name: weight
tokens:
  - name: on-surface
    usage: Default text color.
  - name: surface
    usage: Explicit color override permitted only for `surface`-inverted contexts (e.g. text on a filled primary surface).
composition_rules:
  - Heading levels map to semantic HTML tags (h1–h4), not just visual size.
  - Variant choice is not decorative — it declares document structure.
prohibitions:
  - No skipped heading levels within a single composed page (h1 to h3 with no h2). This is a composition rule the page composer must enforce, not just the component.
---

### Typography
- **Slots:** Text content (required).
- **Props:** variant (display, heading-1 through heading-4, body, caption), weight.
- **Tokens:** `on-surface` for default; must accept an explicit color override only for `surface`-inverted contexts (e.g. text on a filled primary surface).
- **Composition rules:** Heading levels map to semantic HTML tags (h1–h4), not just visual size. Variant choice is not decorative — it declares document structure.
- **Prohibitions:** No skipped heading levels within a single composed page (h1 to h3 with no h2). This is a composition rule the page composer must enforce, not just the component.
