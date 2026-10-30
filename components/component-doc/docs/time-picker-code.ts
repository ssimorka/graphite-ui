import type { SelectOption } from '@/components/ui/select'
import type { FieldSize } from '@/components/ui/text-input'
import type { Example } from '../example-file'

// Time picker's Code tab: the value is state, and the time zones, when shown,
// are a list declared beside the component.

export const LAYOUTS = ['fixed', 'fluid'] as const
export type Layout = (typeof LAYOUTS)[number]
export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly FieldSize[]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const TIMEZONES: [SelectOption, SelectOption, ...SelectOption[]] = [
  { value: 'ET', label: 'Eastern time (ET)' },
  { value: 'CT', label: 'Central time (CT)' },
  { value: 'MT', label: 'Mountain time (MT)' },
  { value: 'PT', label: 'Pacific time (PT)' },
]

export const ERROR = 'Enter a time as hh:mm'
export const WARNING = 'This is outside office hours'

export const controls = { layout: LAYOUTS, size: SIZES, zones: [true, false], status: STATUSES }

type Values = { layout: Layout; size: FieldSize; zones: boolean; status: Status }

export function exampleFor({ layout, size, zones, status }: Values): Example {
  const props = [
    ...(layout === 'fixed' ? [] : ['  layout="fluid"']),
    ...(layout === 'fluid' || size === 'lg' ? [] : [`  size="${size}"`]),
    ...(zones ? ['  timezones={TIMEZONES}'] : []),
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
    ...(status === 'warning' ? [`  warningText="${WARNING}"`] : []),
    ...(status === 'disabled' ? ['  disabled'] : []),
    ...(status === 'read-only' ? ['  readOnly'] : []),
  ]
  const zonesList = TIMEZONES.map((z) => `  { value: '${z.value}', label: '${z.label}' },`).join('\n')
  return {
    imports: {
      react: ['useState'],
      '@/components/ui/time-picker': ['TimePicker', 'type TimeValue'],
      ...(zones ? { '@/components/ui/select': ['type SelectOption'] } : {}),
    },
    module: zones ? `const TIMEZONES: [SelectOption, SelectOption, ...SelectOption[]] = [\n${zonesList}\n]` : undefined,
    body: `const [value, setValue] = useState<TimeValue>({ time: '', period: 'AM'${zones ? ", timezone: 'ET'" : ''} })`,
    jsx: `<TimePicker\n  label="Choose a time"\n${props.length ? props.join('\n') + '\n' : ''}  value={value}\n  onChange={setValue}\n/>`,
  }
}
