'use client'

import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import styles from './tag.module.scss'

/**
 * Contract: docs/contracts/tag.md (3.1.0)
 *
 * The kit's three public Tag sets: Tag - Read-only (`Tag`), Tag - Selectable
 * (`SelectableTag`) and Tag - Operational (`OperationalTag`). They share one
 * pill, one label style and one size scale.
 */

export type TagSize = 'sm' | 'md' | 'lg'

/** The kit's Read-only colours, by role: Gray, Purple, Teal, Blue, Green, Red, High contrast, Outline. Warning is the code's own. */
export type TagVariant =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'danger'
  | 'warning'
  | 'high-contrast'
  | 'outline'

const VARIANT_CLASS: Record<TagVariant, string> = {
  neutral: styles.neutral,
  primary: styles.primary,
  secondary: styles.secondary,
  info: styles.info,
  success: styles.success,
  danger: styles.danger,
  warning: styles.warning,
  'high-contrast': styles.highContrast,
  outline: styles.outline,
}

type CommonProps = {
  size?: TagSize
  disabled?: boolean
  /** The kit's leading Icon: a 16px glyph before the label. Decorative. */
  icon?: ReactNode
}

function Lead({ icon }: { icon?: ReactNode }) {
  return icon ? (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  ) : null
}

type TagProps = CommonProps & {
  /** Short text, or a number to be capped at `max`. */
  children: string | number
  variant?: TagVariant
  /** Numeric badges cap here rather than overflowing their container. */
  max?: number
  /** The kit's Dismissible: a trailing close button that calls this. */
  onDismiss?: () => void
  /** The close button's name, when "Remove" and the label would not say what it does. */
  dismissLabel?: string
}

export function Tag({
  children,
  variant = 'neutral',
  size = 'md',
  disabled = false,
  icon,
  max = 99,
  onDismiss,
  dismissLabel,
}: TagProps) {
  const overflowed = typeof children === 'number' && children > max
  const label = String(children)

  return (
    <span
      className={[styles.tag, styles[size], VARIANT_CLASS[variant], disabled ? styles.disabled : '', icon ? styles.withIcon : '', onDismiss ? styles.withClose : ''].join(' ')}
      aria-disabled={disabled || undefined}
    >
      <Lead icon={icon} />
      <span className={styles.label}>
        {overflowed ? (
          // The capped form is what a sighted reader sees; the real count
          // reaches assistive tech as text. aria-label on a role-less span was
          // skipped by some screen readers, and text is read by all of them.
          <>
            <span aria-hidden="true">{`${max}+`}</span>
            <span className={styles.visuallyHidden}>{children}</span>
          </>
        ) : (
          children
        )}
      </span>
      {onDismiss ? (
        <button
          type="button"
          className={styles.close}
          onClick={onDismiss}
          disabled={disabled}
          aria-label={dismissLabel ?? `Remove ${label}`}
        >
          <KitIcon name="cross-small" size={16} />
        </button>
      ) : null}
    </span>
  )
}

type SelectableTagProps = CommonProps & {
  children: string
  selected: boolean
  onSelectedChange: (selected: boolean) => void
}

/** The kit's Tag - Selectable: a toggle, announced as pressed or not. */
export function SelectableTag({
  children,
  selected,
  onSelectedChange,
  size = 'md',
  disabled = false,
  icon,
}: SelectableTagProps) {
  return (
    <button
      type="button"
      className={[styles.tag, styles[size], styles.selectable, icon ? styles.withIcon : ''].join(' ')}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelectedChange(!selected)}
    >
      <Lead icon={icon} />
      <span className={styles.label}>{children}</span>
    </button>
  )
}

/** Tag - Operational's six colours: Gray, Purple, Teal, Blue, Green, Red. */
export type OperationalTagVariant = 'neutral' | 'primary' | 'secondary' | 'info' | 'success' | 'danger'

type OperationalTagProps = CommonProps & {
  children: string
  variant?: OperationalTagVariant
  onClick: () => void
}

/** The kit's Tag - Operational: a tag that opens or does something. */
export function OperationalTag({
  children,
  variant = 'neutral',
  size = 'md',
  disabled = false,
  icon,
  onClick,
}: OperationalTagProps) {
  return (
    <button
      type="button"
      className={[styles.tag, styles[size], VARIANT_CLASS[variant], styles.operational, icon ? styles.withIcon : ''].join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      <Lead icon={icon} />
      <span className={styles.label}>{children}</span>
    </button>
  )
}
