'use client'

import { Grid, Column, Accordion, AccordionItem } from '@carbon/react'
import { Reveal } from '@/components/reveal'

const FAQS = [
  {
    q: 'What exactly do I get from one colour?',
    a: 'Three perceptual ramps (accent, neutral, neutral variant), a set of semantic tokens for light and dark, a WCAG contrast report for every pairing, and a generative pattern library, all derived from the single hex you provide.',
  },
  {
    q: 'How does the contrast auto-fix work?',
    a: 'Each foreground/background pairing is measured against WCAG 2.1. If a pair falls short of its target (4.5:1 for text, 3:1 for UI elements), the foreground is walked along its own ramp until it passes, so the fix stays on-brand.',
  },
  {
    q: 'Does it work with my existing components?',
    a: 'Yes. Graphite UI exports thirty-three CSS custom properties, plus raw CSS and JSON for everything else. This entire site is themed through that mapping; try the colour control in the header.',
  },
  {
    q: 'Can I control the output, or is it fully automatic?',
    a: 'Both. Defaults are opinionated so you can ship immediately, and the tone stops, ramp rules, and contrast targets are all exposed when you need the system to match an existing brand exactly.',
  },
  {
    q: 'What are the patterns for?',
    a: 'Brand imagery that scales without a photoshoot: campaign art, empty states, social cards, section dividers. Compositions are generated from your palette and export at 1600 × 900, so no two are alike.',
  },
  {
    q: 'Is the engine really open source?',
    a: 'Yes. The colour engine and pattern library are MIT licensed, including commercial use. Nothing about the core is gated.',
  },
]

export function Faq() {
  return (
    <section className="section section--faq" id="faq">
      <Grid>
        <Column sm={4} md={8} lg={{ span: 6, offset: 1 }}>
          <Reveal>
            <p className="section__eyebrow">FAQ</p>
            <h2 className="section__title">Questions, answered</h2>
            <p className="section__subtitle">
              How the engine works, what it exports, and where it fits in an
              existing stack. Anything missing? Ask us.
            </p>
          </Reveal>
        </Column>
        <Column sm={4} md={8} lg={{ span: 8, offset: 0 }}>
          <Reveal>
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
