import { CardShell } from '../card-shell'
import styles from './usage.module.scss'

// [label, value, fraction of the allowance used]
const ROWS: [string, string, number][] = [
  ['Edge Requests', '$1.83K', 0.82],
  ['Fast Data Transfer', '$952.51', 0.55],
  ['Monitoring data points', '$901.20', 0.5],
  ['Web Analytics Events', '$603.71', 0.34],
  ['ISR Writes', '524.52K / 2M', 0.26],
  ['Function Duration', '5.11 GB Hrs / 1K GB Hrs', 0.02],
]

const R = 6
const C = 2 * Math.PI * R

function Ring({ used }: { used: number }) {
  return (
    <svg className={styles.ring} viewBox="0 0 16 16" aria-hidden="true">
      <circle className={styles.track} cx="8" cy="8" r={R} />
      <circle
        className={styles.arc}
        cx="8"
        cy="8"
        r={R}
        strokeDasharray={`${C * used} ${C}`}
        transform="rotate(-90 8 8)"
      />
    </svg>
  )
}

export function UsageCard() {
  return (
    <CardShell id="usage">
      <h3 className={styles.title}>5 days remaining in cycle</h3>
      <div className={styles.list}>
        {ROWS.map(([label, value, used]) => (
          <div key={label} className={styles.row}>
            <Ring used={used} />
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}
