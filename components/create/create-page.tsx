'use client'

import type { ContrastSweep } from '@/lib/contrast-sweep'
import { BuilderProvider } from './builder'
import { ContrastReport } from './contrast-report'
import { ControlsBar } from './controls-bar'
import { ControlsPanel } from './controls'
import { Preview } from './preview'
import styles from './create-page.module.scss'

/**
 * The theme builder. At xl the panel sits beside the preview; below that the
 * preview leads and the controls are a compact bar under it, as the kit draws
 * Medium and Small. Both read one description of the controls, so they cannot
 * disagree.
 */
export function CreatePage({ sweep }: { sweep: ContrastSweep }) {
  return (
    <BuilderProvider>
      <div className={styles.root}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.page}>
          <header className={styles.head}>
            <h1 className={styles.title}>Create a theme</h1>
            <p className={styles.lede}>
              Pick one color. Graphite resolves seven ramps and thirty-two semantic
              roles from it, in both themes, and checks every pairing as it goes.
              Everything below the source is derived, which is the point: you are
              choosing a system, not painting components.
            </p>
          </header>
          <div className={styles.split}>
            <div className={styles.panel}>
              <ControlsPanel />
            </div>
            <div className={styles.main}>
              <Preview />
              <ContrastReport sweep={sweep} />
              <div className={styles.bar}>
                <ControlsBar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BuilderProvider>
  )
}
