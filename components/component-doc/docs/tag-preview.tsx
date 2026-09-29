'use client'

import { useState } from 'react'
import { Tag } from '@/components/ui/tag'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Variant = 'neutral' | 'primary' | 'danger' | 'warning' | 'success'
type Content = 'text' | 'count' | 'overflow'

const TEXT: Record<Variant, string> = {
  neutral: 'Draft',
  primary: 'New',
  danger: 'Failed',
  warning: 'Expiring',
  success: 'Paid',
}

// A number is passed as a number, not a string: only a number is capped.
const value = (variant: Variant, content: Content) =>
  content === 'text' ? TEXT[variant] : content === 'count' ? 42 : 128

function codeFor(variant: Variant, content: Content) {
  const variantProp = variant === 'neutral' ? '' : ` variant="${variant}"`
  const v = value(variant, content)
  const child = typeof v === 'number' ? `{${v}}` : v
  return `<Tag${variantProp}>${child}</Tag>`
}

/**
 * Variant is the one contract prop. The Label control shows the other thing a
 * tag does on its own, capping a large count at 99+.
 */
export function TagPreview() {
  const [variant, setVariant] = useState<Variant>('primary')
  const [content, setContent] = useState<Content>('text')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={[
              { value: 'neutral', label: 'Neutral' },
              { value: 'primary', label: 'Primary' },
              { value: 'danger', label: 'Danger' },
              { value: 'warning', label: 'Warning' },
              { value: 'success', label: 'Success' },
            ]}
          />
          <Select
            label="Label"
            size="sm"
            value={content}
            onChange={(v) => setContent(v as Content)}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'count', label: 'Count (42)' },
              { value: 'overflow', label: 'Count over max (128)' },
            ]}
          />
        </>
      }
      preview={<Tag variant={variant}>{value(variant, content)}</Tag>}
      code={codeFor(variant, content)}
    />
  )
}
