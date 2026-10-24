'use client'

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import type { KitIconName } from '@/lib/kit-icons'
import { useCopy, Toast as CopyToast } from '@/components/token-panels'
import { useSheetDrag } from '@/components/use-sheet-drag'
import { motionEasing, motionMs, prefersReducedMotion } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { Menu } from '@/components/ui/menu'
import { Popover } from '@/components/ui/popover'
import { RadioButtonGroup } from '@/components/ui/radio-button-group'
import { Slider } from '@/components/ui/slider'
import { Tabs } from '@/components/ui/tabs'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip } from '@/components/ui/tooltip'
import type { MotionToken } from './read-motion'
import styles from './motion.module.scss'

/**
 * The Motion page's demos. Every one runs on the real tokens: CSS reads the
 * --graphite-motion-* variables, and script reads the same variables through
 * lib/motion, so a token changed in the kit changes the page.
 *
 * The page-level "Simulate reduced motion" switch sets data-motion="reduce"
 * on the wrapper, which the global reduced-motion layer in globals.scss
 * answers exactly as it answers the visitor's own setting; script asks
 * prefersReducedMotion(el), which reads both.
 */

const ReduceContext = createContext<{ simulated: boolean; set: (v: boolean) => void; os: boolean }>({
  simulated: false,
  set: () => {},
  os: false,
})

function ReduceSwitch({ id }: { id: string }) {
  const { simulated, set } = useContext(ReduceContext)
  return (
    <Toggle
      id={id}
      label="Simulate reduced motion"
      size="sm"
      checked={simulated}
      onChange={set}
      valueText={{ on: 'On', off: 'Off' }}
      showValue
    />
  )
}

/** The Do and Don't of a demo, on the kit's Tabs: the panel swaps at once. */
function DoDont({ good, bad }: { good: ReactNode; bad: ReactNode }) {
  return (
    <Tabs
      tabs={[
        { id: 'do', label: 'Do', panel: <div className={styles.frame}>{good}</div> },
        { id: 'dont', label: 'Don’t', panel: <div className={`${styles.frame} ${styles.dontFrame}`}>{bad}</div> },
      ]}
    />
  )
}

const DURATIONS = ['instant', 'fast', 'base', 'slow', 'emphasis'] as const
type Duration = (typeof DURATIONS)[number]
const durVar = (d: Duration) => `var(--graphite-motion-duration-${d})`

// ------------------------------------------------------------------ 1. race

const LANES = [
  { id: 'linear', label: 'Linear', note: 'Progress only', ok: true },
  { id: 'in', label: 'In', note: 'Never: it starts late and arrives at full speed', ok: false },
  { id: 'out', label: 'Out', note: 'Enter and exit', ok: true },
  { id: 'in-out', label: 'In-out', note: 'Already on screen, moving across it', ok: true },
] as const

export function RaceDemo({ values }: { values: Record<string, string> }) {
  const [step, setStep] = useState(3)
  const [there, setThere] = useState(false)
  const d = DURATIONS[step]
  return (
    <div className={styles.frame}>
      <div className={styles.controls}>
        <div className={styles.grow}>
          <Slider label="Duration" min={0} max={4} step={1} value={step} onChange={setStep} showInputs={false} />
        </div>
        <p className={styles.readout}>
          <code>duration-{d}</code> · {values[`duration-${d}`]}
        </p>
        <Button variant="primary" onClick={() => setThere((v) => !v)}>
          Go
        </Button>
      </div>
      <ol className={styles.lanes}>
        {LANES.map((l) => (
          <li key={l.id} className={styles.lane}>
            <span className={styles.laneLabel}>
              <span className={l.ok ? styles.tagOk : styles.tagNo}>{l.ok ? 'Graphite' : 'Never'}</span>
              <strong>{l.label}</strong> <span className={styles.laneNote}>{l.note}</span>
            </span>
            <span className={styles.track}>
              <span
                className={`${styles.dot} ${styles[`ease-${l.id}`]}`}
                data-there={there || undefined}
                style={{ '--dur': durVar(d) } as CSSProperties}
              />
            </span>
          </li>
        ))}
      </ol>
      <p className={styles.caption}>
        Every dot crosses the same track in the same time. Only the curve differs. In spends its start
        doing nothing, which reads as lag, then arrives at full speed, which reads as a crash. Graphite
        never uses it.
      </p>
    </div>
  )
}

// ------------------------------------------------------------------ 2. feel

const FEEL = ['linear', 'in', 'out', 'in-out'] as const
const LETTERS = ['A', 'B', 'C', 'D']

