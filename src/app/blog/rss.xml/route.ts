import { getPosts, getSettings, SITE_URL } from '@/lib/api';
import { postDescription } from '@/lib/seo';

// Se regenera junto con el blog: cada artículo nuevo aparece en el feed
export const revalidate = 600;

/** Escapa los caracteres reservados de XML. */
const xml = (texto: string) =>
  texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Feed RSS 2.0 del blog (/blog/rss.xml).
 *
 * Google lo usa para descubrir artículos nuevos más rápido que con el
 * sitemap, y también lo leen los agregadores de noticias. El layout lo
 * anuncia con <link rel="alternate" type="application/rss+xml">.
 */
export async function GET() {
  const [settings, { items }] = await Promise.all([getSettings(), getPosts({ pageSize: 30 })]);

  // Los destacados van primero en la API: la fecha del feed es la del artículo más nuevo
  const ultima = new Date(
    Math.max(0, ...items.map((p) => new Date(p.publishedAt ?? p.createdAt).getTime())),
  );

  const entradas = items
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const fecha = new Date(post.publishedAt ?? post.createdAt).toUTCString();
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${fecha}</pubDate>
      <description>${xml(postDescription(post))}</description>${
        post.category ? `\n      <category>${xml(post.category.name)}</category>` : ''
      }${
        post.coverImage
          ? `\n      <enclosure url="${xml(post.coverImage.url)}" type="${xml(post.coverImage.mimeType)}" length="${post.coverImage.sizeBytes}" />`
          : ''
      }
    </item>`;
    })
    .join('\n');

  const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`Blog | ${settings.siteName}`)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xml('Guías prácticas, normativa y capacitación en gestión comunal para comunidades campesinas y nativas del Perú.')}</description>
    <language>es-PE</language>${
      items.length ? `\n    <lastBuildDate>${ultima.toUTCString()}</lastBuildDate>` : ''
    }
${entradas}
  </channel>
</rss>
`;

  return new Response(cuerpo, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
