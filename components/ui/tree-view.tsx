'use client'

import { useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { KitIcon } from '@/components/kit-icon'
import styles from './tree-view.module.scss'

export type TreeNode = {
  id: string
  label: string
  /** Makes the node a link. The tree does not route; the browser does. */
  href?: string
  disabled?: boolean
  /** A node with children is the kit's Branch node; without, a Leaf. */
  children?: TreeNode[]
}

/** Contract: docs/contracts/tree-view.md (1.0.0) */
type TreeViewProps = {
  /** Required: the tree's accessible name. */
  label: string
  nodes: TreeNode[]
  /** The kit's Size: rows of 32 (sm) and 24 (xs). */
  size?: 'sm' | 'xs'
  /** The kit's Icon axis: the folder and the document, and a 24 indent step. */
  icons?: boolean
  /** The selected node's id. Its ancestors open. */
  selected?: string
  onSelect?: (id: string) => void
  /** Branches open at first. */
  defaultExpanded?: string[]
  className?: string
}

type Flat = { node: TreeNode; level: number; parent: string | null }

/** Every node in document order, with its level and parent. */
function flatten(nodes: TreeNode[], level = 1, parent: string | null = null, out: Flat[] = []) {
  for (const node of nodes) {
    out.push({ node, level, parent })
    if (node.children?.length) flatten(node.children, level + 1, node.id, out)
  }
  return out
}

/**
 * The kit's Tree view (11948:286738) and Branch node item (11828:285325): the
 * ARIA navigation tree. One tab stop; the arrow keys move between the nodes
 * that are showing. A node with an href is a link, so the tree can be a site's
 * navigation, which is what the docs sidebar uses it for.
 */
export function TreeView({
  label,
  nodes,
  size = 'sm',
  icons = true,
  selected,
  onSelect,
  defaultExpanded = [],
  className,
}: TreeViewProps) {
  const base = useId()
  const flat = useMemo(() => flatten(nodes), [nodes])
  const byId = useMemo(() => new Map(flat.map((f) => [f.node.id, f])), [flat])

  // The selected node's ancestors start open, so the reader can see where
  // they are.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const open = new Set(defaultExpanded)
    for (let p = selected ? byId.get(selected)?.parent : null; p; p = byId.get(p)?.parent ?? null) open.add(p)
    return open
  })
  const [own, setOwn] = useState<string | undefined>(undefined)
  const current = selected ?? own
  const [focusId, setFocusId] = useState<string | null>(null)
  const items = useRef(new Map<string, HTMLElement>())

  // The nodes a reader can reach: every ancestor open.
  const visible = flat.filter((f) => {
    for (let p = f.parent; p; p = byId.get(p)?.parent ?? null) if (!expanded.has(p)) return false
    return true
  })
  // The one tab stop: the node last focused, else the selected one if it is
  // showing, else the first.
  const tabStop =
    (focusId && visible.some((v) => v.node.id === focusId) && focusId) ||
    (current && visible.some((v) => v.node.id === current) && current) ||
    visible[0]?.node.id

  const focus = (id: string | undefined) => {
    if (!id) return
    setFocusId(id)
    items.current.get(id)?.focus()
  }
  const toggle = (id: string, open?: boolean) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (open ?? !next.has(id)) next.add(id)
      else next.delete(id)
      return next
    })
  const activate = (node: TreeNode) => {
    if (node.disabled) return
    if (node.children?.length) toggle(node.id)
    setOwn(node.id)
    onSelect?.(node.id)
  }

  const onKeyDown = (e: KeyboardEvent, f: Flat) => {
    const at = visible.findIndex((v) => v.node.id === f.node.id)
    const branch = !!f.node.children?.length
    const open = expanded.has(f.node.id)
    const moves: Record<string, () => void> = {
      ArrowDown: () => focus(visible[at + 1]?.node.id),
      ArrowUp: () => focus(visible[at - 1]?.node.id),
      Home: () => focus(visible[0]?.node.id),
      End: () => focus(visible[visible.length - 1]?.node.id),
      ArrowRight: () => {
        if (!branch) return
        if (!open) toggle(f.node.id, true)
        else focus(f.node.children?.[0]?.id)
      },
      ArrowLeft: () => {
        if (branch && open) toggle(f.node.id, false)
        else if (f.parent) focus(f.parent)
      },
    }
    if (moves[e.key]) {
      e.preventDefault()
      moves[e.key]()
      return
    }
    // A link answers Enter itself; a branch or a plain node is activated here.
    if ((e.key === 'Enter' && !f.node.href) || e.key === ' ') {
      e.preventDefault()
      activate(f.node)
      return
    }
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase()
      const after = visible.slice(at + 1).concat(visible.slice(0, at + 1))
      focus(after.find((v) => v.node.label.toLowerCase().startsWith(k))?.node.id)
    }
  }

  const render = (list: TreeNode[], level: number) =>
    list.map((node) => {
      const f = byId.get(node.id)!
      const branch = !!node.children?.length
      const open = branch && expanded.has(node.id)
      const isSelected = current === node.id
      const groupId = `${base}-${node.id.replace(/\W+/g, '-')}-group`
      // The kit's spacers: 16 at the first level, then 24 a step with icons and
      // 16 without; a leaf adds the 24 a branch spends on its caret.
      const indent = 16 + (level - 1) * (icons ? 24 : 16) + (branch ? 0 : 24)
      const common = {
        ref: (el: HTMLElement | null) => {
          if (el) items.current.set(node.id, el)
          else items.current.delete(node.id)
        },
        role: 'treeitem',
        tabIndex: node.id === tabStop ? 0 : -1,
        'aria-level': level,
        'aria-selected': isSelected,
        'aria-expanded': branch ? open : undefined,
        'aria-owns': open ? groupId : undefined,
        'aria-disabled': node.disabled || undefined,
        'aria-current': isSelected && node.href ? ('page' as const) : undefined,
        className: [styles.node, isSelected ? styles.selected : '', node.disabled ? styles.disabled : ''].join(' '),
        style: { '--indent': `${indent}px` } as CSSProperties,
        onFocus: () => setFocusId(node.id),
        onKeyDown: (e: KeyboardEvent) => onKeyDown(e, f),
        onClick: () => activate(node),
      }
      const content = (
        <>
          {branch ? <KitIcon name={open ? 'caret-down' : 'caret-right'} className={styles.glyph} /> : null}
          {icons ? <KitIcon name={branch ? 'folder' : 'document'} className={styles.glyph} /> : null}
          <span className={styles.text}>{node.label}</span>
        </>
      )
      return (
        <li key={node.id} role="none">
          {node.href && !node.disabled ? (
            <a {...common} href={node.href}>
              {content}
            </a>
          ) : (
            <div {...common}>{content}</div>
          )}
          {open ? (
            <ul id={groupId} role="group" className={styles.group}>
              {render(node.children!, level + 1)}
            </ul>
          ) : null}
        </li>
      )
    })

  return (
    <ul role="tree" aria-label={label} className={[styles.tree, styles[size], className ?? ''].join(' ')}>
      {render(nodes, 1)}
    </ul>
  )
}
