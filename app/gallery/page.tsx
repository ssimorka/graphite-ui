import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { ComponentsIndex } from '@/components/sections/components-index'
import { SiteFooter } from '@/components/sections/site-footer'
import { readComponentsIndex } from '@/lib/components-index'
import { readContracts } from '@/lib/contracts'
import { readKitStats } from '@/lib/kit-stats'

export const metadata: Metadata = {
  title: 'Components · Graphite UI',
  description:
    'Every component the kit ships, sorted A to Z. The governed ones render live from the same tokens as the rest of the system, each labelled with the version of the contract it implements.',
}

// Re-exported so existing importers keep their `@/app/gallery/page` path; the
// loader itself moved to lib/contracts so the home page can share it.
export type { ContractMeta } from '@/lib/contracts'

export default function GalleryPage() {
  const contracts = readContracts()
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} wash={false}>
        <ComponentsIndex
          contracts={contracts}
          stats={readKitStats()}
          index={readComponentsIndex(Object.keys(contracts))}
        />
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