export function FeelDemo() {
  const [order, setOrder] = useState<string[]>([...FEEL])
  const [run, setRun] = useState(0)
  const [pick, setPick] = useState<string>('')
  const [revealed, setRevealed] = useState(false)
  // Shuffled after mount, so the server and the first client render agree.
  useEffect(() => {
    setOrder([...FEEL].sort(() => Math.random() - 0.5))
  }, [])
  return (
    <div className={styles.frame}>
      <div className={styles.controls}>
        <Button variant="primary" onClick={() => setRun((n) => n + 1)}>
          {run ? 'Replay' : 'Play'}
        </Button>
        <Button variant="outlined" onClick={() => setRevealed(true)} disabled={!pick || revealed}>
          Reveal
        </Button>
      </div>
      <div className={styles.cards} key={run}>
        {order.map((e, i) => (
          <div key={e} className={`${styles.feelCard} ${styles[`ease-${e}`]}`} data-run={run > 0 || undefined}>
            <span className={styles.feelLetter}>{LETTERS[i]}</span>
            {revealed ? <span className={styles.feelEase}>{e === 'in' ? 'In (never)' : e}</span> : null}
          </div>
        ))}
      </div>
      <RadioButtonGroup
        name="feel-pick"
        label="Which arrived fastest?"
        orientation="horizontal"
        options={LETTERS.map((l) => ({ value: l, label: l }))}
        value={pick}
        onChange={setPick}
      />
      <p className={styles.caption} aria-live="polite">
        {revealed
          ? `All four took exactly the emphasis step, 400ms. The one that felt fastest is the one that moved most at the start: Out does that, which is why Graphite enters and exits on it.`
          : 'Play them, pick one, then reveal.'}
      </p>
    </div>
  )
}

// -------------------------------------------------------------- 3. hundredth

const COMMANDS = ['Open file', 'Go to symbol', 'Toggle theme', 'Copy source hex', 'Search docs']

export function HundredthDemo() {
  const [animate, setAnimate] = useState(true)
  const [open, setOpen] = useState(false)
  const [opens, setOpens] = useState(0)
  const [waited, setWaited] = useState(0)
  const opener = useRef<HTMLButtonElement>(null)
  const first = useRef<HTMLButtonElement>(null)

  const show = () => {
    if (open) return
    setOpen(true)
    setOpens((n) => n + 1)
    if (animate) setWaited((ms) => ms + motionMs('slow', { fallback: 300 }))
  }
  const hide = () => {
    setOpen(false)
    opener.current?.focus()
  }
  useEffect(() => {
    if (open) first.current?.focus()
  }, [open])

  // ⌘K or Ctrl+K while focus is inside the demo: the page's own search keeps
  // the shortcut everywhere else.
  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      e.stopPropagation()
      if (open) hide()
      else show()
    } else if (e.key === 'Escape' && open) {
      e.stopPropagation()
      hide()
    }
  }

  return (
    <div className={styles.frame} onKeyDown={onKeyDown}>
      <div className={styles.controls}>
        <Toggle label="Animate the open" checked={animate} onChange={setAnimate} size="sm" showValue valueText={{ on: 'On', off: 'Off' }} />
        <Button ref={opener} variant="primary" onClick={show}>
          Open command menu <kbd className={styles.kbd}>⌘K</kbd>
        </Button>
      </div>
      <div className={styles.paletteStage}>
        {open ? (
          <div className={styles.palette} data-animate={animate || undefined} role="dialog" aria-label="Command menu">
            <p className={styles.paletteHint}>Pick a command, or press Escape.</p>
            <ul className={styles.paletteList}>
              {COMMANDS.map((c, i) => (
                <li key={c}>
                  <button ref={i === 0 ? first : undefined} type="button" className={styles.paletteItem} onClick={hide}>
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={styles.paletteEmpty}>Open it, close it, open it again. Then turn the animation off.</p>
        )}
      </div>
      <p className={styles.counter} aria-live="polite">
        Opened <strong>{opens}</strong> {opens === 1 ? 'time' : 'times'} · <strong>{(waited / 1000).toFixed(1)} s</strong> spent
        waiting for it
      </p>
      <p className={styles.caption}>
        A 300ms open is charming once. A command menu is opened from the keyboard, many times a session,
        so Graphite opens it at once and the waiting stops climbing.
      </p>
    </div>
  )
}

// ----------------------------------------------------------------- 4. origin

function CenterPopover() {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = panel.current
    if (!open || !el) return
    // The wrong origin, on purpose: the centre of the screen, wherever the
    // trigger is. The panel flies in from somewhere it never was.
    const r = el.getBoundingClientRect()
    const ox = window.innerWidth / 2 - r.left
    const oy = window.innerHeight / 2 - r.top
    const reduce = prefersReducedMotion(el)
    el.animate(
      reduce
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: 'scale(0.2)', transformOrigin: `${ox}px ${oy}px` },
            { opacity: 1, transform: 'scale(1)', transformOrigin: `${ox}px ${oy}px` },
          ],
      { duration: motionMs('slow', { el, fallback: 300 }), easing: motionEasing('out', { el }) },
    )
  }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  return (
    <span className={styles.anchor}>
      <Button variant="outlined" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Open a panel
      </Button>
      {open ? (
        <div ref={panel} className={styles.fakePanel} role="group" aria-label="Panel">
          It grew out of the middle of your screen, nowhere near the button you pressed.
        </div>
      ) : null}
    </span>
  )
}

