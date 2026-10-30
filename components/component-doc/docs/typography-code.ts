import type { Example } from '../example-file'

// Typography's Code tab: variant and weight, defaults left off.

export const VARIANTS = ['display', 'heading-1', 'heading-2', 'heading-3', 'heading-4', 'body', 'caption'] as const
export type Variant = (typeof VARIANTS)[number]
export const WEIGHTS = ['regular', 'medium', 'semibold'] as const
export type Weight = (typeof WEIGHTS)[number]

export const TEXT = 'One source color becomes every ramp and role.'

export const controls = { variant: VARIANTS, weight: WEIGHTS }

export function exampleFor({ variant, weight }: { variant: Variant; weight: Weight }): Example {
  const variantProp = variant === 'body' ? '' : ` variant="${variant}"`
  const weightProp = weight === 'regular' ? '' : ` weight="${weight}"`
  return {
    imports: { '@/components/ui/typography': ['Typography'] },
    jsx: `<Typography${variantProp}${weightProp}>\n  ${TEXT}\n</Typography>`,
  }
}
