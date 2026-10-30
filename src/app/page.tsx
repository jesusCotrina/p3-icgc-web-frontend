import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BordeOndulado } from '@/components/BordeOndulado';
import { Carousel } from '@/components/Carousel';
import { CourseCard } from '@/components/CourseCard';
import { FondoLineas } from '@/components/FondoLineas';
import { HeroSlider } from '@/components/HeroSlider';
import { JsonLd } from '@/components/JsonLd';
import { SeccionClientes } from '@/components/SeccionClientes';
import { PostCard } from '@/components/PostCard';
import { ProjectFlipCard } from '@/components/ProjectFlipCard';
import { OrientadorSiguientePaso } from '@/components/OrientadorSiguientePaso';
import { Reveal } from '@/components/Reveal';
import { StatsCounter } from '@/components/StatsCounter';
import { HeroRotativo } from '@/components/HeroRotativo';
import { BriefcaseIcon, HandshakeIcon } from '@/components/Icons';
import { ServicioCard } from '@/components/ServicioCard';
import { TituloSeccion } from '@/components/TituloSeccion';
import { enTitulo, inicialesDe } from '@/lib/format';
import { getCourses, getPosts, getProjects, getSettings, logoSrc } from '@/lib/api';
import { resumenPresencia } from '@/lib/presencia';
import { LEMA, QUIENES_SOMOS_RESUMEN } from '@/lib/institucional';
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
    // Foto propia del ICGC
    src: '/hero/entrega-de-maquinaria-a-la-comunidad-hd.webp',
    alt: 'Ceremonia de entrega de volquetes y maquinaria pesada a una comunidad, con los asistentes sentados frente a los vehículos',
  },
] as const;

const RESALTADO = 'bg-gradient-to-r from-brand-300 to-white bg-clip-text text-transparent';

/**
 * Los títulos del hero, en tramos (el resaltado va con degradado). Se alternan
 * con la misma escritura; el primero es el que lee Google como h1.
 */
const TITULOS_HERO = [
  [
    { texto: 'Asesoría y Capacitación para la ' },
    { texto: 'Ejecución de Proyectos Comunales', className: RESALTADO },
  ],
  // El lema oficial del instituto, con mayúscula inicial como todos los títulos
  [
    { texto: `${enTitulo(LEMA.inicio)} ` },
    { texto: enTitulo(LEMA.destacado, true), className: RESALTADO },
    { texto: ` ${enTitulo(LEMA.final, true)}` },
  ],
] as const;

/** El texto que entra debajo de cada título del hero, en el mismo orden. */
const TEXTOS_HERO = [
  'Fortalecemos la gestión de las comunidades campesinas y sus empresas con conocimiento ' +
    'técnico, asesoría especializada y comprensión de la realidad comunal.',
  'Acompañamos a comunidades, empresas comunales y organizaciones desde la idea hasta la obra ' +
    'terminada, con capacitación que deja capacidades instaladas.',
] as const;

