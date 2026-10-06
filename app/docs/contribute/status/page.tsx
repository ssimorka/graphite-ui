import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { RefTable } from '@/components/component-page'
import { readKitStats } from '@/lib/kit-stats'
import { readContracts } from '@/lib/contracts'
import { readComponentsIndex } from '@/lib/components-index'
import { readFoundations } from '@/app/docs/foundations/tokens/read-tokens'
import { readRuleNumbers } from '@/app/docs/contribute/governance/read'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { buildGraphiteVars, buildStates, buildTheme, makeRamps } from '@/lib/color.js'
import styles from '../../foundations/tokens/tokens-page.module.scss'

export const metadata: Metadata = {
  title: 'Status · Graphite UI',
  description:
    'Every count Graphite UI quotes, in one place, each with one line saying what it counts. Read from the repo when the site is built.',
}

/** Entries in the committed Dev Mode code syntax snapshot. */
function codeSyntaxCount() {
  const j = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs', 'tokens', 'figma-code-syntax.json'), 'utf8'),
  ) as { collections: Record<string, Record<string, string>> }
  return Object.values(j.collections).reduce((n, c) => n + Object.keys(c).length, 0)
}

/**
 * The one place for every count but the headline. The site quotes a single
 * number elsewhere, governed components, so pages cannot disagree; everything
 * else is here, computed at build time, with what it counts beside it.
 */
export default function StatusPage() {
  const kit = readKitStats()
  const contracts = readContracts()
  const index = readComponentsIndex(Object.keys(contracts))
  const ramps = makeRamps(COVER_SOURCE_HEX)
  const light = buildTheme('light', ramps)
  const generated = Object.keys(buildGraphiteVars(light, buildStates(light.tokens, ramps, 'light'), ramps, 'light'))
  const foundations = readFoundations().desktop.filter((d) => !generated.includes(d.name))

  const rows: [string, string, string][] = [
    ['Governed components', String(kit.governed), 'Components with a versioned contract, checked in CI. The headline count.'],
    ['Contracts', String(kit.contracts), 'Contract files: the governed components plus the shared Overlay hook.'],
    ['Governance rules', String(readRuleNumbers().length), 'Numbered rules in docs/contracts/README.md.'],
    ['Drift checks', String(kit.checks), 'drift-check, token-drift and component-doc-drift, run on every pull request.'],
    ['Kit pages', String(kit.pages), 'Figma pages in the committed component snapshot.'],
    ['Kit component sets', String(kit.sets), 'Every set on those pages, private parts included.'],
    ['Public sets', String(kit.publicSets), 'Sets without the kit’s _ prefix. Each must be documented.'],
    ['Public sets with no contract', index.publicUngoverned === null ? '—' : String(index.publicUngoverned), 'Labelled ungoverned in the kit rather than hidden.'],
    ['Component docs', String(kit.docs), 'Files in docs/components, checked against the kit snapshot.'],
    ['Color ramps', String(Object.keys(ramps).length), 'Ramps the engine builds from one source color.'],
    ['Roles', String(Object.keys(light.tokens).length), 'Named color roles per theme.'],
    ['Generated variables', String(generated.length), '--graphite-* color variables per theme: roles, states, ladders, focus and scrim.'],
    ['Foundation variables', String(foundations.length), '--graphite-* variables that are the same in every theme: space, radius, type and the rest.'],
    ['Dev Mode names', String(codeSyntaxCount()), 'Kit variables whose Dev Mode snippet is checked against the code.'],
  ]

  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={[]}>
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/contribute/status')} />
            <h1 className={styles.title}>Status</h1>
            <p className={styles.lede}>
              Every count Graphite quotes, read from the repo when the site is
              built. Elsewhere the site quotes one: governed components.
            </p>
          </header>
          <RefTable
            caption="Counts"
            columns={[
              { label: 'Count', tone: 'name' },
              { label: 'Value', tone: 'muted' },
              { label: 'What it counts', tone: 'text' },
            ]}
            rows={rows}
          />
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
