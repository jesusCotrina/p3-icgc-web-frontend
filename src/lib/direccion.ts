import type { SiteSettingsDTO } from './types';

/** Dirección del instituto cuando el gestor todavía no tiene una cargada. */
const POR_DEFECTO = {
  calle: 'Av. Arnaldo Márquez 1964',
  distrito: 'Jesús María',
  ciudad: 'Lima',
} as const;

export type Direccion = {
  /** Calle y número, p. ej. "Av. Arnaldo Márquez 1964" */
  calle: string;
  /** Distrito (solo en la dirección por defecto; la del gestor ya lo incluye) */
  distrito: string | null;
  ciudad: string;
  /** Texto completo para mostrar: "Av. Arnaldo Márquez 1964, Jesús María, Lima" */
  texto: string;
  /** Lo que se busca en Google Maps */
  busqueda: string;
};

/**
 * Dirección que muestra el sitio: la de Ajustes del sitio (gestor) y, si está
 * vacía, la dirección por defecto del instituto. Una sola fuente para el mapa
 * del pie, los datos de contacto y el schema Organization (SEO local).
 */
export function direccionDelSitio(settings: Pick<SiteSettingsDTO, 'address' | 'city'>): Direccion {
  const deGestor = settings.address?.trim();
  const calle = deGestor || POR_DEFECTO.calle;
  const distrito = deGestor ? null : POR_DEFECTO.distrito;
  const ciudad = settings.city?.trim() || POR_DEFECTO.ciudad;
  const texto = [calle, distrito, ciudad].filter(Boolean).join(', ');
  return { calle, distrito, ciudad, texto, busqueda: `${texto}, Perú` };
}
