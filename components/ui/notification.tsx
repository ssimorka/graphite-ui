'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { motionMs } from '@/lib/motion'
import { Button } from './button'
import { FieldStatusIcon } from './field-status'
import styles from './notification.module.scss'

/** Contract: docs/contracts/notification.md (3.2.0) */
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
  /**
   * Opens its height and fades in as it mounts. Set it when the notification
   * is shown in answer to something the reader did (a save that failed, a
   * form that came back), so it arrives rather than being simply there. Leave
   * it off for one that is part of the page: that should not move.
   */
  appear?: boolean
}

// The kit's status icons. Failed and Succeeded are a circle with the mark cut
// out, from the kit's Status icon set; Info is its Informative, a square with
// the "i" cut out (info-square); Warning is the field status triangle, the
// kit's Caution minor.
const KNOCKOUT = {
  danger:
    'M8 0A8 8 0 1 0 8 16A8 8 0 1 0 8 0ZM11.14 10.2L10.2 11.14L8 8.94L5.8 11.14L4.86 10.2L7.06 8L4.86 5.8L5.8 4.86L8 7.06L10.2 4.86L11.14 5.8L8.94 8L11.14 10.2Z',
  success:
    'M8 1A7 7 0 1 0 8 15A7 7 0 1 0 8 1ZM7 10.8L4.5 8.3L5.3 7.5L7 9.2L10.71 5.5L11.5 6.29L7 10.8Z',
}

/** Shared with Toast, which draws the same status icons. */
export function StatusIcon({ variant }: { variant: NonNullable<NotificationProps['variant']> }) {
  if (variant === 'info') return <KitIcon name="info-square" />
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
  appear = false,
}: NotificationProps) {
  const callout = kind === 'callout'
  // The close plays a fast exit, closing the height, before the caller hears
  // about it and stops rendering it. A notification removed because its
  // condition changed has no exit: it was never the reader's to close.
  const [closing, setClosing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])
  const close = () => {
    if (closing || !onClose) return
    setClosing(true)
    timer.current = setTimeout(onClose, motionMs('fast', { fallback: 120 }))
  }
  return (
    <div
      className={styles.presence}
      data-state={closing ? 'closed' : 'open'}
      data-appear={appear || undefined}
      inert={closing || undefined}
    >
    <div className={styles.clip}>
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
          onClick={close}
        >
          <KitIcon name="cross-small" />
        </Button>
      ) : null}
    </div>
    </div>
    </div>
  )
}
