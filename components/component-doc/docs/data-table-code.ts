import type { Sort } from '@/components/ui/data-table'
import type { Example } from '../example-file'

// Data table's Code tab, from Type, Size and Sortable columns, plus the sort
// the reader has clicked to. Sorting and paging are the caller's: the table
// renders the rows it is given. The rows arrive from the page (each read from
// its contract), so the check builds from a sample of the same shape.

export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type Size = (typeof SIZES)[number]
export const KINDS = ['default', 'checkbox', 'radio', 'expandable', 'expandable-select', 'batch'] as const
export type Kind = (typeof KINDS)[number]
export type DemoRow = { component: string; wave: string; version: string }

export const CAPTION = 'Governed components'
export const DESCRIPTION = "Read from each component's own contract."
export const HEADERS: [keyof DemoRow, string][] = [
  ['component', 'Component'],
  ['wave', 'Wave'],
  ['version', 'Contract'],
]
export const PAGE_SIZES = [5, 10, 20]

export const DETAIL = (row: DemoRow) => `${row.component} is on contract ${row.version}, wave ${row.wave}.`

const SAMPLE: DemoRow[] = [
  { component: 'Accordion', wave: '1', version: '1.2.0' },
  { component: 'Button', wave: '1', version: '3.0.0' },
]

export const controls = {
  size: SIZES,
  kind: KINDS,
  sortable: [true, false],
  sort: [
    { key: 'component', direction: 'asc' },
    { key: 'version', direction: 'desc' },
  ] as Sort[],
  rows: [SAMPLE],
}

type Values = { size: Size; kind: Kind; sortable: boolean; sort: Sort; rows: DemoRow[] }

export function exampleFor({ size, kind, sortable, sort, rows }: Values): Example {
  const select =
    kind === 'checkbox' || kind === 'batch' || kind === 'expandable-select' ? 'checkbox' : kind === 'radio' ? 'radio' : null
  const expand = kind === 'expandable' || kind === 'expandable-select'
  const data = rows
    .map((r) => `  { component: '${r.component}', wave: '${r.wave}', version: '${r.version}' },`)
    .join('\n')
  const module = [
    'type Row = { component: string; wave: string; version: string }',
    '',
    `const rows: Row[] = [\n${data}\n]`,
    ...(sortable
      ? [
          '',
          '// The table renders rows in the order it is given, so sorting is yours.',
          'function sortRows(list: Row[], sort: Sort) {',
          '  const key = sort.key as keyof Row',
          '  const out = [...list].sort((a, b) => a[key].localeCompare(b[key], undefined, { numeric: true }))',
          "  return sort.direction === 'asc' ? out : out.reverse()",
          '}',
        ]
      : []),
  ].join('\n')
  const body = [
    ...(sortable ? [`const [sort, setSort] = useState<Sort>({ key: '${sort.key}', direction: '${sort.direction}' })`] : []),
    'const [paging, setPaging] = useState({ page: 1, pageSize: 5 })',
    `const ordered = ${sortable ? 'sortRows(rows, sort)' : 'rows'}`,
    'const first = (paging.page - 1) * paging.pageSize',
  ].join('\n')
  const cols = HEADERS.map(
    ([key, header]) => `    { key: '${key}', header: '${header}'${sortable ? ', sortable: true' : ''} },`,
  ).join('\n')
  const props = [
    `  caption="${CAPTION}"`,
    `  description="${DESCRIPTION}"`,
    ...(size === 'lg' ? [] : [`  size="${size}"`]),
    ...(select ? [`  selectable="${select}"`] : []),
    ...(expand ? ['  expandable={(row) => (', '    <p>', '      {row.component} is on contract {row.version}, wave {row.wave}.', '    </p>', '  )}'] : []),
    ...(kind === 'batch'
      ? ['  batchActions={() => (', '    <Button variant="primary">', '      Archive <KitIcon name="trash" />', '    </Button>', '  )}']
      : []),
    '  columns={[',
    cols,
    '  ]}',
    '  rows={ordered.slice(first, first + paging.pageSize)}',
    '  getRowKey={(row) => row.component}',
    ...(sortable
      ? [
          '  sort={sort}',
          '  onSortChange={(key) =>',
          "    setSort((s) => ({ key, direction: s.key === key && s.direction === 'asc' ? 'desc' : 'asc' }))",
          '  }',
        ]
      : []),
    '  footer={',
    '    <Pagination',
    '      page={paging.page}',
    '      pageSize={paging.pageSize}',
    `      pageSizes={[${PAGE_SIZES.join(', ')}]}`,
    '      totalItems={rows.length}',
    '      onChange={setPaging}',
    '    />',
    '  }',
  ]
  const imports: Example['imports'] = {
    react: ['useState'],
    '@/components/ui/data-table': sortable ? ['DataTable', 'type Sort'] : ['DataTable'],
    '@/components/ui/pagination': ['Pagination'],
  }
  if (kind === 'batch') {
    imports['@/components/ui/button'] = ['Button']
    imports['@/components/kit-icon'] = ['KitIcon']
  }
  return { imports, module, body, jsx: `<DataTable\n${props.join('\n')}\n/>` }
}
