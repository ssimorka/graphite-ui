'use client'

import type { ReactNode } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { DocSnippet } from '@/components/doc-snippet'
import styles from './component-doc.module.scss'

/**
 * The live preview's frame: optional controls on the right, then Preview and
 * Code tabs. The Code tab prints what is on screen, so each page builds `code`
 * from the same props it renders. A snippet typed beside a demo is a second copy
 * that can disagree with it.
 */
export function DemoFrame({
  controls,
  preview,
  code,
}: {
  controls?: ReactNode
  preview: ReactNode
  code: string
}) {
  return (
    <div className={styles.live}>
      {controls ? <div className={styles.controls}>{controls}</div> : null}
      <Tabs
        tabs={[
          {
            id: 'preview',
            label: 'Preview',
            panel: (
              <div className={styles.previewSurface}>
                <div className={styles.previewInner}>{preview}</div>
              </div>
            ),
          },
          { id: 'code', label: 'Code', panel: <DocSnippet code={code} /> },
        ]}
      />
    </div>
  )
}
