import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { Carousel } from '@/components/Carousel';
import { ConsultaProyecto } from '@/components/ConsultaProyecto';
import { JsonLd } from '@/components/JsonLd';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { ProjectsExplorer } from '@/components/ProjectsExplorer';
import { BlueprintIcon, CheckIcon, WhatsAppIcon } from '@/components/Icons';
import { getProjects, getSettings } from '@/lib/api';
import { nombreRegion } from '@/lib/presencia';
import {
  PROJECT_STATUS_LABELS,
  type ProjectDTO,
  type ProjectStatus,
  type SiteSettingsDTO,
} from '@/lib/types';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Proyectos: asesoría en licitaciones y obras comunales | ICGC',
    description:
      'Consultoría del ICGC en licitaciones, expedientes técnicos y ejecución de proyectos de ' +
      'infraestructura para comunidades campesinas, nativas y organizaciones del Perú.',
    path: '/proyectos',
    settings,
  });
}

/**
 * Las cuatro líneas de consultoría. Cada una se declara como schema.org/Service
 * para que Google entienda que el instituto presta estos servicios y no solo
 * dicta cursos.
 */
const SERVICIOS = [
  {
    slug: 'licitaciones',
    nombre: 'Licitaciones y contrataciones con el Estado',
    resumen:
      'Preparamos a la comunidad para competir y ganar procesos de selección: inscripción en el RNP, armado del expediente de participación, revisión de bases y acompañamiento en la firma del contrato.',
    entrega: 'Expediente de participación completo y revisado',
    temas: [
      'Inscripción y renovación en el Registro Nacional de Proveedores',
      'Lectura técnica de bases y absolución de consultas',
      'Armado y foliado del expediente de participación',
      'Recursos de apelación y defensa ante observaciones',
    ],
  },
  {
    slug: 'expedientes-tecnicos',
    nombre: 'Formulación de expedientes técnicos',
    resumen:
      'Del perfil al expediente aprobado. Trabajamos el diagnóstico, la ingeniería del proyecto, los metrados y el presupuesto hasta dejarlo listo para su evaluación.',
    entrega: 'Expediente técnico apto para evaluación',
    temas: [
      'Diagnóstico participativo y árbol de problemas',
      'Memoria descriptiva e ingeniería del proyecto',
      'Metrados, análisis de precios unitarios y presupuesto',
      'Cronograma valorizado y sustento de sostenibilidad',
    ],
  },
  {
    slug: 'ejecucion-de-obra',
    nombre: 'Ejecución y supervisión de infraestructura',
    resumen:
      'Acompañamos la obra mientras se construye: control de avance, valorizaciones, cuaderno de obra y la documentación que después exige la liquidación.',
    entrega: 'Obra documentada y lista para liquidar',
    temas: [
      'Control de avance físico y financiero',
      'Valorizaciones mensuales y adicionales de obra',
      'Cuaderno de obra y actas de conformidad',
      'Liquidación técnica y financiera',
    ],
  },
  {
    slug: 'gestion-comunal',
    nombre: 'Saneamiento y organización comunal',
    resumen:
      'La base sin la cual ningún proyecto avanza: padrón actualizado, junta directiva inscrita, actas en regla y territorio saneado.',
    entrega: 'Comunidad con documentación en regla',
    temas: [
      'Actualización y depuración del padrón comunal',
      'Inscripción de junta directiva en Registros Públicos',
      'Regularización del libro de actas',
      'Saneamiento físico-legal del territorio',
    ],
  },
] as const;

/** Color de la etiqueta de estado sobre la portada. */
const ESTILO_ESTADO: Record<ProjectStatus, string> = {
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  IN_FORMULATION: 'bg-brand-100 text-brand-800',
  STOPPED: 'bg-rose-100 text-rose-800',
};

const PASOS = [
  {
    numero: '01',
    titulo: 'Diagnóstico',
    texto: 'Revisamos el estado real del proyecto y de la documentación de la comunidad.',
  },
  {
    numero: '02',
    titulo: 'Propuesta',
    texto: 'Te entregamos un plan de trabajo con alcance, plazos y costos claros.',
  },
  {
    numero: '03',
    titulo: 'Ejecución',
    texto: 'Trabajamos junto al equipo de la comunidad, no por encima de él.',
  },
  {
    numero: '04',
    titulo: 'Cierre',
    texto: 'Dejamos el expediente, la obra o el trámite documentado y transferido.',
  },
] as const;

