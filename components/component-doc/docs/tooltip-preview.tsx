'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { KitIcon } from '@/components/kit-icon'
import { Select } from '@/components/ui/select'
import { Tooltip } from '@/components/ui/tooltip'
import { DemoFrame } from '../demo-frame'
import styles from './tooltip.module.scss'

type Placement = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'
type Type = 'standard' | 'icon' | 'definition'

const LABEL = 'Copy'
const CONTENT = 'Copies the hex value to the clipboard'
const TERM = 'Source color'
const DEFINITION = 'The one hex every role is derived from'

function codeFor(placement: Placement, align: Align, type: Type, delay: number) {
  const props = [
    `content="${type === 'definition' ? DEFINITION : CONTENT}"`,
    ...(type === 'standard' ? [] : [`type="${type}"`]),
    ...(placement === 'top' ? [] : [`placement="${placement}"`]),
    ...(align === 'center' ? [] : [`align="${align}"`]),
    ...(delay === 150 ? [] : [`delay={${delay}}`]),
  ]
  const child =
    type === 'definition'
      ? TERM
      : type === 'icon'
        ? `<Button variant="ghost" size="icon-sm" aria-label="${LABEL}">\n    <KitIcon name="copy" />\n  </Button>`
        : `<Button>${LABEL}</Button>`
  return `<Tooltip\n  ${props.join('\n  ')}\n>\n  ${child}\n</Tooltip>`
}

/** The trigger each Type is drawn on in the kit. */
const triggerFor = (type: Type) =>
  type === 'definition' ? (
    TERM
  ) : type === 'icon' ? (
    <Button variant="ghost" size="icon-sm" aria-label={LABEL}>
      <KitIcon name="copy" />
    </Button>
  ) : (
    <Button>{LABEL}</Button>
  )

/**
 * Type, Placement, Alignment and Delay. The trigger has a visible label (or,
 * for Icon, an aria-label) of its own, because a tooltip may only add to what
 * is already there.
 */
export function TooltipPreview() {
  const [placement, setPlacement] = useState<Placement>('top')
  const [align, setAlign] = useState<Align>('center')
  const [type, setType] = useState<Type>('standard')
  const [delay, setDelay] = useState(150)
  const sideways = placement === 'left' || placement === 'right'

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Type"
            size="sm"
            value={type}
            onChange={(v) => {
              setType(v as Type)
              if (v === 'definition' && sideways) setPlacement('bottom')
            }}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'icon', label: 'Icon button' },
              { value: 'definition', label: 'Definition' },
            ]}
          />
          <Select
            label="Placement"
            size="sm"
            value={placement}
            onChange={(v) => setPlacement(v as Placement)}
            options={[
              { value: 'top', label: 'Top' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left', disabled: type === 'definition' },
              { value: 'right', label: 'Right', disabled: type === 'definition' },
            ]}
          />
          <Select
            label="Alignment"
            size="sm"
            value={sideways ? 'center' : align}
            onChange={(v) => setAlign(v as Align)}
            state={sideways ? 'disabled' : 'default'}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'end', label: 'End' },
            ]}
          />
          <Select
            label="Delay"
            size="sm"
            value={String(delay)}
            onChange={(v) => setDelay(Number(v))}
            options={[
              { value: '0', label: '0 ms' },
              { value: '150', label: '150 ms' },
              { value: '500', label: '500 ms' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.center}>
          <Tooltip
            content={type === 'definition' ? DEFINITION : CONTENT}
            type={type}
            placement={placement}
            align={align}
            delay={delay}
          >
            {triggerFor(type)}
          </Tooltip>
        </div>
      }
      code={codeFor(placement, align, type, delay)}
    />
  )
}

/**
 * Tooltip opens on hover or focus and has no open prop, so a still opens itself
 * once on mount with a synthetic pointer entry on its trigger. Focus would do
 * it too, but would scroll the page to every still. After that it is the real
 * Tooltip: hover in and out, or press Escape, and it closes.
 */
export function TooltipStill({
  placement = 'top',
  align = 'center',
  type = 'standard',
}: {
  placement?: Placement
  align?: Align
  type?: Type
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    ref.current
      ?.querySelector('button')
      ?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null }))
  }, [])
  return (
    <span ref={ref} className={styles.still}>
      <Tooltip
        content={type === 'definition' ? DEFINITION : CONTENT}
        type={type}
        placement={placement}
        align={align}
      >
        {triggerFor(type)}
      </Tooltip>
    </span>
  )
}
