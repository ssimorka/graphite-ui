import type { Metadata } from 'next'
import { ColorDocs } from '@/components/sections/color-docs'
import { SiteFooter } from '@/components/sections/site-footer'

export const metadata: Metadata = {
  title: 'Color · Graphite UI System',
  description:
    'How the Graphite UI color system works: three perceptual ramps from one source color, eleven semantic roles per theme, contrast-checked pairings, interaction states, and the tokens designers build with.',
}

export default function ColorPage() {
  return (
    <main id="main-content" className="page-main">
      <ColorDocs />
      <SiteFooter />
    </main>
  )
}
