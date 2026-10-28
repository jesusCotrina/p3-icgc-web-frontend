import type { Metadata } from 'next';
import { AutoReveal } from '@/components/AutoReveal';
import { JsonLd } from '@/components/JsonLd';
import { OrientadorSiguientePaso } from '@/components/OrientadorSiguientePaso';
import { SeccionClientes } from '@/components/SeccionClientes';
import { ServicioCard } from '@/components/ServicioCard';
import { getSettings } from '@/lib/api';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { SERVICIOS } from '@/lib/servicios';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Servicios de consultoría para comunidades | ICGC',
    description:
      'Empresas comunales, organización comunal, negociación de tierras y convenios, gestión de ' +
      'conflictos, obras, licitaciones y capacitación para las comunidades.',
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
            '@id': absoluteUrl(`/servicios/${s.slug}`),
            name: s.titulo,
            description: s.descripcion,
            image: absoluteUrl(s.imagen),
            url: absoluteUrl(`/servicios/${s.slug}`),
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
              url: absoluteUrl(`/servicios/${s.slug}`),
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
            Acompañamos a comunidades campesinas y a sus empresas en todo el camino: desde ordenar
            la organización y negociar con empresas mineras y privadas hasta ejecutar sus obras y
            capacitar a sus dirigentes.
          </p>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section aria-labelledby="lista-servicios" className="container-icgc max-w-6xl py-12 lg:py-14">
        <h2 id="lista-servicios" className="sr-only">
          Nuestros servicios
        </h2>
        <ul data-revelar-hijos className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SERVICIOS.map((s) => (
            <li key={s.slug}>
              <ServicioCard servicio={s} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Confían en nosotros: la misma cinta de logos del inicio ── */}
      <SeccionClientes />

      {/* ── Siguiente paso: franja de borde a borde que empalma con el pie ── */}
      <section aria-labelledby="cta-titulo" className="-mb-12">
        <OrientadorSiguientePaso whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
      <AutoReveal />
    </>
  );
}
