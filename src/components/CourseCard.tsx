import Image from 'next/image';
import Link from 'next/link';
import type { CourseDTO } from '@/lib/types';
import { propsEnlace } from '@/lib/whatsapp';

/** Ícono pequeño de cada dato del curso (decorativo, el texto ya lo dice). */
function Dato({ icono, children }: { icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icono}
        </svg>
      </span>
      {children}
    </li>
  );
}

/**
 * Tarjeta compacta de curso para el carrusel del inicio y de /cursos.
 * Server Component: los datos (horas, modalidad, certificado) quedan en el
 * HTML para Google. "Ver detalle" lleva a la ficha en /cursos; en esa misma
 * página CoursesExplorer intercepta el clic y abre la ficha sin recargar.
 */
export function CourseCard({ curso, masInfoUrl }: { curso: CourseDTO; masInfoUrl: string }) {
  return (
    <article
      data-curso={curso.slug}
      className="card flex h-full flex-col overflow-hidden hover:border-brand-300 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] bg-brand-50">
        {curso.coverImage && (
          <Image
            src={curso.coverImage.url}
            alt={curso.coverAlt ?? curso.coverImage.alt ?? ''}
            fill
            sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 22vw"
            className="object-cover"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[0.7rem] font-bold text-brand-700 shadow-card">
          {curso.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base leading-snug">
          <Link href={`/cursos#${curso.slug}`} className="hover:text-brand-600">
            {curso.name}
          </Link>
        </h3>

        <ul className="mt-3 grid gap-2 text-[0.8rem] text-slate-700">
          <Dato icono={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}>
            <span>
              <strong className="font-semibold text-brand-900">{curso.lectiveHours}</strong> horas
              lectivas
            </span>
          </Dato>
          <Dato icono={<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>}>
            {curso.modality}
          </Dato>
          <Dato icono={<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M9 14h6M9 17h4" /></>}>
            {curso.material}
          </Dato>
          <Dato icono={<><circle cx="12" cy="9" r="6" /><path d="m8.5 13.5-1.5 7.5 5-3 5 3-1.5-7.5" /></>}>
            {curso.certificate}
          </Dato>
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link href={`/cursos#${curso.slug}`} className="btn-secondary px-2 py-2.5 text-[0.8rem]">
            Ver detalle
            <span className="sr-only"> del curso {curso.name}</span>
          </Link>
          <Link
            href={masInfoUrl}
            {...propsEnlace(masInfoUrl)}
            className="btn-primary px-2 py-2.5 text-[0.8rem]"
          >
            Más información
            <span className="sr-only"> sobre el curso {curso.name}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
