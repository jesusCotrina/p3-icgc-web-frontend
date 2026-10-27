import type { Metadata } from 'next';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { JsonLd } from '@/components/JsonLd';
import { OrientadorSiguientePaso } from '@/components/OrientadorSiguientePaso';
import { getSettings } from '@/lib/api';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { SERVICIOS } from '@/lib/servicios';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Servicios de consultoría para comunidades | ICGC',
    description:
      'Licitaciones con el Estado, expedientes técnicos, supervisión de obras, saneamiento del ' +
      'territorio y capacitación para comunidades campesinas y nativas del Perú.',
    path: '/servicios',
    settings,
  });
}

/**
 * Todos los servicios del instituto en una sola página. Cada tarjeta enlaza a
 * donde se explica en detalle (proyectos, blog o cursos): enlazado interno.
 */
export default async function ServiciosPage() {
  const settings = await getSettings();

  return (
    <>
      <JsonLd
        data={[
          // Cada servicio como schema.org/Service: Google entiende qué ofrece el instituto
          ...SERVICIOS.map((s) => ({
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': absoluteUrl(`/servicios#${s.slug}`),
            name: s.titulo,
            description: s.descripcion,
            url: absoluteUrl(`/servicios#${s.slug}`),
            serviceType: 'Consultoría',
            areaServed: { '@type': 'Country', name: 'Perú' },
            provider: { '@id': `${settings.siteUrl}/#organization` },
          })),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Servicios del ICGC',
            url: absoluteUrl('/servicios'),
            itemListElement: SERVICIOS.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: s.titulo,
              url: absoluteUrl(`/servicios#${s.slug}`),
            })),
          },
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Servicios', path: '/servicios' },
          ]),
        ]}
      />

      {/* ── Cabecera ── */}
      <section className="border-b border-silver-200 bg-brand-soft">
        <div className="container-icgc max-w-6xl py-10 lg:py-12">
          <p className="eyebrow">Servicios</p>
          <h1 className="mt-2 max-w-3xl text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
            Servicios de consultoría para comunidades
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-slate-600">
            Acompañamos a comunidades campesinas, nativas y organizaciones en todo el camino: desde
            ordenar la comunidad y sanear su territorio hasta ganar una licitación y ejecutar la obra.
          </p>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section aria-labelledby="lista-servicios" className="container-icgc max-w-6xl py-12 lg:py-14">
        <h2 id="lista-servicios" className="sr-only">
          Nuestros servicios
        </h2>
        <ul data-revelar-hijos className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICIOS.map((s) => (
            <li key={s.slug} id={s.slug} className="scroll-mt-28">
              <article className="group flex h-full flex-col rounded-2xl border border-silver-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover">
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
                <h3 className="mt-5 text-lg leading-snug">{s.titulo}</h3>
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
            </li>
          ))}
        </ul>
      </section>

      {/* ── Siguiente paso: arma la consulta y la envía por WhatsApp ── */}
      <section aria-labelledby="cta-titulo" className="container-icgc max-w-6xl pb-20">
        <OrientadorSiguientePaso whatsapp={settings.whatsapp} />
      </section>
      <AutoReveal />
    </>
  );
}
