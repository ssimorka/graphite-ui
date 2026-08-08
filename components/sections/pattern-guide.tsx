'use client'

import { Grid, Column } from '@carbon/react'
import { Reveal } from '@/components/reveal'
import { PatternSpecimen, PATTERN_NAMES } from '@/components/generative-art'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { makeRamps, buildTheme } from '@/lib/color.js'

const SPANS: { label: string; cols: number; rows: number }[] = [
  { label: '1 × 1', cols: 1, rows: 1 },
  { label: '2 × 1', cols: 2, rows: 1 },
  { label: '1 × 2', cols: 1, rows: 2 },
  { label: '2 × 2', cols: 2, rows: 2 },
  { label: '3 × 1', cols: 3, rows: 1 },
  { label: '3 × 2', cols: 3, rows: 2 },
]

export function PatternGuide() {
  const { sourceHex, theme, lightBundle, darkBundle } = useTheme()
  const isDark = theme === 'g100'
  // The 10% band is the composition's on-surface color, so read the real
  // token rather than aliasing it through a Carbon variable.
  const bundle =
    (isDark ? darkBundle : lightBundle) ??
    buildTheme(isDark ? 'dark' : 'light', makeRamps(sourceHex || COVER_SOURCE_HEX))
  const tokens = (bundle as unknown as {
    tokens: Record<string, { hex: string }>
  }).tokens

  return (
    <section className="section section--guide" id="patterns">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <p className="section__eyebrow">Pattern reference</p>
            <h2 className="section__title">Twenty tiles, one rulebook</h2>
            <p className="section__subtitle">
              Every composition draws from the same fixed library. Define the
              rules, let the system execute: the logic behind Sol LeWitt&rsquo;s
              wall drawings, applied to interface surfaces.
            </p>
          </Reveal>
        </Column>
      </Grid>

      {/* Color rhythm */}
      <Grid>
        <Column sm={4} md={8} lg={{ span: 14, offset: 1 }}>
          <Reveal>
            <h3 className="guide__heading">Color rhythm · 60 / 30 / 10</h3>
            <p className="guide__lede">
              Sixty percent neutrals, thirty percent accent, ten percent a
              vivid complement. Adjacent panels check their neighbours so no
              color clusters.
            </p>
            <div className="ratio-bar" role="img" aria-label="Sixty percent neutral, thirty percent accent, ten percent complement">
              <span className="ratio-bar__seg ratio-bar__seg--neutral"><span>60% Neutral</span></span>
              <span className="ratio-bar__seg ratio-bar__seg--accent"><span>30% Accent</span></span>
              <span
                className="ratio-bar__seg ratio-bar__seg--pop"
                style={{
                  background: tokens.onSurface.hex,
                  color: tokens.surface.hex,
                }}
              >
                <span>10%</span>
              </span>
            </div>
          </Reveal>
        </Column>
      </Grid>

      {/* Span definitions */}
      <Grid>
        <Column sm={4} md={8} lg={{ span: 14, offset: 1 }}>
          <Reveal>
            <h3 className="guide__heading">Span definitions</h3>
            <p className="guide__lede">
              Larger cells act as anchors. Image panels always land on a large
              span, distributed across horizontal zones so no region dominates.
            </p>
            <ul className="span-list">
              {SPANS.map((s) => (
                <li key={s.label} className="span-list__item">
                  <span
                    className="span-list__box"
                    style={{ width: s.cols * 44, height: s.rows * 44 }}
                    aria-hidden="true"
                  />
                  <span className="span-list__label">{s.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Column>
      </Grid>

      {/* Tile library */}
      <Grid>
        <Column sm={4} md={8} lg={{ span: 14, offset: 1 }}>
          <Reveal>
            <h3 className="guide__heading">Tile library</h3>
            <p className="guide__lede">
              All twenty types, rendered live from your source color.
            </p>
            <ol className="tile-grid">
              {PATTERN_NAMES.map((name, i) => (
                <li key={name} className="tile-grid__item">
                  <div className="tile-grid__canvas">
                    <PatternSpecimen index={i} size={140} />
                  </div>
                  <p className="tile-grid__label">
                    <span className="tile-grid__num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {name}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
