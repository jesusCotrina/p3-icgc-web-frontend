/**
 * Servicios del instituto: alimentan la grilla del inicio, la página
 * /servicios y la página propia de cada servicio (/servicios/<slug>).
 * Se editan aquí (por ahora no pasan por el gestor).
 *
 * SEO: cada servicio tiene su propia página, con su título y descripción
 * para Google, porque es lo que la gente busca cuando quiere contratar.
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
    titulo: 'Constitución y fortalecimiento de empresas comunales',
    descripcion:
      'Asesoramos en la constitución, formalización y organización de empresas comunales, así como en la implementación de herramientas para su administración, operación y desarrollo empresarial.',
    resumen:
      'Constituimos y formalizamos la empresa comunal, y le damos herramientas para administrarla y crecer.',
    metaTitulo: 'Constitución de empresas comunales | ICGC',
    metaDescripcion:
      'Asesoría para constituir, formalizar y organizar empresas comunales, con herramientas de administración, operación y desarrollo empresarial para la comunidad.',
    imagen: '/servicios/empresas-comunales.webp',
    alt: 'Vicuñas pastando junto a las viviendas de la cooperativa comunal Granja Porcón, en Cajamarca',
    incluye: [
      'Constitución y formalización de la empresa comunal',
      'Organización interna de la empresa',
      'Herramientas de administración y operación',
      'Acompañamiento en su desarrollo empresarial',
    ],
    relacionados: [
      { href: '/blog/fondos-concursables-para-comunidades-como-postular-y-ganar', texto: 'Fondos concursables para comunidades: cómo postular y ganar' },
      { href: '/cursos', texto: 'Cursos de gestión empresarial para comunidades' },
    ],
  },
  {
    slug: 'organizacion-y-gestion-comunal',
    titulo: 'Organización y gestión comunal',
    descripcion:
      'Acompañamos procesos de ordenamiento comunal, revisión y actualización de estatutos y reglamentos, fortalecimiento de la organización interna y mejora de los mecanismos de participación y toma de decisiones.',
    resumen:
      'Estatutos y reglamentos al día, una organización interna sólida y decisiones con participación de todos.',
    metaTitulo: 'Organización y gestión comunal | ICGC',
    metaDescripcion:
      'Ordenamiento comunal, actualización de estatutos y reglamentos, y fortalecimiento de la organización interna y la toma de decisiones de la comunidad campesina.',
    imagen: '/servicios/organizacion-y-gestion-comunal.webp',
    alt: 'Comuneros reunidos bajo los techos del espacio comunal de Chinchero, en Cusco',
    incluye: [
      'Ordenamiento comunal',
      'Revisión y actualización de estatutos y reglamentos',
      'Fortalecimiento de la organización interna',
      'Mejores mecanismos de participación y toma de decisiones',
    ],
    relacionados: [
      { href: '/cursos/gestion-y-organizacion-comunal', texto: 'Curso de gestión y organización comunal' },
      { href: '/blog/padron-comunal-como-actualizarlo-paso-a-paso', texto: 'Padrón comunal: cómo actualizarlo paso a paso' },
      { href: '/blog/inscripcion-de-la-junta-directiva-comunal-en-registros-publicos', texto: 'Inscripción de la junta directiva en Registros Públicos' },
    ],
  },
  {
    slug: 'negociacion-de-tierras-y-convenios',
    titulo: 'Negociación de tierras y convenios',
    descripcion:
      'Brindamos acompañamiento técnico y legal en negociaciones sobre uso de tierras, servidumbres, usufructos y otros acuerdos con empresas mineras y privadas. Asesoramos en la elaboración, revisión, negociación y seguimiento de convenios marco y compromisos.',
    resumen:
      'Te acompañamos al negociar servidumbres, usufructos y convenios marco con empresas mineras y privadas.',
    metaTitulo: 'Negociación de tierras y convenios mineros | ICGC',
    metaDescripcion:
      'Acompañamiento técnico y legal a comunidades en la negociación de tierras, servidumbres y usufructos, y en convenios marco con empresas mineras y privadas.',
    imagen: '/servicios/negociacion-de-tierras-y-convenios.webp',
    alt: 'Tajo abierto de la mina de Cerro de Pasco visto desde los terrenos que la rodean',
    incluye: [
      'Negociación sobre el uso de tierras',
      'Servidumbres, usufructos y otros acuerdos con empresas mineras y privadas',
      'Elaboración, revisión y negociación de convenios marco',
      'Seguimiento de convenios y compromisos',
    ],
    relacionados: [
      { href: '/blog/conflictos-de-linderos-entre-comunidades', texto: 'Conflictos de linderos entre comunidades: cómo prevenirlos' },
      { href: '/blog/saneamiento-fisico-legal-del-territorio-comunal-guia-practica', texto: 'Saneamiento físico-legal del territorio comunal' },
    ],
  },
  {
    slug: 'gestion-social-y-conflictos',
    titulo: 'Gestión social y manejo de conflictos',
    descripcion:
      'Asesoramos en la prevención y gestión de conflictos sociales, la participación en mesas de diálogo y la articulación con empresas y entidades del Estado, promoviendo acuerdos sostenibles y mecanismos de seguimiento.',
    resumen:
      'Prevención de conflictos, mesas de diálogo y acuerdos sostenibles con empresas y el Estado.',
    metaTitulo: 'Gestión social y manejo de conflictos | ICGC',
    metaDescripcion:
      'Prevención y gestión de conflictos sociales, mesas de diálogo y articulación de la comunidad con empresas y el Estado, con acuerdos sostenibles y seguimiento.',
    imagen: '/servicios/gestion-social-y-conflictos.webp',
    alt: 'Participantes sentados alrededor de una mesa de diálogo en Perú',
    incluye: [
      'Prevención y gestión de conflictos sociales',
      'Participación en mesas de diálogo',
      'Articulación con empresas y entidades del Estado',
      'Acuerdos sostenibles y mecanismos de seguimiento',
    ],
    relacionados: [
      { href: '/cursos/liderazgo-y-conflictos', texto: 'Curso de liderazgo y resolución de conflictos' },
      { href: '/blog/conflictos-de-linderos-entre-comunidades', texto: 'Conflictos de linderos entre comunidades' },
    ],
  },
  {
    slug: 'gestion-de-proyectos-y-obras',
    titulo: 'Gestión de proyectos y obras',
    descripcion:
      'Brindamos asistencia técnica en la planificación, evaluación, ejecución y supervisión de proyectos de infraestructura y desarrollo social, con seguimiento de alcances, costos, plazos y calidad.',
    resumen:
      'Planificamos y supervisamos obras como locales comunales, riego o caminos, cuidando costos, plazos y calidad.',
    metaTitulo: 'Gestión y supervisión de proyectos y obras | ICGC',
    metaDescripcion:
      'Asistencia técnica en la planificación, evaluación, ejecución y supervisión de obras de infraestructura y desarrollo social, cuidando costos, plazos y calidad.',
    imagen: '/servicios/gestion-de-proyectos-y-obras.webp',
    alt: 'Obra de pavimentación de una calle en Urubamba, con la zanja aún abierta',
    incluye: [
      'Planificación y evaluación de proyectos',
      'Ejecución y supervisión de obras',
      'Infraestructura y desarrollo social',
      'Seguimiento de alcances, costos, plazos y calidad',
    ],
    relacionados: [
      { href: '/proyectos', texto: 'Proyectos que acompaña el ICGC' },
      { href: '/blog/proyectos-de-riego-comunal-de-la-idea-al-expediente-tecnico', texto: 'Proyectos de riego comunal: de la idea al expediente técnico' },
      { href: '/blog/invierte-pe-para-comunidades', texto: 'Invierte.pe para comunidades' },
    ],
  },
  {
    slug: 'licitaciones-y-contratos',
    titulo: 'Licitaciones y administración de contratos',
    descripcion:
      'Acompañamos la identificación de oportunidades de negocio, preparación de propuestas y negociación de proyectos y servicios con empresas mineras y privadas. Elaboramos y revisamos términos de referencia, presupuestos y documentación contractual.',
    resumen:
      'Detectamos oportunidades, preparamos propuestas y revisamos términos de referencia, presupuestos y contratos.',
    metaTitulo: 'Licitaciones y administración de contratos | ICGC',
    metaDescripcion:
      'Oportunidades de negocio, propuestas y negociación con empresas mineras y privadas. Elaboramos términos de referencia, presupuestos y documentos contractuales.',
    imagen: '/servicios/licitaciones-y-contratos.webp',
    alt: 'Contrato impreso con una pluma estilográfica lista para firmar',
    incluye: [
      'Identificación de oportunidades de negocio',
      'Preparación de propuestas',
      'Negociación de proyectos y servicios con empresas mineras y privadas',
      'Términos de referencia, presupuestos y documentación contractual',
    ],
    relacionados: [
      { href: '/blog/licitaciones-con-el-estado-primeros-pasos-para-comunidades', texto: 'Licitaciones con el Estado: primeros pasos para comunidades' },
    ],
  },
  {
    slug: 'gestion-empresarial-y-financiera',
    titulo: 'Gestión empresarial, financiera y control de gestión',
    descripcion:
      'Asesoramos en diagnósticos organizacionales, reestructuración empresarial, planeamiento financiero, control presupuestal e implementación de indicadores para mejorar la administración de recursos y la toma de decisiones.',
    resumen:
      'Diagnósticos, planeamiento financiero, control del presupuesto e indicadores para decidir con datos.',
    metaTitulo: 'Gestión empresarial y financiera comunal | ICGC',
    metaDescripcion:
      'Diagnósticos organizacionales, reestructuración, planeamiento financiero, control presupuestal e indicadores para administrar mejor los recursos de la empresa.',
    imagen: '/servicios/gestion-empresarial-y-financiera.webp',
    alt: 'Profesional tomando notas frente a una computadora portátil durante una reunión de trabajo',
    incluye: [
      'Diagnósticos organizacionales',
      'Reestructuración empresarial',
      'Planeamiento financiero y control presupuestal',
      'Indicadores para la toma de decisiones',
    ],
    relacionados: [{ href: '/cursos', texto: 'Cursos de gestión para dirigentes y equipos' }],
  },
  {
    slug: 'asesoria-legal-y-ambiental',
    titulo: 'Asesoría legal y acompañamiento ambiental',
    descripcion:
      'Brindamos asesoría en asuntos comunales, empresariales, mineros y de construcción. Acompañamos la revisión de compromisos ambientales y la coordinación de consultas y gestiones ante las autoridades competentes.',
    resumen:
      'Asesoría legal comunal, empresarial y minera, y seguimiento de los compromisos ambientales ante las autoridades.',
    metaTitulo: 'Asesoría legal y ambiental para comunidades | ICGC',
    metaDescripcion:
      'Asesoría legal en asuntos comunales, empresariales, mineros y de construcción, y acompañamiento en compromisos ambientales y gestiones ante las autoridades.',
    imagen: '/servicios/asesoria-legal-y-ambiental.webp',
    alt: 'Técnico tomando muestras de agua en un río de montaña para un monitoreo ambiental',
    incluye: [
      'Asuntos comunales y empresariales',
      'Asuntos mineros y de construcción',
      'Revisión de compromisos ambientales',
      'Consultas y gestiones ante las autoridades competentes',
    ],
    relacionados: [
      { href: '/cursos/marco-legal-comunal', texto: 'Curso de marco legal de las comunidades' },
      { href: '/blog/saneamiento-fisico-legal-del-territorio-comunal-guia-practica', texto: 'Saneamiento físico-legal del territorio comunal' },
    ],
  },
  {
    slug: 'capacitacion',
    titulo: 'Capacitación y desarrollo de capacidades',
    descripcion:
      'Desarrollamos cursos y talleres para dirigentes, comuneros y equipos de trabajo en liderazgo, normativa comunal, gestión empresarial, administración de contratos, gestión de proyectos y negociación.',
    resumen:
      'Cursos y talleres para dirigentes y comuneros: liderazgo, normativa comunal, contratos y negociación.',
    metaTitulo: 'Capacitación para dirigentes y comuneros | ICGC',
    metaDescripcion:
      'Cursos y talleres para dirigentes, comuneros y equipos en liderazgo, normativa comunal, gestión empresarial, contratos, gestión de proyectos y negociación.',
    imagen: '/inicio/taller-mapeo-participativo.webp',
    alt: 'Participantes de un taller trabajando juntos sobre un mapa de su territorio',
    incluye: [
      'Cursos y talleres para dirigentes, comuneros y equipos',
      'Liderazgo y normativa comunal',
      'Gestión empresarial y administración de contratos',
      'Gestión de proyectos y negociación',
    ],
    relacionados: [{ href: '/cursos', texto: 'Ver todos los cursos de capacitación del ICGC' }],
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
