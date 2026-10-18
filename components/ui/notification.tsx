import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { FieldStatusIcon } from './field-status'
import styles from './notification.module.scss'

/** Contract: docs/contracts/notification.md (3.1.0) */
type NotificationProps = {
  body: ReactNode
  title?: string
  /** Overrides the status icon the variant draws. Rarely needed. */
  icon?: ReactNode
  variant?: 'info' | 'danger' | 'warning' | 'success'
  /**
   * The kit's sets: Inline, or Callout, which has no close control and is
   * drawn for info and warning only.
   */
  kind?: 'inline' | 'callout'
  /** The kit's High contrast: an inverse fill with no edge. */
  highContrast?: boolean
  /** The kit's Actionable: a small outlined action before the close control. */
  action?: { label: string; onClick: () => void }
  /**
   * Renders a close button that calls this. Leave it out for a message that
   * should last exactly as long as its condition: the caller stops rendering
   * it when the condition changes. Callouts never close.
   */
  onClose?: () => void
}

// The kit's status icons. Failed and Succeeded are a circle with the mark cut
// out, and Info a square with the "i" cut out (Informative), from the kit's
// Status icon set; Warning is the field status triangle.
const KNOCKOUT = {
  info:
    'M13 2H3C2.73 2 2.48 2.11 2.29 2.29C2.11 2.48 2 2.73 2 3V13C2 13.27 2.11 13.52 2.29 13.71C2.48 13.89 2.73 14 3 14H13C13.27 14 13.52 13.89 13.71 13.71C13.89 13.52 14 13.27 14 13V3C14 2.73 13.89 2.48 13.71 2.29C13.52 2.11 13.27 2 13 2ZM8 4C8.15 4 8.29 4.04 8.42 4.13C8.54 4.21 8.64 4.33 8.69 4.46C8.75 4.6 8.76 4.75 8.74 4.9C8.71 5.04 8.64 5.18 8.53 5.28C8.43 5.39 8.29 5.46 8.15 5.49C8 5.51 7.85 5.5 7.71 5.44C7.58 5.39 7.46 5.29 7.38 5.17C7.29 5.04 7.25 4.9 7.25 4.75C7.25 4.55 7.33 4.36 7.47 4.22C7.61 4.08 7.8 4 8 4ZM10 12.06H6V10.94H7.44V8.06H6.5V6.94H8.56V10.94H10V12.06Z',
  danger:
    'M8 0A8 8 0 1 0 8 16A8 8 0 1 0 8 0ZM11.14 10.2L10.2 11.14L8 8.94L5.8 11.14L4.86 10.2L7.06 8L4.86 5.8L5.8 4.86L8 7.06L10.2 4.86L11.14 5.8L8.94 8L11.14 10.2Z',
  success:
    'M8 1A7 7 0 1 0 8 15A7 7 0 1 0 8 1ZM7 10.8L4.5 8.3L5.3 7.5L7 9.2L10.71 5.5L11.5 6.29L7 10.8Z',
}

/** Shared with Toast, which draws the same status icons. */
export function StatusIcon({ variant }: { variant: NonNullable<NotificationProps['variant']> }) {
  if (variant === 'warning') return <FieldStatusIcon className={styles.warningGlyph} />
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={KNOCKOUT[variant]} fillRule="evenodd" fill="currentColor" />
    </svg>
  )
}

/**
 * Inline and persistent until dismissed or the condition changes — not a
 * toast. Toast is its own set in the kit with its own timing, and this
 * component deliberately has no timing at all.
 *
 * Not an overlay either: it sits in the page flow, so there is no focus to
 * trap and no Escape to listen for. Dismissing it is the close button alone.
 */
export function Notification({
  body,
  title,
  icon,
  variant = 'info',
  kind = 'inline',
  highContrast = false,
  action,
  onClose,
}: NotificationProps) {
  const callout = kind === 'callout'
  return (
    <div
      className={[
        styles.alert,
        styles[variant],
        callout ? styles.callout : '',
        highContrast ? styles.highContrast : '',
      ].join(' ')}
      // Only the states a user must not miss interrupt; info does not.
      role={variant === 'danger' ? 'alert' : 'status'}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <StatusIcon variant={variant} />}
      </span>
      {/* Title and message share one line while they fit, and the message
          wraps under the title when they do not: the kit's Long message. */}
      <div className={styles.content}>
        {title ? <span className={styles.title}>{title}</span> : null}
        <span className={styles.body}>{body}</span>
      </div>
      {action && !callout ? (
        <Button variant="ghost" size="sm" className={styles.action} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
      {onClose && !callout ? (
        <Button
          variant="ghost"
          size="icon-lg"
          className={styles.close}
          aria-label="Dismiss notification"
          onClick={onClose}
        >
          <KitIcon name="cross-small" />
        </Button>
      ) : null}
    </div>
  )
}
