import type { TocItem } from '@/components/docs-shell'

// The Quick start page's sections, in page order. Lives beside the page so the
// search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#get-the-theme', label: 'Get the theme' },
  { href: '#add-it', label: 'Add it to your project' },
  { href: '#tailwind', label: 'Use Tailwind' },
  { href: '#style', label: 'Style with the roles' },
  { href: '#switch-theme', label: 'Switch theme' },
  { href: '#add-a-component', label: 'Add a component' },
  { href: '#next-steps', label: 'Next steps' },
]
