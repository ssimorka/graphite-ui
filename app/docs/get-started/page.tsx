import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { SectionHeading, StatusBadge } from '@/components/doc-blocks'
import { TOC } from './toc'
import styles from '../theming/theming.module.scss'

export const metadata: Metadata = {
  title: 'Get started · Graphite UI',
  description:
    'Three ways to use Graphite UI and what each one gives you today: the theme, the Figma kit and the components.',
}

const KIT_URL = 'https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo'
const REPO_URL = 'https://github.com/ssimorka/graphite-ui'

/**
 * The adopter's front door. It answers "can I use this, and how" before
 * anything else, so each path states what works today and nothing more. When
 * a path changes (the registry ships, the kit takes a theme), this page
 * changes with it.
 */
export default function GetStartedPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={TOC}>
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/get-started')} />
            <h1 className={styles.title}>Get started</h1>
            <p className={styles.lede}>
              Graphite has three parts. Use any of them on its own.
            </p>
          </header>

          <section id="theme" className={styles.block}>
            <SectionHeading title="Theme" lede="Your color, as a full light and dark theme." />
            <div className={styles.badges}>
              <StatusBadge tone="success">Usable today</StatusBadge>
            </div>
            <p className={styles.note}>
              Pick a color in <a className={styles.link} href="/create">Create</a>,
              then Get the code. You download one CSS file with your color fixed
              in it. Import it once and you are themed. It needs no Graphite
              code. On Tailwind, also download the Tailwind file to use the
              roles as classes.
            </p>
            <p className={styles.note}>
              <a className={styles.link} href="/docs/quick-start">Quick start</a>{' '}
              shows both files in a project.
            </p>
          </section>

          <section id="figma-kit" className={styles.block}>
            <SectionHeading title="Figma kit" lede="Every component, drawn in light and dark." />
            <div className={styles.badges}>
              <StatusBadge tone="success">Usable today</StatusBadge>
            </div>
            <p className={styles.note}>
              The Graphite UI Kit is a published Figma library.{' '}
              <a className={styles.link} href={KIT_URL}>
                Open the kit
              </a>{' '}
              and add it to your team libraries.
            </p>
            <p className={styles.note}>
              The kit is drawn in the default color. There is no way yet to
              bring a theme from Create into it.
            </p>
          </section>

          <section id="components" className={styles.block}>
            <SectionHeading title="Components" lede="React components built on the theme." />
            <div className={styles.badges}>
              <StatusBadge tone="neutral">Source readable today</StatusBadge>
              <StatusBadge tone="primary">Install coming</StatusBadge>
            </div>
            <p className={styles.note}>
              Every component&rsquo;s source is in the{' '}
              <a className={styles.link} href={REPO_URL}>
                repository
              </a>
              . You can copy one into your project by hand today. There is no
              install command yet.
            </p>
            <p className={styles.note}>
              Browse them in{' '}
              <a className={styles.link} href="/gallery">
                Components
              </a>
              .
            </p>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
