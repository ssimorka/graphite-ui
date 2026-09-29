import { Button } from '@/components/ui/button'
import { CardShell, CardHeader } from '../card-shell'
import styles from './weekly-fitness.module.scss'

// Share of the 64px track each day fills.
const WEEK = [
  ['M', 0.84],
  ['T', 0.52],
  ['W', 0.73],
  ['T', 0.66],
  ['F', 0.91],
  ['S', 0.48],
  ['S', 0.61],
] as const

export function WeeklyFitnessCard() {
  return (
    <CardShell id="weekly-fitness">
      <CardHeader
        title="Weekly Fitness Summary"
        description="Calories and workout load by day"
      />
      <div className={styles.week}>
        {WEEK.map(([day, load], i) => (
          <div key={i} className={styles.day}>
            <span className={styles.label}>{day}</span>
            <span className={styles.track}>
              <span className={styles.fill} style={{ height: `${load * 100}%` }} />
            </span>
          </div>
        ))}
      </div>
      <Button variant="primary" className={styles.cta}>
        View details
      </Button>
    </CardShell>
  )
}
