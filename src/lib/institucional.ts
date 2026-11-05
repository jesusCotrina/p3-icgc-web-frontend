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

/** Título de la sección "Quiénes somos" del inicio. */
export const QUIENES_SOMOS_TITULO = 'Fortalecemos la Gestión Comunal y Empresarial';

/**
 * Quiénes somos, texto oficial (sección del inicio y hero de /nosotros, que usa
 * el primer párrafo). Dos párrafos: qué hacemos y cómo trabaja el equipo.
 */
export const QUIENES_SOMOS = [
  'Somos el Instituto de Capacitación en Gestión Comunal (ICGC). Brindamos asesoría, ' +
    'consultoría y capacitación a comunidades campesinas, empresas comunales, organizaciones ' +
    'sociales, empresas privadas y entidades públicas, especialmente en los sectores ' +
    'construcción y minería.',
  'Nuestro equipo multidisciplinario integra ingeniería, derecho, gestión empresarial y ' +
    'relaciones comunitarias para fortalecer la organización, optimizar recursos y desarrollar ' +
    'proyectos. Acompañamos procesos de diálogo y negociación, promoviendo la prevención de ' +
    'conflictos y acuerdos sostenibles.',
] as const;

/** Letra chica bajo las cifras del inicio: aclara de dónde sale la experiencia. */
export const CIFRAS_NOTA =
  'La experiencia profesional corresponde a la trayectoria del equipo del ICGC.';

/** Hero de /nosotros: título, subtítulo y presentación del instituto. */
export const NOSOTROS_HERO = {
  titulo: 'Impulsamos la Gestión Comunal y el Desarrollo Empresarial',
  subtitulo:
    'Asesoría, consultoría y capacitación para fortalecer capacidades, generar oportunidades y ' +
    'promover el desarrollo sostenible.',
  texto:
    'El Instituto de Capacitación en Gestión Comunal (ICGC) acompaña a comunidades campesinas, ' +
    'empresas comunales, organizaciones sociales, empresas privadas y entidades públicas en el ' +
    'fortalecimiento de su gestión, el desarrollo de proyectos y la prevención y manejo de ' +
    'conflictos, con especial atención a los sectores de construcción y minería.',
} as const;

/** "Un equipo multidisciplinario" de /nosotros: la presentación y sus cinco especialidades. */
export const EQUIPO_INTRO =
  'Integramos profesionales de ingeniería, derecho, gestión empresarial y relaciones ' +
  'comunitarias, con experiencia en gestión comunal, construcción y minería. Brindamos asesoría, ' +
  'consultoría y capacitación para fortalecer a las comunidades campesinas y sus empresas.';

/** Ícono de cada especialidad (se dibujan en components/Icons.tsx) */
export type IconoArea = 'casco' | 'balanza' | 'maletin' | 'apreton' | 'birrete';

export type AreaEquipo = {
  titulo: string;
  texto: string;
  imagen: string;
  alt: string;
  icono: IconoArea;
};

// Fotos propias del ICGC (public/nosotros). Al reemplazar una, cambiarle el nombre.
export const AREAS_EQUIPO: readonly AreaEquipo[] = [
  {
    titulo: 'Ingeniería',
    icono: 'casco',
    texto:
      'Gestión de proyectos, oficina técnica, residencia y supervisión de obras. Elaboración y revisión de expedientes técnicos, términos de referencia y alcances de trabajo; costos, presupuestos, calidad, seguridad y gestión ambiental.',
    imagen: '/nosotros/area-ingenieria-planos-andes.webp',
    alt: 'Ingeniera e ingeniero con casco revisan planos en una obra en los Andes',
  },
  {
    titulo: 'Derecho',
    icono: 'balanza',
    texto:
      'Asesoría legal comunal y empresarial: constitución de empresas, estatutos, reglamentos, contratos y negociaciones. Soporte jurídico a la administración y gestión de personal, conforme a la normativa aplicable.',
    imagen: '/nosotros/area-derecho-asesora-legal-contrato.webp',
    alt: 'Asesora legal explica un contrato a un comunero y una comunera en una oficina',
  },
  {
    titulo: 'Gestión Empresarial',
    icono: 'maletin',
    texto:
      'Planificación estratégica, organización administrativa, gestión financiera, costos y control de gestión para fortalecer la competitividad y sostenibilidad de las empresas comunales, respetando su marco normativo.',
    imagen: '/nosotros/area-gestion-empresarial-planificacion-financiera.webp',
    alt: 'Equipo revisa gráficos financieros y una laptop en una reunión de planificación',
  },
  {
    titulo: 'Relaciones Comunitarias',
    icono: 'apreton',
    texto:
      'Gestión social, prevención de conflictos y acompañamiento en negociaciones y mesas de diálogo entre comunidades, empresas y Estado. Promovemos acuerdos sostenibles, participación comunal y respeto a los derechos colectivos y al ambiente.',
    imagen: '/nosotros/area-relaciones-comunitarias-dialogo-andes.webp',
    alt: 'Mesa de diálogo con comuneros y comuneras y asesores del ICGC frente a un mapa',
  },
  {
    titulo: 'Docencia y Capacitación',
    icono: 'birrete',
    texto:
      'Cursos, talleres y diplomados para dirigentes, comuneros, directivos, profesionales y trabajadores. Capacitación en gestión y normativa comunal, administración empresarial, proyectos, negociación, seguridad y gestión ambiental.',
    imagen: '/nosotros/area-docencia-taller-planificacion-comunitaria.webp',
    alt: 'Capacitador explica un diagrama en una pizarra a participantes de un taller comunitario',
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
  /** Un año, o un rango ("2018 – 2025") cuando la tarjeta reúne varios premios */
  año: number | string;
  imagen?: string;
  alt?: string;
};

export const RECONOCIMIENTOS_INTRO =
  'Nuestra experiencia se respalda en reconocimientos recibidos por nuestro gerente general y por ' +
  'las empresas comunales de las que formó parte, por su desempeño en gestión empresarial, ' +
  'seguridad y fortalecimiento de capacidades.';

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
    imagen: `${R}/ecosarc-el-brocal-empresa-mas-segura-2019.webp`,
    alt: 'Equipo de ECOSARC con el reconocimiento de Minera El Brocal a la empresa más segura',
  },
  {
    otorga: 'Consejo Internacional de Prensa',
    titulo: 'Empresario de las Américas',
    año: 2018,
    imagen: `${R}/empresario-de-las-americas-2018.webp`,
    alt: 'Ceremonia de premiación empresarial con los galardonados y sus reconocimientos',
  },
  {
    // Al final: los trofeos juntos, de distintas empresas mineras e instituciones y de distintos años
    empresa: 'ECOSARC y ECOSERMUQ',
    otorga: 'Otorgados por empresas mineras e instituciones a las empresas comunales que gerenció',
    titulo: 'Trofeos por seguridad, calidad y gestión empresarial',
    año: '2018 – 2025',
    imagen: `${R}/trofeos-reconocimientos-empresas-comunales.webp`,
    alt: 'Cuatro trofeos de reconocimiento recibidos por las empresas comunales ECOSARC y ECOSERMUQ, dispuestos en abanico',
  },
];
