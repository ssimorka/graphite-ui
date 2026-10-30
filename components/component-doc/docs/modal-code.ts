import type { Example } from '../example-file'

// Modal's Code tab: the trigger, the open state and the Modal, as one file.

export const SIZES = ['xs', 'sm', 'md', 'lg'] as const
export type Size = (typeof SIZES)[number]
export const ACTIONS = [1, 2, 3, 'cancel'] as const
export type Actions = (typeof ACTIONS)[number]

export const TITLE = 'Publish this theme?'
export const LABEL = 'Library'
export const BODY = 'Everyone on the library gets the new tokens on their next sync.'

export const controls = {
  size: SIZES,
  dismissible: [true, false],
  label: [true, false],
  actions: ACTIONS,
  loading: [false, true],
}

type Values = { size: Size; dismissible: boolean; label: boolean; actions: Actions; loading: boolean }

export function exampleFor({ size, dismissible, label, actions, loading }: Values): Example {
  const lines: Record<string, string> = {
    cancel: '    <Button key="cancel" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>,',
    back: '    <Button key="back" variant="outlined" onClick={() => setOpen(false)}>Back</Button>,',
    draft: '    <Button key="draft" variant="outlined" onClick={() => setOpen(false)}>Save draft</Button>,',
    publish: '    <Button key="publish" variant="primary" onClick={publish}>Publish</Button>,',
  }
  const keys =
    actions === 1 ? ['publish'] : actions === 2 ? ['back', 'publish'] : actions === 3 ? ['back', 'draft', 'publish'] : ['cancel', 'back', 'publish']
  const props = [
    '  open={open}',
    '  onClose={() => setOpen(false)}',
    ...(label ? [`  label="${LABEL}"`] : []),
    `  title="${TITLE}"`,
    `  body="${BODY}"`,
    ...(size === 'md' ? [] : [`  size="${size}"`]),
    ...(dismissible ? [] : ['  dismissible={false}']),
    ...(loading ? ['  loading="Publishing…"'] : []),
    '  footer={[',
    ...keys.map((k) => lines[k]),
    '  ]}',
  ]
  return {
    imports: {
      react: ['useState'],
      '@/components/ui/button': ['Button'],
      '@/components/ui/modal': ['Modal'],
    },
    body: `const [open, setOpen] = useState(false)\n\nfunction publish() {\n  // Your publish call goes here.\n  setOpen(false)\n}`,
    jsx: `<>\n  <Button onClick={() => setOpen(true)}>Open modal</Button>\n  <Modal\n${props.map((p) => '  ' + p).join('\n')}\n  />\n</>`,
  }
}
