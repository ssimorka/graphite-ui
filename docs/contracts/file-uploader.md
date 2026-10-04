---
component: File uploader
version: 1.0.0
wave: 2
slots:
  - name: Label
    required: true
    notes: Input Label in on-surface (the kit's text-primary). Names the group.
  - name: Description
    required: false
    notes: The kit's Desc. text, Body/3 in on-surface-variant, 8 under the label. Says what may be uploaded; the trigger is described by it.
  - name: Trigger
    required: true
    notes: The kit's Type. Default is the governed primary Button at the uploader's size; Drag and drop is a 100-tall drop box with a dashed edge, which is itself the file input's label.
  - name: File list
    required: false
    notes: The kit's Files. One item per file, 8 apart, each the private _File uploader file item.
props:
  - name: type
    values: [button, dropzone]
    notes: The kit's Default and Drag and drop.
  - name: size
    values: [sm, md, lg]
    notes: The kit's Size. Sets the Button (32, 40, 48) and the file items (32, 40, 48). The drop box is 100 at every size, as the kit draws it.
  - name: label / description
    notes: The label is required.
  - name: buttonLabel / dropLabel
    notes: The trigger's copy. "Add file" and the kit's "Drag and drop files here or click to upload" by default.
  - name: accept / multiple
    notes: Passed to the file input. Multiple by default.
  - name: disabled
    values: boolean
  - name: files / onAdd / onRemove
    notes: Controlled. onAdd receives the files picked or dropped; uploading and validating them is the caller's, reported back through each file's status (uploaded, uploading, complete, error) and, for an error, error and errorDetail.
tokens:
  - name: on-surface
    usage: The label, file names and the remove glyph (Text/text-primary, Icon/icon-primary), and an Error long's first line.
  - name: on-surface-variant
    usage: The description (Text/text-secondary).
  - name: outline
    usage: The drop box's dashed edge through the strong step (Border/border-strong-01), and the rule over an error message through the subtle step (Border/border-subtle-00).
  - name: primary
    usage: The drop box's copy (Link/link-primary), its drag-over and focus edge (Miscellaneous/interactive), the spinner, the remove glyph's focus ring through primary-focus, and the disabled family through primary-disabled and primary-disabled-content.
  - name: elevation
    usage: File items, elevation-01 (Layer/layer-01).
  - name: info
    usage: The success mark (Support/support-info).
  - name: danger
    usage: An errored item's 2px edge, its status glyph and its message (Support/support-error, Text/text-error).
  - name: background
    usage: The mark inside the error glyph.
  - name: text
    usage: Input Label, Body/3, and Caption/1 for error messages.
  - name: spacing
    usage: The 16 and 8 gaps, item padding and the drop box's padding.
  - name: motion
    usage: The spinner's turn, through the indeterminate duration and its linear ease, as Modal's inline loading turns.
composition_rules:
  - The Default trigger is the governed Button, primary, at the uploader's size. File uploader does not restyle it.
  - The component picks and lists files. It never uploads or validates; the caller sets each file's status.
  - Each remove button is named for its file ("Remove report.pdf") and is described by the file's error when there is one.
prohibitions:
  - No file uploader without a label.
  - No error state on a file without its message. The edge and the glyph never stand alone.
---

### File uploader
- **Slots:** Label (required), description, trigger (required), file list.
- **Props:** type (button, dropzone), size (sm, md, lg), label / description, buttonLabel / dropLabel, accept / multiple, disabled, files / onAdd / onRemove.
- **Tokens:** `elevation-01` items; `outline-strong` dashed drop edge and `primary` on drag and focus; `info` success mark; `danger` errors; `on-surface` and `on-surface-variant` text.
- **Composition rules:** Button for the Default trigger; the caller uploads and validates; remove buttons are named per file.
- **Prohibitions:** No unlabelled uploader; no error without its message.
- **Kit parity** (#270, 1.0.0): the one public set, File uploader (`5465:294860`), on every axis but Skeleton, which has no counterpart by rule, with its private file item and drop box states. Recorded rather than copied: the remove glyph and its wrapper carry a drop shadow, read as a stray and not drawn. The Disabled drop box colours its copy with the disabled fill tone (button-disabled), which all but vanishes on the page; the code uses the disabled content tone the kit gives every other disabled text. The Disabled variants hide the file list, which reads as the Files property switched off rather than a rule; the code keeps a disabled uploader's files in view, with their remove buttons disabled.
