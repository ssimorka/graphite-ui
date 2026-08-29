import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'

export const metadata: Metadata = {
  title: 'Installation · Graphite UI',
  description:
    'Run Graphite UI locally: Node 24, pnpm 10, and a dev server that must run under webpack. Plus the governance checks a change has to pass before it lands.',
}

// Kept in step with the README's Getting started and Scripts tables, which are
// the same facts stated for someone already inside the repo.
const TOC = [
  { href: '#requirements', label: 'Requirements' },
  { href: '#run-it', label: 'Run it' },
  { href: '#webpack', label: 'Why webpack' },
  { href: '#checks', label: 'Checks' },
]

const CHECKS: [string, string][] = [
  ['pnpm typecheck', 'tsc --noEmit'],
  ['pnpm drift-check', 'Components against their contracts'],
  ['pnpm token-drift', 'Foundations against the Figma snapshot'],
  ['pnpm token-drift:test', 'Self-test for the token drift checker'],
  ['pnpm component-doc-drift', 'docs/components against the kit snapshot'],
  ['pnpm component-doc-drift:test', 'Self-test for the component doc checker'],
]

export default function InstallationPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={TOC}>
        <article className="docpage">
          <section className="section docpage__intro">
            <p className="section__eyebrow">Docs</p>
            <h1 className="section__title docpage__title">Installation</h1>
            <p className="section__subtitle docpage__lede">
              Graphite UI is a Next.js app, not a published package. You run it
              from a checkout, and everything on the site is generated live from
              whatever source color you set.
            </p>
          </section>

          <section className="section" id="requirements">
            <h2 className="doc-heading">Requirements</h2>
            <p className="docpage__body">
              Node 24 and pnpm 10: the versions CI pins. Anything older is
              untested rather than unsupported, but the lockfile is resolved
              against these two.
            </p>
          </section>

          <section className="section" id="run-it">
            <h2 className="doc-heading">Run it</h2>
            <pre className="docpage__pre">
              <code>{'pnpm install\npnpm dev'}</code>
            </pre>
            <p className="docpage__body">
              The dev server listens on port 3000. The port is fixed, so two
              checkouts cannot serve at once: the second attaches to the first
              and you end up testing the wrong code.
            </p>
          </section>

          <section className="section" id="webpack">
            <h2 className="doc-heading">Why webpack</h2>
            <p className="docpage__body">
              Turbopack breaks on this project&rsquo;s Sass, so{' '}
              <code>--webpack</code> is baked into both the <code>dev</code> and{' '}
              <code>build</code> scripts. Leave it there. If you invoke Next
              directly, pass the flag yourself.
            </p>
          </section>

          <section className="section" id="checks">
            <h2 className="doc-heading">Checks</h2>
            <p className="docpage__body">
              Six checks gate a change, and they run as one required{' '}
              <code>governance</code> job on every pull request. They read
              committed snapshots rather than the network, so they work offline.
            </p>
            <ul className="doc-list">
              {CHECKS.map(([cmd, what]) => (
                <li key={cmd}>
                  <code>{cmd}</code>: {what}
                </li>
              ))}
            </ul>
            <p className="doc-note">
              <code>main</code> is protected: every change lands through a pull
              request with <code>governance</code> green, including one-line doc
              edits.
            </p>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
