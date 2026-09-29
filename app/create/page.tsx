import type { Metadata } from 'next'
import { CreatePage } from '@/components/create/create-page'
import { SiteFooter } from '@/components/sections/site-footer'
import { sweepContrast } from '@/lib/contrast-sweep'

export const metadata: Metadata = {
  title: 'Create · Graphite UI',
  description:
    'Pick one color and Graphite resolves the ramps, the semantic roles and both themes, checking every pairing as it goes. Tune radius, density and type, and take the code.',
}

export default function Create() {
  return (
    <main id="main-content" className="page-main">
      <CreatePage sweep={sweepContrast()} />
      <SiteFooter />
    </main>
  )
}
