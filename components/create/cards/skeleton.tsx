import { CardShell } from '../card-shell'
import styles from './skeleton.module.scss'

// Placeholder blocks are decorative, so the whole card is hidden from
// assistive tech and marked busy instead.
export function SkeletonCard() {
  return (
    <CardShell id="skeleton">
      <div className={styles.body} aria-hidden="true">
        <div className={styles.row}>
          <span className={`${styles.block} ${styles.avatar}`} />
          <div className={styles.lines}>
            <span className={`${styles.block} ${styles.lineLg}`} />
            <span className={`${styles.block} ${styles.lineSm}`} />
          </div>
        </div>
        <div className={styles.paragraph}>
          <span className={`${styles.block} ${styles.text}`} />
          <span className={`${styles.block} ${styles.text}`} />
          <span className={`${styles.block} ${styles.text} ${styles.short}`} />
        </div>
        <div className={styles.buttons}>
          <span className={`${styles.block} ${styles.button}`} />
          <span className={`${styles.block} ${styles.button}`} />
        </div>
      </div>
    </CardShell>
  )
}
