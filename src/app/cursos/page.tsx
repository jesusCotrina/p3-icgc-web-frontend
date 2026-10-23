import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { Carousel } from '@/components/Carousel';
import { AvisoProximamente, CourseCard } from '@/components/CourseCard';
import { CoursesExplorer } from '@/components/CoursesExplorer';
import { JsonLd } from '@/components/JsonLd';
import { WhatsAppIcon } from '@/components/Icons';
import { getCourses, getSettings } from '@/lib/api';
import { absoluteUrl, breadcrumbSchema, buildMetadata, courseSchema } from '@/lib/seo';
import type { CourseDTO, CourseMode } from '@/lib/types';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Cursos de capacitación en gestión comunal | ICGC',
    description:
      'Cursos del ICGC en gestión comunal, marco legal, formulación de proyectos y liderazgo, ' +
      'en vivo por Zoom, con material digital y certificado para todo el Perú.',
    path: '/cursos',
    settings,
  });
}

/** Valor de schema.org/CourseInstance.courseMode */
const MODO_SCHEMA: Record<CourseMode, string> = {
  ONLINE: 'Online',
  ONSITE: 'Onsite',
  BLENDED: 'Blended',
};

/** Ficha completa de un curso: se muestra debajo del carrusel al elegirlo. */
function FichaCurso({ curso, masInfoUrl }: { curso: CourseDTO; masInfoUrl: string }) {
  const datos = [
    { etiqueta: 'Dirigido a', valor: curso.audience },
    { etiqueta: 'Dictado por', valor: curso.instructor },
    { etiqueta: 'Modalidad', valor: curso.modality },
    { etiqueta: 'Duración', valor: `${curso.duration} · ${curso.lectiveHours} horas lectivas` },
    { etiqueta: 'Material', valor: curso.material },
    { etiqueta: 'Certificación', valor: curso.certificate },
  ].filter((d): d is { etiqueta: string; valor: string } => Boolean(d.valor));

  return (
    <article
      aria-labelledby={`ficha-${curso.slug}`}
      className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-card-hover"
    >
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative aspect-[16/9] bg-brand-50 lg:aspect-auto lg:min-h-[24rem]">
          {curso.coverImage && (
            <Image
              src={curso.coverImage.url}
              alt={curso.coverAlt ?? curso.coverImage.alt ?? ''}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="p-7 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Detalle del curso</p>
            {curso.comingSoon && <AvisoProximamente />}
          </div>
          <h2 id={`ficha-${curso.slug}`} className="mt-2 text-balance text-3xl leading-tight">
            {curso.name}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-brand-600 px-3 py-1 text-white">{curso.modality}</span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
              {curso.lectiveHours} horas lectivas
            </span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{curso.duration}</span>
          </div>

          <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-brand-700">
            Sobre el curso
          </h3>
          <p className="mt-2 text-pretty leading-relaxed text-slate-600">{curso.summary}</p>

          {curso.objective && (
            <>
              <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-brand-700">
                ¿Para qué te sirve?
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-slate-600">{curso.objective}</p>
            </>
          )}

          <dl className="mt-7 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
            {datos.map((dato) => (
              <div key={dato.etiqueta}>
                <dt className="font-semibold text-brand-800">{dato.etiqueta}</dt>
                <dd className="mt-0.5 text-slate-600">{dato.valor}</dd>
              </div>
            ))}
          </dl>

          <Link href={masInfoUrl} {...propsEnlace(masInfoUrl)} className="btn-whatsapp mt-8">
            <WhatsAppIcon size={18} />
            Más información
            <span className="sr-only"> sobre el curso {curso.name}</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-silver-200 bg-brand-soft p-7 lg:p-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-700">
          Contenido del programa
        </h3>
        <ol className="mt-5 grid gap-x-8 gap-y-3 text-sm leading-relaxed text-slate-700 md:grid-cols-2">
          {curso.topics.map((tema, i) => (
            <li key={tema} className="flex gap-3">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              {tema}
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export default async function CursosPage() {
  // Los cursos se administran en el gestor: los mismos del carrusel del inicio
  const [settings, cursos] = await Promise.all([getSettings(), getCourses()]);
  const urlCurso = (curso: CourseDTO) =>
    whatsappUrl(
      settings,
      `Hola, vengo de la página web. Quiero más información sobre el curso "${curso.name}".`,
    );

  return (
    <>
      <JsonLd
        data={[
          // Cada curso se declara como schema.org/Course: es lo que habilita
          // que Google lo muestre como resultado enriquecido de curso
          ...cursos.map((c) =>
            courseSchema(
              {
                slug: c.slug,
                name: c.name,
                description: c.summary,
                audience: c.audience,
                topics: c.topics,
                mode: MODO_SCHEMA[c.mode],
                hours: c.lectiveHours,
                comingSoon: c.comingSoon,
                image: c.coverImage?.url,
              },
              settings,
            ),
          ),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Cursos de capacitación del ICGC',
            url: absoluteUrl('/cursos'),
            itemListElement: cursos.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.name,
              url: absoluteUrl(`/cursos#${c.slug}`),
            })),
          },
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Cursos', path: '/cursos' },
          ]),
        ]}
      />

      {/* Cabecera compacta, pegada al carrusel: título y cursos se ven juntos
          en la primera pantalla, sin una franja que los separe */}
      <section className="container-icgc pt-8 lg:pt-10">
        <p className="eyebrow">Capacitación</p>
        <h1 className="mt-2 max-w-3xl text-balance text-3xl font-extrabold leading-tight">
          Cursos de capacitación en gestión comunal
        </h1>
      </section>

      <section aria-labelledby="cursos-titulo" className="container-icgc pb-12 pt-6 lg:pb-14">
        {cursos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-silver-300 p-12 text-center text-slate-500">
            Pronto publicaremos nuestros próximos cursos.
          </p>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-t border-silver-200 pt-5">
              <h2 id="cursos-titulo" className="text-xl">
                Nuestros cursos
              </h2>
              <p className="rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700">
                {cursos.length} {cursos.length === 1 ? 'curso disponible' : 'cursos disponibles'}
              </p>
            </div>

            <CoursesExplorer
              // El mismo carrusel del inicio
              carrusel={
                <Carousel
                  label="Cursos de capacitación"
                  autoplayMs={4000}
                  itemClassName="w-[75%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                >
                  {cursos.map((curso) => (
                    <CourseCard key={curso.slug} curso={curso} masInfoUrl={urlCurso(curso)} />
                  ))}
                </Carousel>
              }
              fichas={cursos.map((curso) => ({
                slug: curso.slug,
                contenido: <FichaCurso curso={curso} masInfoUrl={urlCurso(curso)} />,
              }))}
            />
          </>
        )}
      </section>

      <section className="container-icgc pb-20">
        <div className="rounded-2xl bg-brand-gradient px-8 py-14 text-center">
          <h2 className="text-balance text-3xl text-white">¿Necesitas un programa a medida?</h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Adaptamos contenidos, duración y modalidad a la realidad de tu comunidad u
            organización.
          </p>
          <Link href="/nosotros#contacto" className="btn-light mt-8">
            Conversemos sobre tu caso
          </Link>
        </div>
      </section>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}
