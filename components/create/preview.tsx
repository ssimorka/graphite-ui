'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { CARDS } from './cards'
import type { CardEntry } from './cards'
import { DEVICES, useBuilder } from './builder'
import type { DeviceKey } from './builder'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { GenerativeArt } from '@/components/generative-art'
import type { GenerativeArtHandle } from '@/components/generative-art'
import styles from './preview.module.scss'

// The kit's single-column order for Small (Graphite UI Site 11856:2265). It is
// a designed interleave of the two desktop columns, not the columns end to end,
// so it is written down rather than derived. It is also the reading order the
// balanced columns fill in, at every width; examples it does not name (the
// desktop-only wide ones) follow in the registry's order.
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
// Three columns from 1100px: each is still about the kit's 364px card. The kit
// draws nothing wider than 800, so past that a third column opens rather than
// two columns stretching.
const THREE_COLUMNS_AT = 1100

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

/**
 * Cards dealt into columns of as near equal height as the order allows: each
 * card, in reading order, goes to whichever column is shortest so far. Heights
 * are measured, not guessed, so density, type and theme all count, and it
 * re-deals whenever a card changes size.
 *
 * The first render deals round-robin, which the server can do without a
 * layout; the measured deal replaces it before paint. Every column is the same
 * width, so moving a card does not change its height, and a second pass lands
 * on the same deal and stops.
 */
function useBalancedColumns(ids: string[], count: number) {
  const ref = useRef<HTMLDivElement>(null)
  const roundRobin = () =>
    Array.from({ length: count }, (_, c) => ids.filter((_, i) => i % count === c))
  const key = `${count}:${ids.join('|')}`
  const [deal, setDeal] = useState<{ key: string; columns: string[][] }>(() => ({
    key,
    columns: roundRobin(),
  }))
  const columns = deal.key === key ? deal.columns : roundRobin()

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const balance = () => {
      // Hidden behind the Patterns tab, every card measures 0, and a deal made
      // from that would show for a frame on the way back. Keep the last one.
      if (!el.offsetParent) return
      const cards = el.querySelectorAll<HTMLElement>('[data-card]')
      if (cards.length !== ids.length) return
      const height = new Map<string, number>()
      cards.forEach((n) => height.set(n.dataset.card!, n.offsetHeight))
      const first = el.firstElementChild
      const gap = first ? parseFloat(getComputedStyle(first).rowGap) || 0 : 0
      const sums = Array<number>(count).fill(0)
      const next: string[][] = Array.from({ length: count }, () => [])
      for (const id of ids) {
        let c = 0
        // A pixel of tolerance, so near-ties keep the leftmost column.
        for (let i = 1; i < count; i++) if (sums[i] < sums[c] - 1) c = i
        next[c].push(id)
        sums[c] += (height.get(id) ?? 0) + gap
      }
      // Then even it out. Greedy in reading order can leave one column a tall
      // card longer than the rest, so swap two cards between columns, each
      // taking the other's slot, or move a column's last card to the foot of
      // another, while that narrows the gap between tallest and shortest. A
      // swap keeps both slots, so each card stays about where it was read.
      const h = (id: string) => (height.get(id) ?? 0) + gap
      const spread = (v: number[]) => Math.max(...v) - Math.min(...v)
      for (let pass = 0; pass < 24; pass++) {
        const now = spread(sums)
        let best: { apply: () => void; spread: number } | null = null
        const consider = (trial: number[], apply: () => void) => {
          const v = spread(trial)
          if (v < (best?.spread ?? now) - 1) best = { apply, spread: v }
        }
        for (let a = 0; a < count; a++) {
          for (let b = 0; b < count; b++) {
            if (a === b) continue
            const tail = next[a].at(-1)
            if (tail && next[a].length > 1) {
              const trial = [...sums]
              trial[a] -= h(tail)
              trial[b] += h(tail)
              consider(trial, () => {
                next[a].pop()
                next[b].push(tail)
                sums[a] -= h(tail)
                sums[b] += h(tail)
              })
            }
            if (b < a) continue
            next[a].forEach((x, i) =>
              next[b].forEach((y, j) => {
                const d = h(x) - h(y)
                const trial = [...sums]
                trial[a] -= d
                trial[b] += d
                consider(trial, () => {
                  next[a][i] = y
                  next[b][j] = x
                  sums[a] -= d
                  sums[b] += d
                })
              }),
            )
          }
        }
        if (!best) break
        ;(best as { apply: () => void }).apply()
      }
      setDeal((prev) =>
        prev.key === key && prev.columns.every((col, i) => col.join('|') === next[i].join('|'))
          ? prev
          : { key, columns: next },
      )
    }
    balance()
    const ro = new ResizeObserver(balance)
    el.querySelectorAll('[data-card]').forEach((n) => ro.observe(n))
    return () => ro.disconnect()
    // Re-observe after every deal: moving a card remounts it.
  }, [key, columns]) // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, columns }
}

