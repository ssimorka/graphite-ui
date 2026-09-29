import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './traffic-channels.module.scss'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const DESKTOP = [66, 108, 84, 26, 74, 76]
const MOBILE = [28, 71, 42, 67, 46, 49]

const STATS = [
  ['Desktop', '1,224'],
  ['Mobile', '860'],
  ['Mix Delta', '+42%'],
]

/** Graphite UI Site 13561:11159. */
export function TrafficChannelsCard() {
  return (
    <CardShell id="traffic-channels">
      <CardHeader
        title="Traffic channels"
        description="Monthly desktop and mobile traffic for the last six months, compare volume and mix across platforms and devices at a glance."
      />
      <div className={styles.chart} role="img" aria-label="Desktop and mobile traffic by month, January to June">
        <span className={styles.grid} style={{ top: 8 }} />
        <span className={styles.grid} style={{ top: 65 }} />
        <span className={styles.grid} style={{ top: 122 }} />
        {MONTHS.map((m, i) => (
          <div key={m} className={styles.month}>
            <div className={styles.bars}>
              <span className={`${styles.bar} ${styles.desktop}`} style={{ height: DESKTOP[i] }} />
              <span className={`${styles.bar} ${styles.mobile}`} style={{ height: MOBILE[i] }} />
            </div>
            <span className={styles.tick}>{m}</span>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={styles.key}>
          <span className={`${styles.swatch} ${styles.desktop}`} />
          Desktop
        </span>
        <span className={styles.key}>
          <span className={`${styles.swatch} ${styles.mobile}`} />
          Mobile
        </span>
      </div>
      <dl className={styles.stats}>
        {STATS.map(([label, value]) => (
          <div key={label} className={styles.stat}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
      <Button variant="primary" className={styles.report}>
        View report
      </Button>
    </CardShell>
  )
}
