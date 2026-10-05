import { KitIcon } from '@/components/kit-icon'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Notification } from '@/components/ui/notification'
import styles from './agent.module.scss'

/** Graphite UI Site 13561:10571 */
export function AgentCard() {
  return (
    <CardShell id="agent">
      <CardHeader
        title="Ship faster with automated review"
        description="Review runs on every pull request."
      />
      <ul className={styles.features}>
        <li className={styles.feature}>
          <KitIcon name="check" size={16} className={styles.check} aria-hidden="true" />
          <p className={styles.text}>
            <strong>Code reviews</strong> with full codebase context to catch <strong>hard-to-find</strong>{' '}
            bugs.
          </p>
        </li>
        <li className={styles.feature}>
          <KitIcon name="check" size={16} className={styles.check} aria-hidden="true" />
          <p className={styles.text}>
            <strong>Code suggestions</strong> validated in sandboxes before you merge.
          </p>
        </li>
        <li className={styles.feature}>
          <KitIcon name="check" size={16} className={styles.check} aria-hidden="true" />
          <div className={styles.stack}>
            <p className={styles.text}>
              <strong>Root-cause analysis</strong> for production issues with deployment context.
            </p>
            <span className={styles.tag}>
              <Tag variant="primary">Pro plan</Tag>
            </span>
          </div>
        </li>
      </ul>
      <Notification
        variant="info"
        title="Free trial"
        body="New teams get a 14-day free trial."
      />
      <div className={styles.footer}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Start trial</Button>
      </div>
    </CardShell>
  )
}
