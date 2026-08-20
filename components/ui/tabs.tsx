'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './tabs.module.scss'

export type Tab = {
  id: string
  label: string
  panel: ReactNode
}

/** Contract: docs/contracts/tabs.md (1.1.0) */
type TabsProps = {
  /** The tuple makes the contract's two-tab minimum a compile error. */
  tabs: [Tab, Tab, ...Tab[]]
  defaultTabId?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Tabs({ tabs, defaultTabId, orientation = 'horizontal' }: TabsProps) {
  const uid = useId()
  const [active, setActive] = useState(defaultTabId ?? tabs[0].id)

  const move = (delta: number) => {
    const i = tabs.findIndex((t) => t.id === active)
    const next = tabs[(i + delta + tabs.length) % tabs.length]
    setActive(next.id)
  }

  return (
    <div className={`${styles.tabs} ${styles[orientation]}`}>
      <div
        role="tablist"
        aria-orientation={orientation}
        className={styles.list}
        onKeyDown={(e) => {
          const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
          const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
          if (e.key === next) { e.preventDefault(); move(1) }
          if (e.key === prev) { e.preventDefault(); move(-1) }
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${uid}-${tab.id}-tab`}
            aria-controls={`${uid}-${tab.id}-panel`}
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
