import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from '@/components/Carousel';
import { CourseCard } from '@/components/CourseCard';
import { HeroSlider } from '@/components/HeroSlider';
import { JsonLd } from '@/components/JsonLd';
import { type Cliente, LogoMarquee } from '@/components/LogoMarquee';
import { PeruMap } from '@/components/PeruMap';
import { PostCard } from '@/components/PostCard';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { FrasesRotativas } from '@/components/FrasesRotativas';
import { OrientadorSiguientePaso } from '@/components/OrientadorSiguientePaso';
import { Reveal } from '@/components/Reveal';
import { StatsCounter } from '@/components/StatsCounter';
import { textoCompleto, Typewriter } from '@/components/Typewriter';
import { BookIcon, HandshakeIcon } from '@/components/Icons';
import { ServiciosCarrusel } from '@/components/ServiciosCarrusel';
import { getCourses, getPosts, getProjects, getSettings, logoSrc } from '@/lib/api';
import { presenciaPorRegion, resumenPresencia } from '@/lib/presencia';
import { MISION, RESUMEN_INSTITUTO, VALORES } from '@/lib/institucional';
import { absoluteUrl, buildMetadata, truncate } from '@/lib/seo';
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

/** Empresas y comunidades que trabajan con el instituto (logos en public/clientes). */
const CLIENTES: readonly Cliente[] = [
  {
    nombre: 'Comunidad Campesina Santa Rosa de Colquijirca',
    logo: '/clientes/comunidad-santa-rosa-colquijirca.webp',
    width: 323,
    height: 320,
  },
  {
    nombre: 'ECOSARC Colquijirca',
    logo: '/clientes/ecosarc-colquijirca.webp',
    width: 540,
    height: 320,
  },
  {
    nombre: 'Comunidad Campesina de Quichas',
    logo: '/clientes/comunidad-campesina-quichas.webp',
    width: 327,
    height: 320,
  },
  {
    nombre: 'ECOSERMUQ, Empresa Comunal de Servicios Múltiples Quichas',
    logo: '/clientes/ecosermuq-quichas.webp',
    width: 371,
    height: 320,
  },
  {
    nombre: 'ECOSERM VIP',
    logo: '/clientes/ecoserm-vip.webp',
    width: 365,
    height: 320,
  },
  {
    nombre: 'Paltarumi',
    logo: '/clientes/paltarumi.webp',
    width: 761,
    height: 320,
  },
];

