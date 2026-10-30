import Image from 'next/image';
import Link from 'next/link';
import type { Servicio } from '@/lib/servicios';
import { BriefcaseIcon } from './Icons';
import { enTitulo } from '@/lib/format';

/**
 * Tarjeta de servicio: foto baja, título, una frase corta y "Más detalles".
 * Esquinas rectas; al pasar el mouse el borde se vuelve azul oscuro y grueso,
 * con una sombra azul que brilla por debajo.
 *
 * SEO: Server Component; el título y el enlace llevan a /servicios/<slug>
 * con el nombre del servicio como texto del enlace.
 */
export function ServicioCard({
  servicio,
  nivel: Titulo = 'h3',
}: {
  servicio: Servicio;
  /** Nivel del título según la jerarquía de la página que la usa */
  nivel?: 'h2' | 'h3';
}) {
  const url = `/servicios/${servicio.slug}`;

  return (
    <article className="group flex h-full flex-col border-2 border-silver-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-900 hover:shadow-[0_22px_32px_-14px_rgba(28,109,208,0.7)] focus-within:border-brand-900 motion-reduce:transform-none">
      <Link
        href={url}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[2/1] overflow-hidden bg-brand-50"
      >
        <Image
          src={servicio.imagen}
          alt=""
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {/* El mismo ícono en todas: marca visual, no cambia el texto del enlace */}
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors group-hover:bg-brand-900">
            <BriefcaseIcon size={18} />
          </span>
          <Titulo className="text-balance pt-1 text-[1.02rem] font-bold leading-snug">
            <Link href={url} className="text-brand-900 transition-colors group-hover:text-brand-600">
              {enTitulo(servicio.titulo)}
            </Link>
          </Titulo>
        </div>
        <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-slate-600">
          {servicio.resumen}
        </p>
        {/* Enlace de texto (no botón), con la flecha al costado */}
        <Link
          href={url}
          className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900"
        >
          Más detalles
          <span className="sr-only">: {servicio.titulo}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
