/** @type {import('next').NextConfig} */
const nextConfig = {
  // /system/color was the docs before they moved to /docs. It is a published
  // URL, so it redirects rather than 404s.
  async redirects() {
    return [
      { source: '/system/color', destination: '/docs', permanent: true },
      // Someone guessing this URL wants to install Graphite in their project,
      // not run this repo. It pointed at Contribute's Run locally until the
      // cold-start test (2026-10-30) found it sending adopters to a clone.
      { source: '/docs/installation', destination: '/docs/quick-start', permanent: true },
      { source: '/docs/governance', destination: '/docs/contribute/governance', permanent: true },
      // Get started was folded into the top of the Introduction.
      { source: '/docs/get-started', destination: '/docs#use-today', permanent: true },
    ]
  },
  // Baseline security headers on every response, the registry included:
  // people run what /r serves in their own projects, so the site should at
  // least not be frameable, sniffable or downgradable. The CSP sets only
  // frame-ancestors. A full script policy would have to allow the inline
  // <head> theme script (lib/theme-storage.ts) by hash or nonce, so it is a
  // separate piece of work. HSTS leaves out includeSubDomains and preload,
  // which commit every subdomain and are hard to undo.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        ],
      },
    ]
  },
  // The registry routes (app/r) read components, lib and the stylesheet's
  // foundations at request time, so the deployment has to carry those files.
  outputFileTracingIncludes: {
    '/r/**': ['./components/**/*', './lib/**/*', './app/globals.scss', './app/docs/foundations/tokens/read-tokens.ts'],
  },
  sassOptions: {
    // Carbon's published Sass still uses some patterns the latest dart-sass
    // flags as deprecated. Silence those warnings; they are upstream noise.
    silenceDeprecations: [
      'mixed-decls',
      'global-builtin',
      'import',
      'if-function',
    ],
    quietDeps: true,
  },
}

export default nextConfig
