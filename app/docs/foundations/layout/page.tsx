import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DocSnippet } from '@/components/doc-snippet'
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
  minWidthOf,
  pick,
  readFoundationContract,
  readGlobalBackgroundSize,
  readKitBreakpoints,
  readRootVars,
  readScss,
  resolvePx,
  toPx,
  type ScssDecl,
} from '../spacing/read-foundation'
import { InlineCode } from '../spacing/inline-code'
import { BreakpointTable, type BreakpointRow } from './breakpoint-table'
import { TOC } from './toc'
import styles from './layout.module.scss'

export const metadata: Metadata = {
  title: 'Layout & grid · Graphite UI',
  description:
    'The five kit breakpoints, why they cannot drive a media query, how the docs and Create pages change at each one, and the 48px grid the site is drawn on.',
}

const DOCS_SHELL = 'components/docs-shell.module.scss'
const CREATE_PAGE = 'components/create/create-page.module.scss'
const PREVIEW = 'components/create/preview.tsx'

/** `16rem minmax(0, 1fr) 15rem` → `256 · fluid · 240`. */
function columns(value: string): string {
  return (value.match(/minmax\([^)]*\)|\S+/g) ?? [])
    .map((part) => {
      if (part.startsWith('minmax(') || part === '1fr') return 'fluid'
      const px = toPx(part.replace(/;$/, ''))
      return px === null ? part : String(px)
    })
    .join(' · ')
}

/**
 * One row per min-width at which any of the given declarations change, each
 * carrying the value in force at that width (inherited from the row before
 * when that width does not restate it).
 */
function steps(
  decls: Record<string, ScssDecl[]>,
): { from: number; values: Record<string, string | null> }[] {
  const widths = new Set<number>([0])
  for (const list of Object.values(decls))
    for (const d of list) {
      const w = minWidthOf(d.at)
      if (w !== null) widths.add(w)
    }
  const sorted = [...widths].sort((a, b) => a - b)
  const carried: Record<string, string | null> = {}
  return sorted.map((from) => {
    for (const [k, list] of Object.entries(decls)) {
      const hit = list.find((d) => minWidthOf(d.at) === from)
      if (hit) carried[k] = hit.value
      else if (!(k in carried)) carried[k] = null
    }
    return { from, values: { ...carried } }
  })
}

/** The Create preview's Tablet and Mobile frame widths, from preview.tsx. */
function readDeviceWidths(): { device: string; px: number }[] {
  const src = fs.readFileSync(path.join(process.cwd(), PREVIEW), 'utf8')
  return [...src.matchAll(/^\s*(tablet|mobile):\s*'(\d+)px'/gm)].map((m) => ({
    device: m[1],
    px: Number(m[2]),
  }))
}

/** The kit frame node ids named in the Create page stylesheet's header comment. */
function readCreateFrames(): { frame: string; node: string }[] {
  const src = fs.readFileSync(path.join(process.cwd(), CREATE_PAGE), 'utf8')
  const head = src.slice(0, 400)
  return [...head.matchAll(/(\d+:\d+)(?:\s+at)?\s+(X-Large|Medium|Small)/g)].map((m) => ({
    frame: m[2],
    node: m[1],
  }))
}

