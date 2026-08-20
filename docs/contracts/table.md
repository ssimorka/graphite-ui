---
component: Table
version: 1.2.0
wave: 6
slots:
  - name: Header row
    required: true
  - name: Body rows
    required: true
    notes: Composed from Item where a row needs leading/trailing content.
  - name: Footer row
    required: false
props:
  - name: density
    values: [compact, default]
  - name: sortable columns
    values: boolean
    notes: Per column.
tokens:
  - name: density
    usage: Row density steps. Resolves to `--graphite-density-*`.
  - name: outline
    usage: Row dividers.
  - name: surface
    usage: Header background.
  - name: primary
    usage: Sort-active column indicator.
  - name: surface-variant
    usage: Row hover. The same token Item uses, not a table-specific highlight.
  - name: on-surface
    usage: Header text.
  - name: spacing
    usage: Cell padding and the gap to the sort indicator.
composition_rules:
  - Row hover state uses the same tone-step shift as Item's interactive hover — Table is Item's contract applied at scale, not a separate visual system.
prohibitions:
  - No table that loses column headers on horizontal scroll — sticky header or a defined responsive collapse pattern is required, not optional.
---

### Table
- **Slots:** Header row (required), body rows (required, composed from Item where a row needs leading/trailing content), optional footer row.
- **Props:** density (compact, default), sortable columns (boolean per column).
- **Tokens:** `outline` for row dividers, `surface` for header background, `on-surface` for header text, `primary` for the sort-active column indicator, and `surface-variant` for row hover — the same token Item uses, so the two cannot diverge; the density steps for row height and the spacing scale for cell padding.
- **Composition rules:** Row hover state uses the same tone-step shift as Item's interactive hover — Table is Item's contract applied at scale, not a separate visual system.
- **Prohibitions:** No table that loses column headers on horizontal scroll — sticky header or a defined responsive collapse pattern is required, not optional.
