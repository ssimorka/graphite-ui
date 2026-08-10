/** @type {import('next').NextConfig} */
const nextConfig = {
  // /system/color was the Color docs before they moved onto the landing page
  // as #docs. It is a published URL, so it redirects rather than 404s.
  async redirects() {
    return [
      {
        source: '/system/color',
        destination: '/#docs',
        permanent: true,
      },
    ]
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
