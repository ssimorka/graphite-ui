import type { ReactNode } from 'react'
import { Search } from './search'
import styles from './contained-list.module.scss'

type Size = 'sm' | 'md' | 'lg' | 'xl'

/** Contract: docs/contracts/contained-list.md (2.1.0) */
type ContainedListProps = {
  /** Typography by convention; the row sets it in Body/3. */
  title: ReactNode
  /** An icon, Tag, or other short marker. Named Avatar until #97 removed it. */
  leading?: ReactNode
  /**
   * The code's own second line: the kit draws none. 12/16, under the title,
   * truncated like it.
   */
  description?: ReactNode
  /**
   * The kit's Item 2 and Item 3: further text cells after the title, each
   * inset 16 like the first.
   */
  cells?: ReactNode[]
  /**
   * One control cluster, never several, flush to the row's right edge. When a
   * row needs more than one action the contract sends you to Menu in this
   * slot rather than letting buttons stack up.
   */
  trailing?: ReactNode
  /** The kit's Size: rows of 32, 40, 48 and 64. */
  size?: Size
  /**
   * Visual only: the hover and active tone steps and a pointer. The row takes
   * no role, focus or click handler, because it has no onClick path to give
   * one to. The caller supplies the link or button that answers the click.
   */
  interactive?: boolean
  /** The kit's Disabled: the text and marker dim, and the row stops responding. */
  disabled?: boolean
  /** The kit's divider Inset: the rule under the row stops 16 short of each end. */
  insetDivider?: boolean
}

export function ContainedList({
  title,
  leading,
  description,
  cells,
  trailing,
  size = 'lg',
  interactive = false,
  disabled = false,
  insetDivider = false,
}: ContainedListProps) {
  return (
    <div
      className={[
        styles.item,
        styles[size],
        interactive && !disabled ? styles.interactive : '',
        disabled ? styles.disabled : '',
        insetDivider ? styles.inset : '',
      ].join(' ')}
      aria-disabled={disabled || undefined}
    >
      <span className={styles.cell}>
        {leading ? <span className={styles.leading}>{leading}</span> : null}
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      </span>
      {cells?.map((c, i) => (
        <span key={i} className={styles.cell}>
          <span className={styles.title}>{c}</span>
        </span>
      ))}
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </div>
  )
}

/**
 * The kit's list title bar, which sits directly above the rows. On page is a
 * Title/5 heading on the page's background, at the rows' height; Disclosed is
 * a 32px Caption/1 bar on the first elevation rung. The action is one control
 * at the bar's right edge: the kit draws an overflow Menu, a ghost or primary
 * icon Button, a link or a Tag there.
 */
export function ContainedListHeader({
  title,
  variant = 'on-page',
  size = 'lg',
  action,
  search,
  as: Heading = 'h3',
}: {
  title: ReactNode
  /** The kit's Type: On page or Disclosed. */
  variant?: 'on-page' | 'disclosed'
  /** Matches the rows beneath it. Disclosed is always 32. */
  size?: Size
  action?: ReactNode
  /**
   * The kit's Filterable search: an expandable Search in the bar, collapsed to
   * its icon until pressed, sized to the bar. Filtering the rows is the
   * caller's.
   */
  search?: { label: string; placeholder?: string; value?: string; onChange?: (value: string) => void }
  /** The heading level, so the list sits in the page's outline. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
  // Disclosed is always 32; On page follows the rows, Large and Extra large
  // sharing the 48 bar.
  const searchSize = variant === 'disclosed' ? 'sm' : size === 'xl' ? 'lg' : size
  return (
    <div className={[styles.header, styles[variant], styles[size]].join(' ')}>
      <Heading className={styles.headerTitle}>{title}</Heading>
      {search ? (
        <span className={styles.headerSearch}>
          <Search
            label={search.label}
            placeholder={search.placeholder}
            value={search.value}
            onChange={search.onChange}
            size={searchSize}
            expandable
          />
        </span>
      ) : null}
      {action ? <span className={styles.trailing}>{action}</span> : null}
    </div>
  )
}
