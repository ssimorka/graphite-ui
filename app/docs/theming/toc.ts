import type { TocItem } from '@/components/docs-shell'

// Page order, and it has to stay that way: the shell's scroll-spy takes the
// first intersecting entry in this order as the current one.
export const TOC: TocItem[] = [
  { href: '#how-it-works', label: 'How color works' },
  { href: '#roles', label: 'Color roles' },
  { href: '#hierarchy', label: 'Color hierarchy' },
  { href: '#themes', label: 'Themes' },
  { href: '#states', label: 'Interaction states' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#usage', label: 'Usage' },
  { href: '#tokens', label: 'Tokens' },
  { href: '#patterns', label: 'Pattern reference' },
  { href: '#glossary', label: 'Glossary' },
  { href: '#next-steps', label: 'Next steps' },
]
