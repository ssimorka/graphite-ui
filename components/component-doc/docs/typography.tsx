import { Typography } from '@/components/ui/typography'
import type { ComponentDocConfig } from '../types'
import styles from './typography.module.scss'
import { TypographyPreview } from './typography-preview'

const SAMPLE = 'One source color becomes every ramp and role.'

export function typographyDoc(): ComponentDocConfig {
  return {
    slug: 'typography',
    name: 'Typography',
    kitTitle: null,
    lede: 'Text that declares its place in the document: a heading level, body copy or a caption. Pick the variant for the structure, not for the size, and style the text some other way if it is not a heading.',
    description:
      'Text that declares its place in the document. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Kept under rule 8: it is the required type of Contained list’s title slot. Sizes come from the kit’s title ladder.',
    livePreview: <TypographyPreview />,
    install: "import { Typography } from '@/components/ui/typography'",
    anatomy: <Typography variant="heading-3">Text content</Typography>,
    anatomyLede:
      'One slot, the text. The variant picks the element and the type step; the component sets no margin, so spacing stays with the layout around it.',
    variantsLede:
      'Seven variants, each a real element. The headings sit on the kit’s title ladder, the UI scale; only display reaches into the editorial heading ladder. Weight is a separate prop.',
    variants: [
      { label: 'Variant: Display (h1)', node: <Typography variant="display">{SAMPLE}</Typography> },
      { label: 'Variant: Heading 1 (h1)', node: <Typography variant="heading-1">{SAMPLE}</Typography> },
      { label: 'Variant: Heading 2 (h2)', node: <Typography variant="heading-2">{SAMPLE}</Typography> },
      { label: 'Variant: Heading 3 (h3)', node: <Typography variant="heading-3">{SAMPLE}</Typography> },
      { label: 'Variant: Heading 4 (h4)', node: <Typography variant="heading-4">{SAMPLE}</Typography> },
      { label: 'Variant: Body (p, default)', node: <Typography>{SAMPLE}</Typography> },
      { label: 'Variant: Caption (span)', node: <Typography variant="caption">{SAMPLE}</Typography> },
      { label: 'Weight: Regular (default)', node: <Typography>{SAMPLE}</Typography> },
      { label: 'Weight: Medium', node: <Typography weight="medium">{SAMPLE}</Typography> },
      { label: 'Weight: Semibold', node: <Typography weight="semibold">{SAMPLE}</Typography> },
      {
        label: 'Inverted, on a primary fill',
        node: (
          <div className={styles.onPrimary}>
            <Typography inverted>{SAMPLE}</Typography>
          </div>
        ),
      },
    ],
    dos: [
      'Choose the heading level from the outline of the page: h2 under h1, h3 under h2.',
      'Use body for paragraphs and caption for short supporting text beside something else.',
      'Set spacing in the layout that composes the text. The component carries no margin on purpose.',
      'Use inverted only for text on a filled primary surface. It is the one colour override the contract allows.',
    ],
    donts: [
      'Pick heading-3 because it looks the right size. The variant is a statement about structure.',
      'Skip a level (h1 straight to h3). The component cannot see its neighbours, so this rule is yours to keep.',
      'Use display for a second h1 on a page that already has one. It renders an h1 too.',
      'Pass a colour through className to make text stand out. Use weight, or a different variant.',
    ],
    a11y: [
      ['Roles', 'Display and heading-1 render h1, heading-2 to heading-4 render h2 to h4, body renders p and caption renders span. Screen reader users navigate by those headings.'],
      ['Structure', 'The no-skipped-levels rule is the page composer’s. The component renders what it is told and cannot check the outline.'],
      ['Contrast', <>Text is <code>on-surface</code>, which is measured against the surface roles at the theme’s target, AA or AAA.</>],
      ['Inverted', <>Inverted text is <code>surface</code>, which is near-white in light themes and near-black in dark ones: the right direction against <code>primary</code> in both.</>],
      ['Resizing', 'Sizes are rem-based tokens, so they follow the reader’s browser font size. Body steps down one size below 672px, as the kit’s Mobile mode does.'],
    ],
    related: [
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'its title slot is Typography' },
      { href: '/docs/components/progress-bar', title: 'Progress bar', why: 'pairs with it for a percentage' },
      { href: '/docs/components/accordion', title: 'Accordion', why: 'when a heading should open a section' },
      { href: '/docs/components/tag', title: 'Tag', why: 'when the text is a status' },
    ],
  }
}
