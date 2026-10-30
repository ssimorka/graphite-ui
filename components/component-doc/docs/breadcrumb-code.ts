import type { Crumb } from '@/components/ui/breadcrumb'
import type { Example } from '../example-file'

// Breadcrumb's Code tab, from Length and Max items.

// Six levels of a plausible product, deepest last. The trail takes the first
// n of them, so the last one shown is always the page "you are on".
const LEVELS = ['Home', 'Projects', 'Graphite', 'Settings', 'Members', 'Invitations']

export const LENGTHS = [2, 4, 6] as const
export const MAX_ITEMS = [3, 4, 6] as const

export function trail(length: number): [Crumb, ...Crumb[]] {
  const labels = LEVELS.slice(0, length)
  return labels.map((label, i) => (i === labels.length - 1 ? { label } : { label, href: '#' })) as [
    Crumb,
    ...Crumb[],
  ]
}

export const controls = { length: LENGTHS, maxItems: MAX_ITEMS }

export function exampleFor({ length, maxItems }: { length: number; maxItems: number }): Example {
  const rows = trail(length)
    .map((c) => (c.href ? `    { label: '${c.label}', href: '${c.href}' },` : `    { label: '${c.label}' },`))
    .join('\n')
  const max = maxItems === 4 ? '' : `\n  maxItems={${maxItems}}`
  return {
    imports: { '@/components/ui/breadcrumb': ['Breadcrumb'] },
    jsx: `<Breadcrumb\n  items={[\n${rows}\n  ]}${max}\n/>`,
  }
}