/** Tarjeta de "Quiénes somos": se eleva y una línea azul recorre su borde al pasar el mouse. */
function TarjetaQuienes({ children }: { children: React.ReactNode }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-silver-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-brand-200 hover:shadow-[0_32px_60px_-18px_rgba(28,109,208,0.55)] focus-within:-translate-y-2 focus-within:border-brand-200 focus-within:shadow-[0_32px_60px_-18px_rgba(28,109,208,0.55)] motion-reduce:transform-none">
      {/* Borde que se dibuja: arranca en la esquina superior izquierda,
          da la vuelta a la tarjeta y cierra en la misma esquina */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      >
        <rect
          x="1.5"
          y="1.5"
          rx="15"
          pathLength={100}
          className="fill-none stroke-brand-600 [height:calc(100%-3px)] [stroke-dasharray:100] [stroke-dashoffset:100] [stroke-width:3] [width:calc(100%-3px)] transition-[stroke-dashoffset] duration-[1100ms] ease-in-out group-focus-within:[stroke-dashoffset:0] group-hover:[stroke-dashoffset:0] motion-reduce:transition-none"
        />
      </svg>
      {children}
    </article>
  );
}

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
        iniciales: settings.leaderName
          .replace(/\(.*?\)/g, '')
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]!.toUpperCase())
          .join(''),
      }
    : null;
  // El carrusel del inicio muestra hasta 8 (4 a la vista en escritorio)
  const proyectos = todosLosProyectos.slice(0, 8);

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
        {/* El logo entra como una diapositiva más, después de las fotos (la
            primera foto sigue siendo la imagen principal para el LCP) */}
        <HeroSlider
          slides={[
            ...HERO_SLIDES,
            { src: logoSrc(settings), alt: settings.logoAlt, tipo: 'logo' as const },
          ]}
        />

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
      {/* Fondo en degradado de azul marino a turquesa (el mismo de "Programa a
          medida"); arranca en el azul en que termina el hero, sin corte. */}
      <section
        aria-labelledby="quienes-titulo"
        className="relative isolate overflow-x-clip pb-16 pt-8 text-white lg:pb-24 lg:pt-10"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#06162b_0%,#0b2545_50%,#0e7490_100%)]"
        />
        {/* Destellos de color */}
        <div
          aria-hidden="true"
          className="absolute -right-24 top-40 -z-10 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/2 -z-10 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"
        />
        {/* Arranca en el mismo azul marino en que termina el hero */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-brand-950 via-brand-950/70 to-transparent"
        />
        {/* Trama de puntos, como textura */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_25%,transparent_70%)]"
        />

        <div className="container-icgc">
          <Reveal desde="izquierda" className="max-w-2xl">
            <p className="eyebrow !text-cyan-300">Quiénes somos</p>
            <h2
              id="quienes-titulo"
              className="mt-4 text-balance text-2xl leading-tight text-white sm:text-3xl lg:text-4xl"
            >
              Un instituto al servicio de las{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                comunidades
              </span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-white/80">
              Asesoramos y capacitamos a comunidades campesinas, nativas y organizaciones del Perú
              para que sus proyectos se formulen, se financien y se ejecuten bien.
            </p>
          </Reveal>

          {/* Misión a la izquierda y valores a la derecha, a la misma altura */}
          <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Reveal desde="izquierda">
                <figure className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
                  <Image
                    src="/inicio/asamblea-comunal-tiquihua.webp"
                    alt="Comuneros reunidos en asamblea comunal frente al local de la comunidad de Tiquihua, en los Andes"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="zoom-al-scroll object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent"
                  />
                </figure>
              </Reveal>
              {/* El recuadro sube y se monta sobre la foto */}
              <Reveal
                retrasoMs={200}
                className="relative z-10 -mt-14 ml-4 mr-4 sm:-mt-20 sm:ml-8 sm:mr-12"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-cyan-600 p-6 shadow-[0_24px_48px_-16px_rgba(6,22,43,0.85)] sm:p-7">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(135deg,black,transparent_60%)]"
                  />
                  <div className="relative">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-cyan-100">
                      Lo que nos mueve
                    </p>
                    <h3 className="mt-2 text-xl text-white sm:text-2xl">Nuestra misión</h3>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
                      {MISION}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              {/* Panel de vidrio esmerilado sobre el paisaje */}
              <Reveal
                desde="derecha"
                className="rounded-3xl bg-white/10 p-6 shadow-2xl ring-1 ring-white/20 backdrop-blur-md sm:p-8"
              >
                <h3 className="text-xl text-white sm:text-2xl">Nuestros valores</h3>
                <div
                  aria-hidden="true"
                  className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-300 to-amber-200"
                />
                <ol className="mt-6 space-y-6">
                  {VALORES.map((v, i) => (
                    <li key={v.titulo} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="bg-gradient-to-b from-cyan-200 to-cyan-500 bg-clip-text font-display text-3xl font-black leading-none text-transparent"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-bold text-white">{v.titulo}</p>
                        <p className="mt-1 text-pretty text-sm leading-relaxed text-white/75">
                          {v.texto}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>

          {/* El instituto y su líder, en horizontal */}
          <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-2">
            <Reveal desde="izquierda" className="h-full">
              <TarjetaQuienes>
                <div className="flex h-full flex-col gap-6 p-7 sm:flex-row sm:items-center">
                  <Image
                    src={logoSrc(settings)}
                    alt={settings.logoAlt}
                    width={112}
                    height={112}
                    sizes="112px"
                    className="h-28 w-28 shrink-0 object-contain"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                      El instituto
                    </p>
                    <h3 className="mt-1 text-xl transition-colors group-hover:text-brand-700">
                      Sobre el ICGC
                    </h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600">
                      {RESUMEN_INSTITUTO}
                    </p>
                    <Link href="/nosotros" className="btn-primary mt-5 w-fit py-2.5">
                      Más información
                      <span className="sr-only"> sobre el instituto</span>
                    </Link>
                  </div>
                </div>
              </TarjetaQuienes>
            </Reveal>

            {lider && (
              <Reveal desde="derecha" retrasoMs={150} className="h-full">
                <TarjetaQuienes>
                  <div className="flex h-full flex-col gap-6 p-7 sm:flex-row sm:items-center">
                    {/* La foto real se carga en el gestor; mientras tanto, iniciales */}
                    {lider.foto ? (
                      <Image
                        src={lider.foto.url}
                        alt={lider.fotoAlt}
                        width={112}
                        height={112}
                        sizes="112px"
                        className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-brand-100"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-3xl font-black text-white ring-4 ring-brand-100"
                      >
                        {lider.iniciales}
                      </span>
                    )}
                    <div className="flex flex-1 flex-col">
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                        {lider.cargo ?? 'Nuestro líder'}
                      </p>
                      <h3 className="mt-1 text-xl transition-colors group-hover:text-brand-700">
                        {lider.nombre}
                      </h3>
                      {lider.resumen && (
                        <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600">
                          {lider.resumen}
                        </p>
                      )}
                      <Link href="/nosotros#lider" className="btn-primary mt-5 w-fit py-2.5">
                        Más información
                        <span className="sr-only"> sobre {lider.nombre}</span>
                      </Link>
                    </div>
                  </div>
                </TarjetaQuienes>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ──────────────────── Servicios (carrusel) ──────────────────── */}
      <section aria-labelledby="servicios-titulo" className="bg-brand-soft py-16 lg:py-20">
        <div className="container-icgc">
          <Reveal desde="izquierda" className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="eyebrow">Servicios</p>
              <h2 id="servicios-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
                Todo lo que tu comunidad necesita, en un solo lugar
              </h2>
            </div>
            <Link href="/servicios" className="btn-secondary">
              Ver todos los servicios
            </Link>
          </Reveal>
          <Reveal retrasoMs={150}>
            <ServiciosCarrusel />
          </Reveal>
        </div>
      </section>

      {/* ──────────────────── Cursos (carrusel) ──────────────────── */}
      <section
        aria-labelledby="cursos-titulo"
        className="container-icgc overflow-x-clip pb-16 lg:pb-20"
      >
        <Reveal desde="izquierda" className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="eyebrow">Capacitación</p>
            <h2 id="cursos-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Nuestros cursos
            </h2>
          </div>
          <Link href="/cursos" className="btn-secondary">
            Ver el detalle de los cursos
          </Link>
        </Reveal>

        <Reveal retrasoMs={150}>
          <Carousel
            label="Cursos de capacitación"
            autoplayMs={4000}
            // Tarjetas más chicas que el carrusel por defecto: 4 por fila en pantallas grandes
            itemClassName="w-[75%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
          >
            {cursos.map((curso) => (
              <CourseCard
                key={curso.slug}
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
      <section aria-labelledby="proyectos-titulo" className="bg-brand-soft py-16 lg:py-20">
        <div className="container-icgc">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Proyectos</p>
            <h2 id="proyectos-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Proyectos que acompañamos
            </h2>
            <p className="mt-4 text-pretty text-slate-600">
              Acompañamos a comunidades campesinas, nativas y entidades públicas en proyectos de
              riego, infraestructura comunal, saneamiento del territorio y protección de sus
              recursos, desde la formulación del expediente hasta la ejecución de la obra.
            </p>
          </Reveal>

          {/* Carrusel que avanza solo y sin flechas: en el celular ya no se
              apilan las 4 tarjetas una debajo de otra */}
          <Reveal retrasoMs={120} className="mt-12">
            <Carousel
              label="Proyectos que acompañamos"
              autoplayMs={4500}
              flechas={false}
              espacio="gap-3"
              itemClassName="w-[80%] sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-1.5rem)/3)] xl:w-[calc((100%-2.25rem)/4)]"
            >
              {proyectos.map((proyecto) => (
                <ProjectFlipCard key={proyecto.slug} proyecto={proyecto} alto="h-[24rem]" />
              ))}
            </Carousel>
          </Reveal>

          <Reveal className="mt-10 text-center">
            <Link href="/proyectos" className="btn-primary">
              Ver todos los proyectos
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────── Mapa de presencia ──────────────────── */}
      <section aria-labelledby="huella-titulo" className="py-16 lg:py-20">
        <div className="container-icgc">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Dónde trabajamos</p>
            <h2 id="huella-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Nuestra huella en el Perú
            </h2>
            <p className="mt-4 text-pretty text-slate-600">
              Trabajamos de la mano con las comunidades en distintas regiones del país, llevando
              asesoría técnica y capacitación hasta donde se ejecutan los proyectos.
            </p>
          </Reveal>

          <Reveal retrasoMs={150} className="mt-12">
            <PeruMap
              presencia={presencia}
              resumen={
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
              }
            />
          </Reveal>
        </div>
      </section>

      {/* ──────────────── Empresas y comunidades ──────────────── */}
      <section aria-labelledby="clientes-titulo" className="py-16 lg:py-20">
        <div className="container-icgc">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Confían en nosotros</p>
            <h2 id="clientes-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Empresas y comunidades que trabajan con nosotros
            </h2>
          </Reveal>
          <Reveal retrasoMs={150} className="mt-12">
            <LogoMarquee clientes={CLIENTES} />
          </Reveal>
        </div>
      </section>

      {/* ──────────────────── Blog: destacadas ──────────────────── */}
      <section aria-labelledby="blog-titulo" className="bg-brand-soft py-16 lg:py-20">
        <div className="container-icgc">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow">Blog</p>
            <h2 id="blog-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
              Publicaciones destacadas
            </h2>
          </Reveal>

          <Reveal retrasoMs={150}>
            {destacados.length > 0 ? (
              <Carousel label="Publicaciones destacadas del blog" autoplayMs={5000}>
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

          <div className="mt-10 text-center">
            <Link href="/blog" className="btn-secondary">
              Ver todas las publicaciones
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────── Cierre: orientador "Encuentra tu siguiente paso" ─────────── */}
      <section aria-labelledby="cta-titulo" className="container-icgc pb-20">
        <Reveal>
          <OrientadorSiguientePaso whatsapp={settings.whatsapp} />
        </Reveal>
      </section>
    </>
  );
}
