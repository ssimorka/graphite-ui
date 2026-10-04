import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import type { KitIconName } from '@/lib/kit-icons'
import styles from './link.module.scss'

/**
 * Contract: docs/contracts/link.md (1.0.0)
 *
 * The kit's Link (50111:991): Size × State × Inverse, with its Icon, Swap icon
 * and Inline properties. A native anchor throughout; Hover, Focus and Active
 * are pseudo-classes (governance rule 7), Visited is `:visited`, and Disabled
 * drops the href and sets aria-disabled.
 */

export type LinkSize = 'sm' | 'md' | 'lg'

/** The kit's trailing glyph: 20px at Large, 16px at Medium and Small. */
const ICON_SIZE: Record<LinkSize, number> = { lg: 20, md: 16, sm: 16 }

const SIZE_CLASS: Record<LinkSize, string> = { lg: styles.lg, md: styles.md, sm: styles.sm }

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  children: ReactNode
  /** The kit's Size: Body/2, Body/3 or Caption/1. Large by default, as the kit's set is. */
  size?: LinkSize
  /** Underlined, for a link inside running text. Takes no icon. */
  inline?: boolean
  /** For a link on the inverse fill (a high-contrast Notification, a Tooltip bubble). */
  inverse?: boolean
  /** The kit's Icon and Swap icon: a trailing glyph, decorative. Ignored when inline. */
  icon?: KitIconName
  disabled?: boolean
}

export function Link({
  children,
  size = 'lg',
  inline = false,
  inverse = false,
  icon,
  disabled = false,
  href,
  className,
  ...rest
}: LinkProps) {
  const classes = [
    styles.link,
    SIZE_CLASS[size],
    inline ? styles.inline : '',
    inverse ? styles.inverse : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      {...rest}
      className={classes}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      role={disabled ? 'link' : rest.role}
    >
      {children}
      {icon && !inline ? (
        <span className={styles.icon} aria-hidden="true">
          <KitIcon name={icon} size={ICON_SIZE[size]} />
        </span>
      ) : null}
    </a>
  )
}
