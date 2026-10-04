---
component: Pagination
version: 1.0.0
wave: 6
slots:
  - name: Previous and next
    required: true
    notes: Ghost icon-only Buttons at the bar's size, named "Previous page" and "Next page", disabled at the ends.
  - name: Items per page
    required: false
    notes: The table bar's Advanced type. The governed Select, inline, labelled "Items per page:".
  - name: Range
    required: false
    notes: The table bar's Advanced type. "1–100 of 100 items" in on-surface-variant, filling the middle.
  - name: Page
    required: true
    notes: Advanced draws a page picker (the governed Select with its label hidden) and its total, "of 10 pages"; Simple and Unbound draw "Page 1".
props:
  - name: type
    values: [advanced, simple, unbound]
    notes: The kit's Pagination - Table bar Type. Unbound is for a total that is not known, so Next follows hasNext. The kit draws Simple and Unbound identically.
  - name: size
    values: [sm, md, lg]
    notes: The kit's Size, a 32, 40 or 48 row. Large by default.
  - name: page / pageSize / pageSizes / totalItems / onChange
    notes: Controlled. onChange receives the next page and page size; changing the page size returns to page 1.
  - name: hasNext
    values: boolean
    notes: Unbound only.
  - name: page-number form
    notes: The kit's Pagination - Nav, a separate export. Square page items at the same three sizes between previous and next, the current page marked; at most itemsShown entries (seven, as the kit draws), the first and last pages always shown, and an ellipsis for each run left out, which opens those pages as a native select (the kit's Overflow item). Wrapped in a nav landmark.
tokens:
  - name: elevation
    usage: The table bar, elevation-01 (the kit's layer-01); page-item and overflow hover, elevation-02 (the kit's background-hover).
  - name: outline
    usage: The table bar's top rule and its section dividers, through the subtle step (outline-subtle, the kit's border-subtle-00).
  - name: on-surface
    usage: Page numbers, the page label and total.
  - name: on-surface-variant
    usage: The range text.
  - name: primary
    usage: The current page's 16px rule (the kit's border-interactive), and the focus ring, through the family's focus step.
  - name: text
    usage: Body/3, and Title/5 SemiBold for the current page.
  - name: spacing
    usage: Item sizes, the bar's height and the section padding.
composition_rules:
  - Built from governed parts: Button for previous and next, Select for items per page and the page picker. It restyles neither.
  - The current page is marked by weight and a rule, and by aria-current, never by colour alone.
  - Data table's footer is its home in a table, as the kit draws the bar under Data table.
prohibitions:
  - No page item without a name. Each is named "Page n", and the ellipsis names the pages it hides.
---

### Pagination
- **Slots:** Previous and next (required), items per page, range, page.
- **Props:** type (advanced, simple, unbound), size (sm, md, lg), page / pageSize / pageSizes / totalItems / onChange, hasNext; and the page-number form, a separate export with page, totalPages, onChange, size and itemsShown.
- **Tokens:** `elevation-01` bar with an `outline-subtle` top rule and dividers; `elevation-02` hover; `primary` current-page rule; `on-surface` and `on-surface-variant` text.
- **Composition rules:** Built from Button and Select; the current page never rests on colour alone; Data table's footer is its home.
- **Prohibitions:** No unnamed page item.
- **Kit parity** (#268, 1.0.0): both public sets, Pagination - Nav (`2799:20761`) and Pagination - Table bar (`3889:50204`), on every axis. Recorded rather than copied: the bar is drawn 50, 42 and 34 tall, two over its controls, the same +2 Button carries; built at the controls' height plus the rule. Simple and Unbound are drawn identically; the code tells them apart by whether the total is known.
