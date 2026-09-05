'use client'

import { createContext, useContext, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { useOverlay } from './overlay'
import styles from './popover.module.scss'

const InsidePopover = createContext(false)

/** Contract: docs/contracts/popover.md (1.5.0) */
type PopoverProps = {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-controls': string }) => ReactNode
  /** May contain interactive elements — that is what separates it from Tooltip. */
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Modal popovers trap focus. Non-modal ones do not. */
  modal?: boolean
  /** Starts open. For documentation surfaces that need to show the open state. */
  defaultOpen?: boolean
}

export function Popover({
  trigger,
  children,
  placement = 'bottom',
  modal = false,
  defaultOpen = false,
}: PopoverProps) {
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)
  const nested = useContext(InsidePopover)

  // Prohibition enforced, not described. Note this fires when the inner
  // Popover mounts — that is, when the outer one opens — not at build time
  // the way Card's does: a Popover's content does not exist until it is open,
  // so prerendering never sees the nesting.
  if (nested) {
    throw new Error(
      'Popover: a Popover may not be nested inside another Popover ' +
        '(docs/contracts/popover.md).',
    )
  }

  // Dismiss comes entirely from the shared Overlay base — no custom close
  // behavior per instance, which the composition rule requires.
  const ref = useOverlay<HTMLDivElement>({
    open,
    onDismiss: () => setOpen(false),
    trapFocus: modal,
  })

  return (
    <InsidePopover.Provider value={true}>
      <span className={styles.wrap}>
        {trigger({
          onClick: () => setOpen((v) => !v),
          'aria-expanded': open,
          'aria-controls': id,
        })}
        {open ? (
          <div
            ref={ref}
            id={id}
            className={`${styles.panel} ${styles[placement]}`}
            role={modal ? 'dialog' : undefined}
            aria-modal={modal || undefined}
            tabIndex={-1}
          >
            {children}
          </div>
        ) : null}
      </span>
    </InsidePopover.Provider>
  )
}
