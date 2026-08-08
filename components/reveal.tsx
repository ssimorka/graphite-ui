'use client'

import type { ReactNode } from 'react'
import { useReveal } from '@/components/use-reveal'

type RevealProps = {
  children: ReactNode
  /** Stagger delay in ms applied via inline transition-delay. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
