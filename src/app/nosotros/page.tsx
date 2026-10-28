import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { ContactForm } from '@/components/ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { getSettings, logoSrc } from '@/lib/api';
import { direccionDelSitio } from '@/lib/direccion';
import { inicialesDe } from '@/lib/format';
import { LEMA, MISION, QUIENES_SOMOS, VALORES, VISION } from '@/lib/institucional';
import { absoluteUrl, breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Nosotros: Instituto de Capacitación en Gestión Comunal',
    description:
      'Conoce al Instituto de Capacitación en Gestión Comunal: nuestra misión, nuestro enfoque ' +
      'de trabajo con comunidades campesinas y nativas, y el equipo que lo hace posible.',
    path: '/nosotros',
    settings,
  });
}

const HITOS = [
  {
    año: '2010',
    texto: 'Primeros talleres de capacitación a juntas directivas en la sierra central.',
  },
  {
    año: '2015',
    texto: 'Formalización del instituto y lanzamiento del primer diplomado.',
  },
  {
    año: '2019',
    texto: 'Expansión a comunidades nativas de la Amazonía peruana.',
  },
  { año: '2023', texto: 'Modalidad blended: alcance a 12 regiones del país.' },
] as const;

/** Línea de tiempo vertical: la usan la historia del instituto y la del líder. */
function LineaDeTiempo({ pasos }: { pasos: readonly { titulo: string; texto: string }[] }) {
  return (
    <ol className="mt-10 space-y-8 border-l-2 border-brand-200 pl-8">
      {pasos.map((paso) => (
        <li key={`${paso.titulo}-${paso.texto}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.3rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-500"
          />
          <h3 className="text-xl text-brand-600">{paso.titulo}</h3>
          <p className="mt-1.5 max-w-2xl leading-relaxed text-slate-600">{paso.texto}</p>
        </li>
      ))}
    </ol>
  );
}

export default async function NosotrosPage() {
  const settings = await getSettings();

  // La franja del líder sale de Ajustes del sitio en el gestor; sin nombre no se muestra
  const lider = settings.leaderName
    ? {
        nombre: settings.leaderName,
        cargo: settings.leaderRole,
        titulo: settings.leaderHeadline,
        bio: settings.leaderBio,
        foto: settings.leaderPhoto,
        fotoAlt: settings.leaderPhotoAlt ?? `Retrato de ${settings.leaderName}`,
        iniciales: inicialesDe(settings.leaderName),
        trayectoria: settings.leaderCareer.map((paso) => ({
          titulo: paso.period,
          texto: paso.text,
        })),
      }
    : null;

  const datosContacto = [
    {
      etiqueta: 'Correo',
      valor: settings.email,
      href: settings.email ? `mailto:${settings.email}` : null,
    },
    {
      etiqueta: 'Teléfono',
      valor: settings.phone,
      href: settings.phone ? `tel:${settings.phone.replace(/\s/g, '')}` : null,
    },
    {
      etiqueta: 'WhatsApp',
      valor: settings.whatsapp,
      href: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : null,
    },
    // La del gestor o, si está vacía, la dirección por defecto del instituto
    { etiqueta: 'Dirección', valor: `${direccionDelSitio(settings).texto}, Perú`, href: null },
  ].filter((d) => Boolean(d.valor));

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'Sobre el Instituto de Capacitación en Gestión Comunal',
            url: absoluteUrl('/nosotros'),
            inLanguage: 'es-PE',
            about: { '@id': `${settings.siteUrl}/#organization` },
          },
          // El formulario de contacto vive en esta página (antes era /contacto)
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contacto | ICGC',
            url: absoluteUrl('/nosotros#contacto'),
            inLanguage: 'es-PE',
            mainEntity: { '@id': `${settings.siteUrl}/#organization` },
          },
          // El líder como Person: refuerza la autoría y la experiencia (E-E-A-T)
          ...(lider
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: lider.nombre,
                  ...(lider.cargo ? { jobTitle: lider.cargo } : {}),
                  ...(lider.bio ? { description: lider.bio } : {}),
                  ...(lider.foto ? { image: lider.foto.url } : {}),
                  worksFor: { '@id': `${settings.siteUrl}/#organization` },
                  url: absoluteUrl('/nosotros#lider'),
                },
              ]
            : []),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Nosotros', path: '/nosotros' },
          ]),
        ]}
      />

      <section className="bg-brand-gradient">
        <div className="container-icgc grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="eyebrow text-brand-300">Sobre el instituto</p>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Fortalecemos la gestión comunal desde adentro
            </h1>
            <p className="mt-5 text-balance text-lg font-bold uppercase tracking-wide text-cyan-200">
              {LEMA.inicio} {LEMA.destacado} {LEMA.final}
            </p>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-brand-100">
              {QUIENES_SOMOS[0]}
            </p>
          </div>

          <div className="mx-auto w-56 lg:w-full lg:max-w-xs">
            <Image
              src={logoSrc(settings)}
              alt={settings.logoAlt}
              width={320}
              height={320}
              priority
              className="h-auto w-full drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="mision" className="container-icgc py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="mision" className="text-3xl">
              Nuestra misión
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">{MISION}</p>
          </div>
          <div>
            <h2 id="vision" className="text-3xl">
              Nuestra visión
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">{VISION}</p>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-brand-100 bg-brand-soft p-7 sm:p-9">
          <h2 id="equipo" className="text-2xl">
            Un equipo multidisciplinario
          </h2>
          <p className="mt-4 leading-relaxed text-slate-700">{QUIENES_SOMOS[1]}</p>
        </div>

        <ul data-revelar-hijos className="mt-16 grid gap-6 md:grid-cols-3">
          {VALORES.map((valor) => (
            <li key={valor.titulo} className="card p-7">
              <h3 className="text-lg">{valor.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{valor.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="historia" className="bg-brand-soft py-20">
        <div className="container-icgc">
          <h2 id="historia" className="text-3xl">
            Historia del instituto
          </h2>
          <LineaDeTiempo pasos={HITOS.map((h) => ({ titulo: h.año, texto: h.texto }))} />
        </div>
      </section>

      {/* ── Franja del líder: misma estética que la de "Sobre el instituto" ── */}
      {lider && (
        <section
          id="lider"
          aria-labelledby="lider-titulo"
          className="scroll-mt-20 bg-brand-gradient"
        >
          <div className="container-icgc grid items-center gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
            <div className="mx-auto w-56 lg:w-full lg:max-w-xs">
              {lider.foto ? (
                <Image
                  src={lider.foto.url}
                  alt={lider.fotoAlt}
                  width={lider.foto.width ?? 480}
                  height={lider.foto.height ?? 600}
                  sizes="(max-width: 1024px) 14rem, 20rem"
                  className="aspect-[4/5] h-auto w-full rounded-2xl object-cover shadow-2xl ring-4 ring-white/15"
                />
              ) : (
                // Sin foto cargada: iniciales en el mismo formato, para no romper la franja
                <div
                  aria-hidden="true"
                  className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-white/10 text-6xl font-black text-white/80 shadow-2xl ring-4 ring-white/15"
                >
                  {lider.iniciales}
                </div>
              )}
            </div>

            <div>
              <p className="eyebrow text-brand-300">Sobre el líder</p>
              <h2
                id="lider-titulo"
                className="mt-4 text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl"
              >
                {lider.titulo ?? lider.nombre}
              </h2>
              <p className="mt-5 text-lg font-semibold text-white">
                {lider.nombre}
                {lider.cargo && (
                  <span className="font-normal text-brand-200"> · {lider.cargo}</span>
                )}
              </p>
              {lider.bio && (
                <div className="mt-4 max-w-2xl space-y-4 text-pretty text-lg leading-relaxed text-brand-100">
                  {lider.bio.split(/\n{2,}/).map((parrafo) => (
                    <p key={parrafo}>{parrafo}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {lider && lider.trayectoria.length > 0 && (
        <section aria-labelledby="trayectoria" className="py-14">
          <div className="container-icgc">
            <h2 id="trayectoria" className="text-2xl">
              Trayectoria
            </h2>
            <ol data-revelar-hijos className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lider.trayectoria.map((paso, i) => (
                <li key={`${paso.titulo}-${i}`} className="card relative p-5 pl-6">
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-4 left-0 w-1 rounded-r bg-brand-500"
                  />
                  <h3 className="text-base text-brand-600">{paso.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{paso.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="border-t border-silver-200 bg-brand-soft">
        <div className="container-icgc py-16 text-center">
          <h2 className="text-balance text-3xl">¿Trabajamos juntos?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Si representas a una comunidad, municipalidad u organización, conversemos sobre un
            programa a medida.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#contacto" className="btn-primary">
              Escribir al instituto
            </Link>
            <Link href="/cursos" className="btn-secondary">
              Ver los cursos disponibles
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contacto: el formulario guarda los datos en la base de datos ── */}
      <section
        id="contacto"
        aria-labelledby="contacto-titulo"
        className="container-icgc grid scroll-mt-20 gap-14 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-20"
      >
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 id="contacto-titulo" className="mt-3 text-3xl">
            Déjanos tus datos
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Completa el formulario y el equipo del instituto se comunicará contigo para conversar
            sobre tu comunidad u organización.
          </p>
          <ContactForm />
        </div>

        <aside aria-labelledby="datos-contacto">
          <h3 id="datos-contacto" className="text-2xl">
            Datos de contacto
          </h3>

          {datosContacto.length > 0 && (
            <dl className="mt-6 space-y-4">
              {datosContacto.map((dato) => (
                <div key={dato.etiqueta} className="card p-5">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {dato.etiqueta}
                  </dt>
                  <dd className="mt-1.5 text-brand-800">
                    {dato.href ? (
                      <a
                        href={dato.href}
                        {...(dato.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="font-medium hover:text-brand-600"
                      >
                        {dato.valor}
                      </a>
                    ) : (
                      <span className="font-medium">{dato.valor}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 rounded-xl bg-brand-gradient p-6 text-brand-100">
            <h4 className="text-base text-white">Horario de atención</h4>
            <p className="mt-2 text-sm leading-relaxed">
              Lunes a viernes de 9:00 a 18:00 h · Sábados de 9:00 a 13:00 h
              <br />
              <span className="text-brand-200">Hora de Perú (GMT-5)</span>
            </p>
          </div>
        </aside>
      </section>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}
