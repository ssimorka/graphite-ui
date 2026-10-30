import type { Example } from '../example-file'
import { THEME_OPTIONS, THEMES_STATE } from './popover-code'

// Overlay's Code tab. Overlay has no surface of its own, so the example is
// the Popover the preview shows it through, with the trap as its one switch.

export const TRIGGER = 'Open panel'

export const controls = { trap: [false, true] }

export function exampleFor({ trap }: { trap: boolean }): Example {
  const props = [
    ...(trap ? ['  modal', '  label="Theme filter"'] : []),
    `  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}`,
  ]
  return {
    imports: {
      react: ['useState'],
      '@/components/ui/button': ['Button'],
      '@/components/ui/checkbox': ['Checkbox'],
      '@/components/ui/popover': ['Popover'],
    },
    module: THEME_OPTIONS,
    body: `${THEMES_STATE}\n\n// Popover calls useOverlay({ open, onDismiss, trapFocus: ${trap} }).`,
    jsx: `<Popover\n${props.join('\n')}\n>\n  <ThemeOptions value={themes} onChange={setThemes} />\n</Popover>`,
  }
}
