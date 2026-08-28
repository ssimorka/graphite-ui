'use client'

import { createContext, useContext, useId } from 'react'
import type { ReactNode } from 'react'
import { ButtonGroup } from './button-group'
import { useOverlay } from './overlay'
import styles from './dialog.module.scss'

const InsideDialog = createContext(false)

/** Contract: docs/contracts/dialog.md (1.4.2) */
type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  body: ReactNode
  /** Typically Button. Wrapped in a ButtonGroup, same as Card's footer. */
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** When false, Escape and the scrim no longer dismiss it. */
  dismissible?: boolean
}

export function Dialog({
  open,
  onClose,
  title,
  body,
  footer,
  size = 'md',
  dismissible = true,
}: DialogProps) {
  const id = useId()
  const nested = useContext(InsideDialog)

  // Stack depth of one, enforced. Like Popover, this fires when the inner
  // Dialog opens rather than at build time, since a closed Dialog renders
  // nothing for prerendering to inspect.
  if (nested) {
    throw new Error(
      'Dialog: a Dialog may not be opened from within another Dialog — ' +
        'stack depth is one (docs/contracts/dialog.md).',
    )
  }

  // Always traps focus, and the shared base always returns focus to the
  // trigger on close. Neither is optional for a Dialog.
  const ref = useOverlay<HTMLDivElement>({
    open,
    onDismiss: onClose,
    trapFocus: true,
    escape: dismissible,
    outside: false,
  })

  if (!open) return null

  return (
    <InsideDialog.Provider value={true}>
      <div className={styles.scrim} onClick={dismissible ? onClose : undefined}>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className={`${styles.dialog} ${styles[size]}`}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          <div className={styles.body}>{body}</div>
          {footer ? (
            <div className={styles.footer}>
              <ButtonGroup>{footer}</ButtonGroup>
            </div>
          ) : null}
        </div>
      </div>
    </InsideDialog.Provider>
  )
}
