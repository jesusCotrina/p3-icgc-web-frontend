import type { Metadata } from 'next';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { CourseCard } from '@/components/CourseCard';
import { FondoLineas } from '@/components/FondoLineas';
import { JsonLd } from '@/components/JsonLd';
import { ProgramaAMedida } from '@/components/ProgramaAMedida';
import { getCourses, getSettings } from '@/lib/api';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import type { CourseDTO } from '@/lib/types';
import { whatsappUrl } from '@/lib/whatsapp';

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

/**
 * Catálogo de cursos, al estilo de los catálogos universitarios: una grilla de
 * tarjetas y cada una lleva a la página propia del curso (/cursos/<slug>),
 * que es la que Google indexa y muestra en las búsquedas de cada tema.
 */
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
          // El detalle (schema Course) va en la página de cada curso; aquí,
          // la lista que le dice a Google cuáles son y dónde están
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Cursos de capacitación del ICGC',
            url: absoluteUrl('/cursos'),
            itemListElement: cursos.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.name,
              url: absoluteUrl(`/cursos/${c.slug}`),
            })),
          },
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Cursos', path: '/cursos' },
          ]),
        ]}
      />

      {/* ── Cabecera: arena con una sola línea dorada ── */}
      <section className="relative isolate overflow-hidden border-b border-dorado/25 bg-arena">
        <FondoLineas lineas="una" className="-z-10" />
        <div className="container-icgc flex max-w-6xl flex-wrap items-end justify-between gap-6 py-10 lg:py-12">
          <div className="max-w-3xl">
            <p className="eyebrow">Capacitación</p>
            <h1 className="mt-2 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
              Cursos de Capacitación en Gestión Comunal
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
              Programas en vivo, con material digital y certificado del ICGC, pensados para
              dirigentes, comuneros y profesionales que trabajan con comunidades de todo el Perú.
            </p>
          </div>
          {cursos.length > 0 && (
            <dl className="flex gap-3">
              {[{ valor: cursos.length, etiqueta: cursos.length === 1 ? 'curso' : 'cursos' }].map((dato) => (
                <div key={dato.etiqueta} className="rounded-xl border border-brand-100 bg-white px-5 py-3 text-center shadow-card">
                  <dt className="sr-only">{dato.etiqueta}</dt>
                  <dd>
                    <span className="block text-2xl font-extrabold text-brand-800">{dato.valor}</span>
                    <span className="text-xs font-semibold text-slate-600">{dato.etiqueta}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* ── Catálogo ── */}
      <section aria-labelledby="cursos-titulo" className="container-icgc max-w-6xl py-12 lg:py-14">
        <h2 id="cursos-titulo" className="sr-only">
          Nuestros Cursos
        </h2>
        {cursos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-silver-300 p-12 text-center text-slate-500">
            Pronto publicaremos nuestros próximos cursos.
          </p>
        ) : (
          <ul data-revelar-hijos className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cursos.map((curso) => (
              <li key={curso.slug}>
                <CourseCard curso={curso} masInfoUrl={urlCurso(curso)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Programa a medida: se arma y se envía por WhatsApp ── */}
      <section aria-labelledby="medida-titulo">
        <ProgramaAMedida temas={cursos.map((c) => c.name)} whatsapp={settings.whatsapp} />
        <p className="container-icgc mt-5 text-center text-sm text-slate-600">
          ¿Prefieres escribirnos con calma?{' '}
          <Link href="/nosotros#contacto" className="font-semibold text-brand-700 underline underline-offset-2">
            Usa el formulario de contacto del ICGC
          </Link>
          .
        </p>
      </section>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}
