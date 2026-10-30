import type { Example } from '../example-file'

// Text area's Code tab: uncontrolled, as the preview is.

export const LAYOUTS = ['fixed', 'fluid'] as const
export type Layout = (typeof LAYOUTS)[number]
export const RESIZES = ['vertical', 'none'] as const
export type Resize = (typeof RESIZES)[number]
export const STATES = ['default', 'disabled', 'error', 'warning'] as const
export type DemoState = (typeof STATES)[number]

export const LABEL = 'What went wrong?'
export const HELP = 'Steps to reproduce help us most.'
export const ERROR = 'Tell us a little about what happened.'
export const WARNING = 'Avoid pasting passwords or keys.'

export const controls = { layout: LAYOUTS, resize: RESIZES, state: STATES }

export function exampleFor({ layout, resize, state }: { layout: Layout; resize: Resize; state: DemoState }): Example {
  const lines = [`  label="${LABEL}"`]
  if (layout !== 'fixed') lines.push(`  layout="${layout}"`)
  lines.push('  maxLength={300}')
  if (resize !== 'vertical') lines.push(`  resize="${resize}"`)
  if (state === 'disabled') lines.push('  state="disabled"')
  lines.push(`  helpText="${HELP}"`)
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  if (state === 'warning') lines.push(`  warningText="${WARNING}"`)
  return {
    imports: { '@/components/ui/text-area': ['TextArea'] },
    jsx: `<TextArea\n${lines.join('\n')}\n/>`,
  }
}
