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
        title="Ship faster & safer with Vercel Agent"
        description="Your use is subject to Vercel's Public Beta Agreement and AI Product Terms."
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
              <Tag variant="primary">Requires Observability Plus</Tag>
            </span>
          </div>
        </li>
      </ul>
      <Notification
        variant="info"
        icon={<KitIcon name="info" size={20} />}
        title="Trial credit"
        body="Pro teams get $100 in Vercel Agent trial credit for 2 weeks after activation."
      />
      <div className={styles.footer}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Enable with $100 credits</Button>
      </div>
    </CardShell>
  )
}
