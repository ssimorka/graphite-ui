'use client'

import { cloneElement, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { useOverlay } from './overlay'
import styles from './tooltip.module.scss'

/** Contract: docs/contracts/tooltip.md (1.5.1) */
type TooltipProps = {
  /** Any focusable element. Hover alone would strand keyboard users. */
  children: ReactElement<Record<string, unknown>>
  /**
   * Short text only. A Tooltip you can click into is a Popover, so this is a
   * string rather than a node — interactive content is not expressible here.
   */
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  delay = 150,
}: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Non-modal: no focus trap, and no click-outside — a tooltip is dismissed by
  // leaving it, not by clicking elsewhere. Escape still closes it. The bubble
  // sits inside the wrapper, so the pointer can move onto it without leaving.
  const ref = useOverlay<HTMLSpanElement>({
    open,
    onDismiss: () => setOpen(false),
    trapFocus: false,
    outside: false,
  })

  const show = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    if (timer.current) clearTimeout(timer.current)
    setOpen(false)
  }

  return (
    <span
      className={styles.wrap}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {/* describedby, not labelledby: the contract says a tooltip must be
          supplementary, never the only source of the information. It goes on
          the child itself, because that is the element that takes focus and
          the one a screen reader describes; on a wrapper it was never read.
          Any describedby the child already carries is kept alongside it. */}
      {cloneElement(children, {
        'aria-describedby':
          [children.props['aria-describedby'], open ? id : null].filter(Boolean).join(' ') ||
          undefined,
      })}
      {open ? (
        <span ref={ref} id={id} role="tooltip" className={`${styles.tip} ${styles[placement]}`}>
          {content}
        </span>
      ) : null}
    </span>
  )
}
