import type { FieldSize } from '@/components/ui/text-input'
import type { Example } from '../example-file'

// Date picker's Code tab, from Set, Layout, Size and State.

export const MODES = ['simple', 'single', 'range'] as const
export type Mode = (typeof MODES)[number]
export const LAYOUTS = ['fixed', 'fluid'] as const
export type Layout = (typeof LAYOUTS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly FieldSize[]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const ERROR = 'Enter a date in mm/dd/yyyy'
export const WARNING = 'This date falls on a weekend'

export const controls = { mode: MODES, layout: LAYOUTS, size: SIZES, status: STATUSES }

type Values = { mode: Mode; layout: Layout; size: FieldSize; status: Status }

export function exampleFor({ mode, layout, size, status }: Values): Example {
  const props = [
    mode === 'single' ? '' : `\n  mode="${mode}"`,
    layout === 'fixed' ? '' : '\n  layout="fluid"',
    // A fluid field fills its container, so it takes no size.
    layout === 'fluid' || size === 'lg' ? '' : `\n  size="${size}"`,
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  const state =
    mode === 'range' ? 'useState<[Date | null, Date | null]>([null, null])' : 'useState<Date | null>(null)'
  const label =
    mode === 'range' ? 'Start date"\n  endLabel="End date' : mode === 'simple' ? 'Date (mm/dd/yyyy)' : 'Date'
  return {
    imports: { react: ['useState'], '@/components/ui/date-picker': ['DatePicker'] },
    body: `const [value, setValue] = ${state}`,
    jsx: `<DatePicker${props}\n  label="${label}"\n  value={value}\n  onChange={setValue}\n/>`,
  }
}
