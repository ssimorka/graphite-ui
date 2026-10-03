import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { RefTable } from '@/components/component-page'
import { spell } from '@/lib/spell'
import {
  readConsumers,
  readFoundationContract,
  readKitRadius,
  readRootVars,
  titleOf,
  toPx,
} from '../spacing/read-foundation'
import { InlineCode } from '../spacing/inline-code'
import { RadiusPreview } from './radius-preview'
import { TOC } from './toc'
import styles from './radius.module.scss'

export const metadata: Metadata = {
  title: 'Radius · Graphite UI',
  description:
    'The eight-step corner radius scale in px, which components use which step, and why the kit is square-cornered by default.',
}

const lower = (n: number) => spell(n).toLowerCase()

/**
 * The radius line from Button's contract front matter. Button is the example
 * the page leans on for "square by default", so its words are quoted rather
 * than paraphrased.
 */
function readButtonRadius(): string {
  const src = fs.readFileSync(
    path.join(process.cwd(), 'docs', 'contracts', 'button.md'),
    'utf8',
  )
  const m = /- name: radius\s*\n\s*usage:\s*(.+)/.exec(src)
  return m ? m[1].trim() : ''
}

const componentLink = (slug: string, governed: boolean) =>
  governed ? (
    <a key={slug} href={`/docs/components/${slug}`}>
      {titleOf(slug)}
    </a>
  ) : (
    <span key={slug}>{titleOf(slug)}</span>
  )

/** A list of links joined with commas, for a table cell. */
const joinLinks = (items: { slug: string; governed: boolean }[]) =>
  items.flatMap((c, i) => [i ? ', ' : '', componentLink(c.slug, c.governed)])

