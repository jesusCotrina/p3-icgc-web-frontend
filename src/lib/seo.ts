import type { Metadata } from 'next';
import { SITE_URL } from './api';
import { direccionDelSitio } from './direccion';
import type { PostDTO, PostSummaryDTO, SiteSettingsDTO } from './types';

/**
 * Centro de control del SEO.
 *
 * Cada página del sitio arma su metadata aquí para que nunca falte un título,
 * una descripción, una canónica o una tarjeta social. Si agregas una ruta nueva,
 * agrégale también su constructor en este archivo.
 */

export const absoluteUrl = (path = '/'): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Google corta los títulos cerca de los 60 caracteres. */
export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  settings: SiteSettingsDTO;
  image?: { url: string; width?: number | null; height?: number | null; alt: string } | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authorName?: string | null;
  tags?: string[];
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  settings,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authorName,
  tags,
  noindex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? defaultOgImage(settings);

  return {
    // `absolute` desactiva el template "%s | ICGC" del layout: los titulos que
    // arma esta funcion ya vienen completos y si no, saldrian duplicados.
    title: { absolute: title },
    description: truncate(description, 160),
    // Canónica explícita: la defensa nº 1 contra el contenido duplicado
    alternates: { canonical: url },
    // noindex, pero follow: Google no indexa la página y sí sigue sus enlaces
    // (una búsqueda o etiqueta igual lleva a artículos que sí se indexan)
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      type,
      url,
      title,
      description: truncate(description, 200),
      siteName: settings.siteName,
      locale: 'es_PE',
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage.url,
                width: ogImage.width ?? 1200,
                height: ogImage.height ?? 630,
                alt: ogImage.alt,
              },
            ],
          }
        : {}),
      ...(type === 'article'
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
            authors: authorName ? [authorName] : undefined,
            tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: truncate(title, 70),
      description: truncate(description, 200),
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
  };
}

/**
 * Imagen 1200 × 630 que se ve al compartir en WhatsApp, Facebook o LinkedIn.
 * Si el gestor no cargó una propia, se usa la de public/og (el logo cuadrado
 * se recortaba y no decía de qué trata el sitio).
 */
export const OG_POR_DEFECTO = {
  url: absoluteUrl('/og/icgc-compartir.jpg'),
  width: 1200,
  height: 630,
  alt: 'Instituto de Capacitación en Gestión Comunal: asesoría y capacitación para proyectos comunales en el Perú',
};

function defaultOgImage(settings: SiteSettingsDTO) {
  const media = settings.ogImage;
  if (!media) return OG_POR_DEFECTO;
  return {
    url: media.url,
    width: media.width,
    height: media.height,
    alt: media.alt ?? settings.siteName,
  };
}

/** Título SEO de un artículo: el metaTitle si existe, si no el título + marca. */
export function postTitle(post: PostDTO | PostSummaryDTO, settings: SiteSettingsDTO): string {
  const meta = 'metaTitle' in post ? post.metaTitle : null;
  if (meta?.trim()) return meta.trim();
  // "ICGC - Instituto de Capacitacion..." -> "ICGC"
  const brand = settings.siteName.split(/[-|—]/)[0]?.trim() || 'ICGC';
  return truncate(`${post.title} | ${brand}`, 65);
}

export function postDescription(post: PostDTO | PostSummaryDTO): string {
  const meta = 'metaDescription' in post ? post.metaDescription : null;
  return truncate((meta?.trim() || post.excerpt).trim(), 160);
}

// ───────────────────────────── JSON-LD ─────────────────────────────

/**
 * Datos estructurados (schema.org). Son lo que permite que Google muestre
 * resultados enriquecidos: fecha, autor, miga de pan y logo de la organización.
 */

