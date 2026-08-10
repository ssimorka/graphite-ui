import type { Metadata } from 'next'
import { ColorDocs, ColorGlossary } from '@/components/sections/color-docs'
import { PatternGuide } from '@/components/sections/pattern-guide'
import { SiteFooter } from '@/components/sections/site-footer'

export const metadata: Metadata = {
  title: 'Docs · Graphite UI',
  description:
    'How the Graphite UI color system works: three perceptual ramps plus four status ramps from one source color, twenty-seven semantic roles per theme, contrast-checked pairings, interaction states, and the twenty-tile pattern library.',
}

export default function DocsPage() {
  return (
    <main id="main-content" className="page-main">
      <ColorDocs />
      <PatternGuide />
      <ColorGlossary />
      <SiteFooter />
    </main>
  )
}
