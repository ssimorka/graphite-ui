import { Hero } from '@/components/sections/hero'
import { ComponentWall } from '@/components/sections/component-wall'
import { Capabilities } from '@/components/sections/capabilities'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { SiteFooter } from '@/components/sections/site-footer'
import { readContracts } from '@/lib/contracts'

export default function Page() {
  return (
    <main id="main-content" className="page-main">
      {/* Section order is the kit's: show the system, prove it renders, explain
          how it resolves, then the two ways in and the ask. */}
      <Hero />
      <ComponentWall contracts={readContracts()} />
      <Capabilities />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
