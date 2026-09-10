'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, Column } from '@carbon/react'
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

// The desktop carousel has no timer. The section is a tall scroll track with
// the content stuck to the viewport inside it, so reading position picks the
// panel. How tall that track is lives in globals.scss ($cap-dwell) and is read
// back from geometry here rather than duplicated, so there is one number.
//
// That also takes WCAG 2.2.2 off the table rather than satisfying it: there is
// no moving content to pause, because the reader is what moves it.

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
    body: 'Accent, secondary, neutral, neutral variant and four status ramps. Status hue is pinned so red still reads as danger whatever the source is.',
    caption: 'Every ramp the engine emits, live from the color you picked.',
  },
  {
    key: 'roles',
    title: 'Thirty-two roles',
    body: 'Named roles per theme (surface, on-surface, primary, outline) checked against WCAG as they resolve. You design against meaning, not hex values.',
    caption: 'Eight of the thirty-two roles, resolved for the theme you are reading in.',
  },
  {
    key: 'components',
    title: '22 governed components',
    body: 'Each one may not change without its contract changing first.',
    caption: 'Every component with a contract, and the version it implements.',
  },
  {
    key: 'checks',
    title: '3 checks in CI',
    body: 'Contracts against code, foundations against the token snapshot, docs against the kit.',
    caption: 'The governance job. A red check blocks the merge.',
  },
  {
    key: 'sets',
    title: '206 component sets tracked',
    body: 'Including the 73 public sets with no contract, which are labelled rather than hidden.',
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

function StagePanel({
  item,
  hex,
  ramps,
  theme,
  contracts,
  stats,
}: {
  item: (typeof CAPABILITIES)[number]
  hex: string
  ramps: Ramps
  theme: Theme
  contracts: { component: string; version: string }[]
  stats: KitStats
}) {
  switch (item.key) {
    case 'source':
      return <PanelSource hex={hex} ramps={ramps} />
    case 'ramps':
      return <PanelRamps ramps={ramps} />
    case 'roles':
      return <PanelTokens theme={theme} />
    case 'components':
      return <PanelComponents contracts={contracts} />
    case 'checks':
      return <PanelChecks />
    case 'sets':
      return <PanelSets stats={stats} />
  }
}

// --- Section ----------------------------------------------------------------

// The kit only draws the carousel at X-Large. Medium and Small stack all six
// capabilities, each above its own stage, with the controls hidden — so below
// lg there is no carousel to drive and no dwell timer to run.
//
// Defaults true so the server renders the X-Large tree and hydration matches;
// a narrow viewport corrects it on mount. 1056px is the kit's lg stop, the
// same one the header's nav uses.
function useCarouselLayout() {
  const [isCarousel, setIsCarousel] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1056px)')
    const sync = () => setIsCarousel(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return isCarousel
}

export function Capabilities({
  contracts,
  stats,
}: {
  contracts: { component: string; version: string }[]
  stats: KitStats
}) {
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)

  const trackRef = useRef<HTMLElement>(null)
  const paneRef = useRef<HTMLDivElement>(null)
  const fills = useRef<(HTMLSpanElement | null)[]>([])

  const { sourceHex, lightBundle, darkBundle, level, theme } = useTheme()
  const activeHex = sourceHex || COVER_SOURCE_HEX
  const ramps = makeRamps(activeHex)

  // Same fallback the explorer uses: the provider has no bundle on first
  // paint, and a panel that renders empty for a frame reads as broken.
  const light = (lightBundle ?? buildTheme('light', ramps, level)) as Theme
  const dark = (darkBundle ?? buildTheme('dark', ramps, level)) as Theme
  const current = theme === 'white' ? light : dark

  const isCarousel = useCarouselLayout()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Where the track sits and how far it can be read through. Taken from live
  // geometry rather than recomputed from DWELL_PX, so the stylesheet stays the
  // single place the track's height is decided.
  const measure = useCallback(() => {
    const track = trackRef.current
    const pane = paneRef.current
    if (!track || !pane) return null
    // The pane sticks when the track's top reaches the pane's own `top`, so
    // that offset is where progress starts, not the viewport edge.
    const stickyTop = parseFloat(getComputedStyle(pane).top) || 0
    const scrollable = track.offsetHeight - pane.offsetHeight
    if (scrollable <= 0) return null
    return { track, scrollable, stickyTop }
  }, [])

  // Desktop: reading position picks the panel. The rail is that same reading,
  // so the bar cannot show a different progress than the one doing the
  // selecting — the property the dwell timer used to hold.
  useEffect(() => {
    if (!isCarousel) return
    let frame = 0

    const read = () => {
      frame = 0
      const m = measure()
      if (!m) return
      const passed = m.stickyTop - m.track.getBoundingClientRect().top
      const progress = Math.min(1, Math.max(0, passed / m.scrollable))
      // Each panel owns an equal share of the track. Clamped at the end so the
      // last one keeps the stage rather than wrapping round to the first.
      const exact = progress * CAPABILITIES.length
      const index = Math.min(CAPABILITIES.length - 1, Math.floor(exact))
      setActive(index)
      fills.current.forEach((el, i) => {
        if (!el) return
        const fill = i < index ? 1 : i > index ? 0 : Math.min(1, exact - index)
        el.style.transform = `scaleY(${fill})`
      })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isCarousel, measure])

  // Clicking a capability scrolls to its share of the track. Setting `active`
  // straight would last exactly one frame, since the next reading overrides it.
  const goTo = useCallback(
    (i: number) => {
      const m = measure()
      if (!m) return
      const trackTop =
        window.scrollY + m.track.getBoundingClientRect().top - m.stickyTop
      // Aim at the middle of the panel's share rather than its leading edge, so
      // a rounding error cannot land on the neighbour.
      const y = trackTop + m.scrollable * ((i + 0.5) / CAPABILITIES.length)
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
    },
    [measure, reduced],
  )

  const item = CAPABILITIES[active]

  return (
    <section
      className="section section--capabilities"
      id="system"
      ref={trackRef}
      style={{ ['--cap-count' as string]: CAPABILITIES.length }}
    >
      {/* Everything sits in one sticky pane, so the heading stays with the
          stage while the track scrolls past underneath. Below lg the class
          carries no styles at all and this is an ordinary div. */}
      <div className="cap-sticky" ref={paneRef}>
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <Reveal>
              <h2 className="section__title">
                One decision, resolved all the way down
              </h2>
              <p className="section__subtitle">
                The engine does the work Figma cannot: it derives, it measures,
                and it does both themes at once. Three checks in CI then keep
                the result honest.
              </p>
            </Reveal>
          </Column>
        </Grid>

        {isCarousel ? (
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
                          onClick={() => goTo(i)}
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

                {/* No pause control any more: nothing advances on its own, so
                    there is nothing to stop. */}
                <div className="cap-controls">
                  <p className="cap-controls__count">
                    {active + 1} / {CAPABILITIES.length}
                  </p>
                  <p className="cap-controls__hint" aria-hidden="true">
                    Scroll to explore
                  </p>
                </div>
              </Reveal>
            </Column>

            <Column sm={4} md={8} lg={10}>
              <Reveal>
                <div className="cap-stage">
                  <div className="cap-stage__glow" aria-hidden="true" />
                  <div
                    className="cap-stage__frame"
                    id="cap-stage"
                    key={item.key}
                    role="region"
                    aria-labelledby={`cap-trigger-${item.key}`}
                  >
                    <StagePanel
                      item={item}
                      hex={activeHex}
                      ramps={ramps}
                      theme={current}
                      contracts={contracts}
                      stats={stats}
                    />
                  </div>
                  <p className="cap-stage__caption">{item.caption}</p>
                </div>
              </Reveal>
            </Column>
          </Grid>
        ) : (
          /* Medium and Small: every capability shown, each above its own stage.
             No rail fill, no count, no pause — with nothing advancing there is
             nothing to report or to stop. The left rule stays as the marker the
             kit draws. */
          <Grid className="cap-grid">
            <Column sm={4} md={8} lg={16}>
              <ul className="cap-stack">
                {CAPABILITIES.map((capability) => (
                  <li key={capability.key} className="cap-stack__item">
                    <Reveal>
                      <div className="cap-stack__head">
                        <h3 className="cap-stack__title">{capability.title}</h3>
                        <p className="cap-stack__body">{capability.body}</p>
                      </div>
                      <div className="cap-stage cap-stage--static">
                        <div className="cap-stage__glow" aria-hidden="true" />
                        <div className="cap-stage__frame">
                          <StagePanel
                            item={capability}
                            hex={activeHex}
                            ramps={ramps}
                            theme={current}
                            contracts={contracts}
                            stats={stats}
                          />
                        </div>
                        <p className="cap-stage__caption">{capability.caption}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </Column>
          </Grid>
        )}
      </div>
    </section>
  )
}
