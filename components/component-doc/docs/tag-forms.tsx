'use client'

import { useState } from 'react'
import { OperationalTag, SelectableTag, Tag } from '@/components/ui/tag'
import styles from './button.module.scss'

/**
 * The Tag specimens that need state or several pills in a row: sizes, the
 * dismiss button, and the two interactive forms. A client component, because
 * dismissing and selecting are live here.
 */
export function TagForms({ show }: { show: 'sizes' | 'dismissible' | 'selectable' | 'operational' }) {
  const [tags, setTags] = useState(['Design', 'Research', 'Ops'])
  const [picked, setPicked] = useState<Record<string, boolean>>({ Light: true, Dark: false })

  if (show === 'sizes') {
    return (
      <div className={styles.row}>
        <Tag variant="primary" size="sm">Small</Tag>
        <Tag variant="primary">Medium</Tag>
        <Tag variant="primary" size="lg">Large</Tag>
      </div>
    )
  }
  if (show === 'dismissible') {
    return (
      <div className={styles.row}>
        {tags.map((t) => (
          <Tag key={t} variant="secondary" onDismiss={() => setTags((l) => l.filter((x) => x !== t))}>
            {t}
          </Tag>
        ))}
        {tags.length === 0 ? (
          <button type="button" onClick={() => setTags(['Design', 'Research', 'Ops'])}>Reset</button>
        ) : null}
      </div>
    )
  }
  if (show === 'selectable') {
    return (
      <div className={styles.row}>
        {Object.keys(picked).map((k) => (
          <SelectableTag key={k} selected={picked[k]} onSelectedChange={(v) => setPicked((p) => ({ ...p, [k]: v }))}>
            {k}
          </SelectableTag>
        ))}
        <SelectableTag selected={false} onSelectedChange={() => {}} disabled>
          Disabled
        </SelectableTag>
      </div>
    )
  }
  return (
    <div className={styles.row}>
      {(['neutral', 'primary', 'secondary', 'info', 'success', 'danger'] as const).map((v) => (
        <OperationalTag key={v} variant={v} onClick={() => {}}>
          {v[0].toUpperCase() + v.slice(1)}
        </OperationalTag>
      ))}
    </div>
  )
}
