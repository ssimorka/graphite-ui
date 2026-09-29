import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DocSnippet } from '@/components/doc-snippet'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
  Step,
} from '@/components/doc-blocks'
import { readKitStats } from '@/lib/kit-stats'
import { spell } from '@/lib/spell'
import styles from './installation.module.scss'

export const metadata: Metadata = {
  title: 'Installation · Graphite UI',
  description:
    'Run Graphite UI locally: Node 24, pnpm 10, and a dev server that must run under webpack. Plus the governance checks a change has to pass before it lands.',
}

// Kept in step with the README's Getting started and Scripts tables, which are
// the same facts stated for someone already inside the repo. The kit frame
// (Graphite UI Site 11857:2470) says Node 20 and pnpm 9; CI pins 24 and 10, so
// the page says what CI runs.
const TOC = [
  { href: '#requirements', label: 'Requirements' },
  { href: '#create', label: 'Create the project' },
  { href: '#run-it', label: 'Run it' },
  { href: '#webpack', label: 'Why webpack' },
  { href: '#checks', label: 'Checks' },
  { href: '#next-steps', label: 'Next steps' },
]

// The three gates the kit lists. typecheck and the two self-tests run in the
// same job and are named under the table rather than given rows of their own.
const CHECKS = [
  {
    name: 'drift-check',
    command: 'pnpm drift-check',
    proves:
      'Every component references exactly the tokens its contract declares, and nothing else.',
  },
  {
    name: 'token-drift',
    command: 'pnpm token-drift',
    proves:
      'The foundations in globals.scss still match the committed Figma snapshot.',
  },
  {
    name: 'component-doc-drift',
    command: 'pnpm component-doc-drift',
    proves:
      'Every public component set in the kit is named or cited by a doc, and every doc\u2019s node ids still resolve.',
  },
]

export default function InstallationPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>pnpm 10 · Node 24</p>
            <p className={styles.footnoteBody}>
              The dev server must run with --webpack. Turbopack breaks on this
              project&rsquo;s Sass.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb
              items={[
                { label: 'Docs', href: '/docs' },
                { label: 'Getting started' },
                { label: 'Installation' },
              ]}
            />
            <h1 className={styles.title}>Installation</h1>
            <p className={styles.lede}>
              Graphite ships as a published Figma library and a governed React
              implementation. There is no registry command yet, so getting
              started means running the project, not adding a dependency. This
              page says so plainly rather than implying a CLI that does not
              exist.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="success">Node 24+</StatusBadge>
              <StatusBadge tone="neutral">pnpm 10</StatusBadge>
              <StatusBadge tone="primary">Webpack required</StatusBadge>
            </div>
          </header>

          <section id="requirements" className={styles.block}>
            <SectionHeading
              title="Requirements"
              lede="Three things, and one of them is a constraint rather than a version number."
            />
            <table className={`${styles.table} ${styles.requirements}`}>
              <tbody>
                <tr>
                  <th scope="row">Node</th>
                  <td>24 or newer, the version CI pins.</td>
                </tr>
                <tr>
                  <th scope="row">pnpm</th>
                  <td>
                    10. The lockfile is pnpm&rsquo;s; npm and yarn will resolve
                    a different tree.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Webpack</th>
                  <td>
                    Not optional. The dev server must run with{' '}
                    <code>--webpack</code>, because Turbopack breaks on this
                    project&rsquo;s Sass.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="create" className={styles.block}>
            <SectionHeading
              title="Create the project"
              lede="Two commands. The lockfile is pnpm’s, so use pnpm: npm or yarn will resolve a different tree and the Sass will not match."
            />
            <Step n={1} title="Clone the repository">
              <p>Everything below assumes you are in the project root.</p>
              <DocSnippet
                code={
                  'git clone https://github.com/ssimorka/graphite-ui.git\ncd graphite-ui'
                }
              />
            </Step>
            <Step n={2} title="Install dependencies">
              <p>
                pnpm reads the committed lockfile, so you get the same tree CI
                does.
              </p>
              <DocSnippet code="pnpm install" />
            </Step>
          </section>

          <section id="run-it" className={styles.block}>
            <SectionHeading
              title="Run it"
              lede="One command, and one flag you cannot drop."
            />
            <Step n={3} title="Start the dev server">
              <p>
                Port 3000 is hardcoded with no auto-port, so a second checkout
                will silently attach to the first. Check which one is serving
                before you trust what the browser shows you.
              </p>
              <DocSnippet code="pnpm dev" />
            </Step>
          </section>

          <section id="webpack" className={styles.block}>
            <SectionHeading
              title="Why webpack"
              lede="Because the alternative silently produces a different site."
            />
            <Callout title="Turbopack breaks on this project’s Sass.">
              <code>--webpack</code> is baked into both the <code>dev</code> and{' '}
              <code>build</code> scripts, so <code>pnpm dev</code> is safe. If
              you invoke Next directly, pass the flag yourself. The port is
              hardcoded, so parallel worktrees collide on it: the second server
              attaches to the first checkout, and anything you verify in the
              browser is then testing the wrong code.
            </Callout>
          </section>

          <section id="checks" className={styles.block}>
            <SectionHeading
              title="Checks"
              lede="Three governance checks run in CI, and all three read a committed snapshot rather than the network, so they work offline. This is the part of Graphite that has no equivalent elsewhere."
            />
            <table className={`${styles.table} ${styles.checks}`}>
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Command</th>
                  <th scope="col">Gate</th>
                  <th scope="col">What it proves</th>
                </tr>
              </thead>
              <tbody>
                {CHECKS.map((c) => (
                  <tr key={c.name}>
                    <th scope="row">{c.name}</th>
                    <td className={styles.command}>
                      <code>{c.command}</code>
                    </td>
                    <td className={styles.gate}>
                      <code>fatal</code>
                    </td>
                    <td>{c.proves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.note}>
              <code>pnpm typecheck</code> and the two checker self-tests run in
              the same required <code>governance</code> job. <code>main</code>{' '}
              is protected, so every change lands through a pull request with
              that job green, including one-line doc edits.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="Three directions, depending on which half of the system you came for."
            />
            <NextCards>
              <NextCard href="/gallery" title="Components">
                {`${spell(readKitStats().governed)} governed components, each with its contract version on the page.`}
              </NextCard>
              <NextCard href="/docs#how-it-works" title="Theming">
                How one source color becomes eight ramps and thirty-two roles.
              </NextCard>
              <NextCard
                href="https://github.com/ssimorka/graphite-ui/blob/main/docs/contracts/README.md"
                title="Governance"
              >
                The eight rules, and why the kit outranks the contracts.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
