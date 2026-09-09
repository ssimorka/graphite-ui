'use client'

import { useEffect, useRef, useState } from 'react'
import { Grid, Column, Button } from '@carbon/react'
import {
  ColorPalette,
  Types,
  Accessibility,
  Api,
  Grid as GridIcon,
  Moon,
  Time,
  Renew,
  Bot,
  Pause,
  Play,
} from '@carbon/icons-react'
import { Reveal } from '@/components/reveal'
import { PatternSpecimen } from '@/components/generative-art'
import {
  useTheme,
  COVER_SOURCE_HEX,
  CARBON_VAR_COUNT,
  graphiteVarName,
} from '@/components/theme-provider'
import { makeRamps, buildTheme } from '@/lib/color.js'
import { WEIGHT_LABELS } from '@/components/studio'
import type { KitStats } from '@/lib/kit-stats'
import type { Ramps, Theme } from '@/lib/color.js'

// How long each capability holds the stage before the carousel advances.
// Long enough to read the body copy without waiting on it, and well past the
// 5s threshold that makes an unpausable auto-advance a WCAG 2.2.2 failure —
// which is why the pause control below is not optional decoration.
const DWELL_MS = 7000

type PanelKey =
  | 'source'
  | 'ramps'
  | 'roles'
  | 'components'
  | 'checks'
  | 'sets'

// The six capabilities, each paired with the panel that demonstrates it. Copy
// names the artefacts the engine produces rather than the features that
// produce them, which is what the rail counts down.
const CAPABILITIES: {
  key: PanelKey
  title: string
  body: string
  caption: string
}[] = [
  {
    key: 'source',
    title: 'A source color',
    body: 'Any hex. It is resolved in OKLab and sampled at fixed tone stops, so the steps read as evenly spaced at any hue.',
    caption: "The outlined stop is the source. Numbers are the ramp's stops; hover one for its OKLab tone.",
  },
  {
    key: 'ramps',
    title: 'Eight ramps',
    body: 'Four are derived from the source: an accent, a secondary 120 degrees away, and two neutrals. Four more are pinned to their status hue, so red still reads as danger whatever you put in.',
    caption: 'Every ramp the engine emits, live from the color you picked.',
  },
  {
    key: 'roles',
    title: 'Thirty-two roles',
    body: 'Ramps resolve into named roles: surface, on-surface, primary, outline. You design against meaning rather than hex values, so a color change is never a find-and-replace.',
    caption: 'Eight of the thirty-two roles, resolved for the theme you are reading in.',
  },
  {
    key: 'components',
    title: '22 governed components',
    body: 'Each one carries a versioned contract saying what it must do, what it must not, and which roles it may touch. The contract is the spec the code is checked against.',
    caption: 'Every component with a contract, and the version it implements.',
  },
  {
    key: 'checks',
    title: '3 checks in CI',
    body: 'One holds the components to their contracts, one holds the foundations to the token snapshot, and one holds the component docs to the kit. All three read committed snapshots, so they run offline.',
    caption: 'The governance job. A red check blocks the merge.',
  },
  {
    key: 'sets',
    title: '206 component sets tracked',
    body: 'The kit is larger than its governed surface, and the parts without a contract say so on their own page rather than leaving you to find out.',
    caption: 'Walked from the kit snapshot, not counted from page names.',
  },
]

// --- Stage panels -----------------------------------------------------------
// Each one renders the engine's actual output rather than a picture of it, so
// the whole stage repaints when the color picker moves.

const TOKEN_ROLES = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'secondary',
  'background',
  'surface',
  'onSurface',
  'outline',
]

const CONTRAST_ROLES = [
  'onBackground',
  'onSurface',
  'onSurfaceVariant',
  'onPrimary',
  'outline',
]

const VAR_ROLES = ['background', 'surface', 'onSurface', 'primary', 'onPrimary', 'outline']

