'use client'

import { Grid, Column } from '@carbon/react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { makeRamps, buildTheme } from '@/lib/color.js'
import styles from './two-doors.module.scss'

// The token rows the designers' door shows behind its copy. The kit's own
// note on this component says it is "populated from the contract tokens list,
// so it recolours with the source colour" — so these read from the live theme
// rather than being drawn in.
const DOOR_TOKENS: { role: string; use: string }[] = [
  { role: 'surface', use: 'Panel and trigger background.' },
  { role: 'onSurface', use: 'Trigger label.' },
  { role: 'onSurfaceVariant', use: 'Panel body copy, and the indicator glyph.' },
  { role: 'outline', use: 'The rule between items, and the outer border.' },
  { role: 'surfaceVariant', use: 'Trigger hover. A tone step, never a new color.' },
]

const CODE_SAMPLE = `import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'

<Button variant="primary">
  Get started
</Button>

<Tag variant="success">Contract 2.3.0</Tag>`

/** Kit section "05 Two doors" (11864:3180). */
export function TwoDoors() {
  const { sourceHex, theme, lightBundle, darkBundle, level } = useTheme()
  const ramps = makeRamps(sourceHex || COVER_SOURCE_HEX)
  const bundle =
    (theme === 'white' ? lightBundle : darkBundle) ??
    buildTheme(theme === 'white' ? 'light' : 'dark', ramps, level)
  const tokens = (bundle as { tokens: Record<string, { hex: string }> }).tokens

  return (
    <section className={styles.section} aria-labelledby="doors-title">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <div className={styles.heading}>
              <h2 className={styles.title} id="doors-title">
                Two ways in
              </h2>
              <p className={styles.body}>
                Designers and developers consume the same system through
                different artefacts, and the site should not pretend otherwise.
              </p>
            </div>

            <div className={styles.doors}>
              <article className={styles.door}>
                <div className={styles.doorBody}>
                  <h3 className={styles.doorTitle}>For designers</h3>
                  <p className={styles.doorCopy}>
                    The kit is the source of truth. Where it and a contract
                    disagree, the kit wins.
                  </p>
                  <Button variant="secondary" asChild>
                    <a
                      href="https://www.figma.com/design/7acsVKpgQlYTbOxuPIrCce/Graphite-UI-Site"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open the Figma Kit
                    </a>
                  </Button>
                </div>
                {/* Decorative: the door's motif is a slice of the artefact
                    behind it, bleeding off the card's clipped edge. */}
                <div className={styles.artefact} aria-hidden="true">
                  <div className={styles.tokenTable}>
                    {DOOR_TOKENS.map(({ role, use }) => (
                      <div key={role} className={styles.tokenRow}>
                        <span
                          className={styles.tokenSwatch}
                          style={{ background: tokens[role]?.hex }}
                        />
                        <code className={styles.tokenRole}>{role}</code>
                        <span className={styles.tokenUse}>{use}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className={styles.door}>
                <div className={styles.doorBody}>
                  <h3 className={styles.doorTitle}>For developers</h3>
                  <p className={styles.doorCopy}>
                    Contracts are the written spec the code is checked against,
                    and they are versioned.
                  </p>
                  <Button variant="secondary" asChild>
                    <a href="/gallery">See the code</a>
                  </Button>
                </div>
                <div className={styles.artefact} aria-hidden="true">
                  <pre className={styles.code}>{CODE_SAMPLE}</pre>
                </div>
              </article>
            </div>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
