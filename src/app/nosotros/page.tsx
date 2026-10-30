import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { ContactForm } from '@/components/ContactForm';
import { AwardIcon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { getSettings, logoSrc } from '@/lib/api';
import { direccionDelSitio } from '@/lib/direccion';
import { enTitulo, inicialesDe } from '@/lib/format';
import {
  AREAS_EQUIPO,
  EQUIPO_INTRO,
  LEMA,
  MISION,
  QUIENES_SOMOS,
  RECONOCIMIENTOS,
  RECONOCIMIENTOS_INTRO,
  VISION,
} from '@/lib/institucional';
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

/**
 * Tarjeta que sobresale al pasar el mouse (o al enfocarla con el teclado):
 * sube, se agranda la sombra y aparece la raya dorada de arriba.
 * La usan misión, visión, las áreas del equipo, la trayectoria y los reconocimientos.
 */
const TARJETA_RESALTA =
  'group relative overflow-hidden rounded-2xl border border-brand-100 bg-white p-8 shadow-card transition duration-300 hover:-translate-y-2 hover:border-dorado/50 hover:shadow-card-hover focus-within:-translate-y-2 motion-reduce:transform-none';
const RAYA_RESALTA =
  'mb-4 block h-1 w-10 rounded-full bg-dorado transition-all duration-300 group-hover:w-20';

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
        // "Curso — Institución": se muestran por separado
        formacion: settings.leaderEducation.map((linea) => {
          const [curso, ...resto] = linea.split(/\s+[—–-]\s+/);
          return { curso: curso!.trim(), institucion: resto.join(' — ').trim() };
        }),
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

      {/* ── Hero: el título y el logo entran con animación (CSS, sin JS) ── */}
      <section className="relative isolate overflow-hidden bg-brand-gradient">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-dorado/20 blur-3xl"
        />
        <div className="container-icgc grid items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <div>
            <p className="eyebrow animate-fade-up-lento text-dorado-claro motion-reduce:animate-none">
              Sobre el instituto
            </p>
            <h1 className="mt-4 animate-fade-up-lento text-balance text-4xl font-extrabold leading-tight text-white [animation-delay:120ms] motion-reduce:animate-none sm:text-5xl">
              Fortalecemos la Gestión Comunal Desde Adentro
            </h1>
            <p className="mt-5 animate-fade-up-lento text-balance text-lg font-bold uppercase tracking-wide text-dorado-claro [animation-delay:260ms] motion-reduce:animate-none">
              {LEMA.inicio} {LEMA.destacado} {LEMA.final}
            </p>
            <p className="mt-6 max-w-2xl animate-fade-up-lento text-pretty text-lg leading-relaxed text-brand-100 [animation-delay:400ms] motion-reduce:animate-none">
              {QUIENES_SOMOS[0]}
            </p>
          </div>

          <div className="mx-auto w-56 animate-logo-entra motion-reduce:animate-none lg:w-full lg:max-w-xs">
            <div className="animate-flotar motion-reduce:animate-none">
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
        </div>
      </section>

      {/* ── Misión y visión: al pasar el mouse, la tarjeta sube y se marca en dorado ── */}
      <section aria-labelledby="mision" className="container-icgc py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            { id: 'mision', titulo: 'Nuestra Misión', texto: MISION },
            { id: 'vision', titulo: 'Nuestra Visión', texto: VISION },
          ].map((bloque) => (
            <article key={bloque.id} className={TARJETA_RESALTA}>
              <span aria-hidden="true" className={RAYA_RESALTA} />
              <h2 id={bloque.id} className="text-3xl font-extrabold text-brand-900">
                {bloque.titulo}
              </h2>
              <p className="mt-5 leading-relaxed text-texto">{bloque.texto}</p>
            </article>
          ))}
        </div>

        {/* ── Un equipo multidisciplinario y sus cuatro áreas ── */}
        <div className="mt-14 rounded-2xl border border-brand-100 bg-brand-50 p-7 sm:p-9">
          <h2 id="equipo" className="text-2xl font-extrabold text-brand-900">
            Un Equipo Multidisciplinario
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-texto">{EQUIPO_INTRO}</p>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS_EQUIPO.map((area) => (
            <li key={area.titulo} className={`${TARJETA_RESALTA} !p-0`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={area.imagen}
                  alt={area.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
              </div>
              <div className="p-6">
                <span aria-hidden="true" className={RAYA_RESALTA} />
                <h3 className="text-xl font-bold text-brand-900">{area.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-texto">{area.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Sobre el líder: resumen corto + logros por trayectoria + formación numerada ── */}
      {lider && (
        <section id="lider" aria-labelledby="lider-titulo" className="scroll-mt-20 bg-brand-50 py-16 lg:py-20">
          <div className="container-icgc">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className="mx-auto w-60 lg:w-full lg:max-w-xs">
                {lider.foto ? (
                  <Image
                    src={lider.foto.url}
                    alt={lider.fotoAlt}
                    width={lider.foto.width ?? 480}
                    height={lider.foto.height ?? 600}
                    sizes="(max-width: 1024px) 15rem, 20rem"
                    className="aspect-[4/5] h-auto w-full rounded-2xl object-cover object-top shadow-card-hover ring-4 ring-dorado/40"
                  />
                ) : (
                  // Sin foto cargada: iniciales en el mismo formato, para no romper la franja
                  <div
                    aria-hidden="true"
                    className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-brand-gradient text-6xl font-black text-white shadow-card-hover ring-4 ring-dorado/40"
                  >
                    {lider.iniciales}
                  </div>
                )}
              </div>

              <div>
                <p className="eyebrow">Sobre el líder</p>
                <h2
                  id="lider-titulo"
                  className="mt-3 text-balance text-3xl font-extrabold leading-tight text-brand-900 sm:text-4xl"
                >
                  {enTitulo(lider.titulo ?? lider.nombre)}
                </h2>
                <p className="mt-4 text-lg font-bold text-brand-700">
                  {lider.nombre}
                  {lider.cargo && (
                    <span className="font-semibold text-dorado-oscuro"> · {lider.cargo}</span>
                  )}
                </p>
                {lider.bio && (
                  <div className="mt-4 max-w-2xl space-y-3 text-pretty leading-relaxed text-texto">
                    {lider.bio.split(/\n{2,}/).map((parrafo) => (
                      <p key={parrafo}>{parrafo}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(lider.trayectoria.length > 0 || lider.formacion.length > 0) && (
              <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {lider.trayectoria.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-extrabold text-brand-900">Logros por Trayectoria</h3>
                    <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                      {lider.trayectoria.map((paso, i) => (
                        <li key={`${paso.titulo}-${i}`} className={`${TARJETA_RESALTA} !p-5`}>
                          <span className="text-3xl font-black text-dorado">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h4 className="mt-2 font-bold leading-snug text-brand-900">
                            {enTitulo(paso.titulo)}
                          </h4>
                          <p className="mt-1.5 text-sm leading-relaxed text-texto">{paso.texto}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {lider.formacion.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-extrabold text-brand-900">Formación Especializada</h3>
                    <ol className="mt-6 divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white p-2 shadow-card">
                      {lider.formacion.map((estudio, i) => (
                        <li key={estudio.curso} className="flex gap-4 p-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-bold leading-snug text-brand-900">{estudio.curso}</p>
                            {estudio.institucion && (
                              <p className="mt-0.5 text-sm font-semibold text-dorado-oscuro">
                                {estudio.institucion}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Reconocimientos: el botón "Ver reconocimientos" del inicio llega aquí ── */}
      <section
        id="reconocimientos"
        aria-labelledby="reconocimientos-titulo"
        className="scroll-mt-20 bg-arena py-16 lg:py-20"
      >
        <div className="container-icgc">
          <p className="eyebrow">Trayectoria del gerente general</p>
          <h2 id="reconocimientos-titulo" className="mt-3 text-3xl font-extrabold text-brand-900 sm:text-4xl">
            Reconocimientos
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-texto">
            {RECONOCIMIENTOS_INTRO}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {RECONOCIMIENTOS.map((r) => (
              <li key={r.imagen ?? `${r.titulo}-${r.año}-${r.empresa ?? ''}`} className={`${TARJETA_RESALTA} !p-0`}>
                <div className="relative aspect-[3/2] overflow-hidden bg-brand-50">
                  {r.imagen ? (
                    <Image
                      src={r.imagen}
                      alt={r.alt ?? r.titulo}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 31vw, 290px"
                      // Los trofeos (fotos verticales) se ven enteros sobre gris azulado
                      className={`transition-transform duration-500 group-hover:scale-105 ${r.trofeo ? 'bg-brand-50 object-contain p-2' : 'object-cover'}`}
                    />
                  ) : (
                    // Ilustración genérica mientras llega la foto del reconocimiento
                    <div
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center bg-brand-gradient transition-transform duration-500 group-hover:scale-105"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dorado-claro/60 text-dorado-claro">
                        <AwardIcon size={28} />
                      </span>
                      <span className="absolute bottom-3 right-4 text-2xl font-black text-white/15">{r.año}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {r.empresa && (
                      <span className="rounded-full bg-brand-900 px-2.5 py-0.5 text-xs font-bold text-white">
                        {r.empresa}
                      </span>
                    )}
                    <span className="rounded-full bg-arena px-2.5 py-0.5 text-xs font-bold text-dorado-oscuro ring-1 ring-dorado/30">
                      {r.año}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold leading-snug text-brand-900">“{r.titulo}”</h3>
                  <p className="mt-1 text-xs font-semibold text-texto">{r.otorga}</p>
                </div>
              </li>
            ))}
          </ul>
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
            Déjanos tus Datos
          </h2>
          <p className="mt-3 max-w-xl text-slate-600">
            Completa el formulario y el equipo del instituto se comunicará contigo para conversar
            sobre tu comunidad u organización.
          </p>
          <ContactForm />
        </div>

        <aside aria-labelledby="datos-contacto">
          <h3 id="datos-contacto" className="text-2xl">
            Datos de Contacto
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
