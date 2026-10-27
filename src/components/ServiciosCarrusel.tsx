import Link from 'next/link';
import { SERVICIOS } from '@/lib/servicios';
import { Carousel } from './Carousel';

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
