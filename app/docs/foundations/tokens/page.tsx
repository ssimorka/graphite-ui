import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { DocSnippet } from '@/components/doc-snippet'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { NotesList, RefTable } from '@/components/component-page'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import {
  groupFoundations,
  readFoundations,
  readSnapshot,
  remToPx,
  type Decl,
} from './read-tokens'
import {
  CarbonLayer,
  ExportExcerpt,
  RoleCount,
  LadderTable,
  RoleTable,
  StampedSummary,
  StateFamilies,
  StateTable,
} from './live-tokens'
import { TOC } from './toc'
import styles from './tokens-page.module.scss'

export const metadata: Metadata = {
  title: 'Tokens · Graphite UI',
  description:
    'Every variable Graphite exposes: the generated color roles and state families, the foundation tokens, the Carbon compatibility layer, how to export a theme, and the snapshot that keeps it honest.',
}

// Why each foundation group is shaped the way it is. The members and values
// come from app/globals.scss; these sentences are the part a person wrote.
const GROUP_NOTES: Record<string, string> = {
  space:
    'In rem. The suffix is Carbon’s step index, not a size: --graphite-space-02 is 4px, not 2px.',
  density:
    'Aliases onto the space scale, so components that bind here move together from one edit.',
  radius:
    'In px, and the suffix is the pixel value, deliberately unlike space. Graphite components take their corners from radius-none.',
  breakpoint:
    'Reference values. A custom property cannot be used in a media query, so these are for reading from script; the @media rules carry their numbers literally.',
  motion: 'The site’s easing and durations, plus the indeterminate sweep Progress bar uses.',
  font: 'Three roles. font-1 and font-2 hold the same face today and have no fallback stack.',
  weight: 'The kit stores style names; the number is mapped once, here.',
  text: 'Desktop values. The Mobile block restates only the steps that change.',
  scrim:
    'A pre-hydration fallback only. ThemeProvider overwrites it on every source change with an alpha over the darkest neutral, so the veil carries the source color.',
}

const GROUP_LINKS: Record<string, string> = {
  space: '/docs/foundations/spacing',
  density: '/docs/foundations/spacing',
  radius: '/docs/foundations/radius',
  breakpoint: '/docs/foundations/layout',
  font: '/docs/foundations/typography',
  weight: '/docs/foundations/typography',
  text: '/docs/foundations/typography',
}

function Preview({ group, d }: { group: string; d: Decl }) {
  if (group === 'space')
    return <span className={styles.bar} style={{ width: `var(${d.name})` }} aria-hidden="true" />
  if (group === 'radius')
    return <span className={styles.corner} style={{ borderRadius: `var(${d.name})` }} aria-hidden="true" />
  if (group === 'font')
    return (
      <span className={styles.fontSample} style={{ fontFamily: `var(${d.name})` }}>
        Aa Gg 0123
      </span>
    )
  return null
}

