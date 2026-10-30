import type { Example } from '../example-file'

// Popover's Code tab: the trigger, the panel's state and the ThemeOptions
// child the preview renders, as one file. Overlay's Code tab reuses the child.

export const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const
export type Placement = (typeof PLACEMENTS)[number]
export const ALIGNS = ['start', 'center', 'end'] as const
export type Align = (typeof ALIGNS)[number]
export const VARIANTS = ['default', 'tab-tip'] as const
export type Variant = (typeof VARIANTS)[number]

export const TRIGGER = 'Filter themes'

export type Themes = { light: boolean; dark: boolean }

/** The panel's content, a component of its own, as the preview has it. */
export const THEME_OPTIONS = `type Themes = { light: boolean; dark: boolean }

function ThemeOptions({ value, onChange }: { value: Themes; onChange: (next: Themes) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--graphite-space-03)' }}>
      <Checkbox label="Light" checked={value.light} onChange={(light) => onChange({ ...value, light })} />
      <Checkbox label="Dark" checked={value.dark} onChange={(dark) => onChange({ ...value, dark })} />
    </div>
  )
}`

export const THEMES_STATE = 'const [themes, setThemes] = useState<Themes>({ light: true, dark: false })'

export const controls = { placement: PLACEMENTS, align: ALIGNS, variant: VARIANTS, modal: [false, true] }

type Values = { placement: Placement; align: Align; variant: Variant; modal: boolean }

export function exampleFor({ placement, align, variant, modal }: Values): Example {
  const tabTip = variant === 'tab-tip'
  const props = [
    ...(tabTip ? ['  variant="tab-tip"'] : placement === 'bottom' ? [] : [`  placement="${placement}"`]),
    ...(align === 'center' ? [] : [`  align="${align}"`]),
    ...(modal ? ['  modal', '  label="Theme filter"'] : []),
    tabTip
      ? `  trigger={(props) => (
    <Button {...props} variant="ghost" size="icon-lg" aria-label="${TRIGGER}">
      <KitIcon name="settings" />
    </Button>
  )}`
      : `  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}`,
  ]
  return {
    imports: {
      react: ['useState'],
      '@/components/ui/button': ['Button'],
      '@/components/ui/checkbox': ['Checkbox'],
      '@/components/ui/popover': ['Popover'],
      ...(tabTip ? { '@/components/kit-icon': ['KitIcon'] } : {}),
    },
    module: THEME_OPTIONS,
    body: THEMES_STATE,
    jsx: `<Popover\n${props.join('\n')}\n>\n  <ThemeOptions value={themes} onChange={setThemes} />\n</Popover>`,
  }
}
