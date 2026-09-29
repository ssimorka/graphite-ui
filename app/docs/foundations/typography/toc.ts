import type { TocItem } from '@/components/docs-shell'

// Page order: the shell's scroll-spy takes the first intersecting entry in
// this order as the current one.
export const TOC: TocItem[] = [
  { href: '#scale', label: 'Type scale' },
  { href: '#modes', label: 'Desktop and Mobile' },
  { href: '#families', label: 'Families' },
  { href: '#weights', label: 'Weights' },
  { href: '#components', label: 'How components use it' },
  { href: '#rules', label: 'Rules' },
  { href: '#next-steps', label: 'Next steps' },
]
