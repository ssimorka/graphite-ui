'use client'

import { createContext, useContext } from 'react'
import type { ReactNode, SVGProps } from 'react'
import { KIT_ICONS } from '@/lib/kit-icons'
import type { IconSet, KitIconName } from '@/lib/kit-icons'

// Which of the kit's three families a subtree draws. The Create page sets it on
// the preview so one control swaps every icon in the examples; anywhere else
// gets Regular, the family the kit itself uses (fi-rs).
const IconSetContext = createContext<IconSet>('regular')

export function IconSetProvider({ set, children }: { set: IconSet; children: ReactNode }) {
  return <IconSetContext.Provider value={set}>{children}</IconSetContext.Provider>
}

type KitIconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  name: KitIconName
  /** Rendered width and height in px. The kit draws every glyph on 16. */
  size?: number
  /** Overrides the family from context. */
  set?: IconSet
}

/**
 * One of the kit's icons, in currentColor. Decorative unless given an
 * aria-label, in the same way Carbon's icon components are.
 */
export function KitIcon({ name, size = 16, set, ...rest }: KitIconProps) {
  const fromContext = useContext(IconSetContext)
  const paths = KIT_ICONS[set ?? fromContext][name]
  const labelled = rest['aria-label'] !== undefined
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      focusable="false"
      aria-hidden={labelled ? undefined : true}
      role={labelled ? 'img' : undefined}
      {...rest}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}
