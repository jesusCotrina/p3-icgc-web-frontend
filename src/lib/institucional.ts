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

/** Quiénes somos, texto oficial completo (página /nosotros). */
export const QUIENES_SOMOS = [
  'El Instituto de Capacitación en Gestión Comunal (ICGC) brinda servicios de asesoría, ' +
    'consultoría y capacitación a comunidades campesinas, empresas comunales, organizaciones ' +
    'sociales, empresas privadas y entidades públicas, con especial atención a los sectores ' +
    'construcción y minería.',
  'Integramos profesionales en ingeniería, derecho, gestión empresarial y relaciones comunitarias ' +
    'para fortalecer la organización institucional, mejorar la administración de recursos y ' +
    'acompañar el desarrollo de proyectos. Promovemos el diálogo, la prevención de conflictos y la ' +
    'construcción de acuerdos sostenibles.',
] as const;

/** Resumen de "Quiénes somos" para el inicio (junto al logo). */
export const QUIENES_SOMOS_RESUMEN =
  'Brindamos asesoría, consultoría y capacitación a comunidades campesinas, empresas comunales, ' +
  'organizaciones sociales, empresas privadas y entidades públicas, con especial atención a la ' +
  'construcción y la minería. Promovemos el diálogo, la prevención de conflictos y los acuerdos ' +
  'sostenibles.';

/** "Un equipo multidisciplinario" de /nosotros: la presentación y sus cuatro áreas. */
export const EQUIPO_INTRO =
  'Contamos con un equipo multidisciplinario especializado en ingeniería, derecho, gestión ' +
  'empresarial y relaciones comunitarias, con experiencia en los sectores construcción y minería.';

export type AreaEquipo = { titulo: string; texto: string; imagen: string; alt: string };

export const AREAS_EQUIPO: readonly AreaEquipo[] = [
  {
    titulo: 'Ingeniería',
    texto:
      'Gestión de proyectos, oficina técnica, residencia y supervisión de obras, costos, calidad (QA/QC), seguridad y gestión ambiental.',
    imagen: '/nosotros/area-ingenieria-grua.webp',
    alt: 'Grúa torre trabajando sobre un edificio en construcción',
  },
  {
    titulo: 'Derecho',
    texto:
      'Asesoría legal en asuntos comunales, empresariales y contractuales, para que cada acuerdo y cada contrato estén bien sustentados.',
    imagen: '/nosotros/area-derecho-mazo.webp',
    alt: 'Mazo de juez de madera junto a libros de leyes',
  },
  {
    titulo: 'Gestión Empresarial',
    texto:
      'Administración, costos y control de gestión con buenas prácticas del PMI y Lean Construction, según las necesidades de cada servicio.',
    imagen: '/nosotros/area-gestion-empresarial-oficina.webp',
    alt: 'Profesional tomando notas frente a una laptop en un escritorio de oficina',
  },
  {
    titulo: 'Relaciones Comunitarias',
    texto:
      'Conocimiento directo de la realidad comunal para acompañar la organización, la negociación y el diálogo, y fortalecer a dirigentes, comuneros y equipos.',
    imagen: '/nosotros/area-relaciones-comunitarias.webp',
    alt: 'Comuneros y comuneras con sombrero junto a un asesor del ICGC',
  },
];

/**
 * Reconocimientos recibidos por el gerente general (sección "Reconocimientos"
 * de /nosotros, a la que lleva el botón del inicio). Sin `imagen`, la tarjeta
 * muestra una ilustración genérica con la medalla.
 */
export type Reconocimiento = {
  /** Empresa comunal premiada (vacío si el premio es personal) */
  empresa?: string;
  otorga: string;
  titulo: string;
  año: number;
  imagen?: string;
  alt?: string;
  /** Foto vertical de un trofeo: se muestra entera, sin recortar */
  trofeo?: boolean;
};

export const RECONOCIMIENTOS_INTRO =
  'Reconocimientos recibidos por el gerente general durante su trayectoria en la gestión empresarial y comunal.';

const R = '/reconocimientos';

export const RECONOCIMIENTOS: readonly Reconocimiento[] = [
  {
    empresa: 'ECOSERMUQ',
    otorga: 'Consejo Internacional de Prensa',
    titulo: 'Líder Empresarial Iberoamericano',
    año: 2025,
    imagen: `${R}/ecosermuq-lider-empresarial-iberoamericano-2025.webp`,
    alt: 'Ceremonia de entrega del reconocimiento Líder Empresarial Iberoamericano a ECOSERMUQ',
  },
  {
    empresa: 'ECOSERMUQ',
    otorga: 'Minera Raura',
    titulo: '2.º puesto en implementación de 5S',
    año: 2025,
    imagen: `${R}/ecosermuq-raura-5s-2025.webp`,
    alt: 'Trofeo de cristal de Compañía Minera Raura a ECOSERMUQ por el concurso Raura 5S en Acción',
    trofeo: true,
  },
  {
    empresa: 'ECOSARC',
    otorga: 'Cámara de Comercio de Pasco',
    titulo: 'Reconocimiento al Desarrollo Empresarial',
    año: 2020,
    imagen: `${R}/ecosarc-camara-de-comercio-de-pasco-2020.webp`,
    alt: 'Representantes de ECOSARC junto a directivos de la Cámara de Comercio de Pasco',
  },
  {
    empresa: 'ECOSARC',
    otorga: 'Minera El Brocal',
    titulo: '1.er puesto: Empresa Más Segura',
    año: 2019,
    imagen: `${R}/ecosarc-el-brocal-empresa-mas-segura-trofeo.webp`,
    alt: 'Trofeo de cristal de Sociedad Minera El Brocal a ECOSARC como la empresa más segura',
    trofeo: true,
  },
  {
    empresa: 'ECOSARC',
    otorga: 'Minera El Brocal',
    titulo: '1.er puesto: Empresa Más Segura',
    año: 2019,
    imagen: `${R}/ecosarc-el-brocal-empresa-mas-segura-2019.webp`,
    alt: 'Equipo de ECOSARC con el reconocimiento de Minera El Brocal a la empresa más segura',
  },
  {
    empresa: 'ECOSARC',
    otorga: 'Consejo Internacional de Prensa',
    titulo: 'Calidad, Imagen y Prestigio Empresarial',
    año: 2018,
    imagen: `${R}/ecosarc-calidad-imagen-prestigio-2018.webp`,
    alt: 'Trofeo de oro FIJET-América Calidad, Imagen y Prestigio Empresarial otorgado a ECOSARC',
    trofeo: true,
  },
  {
    otorga: 'Consejo Internacional de Prensa',
    titulo: 'Empresario de las Américas',
    año: 2018,
    imagen: `${R}/empresario-de-las-americas-2018.webp`,
    alt: 'Ceremonia de premiación empresarial con los galardonados y sus reconocimientos',
  },
];
