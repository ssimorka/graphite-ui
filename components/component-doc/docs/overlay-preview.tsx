'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover } from '@/components/ui/popover'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import { ThemeOptions } from './popover-preview'
import styles from './overlay.module.scss'

const TRIGGER = 'Open panel'

function codeFor(trap: boolean) {
  const modal = trap ? '\n  modal' : ''
  return `// Popover calls useOverlay({ open, onDismiss, trapFocus: ${trap} })
<Popover${modal}
  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}
>
  <ThemeOptions store={store} />
</Popover>`
}

/** Names the focused element in words, for the readout under the demo. */
function describe(el: Element | null, root: HTMLElement | null): string {
  if (!el || el === document.body) return 'nothing (the page)'
  if (!root?.contains(el)) return 'something outside the demo'
  if (el instanceof HTMLInputElement) {
    return `the ${el.labels?.[0]?.textContent ?? ''} checkbox`.replace('  ', ' ')
  }
  if (el.getAttribute('role') === 'dialog') return 'the panel itself'
  if (el instanceof HTMLButtonElement) return `the ${el.textContent} button`
  return 'the panel'
}

/**
 * The readout keeps its own state. If it lived in OverlayPreview, every focus
 * change would re-render the open Popover, and useOverlay's effect (keyed on
 * the inline onDismiss Popover creates) would re-run and pull focus back.
 */
function FocusReadout({ root }: { root: { current: HTMLElement | null } }) {
  const [focus, setFocus] = useState('nothing (the page)')

  useEffect(() => {
    const update = () =>
      // After the event, so a close has finished moving focus back.
      requestAnimationFrame(() => setFocus(describe(document.activeElement, root.current)))
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    return () => {
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', update)
    }
  }, [root])

  return (
    <p className={styles.readout}>
      Focus is on {focus}. Open the panel, Tab through it, then press Escape or
      click away.
    </p>
  )
}

/**
 * Overlay has no surface of its own, so it is shown through Popover, the one
 * overlay whose focus trap is a switch. The readout names where focus is, so
 * the three things the base owns can be watched: Tab wrapping inside the panel
 * when the trap is on, Escape and an outside press closing it, and focus
 * landing back on the trigger afterwards.
 */
export function OverlayPreview() {
  const [trap, setTrap] = useState(false)
  const store = useRef({ light: true, dark: false })
  const root = useRef<HTMLDivElement>(null)

  return (
    <DemoFrame
      controls={
        <Select
          label="Trap focus"
          size="sm"
          value={trap ? 'on' : 'off'}
          onChange={(v) => setTrap(v === 'on')}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'on', label: 'On' },
          ]}
        />
      }
      preview={
        <div ref={root} className={styles.demo}>
          <Popover
            modal={trap}
            trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
          >
            <ThemeOptions store={store} />
          </Popover>
          <FocusReadout root={root} />
        </div>
      }
      code={codeFor(trap)}
    />
  )
}
