'use client'

import { useState } from 'react'
import { Add } from '@carbon/icons-react'
import { Button } from '@/components/ui/button'
import type { ButtonVariant } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Size = 'sm' | 'md' | 'lg' | 'icon'

const LABEL: Record<ButtonVariant, string> = {
  primary: 'Save changes',
  secondary: 'Export',
  ghost: 'Cancel',
  danger: 'Delete project',
  'danger-ghost': 'Remove',
}

function codeFor(variant: ButtonVariant, size: Size) {
  // Defaults are left off, the way a caller would write it.
  const variantProp = variant === 'secondary' ? '' : ` variant="${variant}"`
  const sizeProp = size === 'md' ? '' : ` size="${size}"`
  if (size === 'icon') {
    return `<Button${variantProp}${sizeProp} aria-label="Add">\n  <Add />\n</Button>`
  }
  return `<Button${variantProp}${sizeProp}>
  ${LABEL[variant]}
  <Add />
</Button>`
}

/**
 * The two props the kit also draws as axes, Style and Size. The icon size
 * swaps the label for a glyph and an aria-label, because the contract forbids
 * an icon-only button without a name, and the demo should not model that.
 */
export function ButtonPreview() {
  const [variant, setVariant] = useState<ButtonVariant>('primary')
  const [size, setSize] = useState<Size>('md')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as ButtonVariant)}
            options={[
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'ghost', label: 'Ghost' },
              { value: 'danger', label: 'Danger' },
              { value: 'danger-ghost', label: 'Danger ghost' },
            ]}
          />
          <Select
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'icon', label: 'Icon' },
            ]}
          />
        </>
      }
      preview={
        size === 'icon' ? (
          <Button variant={variant} size="icon" aria-label="Add">
            <Add />
          </Button>
        ) : (
          // With the kit's trailing icon, so the preview shows where it sits.
          <Button variant={variant} size={size}>
            {LABEL[variant]}
            <Add />
          </Button>
        )
      }
      code={codeFor(variant, size)}
    />
  )
}
