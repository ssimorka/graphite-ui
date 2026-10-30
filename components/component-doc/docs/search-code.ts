import type { Example } from '../example-file'

// Search's Code tab: real state, so the clear and Escape work when pasted.

export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]
export const LAYOUTS = ['default', 'fluid'] as const
export type Layout = (typeof LAYOUTS)[number]

export const LABEL = 'Search components'

export const controls = { size: SIZES, layout: LAYOUTS, expandable: [false, true] }

export function exampleFor({ size, layout, expandable }: { size: Size; layout: Layout; expandable: boolean }): Example {
  const props = [
    `  label="${LABEL}"`,
    '  placeholder="Search components"',
    ...(layout === 'fluid' ? ['  layout="fluid"'] : size === 'lg' ? [] : [`  size="${size}"`]),
    ...(expandable && layout === 'default' ? ['  expandable'] : []),
    '  value={query}',
    '  onChange={setQuery}',
  ]
  return {
    imports: { react: ['useState'], '@/components/ui/search': ['Search'] },
    body: "const [query, setQuery] = useState('')",
    jsx: `<Search\n${props.join('\n')}\n/>`,
  }
}
