import { KitIcon } from '@/components/kit-icon'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import styles from './promo.module.scss'

/** Graphite UI Site 13561:11311. */
export function PromoCard() {
  return (
    <CardShell id="promo">
      <div className={styles.image} aria-hidden="true" />
      <CardHeader
        title="Reports have a new home"
        description="Ask questions about your data in plain language. The old reports page closes next month."
      />
      <div className={styles.footer}>
        <Button variant="primary" className={styles.button}>
          Create Query
          <KitIcon name="plus" aria-hidden="true" />
        </Button>
        <Tag>Warning</Tag>
      </div>
    </CardShell>
  )
}