// The engine's key is camelCase; the label is prose. Only one of the four
// needs the split, but a map keeps the rendering free of a special case.
const RAMP_LABELS: Record<string, string> = {
  accent: 'accent',
  secondary: 'secondary',
  neutral: 'neutral',
  neutralVariant: 'neutral variant',
  danger: 'danger',
  warning: 'warning',
  success: 'success',
  info: 'info',
}

// Order matters: the four source-derived families first, then the four pinned
// to a status hue. That is the split the rail's copy describes.
const ALL_RAMPS = [
  'accent',
  'secondary',
  'neutral',
  'neutralVariant',
  'danger',
  'warning',
  'success',
  'info',
] as const

// The kit's first panel: the one input, then the accent ramp it produced, with
// the OKLab tone under each stop.
function PanelSource({ hex, ramps }: { hex: string; ramps: Ramps }) {
  return (
    <div className="cap-source">
      <p className="cap-source__input">
        <span
          className="cap-source__swatch"
          style={{ background: hex }}
          aria-hidden="true"
        />
        <span className="cap-source__hex">{hex}</span>
        <span className="cap-source__note">the one input</span>
      </p>
      <div className="cap-source__stops">
        {ramps.accent.stops.map((stop, i) => (
          <span key={i} className="cap-source__stop">
            <span
              className={`cap-source__chip${stop.source ? ' is-source' : ''}`}
              style={{ background: stop.hex }}
              title={`${stop.hex} · OKLab tone ${Math.round(stop.tone)}`}
            />
            <span className="cap-source__tone">{WEIGHT_LABELS[i]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function PanelComponents({
  contracts,
}: {
  contracts: { component: string; version: string }[]
}) {
  return (
    <ul className="cap-components">
      {contracts.map((c) => (
        <li key={c.component} className="cap-components__row">
          <span className="cap-components__name">{c.component}</span>
          <span className="cap-components__version">{c.version}</span>
        </li>
      ))}
    </ul>
  )
}

// The three drift checks the governance job runs. Descriptions rather than a
// screenshot of a green tick: what each one actually compares is the point.
const CHECKS = [
  {
    name: 'drift-check',
    body: 'Components against their contracts. Every declared role and variable has to exist in the implementation.',
  },
  {
    name: 'token-drift',
    body: 'Foundations against the kit token snapshot: spacing, radius, breakpoints and the type scale.',
  },
  {
    name: 'component-doc-drift',
    body: 'Component docs against the kit snapshot, so a public set cannot ship undocumented.',
  },
]

function PanelChecks() {
  return (
    <ul className="cap-checks">
      {CHECKS.map((check) => (
        <li key={check.name} className="cap-checks__row">
          <code className="cap-checks__name">{check.name}</code>
          <p className="cap-checks__body">{check.body}</p>
        </li>
      ))}
    </ul>
  )
}

function PanelSets({ stats }: { stats: KitStats }) {
  const rows = [
    { value: stats.sets, label: 'Component sets in the kit' },
    { value: stats.pages, label: 'Pages the snapshot covers' },
    { value: stats.governed, label: 'Carrying a versioned contract' },
  ]
  return (
    <ul className="cap-sets">
      {rows.map((row) => (
        <li key={row.label} className="cap-sets__row">
          <span className="cap-sets__value">{row.value}</span>
          <span className="cap-sets__label">{row.label}</span>
        </li>
      ))}
    </ul>
  )
}

function PanelRamps({ ramps }: { ramps: Ramps }) {
  return (
    <div className="cap-ramps">
      {ALL_RAMPS.map(
        (name) => (
          <div key={name} className="cap-ramps__row">
            <p className="cap-ramps__label">{RAMP_LABELS[name]}</p>
            <div className="cap-ramps__strip">
              {ramps[name].stops.map((stop, i) => (
                <span
                  key={i}
                  className={`cap-ramps__stop${stop.source ? ' is-source' : ''}`}
                  style={{ background: stop.hex }}
                  title={`${stop.hex} · tone ${Math.round(stop.tone)}`}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  )
}

function PanelTokens({ theme }: { theme: Theme }) {
  return (
    <ul className="cap-tokens">
      {TOKEN_ROLES.map((role) => {
        const token = theme.tokens[role]
        if (!token) return null
        return (
          <li key={role} className="cap-tokens__row">
            <span
              className="cap-tokens__swatch"
              style={{ background: token.hex }}
              aria-hidden="true"
            />
            <span className="cap-tokens__role">{role}</span>
            <span className="cap-tokens__hex">{token.hex}</span>
          </li>
        )
      })}
    </ul>
  )
}

function PanelContrast({ theme }: { theme: Theme }) {
  return (
    <ul className="cap-contrast">
      {CONTRAST_ROLES.map((role) => {
        const check = theme.contrast[role]
        const token = theme.tokens[role]
        if (!check || !token) return null
        const against = theme.tokens[check.against]
        return (
          <li
            key={role}
            className="cap-contrast__row"
            style={{ background: against?.hex, color: token.hex }}
          >
            <span className="cap-contrast__role">{role}</span>
            <span className="cap-contrast__ratio">
              {check.ratio.toFixed(1)}:1
            </span>
            <span className="cap-contrast__verdict">
              {check.passes ? 'pass' : 'fail'} · {check.level}
              {check.fixed ? ' · fixed' : ''}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function PanelVars({ theme }: { theme: Theme }) {
  return (
    <div className="cap-vars">
      <pre className="cap-vars__code">
        {VAR_ROLES.map((role) => {
          const token = theme.tokens[role]
          if (!token) return null
          return (
            <span key={role} className="cap-vars__line">
              <span
                className="cap-vars__dot"
                style={{ background: token.hex }}
                aria-hidden="true"
              />
              {graphiteVarName(role)}: {token.hex};
            </span>
          )
        })}
      </pre>
      <p className="cap-vars__more">
        Plus {CARBON_VAR_COUNT} <code>--cds-*</code> bindings, so a Carbon build
        repaints without touching a component.
      </p>
    </div>
  )
}

function PanelPatterns() {
  return (
    <div className="cap-patterns">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="cap-patterns__tile">
          <PatternSpecimen index={i} size={200} />
        </div>
      ))}
    </div>
  )
}

function PanelThemes({ light, dark }: { light: Theme; dark: Theme }) {
  return (
    <div className="cap-themes">
      {[
        { label: 'Light', data: light },
        { label: 'Dark', data: dark },
      ].map(({ label, data }) => (
        <div
          key={label}
          className="cap-themes__card"
          style={{
            background: data.tokens.background.hex,
            borderColor: data.tokens.outline.hex,
            color: data.tokens.onBackground.hex,
          }}
        >
          <p className="cap-themes__label">{label}</p>
          <div
            className="cap-themes__surface"
            style={{
              background: data.tokens.surface.hex,
              borderColor: data.tokens.outline.hex,
              color: data.tokens.onSurface.hex,
            }}
          >
            <span className="cap-themes__line" />
            <span className="cap-themes__line cap-themes__line--short" />
            <span
              className="cap-themes__button"
              style={{
                background: data.tokens.primary.hex,
                color: data.tokens.onPrimary.hex,
              }}
            >
              Primary
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// --- Section ----------------------------------------------------------------

export function Capabilities({
  contracts,
  stats,
}: {
  contracts: { component: string; version: string }[]
  stats: KitStats
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const fills = useRef<(HTMLSpanElement | null)[]>([])
  const elapsed = useRef(0)

  const { sourceHex, lightBundle, darkBundle, level, theme } = useTheme()
  const activeHex = sourceHex || COVER_SOURCE_HEX
  const ramps = makeRamps(activeHex)

  // Same fallback the explorer uses: the provider has no bundle on first
  // paint, and a panel that renders empty for a frame reads as broken.
  const light = (lightBundle ?? buildTheme('light', ramps, level)) as Theme
  const dark = (darkBundle ?? buildTheme('dark', ramps, level)) as Theme
  const current = theme === 'white' ? light : dark

  const running = inView && !paused && !hovering && !reduced

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Reset every rail when the selection changes. React does not own the fill
  // transforms — the animation frame writes them directly — so the item being
  // left behind has to be cleared by hand or it keeps its last frame.
  useEffect(() => {
    elapsed.current = 0
    fills.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleY(${reduced && i === active ? 1 : 0})`
    })
  }, [active, reduced])

  // The dwell timer and the rail are the same clock, so the bar cannot promise
  // a different moment than the one the carousel actually advances on.
  useEffect(() => {
    if (!running) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsed.current += now - last
      last = now
      const progress = Math.min(1, elapsed.current / DWELL_MS)
      const fill = fills.current[active]
      if (fill) fill.style.transform = `scaleY(${progress})`
      if (progress >= 1) {
        setActive((i) => (i + 1) % CAPABILITIES.length)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, running])

  const item = CAPABILITIES[active]

  return (
    <section className="section section--capabilities" id="system">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <h2 className="section__title">
              One decision, resolved all the way down
            </h2>
            <p className="section__subtitle">
              The engine does the work Figma cannot: it derives, it measures,
              and it does both themes at once. Three checks in CI then keep the
              result honest.
            </p>
          </Reveal>
        </Column>
      </Grid>

      <Grid className="cap-grid">
        <Column sm={4} md={8} lg={6}>
          <Reveal>
            <ul className="cap-list">
              {CAPABILITIES.map((capability, i) => {
                const isActive = i === active
                return (
                  <li
                    key={capability.key}
                    className={`cap-item${isActive ? ' is-active' : ''}`}
                  >
                    <span className="cap-item__rail" aria-hidden="true">
                      <span
                        className="cap-item__fill"
                        ref={(el) => {
                          fills.current[i] = el
                        }}
                      />
                    </span>
                    <button
                      type="button"
                      className="cap-item__trigger"
                      id={`cap-trigger-${capability.key}`}
                      aria-expanded={isActive}
                      aria-controls="cap-stage"
                      onClick={() => setActive(i)}
                    >
                      <span className="cap-item__title">
                        {capability.title}
                      </span>
                    </button>
                    {/* Mounted only while active rather than hidden: it keeps
                        the collapsed bodies out of the accessibility tree, so
                        aria-expanded and what a screen reader can reach agree,
                        and the mount is what replays the entrance. */}
                    {isActive && (
                      <div className="cap-item__reveal">
                        <p className="cap-item__body">{capability.body}</p>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="cap-controls">
              <p className="cap-controls__count">
                {active + 1} / {CAPABILITIES.length}
              </p>
              {!reduced && (
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={paused ? Play : Pause}
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? 'Play' : 'Pause'}
                </Button>
              )}
            </div>
          </Reveal>
        </Column>

        <Column sm={4} md={8} lg={10}>
          <Reveal>
            <div
              className="cap-stage"
              ref={stageRef}
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={() => setHovering(false)}
              onFocusCapture={() => setHovering(true)}
              onBlurCapture={() => setHovering(false)}
            >
              <div className="cap-stage__glow" aria-hidden="true" />
              <div
                className="cap-stage__frame"
                id="cap-stage"
                key={item.key}
                role="region"
                aria-labelledby={`cap-trigger-${item.key}`}
              >
                {item.key === 'source' && (
                  <PanelSource hex={activeHex} ramps={ramps} />
                )}
                {item.key === 'ramps' && <PanelRamps ramps={ramps} />}
                {item.key === 'roles' && <PanelTokens theme={current} />}
                {item.key === 'components' && (
                  <PanelComponents contracts={contracts} />
                )}
                {item.key === 'checks' && <PanelChecks />}
                {item.key === 'sets' && <PanelSets stats={stats} />}
              </div>
              <p className="cap-stage__caption">{item.caption}</p>
            </div>
          </Reveal>
        </Column>
      </Grid>

    </section>
  )
}
