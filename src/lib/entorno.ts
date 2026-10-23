/**
 * Configuración de URLs según dónde corre la web: en local (npm run dev),
 * en Docker o en Vercel. Todo el sitio lee las URLs desde aquí.
 *
 * Variables (ver .env.example):
 *   NEXT_PUBLIC_SITE_URL  URL pública de la web (canónicas, sitemap, Open Graph)
 *   NEXT_PUBLIC_API_URL   URL pública del backend (imágenes, formulario, visitas)
 *   API_INTERNAL_URL      URL del backend para el render en servidor (opcional;
 *                         en Docker es http://backend:4000)
 */

const sinBarraFinal = (url: string) => url.trim().replace(/\/+$/, '');

/** true cuando la web corre en Vercel (Vercel define VERCEL=1). */
export const EN_VERCEL = Boolean(process.env.VERCEL);

/** URL pública del backend: la usa el navegador. */
export const API_PUBLIC_URL = sinBarraFinal(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
);

/** URL del backend para los Server Components (puede ser una red interna). */
export const API_SERVER_URL = sinBarraFinal(process.env.API_INTERNAL_URL || API_PUBLIC_URL);

/**
 * URL pública del sitio. Si no se configuró, en Vercel se usa el dominio de
 * producción del proyecto (o el de la vista previa) en lugar de localhost,
 * así las canónicas y el sitemap nunca apuntan a una máquina local.
 */
export const SITE_URL = sinBarraFinal(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'),
);

const esLocal = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(url);

/**
 * En Vercel no existe ningún backend en localhost: si la URL apunta ahí es que
 * falta configurar NEXT_PUBLIC_API_URL. En ese caso no se intenta la llamada
 * (fallaría siempre) y se avisa una sola vez con el motivo exacto.
 */
export const API_CONFIGURADA = !(EN_VERCEL && esLocal(API_SERVER_URL));
