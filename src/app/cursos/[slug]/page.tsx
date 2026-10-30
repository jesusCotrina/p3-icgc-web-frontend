import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AutoReveal } from '@/components/AutoReveal';
import { AvisoProximamente, CourseCard, soles } from '@/components/CourseCard';
import {
  AwardIcon,
  CalendarIcon,
  ClockIcon,
  FileIcon,
  UserIcon,
  VideoIcon,
  WhatsAppIcon,
} from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { getCourse, getCourses, getSettings } from '@/lib/api';
import { breadcrumbSchema, buildMetadata, courseSchema } from '@/lib/seo';
import type { CourseDTO, CourseMode } from '@/lib/types';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';
import { enTitulo } from '@/lib/format';

// HTML estático; el gestor lo invalida al guardar (etiqueta "courses")
export const revalidate = 86400;
// Un curso nuevo del gestor se genera en su primera visita
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

/** Valor de schema.org/CourseInstance.courseMode */
const MODO_SCHEMA: Record<CourseMode, string> = {
  ONLINE: 'Online',
  ONSITE: 'Onsite',
  BLENDED: 'Blended',
};

/** Título para Google: "Nombre | Curso ICGC" si entra en 60 letras; si no, solo el nombre. */
function tituloCurso(curso: CourseDTO): string {
  const completo = `${curso.name} | Curso ICGC`;
  return completo.length <= 60 ? completo : curso.name;
}

function descripcionCurso(curso: CourseDTO): string {
  return `${curso.summary} ${curso.lectiveHours} horas lectivas, ${curso.modality.toLowerCase()}, con certificado.`;
}

export async function generateStaticParams() {
  const cursos = await getCourses();
  return cursos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [curso, settings] = await Promise.all([getCourse(slug), getSettings()]);

  if (!curso) return { title: 'Curso no encontrado', robots: { index: false, follow: false } };

  return buildMetadata({
    title: tituloCurso(curso),
    description: descripcionCurso(curso),
    path: `/cursos/${curso.slug}`,
    settings,
    image: curso.coverImage
      ? {
          url: curso.coverImage.url,
          width: curso.coverImage.width,
          height: curso.coverImage.height,
          alt: curso.coverAlt ?? curso.coverImage.alt ?? curso.name,
        }
      : null,
  });
}

