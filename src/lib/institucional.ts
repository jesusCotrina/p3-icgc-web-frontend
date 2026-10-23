/**
 * Textos institucionales del ICGC. Una sola fuente para el resumen del inicio
 * ("Quiénes somos") y la página /nosotros, así nunca dicen cosas distintas.
 */

export const MISION =
  'Formar dirigentes, comuneros y profesionales capaces de administrar su territorio y sus ' +
  'recursos con autonomía, orden y respaldo legal. Creemos que una comunidad informada negocia ' +
  'mejor, se divide menos y protege más.';

/** Versión corta para la tarjeta del inicio. */
export const MISION_CORTA =
  'Formar dirigentes y comuneros capaces de administrar su territorio con autonomía, orden y respaldo legal.';

export const VALORES = [
  {
    titulo: 'Pertinencia',
    texto:
      'Partimos del contexto real de cada comunidad. No hay un solo modelo de gestión comunal y no pretendemos imponerlo.',
  },
  {
    titulo: 'Transparencia',
    texto:
      'Enseñamos a documentar, rendir cuentas y archivar. Una comunidad con papeles en orden es una comunidad que se defiende.',
  },
  {
    titulo: 'Continuidad',
    texto:
      'La capacitación no termina con el certificado: acompañamos a los egresados mientras aplican lo aprendido.',
  },
] as const;

/** Resumen del instituto para la tarjeta del inicio. */
export const RESUMEN_INSTITUTO =
  'El ICGC nació del trabajo directo con juntas directivas que necesitaban herramientas concretas: ' +
  'cómo llevar un libro de actas, cómo presentar un expediente, cómo manejar un conflicto de ' +
  'linderos. Hoy asesoramos y capacitamos a comunidades de todo el Perú.';
