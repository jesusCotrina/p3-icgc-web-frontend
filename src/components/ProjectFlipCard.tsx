import Image from 'next/image';
import Link from 'next/link';
import { nombreRegion } from '@/lib/presencia';
import { PROJECT_STATUS_LABELS, type ProjectDTO, type ProjectStatus } from '@/lib/types';

/**
 * Etiqueta de estado con fondo sólido: sobre la foto, el blanco translúcido
 * no se leía. Todas superan 7:1 de contraste.
 */
const ESTILO_ESTADO: Record<ProjectStatus, string> = {
  IN_PROGRESS: 'bg-amber-100 text-amber-900',
  COMPLETED: 'bg-emerald-100 text-emerald-900',
  IN_FORMULATION: 'bg-brand-100 text-brand-900',
  STOPPED: 'bg-rose-100 text-rose-900',
};

/**
 * Tarjeta que gira al pasar el mouse (o al enfocarla con el teclado / tocarla
 * en móvil) y muestra el resumen del proyecto en su cara posterior.
 *
 * Al estilo de ppdperu.org: foto a sangre con un velo neutro (negro, no azul)
 * solo donde va el texto, así la foto conserva sus colores; la cara de atrás
 * es un degradado claro con texto oscuro.
 *
 * Server Component y solo CSS: las dos caras están en el HTML, así que Google
 * lee el resumen sin ejecutar JS y no se suma ni un byte de JavaScript.
 */
export function ProjectFlipCard({
  proyecto,
  nivel: Titulo = 'h3',
  textoEnlace = 'Más información',
  alto = 'h-[26rem]',
}: {
  proyecto: ProjectDTO;
  /** Nivel del título según la jerarquía de la página que la usa */
  nivel?: 'h2' | 'h3';
  textoEnlace?: string;
  /** Alto de la tarjeta (clase de Tailwind) */
  alto?: string;
}) {
  const estado = PROJECT_STATUS_LABELS[proyecto.status];
  const region = nombreRegion(proyecto.region);
  const resumen = [
    // Los cortos van de a dos; los largos ocupan toda la fila para no cortarse
    { etiqueta: 'Estado', valor: estado, completo: false },
    { etiqueta: 'Región', valor: region, completo: false },
    { etiqueta: 'Duración', valor: proyecto.duration, completo: true },
    { etiqueta: 'Comunidad', valor: proyecto.community, completo: true },
  ];

  return (
    <article
      tabIndex={0}
      className={`group ${alto} rounded-md [perspective:1200px] focus-visible:outline-none`}
    >
      <div className="relative h-full w-full rounded-md shadow-card transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] motion-reduce:transition-none">
        {/* ── Cara frontal: foto + título ── */}
        <div className="absolute inset-0 overflow-hidden rounded-md bg-slate-800 [backface-visibility:hidden]">
          {proyecto.coverImage && (
            <Image
              src={proyecto.coverImage.url}
              alt={proyecto.coverAlt ?? proyecto.coverImage.alt ?? ''}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          )}
          {/* Velo negro solo en la mitad de abajo: arriba la foto queda con
              sus colores y abajo el texto blanco se lee sobre cualquier imagen */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 via-40% to-transparent to-70%"
          />
          <span
            className={`absolute left-4 top-4 inline-flex rounded-full px-3 py-1 text-xs font-bold shadow-sm ${ESTILO_ESTADO[proyecto.status]}`}
          >
            {estado}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">{region}</p>
            <Titulo className="mt-2 text-balance text-lg font-bold leading-snug text-white">
              {proyecto.title}
            </Titulo>
          </div>
        </div>

        {/* ── Cara posterior: datos resumidos sobre un degradado claro ── */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-md bg-gradient-to-br from-white via-brand-50 to-cyan-100 p-5 text-slate-900 ring-1 ring-brand-100 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
            Resumen del proyecto
          </p>
          <p className="mt-2 line-clamp-2 text-base font-extrabold leading-snug text-brand-900">
            {proyecto.title}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {resumen.map((dato) => (
              <div key={dato.etiqueta} className={`min-w-0 ${dato.completo ? 'col-span-2' : ''}`}>
                <dt className="text-[0.7rem] font-bold uppercase tracking-wide text-brand-700">
                  {dato.etiqueta}
                </dt>
                <dd className="mt-0.5 line-clamp-1 font-semibold text-slate-900" title={dato.valor}>
                  {dato.valor}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-700">
            {proyecto.objective}
          </p>

          <Link href={`/proyectos#${proyecto.slug}`} className="btn-primary mt-auto w-full">
            {textoEnlace}
            <span className="sr-only"> sobre el proyecto {proyecto.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
