import type { ReactNode } from 'react'
import styles from './notification.module.scss'

/** Contract: docs/contracts/notification.md (2.2.0) */
type NotificationProps = {
  body: ReactNode
  title?: string
  icon?: ReactNode
  variant?: 'info' | 'danger' | 'warning' | 'success'
}

/**
 * Inline and persistent until dismissed or the condition changes — not a
 * toast. Toast is a Tier 2 component with its own timing contract, and this
 * one deliberately has no timing at all.
 */
export function Notification({ body, title, icon, variant = 'info' }: NotificationProps) {
  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      // Only the states a user must not miss interrupt; info does not.
      role={variant === 'danger' ? 'alert' : 'status'}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className={styles.content}>
        {title ? <p className={styles.title}>{title}</p> : null}
        <div className={styles.body}>{body}</div>
      </div>
    </div>
  )
}