function FoundationTable({ id, title, decls }: { id: string; title: string; decls: Decl[] }) {
  const preview = id === 'space' || id === 'radius' || id === 'font'
  return (
    <table className={styles.table}>
      <caption className="cds--visually-hidden">{`${title} tokens`}</caption>
      <thead>
        <tr>
          <th scope="col">Variable</th>
          <th scope="col">Value</th>
          {preview ? (
            <th scope="col" className={styles.previewCell}>
              Preview
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {decls.map((d) => {
          const px = remToPx(d.value)
          const shown =
            d.note ?? (d.value.endsWith('rem') && px !== null ? `${px}px` : undefined)
          return (
            <tr key={d.name}>
              <th scope="row">{d.name}</th>
              <td>
                <span className={styles.value}>{d.value}</span>
                {shown && shown !== d.value ? ` · ${shown}` : ''}
              </td>
              {preview ? (
                <td className={styles.previewCell}>
                  <Preview group={id} d={d} />
                </td>
              ) : null}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function TokensPage() {
  const f = readFoundations()
  const groups = groupFoundations(f.desktop).filter((g) => g.decls.length)
  const inline = groups.filter((g) => g.id !== 'text')
  const text = groups.find((g) => g.id === 'text')
  const snap = readSnapshot()
  const checked = snap.collections.filter((c) => c.checked)
  const checkedVars = checked.reduce((n, c) => n + c.count, 0)

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>source {COVER_SOURCE_HEX.toUpperCase()}</p>
            <p className={styles.footnoteBody}>
              The seeded default. Change the source in the header and every
              color on this page is recomputed.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/foundations/tokens')} />
            <h1 className={styles.title}>Tokens</h1>
            <p className={styles.lede}>
              The complete list of what Graphite exposes as CSS variables. Color
              is generated in the browser from one source color; everything
              else is declared once in <code>app/globals.scss</code> and checked
              against the kit. Nothing below is typed into the page: the colors
              come from the engine and the rest is read from the stylesheet when
              the page is built.
            </p>
            <div className={styles.badges}>
              <RoleCount />
              <StatusBadge tone="neutral">{`${f.desktop.length} foundation tokens`}</StatusBadge>
              <StatusBadge tone="success">Light and dark</StatusBadge>
            </div>
          </header>

          <section id="layers" className={styles.block}>
            <SectionHeading
              title="Three layers"
              lede="Graphite’s variables come from three places, and only one of them is meant for your code."
            />
            <NotesList
              rows={[
                [
                  '--graphite-* color',
                  'Generated by the color engine and stamped on the page root by ThemeProvider whenever the source or theme changes. Names are derived from the engine’s own role keys, so the list cannot drift from what it produces.',
                ],
                [
                  '--graphite-* foundations',
                  'Space, density, radius, breakpoints, motion and type. Declared in app/globals.scss from the kit’s collections; they do not depend on the source color.',
                ],
                [
                  '--cds-*',
                  'Carbon’s variables, rebound to generated values so Carbon’s own components pick up the theme. A compatibility layer: read --graphite-* instead.',
                ],
              ]}
            />
          </section>

          <section id="color-roles" className={styles.block}>
            <SectionHeading
              title="Color roles"
              lede={
                <>
                  Every role the engine resolves, with the ramp and tone it came
                  from, in both themes. The theme on screen is marked active in
                  the column head. How the roles are chosen is on{' '}
                  <a href="/docs/theming">Theming</a>; the ramps are on{' '}
                  <a href="/docs/foundations/color">Color</a>.
                </>
              }
            />
            <RoleTable />
          </section>

          <section id="states" className={styles.block}>
            <SectionHeading
              title="Interaction states"
              lede={
                <>
                  The families that carry a full state set are{' '}
                  <StateFamilies />. States are tone steps on the family&rsquo;s
                  own ramp, not opacity overlays; disabled drops to the neutral
                  ramp so it reads the same in every family. The focus ring and
                  the scrim close the list.
                </>
              }
            />
            <StateTable />
          </section>

          <section id="ladders" className={styles.block}>
            <SectionHeading
              title="Elevation and outline ladders"
              lede={
                <>
                  Two short ladders the kit files beside the roles rather than among
                  them. Elevation runs from the ground (00) through the resting
                  layer (01) to hover (02) and pressed (03); in light, 01 equals
                  the ground, because the ramp has no tone between 98 and 90.
                  Outline strength runs from subtle, for decorative rules, to
                  strong, for load-bearing edges such as a field&rsquo;s bottom
                  rule.
                </>
              }
            />
            <LadderTable />
            <StampedSummary />
          </section>

          <section id="foundations" className={styles.block}>
            <SectionHeading
              title="Foundation tokens"
              lede={`${f.desktop.length} variables in ${groups.length} groups, the same in both themes. Mobile restates ${f.mobile.length} type values below ${(f.mobileMaxWidth ?? 0) + 1}px.`}
            />
            <div className={styles.groups}>
              {inline.map((g) => (
                <div key={g.id} className={styles.group}>
                  <h3 className={styles.groupTitle}>
                    {g.title} · {g.decls.length}
                  </h3>
                  <p className={styles.note}>
                    {GROUP_NOTES[g.id]}
                    {GROUP_LINKS[g.id] ? (
                      <>
                        {' '}
                        <a href={GROUP_LINKS[g.id]}>More on this</a>.
                      </>
                    ) : null}
                  </p>
                  <FoundationTable id={g.id} title={g.title} decls={g.decls} />
                </div>
              ))}
              {text ? (
                <div className={styles.group}>
                  <h3 className={styles.groupTitle}>
                    {text.title} · {text.decls.length}
                  </h3>
                  <p className={styles.note}>
                    {GROUP_NOTES.text} Each is shown set in its own step on{' '}
                    <a href="/docs/foundations/typography">Typography</a>.
                  </p>
                  <Accordion type="single" collapsible>
                    <AccordionItem title={`Show the ${text.decls.length} type step values`}>
                      <FoundationTable id="text" title={text.title} decls={text.decls} />
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : null}
            </div>
          </section>

          <section id="carbon" className={styles.block}>
            <SectionHeading
              title="Carbon compatibility"
              lede="The site still renders some Carbon components, and Carbon reads its own --cds-* variables. ThemeProvider rewrites those from the same bundle, so Carbon pieces follow the source color too."
            />
            <CarbonLayer />
            <Callout title="Read --graphite-*, not --cds-*.">
              {[
                'The Carbon names are a hand-listed binding table, so unlike --graphite-* they can drift from what the engine produces. Carbon also has no slot for some generated roles (text on a status container, for one), which is why --graphite-* exists.',
                'While the variables are rewritten, the page root carries an is-retheming class for one frame. Carbon ships a background transition on buttons, and without it they strand on the previous color.',
              ]}
            </Callout>
          </section>

          <section id="export" className={styles.block}>
            <SectionHeading
              title="Exporting"
              lede={
                <>
                  <a href="/create">Create</a>&rsquo;s <strong>Get the code</strong>{' '}
                  hands you the theme as CSS or JSON, from the engine&rsquo;s own
                  exporter, so what you take is what the site resolves. This
                  excerpt is that exporter, run live for the current source.
                </>
              }
            />
            <ExportExcerpt />
            <Callout title="Get the code is a whole theme, not only colors.">
              {[
                'Above these color blocks it writes the foundations (space, density, radius, breakpoints, motion and type, read from the same stylesheet the site uses), with any radius, density or typeface chosen in Create written in place. The file needs no Graphite runtime, so it is the theme a project keeps.',
              ]}
            </Callout>
          </section>

          <section id="snapshot" className={styles.block}>
            <SectionHeading
              title="Snapshot and drift"
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
              engine computes color rather than declaring it; the{' '}
              <a href="/docs/foundations/color#divergence">Color page</a>{' '}
              compares the engine with the kit&rsquo;s primitives instead. The
              check reads a committed file and never the network, so it runs
              offline in CI. The other side of that is that re-extracting the
              snapshot from Figma is still a manual step: token-drift catches the
              stylesheet drifting from the snapshot, not the snapshot drifting
              from Figma. The <a href="/docs/governance">Governance</a> page has
              the other two checks.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading title="Next steps" />
            <NextCards>
              <NextCard href="/create" title="Create">
                Pick a source color and take the theme with Get the code.
              </NextCard>
              <NextCard href="/docs/theming" title="Theming">
                How one source color becomes the ramps and roles listed here.
              </NextCard>
              <NextCard href="/docs/foundations/typography" title="Typography">
                The type steps, set in their own sizes.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
