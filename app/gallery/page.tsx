import type { Metadata } from 'next'
import { Gallery } from '@/components/sections/gallery'
import { SiteFooter } from '@/components/sections/site-footer'
import { readContracts } from '@/lib/contracts'

export const metadata: Metadata = {
  title: 'Components · Graphite UI',
  description:
    'Every Tier 1 component rendered live from the same tokens the rest of the system uses, each labelled with the version of the contract it implements.',
}

// Re-exported so existing importers keep their `@/app/gallery/page` path; the
// loader itself moved to lib/contracts so the home page can share it.
export type { ContractMeta } from '@/lib/contracts'

export default function GalleryPage() {
  return (
    <main id="main-content" className="page-main">
      <Gallery contracts={readContracts()} />
      <SiteFooter />
    </main>
  )
}
