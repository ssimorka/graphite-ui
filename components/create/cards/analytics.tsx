import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './analytics.module.scss'

// Hand-drawn area chart. The viewBox is stretched to the card width
// (preserveAspectRatio none) so it stays fluid; strokes use
// non-scaling-stroke so the stretch does not thin or thicken the line.
const LINE =
  'M0 62 C14 58 22 50 36 52 S58 66 72 58 S94 30 110 34 S134 52 150 44 S172 18 190 22 S214 40 230 30 S256 8 272 14 S298 12 312 4'

export function AnalyticsCard() {
  return (
    <CardShell id="analytics">
      <header className={styles.head}>
        <div className={styles.titles}>
          <h3 className={styles.title}>Analytics</h3>
          <p className={styles.sub}>418.2K Visitors</p>
        </div>
        <Button variant="ghost" size="sm">
          View Analytics
        </Button>
      </header>
      <svg
        className={styles.chart}
        viewBox="0 0 312 109"
        preserveAspectRatio="none"
        role="img"
        aria-label="Visitors over time, trending up"
      >
        <path d={`${LINE} L312 109 L0 109 Z`} className={styles.area} />
        <path d={LINE} className={styles.line} vectorEffect="non-scaling-stroke" />
      </svg>
    </CardShell>
  )
}
