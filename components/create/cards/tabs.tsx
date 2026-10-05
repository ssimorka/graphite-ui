import { KitIcon } from '@/components/kit-icon'
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
          <p className={styles.itemTitle}>Cloud</p>
          <p className={styles.caption}>Your workspaces in the cloud</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Add workspace">
          <KitIcon name="plus" size={16} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="More options">
          <KitIcon name="menu-dots" size={16} />
        </Button>
      </div>
      <hr className={styles.divider} />
      <div className={styles.empty}>
        <span className={styles.cell}>
          <KitIcon name="database" size={24} aria-hidden="true" />
        </span>
        <p className={styles.title}>No workspaces</p>
        <p className={`${styles.caption} ${styles.center}`}>
          You have no cloud workspaces for this project
        </p>
        <Button variant="primary" size="sm" className={styles.button}>
          Create workspace
        </Button>
        <p className={styles.caption}>Learn more about workspaces</p>
      </div>
      <hr className={styles.divider} />
      <p className={styles.caption}>
        Workspace usage is billed to your team.
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
      <p className={styles.caption}>Clone and open in your editor.</p>
    </div>
  )
}

export function TabsCard() {
  return (
    <CardShell id="tabs">
      <Tabs
        tabs={[
          { id: 'codespaces', label: 'Cloud', panel: <CodespacesPanel /> },
          { id: 'local', label: 'Local', panel: <LocalPanel /> },
        ]}
      />
    </CardShell>
  )
}
