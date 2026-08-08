'use client'

import { useState } from 'react'
import {
  Grid,
  Column,
  ContentSwitcher,
  Switch,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react'
import { Reveal } from '@/components/reveal'
import {
  GenerativeArt,
  type GenerativeArtHandle,
} from '@/components/generative-art'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { makeRamps, buildTheme, buildStates } from '@/lib/color.js'
import {
  RampRow,
  SemanticTable,
  StatesMatrix,
  Toast,
  useCopy,
} from '@/components/studio'
import { Renew, Download } from '@carbon/icons-react'

const VIEWS = [
  {
    key: 'composition',
    label: 'Composition',
    title: 'A grid that assembles itself',
    body: 'Twenty tile types laid out on a 12×10 unit grid with variable spans. Neighbouring panels negotiate color and pattern so nothing clusters. Select a panel to reroll it, or regenerate the whole composition.',
  },
  {
    key: 'ramps',
    label: 'Ramps',
    title: 'Three ramps from one input',
    body: 'Your source color is resolved in OKLab, then sampled at fixed tone stops to build an accent ramp plus two neutrals. Perceptual spacing means every step reads as an even move, at any hue.',
  },
  {
    key: 'contrast',
    label: 'Contrast',
    title: 'Accessible by construction',
    body: 'Every foreground/background pairing is measured against WCAG 2.1 and nudged along its ramp until it passes. You get the contrast report as an artefact, not as an afterthought.',
  },
] as const

export function SystemExplorer({ embedded = false }: { embedded?: boolean }) {
  const [index, setIndex] = useState(0)
  const [art, setArt] = useState<GenerativeArtHandle | null>(null)
  const { copiedKey, toast, copy } = useCopy()
  const {
    sourceHex,
    lightBundle,
    darkBundle,
    level,
    theme,
    setTheme,
  } = useTheme()
  // The token panel's Light/Dark tabs are the site's theme switch: inspecting a
  // theme and living in it are the same action, so there is one source of truth
  // for which mode you are in.
  const modeIndex = theme === 'white' ? 0 : 1
  const activeHex = sourceHex || COVER_SOURCE_HEX
  const ramps = makeRamps(activeHex)
  const active = VIEWS[index]

  // Falls back to locally built themes if the provider has not produced a
  // bundle yet, so both panels are populated on first paint. color.js is
  // untyped, so the engine's shape is declared here at the boundary.
  type Built = {
    tokens: Record<string, { hex: string; ramp: string; tone: number }>
    contrast: Record<
      string,
      { ratio: number; passes: boolean; level: string; fixed?: boolean }
    >
    states: {
      primary: Record<string, { hex: string; ramp: string; tone: number }>
      focus: { hex: string; ramp: string; tone: number }
    }
  }
  const buildFallback = (mode: 'light' | 'dark') => {
    const t = buildTheme(mode, ramps, level)
    return { ...t, states: buildStates(t.tokens, ramps, mode) }
  }
  const light = (lightBundle ?? buildFallback('light')) as unknown as Built
  const dark = (darkBundle ?? buildFallback('dark')) as unknown as Built
  const panels = [
    { key: 'light', label: 'Light', data: light },
    { key: 'dark', label: 'Dark', data: dark },
  ]

  const body = (
    <Reveal>
      <div className="showcase__switcher">
        <ContentSwitcher
          selectedIndex={index}
          onChange={({ index }) => setIndex(index ?? 0)}
          size="lg"
        >
          {VIEWS.map((view) => (
            <Switch key={view.key} name={view.key} text={view.label} />
          ))}
        </ContentSwitcher>
      </div>

      <div className="showcase__stage">
        <div className="showcase__glow" aria-hidden="true" />
        <div className="showcase__frame" key={active.key}>
          {active.key === 'composition' && (
            <div className="hero__canvas">
              <GenerativeArt interactive onReady={setArt} />
            </div>
          )}

          {active.key === 'ramps' && (
            <div className="ramp-stack">
              {(['accent', 'neutral', 'neutralVariant'] as const).map(
                (name) => (
                  <RampRow
                    key={name}
                    name={name}
                    ramp={ramps[name]}
                    copiedKey={copiedKey}
                    onCopy={copy}
                  />
                ),
              )}
              <p className="ramp-stack__hint">
                Select any swatch to copy its hex. The outlined stop is where
                your source color landed.
              </p>
            </div>
          )}

          {active.key === 'contrast' && (
            <div className="studio-panel">
              <Tabs
                selectedIndex={modeIndex}
                onChange={({ selectedIndex }) =>
                  setTheme(selectedIndex === 0 ? 'white' : 'g100')
                }
              >
                <TabList aria-label="Theme mode">
                  {panels.map((p) => (
                    <Tab key={p.key}>{p.label}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {panels.map((p) => (
                    <TabPanel key={p.key}>
                      <SemanticTable theme={p.data} />
                      <h4 className="studio-panel__heading">
                        Interaction states, primary
                      </h4>
                      <StatesMatrix states={p.data.states} />
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {active.key === 'composition' && (
        <div className="canvas-toolbar">
          <p className="canvas-toolbar__hint">
            Select any panel to reshuffle it
          </p>
          <div className="canvas-toolbar__actions">
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Renew}
              onClick={() => art?.regenerate()}
            >
              Regenerate
            </Button>
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Download}
              onClick={() => art?.exportPng()}
            >
              Export PNG
            </Button>
          </div>
        </div>
      )}

      <Toast message={toast} />

      <div className="showcase__caption">
        <h3 className="showcase__caption-title">{active.title}</h3>
        <p className="showcase__caption-body">{active.body}</p>
      </div>
    </Reveal>
  )

  // Embedded in the hero, the explorer is the product shot and inherits the
  // hero's grid and heading. Standalone, it brings its own section chrome.
  if (embedded) return body

  return (
    <section className="section section--showcase" id="explore">
      <Grid>
        <Column sm={4} md={8} lg={{ span: 12, offset: 2 }}>
          {body}
        </Column>
      </Grid>
    </section>
  )
}
