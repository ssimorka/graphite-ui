import type { TocItem } from '@/components/docs-shell'

// The Carbon migration page's sections, in page order. Lives beside the page
// so the search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#what-remains', label: 'What still uses Carbon' },
  { href: '#compatibility', label: 'The --cds-* layer' },
  { href: '#plan', label: 'The plan' },
]
