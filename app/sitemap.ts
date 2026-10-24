import type { MetadataRoute } from 'next'
import { DOCS_NAV } from '@/components/docs-nav'

/**
 * The sitemap, from the docs sidebar plus the pages outside it, so a page
 * added to the nav is in the sitemap without a second edit. Served at
 * /sitemap.xml; the origin comes from the layout's metadataBase.
 */
const ORIGIN = 'https://www.graphite-ui.com'
const OUTSIDE_NAV = ['/', '/create', '/create/generative-art']

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set([...OUTSIDE_NAV, ...DOCS_NAV.flatMap((g) => g.items.map((i) => i.href))])
  return [...paths]
    .filter((p) => p.startsWith('/'))
    .map((p) => ({ url: `${ORIGIN}${p === '/' ? '' : p}` }))
}
