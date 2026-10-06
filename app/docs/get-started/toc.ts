import type { TocItem } from '@/components/docs-shell'

// The Get started page's sections, in page order. Lives beside the page so the
// search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#theme', label: 'Theme' },
  { href: '#figma-kit', label: 'Figma kit' },
  { href: '#components', label: 'Components' },
]
