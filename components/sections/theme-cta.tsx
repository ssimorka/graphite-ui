'use client'

import { Grid, Column } from '@carbon/react'
import { ArrowRight, Book } from '@carbon/icons-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { SOURCE_TRIGGER_ID } from '@/components/color-picker'
import styles from './theme-cta.module.scss'

/**
 * Kit section "04 Theme" (11864:3148).
 *
 * The kit draws the primary action as "Open the theme builder", but the Create
 * page it points at is designed and not yet built. Rather than link at a route
 * that would 404, the button opens the source-color control in the header,
 * which is the theme builder this site actually has today.
 */
export function ThemeCta() {
  const openPicker = () => {
    const trigger = document.getElementById(SOURCE_TRIGGER_ID)
    if (!trigger) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    trigger.click()
    trigger.focus()
  }

  return (
    <section className={styles.section} aria-labelledby="theme-title">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <div className={styles.heading}>
              <h2 className={styles.title} id="theme-title">
                Make it yours in one control
              </h2>
              <p className={styles.body}>
                The builder derives a full theme from any color, shows you the
                contrast report as it goes, and hands you CSS variables, JSON
                tokens or Figma variables at the end.
              </p>
            </div>
            <div className={styles.ctas}>
              <Button variant="primary" size="lg" onClick={openPicker}>
                Open the theme builder
                <ArrowRight />
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href="/docs">
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