export function OriginDemo() {
  return (
    <DoDont
      good={
        <div className={styles.originStage}>
          <Popover trigger={(p) => <Button {...p} variant="outlined">Open a panel</Button>}>
            <span className={styles.popText}>It grew out of its caret, so your eye was already where it landed.</span>
          </Popover>
          <p className={styles.caption}>The panel grows from the point it hangs from. Open it a few times.</p>
        </div>
      }
      bad={
        <div className={styles.originStage}>
          <CenterPopover />
          <p className={styles.caption}>Same panel, same timing, origin at the centre of the screen. Feel the eye jump.</p>
        </div>
      }
    />
  )
}

// ------------------------------------------------------------------ 5. catch

function CatchableSheet() {
  const sheet = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(0)
  const [away, setAway] = useState(false)
  const raise = () => {
    const el = sheet.current
    if (!el) return
    setAway(false)
    const h = el.offsetHeight
    el.style.transform = ''
    el.animate([{ transform: `translateY(${h}px)` }, { transform: 'translateY(0)' }], {
      duration: prefersReducedMotion(el) ? 0 : motionMs('slow', { el, fallback: 300 }),
      easing: motionEasing('spring-sheet', { el }),
    })
  }
  const drag = useSheetDrag(sheet, {
    edge: 'bottom',
    onDismiss: () => setAway(true),
    onVelocity: setV,
  })
  // Gone for a beat, then back on the spring, so there is always something in
  // flight to catch.
  useEffect(() => {
    if (!away) return
    const t = setTimeout(raise, 700)
    return () => clearTimeout(t)
  }, [away])
  return (
    <>
      <div className={styles.sheetStage}>
        <div ref={sheet} className={styles.sheet} onPointerDown={drag.onPointerDown}>
          <span className={styles.grabber} aria-hidden="true" />
          <p className={styles.sheetText}>Drag me down. Fling me. Grab me while I come back.</p>
        </div>
      </div>
      <div className={styles.controls}>
        <p className={styles.readout} aria-hidden="true">
          Velocity <strong>{Math.abs(v).toFixed(2)}</strong> px/ms {v > 0.5 ? '· a fling' : ''}
        </p>
        <Button variant="outlined" onClick={raise}>
          Replay the slide in
        </Button>
      </div>
    </>
  )
}

function StubbornSheet() {
  const sheet = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const bounce = () => {
    const el = sheet.current
    if (!el || busy) return
    setBusy(true)
    const h = el.offsetHeight
    const reduce = prefersReducedMotion(el)
    const a = el.animate(
      [{ transform: 'translateY(0)' }, { transform: `translateY(${h}px)` }, { transform: 'translateY(0)' }],
      { duration: reduce ? 0 : motionMs('emphasis', { el, fallback: 400 }) * 3, easing: motionEasing('in-out', { el }) },
    )
    a.onfinish = () => setBusy(false)
  }
  return (
    <>
      <div className={styles.sheetStage}>
        <div ref={sheet} className={`${styles.sheet} ${busy ? styles.locked : ''}`}>
          <span className={styles.grabber} aria-hidden="true" />
          <p className={styles.sheetText}>Try to grab me while I move. You can’t: I ignore you until I finish.</p>
        </div>
      </div>
      <div className={styles.controls}>
        <Button variant="outlined" onClick={bounce} disabled={busy}>
          Send it away and back
        </Button>
      </div>
    </>
  )
}

export function CatchDemo() {
  return <DoDont good={<CatchableSheet />} bad={<StubbornSheet />} />
}

// --------------------------------------------------------------- 6. tooltips

