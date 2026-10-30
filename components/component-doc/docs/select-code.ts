import type { SelectOption } from '@/components/ui/select'
import type { Example } from '../example-file'

// Select's Code tab. The value is state, so the file reads like the preview.

export const SIZES = ['sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]
export const STATES = ['default', 'disabled', 'error'] as const
export type State = (typeof STATES)[number]

export const OPTIONS: [SelectOption, SelectOption, ...SelectOption[]] = [
  { value: 'eu', label: 'Europe' },
  { value: 'na', label: 'North America' },
  { value: 'sa', label: 'South America' },
  { value: 'apac', label: 'Asia Pacific' },
]
export const HELP = 'Where your data is stored.'
export const ERROR = 'This region is full. Choose another.'

export const controls = { size: SIZES, state: STATES, value: ['eu', 'apac'] }

export function exampleFor({ size, state, value }: { size: Size; state: State; value: string }): Example {
  const options = OPTIONS.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n')
  const lines = ['  label="Region"', `  options={[\n${options}\n  ]}`, '  value={region}']
  if (size !== 'md') lines.push(`  size="${size}"`)
  if (state !== 'default') lines.push(`  state="${state}"`)
  lines.push(state === 'error' ? `  errorText="${ERROR}"` : `  helpText="${HELP}"`)
  lines.push('  onChange={setRegion}')
  return {
    imports: { react: ['useState'], '@/components/ui/select': ['Select'] },
    body: `const [region, setRegion] = useState('${value}')`,
    jsx: `<Select\n${lines.join('\n')}\n/>`,
  }
}
