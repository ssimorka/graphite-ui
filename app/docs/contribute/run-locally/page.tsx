import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, RUN_LOCALLY_TOC, docsCrumbs } from '@/components/docs-nav'
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
import fs from 'node:fs'
import path from 'node:path'
import { RefTable, Surface } from '@/components/component-page'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { SourcePicker } from './examples/source-picker'
import { ThemeSwitch } from './examples/theme-switch'
import styles from './run-locally.module.scss'

export const metadata: Metadata = {
  title: 'Run Graphite locally · Graphite UI',
  description:
    'Run the Graphite UI repository: Node 24, pnpm 10, a dev server that must run under webpack, the source color and theme in the repo, and the checks a change has to pass.',
}

const read = (...p: string[]) => fs.readFileSync(path.join(process.cwd(), ...p), 'utf8')

/** The snippets in Working in the repo are the files in ./examples, read at build time. */
const example = (file: string) =>
  read('app', 'docs', 'contribute', 'run-locally', 'examples', file).trimEnd()

/**
 * The useTheme() value, read from its type in theme-provider.tsx so the table
 * lists what the context actually carries.
 */
function themeApi() {
  const src = read('components', 'theme-provider.tsx')
  const alias = src.match(/type ThemeName = ([^\n]+)/)?.[1]?.trim() ?? ''
  const body = src.match(/type ThemeContextValue = \{([\s\S]*?)\n\}/)?.[1] ?? ''
  return [...body.matchAll(/^ {2}(\w+): ([^\n]+)$/gm)].map((m) => ({
    name: m[1],
    type: m[2].replace(/ThemeName/g, alias),
  }))
}

const API_NOTES: Record<string, string> = {
  theme: 'The active theme. The same two names the exported theme file uses for data-theme.',
  toggleTheme: 'Flips between the two. This is what the header’s theme button calls.',
  setTheme: 'Sets one directly.',
  sourceHex: 'The current source, lower-case with a leading #.',
  setSourceHex:
    'Changes the source. Anything that is not a 3- or 6-digit hex is ignored.',
  lightBundle: 'Tokens, contrast results and states for the light theme.',
  darkBundle: 'The same for dark. Both are computed whichever theme is showing.',
  level: 'The contrast target the engine resolves against.',
  setLevel: 'Changes it, and every role re-resolves.',
  ramps: 'The ramps for the current source, keyed by name.',
}

// Kept in step with the README's Getting started and Scripts tables, which are
// the same facts stated for someone already inside the repo. Versions are what
// CI pins (Node 24, pnpm 10); the kit frame (Graphite UI Site 11857:2470) said
// 20 and 9 until it was corrected to match on 2026-10-02.

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

export default function RunLocallyPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={RUN_LOCALLY_TOC}
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
            <Breadcrumb items={docsCrumbs('/docs/contribute/run-locally')} />
            <h1 className={styles.title}>Run Graphite locally</h1>
            <p className={styles.lede}>
              For working on Graphite itself. To use Graphite in your own
              project, start at <a href="/docs/get-started">Get started</a>.
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
                It starts on port 3000, or on the next free port if another
                checkout already holds 3000. Read the address it prints before
                you trust what the browser shows you: the old tab may still be
                the other checkout.
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
              {/* One fragment, so Callout reads it as one paragraph: bare mixed
                  children arrive as an array, which it splits per item. */}
              <>
              <code>--webpack</code> is baked into both the <code>dev</code> and{' '}
              <code>build</code> scripts, so <code>pnpm dev</code> is safe. If
              you invoke Next directly, pass the flag yourself.
              </>
            </Callout>
          </section>

          <section id="in-the-repo" className={styles.block}>
            <SectionHeading
              title="Working in the repo"
              lede="The site holds one source color and one theme, and every page reads them."
            />
            <Step n={4} title="Set the source">
              <p>
                The swatch in the header sets it, and so does{' '}
                <a href="/create">Create</a>. In code, the source lives in the
                theme provider and <code>setSourceHex</code> changes it. The
                browser saves it, so every page reads the same color. The
                default is <code>{COVER_SOURCE_HEX.toUpperCase()}</code>,
                sampled from the kit&rsquo;s cover image.
              </p>
              <Surface label="Live: these set the site’s source color">
                <SourcePicker />
              </Surface>
              <DocSnippet code={example('source-picker.tsx')} />
              <DocSnippet code={example('source-picker.module.scss')} />
            </Step>
            <Step n={5} title="Read the theme from useTheme">
              <p>
                <code>useTheme</code> is the hook the header&rsquo;s theme button
                uses. It needs a client component.
              </p>
              <Surface label="Live: switches the site theme">
                <ThemeSwitch />
              </Surface>
              <DocSnippet code={example('theme-switch.tsx')} />
            </Step>
            <RefTable
              caption="What useTheme returns"
              columns={[
                { label: 'Field', tone: 'name' },
                { label: 'Type', tone: 'type' },
                { label: 'What it is', tone: 'text' },
              ]}
              rows={themeApi().map((f) => [f.name, f.type, API_NOTES[f.name] ?? ''])}
            />
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
              <code>pnpm typecheck</code>, the two checker self-tests and{' '}
              <code>pnpm naming-check</code>, which keeps{' '}
              <code>--graphite-*</code> the only variable prefix, run in the
              same required <code>governance</code> job. <code>main</code>{' '}
              is protected, so every change lands through a pull request with
              that job green, including one-line doc edits.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="The rest of Contribute."
            />
            <NextCards>
              <NextCard href="/docs/contribute/governance" title="Governance">
                The eight rules, and why the kit outranks the contracts.
              </NextCard>
              <NextCard href="/docs/contribute/drift" title="Snapshots and drift">
                How the checks compare code to the kit, and what they cannot see.
              </NextCard>
              <NextCard href="/docs/contribute/carbon" title="Carbon migration">
                What still comes from Carbon, and the plan to remove it.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
