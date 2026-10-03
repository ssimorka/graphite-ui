'use client'

import { createContext, useContext, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useOverlay } from './overlay'
import styles from './popover.module.scss'

const InsidePopover = createContext(false)

/** Contract: docs/contracts/popover.md (2.0.0) */
type PopoverProps = {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-controls': string }) => ReactNode
  /** May contain interactive elements — that is what separates it from Tooltip. */
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * The kit's Alignment: where the panel sits along the trigger. The caret
   * stays on the trigger's centre; Start and End put it 16 from that edge.
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The kit's two sets. Tab tip joins the open trigger to the panel with no
   * gap and no caret, under one shadow; it opens below only, aligned to the
   * trigger's start or end edge.
   */
  variant?: 'default' | 'tab-tip'
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
  align = 'center',
  variant = 'default',
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
  // behavior per instance, which the composition rule requires. The base
  // already treats the control that opened an overlay as inside it, so a press
  // on the trigger is left to the trigger's click, which toggles. A Popover
  // that starts open through defaultOpen was opened by nothing, though, so it
  // names its own trigger here; otherwise the base would close it on
  // pointerdown and the click would open it straight back up.
  const ref = useOverlay<HTMLDivElement>({
    open,
    onDismiss: (e) => {
      if (e.type === 'pointerdown' && wrap.current?.contains(e.target as Node)) return
      setOpen(false)
    },
    trapFocus: modal,
  })

  const tabTip = variant === 'tab-tip'
  const triggerEl = trigger({
    onClick: () => setOpen((v) => !v),
    'aria-expanded': open,
    'aria-controls': id,
  })
  // Tab tip draws below only, and has no Center: it hangs from an edge.
  const side = tabTip ? 'bottom' : placement
  const edge = tabTip && align === 'center' ? 'start' : align

  return (
    <InsidePopover.Provider value={true}>
      <span
        ref={wrap}
        className={[styles.wrap, tabTip ? styles.tabTip : '', tabTip && open ? styles.joined : ''].join(' ')}
      >
        {/* The tab tip's trigger takes the panel's fill when open, so the two
            read as one shape. The trigger is the caller's, so the fill sits
            on a span behind it. */}
        {tabTip ? <span className={styles.tip}>{triggerEl}</span> : triggerEl}
        {open ? (
          <div
            ref={ref}
            id={id}
            className={[styles.panel, styles[side], styles[edge]].join(' ')}
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