const TOOLS: { icon: KitIconName; label: string }[] = [
  { icon: 'copy', label: 'Copy' },
  { icon: 'share', label: 'Share' },
  { icon: 'download', label: 'Download' },
  { icon: 'refresh', label: 'Refresh' },
  { icon: 'search', label: 'Search' },
  { icon: 'settings', label: 'Settings' },
]

export function TooltipDemo() {
  return (
    <DoDont
      good={
        <>
          <div className={styles.toolbar} role="toolbar" aria-label="Graphite toolbar">
            {TOOLS.map((t) => (
              <Tooltip key={t.icon} content={t.label} type="icon" placement="bottom">
                <Button variant="ghost" size="icon" aria-label={t.label}>
                  <KitIcon name={t.icon} />
                </Button>
              </Tooltip>
            ))}
          </div>
          <p className={styles.caption}>
            Run the pointer along the toolbar. The first label waits half a second; the rest are instant,
            because you are already reading.
          </p>
        </>
      }
      bad={
        <>
          <div className={styles.toolbar} role="toolbar" aria-label="Slow toolbar">
            {TOOLS.map((t) => (
              <span key={t.icon} className={styles.slowTipWrap}>
                <Button variant="ghost" size="icon" aria-label={t.label}>
                  <KitIcon name={t.icon} />
                </Button>
                <span className={styles.slowTip} aria-hidden="true">
                  {t.label}
                </span>
              </span>
            ))}
          </div>
          <p className={styles.caption}>Every label waits the full half second, every time. Reading the toolbar becomes a chore.</p>
        </>
      }
    />
  )
}

// ---------------------------------------------------------------- 7. confirm

const ACTIONS = ['Duplicate', 'Rename', 'Move to folder', 'Archive']

