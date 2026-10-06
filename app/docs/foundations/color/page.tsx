import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, COLOR_RAMPS_TOC, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SectionHeading, StatusBadge } from '@/components/doc-blocks'
import { RefTable } from '@/components/component-page'
import { readDivergence, SOURCE_RAMPS, WEIGHTS } from '@/lib/ramp-divergence'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { spell } from '@/lib/spell'
import { RampSet, SourceBadge } from './ramps'
import styles from './color-page.module.scss'

export const metadata: Metadata = {
  title: 'Color ramps · Graphite UI',
  description:
    'Four ramps, ten stops each, resolved in OKLab from one source color and sampled at fixed tone stops, and how they are sampled.',
}


// Why each ramp samples where it does. The tone and whether a stop is the
// source come from the engine below; the reasons are the part a person wrote.
const WHY: Record<string, string> = {
  accent:
    'The mid stop is pinned to the source tone, so one swatch is literally the hex you chose.',
  secondary:
    'Shares accent’s tone ladder, but the hue is source − 120° and chroma × 0.585, so no stop is the source hex.',
  neutral: 'Samples at a round 50, like neutralVariant and all four status ramps.',
  neutralVariant:
    'Drives outline. Note it no longer appears in the composition palette: secondary took that role.',
}

const lower = (n: number) => spell(n).toLowerCase()

export default function ColorRampsPage() {
  const d = readDivergence()
  const stops = SOURCE_RAMPS.length * WEIGHTS.length
  const seed = COVER_SOURCE_HEX.toUpperCase()

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={COLOR_RAMPS_TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>source {seed}</p>
            <p className={styles.footnoteBody}>
              The seeded default, sampled from the kit cover image&rsquo;s
              dominant hue.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/foundations/color')} />
            <h1 className={styles.title}>Color ramps</h1>
            <p className={styles.lede}>
              {spell(SOURCE_RAMPS.length)} ramps, {lower(WEIGHTS.length)} stops
              each, resolved in OKLab from one source color and sampled at fixed
              tone stops. Every swatch below is computed from the source color
              in the header, and the kit&rsquo;s Graphite Primitives variables
              hold the same values at the default source, so this page is the
              tokens rather than a picture of them.
            </p>
            <div className={styles.badges}>
              <SourceBadge />
              <StatusBadge tone="neutral">{`${SOURCE_RAMPS.length} ramps · ${stops} stops`}</StatusBadge>
              <StatusBadge tone="success">OKLab</StatusBadge>
            </div>
          </header>

          <RampSet />

          <section id="sampling" className={styles.block}>
            <SectionHeading
              title="How the stops are sampled"
              lede={`The ${lower(SOURCE_RAMPS.length)} ramps do not all sample at the same tones, and the difference is deliberate.`}
            />
            <RefTable
              caption="Where each ramp samples its middle stop"
              columns={[
                { label: 'Ramp', tone: 'name' },
                { label: 'Mid tone', tone: 'type' },
                { label: 'Source', tone: 'muted' },
                { label: 'Why', tone: 'text' },
              ]}
              rows={d.sampling.map((s) => [
                s.ramp,
                String(Math.round(s.midTone)),
                s.hasSourceStop ? 'yes' : 'no',
                WHY[s.ramp],
              ])}
            />
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
