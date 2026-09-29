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
      // The color essay: how a source becomes ramps and roles. It was labelled
      // Color until Foundations gave that name to the ramps page; the kit's
      // Installation next-steps card already calls it Theming.
      { href: '/docs', label: 'Theming' },
    ],
  },
  {
    label: 'Foundations',
    items: [{ href: '/docs/foundations/color', label: 'Color' }],
  },
  {
    // /gallery is the Components index until S3 adds /docs/components/[slug].
    // It renders inside this shell, so the sidebar is how you get back to it.
    label: 'Components',
    items: [
      { href: '/gallery', label: 'Overview' },
      { href: '/docs/components/accordion', label: 'Accordion' },
    ],
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
