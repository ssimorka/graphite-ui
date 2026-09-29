'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Tag } from '@/components/ui/tag'
import { ProgressBar } from '@/components/ui/progress-bar'
import styles from './browser-share.module.scss'

const DATA = [
  { name: 'Chrome', value: 290, color: 'var(--graphite-primary)' },
  { name: 'Edge', value: 190, color: 'var(--graphite-outline)' },
  { name: 'Firefox', value: 290, color: 'var(--graphite-on-surface-variant)' },
  { name: 'Safari', value: 165, color: 'var(--graphite-secondary)' },
]
const TOTAL = DATA.reduce((n, d) => n + d.value, 0)

const R = 60
const C = 2 * Math.PI * R
const GAP = 4 // arc length left between segments

export function BrowserShareCard() {
  const [active, setActive] = useState('Firefox')
  const current = DATA.find((d) => d.name === active) ?? DATA[2]
  const pct = Math.round((current.value / TOTAL) * 100)

  let offset = 0
  const arcs = DATA.map((d) => {
    const len = (d.value / TOTAL) * C
    const arc = { ...d, len, offset }
    offset += len
    return arc
  })

  return (
    <CardShell id="browser-share">
      <div className={styles.head}>
        <div className={styles.grow}>
          <CardHeader title="Browser Share" description="January - June 2026" />
        </div>
        <Tag>{current.name}</Tag>
      </div>

      <div className={styles.chart}>
        <div className={styles.donut}>
          <svg viewBox="0 0 150 150" role="img" aria-label="Browser share donut chart">
            <g transform="rotate(-90 75 75)" fill="none" strokeWidth="24">
              {arcs.map((a) => (
                <circle
                  key={a.name}
                  cx="75"
                  cy="75"
                  r={R}
                  stroke={a.color}
                  strokeDasharray={`${a.len - GAP} ${C - a.len + GAP}`}
                  strokeDashoffset={-a.offset - GAP / 2}
                  opacity={a.name === active ? 1 : 0.85}
                />
              ))}
            </g>
          </svg>
          <div className={styles.center}>
            <span className={styles.total}>{TOTAL}</span>
            <span className={styles.caption}>Visitors</span>
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        {DATA.map((d) => (
          <button
            key={d.name}
            type="button"
            className={styles.legendItem}
            aria-pressed={d.name === active}
            onClick={() => setActive(d.name)}
          >
            <span className={styles.dot} style={{ background: d.color }} />
            <span className={styles.caption}>{d.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.progress}>
        <div className={styles.row}>
          <span className={styles.label}>{current.name}</span>
          <span className={styles.caption}>{pct}%</span>
        </div>
        <ProgressBar value={pct} label={`${current.name} share`} />
      </div>
    </CardShell>
  )
}
