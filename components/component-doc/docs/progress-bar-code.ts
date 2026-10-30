import type { Example } from '../example-file'

// Progress bar's Code tab. Nothing to hold: the caller passes the progress in.

export const VARIANTS = ['determinate', 'indeterminate'] as const
export type Variant = (typeof VARIANTS)[number]
export const VALUES = [0, 25, 50, 75, 100] as const
export const STATUSES = ['active', 'success', 'error'] as const
export type Status = (typeof STATUSES)[number]
export const SIZES = ['sm', 'lg'] as const
export type Size = (typeof SIZES)[number]
export const ALIGNMENTS = ['default', 'inline', 'indent'] as const
export type Alignment = (typeof ALIGNMENTS)[number]

export const TASK = 'Uploading report.pdf'
export const HELP = 'About a minute left'
export const SUCCESS = 'Upload complete'
export const ERROR = 'The upload failed. Try again.'

export const controls = { variant: VARIANTS, value: VALUES, status: STATUSES, size: SIZES, alignment: ALIGNMENTS }

type Values = { variant: Variant; value: number; status: Status; size: Size; alignment: Alignment }

export function exampleFor({ variant, value, status, size, alignment }: Values): Example {
  const props = [
    `  label="${TASK}"`,
    ...(status === 'active'
      ? variant === 'determinate'
        ? [`  value={${value}}`]
        : ['  variant="indeterminate"']
      : [`  status="${status}"`]),
    ...(size === 'sm' ? [] : [`  size="${size}"`]),
    ...(alignment === 'default' ? [] : [`  alignment="${alignment}"`]),
    ...(alignment === 'inline' ? [] : [`  helperText="${HELP}"`]),
    ...(status === 'success' ? [`  successText="${SUCCESS}"`] : []),
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
  ]
  return {
    imports: { '@/components/ui/progress-bar': ['ProgressBar'] },
    jsx: `<ProgressBar\n${props.join('\n')}\n/>`,
  }
}
