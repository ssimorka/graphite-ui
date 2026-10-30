import type { Example } from '../example-file'

// Menu's Code tab: the trigger, the items and their handlers, as one file.

export const PLACEMENTS = ['bottom', 'top'] as const
export type Placement = (typeof PLACEMENTS)[number]
export const SIZES = ['lg', 'md', 'sm', 'xs'] as const
export type Size = (typeof SIZES)[number]
export const FNS = ['simple', 'complex'] as const
export type Fn = (typeof FNS)[number]

export const TRIGGER = 'Theme actions'

export const controls = { placement: PLACEMENTS, size: SIZES, fn: FNS }

export function exampleFor({ placement, size, fn }: { placement: Placement; size: Size; fn: Fn }): Example {
  const props = [
    ...(placement === 'bottom' ? [] : [`  placement="${placement}"`]),
    ...(size === 'md' ? [] : [`  size="${size}"`]),
  ]
  const items =
    fn === 'complex'
      ? [
          "{ label: 'Rename', onSelect: rename, shortcut: 'R' },",
          "{ label: 'Duplicate', onSelect: duplicate, shortcut: 'D' },",
          "{ label: 'Pinned', onSelect: () => setPinned((p) => !p), selected: pinned },",
          "{ kind: 'separator' },",
          "{ label: 'Delete', onSelect: remove, destructive: true },",
        ]
      : [
          "{ label: 'Rename', onSelect: rename },",
          "{ label: 'Duplicate', onSelect: duplicate },",
          "{ label: 'Export', onSelect: exportTheme, disabled: true },",
          "{ kind: 'separator' },",
          "{ label: 'Delete', onSelect: remove, destructive: true },",
        ]
  const stubs = [
    'function rename() {\n  // Rename the theme.\n}',
    'function duplicate() {\n  // Duplicate the theme.\n}',
    ...(fn === 'simple' ? ['function exportTheme() {\n  // Export the theme.\n}'] : []),
    'function remove() {\n  // Delete the theme.\n}',
  ]
  return {
    imports: {
      ...(fn === 'complex' ? { react: ['useState'] } : {}),
      '@/components/ui/button': ['Button'],
      '@/components/ui/menu': ['Menu'],
    },
    module: stubs.join('\n\n'),
    body: fn === 'complex' ? 'const [pinned, setPinned] = useState(true)' : undefined,
    jsx: `<Menu
${props.join('\n')}${props.length ? '\n' : ''}  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}
  items={[
${items.map((i) => '    ' + i).join('\n')}
  ]}
/>`,
  }
}
