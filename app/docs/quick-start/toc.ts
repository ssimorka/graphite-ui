import type { TocItem } from '@/components/docs-shell'

// Page order, which the shell's scroll-spy relies on: it takes the first
// intersecting entry in this order as the current one.
export const TOC: TocItem[] = [
  { href: '#run-it', label: 'Run it' },
  { href: '#pick-a-color', label: 'Pick a source color' },
  { href: '#use-a-component', label: 'Use a component' },
  { href: '#style', label: 'Style with the variables' },
  { href: '#switch-theme', label: 'Switch theme' },
  { href: '#take-the-tokens', label: 'Take the tokens out' },
  { href: '#next-steps', label: 'Next steps' },
]
