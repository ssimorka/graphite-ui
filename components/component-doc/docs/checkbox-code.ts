import type { Example } from '../example-file'

// Checkbox's Code tab, from Selection and State. The box owns its checked
// state, as the preview's does.

export const SELECTIONS = ['unchecked', 'checked', 'indeterminate'] as const
export type Selection = (typeof SELECTIONS)[number]
export const STATES = ['enabled', 'disabled', 'read-only', 'warning', 'error'] as const
export type State = (typeof STATES)[number]

export const LABEL = 'Save as default address'
export const ERROR = 'Choose whether to keep this address.'
export const WARNING = 'This address has not been confirmed.'

export const controls = { selection: SELECTIONS, state: STATES }

export function exampleFor({ selection, state }: { selection: Selection; state: State }): Example {
  const lines = [`  label="${LABEL}"`, '  checked={checked}']
  if (selection === 'indeterminate') lines.push('  indeterminate')
  if (state === 'disabled') lines.push('  disabled')
  if (state === 'read-only') lines.push('  readOnly')
  if (state === 'warning') lines.push(`  warningText="${WARNING}"`)
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  lines.push('  onChange={setChecked}')
  return {
    imports: { react: ['useState'], '@/components/ui/checkbox': ['Checkbox'] },
    body: `const [checked, setChecked] = useState(${selection === 'checked'})`,
    jsx: `<Checkbox\n${lines.join('\n')}\n/>`,
  }
}
