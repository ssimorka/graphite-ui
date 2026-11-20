'use client'

import posthog from 'posthog-js'
import type { ColorMethod } from './color-intent'
import type { KitDestination, KitEdition, KitPlacement } from './kit-links'

// Product analytics, through PostHog. Off unless NEXT_PUBLIC_POSTHOG_KEY is
// set, so development, previews and forks send nothing by default. The key is
// a public project key (it ships in the bundle by design) and lives in the
// deployment's environment, never in the repo.
//
// What is sent: pageviews (client-side route changes included) and the two
// events below. No autocapture and no session recording: the events are the
// whole list, so adding one is a deliberate edit here.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let started = false

/** Starts PostHog once, in the browser, when a key is configured. */
export function initAnalytics(): boolean {
  if (started) return true
  if (!KEY || typeof window === 'undefined') return false
  posthog.init(KEY, {
    api_host: HOST,
    // Sent by hand from components/analytics.tsx, so client-side route
    // changes count as well as full loads.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
  })
  started = true
  return true
}

type Events = {
  $pageview: { $current_url: string }
  kit_link_clicked: {
    edition: KitEdition
    destination: KitDestination
    placement: KitPlacement
  }
  // How, never which: the color itself is not sent.
  theme_created: { method: Exclude<ColorMethod, 'reset'> | 'other' }
}

/** Sends one event. A no-op until `initAnalytics` has run with a key. */
export function track<E extends keyof Events>(event: E, props: Events[E]) {
  if (!started) return
  // Kit links leave the page; a beacon survives the navigation.
  posthog.capture(event, props, event === 'kit_link_clicked' ? { transport: 'sendBeacon' } : undefined)
}
