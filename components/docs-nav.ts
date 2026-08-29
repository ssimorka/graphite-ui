// The docs sidebar and the /docs table of contents, in one place because two
// pages and (from S2) every component page read them.
//
// Plain data, no 'use client': imported by both server page components and the
// client shell.

import type { DocsNavGroup, TocItem } from '@/components/docs-shell'

export const DOCS_NAV: DocsNavGroup[] = [
  {
    label: 'Getting started',
    items: [
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs', label: 'Color' },
    ],
  },
  {
    // Points at /gallery until S3 replaces it with /docs/components/[slug].
    // Listed rather than left out because the sidebar is how you reach the
    // components at all once the header nav is the only other route to them.
    label: 'Components',
    items: [{ href: '/gallery', label: 'Overview' }],
  },
]

// Page order, and it has to stay that way: the shell's scroll-spy takes the
// first intersecting entry in this order as the current one.
export const COLOR_DOCS_TOC: TocItem[] = [
  { href: '#how-it-works', label: 'How color works' },
  { href: '#roles', label: 'Color roles' },
  { href: '#hierarchy', label: 'Color hierarchy' },
  { href: '#themes', label: 'Themes' },
  { href: '#states', label: 'Interaction states' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#usage', label: 'Usage' },
  { href: '#tokens', label: 'Tokens' },
  // Pattern reference and Glossary are sibling sections on the page rather
  // than part of ColorDocs, so they are listed by hand in page order.
  { href: '#patterns', label: 'Pattern reference' },
  { href: '#glossary', label: 'Glossary' },
]
