/**
 * The kit's field status glyph (Text input, Text area, Select): Carbon's
 * Warning--alt--filled at 16px, a solid triangle with the "!" cut out of it.
 * Drawn here as two paths, the triangle and the mark, so each component's
 * stylesheet colours them from its own declared tokens: the triangle in danger
 * or warning, the mark in the colour that reads on it. Decorative: the message
 * text carries the meaning.
 */
export function FieldStatusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        data-part="glyph"
        d="M14.5 15H1.5C1.41 15 1.33 14.98 1.25 14.94C1.18 14.89 1.12 14.83 1.07 14.76C1.03 14.69 1 14.6 1 14.52C1 14.43 1.02 14.35 1.06 14.27L7.56 1.77C7.6 1.69 7.66 1.62 7.74 1.57C7.82 1.53 7.91 1.5 8 1.5C8.09 1.5 8.18 1.53 8.26 1.57C8.34 1.62 8.4 1.69 8.44 1.77L14.94 14.27C14.98 14.35 15 14.43 15 14.52C15 14.6 14.97 14.69 14.93 14.76C14.88 14.83 14.82 14.89 14.75 14.94C14.67 14.98 14.59 15 14.5 15Z"
      />
      <path
        data-part="mark"
        d="M7.44 6H8.56V10.5H7.44V6ZM8 13C7.85 13 7.71 12.96 7.58 12.87C7.46 12.79 7.36 12.67 7.31 12.54C7.25 12.4 7.24 12.25 7.26 12.1C7.29 11.96 7.36 11.82 7.47 11.72C7.57 11.61 7.71 11.54 7.85 11.51C8 11.49 8.15 11.5 8.29 11.56C8.42 11.61 8.54 11.71 8.62 11.83C8.71 11.96 8.75 12.1 8.75 12.25C8.75 12.45 8.67 12.64 8.53 12.78C8.39 12.92 8.2 13 8 13Z"
      />
    </svg>
  )
}
