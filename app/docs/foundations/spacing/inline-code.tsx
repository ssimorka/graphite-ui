import { Fragment } from 'react'

/**
 * Contract prose marks identifiers with backticks and sometimes leaves a bare
 * custom property name. Both are set in the mono face, so a rule quoted from a
 * contract reads the same as one written into the page.
 */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|--graphite-[a-z0-9-]+\*?)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? (
          <code key={i}>{p.slice(1, -1)}</code>
        ) : p.startsWith('--graphite-') ? (
          <code key={i}>{p}</code>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}
