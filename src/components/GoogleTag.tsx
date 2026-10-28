/**
 * Etiqueta de Google en todas las páginas, con el código que se guarda en
 * gestor → Ajustes (se cambia ahí, sin tocar el código):
 *   GTM-XXXXXXX   Google Tag Manager  → gtm.js
 *   G-XXXXXXXXXX  Google Analytics 4  → gtag.js + config
 *
 * Va en el <head> del HTML del servidor: así Search Console puede verificar
 * la propiedad con la etiqueta. El script es async y no bloquea el LCP.
 */

// Solo letras, números y guion: el código se escribe dentro de un <script>
const FORMATO = /^(GTM|G|AW)-[A-Z0-9]{4,20}$/;

export function codigoGoogleValido(codigo: string | null | undefined): string | null {
  const limpio = codigo?.trim().toUpperCase() ?? '';
  return FORMATO.test(limpio) ? limpio : null;
}

export function GoogleTag({ codigo }: { codigo: string | null | undefined }) {
  const id = codigoGoogleValido(codigo);
  if (!id) return null;

  const esTagManager = id.startsWith('GTM-');
  const src = esTagManager
    ? `https://www.googletagmanager.com/gtm.js?id=${id}`
    : `https://www.googletagmanager.com/gtag/js?id=${id}`;
  const inicio = [
    'window.dataLayer = window.dataLayer || [];',
    'function gtag(){dataLayer.push(arguments);}',
    "gtag('js', new Date());",
    ...(esTagManager ? [] : [`gtag('config', '${id}');`]),
  ].join('\n');

  return (
    <>
      <script async src={src} />
      <script dangerouslySetInnerHTML={{ __html: inicio }} />
    </>
  );
}

/** Respaldo de Tag Manager sin JavaScript (va al inicio del <body>). */
export function GoogleTagNoScript({ codigo }: { codigo: string | null | undefined }) {
  const id = codigoGoogleValido(codigo);
  if (!id?.startsWith('GTM-')) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
