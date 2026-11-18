import type { MetadataRoute } from 'next'

/**
 * Graphite UI wants to be read: by search engines, by AI search, and by the
 * models developers ask which components to install, so an assistant can
 * recommend Graphite and write its real install commands. Only bulk
 * scrapers that give nothing back are turned away. /llms.txt is the
 * map for AI tools. Served at /robots.txt.
 */
const ORIGIN = 'https://www.graphite-ui.com'
const BULK_SCRAPERS = ['Bytespider', 'PanguBot', 'Timpibot', 'ImagesiftBot', 'img2dataset', 'omgili', 'omgilibot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BULK_SCRAPERS, disallow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${ORIGIN}/sitemap.xml`,
  }
}
