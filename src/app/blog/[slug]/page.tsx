import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AutoReveal } from '@/components/AutoReveal';
import { JsonLd } from '@/components/JsonLd';
import { PostBlocks, TableOfContents } from '@/components/PostBlocks';
import { PostCard } from '@/components/PostCard';
import { ViewCounter } from '@/components/ViewCounter';
import { getCategories, getPost, getPosts, getSettings } from '@/lib/api';
import { formatDate, isoDate } from '@/lib/format';
import {
  blogPostingSchema,
  breadcrumbSchema,
  buildMetadata,
  postDescription,
  postTitle,
} from '@/lib/seo';

// ISR: cada artículo se sirve como HTML estático y se revalida cada 10 min.
export const revalidate = 600;
// Un slug que no estaba en generateStaticParams se genera bajo demanda
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

/**
 * Pre-renderiza los artículos en el build. Google recibe HTML instantáneo,
 * lo que mejora el LCP y el presupuesto de rastreo.
 */
export async function generateStaticParams() {
  const { items } = await getPosts({ pageSize: 50 });
  return items.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [data, settings] = await Promise.all([getPost(slug), getSettings()]);

  if (!data) {
    return { title: 'Artículo no encontrado', robots: { index: false, follow: false } };
  }

  const { post } = data;

  return buildMetadata({
    title: postTitle(post, settings),
    description: postDescription(post),
    path: `/blog/${post.slug}`,
    settings,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authorName: post.author?.name ?? null,
    tags: post.tags.map((t) => t.name),
    noindex: post.noindex,
    image: post.coverImage
      ? {
          url: post.coverImage.url,
          width: post.coverImage.width,
          height: post.coverImage.height,
          alt: post.coverAlt ?? post.coverImage.alt ?? post.title,
        }
      : null,
  });
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [data, settings, categorias] = await Promise.all([
    getPost(slug),
    getSettings(),
    getCategories(),
  ]);

  // 404 real (no una página con mensaje y status 200): Google necesita el código
  if (!data) notFound();

  const { post, related } = data;

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(post, settings),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Blog', path: '/blog' },
            ...(post.category
              ? [{ name: post.category.name, path: `/blog?category=${post.category.slug}` }]
              : []),
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Dos columnas que aprovechan la pantalla: el artículo a la izquierda
          y, a la derecha, el índice (se arma con los subtítulos del gestor),
          y las categorías del blog. En móvil, uno debajo del otro. */}
      <div className="container-icgc grid gap-10 pb-16 pt-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12 lg:pb-20 lg:pt-8 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <article className="min-w-0">
          {/* ── Cabecera: título, resumen e imagen, en ese orden ── */}
          <header>
            <nav aria-label="Ruta de navegación" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/blog" className="font-medium text-brand-700 hover:text-brand-900">
                    Blog
                  </Link>
                </li>
                {post.category && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link
                        href={`/blog?category=${post.category.slug}`}
                        className="font-medium text-brand-700 hover:text-brand-900"
                      >
                        {post.category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            {/* El h1 de la página es el título del artículo. Uno solo. */}
            <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.15] sm:text-4xl">
              {post.title}
            </h1>

            {(post.subtitle || post.excerpt) && (
              <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
                {post.subtitle || post.excerpt}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              {post.author && (
                <span>
                  Por <strong className="font-semibold text-brand-800">{post.author.name}</strong>
                </span>
              )}
              {/* datetime en ISO: es el formato que Google lee para la fecha */}
              <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
              <span>{post.readingMinutes} min de lectura</span>
            </div>

            {post.coverImage && (
              <Image
                src={post.coverImage.url}
                alt={post.coverAlt ?? post.coverImage.alt ?? post.title}
                width={post.coverImage.width ?? 1280}
                height={post.coverImage.height ?? 720}
                // Imagen principal del artículo: es el LCP, se precarga
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
                // Recortada a un alto razonable: acompaña al texto sin tapar la pantalla
                className="mt-7 aspect-[2/1] max-h-[24rem] w-full rounded-xl border border-silver-200 object-cover shadow-card"
              />
            )}
          </header>

          {/* ── Contenido ── */}
          <div className="mt-10">
            <PostBlocks blocks={post.blocks} />
          </div>

          {post.tags.length > 0 && (
            <footer className="mt-14 border-t border-silver-200 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Temas de este artículo
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {post.tags.map((tag) => (
                  <li key={tag.id}>
                    <Link
                      href={`/blog?tag=${tag.slug}`}
                      className="inline-flex rounded-full border border-silver-200 px-4 py-1.5 text-sm text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      #{tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </article>

        {/* ── Columna derecha: se queda a la vista mientras se lee ── */}
        <aside aria-label="Navegación del artículo" className="min-w-0">
          <div className="space-y-6 lg:sticky lg:top-28">
            <TableOfContents blocks={post.blocks} />

            {categorias.length > 0 && (
              <nav aria-labelledby="categorias-blog" className="rounded-xl border border-silver-200 bg-white p-5">
                <h2 id="categorias-blog" className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-700">
                  Categorías
                </h2>
                <ul className="space-y-1 text-sm">
                  {categorias.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/blog?category=${c.slug}`}
                        aria-current={c.id === post.category?.id ? 'page' : undefined}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800 aria-[current=page]:font-bold aria-[current=page]:text-brand-800"
                      >
                        {c.name}
                        <span className="text-xs text-slate-400">{c.postCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </aside>
      </div>

      {/* Suma una visita. Va en el cliente para no romper la caché del HTML. */}
      <ViewCounter slug={post.slug} />

      {/* ── Relacionados: enlazado interno hacia otros artículos ── */}
      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="border-t border-silver-200 bg-brand-soft">
          <div className="container-icgc py-16 lg:py-20">
            <h2 id="relacionados" className="text-2xl sm:text-3xl">
              Sigue leyendo sobre gestión comunal
            </h2>
            <div data-revelar-hijos className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="container-icgc py-16">
        <div className="rounded-2xl bg-brand-gradient px-8 py-12 text-center">
          <h2 className="text-balance text-2xl text-white sm:text-3xl">
            Lleva esta capacitación a tu comunidad
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            El ICGC diseña programas a medida para comunidades y organizaciones de todo el Perú.
          </p>
          <Link href="/nosotros#contacto" className="btn-light mt-8">
            Solicitar información
          </Link>
        </div>
      </section>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}
