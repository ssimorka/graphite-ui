'use client'

import type { ReactNode } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { DocSnippet } from '@/components/doc-snippet'
import styles from './component-doc.module.scss'
import { exampleFile } from './example-file'
import type { Example } from './example-file'

/**
 * The live preview's frame: optional controls on the right, then Preview and
 * Code tabs. The Code tab prints what is on screen, so each page builds its
 * example from the same props it renders. A snippet typed beside a demo is a
 * second copy that can disagree with it.
 *
 * The example is a complete file (example-file.ts): imports, any data or stub
 * handlers, and a default export with its state. Pasted as is, it runs, and
 * scripts/code-tab-check.mjs type-checks every page's example over every
 * combination of its controls.
 */
export function DemoFrame({
  controls,
  preview,
  example,
}: {
  controls?: ReactNode
  preview: ReactNode
  example: Example
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
          {
            id: 'code',
            label: 'Code',
            panel: <DocSnippet code={exampleFile(example)} />,
          },
        ]}
      />
    </div>
  )
}
