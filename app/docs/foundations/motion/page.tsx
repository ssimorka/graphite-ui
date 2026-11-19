import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { NextCard, NextCards, SectionHeading, StatusBadge } from '@/components/doc-blocks'
import { spell } from '@/lib/spell'
import { InlineCode } from '../spacing/inline-code'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { curvePath } from './curves'
import {
  ConfirmScene,
  CurveScene,
  DurationScene,
  MotionFigure,
  QueueScene,
  RepeatScene,
  RunwayScene,
  SheetScene,
  SourceScene,
} from './figures'
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

// The ease-in curve Graphite forbids, drawn as a Don't. The figure plays it
// from --motion-forbidden-in in motion.module.scss; this copy only draws it.
const FORBIDDEN_IN = 'cubic-bezier(0.4, 0, 1, 1)'

type Side = { label: string; caption: ReactNode; scene: ReactNode }

const PATTERNS: { id: string; title: string; text: string; do: Side; dont: Side; try: string; demo: ReactNode }[] = [
  {
    id: 'origin',
    title: 'Enter from the source',
    text: 'A popover, menu or tooltip grows from the point it hangs from, on duration-base and Out.',
    do: { label: 'A panel grows from the button that opened it.', caption: 'It grows from its button, so the eye is already there.', scene: <SourceScene /> },
    dont: { label: 'A panel flies in from the middle of the screen, far from its button.', caption: 'Same panel, origin at the centre. The eye has to jump.', scene: <SourceScene wrong /> },
    try: 'open a panel both ways',
    demo: <OriginDemo />,
  },
  {
    id: 'hundredth',
    title: 'Instant on repeat',
    text: 'Anything opened from the keyboard, or many times a session, appears at once.',
    do: { label: 'A command menu appears at once on each of three key presses.', caption: 'Three opens, no waiting.', scene: <RepeatScene /> },
    dont: { label: 'A command menu drops in on each of three key presses.', caption: 'A 300ms drop, three times. Charming once, then a toll.', scene: <RepeatScene animated /> },
    try: 'open the command menu a few times',
    demo: <HundredthDemo />,
  },
  {
    id: 'catch',
    title: 'Yours to drag',
    text: 'A sheet follows the hand, can be caught mid-motion, and springs home without overshoot.',
    do: { label: 'A pointer drags a sheet down and lets go; it springs back to rest.', caption: 'It follows the hand, then settles at rest.', scene: <SheetScene /> },
    dont: { label: 'A sheet slides away and back on its own, ignoring the pointer that tries to grab it.', caption: 'Locked while it moves. The grab does nothing.', scene: <SheetScene locked /> },
    try: 'drag, fling and catch the sheet',
    demo: <CatchDemo />,
  },
  {
    id: 'tooltips',
    title: 'Tooltip runway',
    text: 'The first tooltip waits delay-tooltip. While the pointer moves between targets, the rest appear at once.',
    do: { label: 'A pointer runs along a toolbar. The first tooltip waits, the rest appear instantly.', caption: 'One wait, then every label is instant.', scene: <RunwayScene /> },
    dont: { label: 'A pointer runs along a toolbar. Every tooltip waits, so most never show.', caption: 'Every label waits. The pointer moves on before they show.', scene: <RunwayScene wait /> },
    try: 'run the pointer along a toolbar',
    demo: <TooltipDemo />,
  },
  {
    id: 'confirm',
    title: 'Confirm on the way out',
    text: 'A menu flashes the chosen row on duration-fast, then closes. You see what you picked.',
    do: { label: 'A pointer picks a menu row. The row flashes, then the menu closes.', caption: 'The row flashes, then the menu closes.', scene: <ConfirmScene /> },
    dont: { label: 'A pointer picks a menu row and the menu vanishes at once.', caption: 'It vanishes. Which row was it?', scene: <ConfirmScene vanish /> },
    try: 'pick from a menu',
    demo: <ConfirmDemo />,
  },
  {
    id: 'toasts',
    title: 'One at a time',
    text: 'Toasts rise from the bottom, one at a time, and the rest wait their turn.',
    do: { label: 'Three toasts rise from the bottom, one after another.', caption: 'One at a time, from the bottom.', scene: <QueueScene /> },
    dont: { label: 'Five toasts pile up at once over the top of the page.', caption: 'Five at once, over the page. Which one mattered?', scene: <QueueScene pile /> },
    try: 'fire five toasts',
    demo: <ToastDemo />,
  },
]

