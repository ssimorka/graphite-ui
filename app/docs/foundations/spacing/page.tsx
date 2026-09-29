import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ContainedList } from '@/components/ui/contained-list'
import { Tag } from '@/components/ui/tag'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { RefTable, Surface } from '@/components/component-page'
import { spell } from '@/lib/spell'
import {
  readConsumers,
  readFoundationContract,
  readKitSpacing,
  readRootVars,
  titleOf,
  toPx,
} from './read-foundation'
import { InlineCode } from './inline-code'
import { TOC } from './toc'
import styles from './spacing.module.scss'

export const metadata: Metadata = {
  title: 'Spacing · Graphite UI',
  description:
    'The fourteen-step spacing scale in rem, the three density steps components bind to, and the rules for reaching past them, read live from the tokens.',
}

const lower = (n: number) => spell(n).toLowerCase()

/** `1.5rem` → `1.5rem · 24px`; `0` stays `0`. */
const both = (value: string) => {
  const px = toPx(value)
  return value === '0' || px === null ? value : `${value} · ${px}px`
}

export default function SpacingPage() {
  const contract = readFoundationContract('spacing')
  const scale = readRootVars('space')
  const density = readRootVars('density')
  const kit = readKitSpacing()
  const consumers = readConsumers('density')

  const byName = Object.fromEntries(scale.map((s) => [s.name, s]))
  const matching = scale.filter((s) => toPx(s.value) === kit[s.suffix]).length

  // A density step is `var(--graphite-space-NN)`; follow it to the step so the
  // table shows the alias and the size it lands on.
  const steps = density.map((d) => {
    const alias = /var\((--graphite-space-\d{2})\)/.exec(d.value)?.[1] ?? ''
    const target = byName[alias]
    return { ...d, alias, px: target ? toPx(target.value) : null }
  })
  const taken = new Set(consumers.flatMap((c) => c.suffixes))
  const untaken = steps.filter((s) => !taken.has(s.suffix)).map((s) => s.suffix)

  // The step whose suffix looks like a pixel value but is not, for the naming
  // section. Step 02 is the contract's own example.
  const two = byName['--graphite-space-02']

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>1rem = 16px</p>
            <p className={styles.footnoteBody}>
              The scale is written in rem. The px figures on this page assume the
              default root size, and move with it.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb
              items={[
                { label: 'Docs', href: '/docs' },
                { label: 'Foundations' },
                { label: 'Spacing' },
              ]}
            />
            <h1 className={styles.title}>Spacing</h1>
            <p className={styles.lede}>
              {spell(scale.length)} raw steps and {lower(density.length)} semantic
              density steps that alias into them. Components bind to a density
              step where one fits and reach for a raw step only when none does.
              Every row below is read from <code>app/globals.scss</code> and the
              kit snapshot when the page is built, and every bar is drawn with
              the token itself.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`Contract ${contract.version}`}</StatusBadge>
              <StatusBadge tone="neutral">{`${scale.length} steps · ${density.length} density`}</StatusBadge>
              <StatusBadge tone="success">rem</StatusBadge>
            </div>
          </header>

          <section id="scale" className={styles.block}>
            <SectionHeading
              title="The scale"
              lede={`${matching} of ${scale.length} steps match the kit’s Spacing collection. The kit stores px; the code writes the same value in rem, at px over 16.`}
            />
            <table className={`${styles.table} ${styles.scale}`}>
              <caption className={styles.srOnly}>Spacing scale</caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Value</th>
                  <th scope="col" className={styles.wide}>
                    Kit
                  </th>
                  <th scope="col">
                    <span className={styles.srOnly}>Drawn at size</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {scale.map((s) => {
                  const k = kit[s.suffix]
                  const agrees = toPx(s.value) === k
                  return (
                    <tr key={s.name}>
                      <th scope="row">
                        <code>{s.name}</code>
                      </th>
                      <td className={styles.value}>{both(s.value)}</td>
                      <td className={styles.wide}>
                        {k === undefined ? (
                          <span className={styles.missing}>not in kit</span>
                        ) : (
                          <span className={agrees ? undefined : styles.missing}>
                            {`${k}px${agrees ? '' : ' (differs)'}`}
                          </span>
                        )}
                      </td>
                      <td className={styles.barCell}>
                        <span
                          className={styles.bar}
                          style={{ width: `var(${s.name})` }}
                          aria-hidden="true"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className={styles.note}>
              <code>--graphite-space-00</code> has no Carbon counterpart. The kit
              carries an explicit zero, so the code scale does too, and the rest
              of the steps keep Carbon&rsquo;s index.
            </p>
          </section>

          <section id="names" className={styles.block}>
            <SectionHeading
              title="Reading the names"
              lede="The suffix is a step index, not a size."
            />
            <Callout title={`--graphite-space-02 is step 2, which is ${toPx(two?.value ?? '') ?? '?'}px.`}>
              {[
                'The number after space- is Carbon’s step index. It grows with the size but is not the size, so read the value, never the name.',
                <>
                  Radius uses the opposite convention on purpose:{' '}
                  <code>--graphite-radius-2</code> is 2px. The two suffixes are
                  padded differently (<code>02</code> against <code>2</code>) so
                  the difference shows at a glance. See{' '}
                  <a href="/docs/foundations/radius#names">Radius</a>.
                </>,
              ]}
            </Callout>
          </section>

          <section id="density" className={styles.block}>
            <SectionHeading
              title="Density"
              lede={`${spell(steps.length)} semantic steps, each an alias into the raw scale. Change the alias and every component bound to that step moves with it.`}
            />
            <table className={`${styles.table} ${styles.density}`}>
              <caption className={styles.srOnly}>Density steps</caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Aliases</th>
                  <th scope="col">Size</th>
                  <th scope="col">
                    <span className={styles.srOnly}>Specimen</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s) => (
                  <tr key={s.name}>
                    <th scope="row">
                      <code>{s.name}</code>
                    </th>
                    <td>
                      <code>{s.alias}</code>
                    </td>
                    <td className={styles.value}>{s.px === null ? '' : `${s.px}px`}</td>
                    <td className={styles.specimenCell}>
                      {/* The inset is the token: the outer box is padded by it,
                          so what you see is the step, not a drawing of it. */}
                      <span
                        className={styles.inset}
                        style={{ padding: `var(${s.name})` }}
                        aria-hidden="true"
                      >
                        <span className={styles.insetCore} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section id="components" className={styles.block}>
            <SectionHeading
              title="Components that take density"
              lede={`Found by reading the governed component stylesheets for a density token. ${spell(consumers.length)} bind to one today.`}
            />
            <RefTable
              caption="Components bound to a density step"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'density prop', tone: 'type' },
                { label: 'What it pads', tone: 'text' },
              ]}
              rows={consumers.map((c) => [
                c.governed ? (
                  <a key="l" href={`/docs/components/${c.slug}`}>
                    {titleOf(c.slug)}
                  </a>
                ) : (
                  titleOf(c.slug)
                ),
                c.suffixes.join(' | '),
                c.slug === 'data-table'
                  ? 'Header and body cells, on every side.'
                  : c.slug === 'contained-list'
                    ? 'The row, on every side. Slot gaps stay on the raw scale.'
                    : 'Its own padding.',
              ])}
            />
            <div className={styles.specimens}>
              <Surface label={'density="compact"'}>
                <div className={styles.list}>
                  <ContainedList
                    density="compact"
                    title="Spacing scale"
                    description="Raw steps, in rem"
                    trailing={<Tag>{scale.length}</Tag>}
                  />
                  <ContainedList
                    density="compact"
                    title="Density"
                    description="Aliases into the scale"
                    trailing={<Tag>{density.length}</Tag>}
                  />
                </div>
              </Surface>
              <Surface label={'density="default"'}>
                <div className={styles.list}>
                  <ContainedList
                    title="Spacing scale"
                    description="Raw steps, in rem"
                    trailing={<Tag>{scale.length}</Tag>}
                  />
                  <ContainedList
                    title="Density"
                    description="Aliases into the scale"
                    trailing={<Tag>{density.length}</Tag>}
                  />
                </div>
              </Surface>
            </div>
            {untaken.length ? (
              <Callout
                tone="warning"
                title={`No component accepts ${untaken.map((u) => `density="${u}"`).join(' or ')} as a prop.`}
              >
                {[
                  <>
                    Both components take <code>compact</code> or{' '}
                    <code>default</code>. The{' '}
                    {untaken.map((u) => (
                      <code key={u}>--graphite-density-{u}</code>
                    ))}{' '}
                    step is declared and aliased, but the only place it shows up
                    is the <a href="/create">Create</a> page.
                  </>,
                  <>
                    Create&rsquo;s Density control re-binds{' '}
                    <code>--graphite-density-default</code> to the chosen step on
                    the preview root, so any component using the default follows
                    it without a prop, and the site around the preview does not
                    change. The example cards there also step their own padding
                    and gap with it. The exported CSS does not carry the density
                    choice.
                  </>,
                ]}
              </Callout>
            ) : null}
          </section>

          <section id="rules" className={styles.block}>
            <SectionHeading
              title="Usage rules"
              lede={`Quoted from the Spacing contract (${contract.version}), which token-drift checks against globals.scss.`}
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
                      <InlineCode text={r} />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <p className={styles.note}>
              One compromise is recorded in the contract rather than fixed. A
              handful of declarations in <code>globals.scss</code> use the scale
              for things that are not spacing: box-shadow blur and offset, and
              transform distances. The kit has no shadow or motion distance
              scale to borrow instead, so they stay tokenised until it does.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="The two foundations that sit closest to this one, and the place to try density live."
            />
            <NextCards>
              <NextCard href="/docs/foundations/radius" title="Radius">
                The other length scale, in px, where the suffix is the size.
              </NextCard>
              <NextCard href="/docs/foundations/layout" title="Layout & grid">
                Breakpoints, gutters and the 48px grid the site sits on.
              </NextCard>
              <NextCard href="/create" title="Create">
                Switch density and watch the components that take it follow.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
