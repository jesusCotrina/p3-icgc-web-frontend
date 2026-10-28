import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AutoReveal } from '@/components/AutoReveal';
import { ConsultaProyecto } from '@/components/ConsultaProyecto';
import { CheckIcon, WhatsAppIcon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { esProyectoDeEjemplo, getProject, getProjects, getSettings } from '@/lib/api';
import { nombreRegion } from '@/lib/presencia';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { PROJECT_STATUS_LABELS, type ProjectStatus } from '@/lib/types';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

// HTML estático; el gestor lo invalida al guardar (etiqueta "projects")
export const revalidate = 86400;
// Un proyecto nuevo del gestor se genera en su primera visita
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

/** Color de la etiqueta de estado. */
const ESTILO_ESTADO: Record<ProjectStatus, string> = {
  IN_PROGRESS: 'bg-amber-100 text-amber-900',
  COMPLETED: 'bg-emerald-100 text-emerald-900',
  IN_FORMULATION: 'bg-brand-100 text-brand-900',
  STOPPED: 'bg-rose-100 text-rose-900',
};

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

  const datos = [
    { etiqueta: 'Inversión', valor: proyecto.capital },
    { etiqueta: 'Duración', valor: proyecto.duration },
    { etiqueta: 'Área', valor: proyecto.area },
    { etiqueta: 'Comunidad', valor: proyecto.community },
    { etiqueta: 'Comunidades beneficiadas', valor: String(proyecto.communitiesBenefited) },
    { etiqueta: 'Quién lo ejecuta', valor: proyecto.implementingEntity },
    { etiqueta: 'Ubicación', valor: `${proyecto.location} (${region})` },
  ];

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
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${ESTILO_ESTADO[proyecto.status]}`}>
                {PROJECT_STATUS_LABELS[proyecto.status]}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
                {region}
              </span>
            </div>
            {/* El h1 de la página es el nombre del proyecto. Uno solo. */}
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
              {proyecto.title}
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
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

      {/* ── Todos los datos ── */}
      <section aria-labelledby="datos" className="container-icgc max-w-6xl py-12 lg:py-14">
        <h2 id="datos" className="text-2xl sm:text-3xl">
          Datos del proyecto
        </h2>
        <dl data-revelar-hijos className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datos.map((dato) => (
            <div key={dato.etiqueta} className="rounded-xl border border-silver-200 bg-white p-5 shadow-card">
              <dt className="text-xs font-bold uppercase tracking-wider text-brand-700">
                {dato.etiqueta}
              </dt>
              <dd className="mt-1.5 font-semibold leading-snug text-slate-900">{dato.valor}</dd>
            </div>
          ))}
        </dl>

        {proyecto.achievements.length > 0 && (
          <>
            <h2 className="mt-12 text-2xl sm:text-3xl">Avances y logros</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {proyecto.achievements.map((logro) => (
                <li
                  key={logro}
                  className="flex gap-3.5 rounded-xl border border-silver-200 bg-white p-4 shadow-card"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <CheckIcon size={14} />
                  </span>
                  <span className="pt-0.5 leading-relaxed text-slate-700">{logro}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ── Otros proyectos: enlazado interno ── */}
      {otros.length > 0 && (
        <section aria-labelledby="otros-proyectos" className="bg-brand-soft py-12 lg:py-14">
          <div className="container-icgc max-w-6xl">
            <h2 id="otros-proyectos" className="text-2xl sm:text-3xl">
              Otros proyectos del ICGC
            </h2>
            <ul className="mt-7 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {otros.map((p) => (
                <li key={p.slug}>
                  <ProjectFlipCard proyecto={p} alto="h-[24rem]" rectas resumido />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Cierre: franja de borde a borde que empalma con el pie ── */}
      <section aria-labelledby="consulta-titulo" className="-mb-12">
        <ConsultaProyecto whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
      <AutoReveal />
    </>
  );
}
