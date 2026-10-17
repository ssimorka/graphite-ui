// Not a client component, for the same reason button.tsx is not: this has no
// state, and the pairing check runs at render on either side of the
// boundary. Keeping it on the server lets a server component compose a footer.
import { Children, Fragment, isValidElement } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './button'
import styles from './button-group.module.scss'

/**
 * Contract: docs/contracts/button-group.md (2.0.0)
 *
 * Enforces Button's pairing rules: one filled button per group, last in the
 * group, with partners from its own colour family. Card and Dialog wrap their
 * footers in this, so the rules hold wherever a footer is used rather than
 * only where someone remembers them.
 */
export type ButtonGroupProps = ComponentPropsWithRef<'div'>

const FILLED = new Set(['primary', 'secondary', 'danger'])
// Danger sits outside the families, so it never makes a group mixed.
const FAMILY: Record<string, 'violet' | 'green'> = {
  primary: 'violet',
  outlined: 'violet',
  ghost: 'violet',
  secondary: 'green',
  'secondary-outlined': 'green',
  'secondary-ghost': 'green',
}

// Children.toArray flattens arrays but keeps a fragment as one child, so a
// footer passed as <>...</> (Modal's, from every caller) would hide its
// buttons from the check. Fragments are unwrapped recursively; any other
// element is read as itself, so a wrapper element still hides what is inside
// it. The contract says so rather than pretending the check reaches.
//
// A Button with no variant is counted as secondary, its default, because that
// is what it renders: a filled button. Another element is counted only when it
// passes one of Button's variant names.
function variantsOf(children: ReactNode): string[] {
  const out: string[] = []
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ variant?: unknown; children?: ReactNode }>(child)) continue
    if (child.type === Fragment) {
      out.push(...variantsOf(child.props.children))
      continue
    }
    const v = child.props.variant
    if (typeof v === 'string') out.push(v)
    else if (child.type === Button && v === undefined) out.push('secondary')
  }
  return out
}

function problemWith(variants: string[]): string | null {
  const filled = variants.filter((v) => FILLED.has(v))
  if (filled.length > 1) {
    return (
      `${filled.length} filled buttons in one group (${filled.join(', ')}). Only one ` +
      'of primary, secondary and danger is allowed: demote the others to ' +
      'outlined or ghost from the same family.'
    )
  }
  const families = new Set(variants.map((v) => FAMILY[v]).filter(Boolean))
  if (families.size > 1) {
    return (
      `mixed colour families (${variants.join(', ')}). A primary pairs with ` +
      'outlined or ghost, a secondary with secondary-outlined or secondary-ghost.'
    )
  }
  if (filled.length === 1 && variants[variants.length - 1] !== filled[0]) {
    return `the filled button (${filled[0]}) is not last. It goes at the trailing end.`
  }
  return null
}

export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
  const problem = problemWith(variantsOf(children))

  if (problem) {
    throw new Error(
      `ButtonGroup: ${problem} (docs/contracts/button-group.md). A second filled ` +
        'button is not an emphasis choice, it is a missing decision about what ' +
        'the group is for.',
    )
  }

  return (
    <div data-slot="button-group" className={cn(styles.group, className)} {...props}>
      {children}
    </div>
  )
}
