import { User } from '@carbon/icons-react'
import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './empty-state.module.scss'

/** Graphite UI Site 13561:10378 */
export function EmptyStateCard() {
  return (
    <CardShell id="empty-state">
      <div className={styles.empty}>
        <div className={styles.avatars} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span className={styles.avatar} key={i}>
              <User size={20} />
            </span>
          ))}
        </div>
        <p className={styles.title}>No Team Members</p>
        <p className={styles.description}>Invite your team to collaborate on this project.</p>
        <Button variant="primary" size="sm">
          Invite Members
        </Button>
      </div>
    </CardShell>
  )
}
