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
import type { Ramps, Theme } from '@/lib/color.js'

// How long each capability holds the stage before the carousel advances.
// Long enough to read the body copy without waiting on it, and well past the
// 5s threshold that makes an unpausable auto-advance a WCAG 2.2.2 failure —
// which is why the pause control below is not optional decoration.
const DWELL_MS = 7000

type PanelKey =
  | 'ramps'
  | 'tokens'
  | 'contrast'
  | 'vars'
  | 'patterns'
  | 'themes'

// The six capabilities, each paired with the panel that demonstrates it. Copy
// is the former Features grid verbatim: the section changed shape, not claims.
const CAPABILITIES: {
  key: PanelKey
  icon: typeof ColorPalette
  title: string
  body: string
  caption: string
}[] = [
  {
    key: 'ramps',
    icon: ColorPalette,
    title: 'Perceptual ramps',
    body: 'Your source color is resolved in OKLab and sampled at fixed tone stops. Steps read as evenly spaced at any hue: no muddy midtones, no blown-out highs.',
    caption: 'Live ramps from the color you picked. The outlined stop is your source.',
  },
  {
    key: 'tokens',
    icon: Types,
    title: 'Semantic tokens',
    body: 'Ramps resolve into named roles: surface, on-surface, primary, outline. You design against meaning, not hex values, so a color change never means a find-and-replace.',
    caption: 'Eight of the thirty-two roles, resolved for the theme you are reading in.',
  },
  {
    key: 'contrast',
    icon: Accessibility,
    title: 'Contrast auto-fix',
    body: 'Every pairing is measured against WCAG 2.1 and walked along its ramp until it passes. Accessibility is a property of the system, not a review step.',
    caption: 'Each row is rendered on the color it was measured against.',
  },
  {
    key: 'vars',
    icon: Api,
    title: 'Drop-in variables',
    body: `${CARBON_VAR_COUNT} CSS custom properties map onto your existing component library. Point your build at the output and existing UI repaints untouched.`,
    caption: 'The same values this page is painted with, ready to paste.',
  },
  {
    key: 'patterns',
    icon: GridIcon,
    title: 'Generative patterns',
    body: 'Twenty tile types on a variable-span grid with neighbour-aware color and layout. Brand imagery that composes itself, exportable at print resolution.',
    caption: 'Six of the twenty specimens, seeded from your source hex.',
  },
  {
    key: 'themes',
    icon: Moon,
    title: 'Paired themes',
    body: 'Light and dark are generated together from the same source, so they stay in lockstep. Ship both from day one without maintaining two palettes.',
    caption: 'One input, two themes, generated in the same pass.',
  },
]

// The old Benefits grid, folded in as proof under the carousel rather than
// repeating the card-grid shape a second time down the page.
const PROOF = [
  {
    icon: Time,
    stat: 'Minutes',
    title: 'From brand color to shipped theme',
    body: 'Skip the week of swatch spreadsheets and contrast spot-checks. Paste a hex, review the output, hand engineering a token file.',
  },
  {
    icon: Accessibility,
    stat: '100%',
    title: 'Of pairings meet their target',
    body: 'Contrast is enforced when tokens are generated, so accessibility bugs never reach a design review or an audit.',
  },
  {
    icon: Renew,
    stat: 'Zero',
    title: 'Rework when the brand changes',
    body: 'Rebranding is one input away. Every ramp, token, theme, and pattern regenerates from the new color in a single pass.',
  },
  {
    icon: Bot,
    stat: 'Rules',
    title: 'A machine can actually follow',
    body: 'The system is defined as constraints, not opinions, which is precisely what makes it legible to the agents now assembling interfaces.',
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
}

function PanelRamps({ ramps }: { ramps: Ramps }) {
  return (
    <div className="cap-ramps">
      {(['accent', 'secondary', 'neutral', 'neutralVariant'] as const).map(
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

export function Capabilities() {
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
            <p className="section__eyebrow">The system</p>
            <h2 className="section__title">
              Everything downstream of one decision
            </h2>
            <p className="section__subtitle">
              Pick a color. Graphite UI derives the ramps, the tokens, the
              contrast pairings, and the patterns, then keeps them in sync every
              time you change your mind. Color is the first foundation; the same
              model extends to layout and components as they ship.
            </p>
          </Reveal>
        </Column>
      </Grid>

      <Grid className="cap-grid">
        <Column sm={4} md={8} lg={6}>
          <Reveal>
            <ul className="cap-list">
              {CAPABILITIES.map((capability, i) => {
                const Icon = capability.icon
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
                      <Icon size={20} className="cap-item__icon" />
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
                {item.key === 'ramps' && <PanelRamps ramps={ramps} />}
                {item.key === 'tokens' && <PanelTokens theme={current} />}
                {item.key === 'contrast' && <PanelContrast theme={current} />}
                {item.key === 'vars' && <PanelVars theme={current} />}
                {item.key === 'patterns' && <PanelPatterns />}
                {item.key === 'themes' && (
                  <PanelThemes light={light} dark={dark} />
                )}
              </div>
              <p className="cap-stage__caption">{item.caption}</p>
            </div>
          </Reveal>
        </Column>
      </Grid>

      <Grid className="cap-proof">
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <p className="cap-proof__lead">What that buys you</p>
          </Reveal>
        </Column>
        {PROOF.map((entry, i) => {
          const Icon = entry.icon
          return (
            <Column key={entry.title} sm={4} md={4} lg={4}>
              <Reveal delay={i * 80}>
                <div className="cap-proof__item">
                  <span className="cap-proof__icon">
                    <Icon size={20} />
                  </span>
                  <p className="cap-proof__stat">{entry.stat}</p>
                  <h3 className="cap-proof__title">{entry.title}</h3>
                  <p className="cap-proof__body">{entry.body}</p>
                </div>
              </Reveal>
            </Column>
          )
        })}
      </Grid>
    </section>
  )
}
