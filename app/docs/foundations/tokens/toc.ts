import type { TocItem } from '@/components/docs-shell'

// Page order: the shell's scroll-spy takes the first intersecting entry in
// this order as the current one.
export const TOC: TocItem[] = [
  { href: '#layers', label: 'Three layers' },
  { href: '#color-roles', label: 'Color roles' },
  { href: '#states', label: 'Interaction states' },
  { href: '#foundations', label: 'Foundation tokens' },
  { href: '#carbon', label: 'Carbon compatibility' },
  { href: '#export', label: 'Exporting' },
  { href: '#snapshot', label: 'Snapshot and drift' },
  { href: '#next-steps', label: 'Next steps' },
]
