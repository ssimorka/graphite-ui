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
    // /gallery is the Components index; every governed component has a page
    // under /docs/components, rendered from its contract. Listed by hand, not
    // read from the registry, because this file is imported by the client
    // shell and the registry reads the repo. A missing entry here is a page
    // with no sidebar link, not a broken build.
    label: 'Components',
    items: [
      { href: '/gallery', label: 'Overview' },
      { href: '/docs/components/accordion', label: 'Accordion' },
      { href: '/docs/components/breadcrumb', label: 'Breadcrumb' },
      { href: '/docs/components/button', label: 'Button' },
      { href: '/docs/components/button-group', label: 'Button group' },
      { href: '/docs/components/checkbox', label: 'Checkbox' },
      { href: '/docs/components/contained-list', label: 'Contained list' },
      { href: '/docs/components/data-table', label: 'Data table' },
      { href: '/docs/components/menu', label: 'Menu' },
      { href: '/docs/components/modal', label: 'Modal' },
      { href: '/docs/components/navigation-menu', label: 'Navigation menu' },
      { href: '/docs/components/notification', label: 'Notification' },
      { href: '/docs/components/overlay', label: 'Overlay' },
      { href: '/docs/components/popover', label: 'Popover' },
      { href: '/docs/components/progress-bar', label: 'Progress bar' },
      { href: '/docs/components/radio-button-group', label: 'Radio button group' },
      { href: '/docs/components/select', label: 'Select' },
      { href: '/docs/components/tabs', label: 'Tabs' },
      { href: '/docs/components/tag', label: 'Tag' },
      { href: '/docs/components/text-area', label: 'Text area' },
      { href: '/docs/components/text-input', label: 'Text input' },
      { href: '/docs/components/toggle', label: 'Toggle' },
      { href: '/docs/components/tooltip', label: 'Tooltip' },
      { href: '/docs/components/typography', label: 'Typography' },
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
