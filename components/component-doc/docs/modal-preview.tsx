'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal, ModalInPlace } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './modal.module.scss'

type Size = 'sm' | 'md' | 'lg'

const TITLE = 'Publish this theme?'
const BODY = 'Everyone on the library gets the new tokens on their next sync.'

function codeFor(size: Size, dismissible: boolean) {
  const props = [
    '  open={open}',
    '  onClose={() => setOpen(false)}',
    `  title="${TITLE}"`,
    `  body="${BODY}"`,
    ...(size === 'md' ? [] : [`  size="${size}"`]),
    ...(dismissible ? [] : ['  dismissible={false}']),
    '  footer={[',
    '    <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,',
    '    <Button key="publish" variant="primary" onClick={() => setOpen(false)}>Publish</Button>,',
    '  ]}',
  ]
  return `const [open, setOpen] = useState(false)\n\n<Button onClick={() => setOpen(true)}>Open modal</Button>\n<Modal\n${props.join('\n')}\n/>`
}

// An array rather than a fragment: ButtonGroup counts its direct children to
// enforce one primary action, and a fragment would hide both buttons from it.
const footer = (close: () => void) => [
  <Button key="cancel" onClick={close}>
    Cancel
  </Button>,
  <Button key="publish" variant="primary" onClick={close}>
    Publish
  </Button>,
]

/**
 * Size and Dismissible: the contract's two props. With Dismissible set to No,
 * Escape and the scrim stop working and the footer is the only way out, which
 * is the point of trying it.
 */
export function ModalPreview() {
  const [size, setSize] = useState<Size>('md')
  const [dismissible, setDismissible] = useState(true)
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <DemoFrame
      controls={
        <>
          <Select
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
          <Select
            label="Dismissible"
            size="sm"
            value={dismissible ? 'yes' : 'no'}
            onChange={(v) => setDismissible(v === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.center}>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Modal
            open={open}
            onClose={close}
            title={TITLE}
            body={BODY}
            size={size}
            dismissible={dismissible}
            footer={footer(close)}
          />
        </div>
      }
      code={codeFor(size, dismissible)}
    />
  )
}

const noop = () => {}

/**
 * An open Modal held in a box, for the anatomy and variants. The stage's
 * transform makes it the containing block for the fixed scrim, so the picture
 * sits in the page instead of covering it; ModalInPlace keeps it out of the
 * portal so the stage gets the chance. `inert` keeps the Modal from taking
 * focus on mount (which would scroll the page to it), and dismissible={false}
 * keeps these pictures from answering Escape or outside presses.
 */
export function ModalStill({ size = 'md' }: { size?: Size }) {
  return (
    <div className={styles.stage} inert>
      <ModalInPlace.Provider value={true}>
        <Modal
          open
          onClose={noop}
          dismissible={false}
          title={TITLE}
          body={BODY}
          size={size}
          footer={footer(noop)}
        />
      </ModalInPlace.Provider>
    </div>
  )
}
