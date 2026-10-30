import type { FieldLayout, FieldSize } from '@/components/ui/text-input'
import type { Example } from '../example-file'

// Password input's Code tab: the field and the state it writes to.

export const LAYOUTS = ['fixed', 'inline', 'fluid'] as const satisfies readonly FieldLayout[]
export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly FieldSize[]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const ERROR = 'Use at least 12 characters'
export const WARNING = 'Caps Lock is on'

export const controls = { layout: LAYOUTS, size: SIZES, status: STATUSES }

type Values = { layout: FieldLayout; size: FieldSize; status: Status }

export function exampleFor({ layout, size, status }: Values): Example {
  const props = [
    '  label="Password"',
    ...(layout === 'fixed' ? [] : [`  layout="${layout}"`]),
    ...(layout === 'fluid' || size === 'md' ? [] : [`  size="${size}"`]),
    '  helpText="At least 12 characters"',
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
    ...(status === 'warning' ? [`  warningText="${WARNING}"`] : []),
    ...(status === 'disabled' ? ['  disabled'] : []),
    ...(status === 'read-only' ? ['  readOnly'] : []),
    '  value={value}',
    '  onChange={(e) => setValue(e.target.value)}',
  ]
  return {
    imports: { react: ['useState'], '@/components/ui/password-input': ['PasswordInput'] },
    body: "const [value, setValue] = useState('')",
    jsx: `<PasswordInput\n${props.join('\n')}\n/>`,
  }
}
