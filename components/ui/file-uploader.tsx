'use client'

import { useId, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Button } from './button'
import { FieldStatusIcon } from './field-status'
import styles from './file-uploader.module.scss'

/**
 * Contract: docs/contracts/file-uploader.md (1.0.0)
 *
 * The kit's File uploader (5465:294860): Type (Default, Drag and drop) × Size,
 * with its file list drawn from the private _File uploader file item set. The
 * component picks files and lists them; uploading and validating them is the
 * caller's, which reports back through each file's status.
 */

export type FileUploaderSize = 'sm' | 'md' | 'lg'

/** The kit's file item states: Uploaded, Loading, Success, and Error short or long. */
export type UploaderFile = {
  id: string
  name: string
  /** `uploaded` (removable, the default), `uploading`, `complete` or `error`. */
  status?: 'uploaded' | 'uploading' | 'complete' | 'error'
  /** The error's one line. With `errorDetail`, the kit's Error long. */
  error?: string
  errorDetail?: string
}

type FileUploaderProps = {
  /** The kit's Type: a primary Button (Default) or a drop box (Drag and drop). */
  type?: 'button' | 'dropzone'
  size?: FileUploaderSize
  label: string
  /** The kit's Desc. text: what may be uploaded. */
  description?: string
  buttonLabel?: string
  dropLabel?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  files?: UploaderFile[]
  /** Called with the files picked or dropped. */
  onAdd: (files: File[]) => void
  onRemove?: (id: string) => void
  id?: string
}

const BUTTON_SIZE = { sm: 'sm', md: 'md', lg: 'lg' } as const

/** The kit's Status icon / Success, Checkmark--filled: a circle with the tick cut out. */
function SuccessGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M8 1A7 7 0 1 0 8 15A7 7 0 1 0 8 1ZM7 10.8L4.5 8.3L5.3 7.5L7 9.2L10.71 5.5L11.5 6.29L7 10.8Z"
      />
    </svg>
  )
}

function FileItem({
  file,
  disabled,
  onRemove,
}: {
  file: UploaderFile
  disabled: boolean
  onRemove?: (id: string) => void
}) {
  const status = file.status ?? 'uploaded'
  const errored = status === 'error'
  const errorId = `${file.id}-error`
  const remove = onRemove ? (
    <button
      type="button"
      className={styles.remove}
      aria-label={`Remove ${file.name}`}
      aria-describedby={errored && file.error ? errorId : undefined}
      disabled={disabled}
      onClick={() => onRemove(file.id)}
    >
      <KitIcon name="cross-small" />
    </button>
  ) : null

  return (
    <li className={[styles.item, errored ? styles.errored : ''].join(' ')}>
      <div className={styles.row}>
        <span className={styles.name} title={file.name}>
          {file.name}
        </span>
        <span className={styles.trail}>
          {status === 'uploading' ? (
            <span className={styles.loading} role="status" aria-label={`Uploading ${file.name}`}>
              <KitIcon name="spinner" className={styles.spinner} />
            </span>
          ) : status === 'complete' ? (
            <span className={styles.complete} role="img" aria-label="Uploaded">
              <SuccessGlyph />
            </span>
          ) : (
            <>
              {errored ? <FieldStatusIcon className={styles.status} /> : null}
              {remove}
            </>
          )}
        </span>
      </div>
      {errored && file.error ? (
        <div id={errorId} className={styles.errorBody}>
          <span className={file.errorDetail ? styles.errorTitle : styles.errorText}>{file.error}</span>
          {file.errorDetail ? <span className={styles.errorText}>{file.errorDetail}</span> : null}
        </div>
      ) : null}
    </li>
  )
}

export function FileUploader({
  type = 'button',
  size = 'lg',
  label,
  description,
  buttonLabel = 'Add file',
  dropLabel = 'Drag and drop files here or click to upload',
  accept,
  multiple = true,
  disabled = false,
  files = [],
  onAdd,
  onRemove,
  id,
}: FileUploaderProps) {
  const auto = useId()
  const baseId = id ?? auto
  const labelId = `${baseId}-label`
  const descId = `${baseId}-description`
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  const take = (list: FileList | null) => {
    if (list && list.length) onAdd(multiple ? Array.from(list) : [list[0]])
  }

  const fileInput = (
    <input
      ref={input}
      type="file"
      className={styles.fileInput}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      // The button form's trigger is the Button; the drop box's is this input.
      tabIndex={type === 'button' ? -1 : undefined}
      aria-hidden={type === 'button' || undefined}
      aria-describedby={type === 'dropzone' && description ? descId : undefined}
      onChange={(e) => {
        take(e.target.files)
        e.target.value = ''
      }}
    />
  )

  const drag = (on: boolean) => (e: DragEvent) => {
    e.preventDefault()
    if (!disabled) setOver(on)
  }

  return (
    <div
      className={[styles.uploader, styles[size], disabled ? styles.isDisabled : ''].join(' ')}
      role="group"
      aria-labelledby={labelId}
    >
      <div className={styles.head}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {description ? (
          <p id={descId} className={styles.description}>
            {description}
          </p>
        ) : null}
      </div>
      {type === 'button' ? (
        <div className={styles.trigger}>
          <Button
            variant="primary"
            size={BUTTON_SIZE[size]}
            disabled={disabled}
            aria-describedby={description ? descId : undefined}
            onClick={() => input.current?.click()}
          >
            {buttonLabel}
          </Button>
          {fileInput}
        </div>
      ) : (
        <label
          className={[styles.drop, over ? styles.isOver : ''].join(' ')}
          onDragEnter={drag(true)}
          onDragOver={drag(true)}
          onDragLeave={drag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            if (!disabled) take(e.dataTransfer.files)
          }}
        >
          <span className={styles.dropText}>{dropLabel}</span>
          {fileInput}
        </label>
      )}
      {files.length ? (
        <ul className={styles.list} aria-label={`${label}: files`}>
          {files.map((f) => (
            <FileItem key={f.id} file={f} disabled={disabled} onRemove={onRemove} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
