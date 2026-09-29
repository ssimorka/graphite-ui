'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Tooltip } from '@/components/ui/tooltip'
import { DemoFrame } from '../demo-frame'
import styles from './tooltip.module.scss'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const LABEL = 'Copy'
const CONTENT = 'Copies the hex value to the clipboard'

function codeFor(placement: Placement, delay: number) {
  const props = [
    `content="${CONTENT}"`,
    ...(placement === 'top' ? [] : [`placement="${placement}"`]),
    ...(delay === 150 ? [] : [`delay={${delay}}`]),
  ]
  return `<Tooltip\n  ${props.join('\n  ')}\n>\n  <Button>${LABEL}</Button>\n</Tooltip>`
}

/**
 * Placement and Delay, the contract's two props. The trigger has a visible
 * label of its own, because a tooltip may only add to what is already there.
 */
export function TooltipPreview() {
  const [placement, setPlacement] = useState<Placement>('top')
  const [delay, setDelay] = useState(150)

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Placement"
            size="sm"
            value={placement}
            onChange={(v) => setPlacement(v as Placement)}
            options={[
              { value: 'top', label: 'Top' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
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
          <Tooltip content={CONTENT} placement={placement} delay={delay}>
            <Button>{LABEL}</Button>
          </Tooltip>
        </div>
      }
      code={codeFor(placement, delay)}
    />
  )
}

/**
 * Tooltip opens on hover or focus and has no open prop, so a still opens itself
 * once on mount with a synthetic pointer entry on its trigger. Focus would do
 * it too, but would scroll the page to every still. After that it is the real
 * Tooltip: hover in and out, or press Escape, and it closes.
 */
export function TooltipStill({ placement = 'top' }: { placement?: Placement }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    ref.current
      ?.querySelector('button')
      ?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null }))
  }, [])
  return (
    <span ref={ref} className={styles.still}>
      <Tooltip content={CONTENT} placement={placement}>
        <Button>{LABEL}</Button>
      </Tooltip>
    </span>
  )
}
