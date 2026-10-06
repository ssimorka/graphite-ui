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
  const kitUrl = readKitFile()

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>
              {`${kit.governed} governed components`}
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
                    contract is corrected.
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
              lede="Written contracts, checked in CI."
            />
            <div className={styles.prose}>
              <p>
                Every governed component has a written contract, and automated
                checks hold the components and tokens to their contracts and to
                the kit on every change. You do not need any of it to use
                Graphite.
              </p>
            </div>
            <p className={styles.more}>
              <a href="/docs/contribute/governance">How governance works</a>
            </p>
          </section>

          <section id="whats-here" className={styles.block}>
            <SectionHeading
              title="What is here"
              lede="Where to go next, by what you came to do."
            />
            <NextCards>
              <NextCard href="/docs/get-started" title="Get started">
                What you can use today, and how.
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
              <NextCard href="/docs/contribute/run-locally" title="Contribute">
                Running Graphite locally, the rules and checks, and how it is
                kept in step with the kit.
              </NextCard>
              <NextCard href="/docs/foundations/color" title="Foundations">
                Color, typography, spacing, radius, layout and the full token
                list.
              </NextCard>
              <NextCard href="/gallery" title="Components">
                {`All ${lower(kit.governed)} governed components, each with its contract version beside it.`}
              </NextCard>
              <NextCard href="/create" title="Create">
                Build a theme against a live preview, then take it away as one
                CSS file.
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
                    No package to install yet. The theme and the Figma kit are
                    usable today; components are copied by hand.{' '}
                    <a href="/docs/get-started">Get started</a> has the
                    details.
                  </td>
                </tr>
                <tr>
                  <th scope="row">Components</th>
                  <td>
                    {`${spell(kit.governed)} governed. The kit ships more sets than that, and those without a contract are labelled in the kit rather than hidden.`}{' '}
                    <a href="/docs/contribute/status">Status</a> has every
                    count.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
