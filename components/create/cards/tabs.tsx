import { Add, DataBase, OverflowMenuHorizontal } from '@carbon/icons-react'
import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import styles from './tabs.module.scss'

// The kit's two tabs share one panel body, so the panel is built once and the
// Local tab gets its own short empty state.
function CodespacesPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.item}>
        <div className={styles.grow}>
          <p className={styles.itemTitle}>Codespaces</p>
          <p className={styles.caption}>Your workspaces in the cloud</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Add codespace">
          <Add size={16} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="More options">
          <OverflowMenuHorizontal size={16} />
        </Button>
      </div>
      <hr className={styles.divider} />
      <div className={styles.empty}>
        <span className={styles.cell}>
          <DataBase size={24} aria-hidden="true" />
        </span>
        <p className={styles.title}>No codespaces</p>
        <p className={`${styles.caption} ${styles.center}`}>
          You don&apos;t have any codespaces with this repository checked out
        </p>
        <Button variant="primary" size="sm" className={styles.button}>
          Create Codespace
        </Button>
        <p className={styles.caption}>Learn more about codespaces</p>
      </div>
      <hr className={styles.divider} />
      <p className={styles.caption}>
        Codespace usage for this repository is paid for by shadcn.
      </p>
    </div>
  )
}

function LocalPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.item}>
        <div className={styles.grow}>
          <p className={styles.itemTitle}>Local</p>
          <p className={styles.caption}>Clone and work on your own machine</p>
        </div>
      </div>
      <hr className={styles.divider} />
      <p className={styles.caption}>Open with GitHub Desktop or clone with HTTPS.</p>
    </div>
  )
}

export function TabsCard() {
  return (
    <CardShell id="tabs">
      <Tabs
        tabs={[
          { id: 'codespaces', label: 'Codespaces', panel: <CodespacesPanel /> },
          { id: 'local', label: 'Local', panel: <LocalPanel /> },
        ]}
      />
    </CardShell>
  )
}
