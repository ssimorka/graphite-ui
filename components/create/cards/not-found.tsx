'use client'

import { useState } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { TextInput } from '@/components/ui/text-input'
import { CardShell } from '../card-shell'
import styles from './not-found.module.scss'

export function NotFoundCard() {
  const [query, setQuery] = useState('')
  return (
    <CardShell id="not-found">
      <div className={styles.empty}>
        <p className={styles.title}>404 - Not Found</p>
        <p className={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need below.
        </p>
        <div className={styles.search}>
          <TextInput
            label="Search"
            placeholder="Try searching for pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            trailing={<KitIcon name="search" size={16} aria-hidden />}
          />
        </div>
        <a
          href="#card-not-found"
          className={styles.link}
          onClick={(e) => e.preventDefault()}
        >
          Go to homepage
        </a>
      </div>
    </CardShell>
  )
}
