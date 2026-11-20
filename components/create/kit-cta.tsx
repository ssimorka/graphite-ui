'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { KitIcon } from '@/components/kit-icon'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { kitLink } from '@/lib/kit-links'
import { track } from '@/lib/analytics'
import { takeColorMethod } from '@/lib/color-intent'
import styles from './kit-cta.module.scss'

/**
 * "Take this theme into Figma": the way from a theme to the kit. In the flow
 * under the preview, never over it, and only once a color is chosen: picked
 * here, or kept from an earlier visit. It stays once shown, so Reset does not
 * pull it out from under someone reading it.
 *
 * The line under the heading is generic on purpose. The docs say the kit is
 * drawn in the default color and that a theme from Create cannot yet be
 * brought into it, so this promises nothing about the color itself.
 */
export function KitCta() {
  const { sourceHex } = useTheme()
  const [shown, setShown] = useState(false)
  // The source the visit started with, read once the stored choice is back.
  // The provider restores it in a layout effect that can land after this
  // component's first effect, so the baseline is taken a task later; reading
  // it sooner would count the restore as a pick.
  const baseline = useRef<string | null>(null)
  const latest = useRef(sourceHex)
  latest.current = sourceHex

  useEffect(() => {
    const t = setTimeout(() => {
      baseline.current = latest.current
      // A note left by a pick on another page (a client-side route change)
      // belongs to that page, not to this visit.
      takeColorMethod()
      if (latest.current.toLowerCase() !== COVER_SOURCE_HEX) setShown(true)
    }, 0)
    return () => clearTimeout(t)
  }, [])

  // `theme_created`, once per visit: the first time the color is set here.
  // It says how (picker, hex, surprise), never which color. Reset is not a
  // choice, so it neither sends the event nor uses up the visit's one send.
  const created = useRef(false)
  useEffect(() => {
    if (baseline.current === null || sourceHex === baseline.current) return
    const method = takeColorMethod()
    if (method === 'reset') return
    setShown(true)
    if (!created.current) {
      created.current = true
      track('theme_created', { method: method ?? 'other' })
    }
  }, [sourceHex])

  if (!shown) return null

  return (
    <section className={styles.panel} aria-labelledby="kit-cta-title">
      <div className={styles.copy}>
        <h2 id="kit-cta-title" className={styles.title}>
          Take this theme into Figma
        </h2>
        <p className={styles.body}>Design with Graphite in Figma.</p>
      </div>
      <Button asChild variant="primary" size="lg" className={styles.action}>
        <a {...kitLink('free', 'gumroad', 'create')}>
          Get the free kit
          <KitIcon name="arrow-small-right" />
        </a>
      </Button>
    </section>
  )
}
