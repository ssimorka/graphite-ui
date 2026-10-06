import type { Metadata } from 'next'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SectionHeading } from '@/components/doc-blocks'
import { PatternCount, RatioBar, TileLibrary } from '@/app/docs/theming/live'
import styles from '@/app/docs/theming/theming.module.scss'
import own from './generative-art.module.scss'

export const metadata: Metadata = {
  title: 'Generative Art · Graphite UI',
  description:
    'The rules behind Create’s generative art: a fixed tile library, a 60 / 30 / 10 color rhythm and a set of spans, all drawn from your source color.',
}

// The cell spans a composition deals from, as [label, columns, rows].
const SPANS: [string, number, number][] = [
  ['1 × 1', 1, 1],
  ['2 × 1', 2, 1],
  ['1 × 2', 1, 2],
  ['2 × 2', 2, 2],
  ['3 × 1', 3, 1],
  ['3 × 2', 3, 2],
]

/**
 * Generative Art's one home, under Create. Create's Generative Art tab draws
 * a composition; this page is the rulebook it draws from. It used to be the
 * "Pattern reference" section of the Theming docs.
 */
export default function GenerativeArtPage() {
  return (
    <main id="main-content" className="page-main">
      <article className={`${styles.page} ${own.main}`}>
        <header className={styles.header}>
          <Breadcrumb items={[{ label: 'Create', href: '/create' }, { label: 'Generative Art' }]} />
          <h1 className={styles.title}>Generative Art</h1>
          <p className={styles.lede}>
            <PatternCount capital /> tiles, one rulebook, drawn from your color.
            Make a composition in <a href="/create">Create</a>, on the
            Generative Art tab.
          </p>
        </header>

        <section id="rules" className={styles.block}>
          <SectionHeading
            title="The rules"
            lede="Every composition draws from the same fixed library, so the art stays recognizable however it is combined."
          />
          <p className={styles.note}>
            Define the rules and let the system execute them: the logic of Sol
            LeWitt&rsquo;s wall drawings, applied to interface surfaces.
          </p>
        </section>

        <section id="rhythm" className={styles.block}>
          <SectionHeading title="Color rhythm: 60 / 30 / 10" />
          <p className={styles.note}>
            Sixty percent neutrals, thirty percent accent, ten percent secondary,
            the ramp the engine derives 120° off your source. Adjacent panels
            check their neighbors so no color clusters.
          </p>
          <RatioBar />
        </section>

        <section id="spans" className={styles.block}>
          <SectionHeading title="Spans" />
          <p className={styles.note}>
            Larger cells act as anchors. Image panels always land on a large
            span, spread across horizontal zones so no region dominates.
          </p>
          <ul className={styles.spans}>
            {SPANS.map(([label, cols, rows]) => (
              <li key={label} className={styles.span}>
                <span
                  className={styles.spanBox}
                  style={{ width: cols * 44, height: rows * 44 }}
                  aria-hidden="true"
                />
                <span className={styles.spanLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="tiles" className={styles.block}>
          <SectionHeading title="Tile library" />
          <p className={styles.note}>
            All <PatternCount />, drawn live from your source color.
          </p>
          <TileLibrary />
        </section>
      </article>
      <SiteFooter />
    </main>
  )
}
