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
import { DoDont, RefTable } from '@/components/component-page'
import { spell } from '@/lib/spell'
import { remToPx } from '../tokens/read-tokens'
import { readType, type Step } from './read-type'
import { TOC } from './toc'
import styles from './typography-page.module.scss'

export const metadata: Metadata = {
  title: 'Typography · Graphite UI',
  description:
    'The type scale Graphite reads from the kit: every step with its size and line height in both modes, the three families, four weights, and how components consume them.',
}

// The family a step is set in, per the foundation contract's own usage lines:
// font-1 is "display, headings and titles 1-2", font-2 is "titles 3-5, body and
// component text", mono is "code and technical values". The specimen uses this
// so each sample is set the way the kit sets it.
function familyFor(step: string) {
  if (step.startsWith('code-')) return 'mono'
  if (/^(display|heading)-/.test(step) || /^title-[12]$/.test(step)) return '1'
  return '2'
}

const LADDER_TITLES: Record<string, string> = {
  display: 'Display',
  heading: 'Heading: the editorial ladder',
  title: 'Title: the UI ladder',
  body: 'Body',
  component: 'Component',
  footnote: 'Footnote',
  caption: 'Caption',
  code: 'Code',
}

const SAMPLE = 'One source color, every role resolved'

const px = (v: string) => {
  const n = remToPx(v)
  return n === null ? v : `${n}px`
}

// Contract prose uses em dashes; the site's copy does not. Recast as a colon,
// which is what each of those dashes introduces.
const plain = (s: string) => s.replace(/\s*—\s*/g, ': ')

const lower = (n: number) => spell(n).toLowerCase()

