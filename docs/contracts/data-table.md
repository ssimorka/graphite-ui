---
component: Data table
version: 2.0.0
wave: 6
slots:
  - name: Header
    required: true
    notes: The kit's header item. The caption, painted as the title in Table Header 14/24 Medium and naming the table; an optional description under it in Body/3.
  - name: Toolbar
    required: false
    notes: The kit's Toolbar, a 48px bar above the header row for the caller's controls. The batch actions bar takes its place while rows are selected.
  - name: Header row
    required: true
  - name: Body rows
    required: true
    notes: Composed from Contained list where a row needs leading/trailing content.
  - name: Footer
    required: false
    notes: The kit's Pagination bar, under the table.
props:
  - name: size
    values: [xs, sm, md, lg, xl]
    notes: The kit's size modes, rows of 24, 32, 40, 48 and 64, with cells padded 16 on the left and 8 on the right. Large by default. Extra large sets its content at the top.
  - name: sortable columns
    values: boolean
    notes: Per column. The glyph sits at the cell's end; unsorted, it shows on hover and focus.
  - name: selectable
    values: [checkbox, radio]
    notes: The kit's Select checkbox and Select radio types. A leading select cell; checkbox adds a select-all in the header that goes indeterminate on a partial selection. Controlled through selectedKeys and onSelectionChange, or left to the table.
  - name: expandable
    notes: The kit's Expandable type. A leading 48px expand cell and the row's content under it; with selectable, the kit's Expandable + Selectable.
  - name: batchActions
    notes: The kit's Batch actions. A primary bar with the count, the caller's primary Buttons and a Cancel that clears the selection, in the toolbar's place while rows are selected.
  - name: zebra
    values: boolean
    notes: The kit's Zebra style. Alternate rows on surface-variant, without the row rules.
  - name: isRowDisabled
    notes: The kit's row cell Disabled. Disabled rows dim, take no hover and cannot be selected.
tokens:
  - name: outline
    usage: The rule at the top of each body row, and under the sticky header.
  - name: surface
    usage: The table's ground, the header block and the pagination bar.
  - name: surface-variant
    usage: The header row (the kit's header row fill), row hover, and zebra rows.
  - name: on-surface
    usage: The title, header text, sort glyphs and the select and expand controls.
  - name: on-surface-variant
    usage: Body cell text, the description and expanded content.
  - name: primary
    usage: The batch actions bar; the focus ring, through the family's focus step; disabled text, through its disabled-content step.
  - name: on-primary
    usage: The batch actions count.
  - name: primary-container
    usage: Selected rows, the kit's selection fill, unchanged on hover.
  - name: text
    usage: Title at 14/24 Medium, header cells at Title/5 SemiBold, body cells at Body/3.
  - name: spacing
    usage: Row heights, cell padding and the header block's inset.
  - name: motion
    usage: The expand chevron's turn.
composition_rules:
  - Data table composes Contained list where a row needs leading or trailing content. Its own row hover is surface-variant, as the kit binds the table's body row; Contained list's is elevation-02, as the kit binds the list. Each follows its own set, so the two are no longer one token (#239).
  - The table is named by its painted title through aria-labelledby, and described by the description through aria-describedby, rather than by a caption element: the kit's header block sits outside the table, above the toolbar.
prohibitions:
  - No table that loses column headers on horizontal scroll — sticky header or a defined responsive collapse pattern is required, not optional.
---

### Data table
- **Slots:** Header row (required), body rows (required, composed from Contained list where a row needs leading/trailing content), optional footer row.
- **Props:** size (xs, sm, md, lg, xl), sortable columns, selectable (checkbox, radio), expandable, batchActions, zebra, isRowDisabled; toolbar and footer slots.
- **Tokens:** `surface-variant` for the header row, row hover and zebra; `outline` for the rule at the top of each row; `on-surface` for header text and `on-surface-variant` for cells; `primary-container` for selected rows and `primary` for the batch bar; the spacing scale for row heights and cell padding.
- **Composition rules:** Composes Contained list for rich cells. Row hover follows the table's own kit set (surface-variant), not the list's.
- **Kit parity** (#239, 2.0.0, a major: `density` gives way to the kit's five size modes, the header row takes surface-variant, the caption becomes a painted title, and the sort glyph moves to the cell's end). Recorded rather than copied: hover, focus and sorted header cells fill surface-variant on a surface-variant row, so they change nothing visible (the glyph carries them); zebra and row hover share surface-variant; selected rows ignore hover; the size modes' padding is drawn around an 18px text frame, so each gives up a pixel a side for the 20px line. The toolbar's Search waits on a governed Search (#240); Skeleton has no counterpart by rule.
- **Prohibitions:** No table that loses column headers on horizontal scroll — sticky header or a defined responsive collapse pattern is required, not optional.
