/**
 * Servicios del instituto: alimentan la grilla del inicio, la página
 * /servicios y la página propia de cada servicio (/servicios/<slug>).
 * Se editan aquí (por ahora no pasan por el gestor).
 *
 * SEO: cada servicio tiene su propia página, con su título y descripción
 * para Google, porque es lo que la gente busca cuando quiere contratar.
 * Si se quita o renombra un slug, va su 301 en next.config.mjs.
 */

export type Servicio = {
  slug: string;
  titulo: string;
  /** Texto principal del servicio (va en su página) */
  descripcion: string;
  /** Una frase corta para las tarjetas */
  resumen: string;
  /** Título para Google (≤ 60 letras) */
  metaTitulo: string;
  /** Descripción para Google (140-160 letras) */
  metaDescripcion: string;
  imagen: string;
  alt: string;
  /** Qué incluye: una frase corta por punto */
  incluye: readonly string[];
  /** Enlaces internos a cursos, artículos o proyectos del mismo tema */
  relacionados: readonly { href: string; texto: string }[];
};

export const SERVICIOS: readonly Servicio[] = [
  {
    slug: 'empresas-comunales',
    titulo: 'Constitución y conformación de empresas comunales',
    descripcion:
      'Asesoramos a la comunidad en la constitución, formalización y organización de su empresa comunal: desde los estatutos y la aprobación en asamblea hasta los trámites ante notaría, SUNARP y SUNAT, la estructura organizacional y el soporte contable y administrativo para que funcione.',
    resumen:
      'Constituimos y formalizamos la empresa comunal, con estatutos, trámites y estructura listos para funcionar.',
    metaTitulo: 'Constitución de empresas comunales | ICGC',
    metaDescripcion:
      'Asesoría para constituir y formalizar empresas comunales: estatutos, asamblea, trámites ante SUNARP y SUNAT, estructura organizacional y soporte contable.',
    imagen: '/servicios/empresas-comunales-icgc-hd.webp',
    alt: 'Comuneros y comuneras con sombrero junto a un asesor del ICGC, de pie en un terreno de la sierra peruana',
    incluye: [
      'Asesoría en la constitución, formalización y organización de empresas comunales.',
      'Elaboración, revisión y modificación de estatutos y reglamentos.',
      'Talleres participativos y sustentación de propuestas ante la asamblea.',
      'Acompañamiento en trámites notariales, ante SUNARP y SUNAT, según corresponda.',
      'Diseño de la estructura organizacional y definición de funciones del personal clave.',
      'Soporte contable y administrativo para el funcionamiento empresarial.',
    ],
    relacionados: [
      { href: '/blog/inscripcion-de-la-junta-directiva-comunal-en-registros-publicos', texto: 'Inscripción de la junta directiva en Registros Públicos' },
      { href: '/blog/fondos-concursables-para-comunidades-como-postular-y-ganar', texto: 'Fondos concursables para comunidades: cómo postular y ganar' },
      { href: '/cursos/constitucion-y-formalizacion-de-empresas-comunales', texto: 'Curso de constitución y formalización de empresas comunales' },
    ],
  },
  {
    slug: 'capacitacion',
    titulo: 'Capacitación en gestión comunal y empresarial',
    descripcion:
      'Capacitamos a dirigentes, comuneros y trabajadores de las comunidades y sus empresas en normativa comunal, liderazgo, transparencia, administración y planeamiento financiero, con herramientas prácticas para decidir, negociar y dar seguimiento a los compromisos.',
    resumen:
      'Talleres para dirigentes, comuneros y trabajadores: normativa comunal, liderazgo, administración y negociación.',
    metaTitulo: 'Capacitación en gestión comunal y empresarial | ICGC',
    metaDescripcion:
      'Talleres para dirigentes, comuneros y trabajadores en normativa comunal, liderazgo, rendición de cuentas, administración, finanzas y negociación de compromisos.',
    imagen: '/servicios/capacitacion-hd.webp',
    alt: 'Comuneros y trabajadores sentados al aire libre durante una capacitación, con una excavadora al fondo',
    incluye: [
      'Capacitación en normativa comunal, estatutos y responsabilidades de los órganos de gobierno.',
      'Fortalecimiento del liderazgo, la participación, la transparencia y la rendición de cuentas.',
      'Desarrollo de capacidades en administración, planeamiento financiero y control de gestión.',
      'Herramientas para la toma de decisiones, negociación y seguimiento de compromisos.',
      'Talleres dirigidos a dirigentes, comuneros y trabajadores de las comunidades y sus empresas.',
    ],
    relacionados: [
      { href: '/cursos', texto: 'Ver todos los cursos de capacitación del ICGC' },
      { href: '/cursos/gestion-normativa-y-liderazgo-comunal', texto: 'Curso de gestión, normativa y liderazgo comunal' },
      { href: '/blog/padron-comunal-como-actualizarlo-paso-a-paso', texto: 'Padrón comunal: cómo actualizarlo paso a paso' },
    ],
  },
  {
    slug: 'gestion-social-y-conflictos',
    titulo: 'Gestión social y manejo de conflictos',
    descripcion:
      'Identificamos y prevenimos conflictos en el entorno comunal y empresarial, preparamos y acompañamos a la comunidad en mesas de diálogo y en la negociación de tierras, servidumbres, usufructos y convenios, y damos seguimiento a los acuerdos con empresas y entidades públicas.',
    resumen:
      'Prevención de conflictos, mesas de diálogo y negociación de tierras y convenios con seguimiento de acuerdos.',
    metaTitulo: 'Gestión social y manejo de conflictos | ICGC',
    metaDescripcion:
      'Prevención de conflictos, mesas de diálogo y negociación de tierras, servidumbres y convenios entre comunidades, empresas y Estado, con seguimiento de acuerdos.',
    imagen: '/servicios/gestion-social-y-conflictos-icgc-hd.webp',
    alt: 'Dirigentes comunales y representantes de entidades públicas reunidos en una foto grupal tras una mesa de trabajo',
    incluye: [
      'Identificación y prevención de conflictos en el entorno comunal y empresarial.',
      'Preparación y acompañamiento en mesas de diálogo y espacios de concertación.',
      'Asesoría en negociación de tierras, servidumbres, usufructos y convenios.',
      'Articulación con empresas, entidades públicas y otros actores.',
      'Elaboración de propuestas y seguimiento de acuerdos y compromisos.',
    ],
    relacionados: [
      { href: '/cursos/negociacion-y-manejo-de-conflictos', texto: 'Curso de negociación y manejo de conflictos' },
      { href: '/blog/conflictos-de-linderos-entre-comunidades', texto: 'Conflictos de linderos entre comunidades: cómo prevenirlos' },
      { href: '/blog/saneamiento-fisico-legal-del-territorio-comunal-guia-practica', texto: 'Saneamiento físico-legal del territorio comunal' },
    ],
  },
  {
    slug: 'gestion-de-proyectos-y-operaciones',
    titulo: 'Gestión de proyectos y operaciones',
    descripcion:
      'Planificamos, evaluamos y supervisamos proyectos y operaciones de las comunidades y sus empresas: oficina técnica, residencia y supervisión de obras, costos, presupuestos y cronogramas, control de calidad e indicadores, propuestas para licitaciones y administración de contratos.',
    resumen:
      'Oficina técnica, supervisión de obras, costos y calidad, licitaciones y administración de contratos.',
    metaTitulo: 'Gestión de proyectos, obras y licitaciones | ICGC',
    metaDescripcion:
      'Planificación y supervisión de proyectos y obras, costos, presupuestos y control de calidad, propuestas para licitaciones y administración de contratos.',
    imagen: '/servicios/gestion-de-proyectos-y-operaciones-hd.webp',
    alt: 'Capacitación de operación de una excavadora hidráulica proyectada en una sala, ante trabajadores con chalecos de seguridad',
    incluye: [
      'Planificación, evaluación y seguimiento de proyectos y operaciones.',
      'Servicios de oficina técnica, residencia y supervisión de obras.',
      'Elaboración y revisión de costos, presupuestos y cronogramas.',
      'Control y aseguramiento de la calidad (QA/QC), productividad e indicadores de gestión.',
      'Elaboración y revisión de términos de referencia y propuestas para licitaciones.',
      'Administración de contratos y seguimiento de alcances, costos y plazos.',
    ],
    relacionados: [
      { href: '/cursos/gestion-de-proyectos-comunales', texto: 'Curso de gestión de proyectos conforme a los reglamentos comunales' },
      { href: '/blog/licitaciones-con-el-estado-primeros-pasos-para-comunidades', texto: 'Licitaciones con el Estado: primeros pasos para comunidades' },
    ],
  },
  {
    slug: 'expedientes-tecnicos-y-proyectos-sociales',
    titulo: 'Elaboración de expedientes técnicos y proyectos sociales',
    descripcion:
      'Elaboramos y revisamos expedientes técnicos de infraestructura y servicios de interés comunal, con memorias, estudios, planos, metrados, presupuestos y cronogramas, y formulamos proyectos sociales y productivos, incluida la preparación de propuestas para mecanismos como Obras por Impuestos.',
    resumen:
      'Expedientes técnicos, planos, metrados y presupuestos, y proyectos sociales y productivos listos para evaluar.',
    metaTitulo: 'Expedientes técnicos y proyectos sociales | ICGC',
    metaDescripcion:
      'Elaboración de expedientes técnicos de obras comunales con planos, metrados y presupuestos, y formulación de proyectos sociales y de Obras por Impuestos.',
    imagen: '/servicios/expedientes-tecnicos-y-proyectos-sociales-hd.webp',
    alt: 'Ingenieros con casco y chaleco revisando los planos de un expediente técnico en plena obra',
    incluye: [
      'Elaboración y revisión de expedientes técnicos de infraestructura y servicios de interés comunal.',
      'Desarrollo de memorias descriptivas, estudios por especialidad, diseños y planos, según el alcance del proyecto.',
      'Elaboración de metrados, análisis de costos, presupuestos y cronogramas.',
      'Diseño, formulación y evaluación de proyectos sociales y productivos.',
      'Asistencia técnica en la identificación y preparación de propuestas para su evaluación bajo mecanismos como Obras por Impuestos, según corresponda.',
    ],
    relacionados: [
      { href: '/blog/proyectos-de-riego-comunal-de-la-idea-al-expediente-tecnico', texto: 'Proyectos de riego comunal: de la idea al expediente técnico' },
      { href: '/blog/invierte-pe-para-comunidades', texto: 'Invierte.pe para comunidades' },
      { href: '/proyectos', texto: 'Proyectos que acompaña el ICGC' },
    ],
  },
  {
    slug: 'asesoria-legal-y-ambiental',
    titulo: 'Asesoría legal y ambiental',
    descripcion:
      'Asesoramos a las comunidades y sus empresas en asuntos comunales, empresariales, contractuales, mineros y de construcción, elaboramos y revisamos contratos, convenios e informes legales, y las orientamos en sus obligaciones y compromisos ambientales y en las gestiones ante las autoridades.',
    resumen:
      'Contratos, convenios e informes legales, y orientación en compromisos ambientales ante las autoridades.',
    metaTitulo: 'Asesoría legal y ambiental para comunidades | ICGC',
    metaDescripcion:
      'Asesoría legal comunal, empresarial, contractual y minera, revisión de contratos y convenios, y orientación en compromisos ambientales ante las autoridades.',
    imagen: '/servicios/asesoria-legal-y-ambiental-icgc-hd.webp',
    alt: 'Asesor del ICGC exponiendo ante dirigentes un cuadro de compromisos proyectado en una sala de reuniones',
    incluye: [
      'Asesoría en asuntos comunales, empresariales, contractuales, mineros y de construcción.',
      'Elaboración y revisión de contratos, convenios e informes legales.',
      'Orientación sobre obligaciones y compromisos ambientales vinculados con las comunidades y sus empresas.',
      'Asistencia en consultas, solicitudes de información y gestiones ante autoridades competentes.',
      'Seguimiento de compromisos y coordinación con especialistas para la atención de asuntos ambientales.',
    ],
    relacionados: [
      { href: '/cursos/licitaciones-y-administracion-de-contratos', texto: 'Curso de licitaciones y administración de contratos' },
      { href: '/blog/saneamiento-fisico-legal-del-territorio-comunal-guia-practica', texto: 'Saneamiento físico-legal del territorio comunal' },
    ],
  },
];

/** Cómo trabajamos: lo mismo para todos los servicios (y la página Proyectos). */
export const COMO_TRABAJAMOS = [
  {
    numero: '01',
    titulo: 'Diagnóstico',
    texto: 'Revisamos el estado real del proyecto y de la documentación de la comunidad.',
  },
  {
    numero: '02',
    titulo: 'Propuesta',
    texto: 'Te entregamos un plan de trabajo con alcance, plazos y costos claros.',
  },
  {
    numero: '03',
    titulo: 'Ejecución',
    texto: 'Trabajamos junto al equipo de la comunidad, no por encima de él.',
  },
  {
    numero: '04',
    titulo: 'Cierre',
    texto: 'Dejamos el expediente, la obra o el trámite documentado y transferido.',
  },
] as const;

export const servicioPorSlug = (slug: string) => SERVICIOS.find((s) => s.slug === slug);
