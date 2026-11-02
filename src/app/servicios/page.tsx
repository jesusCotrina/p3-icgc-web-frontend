import type { Metadata } from 'next';
import { AutoReveal } from '@/components/AutoReveal';
import { FondoLineas } from '@/components/FondoLineas';
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
    title: 'Capacitación y asesoría en gestión comunal | ICGC',
    description:
      'Diplomados, cursos, talleres y asesoría en gestión comunal y empresarial, ingeniería, ' +
      'derecho y relaciones comunitarias: proyectos, contratos, negociaciones y cumplimiento.',
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

      {/* ── Cabecera: arena con una sola línea dorada ── */}
      <section className="relative isolate overflow-hidden border-b border-dorado/25 bg-arena">
        <FondoLineas lineas="una" className="-z-10" />
        <div className="container-icgc max-w-6xl py-10 lg:py-12">
          <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
            Capacitación y Asesoría para la Gestión Comunal y Empresarial
          </h1>
          <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-texto">
            Brindamos diplomados, cursos, talleres y asesoría especializada en gestión comunal y
            empresarial, ingeniería, derecho y relaciones comunitarias. Fortalecemos capacidades y
            acompañamos proyectos, contratos y negociaciones, con enfoque en seguridad, gestión
            ambiental y cumplimiento normativo.
          </p>
        </div>
      </section>

      {/* ── Servicios ── */}
      <section aria-labelledby="lista-servicios" className="container-icgc max-w-6xl py-12 lg:py-14">
        <h2 id="lista-servicios" className="sr-only">
          Nuestros Servicios
        </h2>
        <ul data-revelar-hijos className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SERVICIOS.map((s) => (
            <li key={s.slug}>
              <ServicioCard servicio={s} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Experiencia y relacionamiento: la misma cinta de logos del inicio ── */}
      <SeccionClientes />

      {/* ── Siguiente paso: franja de borde a borde que empalma con el pie ── */}
      <section aria-labelledby="cta-titulo">
        <OrientadorSiguientePaso whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
      <AutoReveal />
    </>
  );
}
