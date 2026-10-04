'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import type { KitIconName } from '@/lib/kit-icons'
import styles from './tabs.module.scss'

export type Tab = {
  id: string
  /** Always required: with an icon-only list it becomes the tab's aria-label. */
  label: string
  panel: ReactNode
  /** The kit's Icon: trailing a text tab, or the whole of an icon-only one. */
  icon?: KitIconName
  /** The kit's Disabled. Skipped by the arrow keys and never selected. */
  disabled?: boolean
  /** The kit's Show 2nd label, a 12/16 line under the label. Contained only. */
  secondaryLabel?: string
  /** The kit's Show Badge indicator, a dot over an icon-only tab's icon. */
  badge?: boolean
}

/** Contract: docs/contracts/tabs.md (2.0.0) */
type TabsProps = {
  /** The tuple makes the contract's two-tab minimum a compile error. */
  tabs: [Tab, Tab, ...Tab[]]
  defaultTabId?: string
  orientation?: 'horizontal' | 'vertical'
  /** The kit's Style. Horizontal only; vertical tabs are their own set. */
  variant?: 'line' | 'contained'
  /** The kit's item Size: Medium is 40, Large 48. Contained is always Large. */
  size?: 'md' | 'lg'
  /**
   * The kit's Type=Icon only. Every tab then needs an icon, and its label
   * becomes the accessible name.
   */
  iconOnly?: boolean
  /** The kit's Alignment=Grid aware: tabs share the width equally. */
  fullWidth?: boolean
  /**
   * The kit's Dismissible. Each tab gets the close glyph, and Delete on a
   * focused tab dismisses it too. The caller removes the tab from the list.
   */
  onDismiss?: (id: string) => void
  /** The kit's Hover Dismissible: the close glyph shows on hover and focus only. */
  dismissOnHover?: boolean
}

export function Tabs({
  tabs,
  defaultTabId,
  orientation = 'horizontal',
  variant = 'line',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
  onDismiss,
  dismissOnHover = false,
}: TabsProps) {
  const uid = useId()
  const [chosen, setChosen] = useState(defaultTabId ?? tabs[0].id)
  // A dismissed or disabled selection falls back to the first tab that can
  // hold it, so a panel is always showing.
  const active = tabs.some((t) => t.id === chosen && !t.disabled)
    ? chosen
    : (tabs.find((t) => !t.disabled) ?? tabs[0]).id

  const refs = useRef(new Map<string, HTMLButtonElement>())
  const list = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState({ start: false, end: false, any: false })
  const horizontal = orientation === 'horizontal'

  // The kit's Previous and Next: shown only while the list overflows, each
  // disabled at its end.
  const measure = useCallback(() => {
    const el = list.current
    if (!el || !horizontal) return
    const any = el.scrollWidth > el.clientWidth + 1
    setOverflow({
      any,
      start: any && el.scrollLeft > 0,
      end: any && el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    })
  }, [horizontal])

  useEffect(() => {
    measure()
    const el = list.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, tabs.length])

  const scrollBy = (dir: 1 | -1) => {
    const el = list.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  // Automatic activation: focus and selection move together. Moving only the
  // selection strands focus on a tab that has just left the Tab order.
  // Disabled tabs are stepped over.
  const select = (from: number, step: 1 | -1) => {
    for (let n = 1; n <= tabs.length; n++) {
      const next = tabs[(from + step * n + tabs.length * n) % tabs.length]
      if (next.disabled) continue
      setChosen(next.id)
      const el = refs.current.get(next.id)
      el?.focus()
      el?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      return
    }
  }

  const style = horizontal ? variant : 'vertical'
  const itemSize = horizontal && variant === 'contained' ? 'lg' : size

  return (
    <div
      className={[
        styles.tabs,
        styles[orientation],
        styles[style],
        styles[itemSize],
        iconOnly ? styles.iconOnly : '',
        fullWidth ? styles.fullWidth : '',
        dismissOnHover ? styles.dismissOnHover : '',
      ].join(' ')}
    >
      <div className={styles.bar}>
        {overflow.any ? (
          <button
            type="button"
            className={`${styles.scroll} ${styles.previous}`}
            aria-label="Scroll tabs back"
            tabIndex={-1}
            disabled={!overflow.start}
            onClick={() => scrollBy(-1)}
          >
            <KitIcon name="angle-small-right" className={styles.flip} />
          </button>
        ) : null}
        <div
          ref={list}
          role="tablist"
          aria-orientation={orientation}
          className={styles.list}
          onScroll={measure}
          onKeyDown={(e) => {
            const i = tabs.findIndex((t) => t.id === active)
            const prev = horizontal ? 'ArrowLeft' : 'ArrowUp'
            const next = horizontal ? 'ArrowRight' : 'ArrowDown'
            if (e.key === 'Delete' && onDismiss) {
              e.preventDefault()
              onDismiss(active)
              return
            }
            if (e.key === next) select(i, 1)
            else if (e.key === prev) select(i, -1)
            else if (e.key === 'Home') select(-1, 1)
            else if (e.key === 'End') select(tabs.length, -1)
            else return
            e.preventDefault()
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${uid}-${tab.id}-tab`}
              aria-controls={`${uid}-${tab.id}-panel`}
              aria-label={iconOnly ? tab.label : undefined}
              aria-keyshortcuts={onDismiss ? 'Delete' : undefined}
              ref={(el) => {
                if (el) refs.current.set(tab.id, el)
                else refs.current.delete(tab.id)
              }}
              aria-selected={tab.id === active}
              tabIndex={tab.id === active ? 0 : -1}
              disabled={tab.disabled}
              className={`${styles.tab} ${tab.id === active ? styles.active : ''}`}
              onClick={() => setChosen(tab.id)}
            >
              {iconOnly ? (
                tab.icon ? <KitIcon name={tab.icon} size={itemSize === 'lg' && horizontal ? 20 : 16} /> : null
              ) : (
                <span className={styles.text}>
                  <span className={styles.labelRow}>
                    <span>{tab.label}</span>
                    {tab.icon ? <KitIcon name={tab.icon} /> : null}
                    {onDismiss ? (
                      <span
                        className={styles.dismiss}
                        aria-hidden="true"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDismiss(tab.id)
                        }}
                      >
                        <KitIcon name="cross-small" />
                      </span>
                    ) : null}
                  </span>
                  {tab.secondaryLabel ? (
                    <span className={styles.secondary}>{tab.secondaryLabel}</span>
                  ) : null}
                </span>
              )}
              {tab.badge ? <span className={styles.badge} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
        {overflow.any ? (
          <button
            type="button"
            className={`${styles.scroll} ${styles.next}`}
            aria-label="Scroll tabs forward"
            tabIndex={-1}
            disabled={!overflow.end}
            onClick={() => scrollBy(1)}
          >
            <KitIcon name="angle-small-right" />
          </button>
        ) : null}
      </div>

      {/* Every panel stays mounted; inactive ones are hidden. Conditionally
          rendering them would destroy any Field state inside on tab switch,
          which is exactly what the contract prohibits. */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${uid}-${tab.id}-panel`}
          aria-labelledby={`${uid}-${tab.id}-tab`}
          hidden={tab.id !== active}
          className={styles.panel}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}
