'use client'

import { createContext, useContext, useId } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { ButtonGroup } from './button-group'
import { useOverlay } from './overlay'
import styles from './modal.module.scss'

const InsideDialog = createContext(false)

/**
 * Renders a Modal where it is written instead of on `<body>`. Only for the
 * docs' stills, whose stage contains the fixed scrim on purpose. Everywhere
 * else the portal is what makes the scrim full-screen: any sticky, transformed
 * or isolated ancestor would otherwise scope its z-index and let the page paint
 * over it, as the Create panel's sticky aside did.
 */
export const ModalInPlace = createContext(false)

/** Contract: docs/contracts/modal.md (1.5.0) */
type ModalProps = {
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

export function Modal({
  open,
  onClose,
  title,
  body,
  footer,
  size = 'md',
  dismissible = true,
}: ModalProps) {
  const id = useId()
  const nested = useContext(InsideDialog)
  const inPlace = useContext(ModalInPlace)

  // Stack depth of one, enforced. Like Popover, this fires when the inner
  // Modal opens rather than at build time, since a closed Modal renders
  // nothing for prerendering to inspect.
  if (nested) {
    throw new Error(
      'Modal: a Modal may not be opened from within another Modal — ' +
        'stack depth is one (docs/contracts/dialog.md).',
    )
  }

  // Always traps focus, and the shared base always returns focus to the
  // trigger on close. Neither is optional for a Modal. The scrim is simply
  // outside the dialog, so the base's outside press is the scrim click, and
  // dismissible switches it off along with Escape.
  const ref = useOverlay<HTMLDivElement>({
    open,
    onDismiss: () => onClose(),
    trapFocus: true,
    escape: dismissible,
    outside: dismissible,
  })

  if (!open) return null

  const modal = (
    <InsideDialog.Provider value={true}>
      <div className={styles.scrim}>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          className={`${styles.dialog} ${styles[size]}`}
          tabIndex={-1}
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

  // A Modal is only open in response to the visitor, so it never renders on
  // the server outside a still, and document is there for the portal.
  return inPlace || typeof document === 'undefined'
    ? modal
    : createPortal(modal, document.body)
}
