import type { Example } from '../example-file'

// Slider's Code tab, single or range, with the status the preview shows.

export const KINDS = ['single', 'range'] as const
export type Kind = (typeof KINDS)[number]
export const STATUSES = ['enabled', 'error', 'warning', 'disabled', 'read-only'] as const
export type Status = (typeof STATUSES)[number]

export const ERROR = 'Enter a value from 0 to 100'
export const WARNING = 'Values above 80 may slow the preview'

export const controls = { kind: KINDS, inputs: [true, false], status: STATUSES }

export function exampleFor({ kind, inputs, status }: { kind: Kind; inputs: boolean; status: Status }): Example {
  const state = kind === 'range' ? 'useState<[number, number]>([20, 60])' : 'useState(40)'
  const props = [
    `  label="${kind === 'range' ? 'Price range' : 'Opacity'}"`,
    '  value={value}',
    '  onChange={setValue}',
    ...(!inputs ? ['  showInputs={false}'] : []),
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
    ...(status === 'warning' ? [`  warningText="${WARNING}"`] : []),
    ...(status === 'disabled' ? ['  disabled'] : []),
    ...(status === 'read-only' ? ['  readOnly'] : []),
  ]
  return {
    imports: { react: ['useState'], '@/components/ui/slider': ['Slider'] },
    body: `const [value, setValue] = ${state}`,
    jsx: `<Slider\n${props.join('\n')}\n/>`,
  }
}
