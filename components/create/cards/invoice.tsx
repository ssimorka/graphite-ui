import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import styles from './invoice.module.scss'

const ITEMS = [
  ['Flat white', '2', '$4.50', '$9.00'],
  ['Cold brew', '1', '$5.00', '$5.00'],
  ['Almond croissant', '3', '$4.00', '$12.00'],
]
const TOTALS = [
  ['Subtotal', '$26.00'],
  ['Tax', '$0.00'],
  ['Total Due', '$26.00'],
]

export function InvoiceCard() {
  return (
    <CardShell id="invoice">
      <header className={styles.head}>
        <div className={styles.titles}>
          <h3 className={styles.title}>Invoice #INV-2847</h3>
          <p className={styles.sub}>Due March 30, 2026</p>
        </div>
        <Tag>Pending</Tag>
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.item}>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {ITEMS.map(([item, qty, rate, amount]) => (
            <tr key={item}>
              <td className={styles.item}>{item}</td>
              <td>{qty}</td>
              <td>{rate}</td>
              <td>{amount}</td>
            </tr>
          ))}
          {TOTALS.map(([label, amount]) => (
            <tr key={label}>
              <td className={styles.item}>{label}</td>
              <td />
              <td />
              <td>{amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className={styles.foot}>
        <Button size="sm">Download PDF</Button>
        <Button variant="primary" size="sm">
          Pay Now
        </Button>
      </footer>
    </CardShell>
  )
}
