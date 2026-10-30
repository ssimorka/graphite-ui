'use client'

import { useState } from 'react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { exampleFor } from './accordion-code'
import type { DemoItem, Size } from './accordion-code'

export type { DemoItem }

/**
 * The one control the kit puts on the pane, Size. The kit's pane also has a
 * Light toggle; the site's own theme switch is in the header and already
 * repaints this, so a second one here would be two controls for one thing.
 */
export function AccordionPreview({ items }: { items: DemoItem[] }) {
  const [size, setSize] = useState<Size>('md')

  return (
    <DemoFrame
      controls={
        <Dropdown
          label="Size"
          size="sm"
          value={size}
          onChange={(v) => setSize(v as Size)}
          options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]}
        />
      }
      preview={
        <Accordion type="single" collapsible size={size} defaultValue={items[0].value}>
          {items.map((i) => (
            <AccordionItem key={i.value} value={i.value} title={i.title}>
              {i.body}
            </AccordionItem>
          ))}
        </Accordion>
      }
      example={exampleFor({ size, items })}
    />
  )
}
