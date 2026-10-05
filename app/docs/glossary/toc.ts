import type { TocItem } from '@/components/docs-shell'

// The Glossary page's sections, in page order. Lives beside the page so the
// search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#system', label: 'The system' },
  { href: '#color', label: 'Color' },
]
