'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { useOverlay } from './overlay'
import styles from './menu.module.scss'

export type MenuItem =
  | {
      kind?: 'item'
      label: string
      onSelect: () => void
      disabled?: boolean
      /**
       * The kit's Delete row: neutral at rest with the trailing delete icon,
       * filled with danger on hover. The icon is what keeps it from reading as
       * a neutral action, which the contract forbids.
       */
      destructive?: boolean
      /** The kit's Shortcut combo, shown in the trailing slot. Display only. */
      shortcut?: string
      /**
       * The kit's Selected: a leading check. Setting it on any item makes the
       * item a menuitemcheckbox, and indents every row so the labels align.
       */
      selected?: boolean
    }
  | { kind: 'separator' }

/** Contract: docs/contracts/menu.md (2.1.0) */
type MenuProps = {
  trigger: (props: {
    onClick: () => void
    onKeyDown: (e: KeyboardEvent) => void
    'aria-expanded': boolean
    'aria-haspopup': 'menu'
  }) => ReactNode
  /** At least one item. Separators do not count toward that on their own. */
  items: [MenuItem, ...MenuItem[]]
  placement?: 'bottom' | 'top'
  /** Which edge of the trigger the menu lines up with: its start (the default) or its end. */
  align?: 'start' | 'end'
  /**
   * Sits the menu on its trigger with no gap, as the kit's Menu buttons draw
   * it (#286). Otherwise it stands 4 off.
   */
  flush?: boolean
  /** The kit's Size: rows of 50, 42, 34 and 26. */
  size?: 'lg' | 'md' | 'sm' | 'xs'
}

export function Menu({ trigger, items, placement = 'bottom', align = 'start', flush = false, size = 'md' }: MenuProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  // Which item takes focus when the menu opens, or null for a menu opened by
  // code rather than by a person (the docs stills), which must not steal focus.
  const focusOnOpen = useRef<'first' | 'last' | null>(null)
  // Stable, because the hook's effect depends on it: a new function on every
  // render would re-run that effect, whose cleanup sends focus to the trigger.
  const close = useCallback(() => setOpen(false), [])
  const ref = useOverlay<HTMLDivElement>({ open, onDismiss: close })

  const enabledItems = () =>
    Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>(
        ':is([role="menuitem"], [role="menuitemcheckbox"]):not(:disabled)',
      ) ?? [],
    )

  // The kit's Indented: once any row can carry the check, every row keeps its
  // leading slot, so the labels line up.
  const indented = items.some((item) => item.kind !== 'separator' && item.selected !== undefined)

  // Declared after useOverlay so its effect runs second: the hook has already
  // recorded the trigger as the place to return focus to.
  useEffect(() => {
    if (!open || !focusOnOpen.current) return
    const list = enabledItems()
    ;(focusOnOpen.current === 'last' ? list[list.length - 1] : list[0])?.focus()
    focusOnOpen.current = null
  }, [open])

  // The WAI-ARIA menu button pattern. Focus moves between items directly, and
  // every item stays at tabindex -1, so the menu is one stop, not one per item.
  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      // No preventDefault: the Tab carries on from the trigger once the hook
      // has put focus back there, so it lands on whatever follows the menu.
      close()
      return
    }
    const list = enabledItems()
    if (list.length === 0) return
    const i = list.indexOf(document.activeElement as HTMLButtonElement)
    const to =
      e.key === 'ArrowDown' ? (i + 1) % list.length
      : e.key === 'ArrowUp' ? (i - 1 + list.length) % list.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? list.length - 1
      : null
    if (to === null) return
    e.preventDefault()
    list[to].focus()
  }

  return (
    <span className={styles.wrap}>
      {trigger({
        // Called with an event when a person clicks or presses Enter or Space;
        // called bare when code opens the menu. Only the first moves focus in.
        onClick: (...args: unknown[]) => {
          focusOnOpen.current = !open && args.length > 0 ? 'first' : null
          setOpen((v) => !v)
        },
        onKeyDown: (e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
          e.preventDefault()
          focusOnOpen.current = e.key === 'ArrowUp' ? 'last' : 'first'
          if (open) {
            const list = enabledItems()
            ;(e.key === 'ArrowUp' ? list[list.length - 1] : list[0])?.focus()
          } else {
            setOpen(true)
          }
        },
        'aria-expanded': open,
        'aria-haspopup': 'menu',
      })}
      {open ? (
        <div
          ref={ref}
          id={id}
          role="menu"
          className={[styles.menu, styles[placement], styles[size], align === 'end' ? styles.end : '', flush ? styles.flush : ''].join(' ')}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item, i) =>
            item.kind === 'separator' ? (
              <span key={`sep-${i}`} className={styles.separator} role="separator" />
            ) : (
              <button
                key={item.label}
                type="button"
                role={item.selected !== undefined ? 'menuitemcheckbox' : 'menuitem'}
                aria-checked={item.selected}
                tabIndex={-1}
                disabled={item.disabled}
                // Destructive items are visually distinct. The contract's older
                // requirement to route them through a confirmation Dialog was
                // conditional on Wave 0, which has now shipped the status role.
                className={`${styles.item} ${item.destructive ? styles.destructive : ''}`}
                onClick={() => {
                  item.onSelect()
                  setOpen(false)
                }}
              >
                {indented ? (
                  <span className={styles.lead} aria-hidden="true">
                    {item.selected ? <KitIcon name="check" /> : null}
                  </span>
                ) : null}
                <span className={styles.label}>{item.label}</span>
                {item.shortcut ? <span className={styles.trail}>{item.shortcut}</span> : null}
                {item.destructive ? (
                  <span className={styles.trail} aria-hidden="true">
                    <KitIcon name="delete" />
                  </span>
                ) : null}
              </button>
            ),
          )}
        </div>
      ) : null}
    </span>
  )
}
