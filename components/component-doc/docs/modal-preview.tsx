'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal, ModalInPlace } from '@/components/ui/modal'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './modal.module.scss'

type Size = 'xs' | 'sm' | 'md' | 'lg'
export type Actions = 1 | 2 | 3 | 'cancel'

const TITLE = 'Publish this theme?'
const LABEL = 'Library'
const BODY = 'Everyone on the library gets the new tokens on their next sync.'

function codeFor(size: Size, dismissible: boolean, label: boolean, actions: Actions, loading: boolean) {
  const lines: Record<string, string> = {
    cancel: "    <Button key=\"cancel\" variant=\"ghost\" onClick={() => setOpen(false)}>Cancel</Button>,",
    back: "    <Button key=\"back\" onClick={() => setOpen(false)}>Back</Button>,",
    draft: "    <Button key=\"draft\" onClick={() => setOpen(false)}>Save draft</Button>,",
    publish: "    <Button key=\"publish\" variant=\"primary\" onClick={publish}>Publish</Button>,",
  }
  const keys = actions === 1 ? ['publish'] : actions === 2 ? ['back', 'publish'] : actions === 3 ? ['back', 'draft', 'publish'] : ['cancel', 'back', 'publish']
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
  return `const [open, setOpen] = useState(false)\n\n<Button onClick={() => setOpen(true)}>Open modal</Button>\n<Modal\n${props.join('\n')}\n/>`
}

// An array rather than a fragment, which ButtonGroup and the footer layout
// also unwrap, but an array is what the printed code shows.
const footer = (close: () => void, actions: Actions = 2) => {
  const publish = (
    <Button key="publish" variant="primary" onClick={close}>
      Publish
    </Button>
  )
  const back = (
    <Button key="back" onClick={close}>
      Back
    </Button>
  )
  if (actions === 1) return [publish]
  if (actions === 3)
    return [
      back,
      <Button key="draft" onClick={close}>
        Save draft
      </Button>,
      publish,
    ]
  if (actions === 'cancel')
    return [
      <Button key="cancel" variant="ghost" onClick={close}>
        Cancel
      </Button>,
      back,
      publish,
    ]
  return [back, publish]
}

/**
 * Size, Label, the footer's actions, Inline loading and Dismissible. With
 * Dismissible set to No, Escape, the scrim and the close button stop working
 * and the footer is the only way out, which is the point of trying it.
 */
export function ModalPreview() {
  const [size, setSize] = useState<Size>('md')
  const [dismissible, setDismissible] = useState(true)
  const [label, setLabel] = useState(true)
  const [actions, setActions] = useState<Actions>(2)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'xs', label: 'Extra small' },
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Dropdown
            label="Label"
            size="sm"
            value={label ? 'yes' : 'no'}
            onChange={(v) => setLabel(v === 'yes')}
            options={[
              { value: 'yes', label: 'Shown' },
              { value: 'no', label: 'Hidden' },
            ]}
          />
          <Dropdown
            label="Actions"
            size="sm"
            value={String(actions)}
            onChange={(v) => setActions(v === 'cancel' ? 'cancel' : (Number(v) as 1 | 2 | 3))}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: 'cancel', label: '2 and Cancel' },
            ]}
          />
          <Dropdown
            label="Inline loading"
            size="sm"
            value={loading ? 'yes' : 'no'}
            onChange={(v) => setLoading(v === 'yes')}
            options={[
              { value: 'no', label: 'Off' },
              { value: 'yes', label: 'On' },
            ]}
          />
          <Dropdown
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
            label={label ? LABEL : undefined}
            title={TITLE}
            body={BODY}
            size={size}
            dismissible={dismissible}
            loading={loading ? 'Publishing…' : undefined}
            footer={footer(close, actions)}
          />
        </div>
      }
      code={codeFor(size, dismissible, label, actions, loading)}
    />
  )
}

const noop = () => {}

/**
 * An open Modal held in a box, for the anatomy and variants. The stage's
 * transform makes it the containing block for the fixed scrim, so the picture
 * sits in the page instead of covering it; ModalInPlace keeps it out of the
 * portal so the stage gets the chance. `inert` keeps the Modal from taking
 * focus on mount (which would scroll the page to it) and from answering
 * presses; its onClose does nothing, so Escape cannot close it either. It is
 * left dismissible so the close button draws, as the kit's Modal does.
 */
export function ModalStill({
  size = 'md',
  label,
  actions = 2,
  progress,
  loading,
}: {
  size?: Size
  label?: boolean
  actions?: Actions
  progress?: boolean
  loading?: boolean
}) {
  return (
    <div className={styles.stage} inert>
      <ModalInPlace.Provider value={true}>
        <Modal
          open
          onClose={noop}
          label={label ? LABEL : undefined}
          title={TITLE}
          body={BODY}
          progress={progress ? <ProgressBar value={60} label="Uploading tokens" /> : undefined}
          size={size}
          loading={loading ? 'Publishing…' : undefined}
          footer={footer(noop, actions)}
        />
      </ModalInPlace.Provider>
    </div>
  )
}
