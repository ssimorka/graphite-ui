import type { Example } from '../example-file'

// Link's Code tab, from Style, Size, Inverse and Disabled. An inline link is
// shown in the sentence it sits in, and takes its size from that text.

export const KINDS = ['icon', 'standalone', 'inline'] as const
export type Kind = (typeof KINDS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]

export const controls = { kind: KINDS, size: SIZES, inverse: [false, true], disabled: [false, true] }

type Values = { kind: Kind; size: Size; inverse: boolean; disabled: boolean }

export function exampleFor({ kind, size, inverse, disabled }: Values): Example {
  const props = [
    size === 'lg' || kind === 'inline' ? '' : ` size="${size}"`,
    kind === 'icon' ? ' icon="arrow-right"' : '',
    kind === 'inline' ? ' inline' : '',
    inverse ? ' inverse' : '',
    disabled ? ' disabled' : '',
  ].join('')
  const link = `<Link href="/docs/components"${props}>\n  ${kind === 'inline' ? 'every component' : 'View all components'}\n</Link>`
  return {
    imports: { '@/components/ui/link': ['Link'] },
    jsx: kind === 'inline' ? `<p>\n  Read about ${link.replace(/\n/g, '\n  ')} in the gallery.\n</p>` : link,
  }
}
