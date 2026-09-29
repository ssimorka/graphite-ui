import { Fragment } from 'react'
import { CardShell } from '../card-shell'
import styles from './shortcuts.module.scss'

const SHORTCUTS: [string, string[]][] = [
  ['Search', ['⌘', 'K']],
  ['Quick Actions', ['⌘', 'J']],
  ['New File', ['⌘', 'N']],
  ['Save', ['⌘', 'S']],
  ['Toggle Sidebar', ['⌘', 'B']],
]

export function ShortcutsCard() {
  return (
    <CardShell id="shortcuts">
      <h3 className={styles.title}>Shortcuts</h3>
      <div className={styles.list}>
        {SHORTCUTS.map(([label, keys], i) => (
          <Fragment key={label}>
            {i > 0 ? <hr className={styles.divider} /> : null}
            <div className={styles.row}>
              <span className={styles.label}>{label}</span>
              <span className={styles.keys}>
                {keys.map((k) => (
                  <kbd key={k} className={styles.kbd}>
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </CardShell>
  )
}
