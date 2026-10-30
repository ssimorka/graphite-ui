import type { Example } from '../example-file'

// Tooltip's Code tab, with the trigger each Type is drawn on in the kit.

export const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const
export type Placement = (typeof PLACEMENTS)[number]
export const ALIGNS = ['start', 'center', 'end'] as const
export type Align = (typeof ALIGNS)[number]
export const TYPES = ['standard', 'icon', 'definition'] as const
export type Type = (typeof TYPES)[number]
export const DELAYS = [0, 150, 500] as const

export const LABEL = 'Copy'
export const CONTENT = 'Copies the hex value to the clipboard'
export const TERM = 'Source color'
export const DEFINITION = 'The one hex every role is derived from'

export const controls = { placement: PLACEMENTS, align: ALIGNS, type: TYPES, delay: DELAYS }

type Values = { placement: Placement; align: Align; type: Type; delay: number }

export function exampleFor({ placement, align, type, delay }: Values): Example {
  const props = [
    `content="${type === 'definition' ? DEFINITION : CONTENT}"`,
    ...(type === 'standard' ? [] : [`type="${type}"`]),
    ...(placement === 'top' ? [] : [`placement="${placement}"`]),
    ...(align === 'center' ? [] : [`align="${align}"`]),
    ...(delay === 500 ? [] : [`delay={${delay}}`]),
  ]
  const child =
    type === 'definition'
      ? TERM
      : type === 'icon'
        ? `<Button variant="ghost" size="icon-sm" aria-label="${LABEL}">\n    <KitIcon name="copy" />\n  </Button>`
        : `<Button>${LABEL}</Button>`
  return {
    imports: {
      ...(type === 'definition' ? {} : { '@/components/ui/button': ['Button'] }),
      ...(type === 'icon' ? { '@/components/kit-icon': ['KitIcon'] } : {}),
      '@/components/ui/tooltip': ['Tooltip'],
    },
    jsx: `<Tooltip\n  ${props.join('\n  ')}\n>\n  ${child}\n</Tooltip>`,
  }
}
