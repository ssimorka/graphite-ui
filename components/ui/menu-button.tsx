'use client'

import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { Menu } from './menu'
import type { MenuItem } from './menu'
import styles from './menu-button.module.scss'

/**
 * Contract: docs/contracts/menu-button.md (1.0.1)
 *
 * The kit's Menu buttons page: Menu button (31420:317548), Combo button
 * (31753:68447) and Overflow (3717:45725). Each fixes the trigger, the
 * governed Button, and hands the rest to the governed Menu, which sits flush
 * on it. Position is Menu's placement; Overflow's Alignment is Menu's align.
 */

type Size = 'sm' | 'md' | 'lg'
type Items = [MenuItem, ...MenuItem[]]

type Common = {
  items: Items
  /** The kit's Size: the trigger at 32, 40 or 48, and the menu's rows with it. */
  size?: Size
  /** The kit's Position: the menu below the trigger (the default) or above it. */
  placement?: 'bottom' | 'top'
  disabled?: boolean
}

const ICON_SIZE = { sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const

/** The kit's Menu button: a primary Button whose label names the menu, and a chevron. */
export function MenuButton({ label, items, size = 'lg', placement = 'bottom', disabled }: Common & { label: string }) {
  return (
    <Menu
      items={items}
      size={size}
      placement={placement}
      flush
      trigger={(props) => (
        <Button variant="primary" size={size} disabled={disabled} {...props}>
          {label}
          <KitIcon name="angle-small-down" className={styles.chevron} />
        </Button>
      )}
    />
  )
}

/**
 * The kit's Combo button: the primary action, and beside it, 1 apart, a
 * primary icon-only Button that opens related actions. The menu lines up with
 * the pair's start.
 */
export function ComboButton({
  label,
  onClick,
  menuLabel = 'More actions',
  items,
  size = 'lg',
  placement = 'bottom',
  disabled,
}: Common & { label: string; onClick: () => void; menuLabel?: string }) {
  return (
    <Menu
      items={items}
      size={size}
      placement={placement}
      flush
      trigger={(props) => (
        <span className={styles.combo}>
          <Button variant="primary" size={size} disabled={disabled} onClick={onClick}>
            {label}
          </Button>
          <Button variant="primary" size={ICON_SIZE[size]} disabled={disabled} aria-label={menuLabel} {...props}>
            <KitIcon name="angle-small-down" className={styles.chevron} />
          </Button>
        </span>
      )}
    />
  )
}

/**
 * The kit's Overflow: a ghost icon-only Button with the menu dots, its menu
 * lined up with the trigger's start or end.
 */
export function OverflowMenu({
  label = 'Options',
  items,
  size = 'lg',
  placement = 'bottom',
  align = 'start',
  disabled,
}: Common & { label?: string; align?: 'start' | 'end' }) {
  return (
    <Menu
      items={items}
      size={size}
      placement={placement}
      align={align}
      flush
      trigger={(props) => (
        <Button variant="ghost" size={ICON_SIZE[size]} disabled={disabled} aria-label={label} {...props}>
          <KitIcon name="menu-dots" />
        </Button>
      )}
    />
  )
}
