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
  const resumen = [
    { etiqueta: 'Estado', valor: estado },
    { etiqueta: 'Duración', valor: proyecto.duration },
    { etiqueta: 'Región', valor: nombreRegion(proyecto.region) },
    { etiqueta: 'Comunidad', valor: proyecto.community },
  ];

  return (
    <article
      tabIndex={0}
      className={`group ${alto} rounded-2xl [perspective:1200px] focus-visible:outline-none`}
    >
      <div className="relative h-full w-full rounded-2xl shadow-card transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] motion-reduce:transition-none">
        {/* ── Cara frontal: foto + título ── */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]">
          {proyecto.coverImage && (
            <Image
              src={proyecto.coverImage.url}
              alt={proyecto.coverAlt ?? proyecto.coverImage.alt ?? ''}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          )}
          {/* Velo oscuro concentrado donde va el texto: casi sólido abajo y
              transparente arriba, así la foto se ve y el título se lee sobre
              cualquier imagen (medido: 13:1 o más en las 12 fotos actuales) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-950/[0.97] via-brand-950/80 via-45% to-transparent to-80%"
          />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shadow-sm ${ESTILO_ESTADO[proyecto.status]}`}
            >
              {estado}
            </span>
            <Titulo className="mt-3 text-balance text-lg font-bold leading-snug text-white">
              {proyecto.title}
            </Titulo>
          </div>
        </div>

        {/* ── Cara posterior: datos resumidos ── */}
        {/* Azul oscuro de punta a punta: el degradado de marca terminaba en
            celeste y ahí el texto claro bajaba a 2,6:1 */}
        <div className="absolute inset-0 flex flex-col rounded-2xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 p-6 text-white ring-1 ring-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
            Resumen del proyecto
          </p>
          <dl className="mt-3 space-y-2.5 text-sm">
            {resumen.map((dato) => (
              <div key={dato.etiqueta}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand-300">
                  {dato.etiqueta}
                </dt>
                <dd className="mt-0.5 font-medium text-white">{dato.valor}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-100/90">
            {proyecto.objective}
          </p>

          <Link href={`/proyectos#${proyecto.slug}`} className="btn-light mt-auto w-full">
            {textoEnlace}
            <span className="sr-only"> sobre el proyecto {proyecto.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
