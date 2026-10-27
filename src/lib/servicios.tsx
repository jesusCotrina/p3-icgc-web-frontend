/**
 * Servicios del instituto: alimentan el carrusel del inicio y la página
 * /servicios. Se editan aquí (por ahora no pasan por el gestor).
 */

export type Servicio = {
  /** Ancla en /servicios */
  slug: string;
  titulo: string;
  descripcion: string;
  href: string;
  /** Trazos del ícono (viewBox 24×24, estilo de línea) */
  icono: React.ReactNode;
};

/**
 * Los servicios del instituto. Cada uno enlaza a donde se explica en detalle:
 * enlazado interno para Google y un camino claro para el visitante.
 */
export const SERVICIOS: readonly Servicio[] = [
  {
    slug: 'licitaciones',
    titulo: 'Licitaciones con el Estado',
    descripcion:
      'Inscripción en el RNP, lectura de bases y armado del expediente para competir y ganar.',
    href: '/proyectos#licitaciones',
    icono: (
      <>
        <path d="M9 3h6l1 3H8z" />
        <rect x="5" y="6" width="14" height="15" rx="2" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
  },
  {
    slug: 'expedientes-tecnicos',
    titulo: 'Expedientes técnicos',
    descripcion:
      'Del perfil al expediente aprobado: diagnóstico, metrados, presupuesto y cronograma.',
    href: '/proyectos#expedientes-tecnicos',
    icono: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </>
    ),
  },
  {
    slug: 'ejecucion-de-obras',
    titulo: 'Ejecución y supervisión de obras',
    descripcion: 'Control de avance, valorizaciones y la documentación que pide la liquidación.',
    href: '/proyectos#ejecucion-de-obra',
    icono: (
      <>
        <path d="M2 20h20M4 20V10l8-6 8 6v10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
  },
  {
    slug: 'saneamiento-del-territorio',
    titulo: 'Saneamiento del territorio',
    descripcion: 'Linderaje, georreferenciación y titulación para proteger las tierras comunales.',
    href: '/blog/saneamiento-fisico-legal-del-territorio-comunal-guia-practica',
    icono: (
      <>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
  },
  {
    slug: 'organizacion-comunal',
    titulo: 'Organización comunal',
    descripcion:
      'Padrón actualizado, libro de actas en regla y junta directiva inscrita en SUNARP.',
    href: '/proyectos#gestion-comunal',
    icono: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 20a6 6 0 0 1 12 0M14 20a4 4 0 0 1 7-2.6" />
      </>
    ),
  },
  {
    slug: 'inversion-publica',
    titulo: 'Proyectos de inversión pública',
    descripcion:
      'Acompañamos a la comunidad para que su proyecto avance por las fases de Invierte.pe.',
    href: '/blog/invierte-pe-para-comunidades',
    icono: (
      <>
        <path d="M3 20h18" />
        <path d="M6 16v-4M11 16V8M16 16v-6" />
        <path d="m4 9 5-4 4 3 7-5" />
      </>
    ),
  },
  {
    slug: 'fondos-concursables',
    titulo: 'Fondos concursables',
    descripcion: 'Propuestas claras y presupuestos creíbles para postular y ganar financiamiento.',
    href: '/blog/fondos-concursables-para-comunidades-como-postular-y-ganar',
    icono: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5" />
      </>
    ),
  },
  {
    slug: 'capacitacion-de-dirigentes',
    titulo: 'Capacitación de dirigentes',
    descripcion: 'Cursos en vivo por Zoom, con material digital y certificado del instituto.',
    href: '/cursos',
    icono: (
      <>
        <path d="M22 10 12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c3 2 9 2 12 0v-5" />
      </>
    ),
  },
];
