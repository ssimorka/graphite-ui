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
import { readKitStats } from '@/lib/kit-stats'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { spell } from '@/lib/spell'
import {
  buildTheme,
  makeRamps,
  STATE_FAMILIES,
  TONE_STOPS,
} from '@/lib/color.js'
import { IntroductionSpecimen } from './introduction-specimen'
import { TOC } from './toc'
import styles from './introduction.module.scss'

export const metadata: Metadata = {
  title: 'Introduction · Graphite UI',
  description:
    'What Graphite UI is: one source color resolved into ramps, roles and both themes, a set of governed components held to written contracts, and an honest account of where it stands.',
}

const lower = (n: number) => spell(n).toLowerCase()

/**
 * What the engine produces from one colour, counted rather than stated. The
 * seed is as good an input as any: the shape of the output (how many ramps,
 * roles and checked pairings) does not depend on the hex, only the values do.
 */
function engineShape() {
  const ramps = makeRamps(COVER_SOURCE_HEX)
  const light = buildTheme('light', ramps)
  return {
    ramps: Object.keys(ramps).length,
    stops: TONE_STOPS.length,
    roles: Object.keys(light.tokens).length,
    pairings: Object.keys(light.contrast).length,
    families: STATE_FAMILIES.length,
  }
}

/**
 * The numbered governance rules in docs/contracts/README.md. Read, because the
 * list has grown twice in a month (6 in #128, 8 in #133) and a typed count is
 * the first thing on a page to go stale.
 */
function countRules() {
  const src = fs.readFileSync(
    path.join(process.cwd(), 'docs', 'contracts', 'README.md'),
    'utf8',
  )
  const block = src.split('**Rules:**')[1]?.split(/\n#{2,3} /)[0] ?? ''
  return block.split('\n').filter((l) => /^\d+\.\s/.test(l)).length
}

/**
 * How much of the site still imports @carbon/react, as the status section's
 * measure of the migration. Icons are a separate package and not counted: the
 * migration plan is about Carbon's components and theme layer.
 */
function countCarbonFiles() {
  const hits: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(p)
      else if (/\.tsx?$/.test(entry.name)) {
        if (/from '@carbon\/react'/.test(fs.readFileSync(p, 'utf8'))) hits.push(p)
      }
    }
  }
  for (const d of ['app', 'components']) walk(path.join(process.cwd(), d))
  return hits.length
}

/** The framework versions as package.json pins them. */
function readStack() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
  ) as { dependencies: Record<string, string> }
  const major = (dep: string) =>
    (pkg.dependencies[dep] ?? '').replace(/^[^\d]*/, '').split('.')[0]
  return { next: major('next'), react: major('react') }
}

function readKitFile() {
  const snap = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'docs', 'tokens', 'figma-components.json'),
      'utf8',
    ),
  ) as { source: { file: string } }
  return `https://www.figma.com/design/${snap.source.file}/Graphite-UI-Kit`
}

