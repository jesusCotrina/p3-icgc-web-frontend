import type { Metadata } from 'next';
import Link from 'next/link';
import { AutoReveal } from '@/components/AutoReveal';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/PostCard';
import { getCategories, getPosts, getSettings } from '@/lib/api';
import { blogSchema, breadcrumbSchema, buildMetadata } from '@/lib/seo';

export const revalidate = 300;

// 2 columnas × 3 filas
const PAGE_SIZE = 6;

type SearchParams = Promise<{ page?: string; category?: string; tag?: string; q?: string }>;

/** Las descripciones cortas de categoría se completan hasta el rango que Google muestra. */
function descripcionCategoria(nombre: string, descripcion: string | null) {
  const base = descripcion?.trim() || `Artículos del ICGC sobre ${nombre.toLowerCase()}.`;
  if (base.length >= 120) return base;
  return `${base} Guías prácticas del ICGC para dirigentes y comunidades campesinas y nativas del Perú.`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { page, category, tag, q } = await searchParams;
  const [settings, categorias] = await Promise.all([getSettings(), getCategories()]);
  const activa = categorias.find((c) => c.slug === category);
  const pageNum = Number(page) || 1;

  const title = activa
    ? `${activa.name}: artículos sobre gestión comunal`
    : 'Blog de gestión comunal: guías, normativa y capacitación';

  const description = activa
    ? descripcionCategoria(activa.name, activa.description)
    : 'Artículos, guías prácticas y análisis normativo sobre gestión comunal en el Perú, ' +
      'publicados por el Instituto de Capacitación en Gestión Comunal.';

  // Páginas 2, 3...: título corto con el número, para que no se corte ni se duplique
  const base = activa ? activa.name : 'Blog de gestión comunal';

  return buildMetadata({
    title: pageNum > 1 ? `${base} - Página ${pageNum} | ICGC` : title,
    description: pageNum > 1 ? `Página ${pageNum}. ${description}` : description,
    // La canónica de una categoría apunta a la URL con su filtro
    path: buildPath({ page: pageNum, category, tag }),
    settings,
    // Búsquedas y etiquetas: páginas finas que repiten artículos; Google
    // las recorre (follow) pero no las indexa
    noindex: Boolean(q || tag),
  });
}

