import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from '@/components/Carousel';
import { CourseCard } from '@/components/CourseCard';
import { FondoLineas } from '@/components/FondoLineas';
import { HeroSlider } from '@/components/HeroSlider';
import { JsonLd } from '@/components/JsonLd';
import { SeccionClientes } from '@/components/SeccionClientes';
import { PeruMap } from '@/components/PeruMap';
import { PostCard } from '@/components/PostCard';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { FrasesRotativas } from '@/components/FrasesRotativas';
import { OrientadorSiguientePaso } from '@/components/OrientadorSiguientePaso';
import { Reveal } from '@/components/Reveal';
import { StatsCounter } from '@/components/StatsCounter';
import { textoCompleto, Typewriter } from '@/components/Typewriter';
import { BookIcon, HandshakeIcon } from '@/components/Icons';
import { ServicioCard } from '@/components/ServicioCard';
import { inicialesDe } from '@/lib/format';
import { getCourses, getPosts, getProjects, getSettings, logoSrc } from '@/lib/api';
import { presenciaPorRegion, resumenPresencia } from '@/lib/presencia';
import { EN_UNA_FRASE, LEMA } from '@/lib/institucional';
import { absoluteUrl, buildMetadata, truncate } from '@/lib/seo';
import { SERVICIOS } from '@/lib/servicios';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

// ISR: el HTML se regenera cada 10 minutos. Google recibe una página estática
// (LCP bajísimo) y el contenido sigue fresco cuando se publica un artículo.
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Asesoría y capacitación para proyectos comunales | ICGC',
    description:
      'Consultoría en gestión comunal, licitaciones y ejecución de proyectos de infraestructura, ' +
      'y cursos para comunidades y organizaciones del Perú.',
    path: '/',
    settings,
  });
}

/**
 * Fotos del hero: paisajes y comunidades campesinas del Perú (Wikimedia Commons,
 * licencias CC BY / CC BY-SA, créditos en public/hero/CREDITOS.md).
 * El alt describe la escena real, no repite palabras clave.
 */
const HERO_SLIDES = [
  {
    src: '/hero/linderaje-comunidad-campesina-yanacona.webp',
    alt: 'Comuneros de la comunidad campesina Yanacona recorriendo sus tierras durante el linderaje, con banderas y los Andes al fondo',
    credito: 'AleliPao, CC BY-SA 4.0, Wikimedia Commons',
  },
  {
    src: '/hero/comunidad-campesina-santa-cruz-de-cumi.webp',
    alt: 'Capilla de la comunidad campesina Santa Cruz de Cumi entre cerros del altiplano peruano',
    credito: 'O. R. Tarco Palomino, CC BY 4.0, Wikimedia Commons',
  },
  {
    src: '/hero/paisaje-andino-laguna-quellacocha.webp',
    alt: 'Paisaje andino con la laguna glaciar Quellacocha rodeada de montañas',
    credito: 'Nina Reicer, CC BY-SA 4.0, Wikimedia Commons',
  },
] as const;

/** El h1 del hero, en tramos: el segundo va resaltado con degradado. */
const TITULO_HERO = [
  { texto: 'Asesoría y capacitación para la ' },
  {
    texto: 'ejecución de proyectos comunales',
    className: 'bg-gradient-to-r from-brand-300 to-white bg-clip-text text-transparent',
  },
] as const;

/** Frases que siguen al lema en el subtítulo del hero: más cercanas, invitan a escribir. */
const FRASES_CERCANAS = [
  'Te acompañamos y guiamos en cada paso, desde la idea hasta la obra terminada.',
  '¿Tienes un proyecto para tu comunidad? Conversemos y lo hacemos realidad juntos.',
  'Capacitamos a tu equipo para que gestione con autonomía y sin trabas.',
] as const;

