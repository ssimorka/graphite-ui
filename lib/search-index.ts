import { isValidElement, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { COMPONENT_DOCS } from '@/components/component-doc/registry'
import { componentToc } from '@/components/component-doc/component-doc-page'
import type { ComponentDocConfig } from '@/components/component-doc/types'
import {
  COLOR_DOCS_TOC,
  COLOR_RAMPS_TOC,
  INSTALLATION_TOC,
} from '@/components/docs-nav'
import { readContractDoc } from '@/lib/contract-doc'
import { metadata as themingMeta } from '@/app/docs/theming/page'
import { metadata as installMeta } from '@/app/docs/installation/page'
import { metadata as rampsMeta } from '@/app/docs/foundations/color/page'
import { metadata as createMeta } from '@/app/create/page'
import { metadata as galleryMeta } from '@/app/gallery/page'
import { metadata as introMeta } from '@/app/docs/page'
import { TOC as introToc } from '@/app/docs/toc'
import { metadata as quickStartMeta } from '@/app/docs/quick-start/page'
import { TOC as quickStartToc } from '@/app/docs/quick-start/toc'
import { metadata as a11yMeta } from '@/app/docs/accessibility/page'
import { TOC as a11yToc } from '@/app/docs/accessibility/toc'
import { metadata as governanceMeta } from '@/app/docs/governance/page'
import { TOC as governanceToc } from '@/app/docs/governance/toc'
import { metadata as typeMeta } from '@/app/docs/foundations/typography/page'
import { TOC as typeToc } from '@/app/docs/foundations/typography/toc'
import { metadata as spacingMeta } from '@/app/docs/foundations/spacing/page'
import { TOC as spacingToc } from '@/app/docs/foundations/spacing/toc'
import { metadata as radiusMeta } from '@/app/docs/foundations/radius/page'
import { TOC as radiusToc } from '@/app/docs/foundations/radius/toc'
import { metadata as layoutMeta } from '@/app/docs/foundations/layout/page'
import { TOC as layoutToc } from '@/app/docs/foundations/layout/toc'
import { metadata as tokensMeta } from '@/app/docs/foundations/tokens/page'
import { TOC as tokensToc } from '@/app/docs/foundations/tokens/toc'

/**
 * One searchable destination: a page, or a section of one. `page` is what the
 * result is filed under; `section` is empty for the page itself.
 */
export type SearchEntry = {
  href: string
  page: string
  section: string
  kind: 'Docs' | 'Component' | 'Tool'
  /** A sentence to show under the result, and to match on last. */
  text: string
  /** Names worth matching on exactly: props, slots, tokens, variants. */
  keywords: string[]
}

/** Plain text out of a config's ReactNode (an a11y note with <code> in it). */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

const describe = (m: Metadata) => (typeof m.description === 'string' ? m.description : '')
const titleOf = (m: Metadata) =>
  (typeof m.title === 'string' ? m.title : '').replace(/ · Graphite UI$/, '')

/** A docs page and its table of contents, from the page's own metadata. */
function docsPage(
  href: string,
  meta: Metadata,
  toc: { href: string; label: string }[],
  kind: SearchEntry['kind'] = 'Docs',
  page = titleOf(meta),
): SearchEntry[] {
  return [
    { href, page, section: '', kind, text: describe(meta), keywords: [] },
    ...toc.map((t) => ({
      href: `${href}${t.href}`,
      page,
      section: t.label,
      kind,
      text: '',
      keywords: [],
    })),
  ]
}

/**
 * A component page and each of its sections. What a section can be found by is
 * what it shows: the API section by its prop names, Tokens by its roles, Usage
 * by its rules. All of it read from the contract and the page config, so a
 * renamed prop is renamed in search too.
 */
function componentPage(c: ComponentDocConfig): SearchEntry[] {
  const contract = readContractDoc(c.slug)
  const href = `/docs/components/${c.slug}`
  const by: Record<string, { text: string; keywords: string[] }> = {
    '#live-preview': { text: '', keywords: [] },
    '#installation': { text: c.install, keywords: [] },
    '#anatomy': {
      text: contract.slots.map((s) => s.notes).join(' '),
      keywords: contract.slots.map((s) => s.name),
    },
    '#variants': { text: '', keywords: (c.variants ?? []).map((v) => v.label) },
    '#states': { text: '', keywords: (c.states ?? []).map((s) => s.label) },
    '#api': {
      text: contract.props.map((p) => p.notes).join(' '),
      keywords: contract.props.map((p) => p.name),
    },
    '#tokens': {
      text: contract.tokens.map((t) => t.usage).join(' '),
      keywords: contract.tokens.map((t) => t.name).filter(Boolean),
    },
    '#usage': { text: [...c.dos, ...c.donts].join(' '), keywords: [] },
    '#accessibility': {
      text: c.a11y.map(([, note]) => textOf(note)).join(' '),
      keywords: c.a11y.map(([label]) => label),
    },
    '#parity': {
      text: (c.parity ?? []).map((row) => row[3]).join(' '),
      keywords: (c.parity ?? []).map((row) => row[0]),
    },
    '#related': { text: '', keywords: c.related.map((r) => r.title) },
  }

  return [
    {
      href,
      page: c.name,
      section: '',
      kind: 'Component',
      text: c.lede,
      keywords: [c.slug.replace(/-/g, ' ')],
    },
    ...componentToc(c).map((t) => ({
      href: `${href}${t.href}`,
      page: c.name,
      section: t.label,
      kind: 'Component' as const,
      ...by[t.href],
    })),
  ]
}

/** Every searchable destination on the site, built once at build time. */
export function buildSearchIndex(): SearchEntry[] {
  return [
    ...docsPage('/docs', introMeta, introToc, 'Docs', 'Introduction'),
    ...docsPage('/docs/installation', installMeta, INSTALLATION_TOC),
    ...docsPage('/docs/quick-start', quickStartMeta, quickStartToc),
    ...docsPage('/docs/theming', themingMeta, COLOR_DOCS_TOC),
    ...docsPage('/docs/accessibility', a11yMeta, a11yToc),
    ...docsPage('/docs/governance', governanceMeta, governanceToc),
    ...docsPage('/docs/foundations/color', rampsMeta, COLOR_RAMPS_TOC),
    ...docsPage('/docs/foundations/typography', typeMeta, typeToc),
    ...docsPage('/docs/foundations/spacing', spacingMeta, spacingToc),
    ...docsPage('/docs/foundations/radius', radiusMeta, radiusToc),
    ...docsPage('/docs/foundations/layout', layoutMeta, layoutToc),
    ...docsPage('/docs/foundations/tokens', tokensMeta, tokensToc),
    ...docsPage('/gallery', galleryMeta, [], 'Docs'),
    ...docsPage('/create', createMeta, [], 'Tool', 'Create a theme'),
    ...Object.values(COMPONENT_DOCS).flatMap((doc) => componentPage(doc())),
  ]
}
