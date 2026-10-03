'use client'

import { useRef, useState } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import styles from './file-upload.module.scss'

export function FileUploadCard() {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [names, setNames] = useState<string[]>([])

  const take = (files: FileList | null) => {
    if (files && files.length) setNames(Array.from(files).map((f) => f.name))
  }

  return (
    <CardShell id="file-upload">
      <CardHeader title="File Upload" description="Drag and drop or browse" />
      <div
        className={`${styles.drop} ${over ? styles.over : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          take(e.dataTransfer.files)
        }}
      >
        <span className={styles.cell}>
          <KitIcon name="cloud-upload" size={24} aria-hidden="true" />
        </span>
        <p className={styles.title}>Upload files</p>
        <p className={styles.hint}>
          {names.length ? names.join(', ') : 'PNG, JPG, PDF up to 10MB'}
        </p>
        <input
          ref={input}
          type="file"
          multiple
          hidden
          onChange={(e) => take(e.target.files)}
        />
        <Button
          variant="primary"
          className={styles.button}
          onClick={() => input.current?.click()}
        >
          Browse Files
        </Button>
      </div>
    </CardShell>
  )
}