export default async function HomePage() {
  // Todo sale del gestor (vía API) y se resuelve en paralelo en el servidor
  const [settings, destacadosRes, cursos, todosLosProyectos] = await Promise.all([
    getSettings(),
    // Solo las marcadas como destacadas en el gestor, máximo 5 en el carrusel
    getPosts({ featured: true, pageSize: 5 }),
    getCourses(),
    getProjects(),
  ]);

  const destacados = destacadosRes.items.slice(0, 5);

  // Resumen del líder para su tarjeta (los datos completos están en /nosotros)
  const lider = settings.leaderName
    ? {
        nombre: settings.leaderName,
        cargo: settings.leaderRole,
        foto: settings.leaderPhoto,
        fotoAlt: settings.leaderPhotoAlt ?? `Retrato de ${settings.leaderName}`,
        resumen: settings.leaderBio ? truncate(settings.leaderBio.split(/\n{2,}/)[0]!, 170) : null,
        iniciales: inicialesDe(settings.leaderName),
      }
    : null;
  // El carrusel del inicio muestra hasta 8 (4 a la vista en escritorio)
  // 6 en el inicio (mosaico de 3 × 2); el resto, en /proyectos
  const proyectos = todosLosProyectos.slice(0, 6);

  // Una sola fuente para el hero y el mapa: los proyectos publicados
  const totales = resumenPresencia(todosLosProyectos);
  const presencia = presenciaPorRegion(todosLosProyectos);

  // Los dos botones del hero van al mismo WhatsApp pero con mensajes distintos,
  // así sabemos por qué llegó cada consulta.
  const urlAsesoria = whatsappUrl(settings, 'asesoria');

  // Los años salen de los ajustes del gestor; proyectos y regiones se cuentan
  // de los proyectos publicados, así coinciden con el mapa "Nuestra huella"
  const cifras = [
    // "+10 años": más de diez años de experiencia
    { valor: settings.yearsExperience, etiqueta: 'años de experiencia', prefijo: '+' },
    { valor: totales.proyectos, etiqueta: 'proyectos asesorados' },
    {
      valor: totales.regiones,
      etiqueta: totales.regiones === 1 ? 'región atendida' : 'regiones atendidas',
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Publicaciones destacadas del ICGC',
            itemListElement: destacados.map((post, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(`/blog/${post.slug}`),
              name: post.title,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Proyectos acompañados por el ICGC',
            itemListElement: proyectos.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(`/proyectos#${p.slug}`),
              name: p.title,
            })),
          },
        ]}
      />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative isolate overflow-hidden bg-brand-950">
        {/* Solo fotos: el logo se presenta en "Quiénes somos" */}
        <HeroSlider slides={HERO_SLIDES} />

        {/* Velo neutro solo detrás del texto (izquierda): la foto conserva sus
            colores y el título se sigue leyendo sobre cualquier imagen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 via-45% to-transparent"
        />

        {/* Padding superior corto: el título tiene que entrar casi pegado al menú */}
        <div className="container-icgc relative z-10 flex min-h-[34rem] items-center pb-28 pt-10 lg:min-h-[38rem] lg:pb-32 lg:pt-14">
          <div className="max-w-3xl animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-100 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
              Consultoría y capacitación
            </p>

            {/* El único h1 de la página. Se escribe solo al cargar, pero el texto
                completo ya está en el HTML (y en el aria-label para lectores de pantalla). */}
            <h1
              aria-label={textoCompleto(TITULO_HERO)}
              className="text-balance text-[2.1rem] font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]"
            >
              <Typewriter segmentos={TITULO_HERO} />
            </h1>

            {/* Se escribe a la par del título y luego va cambiando de frase */}
            <FrasesRotativas
              frases={[settings.tagline, ...FRASES_CERCANAS]}
              // Arranca junto con el título (mismo retraso inicial que Typewriter)
              inicioMs={300}
              className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-brand-100 sm:text-lg"
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cursos" className="btn-light">
                <BookIcon size={18} />
                Ver cursos
              </Link>
              <Link href={urlAsesoria} {...propsEnlace(urlAsesoria)} className="btn-whatsapp">
                <HandshakeIcon size={18} />
                Quiero asesoría
              </Link>
            </div>

            <StatsCounter stats={cifras} />
          </div>
        </div>

        {/* Fundido al azul marino: el hero se une con "Quiénes somos" sin corte */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-brand-950/70 to-brand-950"
        />
      </section>

      {/* ──────────────────── Quiénes somos ──────────────────── */}
      {/* Presentación grande y con poco texto: el lema en tipografía enorme y
          el logo en el centro de unas órbitas. Fondo en degradado azul marino a
          turquesa con figuras de línea; arranca en el azul en que termina el
          hero, sin corte. */}
      <section
        aria-labelledby="quienes-titulo"
        className="relative isolate overflow-hidden pb-20 pt-10 text-white lg:pb-28 lg:pt-14"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#06162b_0%,#0b2545_50%,#0e7490_100%)]"
        />
        <FondoLineas className="-z-10 opacity-60" />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-cyan-400/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-amber-300/15 blur-3xl"
        />
        {/* Arranca en el mismo azul marino en que termina el hero */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand-950 via-brand-950/70 to-transparent"
        />

        <div className="container-icgc">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* ── Título grande, descripción corta y el lema debajo ── */}
            <Reveal desde="izquierda">
              <p className="eyebrow !text-cyan-300">Quiénes somos</p>
              <h2
                id="quienes-titulo"
                className="mt-5 text-balance text-[2.3rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4rem]"
              >
                Un instituto al servicio de las{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                  comunidades
                </span>
              </h2>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/80">
                Asesoría, consultoría y capacitación para comunidades campesinas, empresas
                comunales, organizaciones y empresas, con especial atención a la construcción y la
                minería.
              </p>
              <div
                aria-hidden="true"
                className="mt-7 h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-300 to-amber-200"
              />
              {/* El lema oficial del instituto */}
              <p className="mt-6 max-w-xl text-balance text-base font-extrabold uppercase leading-snug tracking-wide text-cyan-200 sm:text-lg">
                “{LEMA.inicio} {LEMA.destacado} {LEMA.final}”
              </p>
              <Link href="/nosotros" className="btn-light mt-8 font-bold">
                Conoce al ICGC
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Reveal>

            {/* ── El logo, en el centro de unas órbitas que giran despacio ── */}
            <Reveal desde="derecha" className="mx-auto w-full max-w-[30rem]">
              <div className="relative aspect-square">
                <div
                  aria-hidden="true"
                  className="absolute inset-[12%] rounded-full bg-cyan-300/30 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-white/15"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-[7%] animate-[spin_60s_linear_infinite] rounded-full border-2 border-dashed border-cyan-200/35 motion-reduce:animate-none"
                />
                {/* Dos lunas: una turquesa y otra dorada, en sentidos opuestos */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-[spin_18s_linear_infinite] motion-reduce:animate-none"
                >
                  <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_4px_rgba(103,232,249,0.7)]" />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-[7%] animate-[spin_26s_linear_infinite] [animation-direction:reverse] motion-reduce:animate-none"
                >
                  <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_16px_4px_rgba(252,211,77,0.65)]" />
                </div>
                <div className="absolute inset-[14%] flex items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur-sm">
                  <Image
                    src={logoSrc(settings)}
                    alt={settings.logoAlt}
                    width={320}
                    height={320}
                    sizes="(max-width: 640px) 60vw, 280px"
                    className="h-[90%] w-[90%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Misión, visión y equipo: una frase cada uno ── */}
          <ul
            data-revelar-hijos
            className="mt-16 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-3 lg:mt-20"
          >
            {EN_UNA_FRASE.map((idea) => (
              <li key={idea.titulo}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  {idea.titulo}
                </p>
                <p className="mt-2 text-pretty text-lg font-semibold leading-snug text-white">
                  {idea.texto}
                </p>
              </li>
            ))}
          </ul>

          {/* ── El gerente, como respaldo ── */}
          {lider && (
            <Reveal className="mt-14">
              <div className="flex flex-col gap-6 rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-md sm:flex-row sm:items-center sm:p-8">
                {lider.foto ? (
                  <Image
                    src={lider.foto.url}
                    alt={lider.fotoAlt}
                    width={112}
                    height={112}
                    sizes="112px"
                    className="h-24 w-24 shrink-0 rounded-full object-cover object-top ring-4 ring-amber-200/60"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 text-3xl font-black text-white ring-4 ring-amber-200/60"
                  >
                    {lider.iniciales}
                  </span>
                )}
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                    Respaldados por
                  </p>
                  <h3 className="mt-1 text-2xl text-white">{lider.nombre}</h3>
                  {lider.cargo && (
                    <p className="text-sm font-semibold text-white/70">{lider.cargo}</p>
                  )}
                  <p className="mt-3 text-pretty text-lg italic leading-snug text-white/90">
                    “Experiencia probada en campo: de la asamblea comunal a la mesa de negociación.”
                  </p>
                </div>
                <Link href="/nosotros#lider" className="btn-light shrink-0 font-bold">
                  Conócelo
                  <span className="sr-only"> ({lider.nombre})</span>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ──────────────────── Servicios (grilla 3 × 3) ──────────────────── */}
      <section aria-labelledby="servicios-titulo" className="bg-brand-soft py-16 lg:py-20">
        {/* Más angosta que el resto: tarjetas más chicas, igual de 3 en 3 */}
        <div className="container-icgc max-w-6xl">
          <Reveal desde="izquierda" className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="eyebrow">Servicios</p>
              <h2 id="servicios-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
                Todo lo que tu comunidad necesita, en un solo lugar
              </h2>
            </div>
            <Link
              href="/servicios"
              className="btn border-2 border-brand-600 bg-white font-extrabold text-brand-700 hover:bg-brand-600 hover:text-white"
            >
              Ver todos los servicios
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
          <ul data-revelar-hijos className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICIOS.map((servicio) => (
              <li key={servicio.slug}>
                <ServicioCard servicio={servicio} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ──────────────────── Cursos (carrusel) ──────────────────── */}
      <section
        aria-labelledby="cursos-titulo"
        className="container-icgc max-w-6xl overflow-x-clip pb-16 lg:pb-20"
      >
        <Reveal desde="izquierda" className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="eyebrow">Capacitación</p>
            <h2 id="cursos-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Nuestros cursos
            </h2>
          </div>
          <Link
            href="/cursos"
            className="btn border-2 border-brand-600 bg-white font-extrabold text-brand-700 hover:bg-brand-600 hover:text-white"
          >
            Ver el detalle de los cursos
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>

        <Reveal retrasoMs={150}>
          <Carousel
            label="Cursos de capacitación"
            autoplayMs={4000}
            flechasLaterales
            // 3 tarjetas a la vista en escritorio; el bucle gira sin fin hacia ambos lados
            itemClassName="w-[70%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            {cursos.map((curso) => (
              <CourseCard
                key={curso.slug}
                compacta
                curso={curso}
                masInfoUrl={whatsappUrl(
                  settings,
                  `Hola, vengo de la página web. Quiero más información sobre el curso "${curso.name}".`,
                )}
              />
            ))}
          </Carousel>
        </Reveal>
      </section>

      {/* ──────────────────── Proyectos ──────────────────── */}
      {/* Fondo en un celeste suave de la marca, con líneas finas en SVG */}
      <section
        aria-labelledby="proyectos-titulo"
        className="relative isolate overflow-hidden bg-gradient-to-br from-brand-300/70 via-brand-100 to-sky-200 py-16 lg:py-20"
      >
        <FondoLineas className="-z-10" />
        <div className="container-icgc">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Proyectos</p>
            <h2 id="proyectos-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Proyectos que acompañamos
            </h2>
            <p className="mt-4 text-pretty text-lg font-semibold text-slate-600">
              Hacemos realidad el proyecto de tu comunidad: de la idea a la obra terminada.
            </p>
          </Reveal>

          {/* Mosaico 3 × 2: las tarjetas van pegadas y forman un solo rectángulo */}
          <Reveal retrasoMs={120} className="mx-auto mt-12 max-w-5xl">
            <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {proyectos.map((proyecto) => (
                <li key={proyecto.slug}>
                  <ProjectFlipCard proyecto={proyecto} alto="h-[27rem]" rectas mosaico />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-10 text-center">
            <Link href="/proyectos" className="btn-primary font-bold">
              Ver todos los proyectos
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────── Mapa de presencia ──────────────────── */}
      <section aria-labelledby="huella-titulo" className="py-16 lg:py-20">
        <div className="container-icgc">
          <Reveal retrasoMs={150}>
            <PeruMap
              presencia={presencia}
              resumen={
                <>
                  {/* Título a la derecha del mapa, arriba de las cifras */}
                  <div className="mb-7">
                    <p className="eyebrow">Dónde trabajamos</p>
                    <h2 id="huella-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
                      Nuestra huella en el Perú
                    </h2>
                    <p className="mt-4 text-pretty text-slate-600">
                      Trabajamos de la mano con las comunidades en distintas regiones del país,
                      llevando asesoría técnica y capacitación hasta donde se ejecutan los
                      proyectos.
                    </p>
                  </div>
                  <dl className="grid grid-cols-3 gap-4 text-center">
                    {[
                      {
                        valor: totales.regiones,
                        etiqueta: totales.regiones === 1 ? 'región' : 'regiones',
                      },
                      { valor: totales.proyectos, etiqueta: 'proyectos' },
                      {
                        valor: totales.comunidades,
                        etiqueta: 'comunidades beneficiadas',
                      },
                    ].map((t) => (
                      <div key={t.etiqueta} className="flex flex-col rounded-xl bg-brand-soft p-4">
                        <dt className="text-xs text-slate-500 sm:text-sm">{t.etiqueta}</dt>
                        <dd className="order-first text-3xl font-black text-brand-700 sm:text-4xl">
                          {t.valor}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              }
            />
          </Reveal>
        </div>
      </section>

      {/* ──────────────── Empresas y comunidades ──────────────── */}
      <SeccionClientes />

      {/* ──────────────────── Blog: destacadas ──────────────────── */}
      <section
        aria-labelledby="blog-titulo"
        className="bg-brand-soft pb-12 pt-16 lg:pb-14 lg:pt-20"
      >
        <div className="container-icgc max-w-6xl">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow">Blog</p>
            <h2 id="blog-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Publicaciones destacadas
            </h2>
          </Reveal>

          <Reveal retrasoMs={150}>
            {destacados.length > 0 ? (
              <Carousel
                label="Publicaciones destacadas del blog"
                autoplayMs={5000}
                flechasLaterales
              >
                {destacados.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Carousel>
            ) : (
              <p className="rounded-xl border border-dashed border-silver-300 p-12 text-center text-slate-500">
                Aún no hay publicaciones destacadas. Las que se marquen como destacadas en el gestor
                aparecerán aquí automáticamente.
              </p>
            )}
          </Reveal>

          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="btn border-2 border-brand-600 bg-white font-extrabold text-brand-700 hover:bg-brand-600 hover:text-white"
            >
              Ver todas las publicaciones
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── Cierre: orientador "Encuentra tu siguiente paso" ─────────── */}
      {/* Franja de borde a borde que llega hasta el pie (el -mb compensa su margen) */}
      <section aria-labelledby="cta-titulo" className="-mb-12">
        <OrientadorSiguientePaso whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
    </>
  );
}
