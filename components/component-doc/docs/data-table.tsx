import { readContractDoc } from '@/lib/contract-doc'
import type { ComponentDocConfig } from '../types'
import styles from './data-table.module.scss'
import { DataTablePreview, DataTableSample } from './data-table-preview'
import type { DemoRow } from './data-table-preview'

// The demo rows are real: each is read from its own contract, so the table on
// this page cannot show a version the contract has moved on from.
const SLUGS = ['accordion', 'button', 'contained-list', 'data-table', 'notification', 'tabs']

export function dataTableDoc(): ComponentDocConfig {
  const rows: DemoRow[] = SLUGS.map((slug) => {
    const c = readContractDoc(slug)
    return { component: c.component, wave: c.wave || '—', version: c.version }
  })
  const few = rows.slice(0, 2)

  return {
    slug: 'data-table',
    name: 'Data table',
    kitTitle: 'Data table',
    figmaNode: '4630:268268',
    lede: 'Rows of records laid out in shared columns, so a reader can compare them and sort by what matters. Use it when the columns are the point; a list with one meaningful value per row is a Contained list.',
    description:
      'Rows of records in shared columns, with a title, sticky header, sortable columns, selection, expansion and batch actions. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Wave 6, and not yet used outside these docs. The gallery card shows two Contained list rows, the primitive it is built from.',
    livePreview: <DataTablePreview rows={rows} />,
    install:
      "import { DataTable } from '@/components/ui/data-table'\nimport type { Column, Sort } from '@/components/ui/data-table'",
    anatomy: (
      <DataTableSample
        rows={few}
        withRow
        sortable
        sort={{ key: 'component', direction: 'asc' }}
        description="Read from each component's own contract."
        footer={`${few.length} of ${rows.length} components`}
      />
    ),
    anatomyLede:
      'The title (the required caption) and an optional description above; a toolbar when there is one; the surface-variant header row; body rows with a rule at the top of each; and the footer bar for pagination. The first column here returns a Contained list from its render function, which is how a row gets leading or trailing content.',
    variantsLede:
      'Size is the kit’s five modes: rows of 24, 32, 40, 48 and 64. Type is what the rows carry: a select checkbox or radio, an expand control, both, or batch actions on a selection. Sortable is a trait of each column rather than of the table.',
    variants: [
      { label: 'Size: Extra small', node: <DataTableSample rows={few} size="xs" /> },
      { label: 'Size: Small', node: <DataTableSample rows={few} size="sm" /> },
      { label: 'Size: Medium', node: <DataTableSample rows={few} size="md" /> },
      { label: 'Size: Large', node: <DataTableSample rows={few} size="lg" /> },
      { label: 'Size: Extra large', node: <DataTableSample rows={few} size="xl" /> },
      { label: 'Type: Select checkbox', node: <DataTableSample rows={few} kind="checkbox" selectedFirst /> },
      { label: 'Type: Select radio', node: <DataTableSample rows={few} kind="radio" selectedFirst /> },
      { label: 'Type: Expandable', node: <DataTableSample rows={few} kind="expandable" /> },
      { label: 'Type: Expandable + Selectable', node: <DataTableSample rows={few} kind="expandable-select" /> },
      { label: 'Type: Batch actions', node: <DataTableSample rows={few} kind="batch" /> },
      { label: 'Toolbar', node: <DataTableSample rows={few} toolbar /> },
      { label: 'Zebra', node: <DataTableSample rows={rows.slice(0, 4)} zebra /> },
      {
        label: 'Sortable columns: True',
        node: <DataTableSample rows={few} sortable sort={{ key: 'component', direction: 'asc' }} />,
      },
    ],
    statesLede:
      'Rows hover to surface-variant, as the kit binds the table’s row. Header cells take surface-variant too on hover and when sorted, which is the header row’s own fill, so the glyph is what shows it: the sort glyph at the cell’s end, and aria-sort, never colour alone. Selected rows are primary-container; a disabled row dims and cannot be selected.',
    states: [
      { label: 'Enabled', node: <DataTableSample rows={few.slice(0, 1)} sortable /> },
      { label: 'Hover', node: <DataTableSample rows={few.slice(0, 1)} sortable />, className: styles.forceHover },
      { label: 'Focus', node: <DataTableSample rows={few.slice(0, 1)} sortable />, className: styles.forceFocus },
      {
        label: 'Sorted',
        node: <DataTableSample rows={few.slice(0, 1)} sortable sort={{ key: 'component', direction: 'desc' }} />,
      },
      { label: 'Selected', node: <DataTableSample rows={few} kind="checkbox" selectedFirst /> },
      { label: 'Disabled row', node: <DataTableSample rows={few} kind="checkbox" disabledFirst /> },
    ],
    dos: [
      'Write a caption that names the records, like “Open invoices”, not “Table”. It is painted as the title and is what a screen reader announces first.',
      'Mark a column sortable only when its order means something. Dates and amounts, yes; a free-text notes column, no.',
      'Return a Contained list from a column’s render when a cell needs a leading marker or a trailing control.',
      'Give the table a container with a set height when it should scroll vertically. The header then sticks inside it.',
    ],
    donts: [
      'Mark a column sortable and leave out onSortChange. The header renders as plain text and the column silently cannot sort.',
      'Wrap the table in an overflow container of your own. The scroll lives inside the component, and a second one fights the sticky header.',
      'Give rows a hover colour of their own. It is surface-variant, as the kit binds the table’s row.',
      'Use a table for data with one meaningful column. That is a list, and Contained list says so with less.',
    ],
    a11y: [
      ['Caption', <>The caption is a required prop, painted as the title above the table and tied to it with <code>aria-labelledby</code>; the description with <code>aria-describedby</code>.</>],
      ['Roles', <>It is a native <code>table</code>. Header cells are <code>th scope=&quot;col&quot;</code>, and the sorted column carries <code>aria-sort</code>.</>],
      ['Keyboard', 'Sortable headers are buttons, so Tab reaches them and Enter or Space sorts. Rows are not focusable; put links or buttons in cells when a row should act.'],
      ['Focus', <>The sort button fills its cell, and its ring is a 2px <code>--graphite-primary-focus</code> inside it.</>],
      ['Sort state', 'The glyph is hidden from assistive tech, because aria-sort already says ascending or descending. Unsorted, it shows on hover and focus.'],
      ['Selection', <>Each select control is named for its row (“Select Button”), and the header’s select-all goes <code>indeterminate</code> on a partial selection. Rows carry <code>aria-selected</code>. Disabled rows cannot be selected.</>],
      ['Expansion', <>The expand button is named for its row and carries <code>aria-expanded</code> and <code>aria-controls</code>.</>],
      ['Batch actions', 'The bar appears while rows are selected, announces the count politely, and its Cancel clears the selection.'],
      ['Scrolling', 'A wide table scrolls horizontally inside its own container, and the header scrolls with its columns, so no column loses its label.'],
    ],
    parityLede:
      'The kit draws the table and each of its cells, eleven public sets in all. The code is one component; its props cover the Types and the size modes, and the caller composes the cells.',
    parity: [
      ['Type', 'Default · Expandable · Select checkbox · Select radio · Expandable + Selectable · Batch actions', 'selectable · expandable · batchActions', 'Each one: a select cell (checkbox with a select-all, or radio), a 48px expand cell with its content row, both together, and the primary batch bar in the toolbar’s place while rows are selected.'],
      ['Skeleton', 'False · True', '—', 'No counterpart by rule. A caller that loads rows decides what to show meanwhile.'],
      ['Size', 'XS · SM · MD · LG · XL (variable modes)', 'size', 'Rows of 24, 32, 40, 48 and 64, cells padded 16 left and 8 right. The set draws one size; the modes are its variables.'],
      ['Header item: Description', 'Boolean', 'description', 'Body/3 under the title.'],
      ['Toolbar', 'Boolean', 'toolbar', 'A 48px bar of the caller’s controls: the governed Search, expandable at Large, then the actions.'],
      ['Pagination', 'Boolean', 'footer', 'The bar under the table.'],
      ['Body row: Zebra style', 'Boolean', 'zebra', 'Alternate rows on surface-variant, without the rules. The kit’s zebra and hover share that fill.'],
      ['Row cell: Disabled', 'State', 'isRowDisabled', 'The row dims and cannot be selected.'],
      ['Sortable', 'False · True', 'columns[].sortable', 'One to one, per column, on the header cell.'],
      ['Sorted', 'None · Ascending · Descending', 'sort', 'Runtime state. The caller holds it and passes it back; onSortChange reports which header was pressed.'],
      ['State', 'Enabled · Hover · Focus', '—', 'Pseudo-classes in code (governance rule 7). Hover is surface-variant on rows; on header cells it matches the header row, so nothing changes but the glyph. Focus is the sort button’s ring, inside the cell.'],
      ['Selected row', 'primaryContainer', '—', 'The fill, unchanged on hover, as the kit draws it.'],
    ],
    related: [
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'the row it is built from' },
      { href: '/docs/components/tag', title: 'Tag', why: 'a status in a cell' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when a row needs several actions' },
    ],
  }
}
