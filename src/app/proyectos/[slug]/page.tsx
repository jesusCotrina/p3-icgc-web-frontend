import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AutoReveal } from '@/components/AutoReveal';
import { ConsultaProyecto } from '@/components/ConsultaProyecto';
import { BlueprintIcon, WhatsAppIcon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { esProyectoDeEjemplo, getProject, getProjects, getSettings } from '@/lib/api';
import { nombreRegion } from '@/lib/presencia';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';
import { enTitulo } from '@/lib/format';

// HTML estático; el gestor lo invalida al guardar (etiqueta "projects")
export const revalidate = 86400;
// Un proyecto nuevo del gestor se genera en su primera visita
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const proyectos = await getProjects();
  return proyectos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [proyecto, settings] = await Promise.all([getProject(slug), getSettings()]);
  if (!proyecto) return { title: 'Proyecto no encontrado', robots: { index: false, follow: false } };

  const completo = `${proyecto.title} | ICGC`;
  return buildMetadata({
    title: completo.length <= 60 ? completo : proyecto.title,
    description: `${proyecto.objective} ${proyecto.location}, ${nombreRegion(proyecto.region)}.`,
    path: `/proyectos/${proyecto.slug}`,
    settings,
    // Los de muestra no se indexan
    noindex: esProyectoDeEjemplo(proyecto),
    image: proyecto.coverImage
      ? {
          url: proyecto.coverImage.url,
          width: proyecto.coverImage.width,
          height: proyecto.coverImage.height,
          alt: proyecto.coverAlt ?? proyecto.coverImage.alt ?? proyecto.title,
        }
      : null,
  });
}

export default async function ProyectoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [proyecto, settings, proyectos] = await Promise.all([
    getProject(slug),
    getSettings(),
    getProjects(),
  ]);
  // 404 real: Google necesita el código, no una página vacía con 200
  if (!proyecto) notFound();

  const region = nombreRegion(proyecto.region);
  const urlWhatsapp = whatsappUrl(
    settings,
    `Hola, vengo de la página web. Quiero más información sobre el proyecto "${proyecto.title}".`,
  );
  // Otros tres proyectos: primero los de la misma región (enlazado interno)
  const otros = [
    ...proyectos.filter((p) => p.slug !== proyecto.slug && p.region === proyecto.region),
    ...proyectos.filter((p) => p.slug !== proyecto.slug && p.region !== proyecto.region),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Project',
            '@id': absoluteUrl(`/proyectos/${proyecto.slug}`),
            name: proyecto.title,
            description: proyecto.objective,
            url: absoluteUrl(`/proyectos/${proyecto.slug}`),
            ...(proyecto.company ? { funder: { '@type': 'Organization', name: proyecto.company } } : {}),
            // Los trabajos realizados, como partes del proyecto
            ...(proyecto.items.length > 0
              ? {
                  subjectOf: {
                    '@type': 'ItemList',
                    name: `Trabajos realizados: ${proyecto.title}`,
                    itemListElement: proyecto.items.map((item, i) => ({
                      '@type': 'ListItem',
                      position: i + 1,
                      name: item.title,
                      description: item.description,
                    })),
                  },
                }
              : {}),
            ...(proyecto.coverImage ? { image: proyecto.coverImage.url } : {}),
            location: {
              '@type': 'Place',
              name: `${proyecto.location}, ${region}, Perú`,
              ...(proyecto.latitude != null && proyecto.longitude != null
                ? {
                    geo: {
                      '@type': 'GeoCoordinates',
                      latitude: proyecto.latitude,
                      longitude: proyecto.longitude,
                    },
                  }
                : {}),
            },
            sponsor: { '@id': `${settings.siteUrl}/#organization` },
          },
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Proyectos', path: '/proyectos' },
            { name: proyecto.title, path: `/proyectos/${proyecto.slug}` },
          ]),
        ]}
      />

      {/* ── Cabecera: título y datos clave a la izquierda, foto a la derecha ── */}
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
                  <Link href="/proyectos" className="font-medium text-brand-700 hover:text-brand-900">
                    Proyectos
                  </Link>
                </li>
              </ol>
            </nav>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {proyecto.company && (
                <span className="rounded-full bg-brand-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-dorado-claro">
                  {proyecto.company}
                </span>
              )}
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
                {proyecto.location}
                {proyecto.location.includes(region) ? '' : ` · ${region}`}
              </span>
            </div>
            {/* El h1 de la página es el nombre del proyecto. Uno solo. */}
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
              {enTitulo(proyecto.title)}
            </h1>
            <p className="mt-3 text-lg font-bold text-brand-800">{proyecto.community}</p>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-600">
              {proyecto.objective}
            </p>
            <Link href={urlWhatsapp} {...propsEnlace(urlWhatsapp)} className="btn-whatsapp mt-7 font-bold">
              <WhatsAppIcon size={18} />
              Consultar por este proyecto
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-silver-200 shadow-card">
            {proyecto.coverImage && (
              <Image
                src={proyecto.coverImage.url}
                alt={proyecto.coverAlt ?? proyecto.coverImage.alt ?? proyecto.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* ── Trabajos realizados: uno por tarjeta, cada uno con su ícono ── */}
      {proyecto.items.length > 0 && (
        <section aria-labelledby="trabajos" className="container-icgc max-w-6xl py-12 lg:py-14">
          <h2 id="trabajos" className="text-2xl sm:text-3xl">
            Trabajos Realizados
          </h2>
          <ul data-revelar-hijos className="mt-7 grid gap-4 sm:grid-cols-2">
            {proyecto.items.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-xl border border-silver-200 bg-white p-5 shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <BlueprintIcon size={20} />
                </span>
                <div>
                  <h3 className="text-lg font-bold leading-snug text-brand-900">{enTitulo(item.title)}</h3>
                  {item.description && (
                    <p className="mt-1.5 text-pretty leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Otros proyectos: enlazado interno ── */}
      {otros.length > 0 && (
        <section aria-labelledby="otros-proyectos" className="bg-brand-soft py-12 lg:py-14">
          <div className="container-icgc max-w-6xl">
            <h2 id="otros-proyectos" className="text-2xl sm:text-3xl">
              Otros Proyectos del ICGC
            </h2>
            <ul className="mt-7 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {otros.map((p) => (
                <li key={p.slug}>
                  <ProjectFlipCard proyecto={p} alto="h-[24rem]" rectas mosaico />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Cierre: franja de borde a borde que empalma con el pie ── */}
      <section aria-labelledby="consulta-titulo">
        <ConsultaProyecto whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
      <AutoReveal />
    </>
  );
}
