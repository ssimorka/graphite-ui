'use client'

import { cloneElement, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { useOverlay } from './overlay'
import styles from './tooltip.module.scss'

/** Contract: docs/contracts/tooltip.md (2.0.0) */
type TooltipProps = {
  /**
   * Any focusable element. Hover alone would strand keyboard users. With
   * type="definition" this is the term itself, as text: the Tooltip renders
   * the dotted-underline button the kit draws for it.
   */
  children: ReactElement<Record<string, unknown>> | string
  /**
   * Short text only. A Tooltip you can click into is a Popover, so this is a
   * string rather than a node — interactive content is not expressible here.
   */
  content: string
  /** Definition opens above or below only, as the kit draws it. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * The kit's Alignment, for Top and Bottom: the caret stays on the trigger,
   * 16 from the bubble's start or end edge.
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The kit's Type. Standard is a padded bubble with the large caret 8 from
   * the trigger; Icon is the tight one for an icon-only button, with the
   * small caret 4 away; Definition explains a term in running text.
   */
  type?: 'standard' | 'icon' | 'definition'
  delay?: number
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  align = 'center',
  type = 'standard',
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

  const definition = type === 'definition'
  const side = definition && (placement === 'left' || placement === 'right') ? 'bottom' : placement
  // Start and End are drawn for Top and Bottom only.
  const edge = side === 'left' || side === 'right' ? 'center' : align

  const trigger: ReactElement<Record<string, unknown>> =
    typeof children === 'string' ? (
      <button type="button" className={styles.term}>
        {children}
      </button>
    ) : (
      children
    )

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
      {cloneElement(trigger, {
        'aria-describedby':
          [trigger.props['aria-describedby'], open ? id : null].filter(Boolean).join(' ') ||
          undefined,
      })}
      {open ? (
        <span
          ref={ref}
          id={id}
          role="tooltip"
          className={[styles.tip, type === 'standard' ? '' : styles[type], styles[side], styles[edge]].join(' ')}
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
