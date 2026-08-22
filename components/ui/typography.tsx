import type { ReactNode } from 'react'
import styles from './typography.module.scss'

type Variant =
  | 'display'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'body'
  | 'caption'

// Variant declares document structure, not size: heading levels map to real
// h1-h4 tags. Picking heading-3 because it "looks right" is a contract
// violation, and the no-skipped-levels rule is the page composer's to keep.
const TAG_FOR: Record<Variant, 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'> = {
  display: 'h1',
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'heading-4': 'h4',
  body: 'p',
  caption: 'span',
}

/** Contract: docs/contracts/typography.md (1.1.0) */
type TypographyProps = {
  children: ReactNode
  variant?: Variant
  weight?: 'regular' | 'medium' | 'semibold'
  /**
   * Only for surface-inverted contexts, e.g. text on a filled primary surface.
   * The contract permits an explicit color override for this case and no other.
   */
  inverted?: boolean
  className?: string
}

export function Typography({
  children,
  variant = 'body',
  weight = 'regular',
  inverted = false,
  className,
}: TypographyProps) {
  const Tag = TAG_FOR[variant]
  const classes = [
    styles.typography,
    styles[weight],
    inverted ? styles.inverted : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return <Tag className={`${classes} ${styles[variant]}`}>{children}</Tag>
}
