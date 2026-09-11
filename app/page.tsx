import { Hero } from '@/components/sections/hero'
import { PageBands } from '@/components/page-bands'
import { ComponentWall } from '@/components/sections/component-wall'
import { Capabilities } from '@/components/sections/capabilities'
import { ThemeCta } from '@/components/sections/theme-cta'
import { TwoDoors } from '@/components/sections/two-doors'
import { Faq } from '@/components/sections/faq'
import { SiteFooter } from '@/components/sections/site-footer'
import { readContracts } from '@/lib/contracts'
import { readKitStats } from '@/lib/kit-stats'

export default function Page() {
  const contracts = readContracts()
  // Sorted so the carousel's component panel reads alphabetically rather than
  // in whatever order the contracts directory happens to list.
  const contractList = Object.values(contracts)
    .map(({ component, version }) => ({ component, version }))
    .sort((a, b) => a.component.localeCompare(b.component))

  return (
    <main id="main-content" className="page-main">
      {/* Section order is the kit's, 01 through 07. */}
      <Hero />

      <ComponentWall contracts={contracts} />

      {/* The kit parents "Grid lines — full bleed" to 03 Capabilities alone
          now, sized to that section (11896:292490). It used to span 02
          through 05 from Main content with a second spotlight beside it; both
          the span and the spotlight are gone, and 02 and 04 carry a mesh
          gradient each instead. */}
      <PageBands>
        <Capabilities contracts={contractList} stats={readKitStats()} />
      </PageBands>

      <ThemeCta />
      <TwoDoors />

      <Faq />
      <SiteFooter />
    </main>
  )
}
