'use client'

import { Grid, Column } from '@carbon/react'
import { Time, Accessibility, Renew, Bot } from '@carbon/icons-react'
import { Reveal } from '@/components/reveal'

const BENEFITS = [
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

export function Benefits() {
  return (
    <section className="section section--benefits" id="benefits">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <p className="section__eyebrow">Why it matters</p>
            <h2 className="section__title">What a generative system buys you</h2>
            <p className="section__subtitle">
              A design system earns its keep when it removes decisions.
              Graphite UI removes the ones nobody enjoys making twice.
            </p>
          </Reveal>
        </Column>
      </Grid>

      <Grid className="benefit-grid">
        {BENEFITS.map((benefit, i) => {
          const Icon = benefit.icon
          return (
            <Column key={benefit.title} sm={4} md={4} lg={4}>
              <Reveal delay={i * 80}>
                <div className="benefit">
                  <span className="benefit__icon">
                    <Icon size={24} />
                  </span>
                  <p className="benefit__stat">{benefit.stat}</p>
                  <h3 className="benefit__title">{benefit.title}</h3>
                  <p className="benefit__body">{benefit.body}</p>
                </div>
              </Reveal>
            </Column>
          )
        })}
      </Grid>
    </section>
  )
}
