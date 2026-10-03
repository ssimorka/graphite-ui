'use client'

import { Grid, Column } from '@carbon/react'
import { ArrowRight, Book } from '@carbon/icons-react'
import { Reveal } from '@/components/reveal'
import { MeshGradient } from '@/components/mesh-gradient'
import { Button } from '@/components/ui/button'
import styles from './theme-cta.module.scss'

/**
 * Kit section "04 Theme" (11864:3148). The primary action opens the theme
 * builder at /create, as the kit draws it. (Until that page existed it opened
 * the header's source-colour control instead, which was the builder the site had.)
 */
export function ThemeCta() {
  return (
    <section
      className={`${styles.section} band--accent`}
      id="theme"
      aria-labelledby="theme-title"
    >
      {/* Kit 13535:15197, the accent variant. The band class above stays for
          the text and control bindings it carries; its own fill sits under
          the mesh. */}
      <MeshGradient family="accent" />
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <div className={styles.heading}>
              <h2 className={styles.title} id="theme-title">
                Make it yours in one control
              </h2>
              <p className={styles.body}>
                The builder derives a full theme from any color, holds it to your
                contrast target as it goes, and hands you CSS variables or JSON
                tokens at the end.
              </p>
            </div>
            <div className={styles.ctas}>
              <Button variant="primary" size="lg" asChild>
                <a href="/create">
                  Open the theme builder
                  <ArrowRight />
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href="/docs/theming">
                  Read how theming works
                  <Book />
                </a>
              </Button>
            </div>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
