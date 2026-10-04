'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { StatusIcon } from './notification'
import styles from './toast.module.scss'

/**
 * Contract: docs/contracts/toast.md (1.0.0)
 *
 * The kit's Notification - Toast (84336:35011): Status × High contrast ×
 * Actionable, with Title, Message, Time and Close. It shares Notification's
 * status colours and icons and adds what Notification refuses to have: timing.
 * A toast is placed by the toaster host, dismisses itself after its duration,
 * and holds still while the pointer or focus is on it.
 */

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger'

export type ToastProps = {
  variant?: ToastVariant
  title: string
  body?: ReactNode
  /** The kit's Time text, such as "Time stamp [00:00:00]". Not drawn when there is an action, as the kit draws it. */
  timestamp?: string
  /** The kit's High contrast. Off by default, as Notification's is. */
  highContrast?: boolean
  /** The kit's Actionable: a small ghost button under the message. */
  action?: { label: string; onClick: () => void }
  /** The kit's Close. When set, the 48px close button renders and calls it. */
  onClose?: () => void
}

/** One toast, as drawn. The host owns its timing; rendered alone it stays put. */
export function Toast({ variant = 'info', title, body, timestamp, highContrast = false, action, onClose }: ToastProps) {
  return (
    <div
      className={[styles.toast, styles[variant], highContrast ? styles.highContrast : ''].join(' ')}
      // An error interrupts; the rest wait their turn in the host's polite region.
      role={variant === 'danger' ? 'alert' : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        <StatusIcon variant={variant} />
      </span>
      <div className={styles.content}>
        <div className={styles.text}>
          <span className={styles.title}>{title}</span>
          {body ? <span className={styles.body}>{body}</span> : null}
        </div>
        {action ? (
          <Button variant="ghost" size="sm" className={styles.action} onClick={action.onClick}>
            {action.label}
          </Button>
        ) : timestamp ? (
          <span className={styles.time}>{timestamp}</span>
        ) : null}
      </div>
      {onClose ? (
        <Button variant="ghost" size="icon-lg" className={styles.close} aria-label="Dismiss notification" onClick={onClose}>
          <KitIcon name="cross-small" />
        </Button>
      ) : null}
    </div>
  )
}

// -------------------------------------------------------------------- host
type Queued = Omit<ToastProps, 'onClose'> & {
  id: number
  /** Milliseconds before it dismisses itself. 0 keeps it until closed. */
  duration: number
}

export type ToastOptions = Omit<ToastProps, 'onClose'> & {
  /** Milliseconds. 6000 by default; errors stay until closed unless one is given. */
  duration?: number
}

const ToastContext = createContext<((options: ToastOptions) => void) | null>(null)

/** Shows a toast from anywhere under the host. */
export function useToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useToast needs the toast host above it.')
  return show
}

/** A toast that counts down, and stops counting while it is hovered or focused. */
function Timed({ item, onDone }: { item: Queued; onDone: (id: number) => void }) {
  const [held, setHeld] = useState(false)
  const left = useRef(item.duration)
  useEffect(() => {
    if (!item.duration || held) return
    const started = Date.now()
    const timer = window.setTimeout(() => onDone(item.id), left.current)
    return () => {
      window.clearTimeout(timer)
      left.current -= Date.now() - started
    }
  }, [held, item.duration, item.id, onDone])

  const { id, duration, ...props } = item
  return (
    <li
      className={styles.slot}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false)
      }}
    >
      <Toast {...props} onClose={() => onDone(id)} />
    </li>
  )
}

/**
 * The toaster host: wrap the app once. Toasts stack at the top right, newest
 * on top, in a polite live region, so each is announced as it arrives.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Queued[]>([])
  const next = useRef(0)
  const show = useCallback((o: ToastOptions) => {
    const duration = o.duration ?? (o.variant === 'danger' ? 0 : 6000)
    setItems((list) => [{ ...o, id: next.current++, duration }, ...list])
  }, [])
  const done = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <section className={styles.region} aria-label="Notifications" aria-live="polite">
        <ol className={styles.stack}>
          {items.map((t) => (
            <Timed key={t.id} item={t} onDone={done} />
          ))}
        </ol>
      </section>
    </ToastContext.Provider>
  )
}
