import Image from 'next/image';
import Link from 'next/link';
import type { CourseDTO } from '@/lib/types';
import { WhatsAppIcon } from '@/components/Icons';
import { propsEnlace } from '@/lib/whatsapp';
import { enTitulo } from '@/lib/format';

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
 * Aviso "¡Próximamente!": etiqueta azul (la del botón "Solicitar información"
 * del menú) con un punto que late, para que se note sobre la foto. Es texto
 * real (Google y lectores de pantalla lo leen).
 */
export function AvisoProximamente({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-wide text-white shadow-lg ring-2 ring-white/80 ${className}`}
    >
      <span aria-hidden="true" className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      ¡Próximamente!
    </span>
  );
}

/** S/ 350.00 */
export const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

/** Modalidad legible a partir del tipo de schema.org que se guarda en el gestor. */
const MODALIDAD: Record<CourseDTO['mode'], string> = {
  ONLINE: 'Virtual',
  ONSITE: 'Presencial',
  BLENDED: 'Semipresencial',
};

/**
 * Tarjeta de curso, al estilo de los catálogos universitarios: foto, tipo de
 * curso, título y los datos clave. Se usa en /cursos, en el carrusel del
 * inicio y en "Otros cursos" de cada curso.
 *
 * SEO: Server Component; el título enlaza a la página propia del curso
 * (/cursos/<slug>) con su nombre como texto del enlace.
 */
export function CourseCard({
  curso,
  masInfoUrl,
  nivel: Titulo = 'h3',
  compacta = false,
}: {
  curso: CourseDTO;
  masInfoUrl: string;
  /** Nivel del título según la jerarquía de la página que la usa */
  nivel?: 'h2' | 'h3';
  /** Versión más chica (carrusel del inicio): los mismos datos, menos tamaño */
  compacta?: boolean;
}) {
  const url = `/cursos/${curso.slug}`;
  // Tamaños de la versión normal y de la compacta
  const t = compacta
    ? { cuerpo: 'p-3.5', titulo: 'text-[0.95rem]', datos: 'mt-2.5 text-[0.78rem]', precio: 'text-lg', separador: 'mt-2.5 pt-2.5', boton: 'py-1.5 text-[0.8rem]', wsp: 'h-9 w-9', pie: 'pt-3' }
    : { cuerpo: 'p-4', titulo: 'text-base', datos: 'mt-3 text-[0.8rem]', precio: 'text-xl', separador: 'mt-3 pt-3', boton: 'py-2 text-sm', wsp: 'h-10 w-10', pie: 'pt-4' };

  return (
    // Borde de 2px que al pasar el mouse se vuelve un degradado azul oscuro que
    // se desvanece a blanco translúcido, como vidrio
    <article
      data-curso={curso.slug}
      className="group h-full rounded-xl bg-silver-200 p-[2px] transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-brand-900 hover:via-brand-500/60 hover:to-brand-200/80 hover:shadow-[0_14px_34px_-12px_rgba(11,37,69,0.45),inset_0_1px_0_rgba(255,255,255,0.6)]"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[0.65rem] bg-white">
        <Link href={url} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/9] overflow-hidden bg-brand-50">
          {curso.coverImage && (
            <Image
              src={curso.coverImage.url}
              alt=""
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {curso.comingSoon && <AvisoProximamente className="absolute right-3 top-3" />}
        </Link>

        <div className={`flex flex-1 flex-col ${t.cuerpo}`}>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-brand-600">
            Curso · {MODALIDAD[curso.mode]}
          </p>
          <Titulo className={`mt-1.5 text-balance font-bold leading-snug ${t.titulo}`}>
            <Link href={url} className="text-brand-900 hover:text-brand-600">
              {enTitulo(curso.name)}
            </Link>
          </Titulo>

          <ul className={`grid gap-1.5 text-texto ${t.datos}`}>
            <Dato icono={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}>
              <span>
                <strong className="font-semibold text-brand-900">{curso.lectiveHours}</strong> horas
                lectivas · {curso.duration}
              </span>
            </Dato>
            <Dato icono={<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>}>
              {curso.modality}
            </Dato>
          </ul>

          <p className={`border-t border-silver-200 ${t.separador}`}>
            <span className="block text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">
              Inversión
            </span>
            <span className={`font-extrabold text-brand-900 ${t.precio}`}>
              {curso.price != null ? soles.format(curso.price) : 'Consultar'}
            </span>
          </p>

          <div className={`mt-auto flex items-center gap-2 ${t.pie}`}>
            <Link href={url} className={`btn-primary flex-1 px-3 ${t.boton}`}>
              Ver el curso
              <span className="sr-only"> {curso.name}</span>
            </Link>
            <Link
              href={masInfoUrl}
              {...propsEnlace(masInfoUrl)}
              aria-label={`Consultar por WhatsApp sobre el curso ${curso.name}`}
              className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100 ${t.wsp}`}
            >
              <WhatsAppIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
