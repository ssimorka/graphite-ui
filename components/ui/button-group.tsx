// Not a client component, for the same reason button.tsx is not: this has no
// state, and the one-primary check runs at render on either side of the
// boundary. Keeping it on the server lets a server component compose a footer.
import { Children, Fragment, isValidElement } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import styles from './button-group.module.scss'

/**
 * Contract: docs/contracts/button-group.md (1.0.1)
 *
 * Enforces the one-primary-action rule. Card and Dialog wrap their footers in
 * this, so the rule holds wherever a footer is used rather than only where
 * someone remembers it.
 */
export type ButtonGroupProps = ComponentPropsWithRef<'div'>

// Children.toArray flattens arrays but keeps a fragment as one child, so a
// footer passed as <>...</> (Modal's, from every caller) would hide both of its
// buttons from the count. Fragments are unwrapped recursively; any other
// element is counted as itself, so a wrapper element still hides what is
// inside it. The contract says so rather than pretending the check reaches.
function countPrimaries(children: ReactNode): number {
  let n = 0
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ variant?: unknown; children?: ReactNode }>(child)) continue
    if (child.type === Fragment) n += countPrimaries(child.props.children)
    else if (child.props.variant === 'primary') n++
  }
  return n
}

export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
  const primaries = countPrimaries(children)

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
