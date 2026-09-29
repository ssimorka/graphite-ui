'use client'

import { useState } from 'react'
import { CheckmarkFilled, ErrorFilled, InformationFilled, WarningFilled } from '@carbon/icons-react'
import { Notification } from '@/components/ui/notification'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

export type Variant = 'info' | 'danger' | 'warning' | 'success'
export type DemoMessage = { title: string; body: string }

const ICONS = {
  info: { name: 'InformationFilled', node: <InformationFilled size={20} /> },
  danger: { name: 'ErrorFilled', node: <ErrorFilled size={20} /> },
  warning: { name: 'WarningFilled', node: <WarningFilled size={20} /> },
  success: { name: 'CheckmarkFilled', node: <CheckmarkFilled size={20} /> },
}

function codeFor(variant: Variant, icon: boolean, m: DemoMessage) {
  const variantProp = variant === 'info' ? '' : `\n  variant="${variant}"`
  const iconProp = icon ? `\n  icon={<${ICONS[variant].name} size={20} />}` : ''
  const importLine = icon
    ? `import { ${ICONS[variant].name} } from '@carbon/icons-react'\n\n`
    : ''
  return `${importLine}<Notification${variantProp}${iconProp}\n  title="${m.title}"\n  body="${m.body}"\n/>`
}

/**
 * Variant is the contract's one prop. The icon slot is optional, so it gets a
 * control too; the message changes with the variant, because a warning and a
 * success should never share copy.
 */
export function NotificationPreview({ messages }: { messages: Record<Variant, DemoMessage> }) {
  const [variant, setVariant] = useState<Variant>('info')
  const [icon, setIcon] = useState(true)
  const m = messages[variant]

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={[
              { value: 'info', label: 'Info' },
              { value: 'success', label: 'Success' },
              { value: 'warning', label: 'Warning' },
              { value: 'danger', label: 'Danger' },
            ]}
          />
          <Select
            label="Icon"
            size="sm"
            value={icon ? 'true' : 'false'}
            onChange={(v) => setIcon(v === 'true')}
            options={[
              { value: 'true', label: 'Shown' },
              { value: 'false', label: 'Hidden' },
            ]}
          />
        </>
      }
      preview={
        <Notification
          variant={variant}
          icon={icon ? ICONS[variant].node : undefined}
          title={m.title}
          body={m.body}
        />
      }
      code={codeFor(variant, icon, m)}
    />
  )
}
