import type { MetadataRoute } from 'next';
import { getCourses, getProjects, getSettings, getSitemapData, SITE_URL } from '@/lib/api';

/**
 * sitemap.xml dinamico.
 *
 * Next lo sirve en /sitemap.xml. Se alimenta del backend, asi que cada
 * articulo publicado desde el gestor entra solo, sin tocar codigo.
 * Los posts marcados como noindex quedan fuera (los filtra la API).
 *
 * lastModified es la fecha REAL del último cambio de cada página: si fuera
 * siempre "ahora", Google aprende a ignorarla y deja de usarla para decidir
 * qué volver a rastrear.
 */
export const revalidate = 3600;

/** La fecha más reciente de una lista (o undefined si no hay ninguna). */
function masReciente(fechas: (string | null | undefined)[]): Date | undefined {
  const tiempos = fechas.filter((f): f is string => Boolean(f)).map((f) => new Date(f).getTime());
  return tiempos.length ? new Date(Math.max(...tiempos)) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ posts, categories }, cursos, proyectos, settings] = await Promise.all([
    getSitemapData(),
    getCourses(),
    getProjects(),
    getSettings(),
  ]);

  const fechaBlog = masReciente(posts.map((p) => p.updatedAt));
  const fechaCursos = masReciente(cursos.map((c) => c.updatedAt));
  const fechaProyectos = masReciente(proyectos.map((p) => p.updatedAt));
  // El inicio muestra cursos, proyectos, destacados del blog y los ajustes
  const fechaInicio = masReciente([
    fechaBlog?.toISOString(),
    fechaCursos?.toISOString(),
    fechaProyectos?.toISOString(),
    settings.updatedAt,
  ]);

  // Fotos de cada sección, para el sitemap de imágenes
  const fotos = (lista: { coverImage: { url: string } | null }[]) =>
    lista.flatMap((item) => (item.coverImage ? [item.coverImage.url] : []));

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: fechaInicio, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: fechaBlog, changeFrequency: 'daily', priority: 0.9 },
    {
      url: `${SITE_URL}/proyectos`,
      lastModified: fechaProyectos,
      changeFrequency: 'monthly',
      priority: 0.9,
      images: fotos(proyectos),
    },
    {
      url: `${SITE_URL}/cursos`,
      lastModified: fechaCursos,
      changeFrequency: 'monthly',
      priority: 0.9,
      images: fotos(cursos),
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: new Date(settings.updatedAt),
      changeFrequency: 'yearly',
      priority: 0.6,
      ...(settings.leaderPhoto ? { images: [settings.leaderPhoto.url] } : {}),
    },
  ];

  const articulos: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
    ...(post.image ? { images: [post.image] } : {}),
  }));

  // La API ya excluye las categorías sin artículos publicados
  const temas: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${SITE_URL}/blog?category=${slug}`,
    lastModified: fechaBlog,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...estaticas, ...articulos, ...temas];
}
