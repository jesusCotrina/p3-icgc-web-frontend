/** @type {import('next').NextConfig} */

/**
 * Host del backend del que next/image puede optimizar fotos (/uploads/...).
 * Tolerante: si la variable trae espacios o le falta el "https://", se avisa
 * con un mensaje claro en vez de romper el build con un "Invalid URL".
 */
function hostDelBackend() {
  const crudo = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').trim();
  const conProtocolo = /^https?:\/\//i.test(crudo) ? crudo : `https://${crudo}`;
  try {
    const url = new URL(conProtocolo);
    if (process.env.VERCEL && /^(localhost|127\.0\.0\.1)$/.test(url.hostname)) {
      console.warn(
        '\n[config] NEXT_PUBLIC_API_URL no está configurada en Vercel (apunta a localhost).\n' +
          '         La web se publicará sin contenido hasta que la configures con la URL pública del backend.\n',
      );
    } else if (process.env.VERCEL && url.protocol === 'http:') {
      console.warn(
        '\n[config] NEXT_PUBLIC_API_URL usa http://. Vercel sirve la web con https y el navegador\n' +
          '         bloqueará las fotos y el formulario (contenido mixto). Usa un backend con https.\n',
      );
    }
    return url;
  } catch {
    console.warn(`\n[config] NEXT_PUBLIC_API_URL no es una URL válida: "${crudo}". Se usa http://localhost:4000\n`);
    return new URL('http://localhost:4000');
  }
}

const { protocol, hostname, port } = hostDelBackend();

const nextConfig = {
  reactStrictMode: true,

  // Desarrollo: la web se abre también por la IP de la red local (celular,
  // otra PC). Sin esto Next.js trata esos pedidos como de otro origen y puede
  // bloquear sus archivos internos (la página carga pero sin JS ni animaciones).
  allowedDevOrigins: ['192.168.18.8', 'localhost', '127.0.0.1'],
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
      // De 9 a 6 servicios (oct. 2026): cada página que se fue apunta al servicio que la absorbió
      ...[
        ['organizacion-y-gestion-comunal', 'empresas-comunales'],
        ['negociacion-de-tierras-y-convenios', 'gestion-social-y-conflictos'],
        ['gestion-de-proyectos-y-obras', 'gestion-de-proyectos-y-operaciones'],
        ['licitaciones-y-contratos', 'gestion-de-proyectos-y-operaciones'],
        ['gestion-empresarial-y-financiera', 'capacitacion'],
      ].map(([antes, ahora]) => ({
        source: `/servicios/${antes}`,
        destination: `/servicios/${ahora}`,
        permanent: true,
      })),
      // Catálogo nuevo de cursos (oct. 2026): los anteriores quedaron ocultos
      ...[
        ['gestion-y-organizacion-comunal', 'gestion-normativa-y-liderazgo-comunal'],
        ['marco-legal-comunal', 'gestion-normativa-y-liderazgo-comunal'],
        ['formulacion-de-proyectos', 'gestion-de-proyectos-comunales'],
        ['liderazgo-y-conflictos', 'negociacion-y-manejo-de-conflictos'],
      ].map(([antes, ahora]) => ({
        source: `/cursos/${antes}`,
        destination: `/cursos/${ahora}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
