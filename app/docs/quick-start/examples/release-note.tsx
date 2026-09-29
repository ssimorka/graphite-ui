import styles from './release-note.module.scss'

export function ReleaseNote() {
  return (
    <aside className={styles.note}>
      <p className={styles.title}>Theme updated</p>
      <p className={styles.body}>Every role below follows the source color.</p>
    </aside>
  )
}
