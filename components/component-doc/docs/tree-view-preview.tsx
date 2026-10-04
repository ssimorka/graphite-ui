'use client'

import { useState } from 'react'
import { TreeView } from '@/components/ui/tree-view'
import type { TreeNode } from '@/components/ui/tree-view'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './tree-view.module.scss'

type Size = 'sm' | 'xs'

function codeFor(size: Size, icons: boolean) {
  const lines = ['  label="Project files"', '  nodes={nodes}']
  if (size !== 'sm') lines.push(`  size="${size}"`)
  if (!icons) lines.push('  icons={false}')
  lines.push('  selected={selected}', '  onSelect={setSelected}')
  return `<TreeView\n${lines.join('\n')}\n/>`
}

/** The kit's pane: Size and Icon. Selection is live, so the code tracks it. */
export function TreeViewPreview({ nodes }: { nodes: TreeNode[] }) {
  const [size, setSize] = useState<Size>('sm')
  const [icons, setIcons] = useState('on')
  const [selected, setSelected] = useState('button')

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
              { value: 'sm', label: 'Small' },
              { value: 'xs', label: 'Extra small' },
            ]}
          />
          <Dropdown
            label="Icons"
            size="sm"
            value={icons}
            onChange={setIcons}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.tree}>
          <TreeView
            label="Project files"
            nodes={nodes}
            size={size}
            icons={icons === 'on'}
            selected={selected}
            onSelect={setSelected}
            defaultExpanded={['components']}
          />
        </div>
      }
      code={codeFor(size, icons === 'on')}
    />
  )
}