function VanishingMenu({ onPick }: { onPick: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <span className={styles.anchor}>
      <Button variant="outlined" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Actions
      </Button>
      {open ? (
        <ul className={styles.fakeMenu} aria-label="Actions">
          {ACTIONS.map((a) => (
            <li key={a}>
              <button
                type="button"
                className={styles.fakeItem}
                onClick={() => {
                  onPick(a)
                  setOpen(false)
                }}
              >
                {a}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  )
}

export function ConfirmDemo() {
  const [good, setGood] = useState('')
  const [bad, setBad] = useState('')
  return (
    <DoDont
      good={
        <div className={styles.originStage}>
          <Menu
            trigger={(p) => <Button {...p} variant="outlined">Actions</Button>}
            items={[
              { label: ACTIONS[0], onSelect: () => setGood(ACTIONS[0]) },
              ...ACTIONS.slice(1).map((a) => ({ label: a, onSelect: () => setGood(a) })),
            ]}
          />
          <p className={styles.caption} aria-live="polite">
            {good ? `You picked ${good}. You saw which row, too.` : 'Pick an action. The row you chose flashes before the menu closes.'}
          </p>
        </div>
      }
      bad={
        <div className={styles.originStage}>
          <VanishingMenu onPick={setBad} />
          <p className={styles.caption} aria-live="polite">
            {bad ? `You picked ${bad}. Did you, though?` : 'Pick an action. The menu just vanishes, and leaves you wondering what you hit.'}
          </p>
        </div>
      }
    />
  )
}

// ----------------------------------------------------------------- 8. toasts

function FireFive() {
  const toast = useToast()
  return (
    <Button
      variant="primary"
      onClick={() => {
        for (let i = 1; i <= 5; i++) toast({ variant: 'success', title: `Saved ${i} of 5`, body: 'Your change is live.', duration: 1600 })
      }}
    >
      Fire five toasts
    </Button>
  )
}

function Pile() {
  const [items, setItems] = useState<number[]>([])
  const next = useRef(0)
  const fire = () => {
    const ids = Array.from({ length: 5 }, () => next.current++)
    setItems((l) => [...l, ...ids])
    setTimeout(() => setItems((l) => l.filter((x) => !ids.includes(x))), 3200)
  }
  return (
    <>
      <Button variant="primary" onClick={fire}>
        Fire five toasts
      </Button>
      <ol className={styles.pile} aria-hidden="true">
        {items.map((id, i) => (
          <li key={id} className={styles.pileToast} style={{ '--i': i } as CSSProperties}>
            Saved {(id % 5) + 1} of 5
          </li>
        ))}
      </ol>
    </>
  )
}

export function ToastDemo() {
  return (
    <DoDont
      good={
        <ToastProvider>
          <div className={styles.originStage}>
            <FireFive />
            <p className={styles.caption}>Five toasts, one at a time, at the bottom. Each waits its turn.</p>
          </div>
        </ToastProvider>
      }
      bad={
        <div className={styles.originStage}>
          <Pile />
          <p className={styles.caption}>Five at once, piled over the page. Which one mattered?</p>
        </div>
      }
    />
  )
}

// ---------------------------------------------------------------- 9. reduced

export function ReducedDemo() {
  const { simulated, os } = useContext(ReduceContext)
  return (
    <div className={styles.frame}>
      <ReduceSwitch id="reduce-section" />
      <p className={styles.caption}>
        Your system setting is <strong>{os ? 'reduce' : 'no preference'}</strong>
        {simulated ? ', and the simulation is on.' : '.'} With either, every demo above keeps its feedback and
        drops its movement: rises become fades, the race dots jump, the tabs indicator jumps, and color changes
        still ease. Nothing here needed its own code for it. It is one layer in the stylesheet, and a
        multiplier, <code>--graphite-motion-travel</code>, that every distance is written through.
      </p>
    </div>
  )
}

// ----------------------------------------------------------------- 10. tokens

export function TokensTable({ tokens }: { tokens: MotionToken[] }) {
  const [play, setPlay] = useState(false)
  const { toast, copy } = useCopy()
  // Each family previewed the way it is used: a duration on Out, an easing
  // at the cap, the spring at slow, the delay as a wait and then a jump.
  const previewStyle = (t: MotionToken): CSSProperties => {
    const v = `var(${t.name})`
    const vars: Record<string, string> =
      t.family === 'duration'
        ? { '--dur': v, '--ease': 'var(--graphite-motion-easing-out)' }
        : t.family === 'delay'
          ? { '--dur': 'var(--graphite-motion-duration-instant)', '--ease': 'var(--graphite-motion-easing-linear)', '--delay': v }
          : t.family === 'spring'
            ? { '--dur': 'var(--graphite-motion-duration-slow)', '--ease': v }
            : { '--dur': 'var(--graphite-motion-duration-emphasis)', '--ease': v }
    return vars as CSSProperties
  }
  return (
    <div className={styles.frame}>
      <div className={styles.controls}>
        <Button variant="primary" onClick={() => setPlay((v) => !v)}>
          {play ? 'Send them back' : 'Play every token'}
        </Button>
      </div>
      <ul className={styles.tokenList}>
        {tokens.map((t) => (
          <li key={t.name} className={styles.tokenRow}>
            <div className={styles.tokenName}>
              <code>{t.name}</code>
              <span className={styles.tokenValue}>
                {t.family === 'spring' ? `linear(), a critically damped spring in ${t.value.split(',').length} points` : t.value}
              </span>
            </div>
            <span className={styles.miniTrack} aria-hidden="true">
              <span className={styles.miniDot} data-there={play || undefined} style={previewStyle(t)} />
            </span>
            <div className={styles.tokenCopy}>
              <Button size="sm" variant="ghost" onClick={() => copy(`${t.name}-css`, `var(${t.name})`)}>
                CSS
              </Button>
              <Button size="sm" variant="ghost" onClick={() => copy(`${t.name}-tw`, t.tailwind)}>
                Tailwind
              </Button>
            </div>
            <p className={styles.tokenUsers}>
              {t.usedBy.length ? (
                <>
                  Used by{' '}
                  {t.usedBy.flatMap((c, i) => [
                    i ? ', ' : '',
                    <a key={c.slug} href={`/docs/components/${c.slug}`}>
                      {c.title}
                    </a>,
                  ])}
                </>
              ) : (
                <>No component names it yet.</>
              )}
            </p>
          </li>
        ))}
      </ul>
      <CopyToast message={toast} />
    </div>
  )
}

// -------------------------------------------------------------------- root

/**
 * The client half of the page: the reduced-motion simulation and the sticky
 * bar that holds its switch. The demos themselves are passed in as children,
 * so the server keeps the headings and the copy.
 */
export function MotionPlayground({ children }: { children: ReactNode }) {
  const [simulated, set] = useState(false)
  const [os, setOs] = useState(false)
  const id = useId()
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setOs(mq.matches)
    const on = () => setOs(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return (
    <ReduceContext.Provider value={{ simulated, set, os }}>
      <div data-motion={simulated ? 'reduce' : undefined} className={styles.playground}>
        <div className={styles.stickyBar}>
          <ReduceSwitch id={`${id}-bar`} />
        </div>
        {children}
      </div>
    </ReduceContext.Provider>
  )
}
