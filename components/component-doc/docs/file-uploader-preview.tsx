'use client'

import { useEffect, useRef, useState } from 'react'
import { FileUploader } from '@/components/ui/file-uploader'
import type { FileUploaderSize, UploaderFile } from '@/components/ui/file-uploader'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'

type Type = 'button' | 'dropzone'

const LIMIT = 500 * 1024
const DESCRIPTION = 'Max file size is 500kb. Supported file types are .jpg and .png.'

function codeFor(type: Type, size: FileUploaderSize, disabled: boolean) {
  const props = [
    type === 'button' ? '' : '\n  type="dropzone"',
    size === 'lg' ? '' : `\n  size="${size}"`,
    disabled ? '\n  disabled' : '',
  ].join('')
  return `const [files, setFiles] = useState<UploaderFile[]>([])\n\n<FileUploader${props}\n  label="Upload files"\n  description="${DESCRIPTION}"\n  accept=".jpg,.png"\n  files={files}\n  onAdd={(picked) => upload(picked)} // sets each file's status\n  onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))}\n/>`
}

/**
 * Both types and every size, live. Picked files are not sent anywhere: each
 * one shows uploading for a moment, then complete, or an error when it is over
 * the limit, the way a caller reports back.
 */
export function FileUploaderPreview() {
  const [type, setType] = useState<Type>('button')
  const [size, setSize] = useState<FileUploaderSize>('lg')
  const [disabled, setDisabled] = useState(false)
  const [files, setFiles] = useState<UploaderFile[]>([])
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const add = (picked: File[]) => {
    const fresh = picked.map((f, i) => ({ id: `${Date.now()}-${i}-${f.name}`, name: f.name, size: f.size }))
    setFiles((prev) => [...prev, ...fresh.map((f) => ({ id: f.id, name: f.name, status: 'uploading' as const }))])
    timers.current.push(
      window.setTimeout(() => {
        setFiles((prev) =>
          prev.map((p) => {
            const f = fresh.find((x) => x.id === p.id)
            if (!f) return p
            return f.size > LIMIT
              ? { ...p, status: 'error', error: 'File exceeds size limit.', errorDetail: '500kb max file size. Select a new file and try again.' }
              : { ...p, status: 'complete' }
          }),
        )
      }, 1200),
    )
  }

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Type"
            size="sm"
            value={type}
            onChange={(v) => setType(v as Type)}
            options={[
              { value: 'button', label: 'Default' },
              { value: 'dropzone', label: 'Drag and drop' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as FileUploaderSize)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Dropdown
            label="State"
            size="sm"
            value={disabled ? 'disabled' : 'enabled'}
            onChange={(v) => setDisabled(v === 'disabled')}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
            ]}
          />
        </>
      }
      preview={
        <FileUploader
          type={type}
          size={size}
          disabled={disabled}
          label="Upload files"
          description={DESCRIPTION}
          accept=".jpg,.png"
          files={files}
          onAdd={add}
          onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))}
        />
      }
      code={codeFor(type, size, disabled)}
    />
  )
}

/** The file item states, for the server-rendered page: it owns its own list. */
export const SAMPLE_FILES: Record<string, UploaderFile[]> = {
  uploaded: [
    { id: 'a', name: 'cover.png' },
    { id: 'b', name: 'portrait-of-the-team-at-the-offsite.jpg' },
  ],
  states: [
    { id: 'u', name: 'cover.png' },
    { id: 'l', name: 'banner.jpg', status: 'uploading' },
    { id: 'c', name: 'logo.png', status: 'complete' },
    { id: 'e', name: 'photo.jpg', status: 'error', error: 'File exceeds size limit.' },
    {
      id: 'x',
      name: 'scan.png',
      status: 'error',
      error: 'File exceeds size limit.',
      errorDetail: '500kb max file size. Select a new file and try again.',
    },
  ],
}

export function FileUploaderStill({
  type = 'button',
  size,
  disabled,
  files = 'uploaded',
}: {
  type?: Type
  size?: FileUploaderSize
  disabled?: boolean
  files?: keyof typeof SAMPLE_FILES | 'none'
}) {
  const [list, setList] = useState(files === 'none' ? [] : SAMPLE_FILES[files])
  return (
    <FileUploader
      type={type}
      size={size}
      disabled={disabled}
      label="Upload files"
      description={DESCRIPTION}
      files={list}
      onAdd={() => {}}
      onRemove={(id) => setList((l) => l.filter((x) => x.id !== id))}
    />
  )
}
