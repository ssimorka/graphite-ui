'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { useOverlay } from './overlay'
import styles from './dropdown-menu.module.scss'

export type MenuItem =
  | { kind?: 'item'; label: string; onSelect: () => void; disabled?: boolean; destructive?: boolean }
  | { kind: 'separator' }

/** Contract: docs/contracts/dropdown-menu.md (1.2.0) */
type DropdownMenuProps = {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-haspopup': 'menu' }) => ReactNode
  /** At least one item. Separators do not count toward that on their own. */
  items: [MenuItem, ...MenuItem[]]
  placement?: 'bottom' | 'top'
}

export function DropdownMenu({ trigger, items, placement = 'bottom' }: DropdownMenuProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const ref = useOverlay<HTMLDivElement>({ open, onDismiss: () => setOpen(false) })

  return (
    <span className={styles.wrap}>
      {trigger({
        onClick: () => setOpen((v) => !v),
        'aria-expanded': open,
        'aria-haspopup': 'menu',
      })}
      {open ? (
        <div ref={ref} id={id} role="menu" className={`${styles.menu} ${styles[placement]}`}>
          {items.map((item, i) =>
            item.kind === 'separator' ? (
              <span key={`sep-${i}`} className={styles.separator} role="separator" />
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
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
                {item.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </span>
  )
}
