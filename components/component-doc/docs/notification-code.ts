import type { Example } from '../example-file'

// Notification's Code tab: the message for the chosen status, with its close
// state and action handler declared.

export const VARIANTS = ['info', 'danger', 'warning', 'success'] as const
export type Variant = (typeof VARIANTS)[number]
export const KINDS = ['inline', 'callout'] as const
export type Kind = (typeof KINDS)[number]
export type DemoMessage = { title: string; body: string }

export const ACTION = 'View details'

export const MESSAGES: Record<Variant, DemoMessage> = {
  info: {
    title: 'Contract updated',
    body: 'Tabs moved to a new minor version. Nothing in your code needs to change.',
  },
  success: {
    title: 'Snapshot matches',
    body: 'Every component page agrees with the kit snapshot.',
  },
  warning: {
    title: 'Snapshot may be stale',
    body: 'Re-extract it from Figma before trusting a drift result.',
  },
  danger: {
    title: 'Drift check failed',
    body: 'Two component pages name a set the kit no longer has.',
  },
}

export const controls = {
  variant: VARIANTS,
  kind: KINDS,
  highContrast: [false, true],
  actionable: [false, true],
  close: [true, false],
}

type Values = { variant: Variant; kind: Kind; highContrast: boolean; actionable: boolean; close: boolean }

export function exampleFor({ variant, kind, highContrast, actionable, close }: Values): Example {
  const m = MESSAGES[variant]
  // A callout has no action and no close control, so neither prints.
  const action = actionable && kind === 'inline'
  const closable = close && kind === 'inline'
  const props = [
    ...(variant === 'info' ? [] : [`  variant="${variant}"`]),
    ...(kind === 'inline' ? [] : ['  kind="callout"']),
    ...(highContrast ? ['  highContrast'] : []),
    `  title="${m.title}"`,
    `  body="${m.body}"`,
    ...(action ? [`  action={{ label: '${ACTION}', onClick: openDetails }}`] : []),
    ...(closable ? ['  onClose={() => setOpen(false)}'] : []),
  ]
  const notification = `<Notification\n${props.join('\n')}\n/>`
  return {
    imports: {
      ...(closable ? { react: ['useState'] } : {}),
      '@/components/ui/notification': ['Notification'],
    },
    module: action ? 'function openDetails() {\n  // Show the details.\n}' : undefined,
    body: closable ? 'const [open, setOpen] = useState(true)' : undefined,
    jsx: closable ? `open && (\n${notification.replace(/^/gm, '  ')}\n)` : notification,
  }
}
