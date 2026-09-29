import { Add } from '@carbon/icons-react'
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
        title="Observability Plus is replacing Monitoring"
        description="Switch to the improved way to explore your data, with natural language. Monitoring will no longer be available on the Pro plan in November, 2025"
      />
      <div className={styles.footer}>
        <Button variant="primary" className={styles.button}>
          Create Query
          <Add aria-hidden="true" />
        </Button>
        <Tag>Warning</Tag>
      </div>
    </CardShell>
  )
}
