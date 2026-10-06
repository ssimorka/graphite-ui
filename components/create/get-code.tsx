'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { buildJson } from '@/lib/color.js'
import type { ExportBundle } from '@/lib/color.js'
import { useTheme } from '@/components/theme-provider'
import { buildThemeFile } from '@/lib/theme-file'
import { buildTailwindBridge } from '@/lib/tailwind-bridge'
import type { ThemeFileFoundations } from '@/lib/theme-file'
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
 * The foundation tokens, read from app/globals.scss by the Create page on the
 * server. Provided rather than imported because reading the repo is server
 * work and this dialog is a client component.
 */
export const FoundationsContext = createContext<ThemeFileFoundations | null>(null)

/**
 * "Get the code": the theme as it stands, in two forms, and a download.
 *
 * The CSS is the theme file (lib/theme-file.ts): foundations and both themes'
 * colors, under the same `--graphite-*` names the provider stamps and the
 * components read, with the builder's choices (radius, density and the three
 * typefaces) written into the foundations. It needs no Graphite runtime, so an
 * adopter keeps it as their theme. Tailwind is the bridge (lib/tailwind-bridge.ts)
 * that names those variables as Tailwind tokens, alongside the CSS. The JSON
 * is the engine's audit format.
 */

// What each tab downloads as.
const FORMATS = {
  css: { label: 'CSS', file: 'graphite-theme.css', type: 'text/css' },
  tailwind: { label: 'Tailwind', file: 'graphite-tailwind.css', type: 'text/css' },
  json: { label: 'JSON', file: 'graphite-theme.json', type: 'application/json' },
} as const
type Format = keyof typeof FORMATS
export function GetCodeDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { sourceHex, ramps, lightBundle, darkBundle, level } = useTheme()
  const foundations = useContext(FoundationsContext)
  const b = useBuilder()
  const [tab, setTab] = useState<Format>('css')

  const out = useMemo(() => {
    if (!ramps || !lightBundle || !darkBundle || !foundations) return null
    const bundle: ExportBundle = {
      hex: sourceHex,
      ramps,
      light: lightBundle,
      lightStates: lightBundle.states,
      dark: darkBundle,
      darkStates: darkBundle.states,
    }
    // Only what differs from the stylesheet's own value is overridden. The
    // radius and density choices are written as references to the scale, and
    // a default choice would otherwise reference itself.
    const overrides: Record<string, string> = {}
    if (b.radius !== 'none')
      overrides['--graphite-radius-none'] = RADII.find((r) => r.key === b.radius)!.value
    if (b.density !== 'default')
      overrides['--graphite-density-default'] = `var(--graphite-density-${b.density})`
    const font = (opts: { key: string; stack: string }[], key: string, name: string) => {
      if (key !== opts[0].key) overrides[name] = (opts.find((o) => o.key === key) ?? opts[0]).stack
    }
    font(HEADING_FONTS, b.headingFont, '--graphite-font-1')
    font(BODY_FONTS, b.bodyFont, '--graphite-font-2')
    font(CODE_FONTS, b.codeFont, '--graphite-font-mono')
    return {
      css: buildThemeFile({ bundle, level, foundations, overrides }),
      tailwind: buildTailwindBridge({ bundle, foundations }),
      json: JSON.stringify(buildJson(bundle), null, 2),
    }
  }, [sourceHex, ramps, lightBundle, darkBundle, level, foundations, b.radius, b.density, b.headingFont, b.bodyFont, b.codeFont])

  const download = () => {
    if (!out) return
    const blob = new Blob([out[tab]], { type: FORMATS[tab].type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = FORMATS[tab].file
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
              The CSS is one file to keep in your project: foundations and both
              themes, with no Graphite runtime needed. Tailwind is a second
              file that names those variables as Tailwind utilities, for use
              beside the CSS. The JSON has the colors with where each one came
              from.
            </p>
            <div className={styles.formats} role="group" aria-label="Format">
              {(Object.keys(FORMATS) as Format[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={styles.chip}
                  aria-pressed={tab === f}
                  onClick={() => setTab(f)}
                >
                  {FORMATS[f].label}
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
