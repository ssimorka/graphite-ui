'use client'

import { useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './tabs.module.scss'

export type Tab = {
  id: string
  label: string
  panel: ReactNode
}

/** Contract: docs/contracts/tabs.md (1.1.1) */
type TabsProps = {
  /** The tuple makes the contract's two-tab minimum a compile error. */
  tabs: [Tab, Tab, ...Tab[]]
  defaultTabId?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Tabs({ tabs, defaultTabId, orientation = 'horizontal' }: TabsProps) {
  const uid = useId()
  const [active, setActive] = useState(defaultTabId ?? tabs[0].id)

  const refs = useRef(new Map<string, HTMLButtonElement>())

  // Automatic activation: focus and selection move together. Moving only the
  // selection strands focus on a tab that has just left the Tab order.
  const select = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length]
    setActive(next.id)
    refs.current.get(next.id)?.focus()
  }

  return (
    <div className={`${styles.tabs} ${styles[orientation]}`}>
      <div
        role="tablist"
        aria-orientation={orientation}
        className={styles.list}
        onKeyDown={(e) => {
          const i = tabs.findIndex((t) => t.id === active)
          const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
          const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
          const to =
            e.key === next ? i + 1
            : e.key === prev ? i - 1
            : e.key === 'Home' ? 0
            : e.key === 'End' ? tabs.length - 1
            : null
          if (to === null) return
          e.preventDefault()
          select(to)
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${uid}-${tab.id}-tab`}
            aria-controls={`${uid}-${tab.id}-panel`}
            ref={(el) => {
              if (el) refs.current.set(tab.id, el)
              else refs.current.delete(tab.id)
            }}
            aria-selected={tab.id === active}
            tabIndex={tab.id === active ? 0 : -1}
            className={`${styles.tab} ${tab.id === active ? styles.active : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
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
