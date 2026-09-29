'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { CARDS } from './cards'
import type { CardEntry } from './cards'
import { DEVICES, useBuilder } from './builder'
import type { DeviceKey } from './builder'
import styles from './preview.module.scss'

// The kit's single-column order for Small (Graphite UI Site 11856:2265). It is
// a designed interleave of the two desktop columns, not the columns end to end,
// so it is written down rather than derived.
const ONE_COLUMN_ORDER = [
  'palette', 'icons', 'environment-variables', 'skeleton', 'feedback-form',
  'weekly-fitness', 'alerts-prompt', 'typography', 'kitchen-sink',
  'book-appointment', 'file-upload', 'tabs', 'promo', 'invite-team',
  'empty-state', 'shipping-address', 'agent', 'report-bug', 'profile',
  'usage', 'contributions', 'contributors', 'shortcuts', 'not-found',
]

// Container widths, not viewport widths, so the Desktop / Tablet / Mobile
// toolbar re-lays the examples out at any window size. Two columns need 600px
// (two ~280px columns, the gap and the padding); the seven wide examples need the kit's
// 800px preview.
const TWO_COLUMNS_AT = 600
const WIDE_EXAMPLES_AT = 780

/** The frame width each device stands for. Desktop fills whatever it is given. */
const DEVICE_WIDTH: Record<DeviceKey, string | undefined> = {
  desktop: undefined,
  tablet: '520px',
  mobile: '344px',
}

function useFrameWidth() {
  const ref = useRef<HTMLDivElement>(null)
  // The server renders the widest layout; a narrower frame corrects it before
  // paint, so there is no visible relayout.
  const [width, setWidth] = useState(1000)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width }
}

function renderCard(c: CardEntry) {
  const { Component } = c
  return <Component key={c.id} />
}

/**
 * The preview: a device toolbar and the examples, laid out in the kit's two
 * columns. Everything in it reads the builder's scoped variables (radius, type),
 * and the theme comes from the site's own provider, so the source, theme and
 * contrast target repaint it without any prop.
 */
export function Preview() {
  const { device, setDevice, previewStyle, density } = useBuilder()
  const { ref, width } = useFrameWidth()

  const wide = width >= WIDE_EXAMPLES_AT
  const twoColumns = width >= TWO_COLUMNS_AT
  const shown = CARDS.filter((c) => wide || !c.desktopOnly)

  const byId = new Map(shown.map((c) => [c.id, c]))
  const oneColumn = ONE_COLUMN_ORDER.map((id) => byId.get(id)).filter(
    (c): c is CardEntry => Boolean(c),
  )

  return (
    <section className={styles.preview} aria-label="Preview">
      <div className={styles.toolbar} role="group" aria-label="Preview size">
        {DEVICES.map((d) => (
          <button
            key={d.key}
            type="button"
            className={styles.chip}
            aria-pressed={device === d.key}
            onClick={() => setDevice(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        <div
          ref={ref}
          className={styles.frame}
          data-density={density}
          style={{ ...previewStyle, maxWidth: DEVICE_WIDTH[device] }}
        >
          {twoColumns ? (
            <div className={styles.columns}>
              <div className={styles.column}>
                {shown.filter((c) => c.column === 1).map(renderCard)}
              </div>
              <div className={styles.column}>
                {shown.filter((c) => c.column === 2).map(renderCard)}
              </div>
            </div>
          ) : (
            <div className={styles.column}>{oneColumn.map(renderCard)}</div>
          )}
        </div>
      </div>
    </section>
  )
}
