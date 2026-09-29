'use client'

import { useState } from 'react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Select } from '@/components/ui/select'
import { Tabs } from '@/components/ui/tabs'
import { DocSnippet } from '@/components/doc-snippet'
import styles from './accordion-page.module.scss'

type Size = 'sm' | 'md' | 'lg'
export type DemoItem = { value: string; title: string; body: string }

// The Code tab prints what is on screen, so it is generated from the same
// props and the same items the preview renders. A snippet typed beside a demo
// is a second copy that can disagree with it.
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
 * The live preview: a Preview / Code pair and the one control the kit puts on
 * the pane, Size. The kit's pane also has a Light toggle; the site's own theme
 * switch is in the header and already repaints this, so a second one here
 * would be two controls for one thing.
 */
export function LivePreview({ items }: { items: DemoItem[] }) {
  const [size, setSize] = useState<Size>('md')

  return (
    <div className={styles.live}>
      <div className={styles.controls}>
        <Select
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
      </div>
      <Tabs
        tabs={[
          {
            id: 'preview',
            label: 'Preview',
            panel: (
              <div className={styles.previewSurface}>
                <div className={styles.previewInner}>
                  <Accordion
                    type="single"
                    collapsible
                    size={size}
                    defaultValue={items[0].value}
                  >
                    {items.map((i) => (
                      <AccordionItem key={i.value} value={i.value} title={i.title}>
                        {i.body}
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ),
          },
          {
            id: 'code',
            label: 'Code',
            panel: <DocSnippet code={codeFor(size, items)} />,
          },
        ]}
      />
    </div>
  )
}
