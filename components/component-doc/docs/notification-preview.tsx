'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Notification } from '@/components/ui/notification'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

export type Variant = 'info' | 'danger' | 'warning' | 'success'
export type DemoMessage = { title: string; body: string }
type Kind = 'inline' | 'callout'

const ACTION = 'View details'

function codeFor(
  variant: Variant,
  kind: Kind,
  highContrast: boolean,
  actionable: boolean,
  close: boolean,
  m: DemoMessage,
) {
  const props = [
    ...(variant === 'info' ? [] : [`  variant="${variant}"`]),
    ...(kind === 'inline' ? [] : ['  kind="callout"']),
    ...(highContrast ? ['  highContrast'] : []),
    `  title="${m.title}"`,
    `  body="${m.body}"`,
    ...(actionable && kind === 'inline' ? [`  action={{ label: '${ACTION}', onClick: openDetails }}`] : []),
    ...(close && kind === 'inline' ? ['  onClose={() => setOpen(false)}'] : []),
  ]
  return `<Notification\n${props.join('\n')}\n/>`
}

/**
 * The kit's axes: Status, its Inline and Callout sets, High contrast and
 * Actionable, plus the optional close. The message changes with the status,
 * because a warning and a success should never share copy. Dismissing the
 * demo leaves a way to bring it back, or the preview would be empty.
 */
export function NotificationPreview({ messages }: { messages: Record<Variant, DemoMessage> }) {
  const [variant, setVariant] = useState<Variant>('info')
  const [kind, setKind] = useState<Kind>('inline')
  const [highContrast, setHighContrast] = useState(false)
  const [actionable, setActionable] = useState(false)
  const [close, setClose] = useState(true)
  const [open, setOpen] = useState(true)
  const m = messages[variant]
  const callout = kind === 'callout'

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Status"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={[
              { value: 'info', label: 'Info' },
              { value: 'success', label: 'Success', disabled: callout },
              { value: 'warning', label: 'Warning' },
              { value: 'danger', label: 'Danger', disabled: callout },
            ]}
          />
          <Select
            label="Set"
            size="sm"
            value={kind}
            onChange={(v) => {
              setKind(v as Kind)
              if (v === 'callout' && (variant === 'success' || variant === 'danger')) setVariant('info')
              setOpen(true)
            }}
            options={[
              { value: 'inline', label: 'Inline' },
              { value: 'callout', label: 'Callout' },
            ]}
          />
          <Select
            label="High contrast"
            size="sm"
            value={highContrast ? 'true' : 'false'}
            onChange={(v) => setHighContrast(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
          <Select
            label="Actionable"
            size="sm"
            value={actionable ? 'true' : 'false'}
            state={callout ? 'disabled' : 'default'}
            onChange={(v) => setActionable(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
          <Select
            label="Close button"
            size="sm"
            value={close ? 'true' : 'false'}
            state={callout ? 'disabled' : 'default'}
            onChange={(v) => {
              setClose(v === 'true')
              setOpen(true)
            }}
            options={[
              { value: 'true', label: 'Shown' },
              { value: 'false', label: 'Hidden' },
            ]}
          />
        </>
      }
      preview={
        open ? (
          <Notification
            variant={variant}
            kind={kind}
            highContrast={highContrast}
            title={m.title}
            body={m.body}
            action={actionable ? { label: ACTION, onClick: () => {} } : undefined}
            onClose={close ? () => setOpen(false) : undefined}
          />
        ) : (
          <Button size="sm" onClick={() => setOpen(true)}>
            Show again
          </Button>
        )
      }
      code={codeFor(variant, kind, highContrast, actionable, close, m)}
    />
  )
}

const noop = () => {}

/**
 * A still for the docs page, which renders on the server and cannot hand the
 * component its handlers. These do nothing; they only make the action and the
 * close control render.
 */
export function NotificationStill({
  variant,
  title,
  body,
  kind,
  highContrast,
  action,
  closable,
}: {
  variant: Variant
  title?: string
  body: string
  kind?: Kind
  highContrast?: boolean
  action?: string
  closable?: boolean
}) {
  return (
    <Notification
      variant={variant}
      kind={kind}
      highContrast={highContrast}
      title={title}
      body={body}
      action={action ? { label: action, onClick: noop } : undefined}
      onClose={closable ? noop : undefined}
    />
  )
}