function buildPath({
  page,
  category,
  tag,
  q,
}: {
  page?: number;
  category?: string;
  tag?: string;
  q?: string;
}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);
  if (q) params.set('q', q);
  if (page && page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/blog${query ? `?${query}` : ''}`;
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { page, category, tag, q } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  const [settings, categorias, resultados] = await Promise.all([
    getSettings(),
    getCategories(),
    getPosts({ page: pageNum, pageSize: PAGE_SIZE, category, tag, q }),
  ]);

  const activa = categorias.find((c) => c.slug === category);
  // Nombre legible de la etiqueta (#padrón comunal), tomado de los propios artículos
  const etiqueta = tag
    ? resultados.items.flatMap((p) => p.tags).find((t) => t.slug === tag)
    : undefined;
  const { items, total, totalPages } = resultados;

  return (
    <>
      <JsonLd
        data={[
          blogSchema(items, settings),
          breadcrumbSchema([
            { name: 'Inicio', path: '/' },
            { name: 'Blog', path: '/blog' },
            ...(activa ? [{ name: activa.name, path: `/blog?category=${activa.slug}` }] : []),
          ]),
        ]}
      />

      {/* Título y filtros a la izquierda, artículos a la derecha */}
      <div className="container-icgc grid gap-8 pb-16 pt-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 lg:pt-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight">
            {activa ? activa.name : etiqueta ? `#${etiqueta.name}` : 'Blog de gestión comunal'}
          </h1>

          {/* Búsqueda: formulario GET, funciona sin JavaScript */}
          <form action="/blog" method="get" role="search" className="mt-6">
            <label htmlFor="buscar-blog" className="sr-only">
              Buscar en el blog
            </label>
            <div className="flex overflow-hidden rounded-lg border border-silver-300 bg-white focus-within:border-brand-500">
              <input
                id="buscar-blog"
                name="q"
                type="search"
                defaultValue={q ?? ''}
                placeholder="Buscar artículos"
                className="min-w-0 flex-1 px-3 py-2.5 text-sm text-brand-900 outline-none placeholder:text-slate-400"
              />
              {category && <input type="hidden" name="category" value={category} />}
              <button
                type="submit"
                aria-label="Buscar"
                className="px-3 text-brand-600 hover:text-brand-800"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </div>
          </form>

          {/* Filtros por categoría: enlaces reales, rastreables por Google */}
          {categorias.length > 0 && (
            <nav aria-labelledby="filtro-categorias" className="mt-7">
              <h2
                id="filtro-categorias"
                className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                Categorías
              </h2>
              <ul className="mt-3 space-y-1">
                <li>
                  <Link
                    href="/blog"
                    aria-current={!category ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      !category ? 'bg-brand-600 text-white' : 'text-brand-800 hover:bg-brand-50'
                    }`}
                  >
                    Todas las publicaciones
                  </Link>
                </li>
                {categorias.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/blog?category=${c.slug}`}
                      aria-current={category === c.slug ? 'page' : undefined}
                      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        category === c.slug
                          ? 'bg-brand-600 text-white'
                          : 'text-brand-800 hover:bg-brand-50'
                      }`}
                    >
                      {c.name}
                      <span className="text-xs opacity-70">{c.postCount}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>

        {/* Listado: 2 columnas × 3 filas por página */}
        <section aria-label="Artículos publicados">
          {q && (
            <p className="mb-8 text-sm text-slate-600">
              {total} resultado{total === 1 ? '' : 's'} para <strong>{q}</strong>.{' '}
              <Link href="/blog" className="text-brand-600 underline">
                Limpiar búsqueda
              </Link>
            </p>
          )}

          {items.length > 0 ? (
            <>
              <div data-revelar-hijos className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((post, i) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    headingLevel="h2"
                    // Solo la primera imagen se precarga: es la candidata a LCP
                    priority={i === 0}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={pageNum}
                  totalPages={totalPages}
                  category={category}
                  tag={tag}
                  q={q}
                />
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-silver-300 p-16 text-center">
              <h2 className="text-xl">Todavía no hay artículos aquí</h2>
              <p className="mx-auto mt-3 max-w-md text-slate-600">
                Las publicaciones que se creen desde el gestor aparecerán en esta página
                automáticamente.
              </p>
              <Link href="/blog" className="btn-secondary mt-8">
                Ver todos los artículos
              </Link>
            </div>
          )}
        </section>
      </div>
      {/* Las secciones entran con la misma animación que el inicio */}
      <AutoReveal />
    </>
  );
}

/**
 * Paginación con enlaces <a> reales (no botones con JS): así Googlebot puede
 * seguirlos y descubrir todos los artículos del blog.
 */
function Pagination({
  page,
  totalPages,
  category,
  tag,
  q,
}: {
  page: number;
  totalPages: number;
  category?: string;
  tag?: string;
  q?: string;
}) {
  const numeros = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1,
  );

  return (
    <nav
      aria-label="Paginación del blog"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={buildPath({ page: page - 1, category, tag, q })}
          rel="prev"
          className="btn-secondary"
        >
          Anterior
        </Link>
      )}

      <ol className="flex items-center gap-1.5">
        {numeros.map((n, index) => {
          const anterior = numeros[index - 1];
          const hayHueco = anterior !== undefined && n - anterior > 1;

          return (
            <li key={n} className="flex items-center gap-1.5">
              {hayHueco && (
                <span aria-hidden="true" className="px-1 text-slate-400">
                  …
                </span>
              )}
              <Link
                href={buildPath({ page: n, category, tag, q })}
                aria-current={n === page ? 'page' : undefined}
                aria-label={`Página ${n}`}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  n === page
                    ? 'bg-brand-600 text-white'
                    : 'border border-silver-200 text-brand-700 hover:border-brand-300 hover:bg-brand-50'
                }`}
              >
                {n}
              </Link>
            </li>
          );
        })}
      </ol>

      {page < totalPages && (
        <Link
          href={buildPath({ page: page + 1, category, tag, q })}
          rel="next"
          className="btn-secondary"
        >
          Siguiente
        </Link>
      )}
    </nav>
  );
}
