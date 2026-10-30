'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ButtonVariant } from '@/components/ui/button'
import { Dropdown } from '@/components/ui/dropdown'
import { KitIcon } from '@/components/kit-icon'
import { DemoFrame } from '../demo-frame'
import { exampleFor, isIcon, LABEL } from './button-code'
import type { Size } from './button-code'

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
          <Dropdown
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as ButtonVariant)}
            options={[
              { value: 'primary', label: 'Primary' },
              { value: 'outlined', label: 'Outlined' },
              { value: 'ghost', label: 'Ghost' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'secondary-outlined', label: 'Secondary outlined' },
              { value: 'secondary-ghost', label: 'Secondary ghost' },
              { value: 'danger', label: 'Danger' },
              { value: 'danger-ghost', label: 'Danger ghost' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra large' },
              { value: '2xl', label: '2x large' },
              { value: 'expressive', label: 'Expressive' },
              { value: 'icon-sm', label: 'Icon only, Small' },
              { value: 'icon', label: 'Icon only, Medium' },
              { value: 'icon-lg', label: 'Icon only, Large' },
              { value: 'icon-xl', label: 'Icon only, Extra large' },
              { value: 'icon-expressive', label: 'Icon only, Expressive' },
            ]}
          />
        </>
      }
      preview={
        isIcon(size) ? (
          <Button variant={variant} size={size} aria-label="Add">
            <KitIcon name="plus" />
          </Button>
        ) : (
          // With the kit's trailing icon, so the preview shows where it sits.
          <Button variant={variant} size={size}>
            {LABEL[variant]}
            <KitIcon name="plus" />
          </Button>
        )
      }
      example={exampleFor({ variant, size })}
    />
  )
}
