// No directive: cloning an element needs no client runtime, and adding one
// would drag every consumer across the boundary with it.
import { Children, cloneElement, isValidElement } from 'react'
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'
import { cn } from '@/lib/cn'

type SlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

/**
 * Minimal `asChild` implementation: renders its props onto its single child
 * instead of emitting a wrapper element.
 *
 * shadcn imports this from @radix-ui/react-slot. Written locally instead —
 * it is a dozen lines, and owning it rather than depending on it is the part
 * of shadcn's approach worth copying.
 */
export function Slot({ children, ref, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    if (Children.count(children) > 1) {
      throw new Error('Slot: asChild expects exactly one child element.')
    }
    return null
  }

  const child = children as ReactElement<Record<string, unknown>>
  const childProps = child.props

  return cloneElement(child, {
    ...slotProps,
    ...childProps,
    // The consumer's classes win order but both survive.
    className: cn(slotProps.className, childProps.className as string),
    style: { ...(slotProps.style ?? {}), ...((childProps.style as object) ?? {}) },
    ref,
  })
}
