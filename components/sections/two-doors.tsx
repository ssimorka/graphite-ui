'use client'

import { Grid, Column } from '@carbon/react'
import { KitIcon } from '@/components/kit-icon'
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

// What a developer writes: the Accordion's install, its styles as Graphite
// variables, and its use. The kit's panel showed raw Figma "copy as CSS"
// output here (fixed widths, Figma variable names), which is not code anyone
// would ship.
const CODE_BLOCKS = [
  `npx shadcn@latest add https://www.graphite-ui.com/r/accordion.json`,
  `.item {
  border-top: 1px solid var(--graphite-outline);
  background: var(--graphite-surface);
  color: var(--graphite-on-surface);
}`,
  `import { Accordion, AccordionItem } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="ready" title="Is Graphite UI production ready?">
    Every component carries a versioned contract.
  </AccordionItem>
</Accordion>`,
]

/** Kit section "05 Two doors" (11864:3180). */
export function TwoDoors() {
  const { sourceHex, theme, lightBundle, darkBundle, level } = useTheme()
  const ramps = makeRamps(sourceHex || COVER_SOURCE_HEX)
  const bundle =
    (theme === 'light' ? lightBundle : darkBundle) ??
    buildTheme(theme, ramps, level)
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
                Designers work from the Figma kit. Developers work from React
                components. Both read the same tokens.
              </p>
            </div>

            <div className={styles.doors}>
              <article className={styles.door}>
                <div className={styles.doorBody}>
                  <h3 className={styles.doorTitle}>For designers</h3>
                  <p className={styles.doorCopy}>
                    Design in the Figma kit, a published library with the same
                    tokens as the code. Shown: the Accordion&apos;s color tokens,
                    live.
                  </p>
                </div>
                {/* The door's action, the corner action the other cards end
                    in, here in the bottom-left corner. Its overlay makes the
                    whole door the link. */}
                <Button asChild variant="primary" size="lg" className={styles.cta}>
                  <a
                    href="https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open the Figma Kit
                    <KitIcon name="arrow-small-right" className={styles.ctaIcon} />
                  </a>
                </Button>
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
                    Install each component as source you own, with one command.
                    Shown: the Accordion, installed, styled and used.
                  </p>
                </div>
                <Button asChild variant="primary" size="lg" className={styles.cta}>
                  <a href="/gallery">
                    Browse the components
                    <KitIcon name="arrow-small-right" className={styles.ctaIcon} />
                  </a>
                </Button>
                <div className={styles.artefact} aria-hidden="true">
                  {CODE_BLOCKS.map((block, i) => (
                    <pre key={i} className={styles.code}>
                      {block}
                    </pre>
                  ))}
                </div>
              </article>
            </div>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
