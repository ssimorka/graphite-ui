'use client'

import { Children, Fragment, cloneElement, createContext, isValidElement, useContext, useId } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
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

/** Contract: docs/contracts/modal.md (2.0.0) */
type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  /** The kit's Label: a 12/16 line above the title. */
  label?: string
  body: ReactNode
  /** The kit's Progress: a block between the header and the body. */
  progress?: ReactNode
  /**
   * Buttons, laid out as the kit's footer: equal full-bleed columns 64 tall,
   * 1px apart, from the right. A ghost button first is the kit's Cancel,
   * pinned to the left. Wrapped in a ButtonGroup, so one primary at most.
   */
  footer?: ReactNode
  /**
   * The kit's Inline loading: the primary action's column shows this text
   * with the spinner instead of the button, while the action runs.
   */
  loading?: string
  /** The kit's Size: 320, 384, 512 and 672 wide. */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** When false, Escape, the scrim and the close button no longer dismiss it. */
  dismissible?: boolean
}

type FooterButton = ReactElement<{ variant?: string; size?: string; style?: CSSProperties }>

// The footer's buttons, with fragments unwrapped, as ButtonGroup counts them.
function flatten(children: ReactNode): FooterButton[] {
  const out: FooterButton[] = []
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue
    if (child.type === Fragment) out.push(...flatten(child.props.children))
    else out.push(child as FooterButton)
  }
  return out
}

export function Modal({
  open,
  onClose,
  title,
  label,
  body,
  progress,
  footer,
  loading,
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

  // The kit's footer: one or two actions fill two columns from the right;
  // three, or a Cancel, take four, with the Cancel pinned to the first.
  const buttons = flatten(footer)
  const cancel = buttons.length > 1 && buttons[0].props.variant === 'ghost'
  const cols = buttons.length > 2 || cancel ? 4 : 2
  const footerStyle = { '--cols': cols } as CSSProperties
  const placed = buttons.map((b, i) => {
    const column =
      cancel && i === 0 ? 1 : cols - (buttons.length - 1 - i)
    const style = { gridColumn: column } as CSSProperties
    if (loading && b.props.variant === 'primary') {
      return (
        <span key={i} className={styles.loading} style={style} role="status">
          <KitIcon name="spinner" className={styles.spinner} />
          {loading}
        </span>
      )
    }
    // Cloned rather than wrapped, so ButtonGroup still sees each button and
    // its one-primary check still reaches them.
    return cloneElement(b, { key: i, size: b.props.size ?? 'xl', style })
  })

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
          <div className={styles.header}>
            {label ? <p className={styles.label}>{label}</p> : null}
            <h2 id={`${id}-title`} className={styles.title}>
              {title}
            </h2>
            {dismissible ? (
              <Button
                variant="ghost"
                size="icon-lg"
                className={styles.close}
                aria-label="Close"
                onClick={onClose}
              >
                <KitIcon name="cross-small" size={20} />
              </Button>
            ) : null}
          </div>
          <div className={styles.content}>
            {progress ? <div className={styles.progress}>{progress}</div> : null}
            <div className={styles.body}>{body}</div>
          </div>
          {buttons.length ? (
            <ButtonGroup className={styles.footer} style={footerStyle}>
              {placed}
            </ButtonGroup>
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
