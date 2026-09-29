import { User } from '@carbon/icons-react'
import { CardShell } from '../card-shell'
import { Tag } from '@/components/ui/tag'
import styles from './contributors.module.scss'

/** Graphite UI Site 13561:10629 */
export function ContributorsCard() {
  return (
    <CardShell id="contributors">
      <div className={styles.title}>
        <h3 className={styles.heading}>Contributors</h3>
        <Tag>312</Tag>
      </div>
      <div className={styles.avatars} aria-hidden="true">
        {Array.from({ length: 15 }, (_, i) => (
          <span className={styles.avatar} key={i}>
            <User size={16} />
          </span>
        ))}
      </div>
      <a className={styles.link} href="#card-contributors">
        + 810 contributors
      </a>
    </CardShell>
  )
}
