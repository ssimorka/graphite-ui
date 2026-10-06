/** @type {import('next').NextConfig} */
const nextConfig = {
  // /system/color was the docs before they moved to /docs. It is a published
  // URL, so it redirects rather than 404s.
  async redirects() {
    return [
      { source: '/system/color', destination: '/docs', permanent: true },
      // Moved under Contribute when the docs split Use from Contribute.
      { source: '/docs/installation', destination: '/docs/contribute/run-locally', permanent: true },
      { source: '/docs/governance', destination: '/docs/contribute/governance', permanent: true },
      // Get started was folded into the top of the Introduction.
      { source: '/docs/get-started', destination: '/docs#use-today', permanent: true },
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