export default function LayoutPage() {
  const contract = readFoundationContract('breakpoint')
  const tokens = readRootVars('breakpoint')
  const kitModes = readKitBreakpoints()
  const space = readRootVars('space')

  // Prefer the more specific kit mode: `LG (1056px)` from the LG–XL
  // collection over the main collection's combined `LG–XL (1056–1312px)`.
  const rows: BreakpointRow[] = tokens.map((t) => {
    const px = toPx(t.value) ?? 0
    const modes = kitModes.filter((m) => m.px === px)
    const mode =
      modes.find((m) => m.collection !== 'Breakpoint') ?? modes[0] ?? null
    return {
      name: t.name,
      suffix: t.suffix,
      px,
      kitMode: mode ? mode.mode : 'not in kit',
    }
  })
  const bp = Object.fromEntries(rows.map((r) => [r.suffix, r.px]))
  const md = bp.md ?? 0

  // ---- page geometry, read from the stylesheets that set it
  const shell = readScss(DOCS_SHELL)
  const shellMax = pick(shell, '.shell', 'max-width')[0]?.value ?? ''
  const shellSteps = steps({
    cols: [
      ...pick(shell, '.shell', 'grid-template-columns'),
      ...pick(shell, '.withToc', 'grid-template-columns'),
    ],
    pad: pick(shell, '.content', 'padding'),
  })
  const create = readScss(CREATE_PAGE)
  const createSteps = steps({
    cols: pick(create, '.split', 'grid-template-columns'),
    pad: pick(create, '.page', 'padding'),
  })
  const createLede = pick(create, '.lede', 'max-width')[0]?.value ?? ''
  const devices = readDeviceWidths()
  const frames = readCreateFrames()
  const frameWidth: Record<string, number | undefined> = {
    Small: bp.sm,
    Medium: bp.md,
    'X-Large': bp.xl,
  }

  // ---- the grid backdrop, from all three places that draw it
  const grids = [
    { where: 'Home page hero', selector: '.hero__grid-lines', size: readGlobalBackgroundSize('.hero__grid-lines') },
    { where: 'Home page bands', selector: '.page-bands__grid', size: readGlobalBackgroundSize('.page-bands__grid') },
    { where: 'Create page', selector: '.grid', size: pick(create, '.grid', 'background-size')[0]?.value ?? null },
  ]
  const cell = grids.find((g) => g.size)?.size?.split(' ')[0] ?? '3rem'
  const cellPx = toPx(cell)
  const cellToken = space.find((s) => s.value === cell)

  const bandName = (from: number) => {
    const r = rows.find((x) => x.px === from)
    return from === 0 ? 'Base' : r ? `${r.suffix} (${from}px)` : `${from}px`
  }

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>{`md − 1 = ${md - 1}px`}</p>
            <p className={styles.footnoteBody}>
              A max-width bound sits one below the next breakpoint up.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/foundations/layout')} />
            <h1 className={styles.title}>Layout &amp; grid</h1>
            <p className={styles.lede}>
              {spell(rows.length)} breakpoints from the kit, a {cellPx}px grid the
              site is drawn on, and the page layouts built between them. The
              breakpoints are tokens, but a token cannot drive a media query, so
              this page also shows what to write instead.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`Contract ${contract.version}`}</StatusBadge>
              <StatusBadge tone="neutral">{`${rows.length} breakpoints`}</StatusBadge>
              <StatusBadge tone="success">{`${cellPx}px grid`}</StatusBadge>
            </div>
          </header>

          <section id="breakpoints" className={styles.block}>
            <SectionHeading
              title="Breakpoints"
              lede="Read from globals.scss and matched to the kit's Breakpoint modes. Resize the window and the marker follows."
            />
            <BreakpointTable rows={rows} />
            <p className={styles.note}>
              <code>lg</code> and <code>xl</code> are two tokens, not one. The
              kit keeps them in a separate <code>Breakpoint LG–XL</code>{' '}
              collection that the main one aliases into, and collapsing them
              would flatten that.
            </p>
          </section>

          <section id="media-queries" className={styles.block}>
            <SectionHeading
              title="Tokens and media queries"
              lede="The breakpoint tokens give the numbers one home. They cannot enforce them."
            />
            <Callout tone="warning" title="A custom property does not resolve in an @media condition.">
              {[
                'A rule written with var() in its condition silently never matches. Write the number literally. The tokens give the numbers one home, and JavaScript can read them.',
              ]}
            </Callout>
            <div className={styles.snippets}>
              <div>
                <p className={styles.snippetLabel}>Never matches</p>
                <DocSnippet code={'@media (max-width: var(--graphite-breakpoint-md)) {\n  /* ... */\n}'} />
              </div>
              <div>
                <p className={styles.snippetLabel}>What to write</p>
                <DocSnippet code={`@media (max-width: ${md - 1}px) {\n  /* ... */\n}`} />
              </div>
            </div>
          </section>

          <section id="page-layouts" className={styles.block}>
            <SectionHeading
              title="What changes where"
              lede="Read from the stylesheets of the two page layouts the site builds on. Widths in px; padding is top / sides / bottom."
            />
            <h3 className={styles.subhead}>Docs shell</h3>
            <RefTable
              caption="Docs shell layout by breakpoint"
              columns={[
                { label: 'From', tone: 'name' },
                { label: 'Columns', tone: 'type' },
                { label: 'Content padding', tone: 'muted' },
              ]}
              rows={shellSteps.map((s) => [
                bandName(s.from),
                s.values.cols ? columns(s.values.cols) : 'one column',
                s.values.pad ? resolvePx(s.values.pad) : '',
              ])}
            />
            <p className={styles.note}>
              The shell is capped at <code>{shellMax}</code> ({toPx(shellMax)}
              px) and centred. The sidebar arrives at <code>lg</code>; below
              it the docs links move into the header menu. The on-this-page rail
              is the third column, and only pages that have one get it. Prose
              on these pages is held to 44rem.
            </p>
            <h3 className={styles.subhead}>Create page</h3>
            <RefTable
              caption="Create page layout by breakpoint"
              columns={[
                { label: 'From', tone: 'name' },
                { label: 'Columns', tone: 'type' },
                { label: 'Page padding', tone: 'muted' },
              ]}
              rows={createSteps.map((s) => [
                bandName(s.from),
                s.values.cols
                  ? `${columns(s.values.cols)} (controls beside preview)`
                  : 'stacked, controls as a bar',
                s.values.pad ? resolvePx(s.values.pad) : '',
              ])}
            />
            <p className={styles.note}>
              The lede is held to <code>{createLede}</code>. Inside the preview,
              the Desktop / Tablet / Mobile toolbar sets a frame width (
              {devices.map((d, i) => (
                <span key={d.device}>
                  {i ? ', ' : ''}
                  {d.device} {d.px}px
                </span>
              ))}
              ) and the examples lay out by the frame&rsquo;s own width, not the
              window&rsquo;s. Type also changes at one boundary: below{' '}
              {md}px the text scale switches to the kit&rsquo;s Mobile mode (see{' '}
              <a href="/docs/foundations/typography">Typography</a>).
            </p>
          </section>

          <section id="grid" className={styles.block}>
            <SectionHeading
              title={`The ${cellPx}px grid`}
              lede={`The backdrop behind the home page and Create is one ${cell} cell drawn with 1px rules${cellToken ? `, the same length as ${cellToken.name}` : ''}.`}
            />
            <div
              className={styles.gridSpecimen}
              style={{ backgroundSize: `${cell} ${cell}` }}
              aria-hidden="true"
            >
              <span className={styles.gridCell} style={{ width: cell, height: cell }} />
            </div>
            <RefTable
              caption="Where the grid backdrop is drawn"
              columns={[
                { label: 'Where', tone: 'name' },
                { label: 'Rule', tone: 'muted' },
                { label: 'Cell', tone: 'type' },
              ]}
              rows={grids.map((g) => [
                g.where,
                g.selector,
                g.size ?? 'not found',
              ])}
            />
            <p className={styles.note}>
              The home page grid drifts with scroll and pointer, and the bands
              version fades at both ends. The Create page grid is static on
              purpose, so nothing moves under the controls while someone is
              dragging a slider. The grid is decorative: no component snaps to
              it, and content widths above come from the page stylesheets, not
              from a column count.
            </p>
          </section>

          <section id="frames" className={styles.block}>
            <SectionHeading
              title="The kit’s frames"
              lede="The kit draws each site page at three widths. The page stylesheets cite the frames they were built from."
            />
            <RefTable
              caption="Kit page frames"
              columns={[
                { label: 'Frame', tone: 'name' },
                { label: 'Width', tone: 'type' },
                { label: 'Create page node', tone: 'muted' },
              ]}
              rows={frames.map((f) => [
                f.frame,
                frameWidth[f.frame] ? `${frameWidth[f.frame]}px` : '',
                f.node,
              ])}
            />
            <p className={styles.note}>
              None of the page stylesheets cites a Large frame. Between{' '}
              <code>md</code> and <code>xl</code> the layouts are the
              code&rsquo;s own reading of the two frames either side, which is
              why the docs sidebar arriving at <code>lg</code> has no frame to
              point to.
            </p>
          </section>

          <section id="rules" className={styles.block}>
            <SectionHeading
              title="Usage rules"
              lede={`Quoted from the Breakpoint contract (${contract.version}).`}
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
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="The scale the gutters are built from, and the page that shows the layouts at every width."
            />
            <NextCards>
              <NextCard href="/docs/foundations/spacing" title="Spacing">
                The rem scale every gutter and padding above resolves through.
              </NextCard>
              <NextCard href="/docs/foundations/typography" title="Typography">
                The text scale, and its Mobile mode below md.
              </NextCard>
              <NextCard href="/create" title="Create">
                {`The preview’s device toolbar, on the ${cellPx}px grid.`}
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
