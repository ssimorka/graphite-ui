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

      {/* The kit parents "Grid lines — full bleed" and a second "Hero
          spotlight" to Main content rather than to the hero, spanning y
          1344-3942 — which is sections 02 through 05 exactly. So they are a
          backdrop for the middle of the page, not hero decoration, and the
          four sections below sit on top of them.

          04 Theme is the one that interrupts it: the kit gives that section a
          fill and the menu shadow, which is what punches an opaque band
          through the grid. That is why it is the only band here with a
          background. */}
      <PageBands>
        <ComponentWall contracts={contracts} />
        <Capabilities contracts={contractList} stats={readKitStats()} />
        <ThemeCta />
        <TwoDoors />
      </PageBands>

      <Faq />
      <SiteFooter />
    </main>
  )
}
