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
      'Rows of records in shared columns, with a caption, sticky header and sortable columns. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
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
        footer={`${few.length} of ${rows.length} components`}
      />
    ),
    anatomyLede:
      'A caption, a header row, body rows and an optional footer. The caption is a required prop, and the first column here returns a Contained list from its render function, which is how a row gets leading or trailing content.',
    variantsLede:
      'Density sets cell padding from the density steps. Sortable is a trait of each column rather than of the table, so a table can sort by name and not by notes.',
    variants: [
      { label: 'Density: Default', node: <DataTableSample rows={few} /> },
      { label: 'Density: Compact', node: <DataTableSample rows={few} density="compact" /> },
      {
        label: 'Sortable columns: True',
        node: <DataTableSample rows={few} sortable sort={{ key: 'component', direction: 'asc' }} />,
      },
    ],
    statesLede:
      'Rows and sortable headers take the same hover as Contained list, one tone step from surface to surface-variant. The sorted column is marked by an arrow in primary and by aria-sort, never by colour alone.',
    states: [
      { label: 'Enabled', node: <DataTableSample rows={few.slice(0, 1)} sortable /> },
      { label: 'Hover', node: <DataTableSample rows={few.slice(0, 1)} sortable />, className: styles.forceHover },
      { label: 'Focus', node: <DataTableSample rows={few.slice(0, 1)} sortable />, className: styles.forceFocus },
      {
        label: 'Sorted',
        node: <DataTableSample rows={few.slice(0, 1)} sortable sort={{ key: 'component', direction: 'desc' }} />,
      },
    ],
    dos: [
      'Write a caption that names the records, like “Open invoices”, not “Table”. It is what a screen reader announces first.',
      'Mark a column sortable only when its order means something. Dates and amounts, yes; a free-text notes column, no.',
      'Return a Contained list from a column’s render when a cell needs a leading marker or a trailing control.',
      'Give the table a container with a set height when it should scroll vertically. The header then sticks inside it.',
    ],
    donts: [
      'Mark a column sortable and leave out onSortChange. The header renders as plain text and the column silently cannot sort.',
      'Wrap the table in an overflow container of your own. The scroll lives inside the component, and a second one fights the sticky header.',
      'Give rows a hover colour of their own. It is surface-variant, shared with Contained list, so the two cannot drift.',
      'Use a table for data with one meaningful column. That is a list, and Contained list says so with less.',
    ],
    a11y: [
      ['Caption', <>The caption is a required prop, rendered as a visible <code>caption</code> element, so every table has an accessible name.</>],
      ['Roles', <>It is a native <code>table</code>. Header cells are <code>th scope=&quot;col&quot;</code>, and the sorted column carries <code>aria-sort</code>.</>],
      ['Keyboard', 'Sortable headers are buttons, so Tab reaches them and Enter or Space sorts. Rows are not focusable; put links or buttons in cells when a row should act.'],
      ['Focus', <>The sort button’s ring is <code>--graphite-focus</code>, offset outside the label.</>],
      ['Sort state', 'The arrow is hidden from assistive tech, because aria-sort already says ascending or descending. Sighted readers get the arrow as well as its primary colour.'],
      ['Scrolling', 'A wide table scrolls horizontally inside its own container, and the header scrolls with its columns, so no column loses its label.'],
    ],
    parityLede:
      'The kit draws the table and each of its cells, eleven public sets in all. The code is one component whose cells are composed by the caller, so most rows below are sets without a prop rather than props without a set.',
    parity: [
      ['Type', 'Default · Expandable · Select checkbox · Select radio · Expandable + Selectable · Batch actions', '—', 'The code draws Default. Expansion, row selection and batch actions have no counterpart yet.'],
      ['Skeleton', 'False · True', '—', 'No loading state. A caller that loads rows decides what to show meanwhile.'],
      ['Size', 'Extra large', 'density', 'The header and body row sets draw one size. The code has two density steps of cell padding.'],
      ['Sortable', 'False · True', 'columns[].sortable', 'One to one, per column, on the header cell.'],
      ['Sorted', 'None · Ascending · Descending', 'sort', 'Runtime state. The caller holds it and passes it back; onSortChange reports which header was pressed.'],
      ['State', 'Enabled · Hover · Focus', '—', 'Pseudo-classes in code (governance rule 7). Hover is surface-variant on rows and sortable headers; Focus is the sort button’s ring.'],
      ['Toolbar, batch actions', 'Separate sets', '—', 'No counterpart. A toolbar above the table is the caller’s composition.'],
    ],
    related: [
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'the row it is built from' },
      { href: '/docs/components/tag', title: 'Tag', why: 'a status in a cell' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when a row needs several actions' },
    ],
  }
}
