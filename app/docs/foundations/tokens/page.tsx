import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'

// PLACEHOLDER: replaced by the real page.
export const metadata: Metadata = {
  title: 'Tokens · Graphite UI',
  description: 'Tokens.',
}

export default function TokensPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV}>
        <h1>Tokens</h1>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