export const metadata: Metadata = {
  title: 'Motion · Graphite UI',
  description:
    'Graphite motion: three principles, five durations, the easing curves drawn, and six patterns shown the right way and the wrong way, all playing live on the kit tokens.',
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
              timing, and {spell(moving).toLowerCase()} components name them in their contracts. Every figure
              here plays live on those tokens: pause one, replay it, or slow it to a quarter to see the curve.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`Contract ${contract.version}`}</StatusBadge>
              <StatusBadge tone="neutral">{`${tokens.length} tokens`}</StatusBadge>
              <StatusBadge tone="success">No bounce</StatusBadge>
            </div>
          </header>

          <MotionPlayground>
            <section id="principles" className={styles.block}>
              <SectionHeading
                title="Principles"
                lede="Three ideas decide whether something moves and how. Every token and rule below serves one of them."
              />
              <div className={styles.principles}>
                <div className={styles.principle}>
                  <MotionFigure label="A button is pressed and a panel grows out of it." caption="A panel grows out of the button that opened it.">
                    <SourceScene />
                  </MotionFigure>
                  <div className={styles.principleText}>
                    <p className={styles.principleKicker}>01 · Informative</p>
                    <h3 className={styles.subTitle}>Motion shows where things came from</h3>
                    <p>
                      Something new arrives from its source and leaves toward it. A panel grows from its button,
                      a toast rises from the bottom edge. Your eye is already where it lands.
                    </p>
                  </div>
                </div>
                <div className={styles.principle}>
                  <MotionFigure label="A command menu is opened three times from the keyboard and appears at once each time." caption="Opened from the keyboard, three times. No wait, ever.">
                    <RepeatScene />
                  </MotionFigure>
                  <div className={styles.principleText}>
                    <p className={styles.principleKicker}>02 · Focused</p>
                    <h3 className={styles.subTitle}>The hundredth time is instant</h3>
                    <p>
                      Motion that helps once gets in the way on repeat. Anything opened from the keyboard, or many
                      times a session, appears at once. Nothing runs longer than {values['duration-emphasis']}.
                    </p>
                  </div>
                </div>
                <div className={styles.principle}>
                  <MotionFigure label="A sheet rises to rest without overshooting. A pointer drags it down and lets go, and it springs back to rest." caption="The sheet stops at rest, never past it. Dragged and let go, it springs back the same way.">
                    <SheetScene />
                  </MotionFigure>
                  <div className={styles.principleText}>
                    <p className={styles.principleKicker}>03 · Calm</p>
                    <h3 className={styles.subTitle}>Nothing bounces, and what you drag is yours</h3>
                    <p>
                      Things settle once, without overshoot. Anything the reader drags follows their hand, can
                      be caught mid-motion, and springs home on a critically damped spring.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="duration" className={styles.block}>
              <SectionHeading
                title="Duration"
                lede="Duration follows distance and size. A thumb crossing a toggle takes fast; a sheet crossing the screen takes slow. Five steps, and the last is a hard cap."
              />
              <MotionFigure
                tall
                label="The five duration tokens side by side, each dot travelling a distance that suits it, against a playhead that sweeps the cap."
                caption={
                  <>
                    Each shaded bar is the token&rsquo;s length against the cap; each dot travels the distance
                    that token is for. Slow it down to watch the playhead pass each one.
                  </>
                }
              >
                <DurationScene values={values} />
              </MotionFigure>
              <Accordion type="single" collapsible>
                <AccordionItem title="Try it: the race">
                  <RaceDemo values={values} />
                </AccordionItem>
              </Accordion>
            </section>

            <section id="easing" className={styles.block}>
              <SectionHeading
                title="Easing"
                lede="Three curves and a spring. The dot rides each curve as time passes; the block beside it moves the same way."
              />
              <div className={styles.pair}>
                <MotionFigure verdict="do" label="The out curve: a fast start and a gentle stop." caption={<><strong>Out.</strong> Enter and exit. It moves most at the start, so it feels quickest.</>}>
                  <CurveScene path={curvePath(values['easing-out'])} ease="var(--graphite-motion-easing-out)" />
                </MotionFigure>
                <MotionFigure verdict="do" label="The in-out curve: a gentle start and a gentle stop." caption={<><strong>In-out.</strong> Already on screen, moving across it, like the tabs indicator.</>}>
                  <CurveScene path={curvePath(values['easing-in-out'])} ease="var(--graphite-motion-easing-in-out)" />
                </MotionFigure>
                <MotionFigure verdict="caution" label="The linear curve: constant speed." caption={<><strong>Linear.</strong> Progress and loops only. Constant speed reads as mechanical anywhere else.</>}>
                  <CurveScene path={curvePath(values['easing-linear'])} ease="var(--graphite-motion-easing-linear)" />
                </MotionFigure>
                <MotionFigure verdict="do" label="The sheet spring: it rises quickly and settles at rest without overshooting." caption={<><strong>Spring.</strong> A dragged sheet let go. Critically damped, so it never passes rest. Code only: the kit plays <code>duration/slow</code> instead.</>}>
                  <CurveScene path={curvePath(values['spring-sheet'])} ease="var(--graphite-motion-spring-sheet)" d="slow" />
                </MotionFigure>
                <MotionFigure verdict="dont" label="The in curve: a slow start and a hard landing. Graphite never uses it." caption={<><strong>In.</strong> It starts late, which reads as lag, and lands at full speed, which reads as a crash. Graphite has no token for it.</>}>
                  <CurveScene path={curvePath(FORBIDDEN_IN)} ease="var(--motion-forbidden-in)" />
                </MotionFigure>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem title="Try it: which feels fastest?">
                  <FeelDemo />
                </AccordionItem>
              </Accordion>
            </section>

            <section id="patterns" className={styles.block}>
              <SectionHeading
                title="Patterns"
                lede="Six moments that come up in every product, each the right way and the wrong way round. Open Try it to do it yourself."
              />
              {PATTERNS.map((p) => (
                <div key={p.id} id={p.id} className={styles.pattern}>
                  <h3 className={styles.subTitle}>{p.title}</h3>
                  <p className={styles.patternText}>{p.text}</p>
                  <div className={styles.pair}>
                    <MotionFigure verdict="do" label={p.do.label} caption={p.do.caption}>
                      {p.do.scene}
                    </MotionFigure>
                    <MotionFigure verdict="dont" label={p.dont.label} caption={p.dont.caption}>
                      {p.dont.scene}
                    </MotionFigure>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem title={`Try it: ${p.try}`}>{p.demo}</AccordionItem>
                  </Accordion>
                </div>
              ))}
            </section>

            <section id="reduced" className={styles.block}>
              <SectionHeading
                title="Reduced motion"
                lede="Movement becomes a fade or nothing. Feedback stays. Turn the simulation on and go back through the figures."
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
