import type { ComponentDocConfig } from '../types'
import { PaginationPreview, PaginationStill } from './pagination-preview'

export function paginationDoc(): ComponentDocConfig {
  return {
    slug: 'pagination',
    name: 'Pagination',
    kitTitle: 'Pagination',
    figmaNode: '2799:20761',
    lede: 'Moves a reader through a set too long for one page, either page by page or by number. Use the table bar under a Data table, and the page numbers under a list of results.',
    description:
      'Page-number navigation and the table bar, at three sizes, with the table bar’s Advanced, Simple and Unbound types. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave. Data table’s footer is its home in a table.',
    livePreview: <PaginationPreview />,
    install: "import { Pagination, PaginationNav } from '@/components/ui/pagination'",
    anatomy: <PaginationStill form="advanced" />,
    anatomyLede:
      'The table bar: items per page, the range shown, a page picker with its total, then previous and next, each section divided by a subtle rule. The page-number form is the kit’s second set: the arrows around the page items, the current one marked.',
    variantsLede:
      'Size sets the row: 48, 40 or 32. The table bar has three types; Simple and Unbound look the same, and differ in whether the total is known.',
    variants: [
      { label: 'Nav: Large', node: <PaginationStill form="nav" /> },
      { label: 'Nav: Medium', node: <PaginationStill form="nav" size="md" page={15} /> },
      { label: 'Nav: Small', node: <PaginationStill form="nav" size="sm" page={30} /> },
      { label: 'Table bar: Advanced', node: <PaginationStill form="advanced" /> },
      { label: 'Table bar: Simple', node: <PaginationStill form="simple" /> },
      { label: 'Table bar: Unbound', node: <PaginationStill form="unbound" /> },
      { label: 'Table bar: Small', node: <PaginationStill form="advanced" size="sm" /> },
    ],
    dos: [
      'Use the table bar under a Data table, in its footer slot, so the table and its pages read as one.',
      'Use Unbound when the total is not known, and tell it whether there is a next page with hasNext.',
      'Return to page 1 when the page size changes; the component does this for you.',
      'Keep the page numbers short. Seven entries, ellipses included, is the kit’s window.',
    ],
    donts: [
      'Restyle the arrows or the pickers. They are the governed Button and Select.',
      'Mark the current page by colour alone. It takes the weight and the rule, and aria-current.',
      'Use pagination for a list short enough to show at once.',
      'Put the page numbers in a table footer. That is the table bar’s place.',
    ],
    a11y: [
      ['Roles', <>The page numbers sit in a <code>nav</code> landmark, each item a button named “Page n”, the current one with <code>aria-current=&quot;page&quot;</code>. The table bar is a labelled group.</>],
      ['Keyboard', 'Tab reaches the arrows, the items and the pickers in order. The ellipsis is a native select, so the arrow keys move through the pages it hides.'],
      ['Names', 'The arrows are “Previous page” and “Next page”; the page picker keeps “Page” as its name with the label hidden; the ellipsis names the range it hides.'],
      ['Focus', <>The items take a 2px <code>--graphite-primary-focus</code> ring inside their square; the arrows and pickers bring their own.</>],
    ],
    parityLede:
      'The kit’s Pagination page has two public sets: Pagination - Nav and Pagination - Table bar. The code exports one component for each.',
    parity: [
      ['Set', 'Pagination - Nav', 'PaginationNav', 'Square items between the arrows; the current page SemiBold with a 16px primary rule.'],
      ['Set', 'Pagination - Table bar', 'Pagination', 'On elevation-01 with an outline-subtle top rule and dividers.'],
      ['Size', 'Large · Medium · Small', 'size', '48, 40 and 32. The kit draws the bar 50, 42 and 34, two over its controls, the same +2 Button carries; built at the controls’ height plus the rule.'],
      ['Type', 'Advanced · Simple · Unbound', 'type', 'Advanced: items per page, the range, the page picker and its total. Simple and Unbound: “Page n”. The kit draws the last two identically.'],
      ['Nav: Overflow', 'Boolean', 'itemsShown', 'The ellipsis opens the hidden pages as a native select, the kit’s Overflow item and its menu.'],
      ['Item state', 'Enabled · Hover · Focus · Selected', '—', 'Hover (elevation-02) and Focus are pseudo-classes (governance rule 7); Selected is the current page.'],
    ],
    related: [
      { href: '/docs/components/data-table', title: 'Data table', why: 'the table bar’s home' },
      { href: '/docs/components/select', title: 'Select', why: 'the pickers it is built from' },
      { href: '/docs/components/button', title: 'Button', why: 'the arrows' },
    ],
  }
}
