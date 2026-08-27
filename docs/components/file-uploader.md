# File uploader

Lets users select one or more files to upload, either via a standard button trigger or a drag-and-drop zone.

**Figma:** [File uploader](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=5465-294860)
**Figma node ID:** `5465:294860` — page "02 Components – File uploader"
**Internal building blocks (do not use directly):** `_File uploader - Drag and drop box states` (`3183:29103`), `_File uploader file item` (`3199:35182`)

## Variant properties

| Property | Options |
|---|---|
| Type | Default, Drag and drop |
| Size | Large, Medium, Small |
| State | Enabled, Disabled, Skeleton |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Files | Boolean | shows/hides the uploaded file list |
| Label text | Text | e.g. "Upload files" |
| Desc. text | Text | constraint copy, e.g. file size/type limits |

## File item states (from `_File uploader file item`)

Uploaded, Loading, Success, Focus, Error short, Error long — drive these from actual upload progress/response in code rather than hardcoding a single state.

## When to use

- **Default** — button-triggered file picker, more compact.
- **Drag and drop** — larger drop zone, better for bulk or primary-flow uploads.

## Do / Don't

- Do surface the file constraints (size, type) in the Desc. text — it's a first-class property, not an afterthought.
- Don't skip the Error states in implementation — both short and long error messaging exist for a reason (long for detailed explanations).

---
*Generated from Figma component set `5465:294860` — regenerate if variant properties change.*
