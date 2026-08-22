'use client'

import { useState } from 'react'
import styles from './avatar.module.scss'

/** Contract: docs/contracts/avatar.md (1.2.1) */
type AvatarProps = {
  /**
   * Always required, not just when there is no image: it is the fallback the
   * contract guarantees, so it has to exist before the image can fail.
   */
  initials: string
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square'
  /**
   * The label is not optional. A status dot with no accessible label leaves
   * color as the only carrier of meaning, which the contract forbids.
   */
  status?: { label: string }
}

export function Avatar({
  initials,
  src,
  alt,
  size = 'md',
  shape = 'circle',
  status,
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <span className={`${styles.avatar} ${styles[size]} ${styles[shape]}`}>
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt={alt ?? ''}
          // Server-rendered markup starts loading before React hydrates, so an
          // image that fails early fires its error event with no handler
          // attached and onError never runs. A complete image with no intrinsic
          // width has already failed, so re-check that on mount.
          ref={(node) => {
            if (node?.complete && node.naturalWidth === 0) setFailed(true)
          }}
          // Failure falls back to initials — never a broken-image icon and
          // never an empty circle.
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles.initials} aria-hidden={alt ? undefined : true}>
          {initials}
        </span>
      )}
      {status ? (
        <span className={styles.status} role="img" aria-label={status.label} />
      ) : null}
    </span>
  )
}
