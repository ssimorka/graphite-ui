'use client'

import { useState } from 'react'
import { Typography } from '@/components/ui/typography'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'

type Variant =
  | 'display'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'body'
  | 'caption'
type Weight = 'regular' | 'medium' | 'semibold'

const TEXT = 'One source color becomes every ramp and role.'

function codeFor(variant: Variant, weight: Weight) {
  const variantProp = variant === 'body' ? '' : ` variant="${variant}"`
  const weightProp = weight === 'regular' ? '' : ` weight="${weight}"`
  return `<Typography${variantProp}${weightProp}>\n  ${TEXT}\n</Typography>`
}

/**
 * Variant and weight, the two props that change the text itself. Inverted
 * only reads on a primary fill, so the Variants section shows it there. The
 * option labels name the element each variant renders, because the variant is
 * a structural choice before it is a size.
 */
export function TypographyPreview() {
  const [variant, setVariant] = useState<Variant>('heading-2')
  const [weight, setWeight] = useState<Weight>('regular')

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={[
              { value: 'display', label: 'Display (h1)' },
              { value: 'heading-1', label: 'Heading 1 (h1)' },
              { value: 'heading-2', label: 'Heading 2 (h2)' },
              { value: 'heading-3', label: 'Heading 3 (h3)' },
              { value: 'heading-4', label: 'Heading 4 (h4)' },
              { value: 'body', label: 'Body (p)' },
              { value: 'caption', label: 'Caption (span)' },
            ]}
          />
          <Dropdown
            label="Weight"
            size="sm"
            value={weight}
            onChange={(v) => setWeight(v as Weight)}
            options={[
              { value: 'regular', label: 'Regular' },
              { value: 'medium', label: 'Medium' },
              { value: 'semibold', label: 'Semibold' },
            ]}
          />
        </>
      }
      preview={
        // A heading variant is a real h1 to h4; hidden from the outline for the
        // same reason as the specimens on the page.
        <div aria-hidden={variant === 'display' || variant.startsWith('heading') ? true : undefined}>
          <Typography variant={variant} weight={weight}>
            {TEXT}
          </Typography>
        </div>
      }
      code={codeFor(variant, weight)}
    />
  )
}
