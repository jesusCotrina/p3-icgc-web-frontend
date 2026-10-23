import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/api';

/**
 * robots.txt. Next lo sirve en /robots.txt.
 *
 * Bloqueamos /api y las URLs de busqueda: son paginas sin valor para el
 * indice que solo gastan presupuesto de rastreo.
 *
 * /_next/ NO se bloquea: ahí están el CSS y el JS. Si Googlebot no puede
 * cargarlos, renderiza la página rota y la evalúa peor (diseño móvil, CLS).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/*?q=', '/*&q='],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
