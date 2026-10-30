import Image from 'next/image';
import Link from 'next/link';
import type { PostBlockDTO } from '@/lib/types';

/** [texto del enlace](/ruta) o [texto](https://...) dentro de un párrafo. */
const ENLACE = /\[([^\]]+)\]\(((?:\/|https?:\/\/)[^)\s]+)\)/g;

/**
 * Convierte los enlaces escritos como [texto](/ruta) en enlaces reales.
 *
 * REGLA SEO: el enlazado interno entre artículos, cursos y proyectos es lo
 * que reparte la autoridad dentro del sitio y evita páginas huérfanas. Los
 * internos van con <Link> (anchor text descriptivo, lo escribe el autor) y
 * los externos se abren aparte con rel="noopener".
 */
function ConEnlaces({ texto }: { texto: string }) {
  const partes: React.ReactNode[] = [];
  let ultimo = 0;
  for (const coincidencia of texto.matchAll(ENLACE)) {
    const [completo, etiqueta, destino] = coincidencia;
    const inicio = coincidencia.index ?? 0;
    if (inicio > ultimo) partes.push(texto.slice(ultimo, inicio));
    partes.push(
      destino!.startsWith('/') ? (
        <Link key={inicio} href={destino!}>
          {etiqueta}
        </Link>
      ) : (
        <a key={inicio} href={destino} target="_blank" rel="noopener noreferrer">
          {etiqueta}
        </a>
      ),
    );
    ultimo = inicio + completo.length;
  }
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return <>{partes}</>;
}

/**
 * Renderiza el contenido del artículo bloque por bloque.
 *
 * REGLA SEO: cada bloque produce HTML semántico real — <h2>, <figure>,
 * <blockquote>, <ul>, <video> — en vez de un <div> con HTML pegado. Eso es lo
 * que permite a Google entender la estructura del artículo, y a los lectores
 * de pantalla recorrerlo. Todo se renderiza en el servidor.
 */
export function PostBlocks({ blocks }: { blocks: PostBlockDTO[] }) {
  return (
    <div className="article-body">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: PostBlockDTO }) {
  switch (block.type) {
    case 'PARAGRAPH':
      return block.text ? (
        <p>
          <ConEnlaces texto={block.text} />
        </p>
      ) : null;

    case 'HEADING': {
      // El h1 está reservado para el título del artículo: aquí solo h2/h3
      const text = block.text ?? '';
      if (!text) return null;
      const id = slugAnchor(text);

      return block.level === 3 ? (
        <h3 id={id} className="mb-3 mt-10 scroll-mt-28 text-xl sm:text-2xl">
          {text}
        </h3>
      ) : (
        <h2 id={id} className="mb-4 mt-12 scroll-mt-28 text-2xl sm:text-3xl">
          {text}
        </h2>
      );
    }

    case 'IMAGE': {
      if (!block.media) return null;
      const { url, width, height } = block.media;

      return (
        <figure className="my-10">
          <Image
            src={url}
            // alt obligatorio: el gestor no deja publicar sin él
            alt={block.alt ?? ''}
            width={width ?? 1280}
            height={height ?? 720}
            // width/height reales evitan el salto de layout (CLS)
            className="h-auto w-full rounded-xl border border-silver-200 object-cover shadow-card"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-slate-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'VIDEO': {
      if (!block.media) return null;

      return (
        <figure className="my-10">
          {/* preload="metadata": no descarga el video entero al cargar la página,
              lo que protege el LCP y el consumo de datos del visitante. */}
          <video
            controls
            preload="metadata"
            playsInline
            className="w-full rounded-xl border border-silver-200 bg-brand-950 shadow-card"
            aria-label={block.caption ?? 'Video del artículo'}
          >
            <source src={block.media.url} type={block.media.mimeType} />
            Tu navegador no puede reproducir este video.{' '}
            <a href={block.media.url} download>
              Descárgalo aquí
            </a>
            .
          </video>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-slate-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'EMBED': {
      if (!block.embedUrl) return null;
      const embed = toEmbedUrl(block.embedUrl);
      if (!embed) return null;

      return (
        <figure className="my-10">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-silver-200 shadow-card">
            <iframe
              src={embed}
              title={block.caption ?? 'Video incrustado'}
              // lazy: el iframe no bloquea la carga inicial
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-slate-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'QUOTE':
      return block.text ? (
        <blockquote className="my-10 border-l-4 border-brand-500 bg-brand-50/70 px-6 py-5 text-lg font-medium italic text-brand-900">
          <p className="mb-0">
            <ConEnlaces texto={block.text} />
          </p>
          {block.caption && (
            <cite className="mt-3 block text-sm font-normal not-italic text-brand-600">
              — {block.caption}
            </cite>
          )}
        </blockquote>
      ) : null;

    case 'LIST': {
      const items = (block.text ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      if (items.length === 0) return null;

      const classes = 'my-6 space-y-2 pl-6 marker:text-brand-500';

      return block.listStyle === 'number' ? (
        <ol className={`list-decimal ${classes}`}>
          {items.map((item, i) => (
            <li key={i}>
              <ConEnlaces texto={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className={`list-disc ${classes}`}>
          {items.map((item, i) => (
            <li key={i}>
              <ConEnlaces texto={item} />
            </li>
          ))}
        </ul>
      );
    }

    case 'DIVIDER':
      return <hr className="my-12 border-silver-200" />;

    default:
      return null;
  }
}

/** Ancla para enlazar un subtítulo: /blog/mi-post#los-tres-pilares */
function slugAnchor(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

/** Normaliza una URL de YouTube o Vimeo a su versión incrustable. */
function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed${parsed.pathname}`;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
      if (parsed.pathname.startsWith('/embed/')) {
        return `https://www.youtube-nocookie.com${parsed.pathname}`;
      }
    }
    if (host === 'vimeo.com') {
      return `https://player.vimeo.com/video${parsed.pathname}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Índice de contenidos a partir de los subtítulos que el autor escribe en el
 * gestor: se arma solo, con un enlace a cada sección.
 * Mejora la navegación en artículos largos y favorece los enlaces de salto
 * ("jump to") que Google muestra en los resultados.
 */
export function TableOfContents({ blocks }: { blocks: PostBlockDTO[] }) {
  const headings = blocks.filter((b) => b.type === 'HEADING' && (b.text ?? '').trim());
  if (headings.length === 0) return null;

  return (
    <nav aria-labelledby="toc-title" className="rounded-xl border border-brand-100 bg-brand-50/60 p-5">
      <h2 id="toc-title" className="mb-3 text-sm font-bold uppercase tracking-wider text-brand-700">
        En Este Artículo
      </h2>
      <ol className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${slugAnchor(h.text ?? '')}`}
              className="flex gap-2.5 rounded-md px-2 py-1.5 font-semibold leading-snug text-brand-900 transition-colors hover:bg-white hover:text-brand-600"
            >
              {/* Viñeta: círculo lleno en las secciones, aro en las subsecciones */}
              <span
                aria-hidden="true"
                className={`mt-[0.4rem] h-2 w-2 shrink-0 rounded-full ${
                  h.level === 3 ? 'border-2 border-brand-400' : 'bg-brand-500'
                }`}
              />
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
