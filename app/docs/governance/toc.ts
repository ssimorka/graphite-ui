import type { TocItem } from '@/components/docs-shell'

// The Governance page's sections, in page order. Lives beside the page so the
// search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#contracts', label: 'Contracts' },
  { href: '#rules', label: 'The rules' },
  { href: '#kit-canonical', label: 'The kit is canonical' },
  { href: '#governed', label: 'Governed and ungoverned' },
  { href: '#existence', label: 'What should exist' },
  { href: '#checks', label: 'Drift checks' },
  { href: '#ci', label: 'CI and main' },
  { href: '#next-steps', label: 'Next steps' },
]
