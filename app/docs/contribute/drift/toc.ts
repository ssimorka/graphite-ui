import type { TocItem } from '@/components/docs-shell'

// The Snapshots and drift page's sections, in page order. Lives beside the
// page so the search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#token-snapshot', label: 'Token snapshot' },
  { href: '#code-syntax', label: 'Dev Mode names' },
  { href: '#color', label: 'Color against the kit' },
  { href: '#limits', label: 'What the checks cannot see' },
]
