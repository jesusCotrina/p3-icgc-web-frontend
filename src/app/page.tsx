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
import { Reveal } from '@/components/Reveal';
import { StatsCounter } from '@/components/StatsCounter';
import { textoCompleto, Typewriter } from '@/components/Typewriter';
import { BookIcon, HandshakeIcon, WhatsAppIcon } from '@/components/Icons';
import { getCourses, getPosts, getProjects, getSettings } from '@/lib/api';
import { presenciaPorRegion, resumenPresencia } from '@/lib/presencia';
import { absoluteUrl, buildMetadata } from '@/lib/seo';
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
    nombre: 'Minera Raura',
    logo: '/clientes/minera-raura.avif',
    width: 354,
    height: 123,
  },
  {
    nombre: 'Buenaventura',
    logo: '/clientes/buenaventura.avif',
    width: 652,
    height: 106,
  },
];

/** Las dos líneas de negocio del instituto. */
const SERVICIOS = [
  {
    titulo: 'Consultoría y asesoría',
    imagen: {
      src: '/inicio/asamblea-comunal-tiquihua.webp',
      alt: 'Comuneros reunidos en asamblea comunal frente al local de la comunidad de Tiquihua, en los Andes',
      credito: 'Txolo, CC BY-SA 4.0, Wikimedia Commons',
    },
    descripcion:
      'Acompañamos a la comunidad u organización en todo el camino del proyecto: desde el ' +
      'expediente y la licitación hasta la ejecución y la liquidación de la obra.',
    href: '/proyectos',
    cta: 'Ver cómo trabajamos los proyectos',
  },
  {
    titulo: 'Cursos y capacitación',
    imagen: {
      src: '/inicio/taller-mapeo-participativo.webp',
      alt: 'Participantes trabajando en grupo alrededor de una mesa durante un taller de capacitación',
      credito: 'Candy Sotomayor, CC BY-SA 4.0, Wikimedia Commons',
    },
    descripcion:
      'Programas formativos para dirigentes, comuneros y profesionales, con material ' +
      'descargable, casos reales y certificación del instituto.',
    href: '/cursos',
    cta: 'Ver los cursos disponibles',
  },
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
  const proyectos = todosLosProyectos.slice(0, 4);

  // Una sola fuente para el hero y el mapa: los proyectos publicados
  const totales = resumenPresencia(todosLosProyectos);
  const presencia = presenciaPorRegion(todosLosProyectos);

  // Los dos botones del hero van al mismo WhatsApp pero con mensajes distintos,
  // así sabemos por qué llegó cada consulta.
  const urlCursos = whatsappUrl(settings, 'cursos');
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
        <HeroSlider slides={HERO_SLIDES} />

        {/* Velo oscuro: garantiza contraste del texto sobre cualquier foto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/70 to-brand-900/25"
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
              <Link href={urlCursos} {...propsEnlace(urlCursos)} className="btn-light">
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

        <div
          aria-hidden="true"
          className="relative z-10 h-10 bg-white [clip-path:ellipse(75%_100%_at_50%_100%)]"
        />
      </section>

      {/* ──────────────────── Quiénes somos ──────────────────── */}
      {/* overflow-x-clip: el deslizamiento lateral no genera scroll horizontal */}
      <section
        aria-labelledby="quienes-titulo"
        className="container-icgc overflow-x-clip py-16 lg:py-20"
      >
        <Reveal desde="izquierda" className="max-w-3xl">
          <p className="eyebrow">Quiénes somos</p>
          <h2 id="quienes-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
            Un instituto al servicio de las comunidades
          </h2>
          <p className="mt-4 text-pretty text-slate-600">
            Asesoramos y capacitamos a comunidades campesinas, nativas y organizaciones del Perú
            para que sus proyectos se formulen, se financien y se ejecuten bien.
          </p>
        </Reveal>

        {/* Tarjetas compactas: cada una entra desde su costado al bajar */}
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {SERVICIOS.map((servicio, i) => (
            <Reveal
              key={servicio.titulo}
              desde={i === 0 ? 'izquierda' : 'derecha'}
              retrasoMs={150 + i * 150}
              className="h-full"
            >
              {/* Card Hover Highlight: al pasar el mouse o enfocar el botón la
                tarjeta se eleva, gana una sombra marcada, la foto hace un zoom
                suave y una línea azul recorre todo el borde. */}
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

                <div className="relative aspect-[2/1] overflow-hidden bg-brand-50">
                  <Image
                    src={servicio.imagen.src}
                    alt={servicio.imagen.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 32rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg transition-colors group-hover:text-brand-700">
                    {servicio.titulo}
                  </h3>
                  <p className="mb-6 mt-2 text-pretty text-sm leading-relaxed text-slate-600">
                    {servicio.descripcion}
                  </p>

                  <Link href={servicio.href} className="btn-secondary mt-auto w-fit py-2.5">
                    {servicio.cta}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
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

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {proyectos.map((proyecto, i) => (
              // Entran una tras otra, con un pequeño desfase
              <Reveal key={proyecto.slug} retrasoMs={i * 120}>
                <ProjectFlipCard proyecto={proyecto} />
              </Reveal>
            ))}
          </div>

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

          <Reveal retrasoMs={120}>
            <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-center">
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
          </Reveal>

          <Reveal retrasoMs={200} className="mt-10">
            <PeruMap presencia={presencia} />
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

      {/* ──────────────────── CTA final ──────────────────── */}
      <section aria-labelledby="cta-titulo" className="container-icgc pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-brand-gradient px-8 py-14 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl"
            />
            <div className="relative">
              <h2 id="cta-titulo" className="text-balance text-3xl text-white sm:text-4xl">
                ¿Tienes un proyecto o necesitas capacitar a tu equipo?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-pretty leading-relaxed text-brand-100">
                Escríbenos por WhatsApp y te respondemos con una propuesta concreta para tu
                comunidad u organización.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href={urlAsesoria} {...propsEnlace(urlAsesoria)} className="btn-whatsapp">
                  <WhatsAppIcon size={18} />
                  Quiero asesoría
                </Link>
                <Link href={urlCursos} {...propsEnlace(urlCursos)} className="btn-light">
                  <BookIcon size={18} />
                  Ver cursos
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
