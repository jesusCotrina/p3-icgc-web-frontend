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

/** Palabras cortas que van en minúscula dentro de un título (salvo al inicio). */
const MENORES = new Set([
  'a', 'al', 'ante', 'con', 'de', 'del', 'e', 'el', 'en', 'la', 'las', 'lo', 'los', 'o',
  'le', 'les', 'me', 'mi', 'mis', 'nos', 'para', 'por', 'que', 'se', 'sin', 'sobre', 'su', 'sus',
  'te', 'tu', 'tus', 'u', 'un', 'una', 'y',
]);

/**
 * Título con mayúscula inicial en cada palabra, al estilo del sitio:
 * "un instituto al servicio de las comunidades" → "Un Instituto al Servicio de las Comunidades".
 * Las palabras cortas (de, la, y, para...) quedan en minúscula salvo al inicio o
 * después de ":"; las siglas y nombres con mayúsculas internas (ICGC, SUNARP,
 * QA/QC, S.A.A.) no se tocan. `continua`: el texto sigue a otro tramo del
 * mismo título, así que su primera palabra no cuenta como inicio.
 */
export function enTitulo(texto: string, continua = false): string {
  let inicio = !continua;
  return texto.replace(/[^\s]+/g, (palabra) => {
    const letras = palabra.replace(/[^\p{L}]/gu, '');
    const esPrimera = inicio;
    inicio = /[:.?!]$/.test(palabra);
    if (!letras) return palabra;
    // Siglas o mayúsculas internas: se respetan
    if (/\p{Lu}/u.test(letras.slice(1))) return palabra;
    const base = letras.toLowerCase();
    if (!esPrimera && MENORES.has(base)) return palabra.toLowerCase();
    // Primera letra de la palabra (después de ¿ ¡ “ ( etc.) en mayúscula
    return palabra.replace(/\p{L}/u, (l) => l.toUpperCase());
  });
}
