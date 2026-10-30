import type { RadioOption } from '@/components/ui/radio-button-group'
import type { Example } from '../example-file'

// Radio button group's Code tab: the group and the value it controls.

export const ORIENTATIONS = ['vertical', 'horizontal'] as const
export type Orientation = (typeof ORIENTATIONS)[number]
export const STATES = ['enabled', 'disabled', 'error'] as const
export type State = (typeof STATES)[number]

export const OPTIONS: RadioOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
]
export const ERROR = 'Overnight is not available for this address.'

export const controls = {
  orientation: ORIENTATIONS,
  state: STATES,
  // Runtime state: the option the reader last picked.
  value: OPTIONS.map((o) => o.value),
}

type Values = { orientation: Orientation; state: State; value: string }

export function exampleFor({ orientation, state, value }: Values): Example {
  const options = OPTIONS.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n')
  const lines = [
    '  name="shipping"',
    '  label="Shipping speed"',
    `  options={[\n${options}\n  ]}`,
    '  value={speed}',
  ]
  if (orientation === 'horizontal') lines.push('  orientation="horizontal"')
  if (state === 'disabled') lines.push('  disabled')
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  lines.push('  onChange={setSpeed}')
  return {
    imports: { react: ['useState'], '@/components/ui/radio-button-group': ['RadioButtonGroup'] },
    body: `const [speed, setSpeed] = useState('${value}')`,
    jsx: `<RadioButtonGroup\n${lines.join('\n')}\n/>`,
  }
}
