// The docs sidebar and the /docs table of contents, in one place because two
// pages and (from S2) every component page read them.
//
// Plain data, no 'use client': imported by both server page components and the
// client shell.

import type { DocsNavGroup, TocItem } from '@/components/docs-shell'
import type { Crumb } from '@/components/ui/breadcrumb'

export const DOCS_NAV: DocsNavGroup[] = [
  {
    // Everything an adopter needs, and nothing about how Graphite is
    // maintained. That lives under Contribute, at the end of the sidebar.
    label: 'Use',
    items: [
      { href: '/docs', label: 'Introduction' },
      { href: '/docs/quick-start', label: 'Quick start' },
      // The color essay: how a source becomes ramps and roles. The kit's
      // Installation next-steps card calls it Theming.
      { href: '/docs/theming', label: 'Theming' },
      { href: '/docs/accessibility', label: 'Accessibility' },
      { href: '/docs/glossary', label: 'Glossary' },
    ],
  },
  {
    label: 'Foundations',
    items: [
      { href: '/docs/foundations/color', label: 'Color' },
      { href: '/docs/foundations/typography', label: 'Typography' },
      { href: '/docs/foundations/spacing', label: 'Spacing' },
      { href: '/docs/foundations/radius', label: 'Radius' },
      { href: '/docs/foundations/layout', label: 'Layout & grid' },
      { href: '/docs/foundations/tokens', label: 'Tokens' },
    ],
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
      { href: '/docs/components/checkbox-group', label: 'Checkbox group' },
      { href: '/docs/components/contained-list', label: 'Contained list' },
      { href: '/docs/components/data-table', label: 'Data table' },
      { href: '/docs/components/date-picker', label: 'Date picker' },
      { href: '/docs/components/dropdown', label: 'Dropdown' },
      { href: '/docs/components/file-uploader', label: 'File uploader' },
      { href: '/docs/components/link', label: 'Link' },
      { href: '/docs/components/menu', label: 'Menu' },
      { href: '/docs/components/menu-button', label: 'Menu buttons' },
      { href: '/docs/components/modal', label: 'Modal' },
      { href: '/docs/components/navigation-menu', label: 'Navigation menu' },
      { href: '/docs/components/notification', label: 'Notification' },
      { href: '/docs/components/number-input', label: 'Number input' },
      { href: '/docs/components/pagination', label: 'Pagination' },
      { href: '/docs/components/password-input', label: 'Password input' },
      { href: '/docs/components/popover', label: 'Popover' },
      { href: '/docs/components/progress-bar', label: 'Progress bar' },
      { href: '/docs/components/radio-button-group', label: 'Radio button group' },
      { href: '/docs/components/search', label: 'Search' },
      { href: '/docs/components/select', label: 'Select' },
      { href: '/docs/components/slider', label: 'Slider' },
      { href: '/docs/components/tabs', label: 'Tabs' },
      { href: '/docs/components/tag', label: 'Tag' },
      { href: '/docs/components/text-area', label: 'Text area' },
      { href: '/docs/components/text-input', label: 'Text input' },
      { href: '/docs/components/time-picker', label: 'Time picker' },
      { href: '/docs/components/toast', label: 'Toast' },
      { href: '/docs/components/toggle', label: 'Toggle' },
      { href: '/docs/components/tooltip', label: 'Tooltip' },
      { href: '/docs/components/tree-view', label: 'Tree view' },
      { href: '/docs/components/typography', label: 'Typography' },
      // Governed by a contract but not a component: the dismissal hook the
      // overlays share. Last, and labelled, so the list above is the 36.
      { href: '/docs/components/overlay', label: 'Overlay (hook)' },
    ],
  },
  {
    // How Graphite is built and kept honest: running it, the rules, the
    // snapshots and the Carbon migration. Not needed to use it.
    label: 'Contribute',
    items: [
      { href: '/docs/contribute/run-locally', label: 'Run Graphite locally' },
      { href: '/docs/contribute/governance', label: 'Governance' },
      { href: '/docs/contribute/drift', label: 'Snapshots and drift' },
      { href: '/docs/contribute/carbon', label: 'Carbon migration' },
      { href: '/docs/contribute/status', label: 'Status' },
    ],
  },
]

/**
 * A docs page's breadcrumb trail, read from DOCS_NAV so it cannot name a group
 * or page the sidebar does not. A group crumb goes to the group's first page,
 * as Components goes to its Overview, so every crumb before "here" is a real
 * link. Every page shows the full trail, Introduction included, even though
 * there Docs and Getting started both lead back to /docs: the trail says where
 * the page sits, and a one-crumb trail said nothing.
 */
export function docsCrumbs(href: string): [Crumb, ...Crumb[]] {
  const group = DOCS_NAV.find((g) => g.items.some((i) => i.href === href))
  const page = group?.items.find((i) => i.href === href)
  if (!group || !page) throw new Error(`docsCrumbs: ${href} is not in DOCS_NAV`)
  return [
    { label: 'Docs', href: '/docs' },
    { label: group.label, href: group.items[0].href },
    { label: page.label },
  ]
}

// The Run Graphite locally and Color ramps pages' contents. Here rather than in the
// page files because a page may only export what Next allows, and the search
// index reads every page's sections from this one place.
export const RUN_LOCALLY_TOC: TocItem[] = [
  { href: '#requirements', label: 'Requirements' },
  { href: '#create', label: 'Create the project' },
  { href: '#run-it', label: 'Run it' },
  { href: '#webpack', label: 'Why webpack' },
  { href: '#in-the-repo', label: 'Working in the repo' },
  { href: '#checks', label: 'Checks' },
  { href: '#next-steps', label: 'Next steps' },
]

export const COLOR_RAMPS_TOC: TocItem[] = [
  { href: '#accent', label: 'Accent' },
  { href: '#secondary', label: 'Secondary' },
  { href: '#neutral', label: 'Neutral' },
  { href: '#neutral-variant', label: 'Neutral variant' },
  { href: '#sampling', label: 'How stops are sampled' },
]
