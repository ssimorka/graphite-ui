'use client'

import { useState } from 'react'
import { Link } from '@/components/ui/link'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './link.module.scss'

type Size = 'sm' | 'md' | 'lg'
type Kind = 'standalone' | 'icon' | 'inline'

function codeFor(kind: Kind, size: Size, inverse: boolean, disabled: boolean) {
  const props = [
    size === 'lg' || kind === 'inline' ? '' : ` size="${size}"`,
    kind === 'icon' ? ' icon="arrow-right"' : '',
    kind === 'inline' ? ' inline' : '',
    inverse ? ' inverse' : '',
    disabled ? ' disabled' : '',
  ].join('')
  const link = `<Link href="/docs/components"${props}>\n  ${kind === 'inline' ? 'every component' : 'View all components'}\n</Link>`
  return kind === 'inline' ? `<p>\n  Read about ${link.replace(/\n/g, '\n  ')} in the gallery.\n</p>` : link
}

/** Standalone, with its glyph, or inline; Size, Inverse and Disabled, all live. */
export function LinkPreview() {
  const [kind, setKind] = useState<Kind>('icon')
  const [size, setSize] = useState<Size>('lg')
  const [inverse, setInverse] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const link = (
    <Link
      href="/docs/components"
      size={size}
      inline={kind === 'inline'}
      icon={kind === 'icon' ? 'arrow-right' : undefined}
      inverse={inverse}
      disabled={disabled}
    >
      {kind === 'inline' ? 'every component' : 'View all components'}
    </Link>
  )

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Style"
            size="sm"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            options={[
              { value: 'icon', label: 'Standalone, with icon' },
              { value: 'standalone', label: 'Standalone' },
              { value: 'inline', label: 'Inline' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Dropdown
            label="Inverse"
            size="sm"
            value={inverse ? 'true' : 'false'}
            onChange={(v) => setInverse(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
          <Dropdown
            label="Disabled"
            size="sm"
            value={disabled ? 'true' : 'false'}
            onChange={(v) => setDisabled(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
          />
        </>
      }
      preview={
        <div className={inverse ? styles.inverseFill : undefined}>
          {kind === 'inline' ? (
            <p className={size === 'lg' ? styles.copyLg : size === 'md' ? styles.copyMd : styles.copySm}>
              Read about {link} in the gallery.
            </p>
          ) : (
            link
          )}
        </div>
      }
      code={codeFor(kind, size, inverse, disabled)}
    />
  )
}
