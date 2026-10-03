import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Tag } from '@/components/ui/tag'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { RefTable } from '@/components/component-page'
import { COMPONENT_DOCS } from '@/components/component-doc/registry'
import { buildTheme, makeRamps } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { spell } from '@/lib/spell'
import { Pairings } from './pairings'
import { focusAtSeed, runSweep, SWEEP_SATURATION, SWEEP_VALUE } from './sweep'
import { TOC } from './toc'
import styles from './accessibility.module.scss'

export const metadata: Metadata = {
  title: 'Accessibility · Graphite UI',
  description:
    'How Graphite meets its contrast targets at AA and AAA, how that is measured, and what each component does for focus, motion and the keyboard, including the gaps that are still open.',
}

const lower = (n: number) => spell(n).toLowerCase()
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// ------------------------------------------------------------ repo reads
// Everything below is read when the page renders, so the page cannot describe a
// component, a stylesheet or a token that has since changed.

const UI_DIR = path.join(process.cwd(), 'components', 'ui')

/** Component slugs whose stylesheet contains `needle`. */
function stylesheetsWith(needle: string): Set<string> {
  return new Set(
    fs
      .readdirSync(UI_DIR)
      .filter((f) => f.endsWith('.module.scss'))
      .filter((f) => fs.readFileSync(path.join(UI_DIR, f), 'utf8').includes(needle))
      .map((f) => f.replace(/\.module\.scss$/, '')),
  )
}

/** The motion tokens as globals.scss declares them. */
function motionTokens(): { name: string; value: string }[] {
  const src = fs.readFileSync(path.join(process.cwd(), 'app', 'globals.scss'), 'utf8')
  return [...src.matchAll(/(--graphite-motion-[a-z-]+):\s*([^;]+);/g)].map((m) => ({
    name: m[1],
    value: m[2].trim(),
  }))
}

type Doc = { slug: string; name: string; a11y: [string, ReactNode][] }

function readDocs(): Doc[] {
  return Object.entries(COMPONENT_DOCS).map(([slug, config]) => {
    const c = config()
    return { slug, name: c.name, a11y: c.a11y }
  })
}

const row = (d: Doc, label: string) => d.a11y.find(([l]) => l === label)

const link = (d: Doc) => (
  <a className={styles.link} href={`/docs/components/${d.slug}#accessibility`}>
    {d.name}
  </a>
)

// The same source-on-a-status-hue case CLAUDE.md records: take the danger role
// the seed produces and feed it back in as the source.
function collapse() {
  const seedDanger = buildTheme('light', makeRamps(COVER_SOURCE_HEX)).tokens.danger.hex
  const t = buildTheme('light', makeRamps(seedDanger)).tokens
  return { source: seedDanger, primary: t.primary.hex, danger: t.danger.hex }
}

