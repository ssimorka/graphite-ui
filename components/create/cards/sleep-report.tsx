import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import styles from './sleep-report.module.scss'

// Segment heights in px on the design's 110px plot, bottom to top:
// deep (primary), light (secondary), REM (on-surface-variant).
const NIGHTS: [number, number, number][] = [
  [34, 52, 0],
  [69, 17, 17],
  [52, 10, 28],
  [17, 34, 52],
  [41, 17, 34],
  [24, 41, 28],
  [7, 58, 10],
]

const STATS = [
  ['2h 10m', 'Deep'],
  ['3h 48m', 'Light'],
  ['1h 26m', 'REM'],
  ['84', 'Score'],
]

/** Graphite UI Site 13561:11337. */
export function SleepReportCard() {
  return (
    <CardShell id="sleep-report">
      <CardHeader title="Sleep Report" description="Last night · 7h 24m" />
      <div className={styles.plot} role="img" aria-label="Sleep stages for the last seven nights">
        {NIGHTS.map((night, i) => (
          <div key={i} className={styles.bar}>
            {night.map(
              (h, j) =>
                h > 0 && (
                  <span
                    key={j}
                    className={`${styles.segment} ${styles[['deep', 'light', 'rem'][j]]}`}
                    style={{ height: h }}
                  />
                ),
            )}
          </div>
        ))}
      </div>
      <dl className={styles.stats}>
        {STATS.map(([value, label]) => (
          <div key={label} className={styles.stat}>
            <dd className={styles.value}>{value}</dd>
            <dt className={styles.label}>{label}</dt>
          </div>
        ))}
      </dl>
      <div className={styles.footer}>
        <Tag variant="success">Good</Tag>
        <Button variant="ghost" size="sm" className={styles.details}>
          Details
        </Button>
      </div>
    </CardShell>
  )
}
