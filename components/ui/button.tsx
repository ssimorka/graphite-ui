// Deliberately not a client component. Button has no state, and marking it
// 'use client' would put buttonVariants on the client too — which makes it
// uncallable from a server component, exactly where borrowing the recipe is
// most useful. A client caller can still pass onClick; the boundary is the
// caller's, not this file's.
import type { ComponentPropsWithRef } from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Slot } from './slot'
import styles from './button.module.scss'

/**
 * Contract: docs/contracts/button.md (2.3.0)
 *
 * Structured after shadcn: a cva recipe, exported so siblings can borrow it,
 * with forwardRef-style ref, className passthrough, prop spread, a data-slot
 * hook and asChild polymorphism. The recipe resolves to CSS module classes
 * rather than utility classes, so the styling stays on --graphite-* tokens.
 */
export const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
      icon: styles.icon,
    },
  },
  defaultVariants: {
    // shadcn defaults to its filled variant. Graphite defaults to secondary on
    // purpose: "one primary action per group" is a contract rule here, and a
    // primary default would make breaking it the path of least resistance.
    variant: 'secondary',
    size: 'md',
  },
})

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>

export type ButtonProps = ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render onto the single child instead of emitting a button element. */
    asChild?: boolean
  }

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      // Only set a default type when we own the element; a slotted anchor or
      // Link must not be handed a button type.
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  )
}
