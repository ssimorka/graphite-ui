import { Button } from '@/components/ui/button'
import { CardShell, CardHeader } from '../card-shell'
import styles from './environment-variables.module.scss'

const VARIABLES = [
  ['DATABASE_URL', '••••••••'],
  ['NEXT_PUBLIC_API', 'https://api.example.com'],
  ['STRIPE_SECRET', '••••••••'],
]

export function EnvironmentVariablesCard() {
  return (
    <CardShell id="environment-variables">
      <CardHeader title="Environment Variables" description="Production · 8 variables" />
      <ul className={styles.list}>
        {VARIABLES.map(([name, value]) => (
          <li key={name} className={styles.row}>
            <span className={styles.name}>{name}</span>
            <span className={styles.value}>{value}</span>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <Button variant="secondary">Edit</Button>
        <Button variant="primary">Deploy</Button>
      </div>
    </CardShell>
  )
}
