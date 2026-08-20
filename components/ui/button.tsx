'use client'

import { Children, isValidElement } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

/** Contract: docs/contracts/button.md (1.0.0) */
type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  leading?: ReactNode
  trailing?: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  leading,
  trailing,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
    >
      {leading ? <span className={styles.icon}>{leading}</span> : null}
      <span>{children}</span>
      {trailing ? <span className={styles.icon}>{trailing}</span> : null}
    </button>
  )
}

/**
 * Enforces the one-primary-action rule. Card and Dialog wrap their footers in
 * this, so "a Card footer can't have two primary buttons" holds wherever a
 * footer is used rather than only where someone remembers the rule.
 */
export function ButtonGroup({ children }: { children: ReactNode }) {
  const primaries = Children.toArray(children).filter(
    (child) =>
      isValidElement<{ variant?: ButtonVariant }>(child) &&
      child.props.variant === 'primary',
  ).length

  if (primaries > 1) {
    throw new Error(
      `ButtonGroup: ${primaries} primary buttons in one group — only one is ` +
        'allowed (docs/contracts/button.md). The second is not an emphasis ' +
        'choice, it is a missing decision about what the group is for.',
    )
  }

  return <div className={styles.group}>{children}</div>
}
