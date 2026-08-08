'use client'

import { useState } from 'react'
import { Grid, Column, Button, TextInput, TextArea } from '@carbon/react'
import { ArrowRight } from '@carbon/icons-react'
import { Reveal } from '@/components/reveal'

const RECIPIENT_EMAIL = 'stephansimorka@gmail.com'

export function FinalCta() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = 'Graphite UI kit request'
    const body = `Please send the Graphite UI kit to: ${email}\n\n${message}`
    window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="cta" id="cta" aria-labelledby="cta-title">
      <div className="cta__glow" aria-hidden="true" />
      <Grid>
        <Column sm={4} md={8} lg={{ span: 10, offset: 3 }}>
          <Reveal>
            <div className="cta__inner">
              <h2 className="cta__title" id="cta-title">
                Pick a colour. Take the system.
              </h2>
              <p className="cta__subtitle">
                Tell us your email and what you&rsquo;re building, and we&rsquo;ll
                reply with the kit, the token exports, and a five-minute setup
                guide tailored to your stack.
              </p>
              <form
                className="cta__form"
                onSubmit={handleSubmit}
                aria-label="Get the Graphite UI kit"
              >
                <div className="cta__fields">
                  <TextInput
                    id="cta-email"
                    type="email"
                    labelText="Work email"
                    hideLabel
                    placeholder="you@company.com"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextArea
                    id="cta-message"
                    labelText="Message"
                    hideLabel
                    placeholder="What are you building? The more detail, the better the reply."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" renderIcon={ArrowRight}>
                  Learn more
                </Button>
              </form>
            </div>
          </Reveal>
        </Column>
      </Grid>
    </section>
  )
}
