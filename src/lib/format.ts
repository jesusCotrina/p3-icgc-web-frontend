/** Fecha larga en espanol: "14 de octubre de 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima',
  }).format(new Date(iso));
}

/** Formato corto para listados: "14 oct 2026" */
export function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Lima',
  }).format(new Date(iso));
}

/** Valor para el atributo datetime de <time> (ISO 8601, lo que lee Google) */
export function isoDate(iso: string | null | undefined): string {
  if (!iso) return '';
  return new Date(iso).toISOString();
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Iniciales para el avatar cuando aún no hay foto: "Mg. Ing. Fernando D. Benito
 * Calixto" → "FB". Se saltan los títulos y las iniciales con punto, y lo que va
 * entre paréntesis.
 */
export function inicialesDe(nombre: string): string {
  return nombre
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((palabra) => palabra && !palabra.endsWith('.'))
    .slice(0, 2)
    .map((palabra) => palabra[0]!.toUpperCase())
    .join('');
}
