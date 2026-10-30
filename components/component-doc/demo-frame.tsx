'use client'

import type { ReactNode } from 'react'
import { Tabs } from '@/components/ui/tabs'
import { DocSnippet } from '@/components/doc-snippet'
import styles from './component-doc.module.scss'

/**
 * Whether a Code tab example only runs in a client component: it calls a hook,
 * passes a function (an arrow, a render prop) or wires an event handler. Pasted
 * into an App Router page without `'use client'`, such an example fails the
 * build with "Functions cannot be passed directly to Client Components". Read
 * from the code itself, so a demo that gains state is marked with no edit here.
 */
export function needsClient(code: string) {
  return /\buse[A-Z]\w*\(/.test(code) || /=>/.test(code) || /\bon[A-Z]\w*=\{/.test(code)
}

const CLIENT_HEADER = `'use client'
// Holds state or passes a function: keep this line at the top of its file.

`

/**
 * The live preview's frame: optional controls on the right, then Preview and
 * Code tabs. The Code tab prints what is on screen, so each page builds `code`
 * from the same props it renders. A snippet typed beside a demo is a second copy
 * that can disagree with it. The tab adds the client directive itself where the
 * example needs one, so no page can forget it.
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
          {
            id: 'code',
            label: 'Code',
            panel: <DocSnippet code={needsClient(code) ? CLIENT_HEADER + code : code} />,
          },
        ]}
      />
    </div>
  )
}