export default function AccessibilityPage() {
  const sweep = runSweep()
  const focus = focusAtSeed()
  const docs = readDocs()
  const ringed = stylesheetsWith('var(--graphite-focus)')
  const reduced = stylesheetsWith('prefers-reduced-motion')
  const motion = motionTokens()
  const red = collapse()

  const aa = sweep.targets.find((t) => t.kind === 'AA' && t.level === 'AA')
  const aaa = sweep.targets.find((t) => t.kind === 'AA' && t.level === 'AAA')
  const ui = sweep.targets.find((t) => t.kind === 'UI')
  const margin = Math.round((sweep.tightest.ratio / sweep.tightest.target - 1) * 100)

  // Keyboard: the page's own Keyboard note, or failing that the note that does
  // the same job there (Overlay files its keys under Escape, form fields under
  // Focus), or the first note.
  const keyboard = docs.map((d) => {
    const hit = row(d, 'Keyboard') ?? row(d, 'Escape') ?? row(d, 'Focus') ?? d.a11y[0]
    return [link(d), hit?.[0] ?? '', hit?.[1] ?? ''] as ReactNode[]
  })

  const ringedDocs = docs.filter((d) => ringed.has(d.slug))
  const otherFocus = docs.filter((d) => !ringed.has(d.slug) && row(d, 'Focus'))

  const motionRows = docs
    .filter((d) => row(d, 'Motion') || reduced.has(d.slug))
    .map((d) => [
      link(d),
      reduced.has(d.slug) ? 'Yes' : 'No',
      row(d, 'Motion')?.[1] ?? 'The page records no motion note.',
    ])

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>
              {sweep.pairs.toLocaleString('en-US')} pairs · {sweep.failures} failures
            </p>
            <p className={styles.footnoteBody}>
              Recomputed from lib/color.js each time this page is built, not
              copied from a note.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/accessibility')} />
            <h1 className={styles.title}>Accessibility</h1>
            <p className={styles.lede}>
              Contrast is enforced when colors are generated, not audited
              afterwards: every text role is measured against the surface it
              sits on before it becomes a CSS variable. Focus, motion and
              keyboard behavior are per component, and this page gathers what
              each one does, including where it falls short.
            </p>
            <div className={styles.badges}>
              {aa ? <StatusBadge tone="primary">{`AA ${aa.target}:1`}</StatusBadge> : null}
              {aaa ? <StatusBadge tone="neutral">{`AAA ${aaa.target}:1`}</StatusBadge> : null}
              {ui ? <StatusBadge tone="neutral">{`UI ${ui.target}:1`}</StatusBadge> : null}
            </div>
          </header>

          <section id="targets" className={styles.block}>
            <SectionHeading
              title="Contrast targets"
              lede="One setting, two levels. The level is part of the theme, so changing it changes what the engine generates rather than what a checker reports."
            />
            <table className={`${styles.table} ${styles.targets}`}>
              <caption className={styles.srOnly}>Contrast targets by level</caption>
              <thead>
                <tr>
                  <th scope="col">Level</th>
                  <th scope="col">Text on its surface</th>
                  <th scope="col">Outline on surface</th>
                </tr>
              </thead>
              <tbody>
                {[aa, aaa].map((t) =>
                  t ? (
                    <tr key={t.level}>
                      <th scope="row">{t.level}</th>
                      <td>{t.target}:1</td>
                      <td>{ui?.target}:1</td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
            <p className={styles.note}>
              The level lives in the theme provider as <code>level</code>, next
              to the source color and the light or dark theme, and defaults to
              AA. The source control in the header sets it for the whole site,
              and so does the switch below. The outline target stays at{' '}
              {ui?.target}:1 at both levels: WCAG asks 3:1 of non-text contrast
              and has no enhanced step for it.
            </p>
          </section>

          <section id="pairings" className={styles.block}>
            <SectionHeading
              title="Pairings"
              lede="Each on-color is measured against the fill it is written for. These are the live ratios for the source in the header."
            />
            <Pairings />
            <p className={styles.note}>
              The ratio is WCAG 2&rsquo;s relative-luminance formula, computed by{' '}
              <code>contrastRatio</code> in <code>lib/color.js</code> and rounded
              to one decimal. Status pairs cover all four statuses, base and
              container, so a Notification or a Tag is measured the same way as
              a Button.
            </p>
          </section>

          <section id="verification" className={styles.block}>
            <SectionHeading
              title="Verification"
              lede="The table above is one source. This is every hue, run through the same engine when the page was built."
            />
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>Pairs measured</dt>
                <dd>{sweep.pairs.toLocaleString('en-US')}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Below target</dt>
                <dd>{sweep.failures}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Repaired by auto-fix</dt>
                <dd>{sweep.repairs}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Tightest margin</dt>
                <dd>{margin}%</dd>
              </div>
            </dl>
            <p className={styles.note}>
              {sweep.hues} source hues, evenly spaced round the wheel, times{' '}
              {lower(sweep.modes)} modes, times {lower(sweep.levels)} levels,
              times {sweep.pairsPerTheme} pairings each. Every source is taken at
              saturation {SWEEP_SATURATION} and value {SWEEP_VALUE}, so this
              covers the hue wheel, not every possible hex. Failures are counted
              with auto-fix off, which is what the engine produces unaided. The
              pair with the least room is <code>{kebab(sweep.tightest.role)}</code> on{' '}
              <code>{kebab(sweep.tightest.against)}</code> ({sweep.tightest.mode},{' '}
              {sweep.tightest.level}, source {sweep.tightest.source.toUpperCase()}) at{' '}
              {sweep.tightest.ratio}:1 against a {sweep.tightest.target}:1
              target.
            </p>
            <Callout title="Auto-fix exists, and it never fires.">
              {[
                <>
                  <code>buildTheme</code> takes an <code>autoFix</code> flag. When
                  a pair misses its target, it walks the same ramp to the nearest
                  tone that clears it, so a repaired color is still a step of the
                  role&rsquo;s own ramp rather than a new hue.
                </>,
                'No input tested has ever given it anything to do. The project notes record the same sweep by hand (6,144 pairs, zero failures, zero repairs), and the figures above recompute it. That is correct behavior, not a broken switch, so do not expect toggling it to change anything visible without testing the actual source first.',
              ]}
            </Callout>
          </section>

          <section id="focus" className={styles.block}>
            <SectionHeading
              title="Focus"
              lede="One ring color for the whole system, generated like every other role."
            />
            <div className={styles.focusRow}>
              {focus.map((f) => (
                <figure key={f.mode} className={styles.focusSpec}>
                  <span
                    className={styles.focusSwatch}
                    style={{ outlineColor: f.hex }}
                    aria-hidden="true"
                  />
                  <figcaption>
                    <span className={styles.focusMode}>{f.mode}</span>
                    <code>
                      {f.ramp} {f.tone} · {f.hex.toUpperCase()}
                    </code>
                    <span>{f.surface}:1 on surface</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className={styles.note}>
              <code>--graphite-focus</code> is the primary family&rsquo;s focus
              state: its own ramp at tone {focus.find((f) => f.mode === 'light')?.tone}{' '}
              in light and {focus.find((f) => f.mode === 'dark')?.tone} in dark,
              shown here at the default source. Across the sweep its lowest
              contrast against surface or background is {sweep.focusMin}:1, so it
              clears the {ui?.target}:1 non-text target at every hue tested.
            </p>
            <p className={styles.note}>
              {spell(ringedDocs.length)} components draw it as their focus ring (read from their
              stylesheets):{' '}
              {ringedDocs.map((d, i) => (
                <span key={d.slug}>
                  {i ? ', ' : ''}
                  {link(d)}
                </span>
              ))}
              . The rest show focus another way, in their own words:
            </p>
            <RefTable
              caption="Components that show focus without the shared ring"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'Focus', tone: 'text' },
              ]}
              rows={otherFocus.map((d) => [link(d), row(d, 'Focus')![1]])}
            />
          </section>

          <section id="motion" className={styles.block}>
            <SectionHeading
              title="Motion"
              lede="Short, shared, and switched off per component under prefers-reduced-motion."
            />
            <table className={`${styles.table} ${styles.tokens}`}>
              <caption className={styles.srOnly}>Motion tokens</caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {motion.map((m) => (
                  <tr key={m.name}>
                    <th scope="row">
                      <code>{m.name}</code>
                    </th>
                    <td>
                      <code>{m.value}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.note}>
              The tokens do not change under reduced motion. Each component that
              moves carries its own <code>prefers-reduced-motion</code> block,
              and so do the page-level effects in <code>globals.scss</code> (the
              scroll reveal, the hero parallax and the cover fade). Most drop
              the animation outright; the Progress bar slows its sweep instead,
              so an indeterminate bar still reads as working.
            </p>
            <RefTable
              caption="Component motion under reduced motion"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'Reduced-motion rule', tone: 'muted' },
                { label: 'What moves', tone: 'text' },
              ]}
              rows={motionRows}
            />
          </section>

          <section id="keyboard" className={styles.block}>
            <SectionHeading
              title="Keyboard"
              lede="The keyboard note from every governed component's page. Each links to that page's full Accessibility section."
            />
            <RefTable
              caption="Keyboard behavior by component"
              columns={[
                { label: 'Component', tone: 'name' },
                { label: 'Note', tone: 'muted' },
                { label: 'Behavior', tone: 'text' },
              ]}
              rows={keyboard}
            />
            <p className={styles.note}>
              Where a page has no Keyboard note, the row shows the closest one:
              Overlay files its keys under Escape, Breadcrumb and the text
              fields under Focus, and a component with nothing to operate shows
              its first note. Native elements
              (Button, Checkbox, Radio button group, Select, Toggle) bring the
              platform&rsquo;s keyboard behavior with them, which is why their
              rows are short.
            </p>
          </section>

          <section id="color-alone" className={styles.block}>
            <SectionHeading
              title="Color never works alone"
              lede="Status hue is pinned, so red still reads as danger whatever the source. That same pinning means a source on a status hue collapses the two."
            />
            <div className={styles.collapse}>
              {(
                [
                  ['primary', red.primary],
                  ['danger', red.danger],
                ] as const
              ).map(([role, hex]) => (
                <figure key={role} className={styles.collapseSpec}>
                  <span
                    className={styles.collapseSwatch}
                    style={{ background: hex }}
                    aria-hidden="true"
                  />
                  <figcaption>
                    <code>{role}</code> <span>{hex.toUpperCase()}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className={styles.note}>
              Light theme, with the source set to {red.source.toUpperCase()} (the
              danger role the default source produces). This is inherent to
              pinning the status hue, not a bug. The rule that follows is that
              status is never carried by color alone: a Notification shows status
              through its container tone, a status-colored edge and its words, and a Tag&rsquo;s label has to say
              what its color only reinforces.
            </p>
            <div className={styles.tags}>
              <Tag variant="danger">Failed</Tag>
              <Tag variant="warning">Needs review</Tag>
              <Tag variant="success">Passed</Tag>
            </div>
          </section>

          <section id="known-gaps" className={styles.block}>
            <SectionHeading
              title="Known gaps"
              lede="What is still open. The first pass of these pages found more; overlay stacking, Tabs and Menu keyboard support, the Breadcrumb focus ring, form error borders and the font fallback have since been fixed."
            />
            <ul className={styles.gaps}>
              <li>
                <strong>Menu has no sub-menus.</strong> The contract names the
                slot, but nested menus are not built, so a Menu is one level
                deep. See{' '}
                <a className={styles.link} href="/docs/components/menu#anatomy">
                  Menu
                </a>
                .
              </li>
              <li>
                <strong>Breadcrumb&rsquo;s overflow expands in place.</strong> The
                collapsed crumbs are reachable, but the kit opens them in a menu
                and the code shows them inline. See{' '}
                <a className={styles.link} href="/docs/components/breadcrumb#accessibility">
                  Breadcrumb
                </a>
                .
              </li>
              <li>
                <strong>An interactive Contained list row is visual only.</strong>{' '}
                <code>interactive</code> adds hover and a pointer; the row takes
                no focus, so the caller supplies the link or button inside it.
                See{' '}
                <a className={styles.link} href="/docs/components/contained-list#accessibility">
                  Contained list
                </a>
                .
              </li>
              <li>
                <strong>The sweep is a sample.</strong> It covers the hue wheel
                at one saturation and value. A source far from that (very pale,
                very dark) is not in it, which is why the pairings table above
                measures whatever source is actually set.
              </li>
            </ul>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="Where the numbers on this page come from, and what enforces them."
            />
            <NextCards>
              <NextCard href="/docs/theming" title="Theming">
                How one source color becomes the roles measured above.
              </NextCard>
              <NextCard href="/docs/governance" title="Governance">
                Contracts, the kit, and the checks a change has to pass.
              </NextCard>
              <NextCard href="/gallery" title="Components">
                {`${spell(docs.length)} governed components, each with its own Accessibility section.`}
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
