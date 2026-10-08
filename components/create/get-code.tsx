'use client'

import { createContext, useContext, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Close, Download } from '@carbon/icons-react'
import { buildJson } from '@/lib/color.js'
import type { ExportBundle } from '@/lib/color.js'
import { useTheme } from '@/components/theme-provider'
import { buildThemeFile } from '@/lib/theme-file'
import { buildTailwindBridge } from '@/lib/tailwind-bridge'
import { REGISTRY_URL, shadcnAdd } from '@/lib/registry-url'
import type { ThemeFileFoundations } from '@/lib/theme-file'
import { useOverlay } from '@/components/ui/overlay'
import { DocSnippet } from '@/components/doc-snippet'
import {
  CODE_FONTS,
  TEXT_FONTS,
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
 *
 * Dressed as the header's drop panels (../_drop-panel.scss) rather than as the
 * kit's Modal: the AI layer's tinted surface and edge, the glow rising from
 * the foot, sections cascading in, and the footer's filled action. It opens
 * from the bottom of the controls, so there is no trigger above it to hang a
 * caret from; it centres under the header, as search does without an anchor.
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
    font(TEXT_FONTS, b.headingFont, '--graphite-font-1')
    font(TEXT_FONTS, b.bodyFont, '--graphite-font-2')
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

  const id = useId()
  // Escape, the scrim and the close dismiss it; focus is trapped inside and
  // returned to the trigger on close, as the Modal did.
  const ref = useOverlay<HTMLDivElement>({ open, onDismiss: onClose, trapFocus: true })

  if (!open || typeof document === 'undefined') return null

  // Portalled, so the Create panel's sticky aside cannot scope its z-index.
  return createPortal(
    <>
      <div className={styles.scrim} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        className={styles.panel}
      >
        <div className={`${styles.header} ${styles.section}`}>
          <h2 id={`${id}-title`} className={styles.title}>
            Get the code
          </h2>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <Close size={20} aria-hidden="true" />
          </button>
        </div>
        {out ? (
          <div className={styles.body}>
            <p className={`${styles.lede} ${styles.section}`}>
              The theme as the preview shows it, for {sourceHex.toUpperCase()}.
              The CSS is one file to keep in your project: foundations and both
              themes, with no Graphite runtime needed. Tailwind is a second
              file that names those variables as Tailwind utilities, for use
              beside the CSS. The JSON has the colors with where each one came
              from.
            </p>
            <div className={styles.section}>
              <p className={styles.lede}>
                Or install the theme and the Tailwind file with the shadcn CLI.
                The CLI version takes your color and contrast target; radius,
                density and type chosen here are in the download only.
              </p>
              <DocSnippet
                code={
                  level === 'AAA'
                    ? // Quoted: some shells read a bare ? as a glob.
                      `${shadcnAdd('init')} "${REGISTRY_URL}/theme/${sourceHex.slice(1)}.json?level=AAA" ${REGISTRY_URL}/tailwind.json`
                    : shadcnAdd('init', `theme/${sourceHex.slice(1)}`, 'tailwind')
                }
              />
            </div>
            <div className={styles.section}>
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
          </div>
        ) : (
          <div className={styles.body}>
            <p className={styles.lede}>The theme is still resolving.</p>
          </div>
        )}
        <div className={styles.footer}>
          <button type="button" className={styles.footerAction} onClick={download} disabled={!out}>
            Download {FORMATS[tab].label}
            <Download size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>,
    document.body,
  )
}