export default function RadiusPage() {
  const contract = readFoundationContract('radius')
  const scale = readRootVars('radius')
  const kit = readKitRadius()
  const consumers = readConsumers('radius')
  const buttonRadius = readButtonRadius()

  const matching = scale.filter((s) => toPx(s.value) === kit[s.suffix]).length
  const bySuffix = scale
    .map((s) => ({
      ...s,
      users: consumers.filter((c) => c.suffixes.includes(s.suffix)),
    }))
    .filter((s) => s.users.length)
  const squareCount = consumers.filter((c) => c.suffixes.includes('none')).length
  const circles = consumers.filter((c) => c.circle)
  const full = scale.find((s) => s.suffix === 'full')
  // "Tag and Toggle take radius-full; Navigation menu and Tooltip take radius-2"
  const exceptions = bySuffix
    .filter((s) => s.suffix !== 'none')
    .map(
      (s) =>
        `${s.users.map((u) => titleOf(u.slug)).join(' and ')} take ${s.name.replace('--graphite-', '')}`,
    )
    .join('; ')

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>default: radius-none</p>
            <p className={styles.footnoteBody}>
              The kit is square-cornered. Most governed components read the zero
              step for their corners.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/foundations/radius')} />
            <h1 className={styles.title}>Radius</h1>
            <p className={styles.lede}>
              {spell(scale.length)} corner steps in px, taken from the
              kit&rsquo;s Radius collection. Carbon has no radius scale, so the
              kit is the only source these numbers have. The kit is also
              square-cornered: {lower(squareCount)} of the {lower(consumers.length)}{' '}
              governed components that set a corner set it to zero.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`Contract ${contract.version}`}</StatusBadge>
              <StatusBadge tone="neutral">{`${scale.length} steps`}</StatusBadge>
              <StatusBadge tone="success">px</StatusBadge>
            </div>
          </header>

          <section id="scale" className={styles.block}>
            <SectionHeading
              title="The scale"
              lede={`${matching} of ${scale.length} steps match the kit snapshot. Each swatch is drawn with the token it names.`}
            />
            <ul className={styles.swatches}>
              {scale.map((s) => {
                const k = kit[s.suffix]
                const agrees = toPx(s.value) === k
                return (
                  <li key={s.name} className={styles.swatchItem}>
                    <span
                      className={styles.swatch}
                      style={{ borderRadius: `var(${s.name})` }}
                      aria-hidden="true"
                    />
                    <code className={styles.swatchName}>{s.name}</code>
                    <span className={styles.swatchValue}>
                      {s.value}
                      {agrees ? null : (
                        <span className={styles.missing}>
                          {k === undefined ? ' · not in kit' : ` · kit ${k}px`}
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
            {full ? (
              <p className={styles.note}>
                <code>{full.name}</code> is <code>{full.value}</code>, the
                kit&rsquo;s own value rather than the more common 9999px. Either
                pills a box; this one stays faithful to the source so the drift
                check has nothing to forgive.
              </p>
            ) : null}
          </section>

          <section id="names" className={styles.block}>
            <SectionHeading
              title="Reading the names"
              lede="Here the suffix is the size. On the spacing scale it is not."
            />
            <Callout title="--graphite-radius-16 is 16px. --graphite-space-06 is step 6, which is 24px.">
              {[
                'Radius suffixes are pixel values and are left unpadded so they read as one. Spacing suffixes are Carbon’s step index, padded to two digits. The shapes collide by accident, and the padding is what keeps them apart at a glance.',
                <>
                  The unit differs on purpose too. Spacing is in rem so it follows
                  a reader&rsquo;s root font size; a corner has no reason to, so
                  radius stays in px, matching the kit directly. See{' '}
                  <a href="/docs/foundations/spacing#names">Spacing</a>.
                </>,
              ]}
            </Callout>
          </section>

          <section id="square" className={styles.block}>
            <SectionHeading
              title="A square-cornered kit"
              lede="Which governed components read which step, found by reading their stylesheets. A component moves between rows here by itself when its corner changes."
            />
            <RefTable
              caption="Radius steps and the components that use them"
              columns={[
                { label: 'Token', tone: 'name' },
                { label: 'Value', tone: 'type' },
                { label: 'Used by', tone: 'text' },
              ]}
              rows={bySuffix.map((s) => [s.name, s.value, joinLinks(s.users)])}
            />
            <Callout title="Square is the default because the kit is canonical.">
              {[
                <>
                  Button&rsquo;s contract puts it plainly:{' '}
                  <em>
                    <InlineCode text={buttonRadius} />
                  </em>{' '}
                  Where the kit and a contract disagree, the kit wins and the
                  contract is corrected. See{' '}
                  <a href="/docs/governance">Governance</a>.
                </>,
                `The exceptions are deliberate and each has its own step: ${exceptions}.`,
              ]}
            </Callout>
          </section>

          <section id="circles" className={styles.block}>
            <SectionHeading
              title="Circles are not a step"
              lede={`A circle is a shape, not a point on this scale, so it is written as 50%. ${spell(circles.length)} governed components draw one.`}
            />
            <RefTable
              caption="Components that draw a 50% circle"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'Also uses', tone: 'type' },
                { label: 'Why 50%', tone: 'text' },
              ]}
              rows={circles.map((c) => [
                componentLink(c.slug, c.governed),
                c.suffixes.length
                  ? c.suffixes.map((x) => `radius-${x}`).join(', ')
                  : 'nothing',
                'The box is square by construction, so radius-full would render the same. 50% says what is meant.',
              ])}
            />
          </section>

          <section id="create" className={styles.block}>
            <SectionHeading
              title="Rounding in Create"
              lede="The Create page has a Radius control. It does not change the scale, and it does not change the site."
            />
            <RadiusPreview steps={scale.map((s) => s.suffix)} />
            <p className={styles.note}>
              This is what the control on <a href="/create">Create</a> does,
              reduced to its mechanism. The chosen step is bound to{' '}
              <code>--graphite-radius-none</code> on the preview root, so every
              component that takes its corners from the zero step rounds with no
              edit to the component. Components on another step (Tag, Toggle,
              Tooltip) keep it. The override is scoped to the preview: the site
              chrome around it stays square.
            </p>
            <Callout tone="warning" title="The exported CSS applies it everywhere.">
              <>
                Create&rsquo;s Get code output writes the same override on{' '}
                <code>:root</code>, so pasting it rounds every component that
                reads the zero step across the whole app. That is the intent of
                the export, but it is a departure from the kit, which stays
                square.
              </>
            </Callout>
          </section>

          <section id="rules" className={styles.block}>
            <SectionHeading
              title="Usage rules"
              lede={`Quoted from the Radius contract (${contract.version}), which token-drift checks against globals.scss.`}
            />
            <div className={styles.rules}>
              <section className={`${styles.side} ${styles.do}`}>
                <h3 className={styles.sideLabel}>Rules</h3>
                <ul className={styles.sideList}>
                  {contract.rules.map((r) => (
                    <li key={r}>
                      <InlineCode text={r} />
                    </li>
                  ))}
                </ul>
              </section>
              <section className={`${styles.side} ${styles.dont}`}>
                <h3 className={styles.sideLabel}>Never</h3>
                <ul className={styles.sideList}>
                  {contract.prohibitions.map((r) => (
                    <li key={r}>
                      <InlineCode text={r.replace(/\s*See the migration note below\.?/, '')} />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <p className={styles.note}>
              That first prohibition is history as well as rule. Corners used to
              be written with spacing tokens, and every value agreed with the
              kit, because 4px is 4px whichever token carries it. The drift check
              could only warn. The migration to this scale is complete, and the
              rule stays written down because no value diff can catch it.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="The other length scale, and the place to try a rounded theme."
            />
            <NextCards>
              <NextCard href="/docs/foundations/spacing" title="Spacing">
                The rem scale and the density steps components bind to.
              </NextCard>
              <NextCard href="/create" title="Create">
                Try a radius against the full set of examples.
              </NextCard>
              <NextCard href="/docs/components/button" title="Button">
                The contract that settles square corners for the kit.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
