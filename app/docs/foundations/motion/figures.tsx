'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { motionMs } from '@/lib/motion'
import { useReduce } from './demos'
import styles from './figures.module.scss'

/**
 * The Motion page's figures: small scenes that play on their own, on a loop,
 * the way Material's motion pages use video. They are live markup, not video,
 * so every timing is a Motion token and the scenes follow the theme.
 *
 * A scene is choreographed in beats of duration-emphasis (the cap): each
 * moving part names when it starts (`at`, in beats), which duration token it
 * takes and which easing, so what a figure shows is the real motion at its
 * real speed. Pointer travel between steps is pacing, not UI motion, and is
 * drawn on the same tokens so nothing here carries a raw number.
 *
 * A figure pauses offscreen, and the reader can pause it, replay it or slow
 * it to a quarter. Under reduced motion it holds its last frame; Replay plays
 * it once, as the reduced layer draws it (fades, no travel).
 */

type Verdict = 'do' | 'dont' | 'caution'
const VERDICT: Record<Verdict, string> = { do: 'Do', dont: 'Don’t', caution: 'Caution' }

export function MotionFigure({
  label,
  verdict,
  caption,
  tall,
  children,
}: {
  /** What the scene shows, for a screen reader: the stage is one image. */
  label: string
  verdict?: Verdict
  caption: ReactNode
  /** A taller stage, for scenes with rows. */
  tall?: boolean
  children: ReactNode
}) {
  const stage = useRef<HTMLDivElement>(null)
  const { simulated, os } = useReduce()
  const reduced = simulated || os
  const [cycle, setCycle] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [slow, setSlow] = useState(false)
  // A replay under reduced motion: one pass, then hold again.
  const [once, setOnce] = useState(false)
  const running = visible && !paused && (!reduced || once)

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Each cycle remounts the scene, so its CSS animations start again; this
  // then holds, pauses or slows them, and queues the next cycle once every
  // one has finished and the end frame has been on screen for a moment.
  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const anims = el.getAnimations({ subtree: true })
    for (const a of anims) a.playbackRate = slow ? 0.25 : 1
    if (!running) {
      for (const a of anims) {
        if (reduced && !once) a.finish()
        else a.pause()
      }
      return
    }
    for (const a of anims) if (a.playState === 'paused') a.play()
    let live = true
    let timer = 0
    Promise.all(anims.map((a) => a.finished))
      .then(() => {
        if (!live) return
        if (once) {
          setOnce(false)
          return
        }
        const hold = motionMs('emphasis', { el, fallback: 400 }) * 3 * (slow ? 2 : 1)
        timer = window.setTimeout(() => setCycle((c) => c + 1), hold)
      })
      .catch(() => {})
    return () => {
      live = false
      window.clearTimeout(timer)
    }
  }, [cycle, running, slow, reduced, once])

  const replay = () => {
    setPaused(false)
    if (reduced) setOnce(true)
    setCycle((c) => c + 1)
  }

  return (
    <figure className={styles.figure} data-verdict={verdict}>
      <div ref={stage} className={`${styles.stage} ${tall ? styles.tall : ''}`} role="img" aria-label={label}>
        <div key={cycle} className={styles.scene} aria-hidden="true">
          {children}
        </div>
      </div>
      <div className={styles.bar}>
        {verdict ? <strong className={styles.verdict}>{VERDICT[verdict]}</strong> : <span />}
        <div className={styles.buttons}>
          {reduced ? null : (
            <Button size="sm" variant="ghost" onClick={() => setPaused((p) => !p)} aria-label={paused ? `Play: ${label}` : `Pause: ${label}`}>
              {paused ? 'Play' : 'Pause'}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={replay} aria-label={`Replay: ${label}`}>
            Replay
          </Button>
          <Button size="sm" variant="ghost" aria-pressed={slow} onClick={() => setSlow((s) => !s)} aria-label={`Slow motion: ${label}`}>
            {slow ? '¼ speed' : 'Slow'}
          </Button>
        </div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}

// ---------------------------------------------------------------- primitives

type Dur = 'instant' | 'fast' | 'base' | 'slow' | 'emphasis'
type Ease = 'out' | 'in-out' | 'linear' | 'spring'
type Timing = { at: number; d?: Dur; e?: Ease; wait?: boolean }

const timing = ({ at, d = 'base', e = 'out', wait }: Timing): Record<string, string | number> => ({
  '--at': at,
  '--dur': `var(--graphite-motion-duration-${d})`,
  '--ease': e === 'spring' ? 'var(--graphite-motion-spring-sheet)' : `var(--graphite-motion-easing-${e})`,
  ...(wait ? { '--wait': 'var(--graphite-motion-delay-tooltip)' } : {}),
})

type Kind = 'fade' | 'grow' | 'burst' | 'rise' | 'drop' | 'sheetUp' | 'leave' | 'sink' | 'gone' | 'flash' | 'press'

/** One animation on a stage-sized layer; what it wraps moves with it. */
function A({ kind, t, origin, children }: { kind: Kind; t: Timing; origin?: string; children: ReactNode }) {
  return (
    <span
      className={`${styles.layer} ${styles.t} ${styles[kind]}`}
      style={{ ...timing(t), ...(origin ? { transformOrigin: origin } : {}) } as CSSProperties}
    >
      {children}
    </span>
  )
}

/** A move by (dx, dy), in percent of the stage. Moves nest, so they add up. */
function Move({ dx = 0, dy = 0, t, children }: { dx?: number; dy?: number; t: Timing; children: ReactNode }) {
  return (
    <span className={`${styles.layer} ${styles.t} ${styles.move}`} style={{ ...timing(t), '--dx': dx, '--dy': dy } as CSSProperties}>
      {children}
    </span>
  )
}

const nest = (inner: ReactNode, wrap: ((child: ReactNode) => ReactNode)[]) => wrap.reduceRight((c, w) => w(c), inner)

const at = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: `${x}%`,
  top: `${y}%`,
  ...(w === undefined ? {} : { width: `${w}%` }),
  ...(h === undefined ? {} : { height: `${h}%` }),
})

