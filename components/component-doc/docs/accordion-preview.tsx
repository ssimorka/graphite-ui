'use client'

import { useState } from 'react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'

type Size = 'sm' | 'md' | 'lg'
export type DemoItem = { value: string; title: string; body: string }

function codeFor(size: Size, items: DemoItem[]) {
  const sizeProp = size === 'md' ? '' : ` size="${size}"`
  const body = items
    .map(
      (i) =>
        `  <AccordionItem value="${i.value}" title="${i.title}">\n    ${i.body}\n  </AccordionItem>`,
    )
    .join('\n')
  return `<Accordion type="single" collapsible${sizeProp} defaultValue="${items[0].value}">\n${body}\n</Accordion>`
}

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
      code={codeFor(size, items)}
    />
  )
}