/** Cifras de "Quiénes somos" que no salen del gestor (los años sí). */
const CIFRAS_FIJAS = [
  { valor: 90, prefijo: '+', sufijo: '%', etiqueta: 'de satisfacción de nuestros clientes en la industria minera' },
  { valor: 50, prefijo: '+', etiqueta: 'proyectos implementados con éxito en territorios comunales' },
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
        resumen: settings.leaderBio ? truncate(settings.leaderBio.split(/\n{2,}/)[0]!, 340) : null,
        iniciales: inicialesDe(settings.leaderName),
      }
    : null;
  // El carrusel del inicio muestra hasta 8 (4 a la vista en escritorio)
  // 6 en el inicio (mosaico de 3 × 2); el resto, en /proyectos
  const proyectos = todosLosProyectos.slice(0, 6);

  // Una sola fuente para el hero y el mapa: los proyectos publicados
  const totales = resumenPresencia(todosLosProyectos);

  // Los dos botones del hero van al mismo WhatsApp pero con mensajes distintos,
  // así sabemos por qué llegó cada consulta.
  const urlAsesoria = whatsappUrl(settings, 'asesoria');

  // Cifras de "Quiénes somos": los años salen de los ajustes del gestor y las
  // regiones se cuentan de los proyectos publicados (coinciden con el mapa)
  const cifras = [
    ...CIFRAS_FIJAS,
    { valor: settings.yearsExperience, etiqueta: 'años de experiencia', prefijo: '+' },
    {
      valor: totales.regiones,
      etiqueta: totales.regiones === 1 ? 'región del Perú atendida' : 'regiones del Perú atendidas',
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
          <div className="max-w-3xl animate-fade-up lg:max-w-[60rem]">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-brand-100 backdrop-blur-sm">
              {/* Punto que parpadea: un halo que se expande detrás del punto */}
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dorado-claro opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 animate-pulse rounded-full bg-dorado-claro motion-reduce:animate-none" />
              </span>
              Consultoría y capacitación
            </p>

            {/* El único h1 de la página y su texto: se escriben solos al cargar y
                alternan con el lema; el primer par completo ya está en el HTML. */}
            <HeroRotativo
              titulos={TITULOS_HERO}
              textos={TEXTOS_HERO}
              claseTitulo="text-pretty text-[2.1rem] font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]"
              claseTexto="mt-5 max-w-xl text-pretty text-base leading-relaxed text-brand-100 sm:text-lg"
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/servicios" className="btn-light">
                <BriefcaseIcon size={18} />
                Ver servicios
              </Link>
              <Link href={urlAsesoria} {...propsEnlace(urlAsesoria)} className="btn-whatsapp">
                <HandshakeIcon size={18} />
                Quiero asesoría
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ──────────────────── Quiénes somos ──────────────────── */}
      {/* Fondo blanco. A la izquierda el título, el logo (chico) y el lema; a la
          derecha las cuatro cifras en tarjetas arena. Abajo, el gerente. */}
      <section aria-labelledby="quienes-titulo" className="bg-white py-16 lg:py-20">
        <div className="container-icgc">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
            {/* Las piezas se juntan al aparecer: título desde la izquierda, logo
                desde abajo, texto desde la izquierda y por último el botón */}
            <div>
              <Reveal desde="izquierda">
                <p className="eyebrow">Quiénes Somos</p>
                <h2
                  id="quienes-titulo"
                  className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-brand-900 sm:text-[2.6rem]"
                >
                  Un Instituto al Servicio de las Comunidades
                </h2>
              </Reveal>
              <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Logo lo bastante grande para que se lean las letras del aro */}
                <Reveal desde="abajo" retrasoMs={200} className="shrink-0">
                  <Image
                    src={logoSrc(settings)}
                    alt={settings.logoAlt}
                    width={176}
                    height={176}
                    sizes="176px"
                    className="h-36 w-36 shrink-0 object-contain sm:h-44 sm:w-44"
                  />
                </Reveal>
                <Reveal desde="izquierda" retrasoMs={350}>
                  <p className="text-pretty leading-relaxed text-texto">{QUIENES_SOMOS_RESUMEN}</p>
                  {/* El lema oficial del instituto, con la raya dorada al costado */}
                  <p className="mt-4 border-l-4 border-dorado pl-4 text-pretty font-bold leading-snug text-brand-700">
                    “{LEMA.inicio} {LEMA.destacado} {LEMA.final}”
                  </p>
                </Reveal>
              </div>
              <Reveal desde="abajo" retrasoMs={500}>
                <Link href="/nosotros" className="btn-primary mt-9 font-bold">
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
            </div>

            {/* ── Cifras del instituto en tarjetas (el número final ya va en el HTML) ── */}
            <Reveal desde="derecha">
              <StatsCounter stats={cifras} variante="tarjetas" />
            </Reveal>
          </div>

          {/* ── El gerente, como respaldo ── */}
          {lider && (
            <Reveal className="mt-14">
              <div className="flex flex-col gap-6 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:flex-row sm:items-center sm:p-8">
                {lider.foto ? (
                  <Image
                    src={lider.foto.url}
                    alt={lider.fotoAlt}
                    width={112}
                    height={112}
                    sizes="112px"
                    className="h-24 w-24 shrink-0 rounded-full object-cover object-top ring-4 ring-dorado/50"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-900 to-brand-700 text-3xl font-black text-white ring-4 ring-dorado/50"
                  >
                    {lider.iniciales}
                  </span>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-brand-900">{lider.nombre}</h3>
                  {lider.cargo && (
                    <p className="text-sm font-bold uppercase tracking-wider text-dorado-oscuro">
                      {lider.cargo}
                    </p>
                  )}
                  {/* El primer párrafo de la biografía (Ajustes del gestor) es el resumen */}
                  {lider.resumen && (
                    <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-texto">
                      {lider.resumen}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-3 sm:flex-col">
                  <Link href="/nosotros#lider" className="btn-primary font-bold">
                    Conócelo
                    <span className="sr-only"> ({lider.nombre})</span>
                  </Link>
                  <Link href="/nosotros#reconocimientos" className="btn-secondary font-bold">
                    Ver reconocimientos
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ──────────────────── Servicios (grilla 3 × 2) ──────────────────── */}
      {/* Fondo arena con todas las líneas y los bordes cortados en onda suave;
          Quiénes somos (arriba) y Capacitación (abajo) van en blanco */}
      <section
        aria-labelledby="servicios-titulo"
        className="relative isolate overflow-hidden bg-arena py-20 lg:py-24"
      >
        <FondoLineas className="-z-10" />
        <BordeOndulado lado="arriba" />
        <BordeOndulado lado="abajo" />
        {/* Más angosta que el resto: tarjetas más chicas, igual de 3 en 3 */}
        <div className="container-icgc max-w-6xl">
          <Reveal desde="izquierda" className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <TituloSeccion
              id="servicios-titulo"
              titulo="Servicios"
              subtitulo="Transformando capacidades en oportunidades"
            />
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
        className="container-icgc max-w-6xl overflow-x-clip py-16 lg:py-20"
      >
        <Reveal desde="izquierda" className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <TituloSeccion
            id="cursos-titulo"
            titulo="Capacitación"
            subtitulo="Nuestros cursos de gestión comunal y empresarial"
          />
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
      {/* Fondo arena (paleta: secciones de proyectos y comunidades), con líneas finas en SVG */}
      <section
        aria-labelledby="proyectos-titulo"
        className="relative isolate overflow-hidden bg-arena py-16 lg:py-20"
      >
        <FondoLineas className="-z-10" />
        <div className="container-icgc">
          <Reveal>
            <TituloSeccion
              id="proyectos-titulo"
              titulo="Proyectos"
              subtitulo="Hacemos realidad el proyecto de tu comunidad: de la idea a la obra terminada."
              centrado
            />
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

      {/* ──────────────── Empresas y comunidades ──────────────── */}
      <SeccionClientes />

      {/* ──────────────────── Blog: destacadas ──────────────────── */}
      <section
        aria-labelledby="blog-titulo"
        className="bg-brand-soft pb-12 pt-16 lg:pb-14 lg:pt-20"
      >
        <div className="container-icgc max-w-6xl">
          <Reveal className="mb-10">
            <TituloSeccion
              id="blog-titulo"
              titulo="Blog"
              subtitulo="Publicaciones destacadas"
            />
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
      <section aria-labelledby="cta-titulo">
        <OrientadorSiguientePaso whatsapp={settings.whatsapp} aPantallaCompleta />
      </section>
    </>
  );
}
