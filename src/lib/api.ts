import type {
  CategoryDTO,
  CourseDTO,
  Paginated,
  PostDTO,
  PostSummaryDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SitemapDataDTO,
} from './types';

/**
 * Cliente de la API pública.
 *
 * REGLA SEO: todo esto se ejecuta en el SERVIDOR (Server Components).
 * El contenido llega en el HTML inicial, que es lo que Googlebot indexa.
 * Nunca muevas estas llamadas a un useEffect.
 */

// Dentro de Docker el backend se alcanza por el nombre del servicio;
// desde el navegador, por la URL pública.
const BASE_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
);

/** Revalidación por defecto: 5 minutos. HTML cacheado = LCP bajo = mejor ranking. */
const DEFAULT_REVALIDATE = 300;

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE, tags } = options;

  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: revalidate === false ? 0 : revalidate, ...(tags ? { tags } : {}) },
  });

  if (!res.ok) {
    throw new ApiError(`GET ${path} respondió ${res.status}`, res.status);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Variante tolerante: si la API está caída, la página igual se renderiza.
 * Un 500 global sería mucho peor para el SEO que una sección vacía.
 */
async function safeFetch<T>(path: string, fallback: T, options?: FetchOptions): Promise<T> {
  try {
    return await apiFetch<T>(path, options);
  } catch (error) {
    console.error(`[api] Falló ${path}:`, error);
    return fallback;
  }
}

// ───────────────────────────── Posts ─────────────────────────────

export type ListPostsParams = {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  q?: string;
  featured?: boolean;
};

const emptyPage: Paginated<PostSummaryDTO> = {
  items: [],
  page: 1,
  pageSize: 9,
  total: 0,
  totalPages: 1,
};

export function getPosts(params: ListPostsParams = {}): Promise<Paginated<PostSummaryDTO>> {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return safeFetch(`/public/posts${query ? `?${query}` : ''}`, emptyPage, { tags: ['posts'] });
}

export type PostWithRelated = { post: PostDTO; related: PostSummaryDTO[] };

/** Devuelve null si no existe, para que la página dispare notFound() → 404 real. */
export async function getPost(slug: string): Promise<PostWithRelated | null> {
  try {
    return await apiFetch<PostWithRelated>(`/public/posts/${encodeURIComponent(slug)}`, {
      tags: ['posts', `post:${slug}`],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    console.error(`[api] Falló el post ${slug}:`, error);
    return null;
  }
}

export function getCategories(): Promise<CategoryDTO[]> {
  return safeFetch<CategoryDTO[]>('/public/categories', [], { tags: ['categories'] });
}

// ───────────────────────── Configuración del sitio ─────────────────────────

export const FALLBACK_SETTINGS: SiteSettingsDTO = {
  siteName: 'Instituto de Capacitación en Gestión Comunal',
  tagline:
    'Consultoría especializada y capacitación en gestión comunal, licitaciones y ejecución de ' +
    'proyectos de infraestructura para comunidades y organizaciones.',
  defaultMetaDescription:
    'Instituto de Capacitación en Gestión Comunal (ICGC): asesoría en licitaciones y ejecución ' +
    'de proyectos de infraestructura, y cursos para comunidades y organizaciones del Perú.',
  siteUrl: SITE_URL,
  logo: null,
  logoAlt: 'Logo del Instituto de Capacitación en Gestión Comunal',
  ogImage: null,
  email: null,
  phone: null,
  whatsapp: null,
  address: null,
  city: 'Lima',
  country: 'PE',
  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  linkedinUrl: null,
  tiktokUrl: null,
  googleAnalyticsId: null,
  googleSiteVerification: null,
  yearsExperience: 10,
  projectsAdvised: 50,
  regionsServed: 3,
  leaderName: null,
  leaderRole: null,
  leaderHeadline: null,
  leaderBio: null,
  leaderPhoto: null,
  leaderPhotoAlt: null,
  leaderCareer: [],
  updatedAt: new Date(0).toISOString(),
};

export function getSettings(): Promise<SiteSettingsDTO> {
  return safeFetch<SiteSettingsDTO>('/public/settings', FALLBACK_SETTINGS, {
    revalidate: 60,
    tags: ['settings'],
  });
}

export function getSitemapData(): Promise<SitemapDataDTO> {
  return safeFetch<SitemapDataDTO>('/public/sitemap', { posts: [], categories: [] }, {
    revalidate: 3600,
    tags: ['posts'],
  });
}

/** URL absoluta del logo (o el archivo estático de respaldo). */
export function logoSrc(settings: SiteSettingsDTO): string {
  return settings.logo?.url ?? '/logo-icgc.png';
}

// ───────────────────────────── Cursos y proyectos ─────────────────────────────

/** Cursos publicados, en el orden del gestor. */
export function getCourses(): Promise<CourseDTO[]> {
  return safeFetch<CourseDTO[]>('/public/courses', [], { tags: ['courses'] });
}

/** Proyectos publicados: alimentan /proyectos, el mapa y las cifras del hero. */
export function getProjects(): Promise<ProjectDTO[]> {
  return safeFetch<ProjectDTO[]>('/public/projects', [], { tags: ['projects'] });
}
