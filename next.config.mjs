/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const { protocol, hostname, port } = new URL(apiUrl);

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // SEO: una sola forma canónica de cada URL (sin barra final)
  trailingSlash: false,

  images: {
    // AVIF/WebP pesan menos -> mejor LCP -> mejor posicionamiento
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: protocol.replace(':', ''),
        hostname,
        ...(port ? { port } : {}),
        pathname: '/uploads/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Evita contenido duplicado: /blog/ y /articulos apuntan a una sola URL
      { source: '/articulos', destination: '/blog', permanent: true },
      { source: '/noticias', destination: '/blog', permanent: true },
      // 301: /programas se renombro a /cursos. Un 301 traslada a la nueva URL
      // la autoridad que Google ya le habia dado a la anterior.
      { source: '/programas', destination: '/cursos', permanent: true },
      // El formulario de contacto ahora vive al final de /nosotros
      { source: '/contacto', destination: '/nosotros#contacto', permanent: true },
    ];
  },
};

export default nextConfig;
