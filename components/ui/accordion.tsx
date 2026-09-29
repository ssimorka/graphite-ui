'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { ChevronDown } from '@carbon/icons-react'
import { cn } from '@/lib/cn'
import styles from './accordion.module.scss'

/**
 * Contract: docs/contracts/accordion.md (1.0.0)
 *
 * The recipe, the root, the item, and the two parts an item is made of. The
 * trigger is a real button that owns the expanded state; the panel is labelled
 * by its own trigger.
 *
 * `<AccordionItem title="…">panel</AccordionItem>` is the shape the kit draws
 * (its Home and component pages both show it), so it is the short form. The
 * parts are exported as well, per the API conventions, for the item that needs
 * more than a string in its trigger: leave `title` off and compose them.
 */
export const accordionVariants = cva(styles.accordion, {
  variants: {
    size: { sm: styles.sm, md: styles.md, lg: styles.lg },
    align: { left: styles.left, right: styles.right },
    flush: { true: styles.flush, false: null },
  },
  defaultVariants: { size: 'md', align: 'right', flush: false },
})

type Size = 'sm' | 'md' | 'lg'
type Align = 'left' | 'right'

type RootContext = {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

const RootCtx = createContext<RootContext | null>(null)
const ItemCtx = createContext<{
  value: string
  open: boolean
  disabled: boolean
  triggerId: string
  panelId: string
} | null>(null)

function useRoot(part: string) {
  const ctx = useContext(RootCtx)
  if (!ctx) throw new Error(`${part} must be rendered inside <Accordion>`)
  return ctx
}

function useItem(part: string) {
  const ctx = useContext(ItemCtx)
  if (!ctx) throw new Error(`${part} must be rendered inside <AccordionItem>`)
  return ctx
}

type AccordionBase = Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> & {
  size?: Size
  align?: Align
  /** Drops the outer rules and the horizontal inset. */
  flush?: boolean
}

export type AccordionProps = AccordionBase &
  (
    | {
        type?: 'single'
        collapsible?: boolean
        defaultValue?: string
        value?: string
        onValueChange?: (value: string) => void
      }
    | {
        type: 'multiple'
        collapsible?: never
        defaultValue?: string[]
        value?: string[]
        onValueChange?: (value: string[]) => void
      }
  )

export function Accordion({
  type = 'single',
  collapsible = false,
  size,
  align,
  flush,
  className,
  children,
  defaultValue,
  value,
  onValueChange,
  ...props
}: AccordionProps) {
  const toArray = (v: string | string[] | undefined) =>
    v === undefined ? [] : Array.isArray(v) ? v : [v]

  const [inner, setInner] = useState<string[]>(() => toArray(defaultValue))
  const controlled = value !== undefined
  const open = controlled ? toArray(value) : inner

  const toggle = useCallback(
    (item: string) => {
      const isOpen = open.includes(item)
      let next: string[]
      if (type === 'multiple') {
        next = isOpen ? open.filter((v) => v !== item) : [...open, item]
      } else if (isOpen) {
        // A single accordion keeps one panel open unless it says otherwise.
        if (!collapsible) return
        next = []
      } else {
        next = [item]
      }
      if (!controlled) setInner(next)
      // Typed loosely: the union above already guarantees the caller's shape.
      ;(onValueChange as ((v: string | string[]) => void) | undefined)?.(
        type === 'multiple' ? next : (next[0] ?? ''),
      )
    },
    [open, type, collapsible, controlled, onValueChange],
  )

  const ctx = useMemo<RootContext>(
    () => ({ isOpen: (v) => open.includes(v), toggle }),
    [open, toggle],
  )

  return (
    <RootCtx.Provider value={ctx}>
      <div
        data-slot="accordion"
        className={cn(accordionVariants({ size, align, flush }), className)}
        {...props}
      >
        {children}
      </div>
    </RootCtx.Provider>
  )
}

export type AccordionItemProps = Omit<ComponentPropsWithRef<'div'>, 'title'> & {
  /** Identifies the item to the root. Generated when omitted. */
  value?: string
  disabled?: boolean
  /** The trigger's label. With it, `children` is the panel's content. */
  title?: ReactNode
}

export function AccordionItem({
  value,
  disabled = false,
  title,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const auto = useId()
  const id = value ?? auto
  const root = useRoot('AccordionItem')
  const open = root.isOpen(id)

  return (
    <ItemCtx.Provider
      value={{
        value: id,
        open,
        disabled,
        triggerId: `${auto}-trigger`,
        panelId: `${auto}-panel`,
      }}
    >
      <div
        data-slot="accordion-item"
        data-state={open ? 'open' : 'closed'}
        className={cn(styles.item, className)}
        {...props}
      >
        {title === undefined ? (
          children
        ) : (
          <>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
          </>
        )}
      </div>
    </ItemCtx.Provider>
  )
}

export type AccordionTriggerProps = ComponentPropsWithRef<'button'>

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const root = useRoot('AccordionTrigger')
  const item = useItem('AccordionTrigger')

  return (
    // The heading wraps the button rather than being the button, so the page's
    // outline still lists each question.
    <h3 className={styles.heading}>
      <button
        type="button"
        id={item.triggerId}
        data-slot="accordion-trigger"
        className={cn(styles.trigger, className)}
        aria-expanded={item.open}
        aria-controls={item.panelId}
        disabled={item.disabled}
        onClick={() => root.toggle(item.value)}
        {...props}
      >
        <span className={styles.label}>{children}</span>
        {/* Decorative: the state is aria-expanded, and the panel opening is the
            layout change that carries it for everyone else. */}
        <ChevronDown
          size={16}
          className={styles.indicator}
          aria-hidden="true"
          data-slot="accordion-indicator"
        />
      </button>
    </h3>
  )
}

export type AccordionContentProps = ComponentPropsWithRef<'div'> & {
  children: ReactNode
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const item = useItem('AccordionContent')

  return (
    <div
      id={item.panelId}
      role="region"
      aria-labelledby={item.triggerId}
      data-slot="accordion-content"
      data-state={item.open ? 'open' : 'closed'}
      className={styles.panel}
    >
      {/* `inert` takes a closed panel out of the tab order and the a11y tree,
          which the height collapse alone does not. */}
      <div className={styles.clip} inert={!item.open}>
        <div className={cn(styles.content, className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  )
}
