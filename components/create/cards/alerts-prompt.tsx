import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './alerts-prompt.module.scss'

export function AlertsPromptCard() {
  return (
    <CardShell id="alerts-prompt">
      <div className={styles.empty}>
        <p className={styles.title}>Get alerted for anomalies</p>
        <p className={styles.body}>
          Automatically monitor your projects for anomalies and get notified.
        </p>
        <Button variant="primary" className={styles.button}>
          Upgrade to Observability Plus
        </Button>
      </div>
    </CardShell>
  )
}
