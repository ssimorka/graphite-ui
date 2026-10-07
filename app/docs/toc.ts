import type { TocItem } from '@/components/docs-shell'

// Page order, which the shell's scroll-spy relies on: it takes the first
// intersecting entry in this order as the current one.
export const TOC: TocItem[] = [
  { href: '#use-today', label: 'What you can use today' },
  { href: '#what-it-is', label: 'What Graphite is' },
  { href: '#built-from', label: 'What it is built from' },
  { href: '#governance', label: 'How it is governed' },
  { href: '#help', label: 'Updates and help' },
  { href: '#whats-here', label: 'What is here' },
]
