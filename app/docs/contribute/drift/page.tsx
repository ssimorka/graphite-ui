import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DocSnippet } from '@/components/doc-snippet'
import { Callout, SectionHeading } from '@/components/doc-blocks'
import { RefTable } from '@/components/component-page'
import { readSnapshot } from '@/app/docs/foundations/tokens/read-tokens'
import { readDivergence } from '@/lib/ramp-divergence'
import { spell } from '@/lib/spell'
import { TOC } from './toc'
import styles from '../../foundations/tokens/tokens-page.module.scss'

export const metadata: Metadata = {
  title: 'Snapshots and drift · Graphite UI',
  description:
    'How Graphite checks its code against the Figma kit: the committed token snapshot, Dev Mode names, where the color engine differs from the kit, and what the checks cannot see.',
}

const lower = (n: number) => spell(n).toLowerCase()

/** Entries in the committed Dev Mode code syntax snapshot. */
function codeSyntaxCount() {
  const j = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs', 'tokens', 'figma-code-syntax.json'), 'utf8'),
  ) as { collections: Record<string, Record<string, string>> }
  return Object.values(j.collections).reduce((n, c) => n + Object.keys(c).length, 0)
}

/**
 * Moved here from the Tokens and Color foundation pages, which now describe
 * the tokens rather than how they are kept in step with the kit.
 */
export default function DriftPage() {
  const snap = readSnapshot()
  const checked = snap.collections.filter((c) => c.checked)
  const checkedVars = checked.reduce((n, c) => n + c.count, 0)
  const d = readDivergence()
  const differing = d.near + d.far.length
  const where = d.rampsAffected.join(' and ')
  // Weight 500 is the source-tone stop on every ramp, so a difference there is
  // the one worth naming as such.
  const farSentences = d.far
    .map(
      (f) =>
        `The largest is ${f.ramp}/${f.weight}${f.weight === '500' ? ', the source-tone stop' : ''}: the engine produces ${f.engine.toUpperCase()} where the kit has ${f.kit.toUpperCase()}, a difference of ${f.delta} in ${f.channel}.`,
    )
    .join(' ')

  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={TOC}>
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/contribute/drift')} />
            <h1 className={styles.title}>Snapshots and drift</h1>
            <p className={styles.lede}>
              The checks compare the code with committed copies of the Figma
              kit, never with Figma itself. This page covers those copies and
              where the two are allowed to differ.
            </p>
          </header>

          <section id="token-snapshot" className={styles.block}>
            <SectionHeading
              title="Token snapshot"
              lede={
                <>
                  The kit&rsquo;s variables are extracted into{' '}
                  <code>docs/tokens/figma-snapshot.json</code>, and{' '}
                  <code>token-drift</code> compares the foundations in{' '}
                  <code>app/globals.scss</code> against it on every pull
                  request. It reads {checked.length} collections,{' '}
                  {checkedVars} variables in all.
                </>
              }
            />
            <RefTable
              caption="Collections in the token snapshot"
              columns={[
                { label: 'Collection', tone: 'name' },
                { label: 'Modes', tone: 'muted' },
                { label: 'Variables', tone: 'type' },
                { label: 'token-drift', tone: 'text' },
              ]}
              rows={snap.collections.map((c) => [
                c.name,
                c.modes.join(', '),
                String(c.count),
                c.checked ? <span key="c" className={styles.checked}>Checked</span> : 'Not checked',
              ])}
            />
            <DocSnippet code="pnpm token-drift" />
            <p className={styles.note}>
              The color collections are not part of the gate, because the
              engine computes color rather than declaring it. The engine is
              compared with the kit&rsquo;s primitives below instead.
            </p>
          </section>

          <section id="code-syntax" className={styles.block}>
            <SectionHeading
              title="Dev Mode names"
              lede="What Figma shows a developer who inspects a component."
            />
            <p className={styles.note}>
              {`docs/tokens/figma-code-syntax.json holds the ${lower(codeSyntaxCount())} variable names the kit's Dev Mode prints. token-drift fails unless each one is a --graphite-* variable the code declares, so the kit cannot hand out a name the code does not have. scripts/figma-code-syntax.js re-extracts it.`}
            </p>
          </section>

          <section id="color" className={styles.block}>
            <SectionHeading
              title="Color against the kit"
              lede={`The kit's swatches are bound to its variables. The engine computes ${lower(differing)} ${where} stops slightly differently, and that is recorded rather than fixed.`}
            />
            <Callout
              tone="warning"
              title={`${d.exact} of ${d.total} stops match the kit exactly.`}
            >
              {[
                `All ${lower(differing)} differences sit on ${where}. ${spell(d.near)} are within 1/255 and invisible. ${farSentences}`,
                'Do not correct this towards Figma. The engine’s hue sits 0.17° from the intended source − 120°, where the kit’s baked value is 1.19° off, at a tone where red is already at the sRGB gamut edge. The engine is the more correct one.',
              ]}
            </Callout>
          </section>

          <section id="limits" className={styles.block}>
            <SectionHeading
              title="What the checks cannot see"
              lede="They read committed files, so they run offline. That has a cost."
            />
            <p className={styles.note}>
              Re-extracting a snapshot from Figma is a manual step. The checks
              catch the code drifting from a snapshot, not a snapshot drifting
              from Figma. A change made in the kit is invisible to CI until
              someone re-extracts and commits it. The{' '}
              <a href="/docs/contribute/governance">Governance</a> page covers
              all the checks.
            </p>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
