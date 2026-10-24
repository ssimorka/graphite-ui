import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { NextCard, NextCards, SectionHeading, StatusBadge } from '@/components/doc-blocks'
import { spell } from '@/lib/spell'
import { InlineCode } from '../spacing/inline-code'
import {
  CatchDemo,
  ConfirmDemo,
  FeelDemo,
  HundredthDemo,
  MotionPlayground,
  OriginDemo,
  RaceDemo,
  ReducedDemo,
  ToastDemo,
  TokensTable,
  TooltipDemo,
} from './demos'
import { readMotionContract, readMotionTokens } from './read-motion'
import { TOC } from './toc'
import styles from './motion.module.scss'

export const metadata: Metadata = {
  title: 'Motion · Graphite UI',
  description:
    'The ten motion tokens from the kit, the rules they serve, and a page of demos to feel why: easing, the hundredth open, origin, catching a sheet, tooltips, confirmation, toasts and reduced motion.',
}

export default function MotionPage() {
  const tokens = readMotionTokens()
  const contract = readMotionContract()
  const values = Object.fromEntries(tokens.map((t) => [t.key, t.value]))
  const moving = new Set(tokens.flatMap((t) => t.usedBy.map((c) => c.slug))).size

  return (
    <main id="main-content" className="page-main">
      <DocsShell nav={DOCS_NAV} toc={TOC}>
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/foundations/motion')} />
            <h1 className={styles.title}>Motion</h1>
            <p className={styles.lede}>
              Motion shows where something came from or where it went. If it teaches nothing, Graphite does
              not animate it. {spell(tokens.length)} tokens from the kit&rsquo;s Motion collection carry every
              timing, and {spell(moving).toLowerCase()} components name them in their contracts. Play with
              the demos: each runs on the real tokens.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`Contract ${contract.version}`}</StatusBadge>
              <StatusBadge tone="neutral">{`${tokens.length} tokens`}</StatusBadge>
              <StatusBadge tone="success">No bounce</StatusBadge>
            </div>
          </header>

          <MotionPlayground>
            <section id="race" className={styles.block}>
              <SectionHeading
                title="The race"
                lede="Four dots, one track, one duration. Snap the slider to any of the five duration tokens and press Go."
              />
              <RaceDemo values={values} />
            </section>

            <section id="feel" className={styles.block}>
              <SectionHeading
                title="Feel it"
                lede="Four cards arrive, one curve each. Pick the one that feels fastest."
              />
              <FeelDemo />
            </section>

            <section id="hundredth" className={styles.block}>
              <SectionHeading
                title="The hundredth time"
                lede="Anything opened by keyboard or used many times a session appears instantly."
              />
              <HundredthDemo />
            </section>

            <section id="origin" className={styles.block}>
              <SectionHeading
                title="Where did that come from?"
                lede="Things enter from their source: a popover from its trigger, a sheet from the bottom edge, a toast from the bottom."
              />
              <OriginDemo />
            </section>

            <section id="catch" className={styles.block}>
              <SectionHeading
                title="Catch it"
                lede="Anything the reader drags can be caught mid-motion. Drag the sheet, fling it, and grab it on its way back."
              />
              <CatchDemo />
            </section>

            <section id="tooltips" className={styles.block}>
              <SectionHeading
                title="Tooltip runway"
                lede="Tooltips wait on first hover, then show instantly while the pointer moves between targets."
              />
              <TooltipDemo />
            </section>

            <section id="confirm" className={styles.block}>
              <SectionHeading
                title="Confirmation"
                lede="An exit can carry a short confirmation. The picked item flashes, then the menu closes."
              />
              <ConfirmDemo />
            </section>

            <section id="toasts" className={styles.block}>
              <SectionHeading
                title="One at a time"
                lede="One toast at a time, bottom only. The rest wait their turn."
              />
              <ToastDemo />
            </section>

            <section id="reduced" className={styles.block}>
              <SectionHeading
                title="Reduced motion"
                lede="Movement becomes a fade or nothing. Feedback stays. Turn the simulation on and go back through the demos."
              />
              <ReducedDemo />
            </section>

            <section id="tokens" className={styles.block}>
              <SectionHeading
                title="Tokens"
                lede="The kit's ten, with the components whose contracts name each one. Copy the CSS variable or the Tailwind class."
              />
              <TokensTable tokens={tokens} />
              <p className={styles.note}>
                Two more live beside them in code only: <code>--graphite-motion-indeterminate</code>, the
                1400ms period every loop shares, and <code>--graphite-motion-travel</code>, the multiplier the
                reduced-motion layer sets to 0. Figma cannot play the sheet spring, so the kit uses{' '}
                <code>duration/slow</code> in its place.
              </p>
            </section>
          </MotionPlayground>

          <section id="rules" className={styles.block}>
            <SectionHeading
              title="The rules"
              lede={`Quoted from the Motion contract (${contract.version}). The kit's Read Me carries the same text.`}
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
            <SectionHeading title="Next steps" lede="Where the tokens live, and the components that move." />
            <NextCards>
              <NextCard href="/docs/foundations/tokens" title="Tokens">
                Every foundation variable, read live from the page.
              </NextCard>
              <NextCard href="/docs/components/menu" title="Menu">
                Instant from the keyboard, a flash on the way out.
              </NextCard>
              <NextCard href="/docs/accessibility" title="Accessibility">
                Contrast and reduced motion, checked as a set.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