type Step = { dx: number; dy: number; at: number; d?: Dur }

/** The reader's pointer: starts at (x, y), takes each step, presses at each beat in `presses`. */
function Pointer({ x, y, steps, presses = [], deny }: { x: number; y: number; steps: Step[]; presses?: number[]; deny?: number }) {
  const dot = (
    <span className={styles.pointer} style={at(x, y)}>
      {nest(
        <span className={styles.pointerDot}>
          {deny === undefined ? null : (
            <A kind="fade" t={{ at: deny, d: 'fast' }}>
              <span className={styles.pointerDeny} />
            </A>
          )}
        </span>,
        presses.map((p) => (c: ReactNode) => (
          <span className={`${styles.t} ${styles.press} ${styles.pressLayer}`} style={timing({ at: p, d: 'base', e: 'in-out' }) as CSSProperties}>
            {c}
          </span>
        )),
      )}
    </span>
  )
  return <>{nest(dot, steps.map((s) => (c: ReactNode) => <Move dx={s.dx} dy={s.dy} t={{ at: s.at, d: s.d ?? 'emphasis', e: 'in-out' }}>{c}</Move>))}</>
}

const Lines = () => (
  <span className={styles.lines} style={at(8, 10, 84)}>
    <span />
    <span />
    <span />
  </span>
)

// ------------------------------------------------------------------- scenes

/** A panel opening from its button, or (wrong) from the middle of the screen. */
export function SourceScene({ wrong }: { wrong?: boolean }) {
  return (
    <>
      <span className={styles.button} style={at(8, 12, 22, 11)}>
        Filter
      </span>
      <Pointer x={72} y={78} steps={[{ dx: -52, dy: -61, at: 0.5 }]} presses={[1.5]} />
      {wrong ? (
        <A kind="burst" t={{ at: 1.75, d: 'slow' }} origin="50% 50%">
          <span className={styles.panel} style={at(8, 27, 46, 46)}>
            <span className={styles.panelLine} />
            <span className={styles.panelLine} />
            <span className={styles.panelLine} />
          </span>
        </A>
      ) : (
        <A kind="grow" t={{ at: 1.75, d: 'base' }} origin="8% 27%">
          <span className={styles.panel} style={at(8, 27, 46, 46)}>
            <span className={styles.panelLine} />
            <span className={styles.panelLine} />
            <span className={styles.panelLine} />
          </span>
        </A>
      )}
    </>
  )
}

const OPENS = [0.75, 3.25, 5.75]

/** A command menu opened three times from the keyboard. */
export function RepeatScene({ animated }: { animated?: boolean }) {
  return (
    <>
      <span className={styles.keycap} style={at(42, 8, 16, 14)}>
        {nest(<span className={styles.keyFace}>⌘K</span>, OPENS.map((o) => (c: ReactNode) => (
          <span className={`${styles.layer} ${styles.t} ${styles.press}`} style={timing({ at: o, d: 'base', e: 'in-out' }) as CSSProperties}>
            {c}
          </span>
        )))}
      </span>
      {OPENS.map((o, i) => {
        const palette = (
          <A kind={animated ? 'drop' : 'fade'} t={{ at: o, d: animated ? 'slow' : 'instant' }}>
            <span className={styles.palette} style={at(24, 30, 52, 60)}>
              <span className={styles.paletteField} />
              <span className={styles.panelLine} />
              <span className={styles.panelLine} />
              <span className={styles.panelLine} />
            </span>
          </A>
        )
        return i === OPENS.length - 1 ? (
          <span key={o}>{palette}</span>
        ) : (
          <A key={o} kind="gone" t={{ at: o + 1.75, d: 'instant' }}>
            {palette}
          </A>
        )
      })}
    </>
  )
}

