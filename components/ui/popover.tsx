'use client'

import { createContext, useContext, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useOverlay } from './overlay'
import styles from './popover.module.scss'

const InsidePopover = createContext(false)

/** Contract: docs/contracts/popover.md (1.6.0) */
type PopoverProps = {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-controls': string }) => ReactNode
  /** May contain interactive elements — that is what separates it from Tooltip. */
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Modal popovers trap focus. Non-modal ones do not. */
  modal?: boolean
  /** Starts open. For documentation surfaces that need to show the open state. */
  defaultOpen?: boolean
  /**
   * The accessible name of a modal Popover's dialog. A dialog needs one, and
   * the trigger is not it: the trigger names the action, this names the panel.
   * Ignored without modal, since the panel then has no role to name.
   */
  label?: string
}

export function Popover({
  trigger,
  children,
  placement = 'bottom',
  modal = false,
  defaultOpen = false,
  label,
}: PopoverProps) {
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)
  const nested = useContext(InsidePopover)
  const wrap = useRef<HTMLSpanElement>(null)

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
  // behavior per instance, which the composition rule requires. The one thing
  // Popover decides is that its own trigger is not "outside": a press there is
  // left to the trigger's click, which toggles. Were the base to close the
  // panel on pointerdown, that click would open it straight back up.
  const ref = useOverlay<HTMLDivElement>({
    open,
    onDismiss: (e) => {
      if (e.type === 'pointerdown' && wrap.current?.contains(e.target as Node)) return
      setOpen(false)
    },
    trapFocus: modal,
  })

  return (
    <InsidePopover.Provider value={true}>
      <span ref={wrap} className={styles.wrap}>
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
            aria-label={modal ? label : undefined}
            tabIndex={-1}
          >
            {children}
          </div>
        ) : null}
      </span>
    </InsidePopover.Provider>
  )
}
