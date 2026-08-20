import styles from './separator.module.scss'

/** Contract: docs/contracts/separator.md (1.0.0) */
type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical'
}

export function Separator({ orientation = 'horizontal' }: SeparatorProps) {
  return (
    <hr
      className={`${styles.separator} ${styles[orientation]}`}
      // aria-orientation is only meaningful on a vertical separator; the
      // horizontal case is the implicit default for role="separator".
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
    />
  )
}