/** Ficha completa: aparece a la derecha de la tarjeta elegida. */
function FichaProyecto({
  proyecto,
  settings,
}: {
  proyecto: ProjectDTO;
  settings: SiteSettingsDTO;
}) {
  const estado = PROJECT_STATUS_LABELS[proyecto.status];
  const urlProyecto = whatsappUrl(
    settings,
    `Hola, vengo de la página web. Quiero más información sobre el proyecto "${proyecto.title}".`,
  );
  const datos = [
    { etiqueta: 'Duración', valor: proyecto.duration },
    { etiqueta: 'Capital', valor: proyecto.capital },
    { etiqueta: 'Área que abarca', valor: proyecto.area },
    {
      etiqueta: 'Ubicación',
      valor: `${proyecto.location} (${nombreRegion(proyecto.region)})`,
    },
    { etiqueta: 'Comunidad', valor: proyecto.community },
    {
      etiqueta: 'Comunidades beneficiadas',
      valor: String(proyecto.communitiesBenefited),
    },
    { etiqueta: 'Entidad implementadora', valor: proyecto.implementingEntity },
  ];

  return (
    <article
      aria-label={`Ficha del proyecto ${proyecto.title}`}
      className="h-full cursor-auto overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-card-hover"
    >
      {/* En pantallas chicas la tarjeta se oculta: la foto viene en la ficha */}
      <div className="relative aspect-[16/9] bg-brand-50 xl:hidden">
        {proyecto.coverImage && (
          <Image
            src={proyecto.coverImage.url}
            alt={proyecto.coverAlt ?? proyecto.coverImage.alt ?? ''}
            fill
            sizes="(max-width: 1280px) 100vw, 1px"
            className="object-cover"
          />
        )}
      </div>

      <div className="p-6 xl:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${ESTILO_ESTADO[proyecto.status]}`}
            >
              {estado}
            </span>
            <p className="mt-3 text-balance font-display text-2xl font-bold leading-snug text-brand-900">
              {proyecto.title}
            </p>
          </div>
          <button
            type="button"
            data-cerrar-ficha
            aria-label="Cerrar la ficha del proyecto"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-silver-200 text-brand-800 transition-colors hover:bg-brand-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 xl:grid-cols-3">
          {datos.map((dato) => (
            <div key={dato.etiqueta}>
              <dt className="font-semibold text-brand-800">{dato.etiqueta}</dt>
              <dd className="mt-0.5 text-slate-600">{dato.valor}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-brand-700">
          Objetivo del proyecto
        </h3>
        <p className="mt-2 text-pretty leading-relaxed text-slate-600">{proyecto.objective}</p>

        {proyecto.achievements.length > 0 && (
          <>
            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-brand-700">
              Avances y logros
            </h3>
            <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
              {proyecto.achievements.map((logro) => (
                <li key={logro} className="flex gap-2.5">
                  <CheckIcon size={16} className="mt-1 shrink-0 text-brand-500" />
                  {logro}
                </li>
              ))}
            </ul>
          </>
        )}

        <Link href={urlProyecto} {...propsEnlace(urlProyecto)} className="btn-whatsapp mt-8">
          <WhatsAppIcon size={18} />
          Más información
          <span className="sr-only"> sobre el proyecto {proyecto.title}</span>
        </Link>
      </div>
    </article>
  );
}

export default async function ProyectosPage() {
  // Los proyectos se administran en el gestor
  const [settings, proyectos] = await Promise.all([getSettings(), getProjects()]);
  const urlAsesoria = whatsappUrl(settings, 'asesoria');

  return (
    <>
      <JsonLd
        data={[
          ...SERVICIOS.map((s) => ({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.nombre,
            description: s.resumen,
            serviceType: 'Consultoría',
            areaServed: { '@type': 'Country', name: 'Perú' },
            provider: { '@id': `${settings.siteUrl}/#organization` },
            ...(settings.logo ? { image: settings.logo.url } : {}),
          })),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Servicios de consultoría del ICGC',
            url: absoluteUrl('/proyectos'),
            itemListElement: SERVICIOS.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: s.nombre,
            })),
          },
          // Los proyectos, con ancla propia, para que Google los asocie a la página
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Proyectos acompañados por el ICGC',
            url: absoluteUrl('/proyectos'),
            itemListElement: proyectos.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Project',
                name: p.title,
                description: p.objective,
                url: absoluteUrl(`/proyectos#${p.slug}`),
                ...(p.coverImage ? { image: p.coverImage.url } : {}),
                location: `${p.location}, ${nombreRegion(p.region)}, Perú`,
              },
            })),
          },
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Proyectos', path: '/proyectos' },
          ]),
        ]}
      />

      {/* ── Proyectos: título chico a la izquierda, grilla 3 × 2 a la derecha ── */}
      <section className="border-b border-silver-200">
        <div className="container-icgc grid gap-8 pb-14 pt-8 lg:pt-10 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-10">
          <div className="xl:sticky xl:top-28 xl:self-start">
            <p className="eyebrow">Proyectos</p>
            <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight">
              Proyectos que acompañamos en el Perú
            </h1>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
              Obras y procesos que acompañamos junto a comunidades campesinas, nativas y entidades
              públicas: riego, infraestructura comunal y saneamiento del territorio.
            </p>
          </div>

          <div>
            {proyectos.length > 0 ? (
              <ProjectsExplorer
                items={proyectos.map((proyecto) => ({
                  slug: proyecto.slug,
                  tarjeta: (
                    <ProjectFlipCard
                      proyecto={proyecto}
                      nivel="h2"
                      textoEnlace="Ver ficha del proyecto"
                      alto="h-[22rem]"
                    />
                  ),
                  ficha: <FichaProyecto proyecto={proyecto} settings={settings} />,
                }))}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-silver-300 p-12 text-center text-slate-500">
                Pronto publicaremos los proyectos que acompañamos.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Consultoría y asesoría ── */}
      <section
        aria-labelledby="consultoria-titulo"
        className="border-b border-silver-200 bg-brand-soft"
      >
        <div className="container-icgc py-14 lg:py-16">
          <p className="eyebrow">Consultoría y asesoría</p>
          <h2 id="consultoria-titulo" className="mt-3 max-w-3xl text-balance text-3xl sm:text-4xl">
            Acompañamos tu proyecto de principio a fin
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
            Desde la licitación hasta la liquidación de la obra. Trabajamos con comunidades
            campesinas y nativas, municipalidades y organizaciones de todo el Perú.
          </p>

          <Link href={urlAsesoria} {...propsEnlace(urlAsesoria)} className="btn-whatsapp mt-8">
            <WhatsAppIcon size={18} />
            Quiero asesoría
          </Link>
        </div>
      </section>

      {/* ── Líneas de consultoría (carrusel) ── */}
      <section aria-labelledby="servicios-titulo" className="container-icgc py-14 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Líneas de consultoría</p>
          <h2 id="servicios-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
            Servicios para cada etapa del proyecto
          </h2>
        </div>

        <Carousel label="Servicios de consultoría">
          {SERVICIOS.map((servicio) => (
            <article
              key={servicio.slug}
              id={servicio.slug}
              className="card flex h-full scroll-mt-28 flex-col p-7"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <BlueprintIcon size={22} />
              </span>

              <h3 className="mt-5 text-xl leading-snug">{servicio.nombre}</h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
                {servicio.resumen}
              </p>

              <ul className="mt-5 space-y-2 text-sm leading-relaxed text-slate-700">
                {servicio.temas.map((tema) => (
                  <li key={tema} className="flex gap-2.5">
                    <CheckIcon size={16} className="mt-1 shrink-0 text-brand-500" />
                    {tema}
                  </li>
                ))}
              </ul>

              <p className="mb-6 mt-5 text-sm text-slate-500">
                <span className="font-semibold text-brand-800">Qué recibes:</span>{' '}
                {servicio.entrega}
              </p>

              <Link
                href={urlAsesoria}
                {...propsEnlace(urlAsesoria)}
                className="btn-primary mt-auto w-fit"
              >
                Consultar sobre este servicio
                <span className="sr-only">: {servicio.nombre}</span>
              </Link>
            </article>
          ))}
        </Carousel>
      </section>

      {/* ── Cómo trabajamos ── */}
      <section aria-labelledby="proceso" className="bg-brand-soft py-16 lg:py-20">
        <div className="container-icgc">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 id="proceso" className="mt-3 text-balance text-3xl sm:text-4xl">
            Cuatro etapas, sin sorpresas
          </h2>

          <ol data-revelar-hijos className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((paso) => (
              <li key={paso.numero} className="card p-6">
                <span className="text-3xl font-black text-brand-200">{paso.numero}</span>
                <h3 className="mt-3 text-lg">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Consulta interactiva: tipo de proyecto y etapa, directo a WhatsApp ── */}
      <section aria-labelledby="consulta-titulo" className="container-icgc pb-20 pt-12">
        <ConsultaProyecto whatsapp={settings.whatsapp} />
      </section>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}
