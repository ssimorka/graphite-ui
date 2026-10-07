import type { Metadata } from 'next'
import { CreatePage } from '@/components/create/create-page'
import { SiteFooter } from '@/components/sections/site-footer'
import { readFoundations } from '@/app/docs/foundations/tokens/read-tokens'

export const metadata: Metadata = {
  title: 'Create · Graphite UI',
  description:
    'Pick one color and Graphite resolves the ramps, the semantic roles and both themes, checking every pairing as it goes. Tune radius, density and type and take the code, or turn the color into generative art and export it.',
}

export default function Create() {
  return (
    <main id="main-content" className="page-main">
      {/* Read on the server so Get the code can write the foundations into
          the theme file without a second copy of them. */}
      <CreatePage foundations={readFoundations()} />
      <SiteFooter />
    </main>
  )
}
