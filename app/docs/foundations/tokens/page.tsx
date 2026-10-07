import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { NotesList } from '@/components/component-page'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import {
  groupFoundations,
  readFoundations,
  remToPx,
  type Decl,
} from './read-tokens'
import {
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
    'Every variable Graphite exposes: the generated color roles and state families, the elevation and outline ladders, the foundation tokens, and how to export a theme.',
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
  shadow: 'The kit’s menu shadow, under every overlay.',
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
  const staticCount = groups.reduce((n, g) => n + g.decls.length, 0)
  const inline = groups.filter((g) => g.id !== 'text')
  const text = groups.find((g) => g.id === 'text')

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
              <StatusBadge tone="success">Light and dark</StatusBadge>
            </div>
          </header>

          <section id="layers" className={styles.block}>
            <SectionHeading
              title="Two layers"
              lede="Graphite’s variables come from two places. Both are --graphite-*, and both are in the theme file."
            />
            <NotesList
              rows={[
                [
                  '--graphite-* color',
                  'Generated by the color engine from your source color, for light and dark. Names come from the engine’s own role keys, so the list cannot drift from what it produces.',
                ],
                [
                  '--graphite-* foundations',
                  'Space, density, radius, breakpoints, motion and type, from the kit. They do not depend on the source color.',
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
              lede={`${staticCount} variables in ${groups.length} groups, the same in both themes. Mobile restates ${f.mobile.length} type values below ${(f.mobileMaxWidth ?? 0) + 1}px.`}
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
