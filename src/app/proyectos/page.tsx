import type { Metadata } from 'next';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { ConsultaProyecto } from '@/components/ConsultaProyecto';
import { JsonLd } from '@/components/JsonLd';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { ProjectsExplorer } from '@/components/ProjectsExplorer';
import { WhatsAppIcon } from '@/components/Icons';
import { getProjects, getSettings } from '@/lib/api';
import { nombreRegion } from '@/lib/presencia';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';
import { COMO_TRABAJAMOS } from '@/lib/servicios';
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

const PASOS = COMO_TRABAJAMOS;

export default async function ProyectosPage() {
  // Los proyectos se administran en el gestor
  const [settings, proyectos] = await Promise.all([getSettings(), getProjects()]);
  const urlAsesoria = whatsappUrl(settings, 'asesoria');

  return (
    <>
      <JsonLd
        data={[
          // Los proyectos, cada uno con su página
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
                ...(p.company ? { funder: { '@type': 'Organization', name: p.company } } : {}),
                url: absoluteUrl(`/proyectos/${p.slug}`),
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
              Proyectos que Acompañamos en el Perú
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
                    <ProjectFlipCard proyecto={proyecto} nivel="h2" alto="h-[27rem]" rectas mosaico />
                  ),
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
            Acompañamos tu Proyecto de Principio a Fin
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

      {/* ── Cómo trabajamos ── */}
      <section aria-labelledby="proceso" className="bg-brand-soft py-16 lg:py-20">
        <div className="container-icgc">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 id="proceso" className="mt-3 text-balance text-3xl sm:text-4xl">
            Cuatro Etapas, sin Sorpresas
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
      <section aria-labelledby="consulta-titulo">
        <ConsultaProyecto whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}
