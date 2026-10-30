'use client'

import { useState } from 'react'
import { Tag } from '@/components/ui/tag'
import type { TagSize, TagVariant } from '@/components/ui/tag'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { exampleFor, value } from './tag-code'
import type { Content } from './tag-code'

/**
 * Variant is the contract prop worth a control. The Label control shows what
 * the other one, max, does at its default: a large count caps at 99+.
 */
export function TagPreview() {
  const [variant, setVariant] = useState<TagVariant>('primary')
  const [content, setContent] = useState<Content>('text')
  const [size, setSize] = useState<TagSize>('md')

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as TagVariant)}
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
          <Dropdown
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
          <Dropdown
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
      example={exampleFor({ variant, content, size })}
    />
  )
}
