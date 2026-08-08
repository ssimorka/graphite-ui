'use client'

import { Grid, Column, Tile } from '@carbon/react'
import {
  ColorPalette,
  Types,
  Accessibility,
  Api,
  Grid as GridIcon,
  Moon,
} from '@carbon/icons-react'
import { Reveal } from '@/components/reveal'

const FEATURES = [
  {
    icon: ColorPalette,
    title: 'Perceptual ramps',
    body: 'Your source colour is resolved in OKLab and sampled at fixed tone stops. Steps read as evenly spaced at any hue: no muddy midtones, no blown-out highs.',
  },
  {
    icon: Types,
    title: 'Semantic tokens',
    body: 'Ramps resolve into named roles: surface, on-surface, primary, outline. You design against meaning, not hex values, so a colour change never means a find-and-replace.',
  },
  {
    icon: Accessibility,
    title: 'Contrast auto-fix',
    body: 'Every pairing is measured against WCAG 2.1 and walked along its ramp until it passes. Accessibility is a property of the system, not a review step.',
  },
  {
    icon: Api,
    title: 'Drop-in variables',
    body: 'Thirty-three CSS custom properties map onto your existing component library. Point your build at the output and existing UI repaints untouched.',
  },
  {
    icon: GridIcon,
    title: 'Generative patterns',
    body: 'Twenty tile types on a variable-span grid with neighbour-aware colour and layout. Brand imagery that composes itself, exportable at print resolution.',
  },
  {
    icon: Moon,
    title: 'Paired themes',
    body: 'Light and dark are generated together from the same source, so they stay in lockstep. Ship both from day one without maintaining two palettes.',
  },
]

export function Features() {
  return (
    <section className="section" id="system">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <p className="section__eyebrow">The system</p>
            <h2 className="section__title">
              Everything downstream of one decision
            </h2>
            <p className="section__subtitle">
              Pick a colour. Graphite UI derives the ramps, the tokens, the
              contrast pairings, and the patterns, then keeps them in sync
              every time you change your mind. Color is the first foundation;
              the same model extends to layout and components as they ship.
            </p>
          </Reveal>
        </Column>
      </Grid>

      <Grid className="feature-grid">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          return (
            <Column key={feature.title} sm={4} md={4} lg={{ span: 5, offset: i % 3 === 0 ? 1 : 0 }}>
              <Reveal delay={(i % 3) * 80}>
                <Tile className="feature-card">
                  <span className="feature-card__icon">
                    <Icon size={24} />
                  </span>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__body">{feature.body}</p>
                </Tile>
              </Reveal>
            </Column>
          )
        })}
      </Grid>
    </section>
  )
}
