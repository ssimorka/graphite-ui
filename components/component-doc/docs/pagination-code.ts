import type { Example } from '../example-file'

// Pagination's Code tab: the nav or the table bar, with the page state it
// reports into.

export const FORMS = ['nav', 'advanced', 'simple', 'unbound'] as const
export type Form = (typeof FORMS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]

export const controls = { form: FORMS, size: SIZES }

export function exampleFor({ form, size }: { form: Form; size: Size }): Example {
  const sizeProp = size === 'lg' ? [] : [`  size="${size}"`]
  if (form === 'nav') {
    return {
      imports: { react: ['useState'], '@/components/ui/pagination': ['PaginationNav'] },
      body: 'const [page, setPage] = useState(1)',
      jsx: `<PaginationNav\n${[...sizeProp, '  page={page}', '  totalPages={30}', '  onChange={setPage}'].join('\n')}\n/>`,
    }
  }
  const props = [
    ...(form === 'advanced' ? [] : [`  type="${form}"`]),
    ...sizeProp,
    '  page={page}',
    '  pageSize={pageSize}',
    // Unbound knows no total, only whether a next page exists.
    form === 'unbound' ? '  hasNext={page < 5}' : '  totalItems={243}',
    '  onChange={set}',
  ]
  return {
    imports: { react: ['useState'], '@/components/ui/pagination': ['Pagination'] },
    body: 'const [{ page, pageSize }, set] = useState({ page: 1, pageSize: 20 })',
    jsx: `<Pagination\n${props.join('\n')}\n/>`,
  }
}
