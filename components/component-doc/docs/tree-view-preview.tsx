'use client'

import { useState } from 'react'
import { TreeView } from '@/components/ui/tree-view'
import type { TreeNode } from '@/components/ui/tree-view'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { exampleFor } from './tree-view-code'
import type { Size } from './tree-view-code'
import styles from './tree-view.module.scss'

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
      example={exampleFor({ size, icons: icons === 'on', selected })}
    />
  )
}
