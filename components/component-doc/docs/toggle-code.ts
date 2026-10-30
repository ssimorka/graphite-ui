import type { Example } from '../example-file'

// Toggle's Code tab. On or off is state, so flipping the preview's switch
// changes the file's starting value.

export const STATES = ['enabled', 'disabled', 'read-only'] as const
export type State = (typeof STATES)[number]
export const SIZES = ['default', 'sm'] as const
export type Size = (typeof SIZES)[number]
export const MESSAGES = ['none', 'help', 'error'] as const
export type Message = (typeof MESSAGES)[number]

export const LABEL = 'Email notifications'
export const HELP = 'A summary of new comments, once a day.'
export const ERROR = 'Add an email address to turn this on.'

export const controls = { checked: [true, false], state: STATES, message: MESSAGES, size: SIZES, only: [false, true] }

type Values = { checked: boolean; state: State; message: Message; size: Size; only: boolean }

export function exampleFor({ checked, state, message, size, only }: Values): Example {
  const lines = [`  label="${LABEL}"`, '  checked={notify}']
  if (size === 'sm') lines.push('  size="sm"')
  if (only) lines.push('  hideLabel')
  if (state === 'disabled') lines.push('  disabled')
  if (state === 'read-only') lines.push('  readOnly')
  if (message === 'help') lines.push(`  helpText="${HELP}"`)
  if (message === 'error') lines.push(`  errorText="${ERROR}"`)
  lines.push('  onChange={setNotify}')
  return {
    imports: { react: ['useState'], '@/components/ui/toggle': ['Toggle'] },
    body: `const [notify, setNotify] = useState(${checked})`,
    jsx: `<Toggle\n${lines.join('\n')}\n/>`,
  }
}
