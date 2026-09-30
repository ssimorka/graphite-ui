import { Close } from '@carbon/icons-react'
import type { ReactNode } from 'react'
import styles from './notification.module.scss'

/** Contract: docs/contracts/notification.md (2.3.0) */
type NotificationProps = {
  body: ReactNode
  title?: string
  icon?: ReactNode
  variant?: 'info' | 'danger' | 'warning' | 'success'
  /**
   * Renders a close button that calls this. Leave it out for a message that
   * should last exactly as long as its condition: the caller stops rendering
   * it when the condition changes.
   */
  onClose?: () => void
}

/**
 * Inline and persistent until dismissed or the condition changes — not a
 * toast. Toast is a Tier 2 component with its own timing contract, and this
 * one deliberately has no timing at all.
 *
 * Not an overlay either: it sits in the page flow, so there is no focus to
 * trap and no Escape to listen for. Dismissing it is the close button alone.
 */
export function Notification({ body, title, icon, variant = 'info', onClose }: NotificationProps) {
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
      {onClose ? (
        <button
          type="button"
          className={styles.close}
          aria-label="Dismiss notification"
          onClick={onClose}
        >
          <Close size={20} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
