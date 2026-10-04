import type { ComponentDocConfig } from '../types'
import { FileUploaderPreview, FileUploaderStill } from './file-uploader-preview'

export function fileUploaderDoc(): ComponentDocConfig {
  return {
    slug: 'file-uploader',
    name: 'File uploader',
    kitTitle: 'File uploader',
    figmaNode: '5465:294860',
    lede: 'Lets the reader pick files from their device, or drop them, and shows each one’s progress. It picks and lists files; uploading and checking them is the page’s, which reports back through each file’s status.',
    description:
      'A file picker as a button or a drop box, at three sizes, with a file list that shows uploading, complete and error. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave. The Default trigger is the governed primary Button.',
    livePreview: <FileUploaderPreview />,
    install:
      "import { FileUploader } from '@/components/ui/file-uploader'\nimport type { UploaderFile } from '@/components/ui/file-uploader'",
    anatomy: <FileUploaderStill />,
    anatomyLede:
      'The label and a description of what may be uploaded, the trigger, then a list of the files, each with its name and a remove button. The list sits 16 under the trigger, its items 8 apart.',
    variantsLede:
      'Type is the trigger: a primary Button, or a drop box that also opens the picker. Size sets the Button and the file items, 48, 40 or 32; the drop box is 100 at every size.',
    variants: [
      { label: 'Default: Large', node: <FileUploaderStill /> },
      { label: 'Default: Medium', node: <FileUploaderStill size="md" /> },
      { label: 'Default: Small', node: <FileUploaderStill size="sm" /> },
      { label: 'Drag and drop', node: <FileUploaderStill type="dropzone" /> },
      { label: 'Drag and drop: Small', node: <FileUploaderStill type="dropzone" size="sm" /> },
    ],
    statesLede:
      'Each file shows where it is: uploaded and removable, uploading, complete, or an error with its message, short or with a second line of detail. The drop box takes a 2px primary edge while files are over it or it has focus.',
    states: [
      { label: 'File states', node: <FileUploaderStill files="states" /> },
      { label: 'File states: Small', node: <FileUploaderStill files="states" size="sm" /> },
      { label: 'Disabled', node: <FileUploaderStill disabled /> },
      { label: 'Drag and drop: Disabled', node: <FileUploaderStill type="dropzone" disabled files="none" /> },
    ],
    dos: [
      'Say what may be uploaded in the description: size, type and how many.',
      'Show each file’s progress, and say what went wrong in the error, with what to do next in the detail.',
      'Use the drop box where uploading is the main task on the page.',
      'Let the reader remove a file they picked by mistake.',
    ],
    donts: [
      'Show an error edge without its message.',
      'Upload on the reader’s behalf before they have chosen; picking is theirs.',
      'Restyle the Button. It is the governed primary Button.',
      'Hide the file types the picker accepts. Put them in the description too.',
    ],
    a11y: [
      ['Roles', <>A labelled group. The Default trigger is a Button that opens the native file picker; the drop box is the file input’s <code>label</code>, so clicking or pressing it opens the same picker.</>],
      ['Keyboard', 'Tab reaches the trigger and each remove button. Enter or Space on the trigger, or on the focused drop box, opens the picker.'],
      ['Names', <>The trigger is described by the description. Each remove button is “Remove <em>file</em>”, described by the file’s error; uploading announces as a status.</>],
      ['Focus', <>The drop box takes a 2px <code>--graphite-primary</code> edge; the remove glyph a 2px <code>--graphite-primary-focus</code> ring, 4 out.</>],
      ['Errors', 'An errored file always shows its message, so the edge and the glyph never carry the meaning alone.'],
    ],
    parityLede:
      'The kit’s File uploader page has one public set, with three private ones that draw the drop box and the file items. The code is one component; its file list is the private item, built in.',
    parity: [
      ['Type', 'Default · Drag and drop', 'type', 'button and dropzone.'],
      ['Size', 'Large · Medium · Small', 'size', 'The Button at 48, 40 or 32 (the kit draws Large and Medium 2 over, as Button carries); the items at 48, 40 or 32.'],
      ['State', 'Enabled · Disabled', 'disabled', 'The kit’s Disabled hides the file list, which reads as Files switched off; the code keeps the files, their remove buttons disabled.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Files', 'Boolean', 'files', 'The list shows when there are files.'],
      ['Item state', 'Uploaded · Loading · Success · Focus · Error short · Error long', 'files[].status', 'uploaded, uploading, complete and error; error with errorDetail is Error long. Focus is the remove button’s pseudo-class.'],
      ['Drop box', 'Enabled · Drag + Hover · Focus · Disabled', '—', 'Drag-over is tracked while files are over it; focus is the file input’s. Disabled copy takes the disabled content tone, not the kit’s fill tone.'],
      ['Remove glyph', 'Drop shadow', '—', 'Read as a stray and not drawn.'],
    ],
    related: [
      { href: '/docs/components/button', title: 'Button', why: 'the Default trigger' },
      { href: '/docs/components/notification', title: 'Notification', why: 'for an error about the whole upload' },
      { href: '/docs/components/progress-bar', title: 'Progress bar', why: 'for one long upload' },
    ],
  }
}
