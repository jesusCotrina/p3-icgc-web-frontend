/**
 * Textos institucionales del ICGC. Una sola fuente para el resumen del inicio
 * ("Quiénes somos") y la página /nosotros, así nunca dicen cosas distintas.
 */

/** Lema oficial del instituto. */
export const LEMA = {
  inicio: 'Transformando capacidades en',
  destacado: 'oportunidades',
  final: 'para las comunidades y sus empresas',
} as const;

export const MISION =
  'Brindar servicios de capacitación, formación técnica y asesoría especializada en gestión ' +
  'comunal y empresarial, dirigidos a autoridades, dirigentes y comuneros, fortaleciendo sus ' +
  'competencias en liderazgo, administración, normativa comunal, resolución de conflictos y ' +
  'desarrollo sostenible.';

export const VISION =
  'Ser una institución líder y referente a nivel nacional en la formación y fortalecimiento de ' +
  'capacidades en gestión comunal y empresarial, promoviendo comunidades organizadas, autónomas, ' +
  'transparentes y sostenibles, capaces de ejercer una gobernanza eficaz, inclusiva y orientada ' +
  'al desarrollo integral de sus territorios.';

/** Quiénes somos, completo (página /nosotros). */
export const QUIENES_SOMOS = [
  'El Instituto de Capacitación en Gestión Comunal (ICGC) brinda servicios de asesoría, ' +
    'consultoría y capacitación a comunidades campesinas, empresas comunales, organizaciones ' +
    'sociales, empresas privadas y entidades públicas, con especial atención a los sectores de ' +
    'construcción y minería.',
  'Contamos con un equipo multidisciplinario de profesionales en ingeniería, derecho, gestión ' +
    'empresarial y gestión social. Integramos estas especialidades para fortalecer las capacidades ' +
    'y la organización institucional, optimizar la administración de recursos y acompañar el ' +
    'desarrollo de proyectos. Promovemos una gestión comunal sostenible, la prevención y el manejo ' +
    'de conflictos y relaciones de cooperación entre comunidades y empresas.',
] as const;

/** Una frase por idea, para la portada: la gente no lee bloques de texto ahí. */
export const EN_UNA_FRASE = [
  { titulo: 'Misión', texto: 'Fortalecer a autoridades, dirigentes y comuneros en gestión comunal y empresarial.' },
  { titulo: 'Visión', texto: 'Ser el referente nacional en comunidades organizadas, autónomas y sostenibles.' },
  { titulo: 'Equipo', texto: 'Ingeniería, derecho, gestión empresarial y social trabajando juntos.' },
] as const;

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
