'use client'

import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import type { FocusEvent, MouseEvent, ReactElement } from 'react'
import { motionMs } from '@/lib/motion'
import { useOverlay } from './overlay'
import styles from './tooltip.module.scss'

// Shared by every Tooltip on the page. The first one a pointer reaches waits
// (delay/tooltip); once one is showing, or one closed less than WARM_MS ago,
// the next appears at once, so running the pointer along a toolbar reads each
// label without paying the wait again. 300ms is the kit's window, stated in
// delay/tooltip's description.
const WARM_MS = 300
let showing = 0
let lastClosed = -Infinity

/** Contract: docs/contracts/tooltip.md (2.1.0) */
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
  /**
   * Milliseconds before the first tooltip shows on hover. The kit's
   * delay/tooltip (500) when left out. Keyboard focus never waits, and nor
   * does a tooltip reached while another is showing or has just closed.
   */
  delay?: number
}

export function Tooltip({
  children,
  content,
  placement = 'top',
  align = 'center',
  type = 'standard',
  delay,
}: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  // Shown without its entrance: from the keyboard, or warm from a neighbour.
  const [instant, setInstant] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Whether this opening was a person's. One opened by code (the docs' stills
  // dispatch a synthetic hover) shows at once and does not warm the others,
  // or a page of stills would make every real tooltip skip its wait.
  const counted = useRef(true)

  useEffect(() => {
    if (!open || !counted.current) return
    showing++
    return () => {
      showing--
      lastClosed = performance.now()
    }
  }, [open])

  // Non-modal: no focus trap, and no click-outside — a tooltip is dismissed by
  // leaving it, not by clicking elsewhere. Escape still closes it. The bubble
  // sits inside the wrapper, so the pointer can move onto it without leaving.
  const ref = useOverlay<HTMLSpanElement>({
    open,
    onDismiss: () => setOpen(false),
    trapFocus: false,
    outside: false,
  })

  const showNow = () => {
    if (timer.current) clearTimeout(timer.current)
    setInstant(true)
    setOpen(true)
  }
  const show = (e?: MouseEvent | FocusEvent) => {
    if (timer.current) clearTimeout(timer.current)
    counted.current = e?.nativeEvent.isTrusted !== false
    if (!counted.current) return showNow()
    if (showing > 0 || performance.now() - lastClosed < WARM_MS) return showNow()
    setInstant(false)
    timer.current = setTimeout(() => setOpen(true), delay ?? motionMs('delay-tooltip', { fallback: 500 }))
  }
  // Keyboard focus is opened by keyboard, so it shows at once. A focus that
  // comes with a click is a pointer's, and waits like a hover.
  const onFocus = (e: FocusEvent) => {
    if ((e.target as Element).matches?.(':focus-visible')) {
      counted.current = true
      showNow()
    } else show(e)
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
      onFocusCapture={onFocus}
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
          data-instant={instant || undefined}
          className={[styles.tip, type === 'standard' ? '' : styles[type], styles[side], styles[edge]].join(' ')}
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
