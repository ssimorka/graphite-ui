import type { Example } from '../example-file'

// Accordion's Code tab. The items arrive from the page (one body counts the
// governed components at build time), so the check builds from a sample list
// of the same shape.

export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]
export type DemoItem = { value: string; title: string; body: string }

const SAMPLE: DemoItem[] = [
  { value: 'ready', title: 'Is Graphite UI production ready?', body: 'Every component carries a versioned contract.' },
  { value: 'carbon', title: 'Does it require Carbon?', body: 'Not for the components.' },
  { value: 'theming', title: 'How does theming work?', body: 'One source color becomes the ramps and the roles.' },
]

export const controls = { size: SIZES, items: [SAMPLE] }

export function exampleFor({ size, items }: { size: Size; items: DemoItem[] }): Example {
  const sizeProp = size === 'md' ? '' : ` size="${size}"`
  const body = items
    .map((i) => `  <AccordionItem value="${i.value}" title="${i.title}">\n    ${i.body}\n  </AccordionItem>`)
    .join('\n')
  return {
    imports: { '@/components/ui/accordion': ['Accordion', 'AccordionItem'] },
    jsx: `<Accordion type="single" collapsible${sizeProp} defaultValue="${items[0].value}">\n${body}\n</Accordion>`,
  }
}
