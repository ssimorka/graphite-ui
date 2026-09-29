import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'

// PLACEHOLDER: replaced by the real page.
export const metadata: Metadata = {
  title: 'Accessibility · Graphite UI',
  description: 'Accessibility.',
}

export default function AccessibilityPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV}>
        <h1>Accessibility</h1>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