export default function IntroductionPage() {
  const kit = readKitStats()
  const e = engineShape()
  const rules = countRules()
  const carbonFiles = countCarbonFiles()
  const stack = readStack()
  const kitUrl = readKitFile()

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>
              {`${kit.governed} contracts · ${kit.checks} checks`}
            </p>
            <p className={styles.footnoteBody}>
              Every number on this page is read from the repo or computed by the
              engine when the page builds.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs')} />
            <h1 className={styles.title}>Introduction</h1>
            <p className={styles.lede}>
              Graphite UI turns one source color into a full theme:{' '}
              {lower(e.ramps)} color scales, {lower(e.roles)} named roles, and
              light and dark themes, with contrast checked on the text and UI
              pairings. {spell(kit.governed)} components are built on those
              roles. Each has a written spec, called a contract, that automated
              checks hold the code to.
            </p>
            <p className={styles.lede}>
              New to ramps, roles and tones? See the{' '}
              <a href="/docs/glossary">glossary</a>.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`${e.ramps} ramps · ${e.roles} roles`}</StatusBadge>
              <StatusBadge tone="success">{`${kit.governed} governed components`}</StatusBadge>
              <StatusBadge tone="neutral">No npm package</StatusBadge>
            </div>
          </header>

          <section id="what-it-is" className={styles.block}>
            <SectionHeading
              title="What Graphite is"
              lede="A color engine, a component library that reads what it emits, and a Figma kit both are held to."
            />
            <IntroductionSpecimen />
            <div className={styles.prose}>
              <p>
                You give it a hex. The engine resolves it in OKLab and samples{' '}
                {lower(e.ramps)} ramps at {lower(e.stops)} fixed tone stops each.
                Two follow the source (accent, and a secondary set 120° round the
                hue wheel), two are neutrals tinted by it, and four carry status
                (danger, warning, success, info), pinned to their own hue so red
                still reads as danger whatever you pick.
              </p>
              <p>
                From the ramps it assigns {lower(e.roles)} roles such as{' '}
                <code>primary</code>, <code>surface</code> and{' '}
                <code>onPrimaryContainer</code>, once for each theme, and
                measures {lower(e.pairings)} foreground and background pairings
                against the contrast target you choose (AA or AAA). The{' '}
                {lower(e.families)} interactive families also get hover,
                pressed, selected, disabled and focus states, taken as tone
                steps on the same ramp rather than opacity overlays.
              </p>
              <p>
                The result lands on the page as <code>--graphite-*</code> CSS
                variables, and every governed component styles itself from those
                and nothing else. Change the source and the whole site repaints,
                including this page.
              </p>
            </div>
            <Callout title="A source on a status hue collapses the two.">
              <>
              Pick a red and <code>primary</code> resolves to nearly the same
              value as <code>danger</code>. That follows from pinning status
              hues, and it is why no component lets color alone carry status
              meaning.
              </>
            </Callout>
          </section>

          <section id="built-from" className={styles.block}>
            <SectionHeading
              title="What it is built from"
              lede="Four parts, and the order of authority between them matters."
            />
            <table className={`${styles.table} ${styles.parts}`}>
              <tbody>
                <tr>
                  <th scope="row">Site</th>
                  <td>
                    Next.js {stack.next} on the App Router, React {stack.react},
                    TypeScript and SCSS modules. The dev server runs under
                    webpack, because Turbopack breaks on the project&rsquo;s Sass.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Engine</th>
                  <td>
                    <code>lib/color.js</code>, plain JavaScript with no
                    dependencies. <code>components/theme-provider.tsx</code>{' '}
                    runs it on every change of source, theme or contrast target
                    and writes the variables onto <code>&lt;html&gt;</code>.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Figma kit</th>
                  <td>
                    <a href={kitUrl}>The Graphite UI Kit</a>, and it is canonical:
                    where the kit and a contract disagree, the kit wins and the
                    contract is corrected. The committed snapshot covers{' '}
                    {kit.pages} pages and {kit.sets} component sets, {kit.publicSets}{' '}
                    of them public.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Components</th>
                  <td>
                    {spell(kit.governed)} governed components in{' '}
                    <code>components/ui</code>, each with a versioned contract in{' '}
                    <code>docs/contracts</code> that declares the roles and
                    variables it may use.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="governance" className={styles.block}>
            <SectionHeading
              title="How it is governed"
              lede="Written rules, checked by machines, with the kit as the reference."
            />
            <div className={styles.prose}>
              <p>
                There are {lower(rules)} governance rules. The short version: a
                component has exactly one contract, the contract changes before
                the code does, contracts are versioned with semver, and every
                component set in the kit is either governed by a contract or
                labelled as ungoverned where it lives.
              </p>
              <p>
                {spell(kit.checks)} checks enforce this in CI. One holds each
                component to the variables its contract declares, one holds the
                foundations to the kit&rsquo;s token snapshot, and one holds the{' '}
                {kit.docs} component docs to the kit&rsquo;s component snapshot.
                All of them read committed snapshots, so they run offline.{' '}
                <code>main</code> is protected: every change lands through a pull
                request with the <code>governance</code> job green.
              </p>
            </div>
            <p className={styles.more}>
              <a href="/docs/governance">Read the rules and how the checks work</a>
            </p>
          </section>

          <section id="whats-here" className={styles.block}>
            <SectionHeading
              title="What is here"
              lede="Where to go next, by what you came to do."
            />
            <NextCards>
              <NextCard href="/docs/installation" title="Installation">
                Run the project locally, and the checks a change has to pass.
              </NextCard>
              <NextCard href="/docs/quick-start" title="Quick start">
                Pick a color, use a component, style with the variables, take
                the tokens out.
              </NextCard>
              <NextCard href="/docs/theming" title="Theming">
                {`How one source becomes ${lower(e.ramps)} ramps and ${lower(e.roles)} roles, and how the roles are meant to be used.`}
              </NextCard>
              <NextCard href="/docs/accessibility" title="Accessibility">
                What the contrast checks guarantee, and the known gaps they do
                not cover.
              </NextCard>
              <NextCard href="/docs/governance" title="Governance">
                {`The ${lower(rules)} rules, the ${lower(kit.checks)} checks, and why the kit outranks the contracts.`}
              </NextCard>
              <NextCard href="/docs/foundations/color" title="Foundations">
                Color, typography, spacing, radius, layout and the full token
                list.
              </NextCard>
              <NextCard href="/gallery" title="Components">
                {`All ${lower(kit.governed)} governed components, each with its contract version beside it.`}
              </NextCard>
              <NextCard href="/create" title="Create">
                Build a theme against a live preview, then take it away as CSS or
                JSON.
              </NextCard>
              <NextCard href="/docs/foundations/tokens" title="Tokens">
                Every variable the system defines, generated and static.
              </NextCard>
            </NextCards>
          </section>

          <section id="status" className={styles.block}>
            <SectionHeading
              title="Status"
              lede="What works today, and what does not exist yet."
            />
            <table className={`${styles.table} ${styles.parts}`}>
              <tbody>
                <tr>
                  <th scope="row">Distribution</th>
                  <td>
                    There is no npm package and no registry command. Using
                    Graphite means working in this repository, or taking the
                    generated theme out of <a href="/create">Create</a> as CSS
                    or JSON.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Carbon</th>
                  <td>
                    The site began on IBM&rsquo;s Carbon and is moving off it.
                    The docs shell, the component pages and Create are built,
                    but {carbonFiles} files still import{' '}
                    <code>@carbon/react</code>: the header&rsquo;s source picker,
                    the home page sections, and the theme provider itself. The
                    engine still emits <code>--cds-*</code> variables alongside{' '}
                    <code>--graphite-*</code> so those parts follow the theme.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Components</th>
                  <td>
                    {`${spell(kit.governed)} governed. The kit ships ${kit.publicSets} public component sets, and anything without a contract is labelled ungoverned in the kit rather than hidden.`}
                  </td>
                </tr>
              </tbody>
            </table>
            <Callout tone="warning" title="De-Carboning is the next step, not a finished one.">
              <>
              The migration plan puts replacing Carbon&rsquo;s header and side
              navigation first. Until that lands, the <code>--cds-*</code>{' '}
              binding table in the theme provider is hand-listed and can drift,
              which is why components read <code>--graphite-*</code> only.
              </>
            </Callout>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
