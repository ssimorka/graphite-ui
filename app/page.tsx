import { Hero } from '@/components/sections/hero'
import { TrustedBy } from '@/components/sections/trusted-by'
import { Features } from '@/components/sections/features'
import { PatternGuide } from '@/components/sections/pattern-guide'
import { Benefits } from '@/components/sections/benefits'
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
      <Features />
      <PatternGuide />
      <Benefits />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