/**
 * A sheet rising on the spring to rest, without overshoot; the pointer then
 * drags it down and lets go, and it springs back. With `locked`, the sheet
 * travels away and back on its own and ignores the pointer that tries to
 * grab it on the way.
 */
export function SheetScene({ locked }: { locked?: boolean }) {
  const sheet = (
    <span className={styles.sheet} style={at(10, 32, 80, 70)}>
      <span className={styles.grabber} />
      <span className={styles.panelLine} />
      <span className={styles.panelLine} />
    </span>
  )
  if (locked) {
    return (
      <>
        <span className={styles.rest} style={at(4, 32, 92)} />
        {nest(sheet, [
          (c) => <Move dy={-52} t={{ at: 2.25, d: 'emphasis', e: 'in-out' }}>{c}</Move>,
          (c) => <Move dy={52} t={{ at: 0.75, d: 'emphasis', e: 'in-out' }}>{c}</Move>,
        ])}
        {/* Halfway through its trip away, the sheet's top edge is near 58%: the grab lands on it, and does nothing. */}
        <Pointer x={70} y={92} steps={[{ dx: -20, dy: -34, at: 0.25 }]} presses={[1.25]} deny={1.25} />
      </>
    )
  }
  return (
    <>
      <span className={styles.rest} style={at(4, 32, 92)}>
        <span className={styles.restLabel}>rest</span>
      </span>
      {nest(sheet, [
        (c) => <Move dy={-30} t={{ at: 4, d: 'slow', e: 'spring' }}>{c}</Move>,
        (c) => <Move dy={30} t={{ at: 2.75, d: 'emphasis', e: 'in-out' }}>{c}</Move>,
        (c) => <A kind="sheetUp" t={{ at: 0.25, d: 'slow', e: 'spring' }}>{c}</A>,
      ])}
      <A kind="leave" t={{ at: 4, d: 'fast' }}>
        <Pointer x={72} y={92} steps={[{ dx: -22, dy: -56, at: 1.5 }, { dx: 0, dy: 30, at: 2.75 }]} presses={[2.5]} />
      </A>
    </>
  )
}

const ICONS = [22, 40, 58, 76]

/**
 * The pointer runs along a toolbar. Graphite: the first tooltip waits out
 * delay-tooltip, the rest appear at once. Wrong: every one waits, and the
 * pointer has moved on before most of them show.
 */
export function RunwayScene({ wait }: { wait?: boolean }) {
  // The first tooltip needs time to wait and then be read; the pointer moves
  // on from the others after a beat and a half.
  const arrive = [1.5, 4.5, 6, 7.5]
  const leave = [4, 5.5, 7, Infinity]
  return (
    <>
      <span className={styles.toolbar} style={at(14, 22, 72, 18)} />
      {ICONS.map((x) => (
        <span key={x} className={styles.icon} style={at(x - 4, 25, 8, 12.8)} />
      ))}
      {ICONS.map((x, i) => {
        const tip = (
          <A kind={i === 0 || wait ? 'grow' : 'fade'} t={{ at: arrive[i], d: i === 0 || wait ? 'fast' : 'instant', wait: i === 0 || wait }} origin={`${x}% 42%`}>
            <span className={styles.tip} style={at(x - 9, 44, 18, 11)}>
              Label
            </span>
          </A>
        )
        return leave[i] === Infinity ? (
          <span key={x}>{tip}</span>
        ) : (
          <A key={x} kind="gone" t={{ at: leave[i], d: 'instant' }}>
            {tip}
          </A>
        )
      })}
      <Pointer
        x={ICONS[0] - 12}
        y={80}
        steps={[
          { dx: 12, dy: -46, at: 0.5 },
          ...ICONS.slice(1).map((x, i) => ({ dx: x - ICONS[i], dy: 0, at: leave[i], d: 'base' as Dur })),
        ]}
      />
    </>
  )
}

/** An open menu; the pointer picks a row. Graphite: the row flashes, then the menu closes. Wrong: it just vanishes. */
export function ConfirmScene({ vanish }: { vanish?: boolean }) {
  const rows = [0, 1, 2, 3]
  return (
    <>
      <span className={styles.button} style={at(20, 6, 22, 11)}>
        Actions
      </span>
      <A kind={vanish ? 'gone' : 'leave'} t={{ at: vanish ? 1.75 : 2.1, d: vanish ? 'instant' : 'fast' }}>
        <span className={styles.menu} style={at(20, 19, 40, 52)}>
          {rows.map((r) =>
            r === 1 && !vanish ? (
              <span key={r} className={`${styles.row} ${styles.t} ${styles.flash}`} style={timing({ at: 1.75, d: 'fast' }) as CSSProperties}>
                <span className={styles.panelLine} />
              </span>
            ) : (
              <span key={r} className={styles.row}>
                <span className={styles.panelLine} />
              </span>
            ),
          )}
        </span>
      </A>
      <Pointer x={74} y={86} steps={[{ dx: -36, dy: -48, at: 0.5 }]} presses={[1.5]} />
    </>
  )
}

