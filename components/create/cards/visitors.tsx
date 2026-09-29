import { CardShell, CardHeader } from '../card-shell'
import { Tag } from '@/components/ui/tag'
import styles from './visitors.module.scss'

// Six monthly points on a 312 x 157 canvas; y grows downward.
const PTS: [number, number][] = [
  [0, 112],
  [62, 88],
  [125, 96],
  [187, 52],
  [250, 60],
  [312, 10],
]

function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`
  }
  return d
}

/** Graphite UI Site 13561:10400 (desktop only) */
export function VisitorsCard() {
  const line = smooth(PTS)
  return (
    <CardShell id="visitors">
      <div className={styles.head}>
        <div className={styles.grow}>
          <CardHeader title="Visitors" description="Last 6 months" />
        </div>
        <Tag variant="success">+2% vs last month</Tag>
      </div>
      <svg
        className={styles.chart}
        viewBox="0 0 312 157"
        preserveAspectRatio="none"
        role="img"
        aria-label="Visitors rising over the last six months"
      >
        <path d={`${line} L312,157 L0,157 Z`} className={styles.area} />
        <path d={line} className={styles.line} vectorEffect="non-scaling-stroke" />
      </svg>
    </CardShell>
  )
}
