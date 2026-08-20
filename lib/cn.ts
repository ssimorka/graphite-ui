import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

/**
 * Class merge. shadcn pairs clsx with tailwind-merge to resolve conflicting
 * utility classes; there are no utility classes here — variants resolve to
 * CSS module class names, which cannot conflict — so clsx alone is the whole
 * job.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
