import type { FileUploaderSize } from '@/components/ui/file-uploader'
import type { Example } from '../example-file'

// File uploader's Code tab, from Type, Size and State. The uploader shows the
// files it is given; sending them and reporting each one's status is the
// caller's, so the file carries a stand-in upload that does what the preview
// does: uploading for a moment, then complete, or an error over the limit.

export const TYPES = ['button', 'dropzone'] as const
export type Type = (typeof TYPES)[number]
export const SIZES = ['sm', 'md', 'lg'] as const satisfies readonly FileUploaderSize[]

export const LIMIT = 500 * 1024
export const DESCRIPTION = 'Max file size is 500kb. Supported file types are .jpg and .png.'
export const OVER_LIMIT = { error: 'File exceeds size limit.', errorDetail: '500kb max file size. Select a new file and try again.' }

export const controls = { type: TYPES, size: SIZES, disabled: [false, true] }

type Values = { type: Type; size: FileUploaderSize; disabled: boolean }

export function exampleFor({ type, size, disabled }: Values): Example {
  const props = [
    ...(type === 'button' ? [] : ['  type="dropzone"']),
    ...(size === 'lg' ? [] : [`  size="${size}"`]),
    ...(disabled ? ['  disabled'] : []),
    '  label="Upload files"',
    `  description="${DESCRIPTION}"`,
    '  accept=".jpg,.png"',
    '  files={files}',
    '  onAdd={add}',
    '  onRemove={(id) => setFiles((list) => list.filter((f) => f.id !== id))}',
  ]
  return {
    imports: {
      react: ['useState'],
      '@/components/ui/file-uploader': ['FileUploader', 'type UploaderFile'],
    },
    module: `const LIMIT = 500 * 1024

// Stands in for your upload call.
function upload(file: File) {
  return new Promise<void>((resolve, reject) =>
    setTimeout(() => (file.size > LIMIT ? reject() : resolve()), 1200),
  )
}`,
    body: `const [files, setFiles] = useState<UploaderFile[]>([])

const update = (id: string, patch: Partial<UploaderFile>) =>
  setFiles((list) => list.map((f) => (f.id === id ? { ...f, ...patch } : f)))

function add(picked: File[]) {
  for (const file of picked) {
    const id = crypto.randomUUID()
    setFiles((list) => [...list, { id, name: file.name, status: 'uploading' }])
    upload(file).then(
      () => update(id, { status: 'complete' }),
      () =>
        update(id, {
          status: 'error',
          error: '${OVER_LIMIT.error}',
          errorDetail: '${OVER_LIMIT.errorDetail}',
        }),
    )
  }
}`,
    jsx: `<FileUploader\n${props.join('\n')}\n/>`,
  }
}
