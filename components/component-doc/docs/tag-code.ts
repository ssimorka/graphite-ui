import type { TagSize, TagVariant } from '@/components/ui/tag'
import type { Example } from '../example-file'

// Tag's Code tab. A number is passed as a number, not a string: only a
// number is capped at max.

export const VARIANTS = [
  'neutral', 'primary', 'secondary', 'info', 'success', 'danger', 'warning', 'high-contrast', 'outline',
] as const satisfies readonly TagVariant[]
export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly TagSize[]
export const CONTENTS = ['text', 'count', 'overflow'] as const
export type Content = (typeof CONTENTS)[number]

export const TEXT: Record<TagVariant, string> = {
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

export const value = (variant: TagVariant, content: Content) =>
  content === 'text' ? TEXT[variant] : content === 'count' ? 42 : 128

export const controls = { variant: VARIANTS, content: CONTENTS, size: SIZES }

export function exampleFor({ variant, content, size }: { variant: TagVariant; content: Content; size: TagSize }): Example {
  const variantProp = variant === 'neutral' ? '' : ` variant="${variant}"`
  const sizeProp = size === 'md' ? '' : ` size="${size}"`
  const v = value(variant, content)
  const child = typeof v === 'number' ? `{${v}}` : v
  return {
    imports: { '@/components/ui/tag': ['Tag'] },
    jsx: `<Tag${variantProp}${sizeProp}>${child}</Tag>`,
  }
}
