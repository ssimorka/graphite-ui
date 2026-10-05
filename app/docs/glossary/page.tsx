import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SectionHeading } from '@/components/doc-blocks'
import { COLOR_TERMS, SYSTEM_TERMS } from './terms'
import { TOC } from './toc'
// The definition-list styles began on the Theming page, where the glossary
// used to live, and are shared from there rather than copied.
import styles from '../theming/theming.module.scss'

export const metadata: Metadata = {
  title: 'Glossary · Graphite UI',
  description:
    'Plain definitions for the words Graphite UI uses: kit, engine, contract, governed, ramp, role, tone and the rest.',
}

function Terms({ terms }: { terms: [string, string][] }) {
  return (
    <dl className={styles.glossary}>
      {terms.map(([term, plain]) => (
        <div key={term} className={styles.glossaryItem}>
          <dt>{term}</dt>
          <dd>{plain}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function GlossaryPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={TOC}>
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/glossary')} />
            <h1 className={styles.title}>Glossary</h1>
            <p className={styles.lede}>
              The words Graphite uses, in plain language.
            </p>
          </header>

          <section id="system" className={styles.block}>
            <SectionHeading
              title="The system"
              lede="How the design file, the code and the checks are named."
            />
            <Terms terms={SYSTEM_TERMS} />
          </section>

          <section id="color" className={styles.block}>
            <SectionHeading
              title="Color"
              lede="In the order you meet the terms, from one color to a full theme."
            />
            <Terms terms={COLOR_TERMS} />
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
