'use client'

import { Grid, Column } from '@carbon/react'
import { Reveal } from '@/components/reveal'
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

// The kit's own three blocks for this panel
// (I13170:4478;13170:4451 through 4453), verbatim. Two are Figma's "copy as
// CSS" output and the third is a usage sample, which is a fair picture of
// what crossing from design into code actually looks like.
//
// The usage sample is the shipped API: components/ui/accordion, contract
// 1.0.0, the one new component docs/SHADCN-MIGRATION.md budgeted for.
const CODE_BLOCKS = [
  `display: flex;
width: 401px;
flex-direction: column;
align-items: flex-start;`,
  `border-top: 1px solid var(--Border-border-subtle-00, #DEDCEA);
background: var(--Transparent, rgba(0, 0, 0, 0.00));
background-blend-mode: multiply;`,
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
                </div>
                {/* The door's action, as the filled block the other cards end
                    in, here in the bottom-left corner. Its overlay makes the
                    whole door the link. ↗ because it leaves the site. */}
                <a
                  className={styles.cta}
                  href="https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open the Figma Kit
                  <span aria-hidden="true">↗</span>
                </a>
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
                </div>
                <a className={styles.cta} href="/gallery">
                  See the code
                  <span aria-hidden="true">→</span>
                </a>
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