/** Toasts. Graphite: three, one at a time, from the bottom. Wrong: five at once, piled at the top. */
export function QueueScene({ pile }: { pile?: boolean }) {
  if (pile) {
    return (
      <>
        <Lines />
        {[0, 1, 2, 3, 4].map((i) => (
          <A key={i} kind="fade" t={{ at: 0.75 + i * 0.1, d: 'base' }}>
            <span className={styles.toast} style={at(44 - i * 2, 8 + i * 9, 50, 20)}>
              <span className={styles.panelLine} />
            </span>
          </A>
        ))}
      </>
    )
  }
  return (
    <>
      <Lines />
      {[0, 1, 2].map((i) => {
        const start = 0.75 + i * 2.5
        const toast = (
          <A kind="rise" t={{ at: start, d: 'base' }}>
            <span className={styles.toast} style={at(25, 72, 50, 20)}>
              <span className={styles.panelLine} />
            </span>
          </A>
        )
        return i === 2 ? (
          <span key={i}>{toast}</span>
        ) : (
          <A key={i} kind="sink" t={{ at: start + 2, d: 'fast' }}>
            {toast}
          </A>
        )
      })}
    </>
  )
}

// ------------------------------------------------------------- duration scale

const SCALE: { d: Dur; what: string; travel: number }[] = [
  { d: 'instant', what: 'Command menu from the keyboard', travel: 0 },
  { d: 'fast', what: 'Toggle thumb, tab indicator', travel: 10 },
  { d: 'base', what: 'Menu, popover, toast', travel: 25 },
  { d: 'slow', what: 'Modal panel, sheet', travel: 55 },
  { d: 'emphasis', what: 'The cap: nothing runs longer', travel: 85 },
]

/** The five durations side by side, against a playhead sweeping the cap. */
export function DurationScene({ values }: { values: Record<string, string> }) {
  const cap = parseFloat(values['duration-emphasis']) || 400
  return (
    <span className={styles.scale}>
      {SCALE.map((r) => {
        const ms = parseFloat(values[`duration-${r.d}`]) || 0
        return (
          <span key={r.d} className={styles.scaleRow}>
            <span className={styles.scaleLabel}>
              <code>{r.d}</code> {values[`duration-${r.d}`]}
              <span className={styles.scaleWhat}>{r.what}</span>
            </span>
            <span className={styles.scaleTrack}>
              <span className={styles.scaleSpan} style={{ width: `${(ms / cap) * 100}%` }} />
              <span className={styles.scaleLane}>
                <span className={`${styles.t} ${styles.move} ${styles.scaleDot}`} style={{ ...timing({ at: 0.75, d: r.d }), '--dx': r.travel, '--dy': 0 } as CSSProperties} />
              </span>
            </span>
          </span>
        )
      })}
      <span className={styles.scaleHeadTrack}>
        <span className={`${styles.t} ${styles.playhead}`} style={timing({ at: 0.75, d: 'emphasis', e: 'linear' }) as CSSProperties} />
      </span>
    </span>
  )
}

// ----------------------------------------------------------------- curves

/**
 * One easing, drawn: the curve, a dot riding it (time runs across at a
 * constant rate, progress up on the easing) and a block crossing a track on
 * the same easing, so the shape and the feel sit side by side.
 */
export function CurveScene({ path, ease, d = 'emphasis' }: { path: string; ease: string; d?: Dur }) {
  const t = { ...timing({ at: 0.75, d }), '--ease': ease } as CSSProperties
  return (
    <span className={styles.curve}>
      <span className={styles.graph}>
        <svg viewBox="0 0 100 100" className={styles.svg} aria-hidden="true">
          <path d="M0,100 L100,100 M0,0 L0,100" className={styles.axis} />
          <path d="M0,100 L100,0" className={styles.diagonal} />
          <path d={path} className={styles.path} />
        </svg>
        <span className={styles.ride}>
          <span className={`${styles.t} ${styles.rideX}`} style={{ ...t, '--ease': 'var(--graphite-motion-easing-linear)' } as CSSProperties}>
            <span className={`${styles.t} ${styles.rideY}`} style={t}>
              <span className={styles.rideDot} />
            </span>
          </span>
        </span>
      </span>
      <span className={styles.runway}>
        <span className={`${styles.t} ${styles.runner}`} style={t} />
      </span>
    </span>
  )
}
