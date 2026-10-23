import type { SiteSettingsDTO } from './types';

/**
 * Enlaces a WhatsApp.
 *
 * El número sale de los datos generales que el admin carga en el gestor
 * (tabla `site_settings`), nunca está escrito en el código. Si todavía no se
 * cargó, los botones caen al formulario de contacto de /nosotros en vez de romperse.
 */

/** Mensajes predefinidos con los que llega cada visitante. */
export const MENSAJES = {
  cursos: 'Hola, vengo de la página web. Quiero más información sobre los cursos.',
  asesoria: 'Hola, vengo de la página web. Quiero más información sobre la asesoría.',
  general: 'Hola, vengo de la página web. Quiero solicitar información.',
} as const;

export type MensajeWhatsApp = keyof typeof MENSAJES;

/**
 * Construye el enlace de wa.me. Devuelve el formulario de /nosotros si no hay número cargado,
 * así el botón siempre lleva a algún lado útil.
 */
export function whatsappUrl(
  settings: SiteSettingsDTO,
  mensaje: MensajeWhatsApp | string = 'general',
): string {
  const numero = (settings.whatsapp ?? '').replace(/\D/g, '');
  if (!numero) return '/nosotros#contacto';

  const texto = mensaje in MENSAJES ? MENSAJES[mensaje as MensajeWhatsApp] : mensaje;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

/** true cuando el enlace sale del sitio: el <a> necesita target y rel. */
export function esEnlaceExterno(url: string): boolean {
  return url.startsWith('http');
}

/** Props de apertura en pestaña nueva, solo para enlaces externos. */
export function propsEnlace(url: string) {
  return esEnlaceExterno(url)
    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
    : ({} as const);
}
