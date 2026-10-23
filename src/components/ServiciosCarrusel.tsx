import Link from 'next/link';
import { Carousel } from './Carousel';

type Servicio = {
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
const SERVICIOS: readonly Servicio[] = [
  {
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

/**
 * Carrusel de servicios que avanza solo. Server Component: títulos,
 * descripciones y enlaces están en el HTML para Google; el Carousel solo
 * mueve el scroll.
 */
export function ServiciosCarrusel() {
  return (
    <Carousel
      label="Servicios del instituto"
      autoplayMs={3500}
      flechas={false}
      itemClassName="w-[78%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
    >
      {SERVICIOS.map((s) => (
        <article
          key={s.titulo}
          className="group relative flex h-full flex-col rounded-2xl border border-silver-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {s.icono}
            </svg>
          </span>
          <h3 className="mt-5 text-xl leading-snug">{s.titulo}</h3>
          <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-slate-600">
            {s.descripcion}
          </p>
          <Link
            href={s.href}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800"
          >
            Conocer el servicio
            <span className="sr-only">: {s.titulo}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </article>
      ))}
    </Carousel>
  );
}
