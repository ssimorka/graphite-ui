import type { TocItem } from '@/components/docs-shell'

// Page order: the shell's scroll-spy takes the first intersecting entry in
// this order as the current one.
export const TOC: TocItem[] = [
  { href: '#layers', label: 'Two layers' },
  { href: '#color-roles', label: 'Color roles' },
  { href: '#states', label: 'Interaction states' },
  { href: '#ladders', label: 'Elevation and outline' },
  { href: '#foundations', label: 'Foundation tokens' },
  { href: '#export', label: 'Exporting' },
  { href: '#next-steps', label: 'Next steps' },
]
