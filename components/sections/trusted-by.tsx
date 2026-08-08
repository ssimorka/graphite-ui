'use client'

import { Grid, Column } from '@carbon/react'
import { Reveal } from '@/components/reveal'
import { CARBON_VAR_COUNT } from '@/components/theme-provider'

// A wall of invented customer logos says nothing. These are the system's real
// dimensions — more honest, and more useful to a design lead deciding whether
// Graphite UI goes deep enough for their team.
const FACTS = [
  { value: '20', label: 'Tile types' },
  { value: '3', label: 'Perceptual ramps' },
  { value: String(CARBON_VAR_COUNT), label: 'Mapped variables' },
  { value: '2', label: 'Themes, auto-paired' },
  { value: 'AA', label: 'WCAG floor' },
  { value: '1', label: 'Input' },
]

export function TrustedBy() {
  return (
    <section className="trusted" aria-label="What Graphite UI generates">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <p className="trusted__label">
              One hex value in. An entire system out.
            </p>
            <ul className="trusted__logos">
              {FACTS.map((f) => (
                <li key={f.label} className="trusted__fact">
                  <span className="trusted__fact-value">{f.value}</span>
                  <span className="trusted__fact-label">{f.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
