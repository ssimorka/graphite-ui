'use client'

import { Grid, Column } from '@carbon/react'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { Reveal } from '@/components/reveal'
import { CARBON_VAR_COUNT } from '@/components/carbon-compat'

// The kit draws only the first answer open; the other questions are
// collapsed, so their copy is written here against what the repo actually
// does rather than invented.
const faqs = (governed: number) => [
  {
    q: 'Is Graphite UI production ready?',
    a: `Yes, for the theme and the ${governed} components: they install today with the shadcn CLI, and automated checks compare each one to its contract on every change. The Figma kit is a published library. Graphite is at v0.1.0, so expect changes. There is no npm package.`,
  },
  {
    q: 'Is it free, and what is it built with?',
    a: 'Yes. The code is MIT licensed and free for personal and commercial use. Built with React 19, Next.js 16 and SCSS modules. The Graphite UI and Simorka Designs names and logos, including the SD System mark in the footer, are not covered by the licence.',
  },
  {
    q: 'Does it require Carbon?',
    a: `No. Graphite’s components, theme file and theme provider do not use Carbon. The Figma kit descends from IBM’s Carbon Design System, and this site’s own chrome still runs on Carbon, mapped to Graphite’s colors through ${CARBON_VAR_COUNT} --cds-* variables while it moves off.`,
  },
  {
    q: 'Can I use my own brand color?',
    a: 'That is the only input. Any hex is resolved in OKLab and sampled at fixed tone stops to build the ramps, the roles and both themes. One caveat worth knowing: a source that sits on a status hue collapses the two, so a red brand color resolves primary and danger to nearly the same value.',
  },
  {
    q: 'How do the Figma kit and the code stay in step?',
    a: 'Automated checks compare each component to its contract, and each token to a saved copy of the Figma kit. Where the kit and a contract disagree, the kit wins and the contract is updated. Refreshing that copy from Figma is a manual step.',
  },
  {
    q: 'How do I contribute a component?',
    a: 'Start with the contract, not the code: it lists what the component may use, and the checks compare the code against it. Every change lands through a pull request with the checks passing. The contributing guide on GitHub has the details.',
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
