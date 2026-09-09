import { Hero } from '@/components/sections/hero'
import { TrustedBy } from '@/components/sections/trusted-by'
import { Capabilities } from '@/components/sections/capabilities'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { SiteFooter } from '@/components/sections/site-footer'

export default function Page() {
  return (
    <main id="main-content" className="page-main">
      {/* Show → explain → prove → convert. The live explorer is the hero's
          product shot, so evidence sections come before the ask. */}
      <Hero />
      <TrustedBy />
      <Capabilities />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