export default async function CursoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [curso, settings, cursos] = await Promise.all([
    getCourse(slug),
    getSettings(),
    getCourses(),
  ]);

  // 404 real: Google necesita el código, no una página vacía con 200
  if (!curso) notFound();

  const urlWhatsapp = (c: CourseDTO) =>
    whatsappUrl(
      settings,
      `Hola, vengo de la página web. Quiero más información sobre el curso "${c.name}".`,
    );
  const otros = cursos.filter((c) => c.slug !== curso.slug).slice(0, 3);

  // Cada dato con su ícono (los mismos de los óvalos de la cabecera)
  const datos = [
    { etiqueta: 'Modalidad', valor: curso.modality, Icono: VideoIcon },
    { etiqueta: 'Duración', valor: curso.duration, Icono: CalendarIcon },
    { etiqueta: 'Horas lectivas', valor: `${curso.lectiveHours} horas`, Icono: ClockIcon },
    { etiqueta: 'Material', valor: curso.material, Icono: FileIcon },
    { etiqueta: 'Certificación', valor: curso.certificate, Icono: AwardIcon },
    { etiqueta: 'Docente', valor: curso.instructor, Icono: UserIcon },
  ].filter((d): d is (typeof d & { valor: string }) => Boolean(d.valor));

  return (
    <>
      <JsonLd
        data={[
          courseSchema(
            {
              slug: curso.slug,
              name: curso.name,
              description: curso.summary,
              audience: curso.audience,
              topics: curso.topics,
              mode: MODO_SCHEMA[curso.mode],
              hours: curso.lectiveHours,
              comingSoon: curso.comingSoon,
              price: curso.price,
              image: curso.coverImage?.url,
            },
            settings,
          ),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Cursos', path: '/cursos' },
            { name: curso.name, path: `/cursos/${curso.slug}` },
          ]),
        ]}
      />

      <div className="container-icgc grid gap-10 pb-16 pt-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:pt-8">
        <article className="min-w-0">
          <header>
            <nav aria-label="Ruta de navegación" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="font-medium text-brand-700 hover:text-brand-900">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/cursos" className="font-medium text-brand-700 hover:text-brand-900">
                    Cursos
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="eyebrow">Curso de capacitación</p>
              {curso.comingSoon && <AvisoProximamente />}
            </div>
            {/* El h1 de la página es el nombre del curso. Uno solo. */}
            <h1 className="mt-2 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
              {enTitulo(curso.name)}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-slate-600">
              {curso.summary}
            </p>

            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              <li className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-3.5 py-1.5 text-white">
                <VideoIcon size={16} />
                {curso.modality}
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-brand-900">
                <ClockIcon size={16} />
                {curso.lectiveHours} horas lectivas
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3.5 py-1.5 text-brand-900">
                <CalendarIcon size={16} />
                {curso.duration}
              </li>
            </ul>
          </header>

          {curso.objective && (
            <section aria-labelledby="para-que" className="mt-10 rounded-xl border-l-4 border-dorado bg-arena p-6">
              <h2 id="para-que" className="text-xl">
                ¿Para Qué te Sirve?
              </h2>
              <p className="mt-2 text-pretty leading-relaxed text-texto">{curso.objective}</p>
            </section>
          )}

          <section aria-labelledby="programa" className="mt-10">
            <h2 id="programa" className="text-2xl">
              Contenido del Programa
            </h2>
            <ol className="mt-5 grid gap-3 md:grid-cols-2">
              {curso.topics.map((tema, i) => (
                <li
                  key={tema}
                  className="flex gap-3.5 rounded-xl border border-silver-200 bg-white p-4 text-texto shadow-card"
                >
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{tema}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="dirigido" className="mt-10">
            <h2 id="dirigido" className="text-2xl">
              ¿A Quién Va Dirigido?
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-texto">{curso.audience}</p>
          </section>
        </article>

        {/* ── Columna derecha: foto, precio y contacto, a la vista ── */}
        <aside aria-label="Resumen del curso" className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-silver-200 bg-white shadow-card lg:sticky lg:top-28">
            {curso.coverImage && (
              <div className="relative aspect-[16/10] bg-brand-50">
                <Image
                  src={curso.coverImage.url}
                  alt={curso.coverAlt ?? curso.coverImage.alt ?? ''}
                  fill
                  // Foto pequeña: no se estira más allá de su tamaño real
                  sizes="(max-width: 1024px) 100vw, 352px"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              {/* El precio solo aparece aquí, en el detalle del curso */}
              {curso.price != null && (
                <p className="mb-5 border-b border-silver-200 pb-5">
                  <span className="block text-xs font-bold uppercase tracking-wider text-brand-700">
                    Inversión
                  </span>
                  <span className="text-3xl font-extrabold text-brand-900">
                    {soles.format(curso.price)}
                  </span>
                </p>
              )}
              <dl className="space-y-3 text-sm">
                {datos.map((dato) => (
                  <div key={dato.etiqueta} className="flex justify-between gap-4">
                    <dt className="inline-flex items-center gap-2 font-semibold text-slate-500">
                      <dato.Icono size={16} className="shrink-0 text-dorado" />
                      {dato.etiqueta}
                    </dt>
                    <dd className="text-right font-semibold text-texto">{dato.valor}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={urlWhatsapp(curso)}
                {...propsEnlace(urlWhatsapp(curso))}
                className="btn-whatsapp mt-6 w-full py-3.5"
              >
                <WhatsAppIcon size={18} />
                {curso.comingSoon ? 'Avísame cuando abra' : 'Quiero inscribirme'}
                <span className="sr-only"> en el curso {curso.name}</span>
              </Link>
              <Link
                href="/cursos"
                className="mt-3 block text-center text-sm font-semibold text-brand-700 hover:text-brand-900"
              >
                Ver todos los cursos de capacitación
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Otros cursos: enlazado interno entre páginas de cursos ── */}
      {otros.length > 0 && (
        <section aria-labelledby="otros-cursos" className="border-t border-silver-200 bg-brand-soft">
          <div className="container-icgc py-14 lg:py-16">
            <h2 id="otros-cursos" className="text-2xl sm:text-3xl">
              Otros Cursos del ICGC
            </h2>
            <ul data-revelar-hijos className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otros.map((c) => (
                <li key={c.slug}>
                  <CourseCard curso={c} masInfoUrl={urlWhatsapp(c)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <AutoReveal />
    </>
  );
}
