import type { TocItem } from '@/components/docs-shell'

// The Accessibility page's sections, in page order. Lives beside the page so
// the search index can import it without importing the page.
export const TOC: TocItem[] = [
  { href: '#targets', label: 'Contrast targets' },
  { href: '#pairings', label: 'Pairings' },
  { href: '#verification', label: 'Verification' },
  { href: '#focus', label: 'Focus' },
  { href: '#motion', label: 'Motion' },
  { href: '#keyboard', label: 'Keyboard' },
  { href: '#color-alone', label: 'Color never works alone' },
  { href: '#known-gaps', label: 'Known gaps' },
  { href: '#next-steps', label: 'Next steps' },
]
