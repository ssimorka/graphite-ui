import type { FieldSize } from '@/components/ui/text-input'
import type { Example } from '../example-file'

// Text input's Code tab: uncontrolled, as the preview is.

export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly FieldSize[]
export const STATES = ['default', 'disabled', 'error', 'invalid'] as const
export type DemoState = (typeof STATES)[number]

export const LABEL = 'Email address'
export const HELP = 'We only use it to send the receipt.'
export const ERROR = 'Enter an email address with an @ in it.'

export const controls = { size: SIZES, state: STATES }

export function exampleFor({ size, state }: { size: FieldSize; state: DemoState }): Example {
  const lines = [`  label="${LABEL}"`, '  type="email"']
  if (size !== 'md') lines.push(`  size="${size}"`)
  if (state === 'disabled' || state === 'invalid') lines.push(`  state="${state}"`)
  lines.push(`  helpText="${HELP}"`)
  // Error is shown the way the component wants it shown: by passing the
  // message, which resolves the state. state="error" alone is not the idiom.
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  return {
    imports: { '@/components/ui/text-input': ['TextInput'] },
    jsx: `<TextInput\n${lines.join('\n')}\n/>`,
  }
}