export default function TypographyPage() {
  const t = readType()
  const ladders = [...new Set(t.steps.map((s) => s.ladder))]
  const changed = t.steps.filter((s) => s.mobile)
  const matching = t.steps.filter((s) => s.matchesKit).length
  const noFallback = t.families.filter((f) => !f.hasFallback)
  const readers = t.components.filter((c) => c.steps.length)
  const literal = t.components.filter((c) => !c.steps.length && c.literals.length)
  const componentSteps = t.steps.filter((s) => s.ladder === 'component').map((s) => s.step)
  const componentStepsRead = componentSteps.filter((s) =>
    t.components.some((c) => c.steps.includes(s)),
  )
  const countMatches = t.contract.variableCount === t.variableCount

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>
              {t.steps.length} steps · {t.variableCount} variables
            </p>
            <p className={styles.footnoteBody}>
              Read from app/globals.scss when the page is built, and checked
              against the kit snapshot by token-drift.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/foundations/typography')} />
            <h1 className={styles.title}>Typography</h1>
            <p className={styles.lede}>
              Graphite&rsquo;s type scale is the kit&rsquo;s Graphite
              Typography collection, emitted as CSS variables in rem.{' '}
              {spell(t.steps.length)} steps, each a size and a line height, set
              in three families at four weights. Every value on this page is
              read from the stylesheet when the page is built, and every sample
              is set with the variable it names.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`${t.steps.length} steps`}</StatusBadge>
              <StatusBadge tone="neutral">{`Contract ${t.contract.version}`}</StatusBadge>
              <StatusBadge tone={matching === t.steps.length ? 'success' : 'neutral'}>
                {`${matching} of ${t.steps.length} match the kit`}
              </StatusBadge>
            </div>
          </header>

          <section id="scale" className={styles.block}>
            <SectionHeading
              title="Type scale"
              lede={`${spell(ladders.length)} ladders. Heading is the editorial scale and runs large; title is the UI scale. A component-level heading is a UI title, so it maps to title/*, not to the heading of the same number.`}
            />
            {ladders.map((ladder) => (
              <div key={ladder} className={styles.ladder}>
                <h3 className={styles.ladderTitle}>{LADDER_TITLES[ladder] ?? ladder}</h3>
                <ul className={styles.specimen}>
                  {t.steps
                    .filter((s) => s.ladder === ladder)
                    .map((s) => (
                      <SpecimenRow key={s.step} s={s} />
                    ))}
                </ul>
              </div>
            ))}
            <p className={styles.note}>
              Sizes and line heights are the kit&rsquo;s px divided by 16. The
              px shown is for reading; the stylesheet stays in rem so type
              answers to a reader who has turned their font size up. Values in
              the primary role are the Mobile override.
            </p>
          </section>

          <section id="modes" className={styles.block}>
            <SectionHeading
              title="Desktop and Mobile"
              lede={`The kit has two modes. ${spell(changed.length)} of the ${lower(t.steps.length)} steps change between them; the other ${lower(t.steps.length - changed.length)} are stated once and never restated.`}
            />
            <div className={styles.scroll}>
              <table className={styles.table}>
                <caption className="cds--visually-hidden">
                  Steps whose Mobile value differs from Desktop
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Step</th>
                    <th scope="col">Desktop</th>
                    <th scope="col">Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {changed.map((s) => (
                    <tr key={s.step}>
                      <th scope="row">{s.step}</th>
                      <td>
                        {px(s.size)} / {px(s.lineHeight)}
                      </td>
                      <td className={styles.changed}>
                        {px(s.mobile!.size)} / {px(s.mobile!.lineHeight)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {t.mobileMaxWidth !== null ? (
              <p className={styles.note}>
                Mobile applies below {t.mobileMaxWidth + 1}px. The kit does not
                say where its two modes divide, so the stylesheet reuses the
                boundary the rest of the site already uses, one pixel below{' '}
                <a href="/docs/foundations/layout">md</a>. It is stated in one
                place, so if it is wrong it is wrong once.
              </p>
            ) : null}
          </section>

          <section id="families" className={styles.block}>
            <SectionHeading
              title="Families"
              lede={`${spell(t.families.length)} family tokens. Two of them hold the same face today and are still two tokens, because the kit gives them distinct roles.`}
            />
            <ul className={styles.cards}>
              {t.families.map((f) => (
                <li key={f.name} className={styles.card}>
                  <span
                    className={styles.cardGlyphs}
                    style={{ fontFamily: `var(${f.name})` }}
                    aria-hidden="true"
                  >
                    Aa Gg 0123
                  </span>
                  <code className={styles.cardName}>{f.name}</code>
                  <span className={styles.cardValue}>{f.value}</span>
                  <p className={styles.cardUsage}>{f.usage}</p>
                  {f.hasFallback ? null : (
                    <span className={styles.cardFlag}>No fallback stack</span>
                  )}
                </li>
              ))}
            </ul>
            {noFallback.length ? (
              <Callout tone="warning" title="These tokens name one face and nothing after it.">
                {[
                  `${noFallback.map((f) => f.name).join(', ')} ${noFallback.length === 1 ? 'holds' : 'hold'} a single quoted family with no fallback stack. If IBM Plex fails to load, text set with them drops to the browser default, which is usually a serif. The Typography component reads font-1 and font-2 as they are.`,
                  'This is a known gap rather than a choice. Create’s Get the code writes the three families with a full stack, so an exported theme does not inherit it.',
                ]}
              </Callout>
            ) : null}
          </section>

          <section id="weights" className={styles.block}>
            <SectionHeading
              title="Weights"
              lede="The kit stores Figma style names; CSS needs numbers. The mapping happens once, at the token, rather than at every call site."
            />
            <ul className={styles.weights}>
              {t.weights.map((w) => (
                <li key={w.name} className={styles.weight}>
                  <div className={styles.meta}>
                    <code className={styles.stepName}>{w.name}</code>
                    <span className={styles.stepValues}>
                      {w.value}
                      {w.note ? ` · kit “${w.note}”` : ''}
                    </span>
                  </div>
                  <span
                    className={styles.weightSample}
                    style={{ fontWeight: `var(${w.name})` as unknown as number }}
                  >
                    {SAMPLE}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id="components" className={styles.block}>
            <SectionHeading
              title="How components use it"
              lede={
                <>
                  The{' '}
                  <a href="/docs/components/typography">Typography component</a>{' '}
                  is the scale&rsquo;s main consumer. Its {lower(t.variants.length)}{' '}
                  variants bind to the title ladder, and only display reaches
                  into the heading ladder.
                </>
              }
            />
            <RefTable
              caption="Typography component variants and the step each one reads"
              columns={[
                { label: 'Variant', tone: 'name' },
                { label: 'Tag', tone: 'muted' },
                { label: 'Step', tone: 'type' },
                { label: 'Family', tone: 'muted' },
                { label: 'Sample', tone: 'text' },
              ]}
              rows={t.variants.map((v) => [
                v.variant,
                v.tag,
                v.step,
                `font-${v.family}`,
                <span
                  key="s"
                  className={styles.variantSample}
                  style={{
                    fontFamily: `var(--graphite-font-${v.family})`,
                    fontSize: `var(--graphite-text-${v.step}-size)`,
                    lineHeight: `var(--graphite-text-${v.step}-line-height)`,
                  }}
                >
                  {SAMPLE}
                </span>,
              ])}
            />
            <p className={styles.note}>
              The tag is structure, not size: heading-2 renders an{' '}
              <code>h2</code> whatever it looks like, and skipping a level is the
              page composer&rsquo;s error to avoid.
            </p>

            <RefTable
              caption="How each governed component's styles set type"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'Steps read', tone: 'type' },
                { label: 'Literal sizes', tone: 'muted' },
              ]}
              rows={t.components.map((c) => [
                <a key="a" href={`/docs/components/${c.slug}`}>
                  {c.slug}
                </a>,
                c.steps.length ? c.steps.join(', ') : 'none',
                c.literals.length ? c.literals.join(', ') : 'none',
              ])}
            />
            <Callout tone="warning" title="Adoption is partial.">
              {[
                `${spell(readers.length)} of the ${lower(t.components.length)} governed component stylesheets read a --graphite-text-* step. ${spell(literal.length)} set literal rem sizes instead, and the rest inherit from their container.`,
                `The kit’s ${lower(componentSteps.length)} component steps (${componentSteps.join(', ')}) are declared and checked against the kit, and ${componentStepsRead.length ? `only ${componentStepsRead.join(', ')} ${componentStepsRead.length === 1 ? 'is' : 'are'} read by a governed component` : 'no governed component reads them yet'}. Moving the literal sizes onto them is open work.`,
              ]}
            </Callout>
            <p className={styles.note}>
              The site&rsquo;s own chrome applies the scale through a{' '}
              <code>text()</code> mixin in <code>app/globals.scss</code>, used{' '}
              {t.mixinUses} times across {lower(t.mixinSteps.length)} steps.{' '}
              {t.carbonStyles} Carbon type styles are still applied directly,
              either because they are fluid (Carbon interpolates continuously
              across the viewport, which two modes cannot reproduce) or because
              they sit at a size the kit has no step for.{' '}
              <code>token-drift</code> reports that count on every run so the
              exception stays visible. Letter-spacing has no token: the kit does
              not model it.
            </p>
          </section>

          <section id="rules" className={styles.block}>
            <SectionHeading
              title="Rules"
              lede={
                <>
                  From the typography foundation contract, version{' '}
                  {t.contract.version}. Its variable count
                  {countMatches
                    ? `, ${t.contract.variableCount}, matches the stylesheet, and token-drift fails the build if the two part.`
                    : ` says ${t.contract.variableCount} but the stylesheet declares ${t.variableCount}; token-drift will fail until they agree.`}
                </>
              }
            />
            <DoDont
              dos={t.contract.rules.map(plain)}
              donts={t.contract.prohibitions.map(plain)}
            />
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading title="Next steps" />
            <NextCards>
              <NextCard href="/docs/components/typography" title="Typography component">
                The variants, their tags and the heading-level rule, rendered live.
              </NextCard>
              <NextCard href="/docs/foundations/tokens" title="Tokens">
                Every variable Graphite exposes, type included, and how to export them.
              </NextCard>
              <NextCard href="/docs/foundations/spacing" title="Spacing">
                The other rem scale, read from the same stylesheet.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}

function SpecimenRow({ s }: { s: Step }) {
  const fam = familyFor(s.step)
  return (
    <li className={styles.row}>
      <div className={styles.meta}>
        <code className={styles.stepName}>{s.step}</code>
        <span className={styles.stepValues}>
          {s.size} / {s.lineHeight} · {px(s.size)} / {px(s.lineHeight)}
        </span>
        {s.mobile ? (
          <span className={`${styles.stepValues} ${styles.stepMobile}`}>
            Mobile {px(s.mobile.size)} / {px(s.mobile.lineHeight)}
          </span>
        ) : null}
      </div>
      <span
        className={styles.sample}
        style={{
          fontFamily: `var(--graphite-font-${fam})`,
          fontSize: `var(--graphite-text-${s.step}-size)`,
          lineHeight: `var(--graphite-text-${s.step}-line-height)`,
        }}
      >
        {fam === 'mono' ? `var(--graphite-text-${s.step}-size)` : SAMPLE}
      </span>
    </li>
  )
}
