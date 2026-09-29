import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'

// PLACEHOLDER: replaced by the real page.
export const metadata: Metadata = {
  title: 'Governance · Graphite UI',
  description: 'Governance.',
}

export default function GovernancePage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV}>
        <h1>Governance</h1>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
