'use client'

import { useState } from 'react'
import { Checkmark, Copy } from '@carbon/icons-react'
import styles from './doc-snippet.module.scss'

/**
 * A command the reader is meant to paste. Docs-site chrome: the kit's Code
 * snippet is a Carbon-only set with no contract, so this is the site's own,
 * built to its geometry (layer-01 field, 16px inset, ghost copy button).
 *
 * The kit's multi-line snippet also carries a "Show less" toggle. That exists
 * for snippets that overflow a fixed height, and nothing on the docs pages is
 * long enough to need it, so it is left out rather than rendered inert.
 */
export function DocSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard access can be refused (insecure context, permissions). The
      // text stays selectable, so the reader can still copy by hand.
    }
  }

  return (
    <div className={styles.snippet}>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        className={styles.copy}
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      >
        {copied ? <Checkmark size={16} /> : <Copy size={16} />}
      </button>
    </div>
  )
}
