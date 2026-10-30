import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AutoReveal } from '@/components/AutoReveal';
import { CheckIcon, WhatsAppIcon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { OrientadorSiguientePaso } from '@/components/OrientadorSiguientePaso';
import { ServicioCard } from '@/components/ServicioCard';
import { getSettings } from '@/lib/api';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { COMO_TRABAJAMOS, SERVICIOS, servicioPorSlug } from '@/lib/servicios';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';
import { enTitulo } from '@/lib/format';

export const revalidate = 86400;
// Los servicios viven en el código: un slug que no está en la lista es un 404 real
export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const servicio = servicioPorSlug(slug);
  if (!servicio) return {};
  const settings = await getSettings();

  return buildMetadata({
    title: servicio.metaTitulo,
    description: servicio.metaDescripcion,
    path: `/servicios/${servicio.slug}`,
    settings,
    image: { url: absoluteUrl(servicio.imagen), width: 1600, height: 1000, alt: servicio.alt },
  });
}

export default async function ServicioPage({ params }: { params: Params }) {
  const { slug } = await params;
  const servicio = servicioPorSlug(slug);
  if (!servicio) notFound();

  const settings = await getSettings();
  const urlWhatsapp = whatsappUrl(
    settings,
    `Hola, vengo de la página web. Quiero información sobre el servicio "${servicio.titulo}".`,
  );
  // Tres servicios más, siguiendo el orden de la lista (enlazado interno)
  const indice = SERVICIOS.findIndex((s) => s.slug === servicio.slug);
  const otros = [1, 2, 3].map((n) => SERVICIOS[(indice + n) % SERVICIOS.length]!);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': absoluteUrl(`/servicios/${servicio.slug}`),
            name: servicio.titulo,
            description: servicio.descripcion,
            url: absoluteUrl(`/servicios/${servicio.slug}`),
            image: absoluteUrl(servicio.imagen),
            serviceType: servicio.titulo,
            areaServed: { '@type': 'Country', name: 'Perú' },
            provider: { '@id': `${settings.siteUrl}/#organization` },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `Qué incluye: ${servicio.titulo}`,
              itemListElement: servicio.incluye.map((punto) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: punto },
              })),
            },
          },
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Servicios', path: '/servicios' },
            { name: servicio.titulo, path: `/servicios/${servicio.slug}` },
          ]),
        ]}
      />

      {/* ── Cabecera: texto a la izquierda, foto a la derecha ── */}
      <section className="border-b border-silver-200 bg-brand-soft">
        <div className="container-icgc grid max-w-6xl items-center gap-8 py-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 lg:py-12">
          <div>
            <nav aria-label="Ruta de navegación" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="font-medium text-brand-700 hover:text-brand-900">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/servicios" className="font-medium text-brand-700 hover:text-brand-900">
                    Servicios
                  </Link>
                </li>
              </ol>
            </nav>
            <p className="eyebrow mt-4">Servicio</p>
            {/* El h1 de la página es el nombre del servicio. Uno solo. */}
            <h1 className="mt-2 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
              {enTitulo(servicio.titulo)}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
              {servicio.descripcion}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={urlWhatsapp} {...propsEnlace(urlWhatsapp)} className="btn-whatsapp font-bold">
                <WhatsAppIcon size={18} />
                Consultar por WhatsApp
                <span className="sr-only"> sobre {servicio.titulo}</span>
              </Link>
              <Link href="/servicios" className="btn-secondary font-bold">
                Ver todos los servicios
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-silver-200 shadow-card">
            <Image
              src={servicio.imagen}
              alt={servicio.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 460px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Qué incluye ── */}
      <section aria-labelledby="incluye" className="container-icgc max-w-6xl py-12 lg:py-14">
        <h2 id="incluye" className="text-2xl sm:text-3xl">
          ¿Qué Incluye el Servicio?
        </h2>
        <ul data-revelar-hijos className="mt-7 grid gap-4 sm:grid-cols-2">
          {servicio.incluye.map((punto) => (
            <li
              key={punto}
              className="flex gap-3.5 rounded-xl border border-silver-200 bg-white p-5 shadow-card"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                <CheckIcon size={16} />
              </span>
              <span className="pt-1 font-semibold leading-snug text-texto">{punto}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Cómo trabajamos ── */}
      <section aria-labelledby="como-trabajamos" className="bg-brand-soft py-12 lg:py-14">
        <div className="container-icgc max-w-6xl">
          <h2 id="como-trabajamos" className="text-2xl sm:text-3xl">
            Cómo Trabajamos
          </h2>
          <ol data-revelar-hijos className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMO_TRABAJAMOS.map((paso) => (
              <li key={paso.numero} className="card p-6">
                <span className="text-3xl font-black text-brand-200">{paso.numero}</span>
                <h3 className="mt-2 text-lg">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Temas relacionados: cursos, artículos y proyectos ── */}
      {servicio.relacionados.length > 0 && (
        <section aria-labelledby="relacionados" className="container-icgc max-w-6xl pt-12 lg:pt-14">
          <h2 id="relacionados" className="text-2xl sm:text-3xl">
            Para Saber Más
          </h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {servicio.relacionados.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  {r.texto}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Otros servicios ── */}
      <section aria-labelledby="otros-servicios" className="container-icgc max-w-6xl py-12 lg:py-16">
        <h2 id="otros-servicios" className="text-2xl sm:text-3xl">
          Otros Servicios del ICGC
        </h2>
        <ul data-revelar-hijos className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otros.map((s) => (
            <li key={s.slug}>
              <ServicioCard servicio={s} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Siguiente paso: la misma franja arena que cierra el inicio y /servicios ── */}
      <section aria-labelledby="cta-titulo">
        <OrientadorSiguientePaso whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
      <AutoReveal />
    </>
  );
}
