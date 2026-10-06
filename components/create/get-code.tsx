'use client'

import { useMemo, useState } from 'react'
import { buildCss, buildJson } from '@/lib/color.js'
import type { ExportBundle } from '@/lib/color.js'
import { useTheme } from '@/components/theme-provider'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { DocSnippet } from '@/components/doc-snippet'
import {
  BODY_FONTS,
  CODE_FONTS,
  HEADING_FONTS,
  RADII,
  useBuilder,
} from './builder'
import styles from './get-code.module.scss'

/**
 * "Get the code": the theme as it stands, in two forms, and a download.
 *
 * The colour output is the engine's own exporter (`buildCss` and `buildJson`),
 * so what you take is exactly what the site resolves, under the same
 * `--graphite-*` names the provider stamps and the components read; the
 * builder's own choices (radius and the three typefaces) follow as a second
 * block, so the CSS is a complete answer to what the preview shows.
 */
export function GetCodeDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { sourceHex, ramps, lightBundle, darkBundle } = useTheme()
  const b = useBuilder()
  const [tab, setTab] = useState<'css' | 'json'>('css')

  const out = useMemo(() => {
    if (!ramps || !lightBundle || !darkBundle) return null
    const bundle: ExportBundle = {
      hex: sourceHex,
      ramps,
      light: lightBundle,
      lightStates: lightBundle.states,
      dark: darkBundle,
      darkStates: darkBundle.states,
    }
    const stack = (opts: { key: string; stack: string }[], key: string) =>
      (opts.find((o) => o.key === key) ?? opts[0]).stack
    const radius = RADII.find((r) => r.key === b.radius)!
    const choices = [
      '',
      '/* Builder choices. Graphite components take their corners from',
      '   --graphite-radius-none, the square-corner token, so rounding them is',
      '   one override. */',
      ':root {',
      `  --graphite-radius-none: ${radius.key === 'none' ? '0' : radius.key === 'full' ? '999px' : `${radius.key}px`};`,
      `  --graphite-font-1: ${stack(HEADING_FONTS, b.headingFont)};`,
      `  --graphite-font-2: ${stack(BODY_FONTS, b.bodyFont)};`,
      `  --graphite-font-mono: ${stack(CODE_FONTS, b.codeFont)};`,
      '}',
      '',
    ].join('\n')
    return {
      css: `${buildCss(bundle)}${choices}`,
      json: JSON.stringify(buildJson(bundle), null, 2),
    }
  }, [sourceHex, ramps, lightBundle, darkBundle, b.radius, b.headingFont, b.bodyFont, b.codeFont])

  const download = () => {
    if (!out) return
    const isCss = tab === 'css'
    const blob = new Blob([isCss ? out.css : out.json], {
      type: isCss ? 'text/css' : 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = isCss ? 'graphite-theme.css' : 'graphite-theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Get the code"
      size="lg"
      body={
        out ? (
          <div className={styles.body}>
            <p className={styles.lede}>
              The theme as the preview shows it, for {sourceHex.toUpperCase()}.
              CSS variables for both themes, or the same tokens as JSON.
            </p>
            <div className={styles.formats} role="group" aria-label="Format">
              {(['css', 'json'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={styles.chip}
                  aria-pressed={tab === f}
                  onClick={() => setTab(f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className={styles.snippet}>
              <DocSnippet key={tab} code={out[tab]} />
            </div>
          </div>
        ) : (
          <p className={styles.lede}>The theme is still resolving.</p>
        )
      }
      footer={
        <>
          <Button onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={download} disabled={!out}>
            Download
          </Button>
        </>
      }
    />
  )
}
