'use client'

import { Grid, Column, Accordion, AccordionItem } from '@carbon/react'
import { Reveal } from '@/components/reveal'

// The kit draws only the first answer open; the other four questions are
// collapsed, so their copy is written here against what the repo actually
// does rather than invented.
const FAQS = [
  {
    q: 'Is Graphite UI production ready?',
    a: 'Twenty-two components carry a versioned contract and are checked against the kit on every build. The kit ships more than that, and anything without a contract is labelled ungoverned on its own page rather than left for you to find out.',
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
export function Faq() {
  return (
    <section className="section section--faq band--secondary" id="faq">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <Reveal>
            <h2 className="section__title faq__title">
              Questions people actually ask
            </h2>
            <Accordion size="lg" className="faq__accordion">
              {FAQS.map((item) => (
                <AccordionItem key={item.q} title={item.q}>
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
