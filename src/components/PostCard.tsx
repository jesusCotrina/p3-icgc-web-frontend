import Image from 'next/image';
import Link from 'next/link';
import { enTitulo, formatDateShort, isoDate } from '@/lib/format';
import type { PostSummaryDTO } from '@/lib/types';

/**
 * Tarjeta de artículo. Cada una es un <article> con su <h2>/<h3> y su <time
 * dateTime>, de modo que el listado también le dice algo a Google y no es
 * un montón de divs.
 */
export function PostCard({
  post,
  priority = false,
  headingLevel = 'h3',
}: {
  post: PostSummaryDTO;
  /** true solo para la primera tarjeta visible: precarga su imagen (LCP) */
  priority?: boolean;
  headingLevel?: 'h2' | 'h3';
}) {
  const Heading = headingLevel;
  const href = `/blog/${post.slug}`;

  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
        <div className="relative aspect-[16/10] bg-brand-50">
          {post.coverImage ? (
            <Image
              src={post.coverImage.url}
              alt={post.coverAlt ?? post.coverImage.alt ?? ''}
              fill
              priority={priority}
              loading={priority ? undefined : 'lazy'}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-gradient">
              <span className="text-3xl font-black text-white/90">ICGC</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {post.category && (
            <Link
              href={`/blog?category=${post.category.slug}`}
              className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700 transition-colors hover:bg-brand-100"
            >
              {post.category.name}
            </Link>
          )}
          <time dateTime={isoDate(post.publishedAt)} className="text-slate-500">
            {formatDateShort(post.publishedAt)}
          </time>
          <span aria-hidden="true" className="text-silver-300">
            •
          </span>
          <span className="text-slate-500">{post.readingMinutes} min de lectura</span>
        </div>

        <Heading className="mb-2 text-lg leading-snug text-balance">
          {/* El enlace envuelve el título: el anchor text describe el destino,
              que es exactamente lo que Google usa para entender la página. */}
          <Link href={href} className="transition-colors hover:text-brand-600">
            {enTitulo(post.title)}
          </Link>
        </Heading>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>

        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-800"
        >
          Leer el artículo
          <span className="sr-only">: {post.title}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
