'use client'

import { Grid, Column } from '@carbon/react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Reveal } from '@/components/reveal'

// The kit draws only the first answer open; the other questions are
// collapsed, so their copy is written here against what the repo actually
// does rather than invented.
const faqs = (governed: number) => [
  {
    q: 'Is Graphite UI production ready?',
    a: `Not as an install yet. Today you can clone the repo, browse ${governed} React components, and export a theme as CSS or JSON. There is no npm package. Each component has a versioned spec that the code is checked against on every build.`,
  },
  {
    q: 'Is it free, and what is it built with?',
    a: 'Yes. The code is MIT licensed and free for personal and commercial use. Built with React 19, Next.js 16 and SCSS modules. The Graphite UI, Simorka Designs and SD System names and logos are not covered by the licence.',
  },
  {
    q: 'Does it require Carbon?',
    a: 'No, but it is built on it today. The components style themselves from the --graphite-* tokens, and the engine also emits a Carbon compatibility layer so an existing Carbon build repaints without touching a component. Moving off Carbon is a tracked migration, not a rewrite.',
  },
  {
    q: 'Can I use my own brand color?',
    a: 'That is the only input. Any hex is resolved in OKLab and sampled at fixed tone stops to build the ramps, the roles and both themes. One caveat worth knowing: a source that sits on a status hue collapses the two, so a red brand color resolves primary and danger to nearly the same value.',
  },
  {
    q: 'How do the Figma kit and the code stay in step?',
    a: 'The kit is canonical: where it and a contract disagree, the kit wins and the contract is corrected. Three checks in CI enforce it, reading committed snapshots of the kit rather than the network, so they run offline. Re-extracting a snapshot is still a manual step.',
  },
  {
    q: 'How do I contribute a component?',
    a: 'Start with the contract, not the code. It declares the roles and variables the component may touch, and drift-check then holds the implementation to it. Main is protected, so everything lands through a pull request with the governance job green.',
  },
]

/** Kit section "06 FAQ" (11865:3162). */
export function Faq({ governed }: { governed: number }) {
  return (
    <section className="section section--faq" id="faq">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <h2 className="section__title faq__title">
              Questions people actually ask
            </h2>
            <Accordion
              type="single"
              collapsible
              size="lg"
              defaultValue="faq-0"
              className="faq__accordion"
            >
              {faqs(governed).map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`} title={item.q}>
                  <p className="faq__answer">{item.a}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
