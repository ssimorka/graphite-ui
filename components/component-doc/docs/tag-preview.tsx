'use client'

import { useState } from 'react'
import { Tag } from '@/components/ui/tag'
import type { TagSize, TagVariant } from '@/components/ui/tag'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Variant = TagVariant
type Content = 'text' | 'count' | 'overflow'

const TEXT: Record<Variant, string> = {
  neutral: 'Draft',
  primary: 'New',
  danger: 'Failed',
  warning: 'Expiring',
  success: 'Paid',
  secondary: 'Design',
  info: 'Beta',
  'high-contrast': 'Pinned',
  outline: 'Archived',
}

// A number is passed as a number, not a string: only a number is capped.
const value = (variant: Variant, content: Content) =>
  content === 'text' ? TEXT[variant] : content === 'count' ? 42 : 128

function codeFor(variant: Variant, content: Content, size: TagSize) {
  const variantProp = variant === 'neutral' ? '' : ` variant="${variant}"`
  const sizeProp = size === 'md' ? '' : ` size="${size}"`
  const v = value(variant, content)
  const child = typeof v === 'number' ? `{${v}}` : v
  return `<Tag${variantProp}${sizeProp}>${child}</Tag>`
}

/**
 * Variant is the contract prop worth a control. The Label control shows what
 * the other one, max, does at its default: a large count caps at 99+.
 */
export function TagPreview() {
  const [variant, setVariant] = useState<Variant>('primary')
  const [content, setContent] = useState<Content>('text')
  const [size, setSize] = useState<TagSize>('md')

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
              { value: 'neutral', label: 'Neutral (Gray)' },
              { value: 'primary', label: 'Primary (Purple)' },
              { value: 'secondary', label: 'Secondary (Teal)' },
              { value: 'info', label: 'Info (Blue)' },
              { value: 'success', label: 'Success (Green)' },
              { value: 'danger', label: 'Danger (Red)' },
              { value: 'warning', label: 'Warning' },
              { value: 'high-contrast', label: 'High contrast' },
              { value: 'outline', label: 'Outline' },
            ]}
          />
          <Select
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as TagSize)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
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
      preview={<Tag variant={variant} size={size}>{value(variant, content)}</Tag>}
      code={codeFor(variant, content, size)}
    />
  )
}
