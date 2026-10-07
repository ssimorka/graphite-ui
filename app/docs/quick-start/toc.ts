import type { TocItem } from '@/components/docs-shell'

// The Quick start page's sections, in page order. Lives beside the page so the
// search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#before', label: 'Before you start' },
  { href: '#get-the-theme', label: 'Add the theme' },
  { href: '#fonts', label: 'Load the fonts' },
  { href: '#add-it', label: 'Import the theme' },
  { href: '#tailwind', label: 'Use Tailwind (optional)' },
  { href: '#style', label: 'Style with the roles' },
  { href: '#switch-theme', label: 'Switch theme' },
  { href: '#add-a-component', label: 'Add a component' },
  { href: '#next-steps', label: 'Next steps' },
]
