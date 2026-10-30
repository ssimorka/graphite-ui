import type { Example } from '../example-file'

// Checkbox group's Code tab, from Horizontal and State.

export const ORIENTATIONS = ['vertical', 'horizontal'] as const
export type Orientation = (typeof ORIENTATIONS)[number]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'push', label: 'Push notification' },
]

export const ERROR = 'Choose at least one way to reach you'
export const WARNING = 'Text messages may cost extra'

export const controls = { orientation: ORIENTATIONS, status: STATUSES }

export function exampleFor({ orientation, status }: { orientation: Orientation; status: Status }): Example {
  const props = [
    orientation === 'vertical' ? '' : '\n  orientation="horizontal"',
    status === 'error' ? `\n  errorText="${ERROR}"` : '',
    status === 'warning' ? `\n  warningText="${WARNING}"` : '',
    status === 'disabled' ? '\n  disabled' : '',
    status === 'read-only' ? '\n  readOnly' : '',
  ].join('')
  const options = OPTIONS.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n')
  return {
    imports: { react: ['useState'], '@/components/ui/checkbox-group': ['CheckboxGroup'] },
    body: "const [value, setValue] = useState<string[]>(['email'])",
    jsx: `<CheckboxGroup\n  label="Notify me by"\n  options={[\n${options}\n  ]}${props}\n  value={value}\n  onChange={setValue}\n/>`,
  }
}