export function organizationSchema(settings: SiteSettingsDTO) {
  const direccion = direccionDelSitio(settings);
  const sameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.youtubeUrl,
    settings.linkedinUrl,
    settings.tiktokUrl,
  ].filter((u): u is string => Boolean(u));

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: settings.siteName,
    alternateName: 'ICGC',
    url: SITE_URL,
    description: settings.defaultMetaDescription,
    // Ayuda a Google a asociar la organización con sus temas y su país
    areaServed: { '@type': 'Country', name: 'Perú' },
    knowsAbout: [
      'Gestión comunal',
      'Comunidades campesinas',
      'Comunidades nativas',
      'Contrataciones con el Estado',
      'Formulación de proyectos de inversión',
      'Saneamiento físico-legal del territorio',
      'Capacitación de dirigentes comunales',
    ],
    ...(settings.logo
      ? {
          logo: {
            '@type': 'ImageObject',
            url: settings.logo.url,
            width: settings.logo.width ?? undefined,
            height: settings.logo.height ?? undefined,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings.email || settings.phone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            ...(settings.email ? { email: settings.email } : {}),
            ...(settings.phone ? { telephone: settings.phone } : {}),
            areaServed: 'PE',
            availableLanguage: ['es'],
          },
        }
      : {}),
    // Siempre con dirección (la del gestor o la por defecto): SEO local
    address: {
      '@type': 'PostalAddress',
      streetAddress: direccion.calle,
      ...(direccion.distrito
        ? { addressLocality: direccion.distrito, addressRegion: direccion.ciudad }
        : { addressLocality: direccion.ciudad }),
      addressCountry: settings.country === 'Perú' || !settings.country ? 'PE' : settings.country,
    },
  };
}

export function websiteSchema(settings: SiteSettingsDTO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: settings.siteName,
    description: settings.defaultMetaDescription,
    inLanguage: 'es-PE',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(post: PostDTO, settings: SiteSettingsDTO) {
  const url = absoluteUrl(`/blog/${post.slug}`);

  // Los videos del artículo se declaran para que puedan aparecer en Google Vídeos
  const videos = post.blocks
    .filter((b) => b.type === 'VIDEO' && b.media)
    .map((b) => ({
      '@type': 'VideoObject',
      name: b.caption ?? post.title,
      description: b.caption ?? post.excerpt,
      contentUrl: b.media!.url,
      uploadDate: b.media!.createdAt,
      ...(post.coverImage ? { thumbnailUrl: [post.coverImage.url] } : {}),
      ...(b.media!.durationSec ? { duration: `PT${b.media!.durationSec}S` } : {}),
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: truncate(post.title, 110),
    description: postDescription(post),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    inLanguage: 'es-PE',
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    ...(post.coverImage
      ? {
          image: {
            '@type': 'ImageObject',
            url: post.coverImage.url,
            width: post.coverImage.width ?? undefined,
            height: post.coverImage.height ?? undefined,
          },
        }
      : {}),
    author: {
      '@type': 'Person',
      name: post.author?.name ?? settings.siteName,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    ...(post.category ? { articleSection: post.category.name } : {}),
    ...(post.tags.length ? { keywords: post.tags.map((t) => t.name).join(', ') } : {}),
    ...(videos.length ? { video: videos } : {}),
  };
}

export function blogSchema(posts: PostSummaryDTO[], settings: SiteSettingsDTO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: absoluteUrl('/blog'),
    name: `Blog | ${settings.siteName}`,
    description:
      'Artículos, guías y noticias sobre gestión comunal, normativa y capacitación de dirigentes.',
    inLanguage: 'es-PE',
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: posts.slice(0, 10).map((p) => ({
      '@type': 'BlogPosting',
      headline: truncate(p.title, 110),
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt ?? p.createdAt,
      ...(p.coverImage ? { image: p.coverImage.url } : {}),
    })),
  };
}

export function courseSchema(
  course: {
    slug: string;
    name: string;
    description: string;
    mode: string;
    hours?: number;
    image?: string;
    audience?: string;
    topics?: string[];
    /** Aún no abre: se declara como preventa en vez de "disponible" */
    comingSoon?: boolean;
  },
  settings: SiteSettingsDTO,
) {
  const url = absoluteUrl(`/cursos#${course.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': url,
    url,
    name: course.name,
    description: course.description,
    inLanguage: 'es-PE',
    // Nombre explícito además del @id: Google exige provider.name en los cursos
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: settings.siteName,
      sameAs: SITE_URL,
    },
    ...(course.audience
      ? { audience: { '@type': 'EducationalAudience', audienceType: course.audience } }
      : {}),
    ...(course.topics?.length ? { teaches: course.topics } : {}),
    offers: {
      '@type': 'Offer',
      category: 'Educational',
      availability: course.comingSoon
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: course.mode,
      // ISO 8601: PT48H = 48 horas lectivas
      courseWorkload: course.hours ? `PT${course.hours}H` : 'P1M',
    },
    // La foto del curso; si no tiene, el logo del instituto
    ...(course.image ? { image: course.image } : settings.logo ? { image: settings.logo.url } : {}),
  };
}
