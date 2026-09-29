import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './typography.module.scss'

export function TypographyCard() {
  return (
    <CardShell id="typography">
      <p className={styles.eyebrow}>Inherit - IBM Plex Sans</p>
      <p className={styles.title}>Designing with rhythm and hierarchy.</p>
      <p className={styles.body}>
        A strong body style keeps long-form content readable and balances the
        visual weight of headings.
      </p>
      <p className={styles.body}>
        Thoughtful spacing and cadence help paragraphs scan quickly without
        feeling dense.
      </p>
      <Button variant="primary" className={styles.button}>
        Share Feedback
      </Button>
    </CardShell>
  )
}
