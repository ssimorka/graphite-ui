// Not a client component, for the same reason button.tsx is not: this has no
// state, and the one-primary check runs at render on either side of the
// boundary. Keeping it on the server lets a server component compose a footer.
import { Children, isValidElement } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './button-group.module.scss'

/**
 * Contract: docs/contracts/button-group.md (1.0.0)
 *
 * Enforces the one-primary-action rule. Card and Dialog wrap their footers in
 * this, so the rule holds wherever a footer is used rather than only where
 * someone remembers it.
 */
export type ButtonGroupProps = ComponentPropsWithRef<'div'>

export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
  const primaries = Children.toArray(children).filter(
    (child) =>
      isValidElement<{ variant?: ReactNode }>(child) &&
      child.props.variant === 'primary',
  ).length

  if (primaries > 1) {
    throw new Error(
      `ButtonGroup: ${primaries} primary buttons in one group — only one is ` +
        'allowed (docs/contracts/button-group.md). The second is not an ' +
        'emphasis choice, it is a missing decision about what the group is for.',
    )
  }

  return (
    <div data-slot="button-group" className={cn(styles.group, className)} {...props}>
      {children}
    </div>
  )
}
