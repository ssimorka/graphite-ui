import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Callout, SectionHeading } from '@/components/doc-blocks'
import { CarbonLayer } from '@/app/docs/foundations/tokens/live-tokens'
import { readCarbonFiles } from '@/lib/carbon-files'
import { spell } from '@/lib/spell'
import { TOC } from './toc'
import styles from '../../foundations/tokens/tokens-page.module.scss'

export const metadata: Metadata = {
  title: 'Carbon migration · Graphite UI',
  description:
    'The site began on IBM Carbon and is moving off it: which files still import Carbon, the --cds-* compatibility layer that keeps them themed, and the plan.',
}

const PLAN_URL = 'https://github.com/ssimorka/graphite-ui/blob/main/docs/SHADCN-MIGRATION.md'

/**
 * Site internals only. Graphite's components and theme do not use Carbon, so
 * none of this reaches an adopter. Moved here from the Introduction's status
 * table and the Tokens page.
 */
export default function CarbonPage() {
  const files = readCarbonFiles()

  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={TOC}>
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/contribute/carbon')} />
            <h1 className={styles.title}>Carbon migration</h1>
            <p className={styles.lede}>
              This site began on IBM&rsquo;s Carbon and is moving off it.
              Graphite&rsquo;s components, theme file and theme provider do not
              use Carbon. Only parts of this site still do.
            </p>
          </header>

          <section id="what-remains" className={styles.block}>
            <SectionHeading
              title="What still uses Carbon"
              lede={`${spell(files.length)} files import @carbon/react, read from the repo when this page is built.`}
            />
            <ul className={styles.note}>
              {files.map((f) => (
                <li key={f}>
                  <code>{f}</code>
                </li>
              ))}
            </ul>
            <p className={styles.note}>
              Most are home page sections on Carbon&rsquo;s grid. Carbon also
              supplies the site&rsquo;s Sass reset, its IBM Plex font faces, the
              breakpoint mixin and the icons in the site chrome.
            </p>
          </section>

          <section id="compatibility" className={styles.block}>
            <SectionHeading
              title="The --cds-* layer"
              lede="Carbon reads its own variables. The site feeds them from the same theme, so Carbon pieces follow the source color too."
            />
            <CarbonLayer />
            <Callout title="Read --graphite-*, not --cds-*.">
              {[
                'The Carbon names are a hand-listed table in components/carbon-compat.tsx, plugged into the theme provider through its extend option. Unlike --graphite-* they can drift from what the engine produces, and Carbon has no slot for some roles (text on a status container, for one).',
                'While the variables are rewritten, the page root carries an is-retheming class for one frame. Carbon ships a background transition on buttons, and without it they strand on the previous color.',
              ]}
            </Callout>
          </section>

          <section id="plan" className={styles.block}>
            <SectionHeading title="The plan" lede="Replace each Carbon piece, then remove the dependency." />
            <p className={styles.note}>
              The order and the remaining steps are in{' '}
              <a href={PLAN_URL}>docs/SHADCN-MIGRATION.md</a>. Removing Carbon
              turns CI red while any breakpoint mixin call remains, because{' '}
              <code>token-drift</code> checks Carbon&rsquo;s breakpoint map
              against the kit, so the last step cannot be skipped by accident.
            </p>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