function renderCard(c: CardEntry) {
  const { Component } = c
  return <Component key={c.id} />
}

/**
 * The preview: two tabs over the same theme. Components is the examples; Patterns
 * is the generative composition built from the same source. Both read the
 * site's own provider, so the source, theme and contrast target repaint them
 * without any prop.
 */
export function Preview() {
  return (
    <section className={styles.preview} aria-label="Preview">
      <Tabs
        tabs={[
          { id: 'components', label: 'Components', panel: <Samples /> },
          { id: 'patterns', label: 'Patterns', panel: <Patterns /> },
        ]}
      />
    </section>
  )
}

/**
 * The pattern generator: the 60/30/10 composition (see buildPalette in
 * generative-art.tsx), redrawn from the source on every change. Selecting a
 * panel reshuffles just that panel; Regenerate deals a new layout.
 *
 * Mocked in Graphite UI Site as the "Create — Patterns tab" artboards, whose
 * still is the Pattern composition set: one deal of the kit's Pattern Tiles
 * per preview width.
 */
function Patterns() {
  const [art, setArt] = useState<GenerativeArtHandle | null>(null)
  return (
    <div className={styles.tabPanel}>
      <div className={`${styles.toolbar} ${styles.patternBar}`} role="group" aria-label="Pattern">
        <Button size="sm" onClick={() => art?.regenerate()} disabled={!art}>
          Regenerate
        </Button>
        <Button size="sm" variant="ghost" onClick={() => art?.exportPng()} disabled={!art}>
          Export PNG
        </Button>
        <p className={styles.hint}>Select a panel to reshuffle it.</p>
      </div>
      <div className={styles.art}>
        <GenerativeArt interactive cover={false} onReady={setArt} />
      </div>
    </div>
  )
}

/**
 * The examples, under a device toolbar, dealt into one to three columns of
 * near equal height. Everything in it reads the builder's scoped variables
 * (radius, type).
 */
function Samples() {
  const { device, setDevice, previewStyle, density } = useBuilder()
  const { ref, width } = useFrameWidth()

  const wide = width >= WIDE_EXAMPLES_AT
  const twoColumns = width >= TWO_COLUMNS_AT
  const threeColumns = width >= THREE_COLUMNS_AT
  const shown = CARDS.filter((c) => wide || !c.desktopOnly)

  const byId = new Map(shown.map((c) => [c.id, c]))
  const order = [
    ...ONE_COLUMN_ORDER.filter((id) => byId.has(id)),
    ...shown.map((c) => c.id).filter((id) => !ONE_COLUMN_ORDER.includes(id)),
  ]
  const count = threeColumns ? 3 : twoColumns ? 2 : 1
  const { ref: dealRef, columns } = useBalancedColumns(order, count)

  return (
    <div className={styles.tabPanel}>
      <div className={`${styles.toolbar} ${styles.devices}`} role="group" aria-label="Preview size">
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
          style={
            {
              ...previewStyle,
              // Read by the stylesheet only from lg up, where the toolbar is.
              '--frame-max': DEVICE_WIDTH[device] ?? 'none',
            } as CSSProperties
          }
        >
          <div
            ref={dealRef}
            className={styles.columns}
            style={{ '--columns': count } as CSSProperties}
          >
            {columns.map((ids, i) => (
              <div key={i} className={styles.column}>
                {ids.map((id) => (
                  <div key={id} data-card={id}>
                    {renderCard(byId.get(id)!)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
