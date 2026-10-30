import { unstable_noStore as noStore } from 'next/cache';
import { API_CONFIGURADA, API_SERVER_URL, SITE_URL } from './entorno';
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

// Las URLs (local, Docker o Vercel) se resuelven en lib/entorno.ts
export { SITE_URL };

/** Si el backend no responde en este tiempo, la página sigue con datos vacíos. */
const TIMEOUT_MS = 8000;

/** Revalidación por defecto: 5 minutos. HTML cacheado = LCP bajo = mejor ranking. */
const DEFAULT_REVALIDATE = 300;

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE, tags } = options;

  if (!API_CONFIGURADA) {
    throw new ApiError('NEXT_PUBLIC_API_URL no está configurada en Vercel', 503);
  }

  const res = await fetch(`${API_SERVER_URL}/api${path}`, {
    headers: { Accept: 'application/json' },
    // Sin esto, un backend que no contesta deja colgado el build de Vercel
    signal: AbortSignal.timeout(TIMEOUT_MS),
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

/** Rutas que ya avisaron: una línea por ruta, no un stack trace por cada llamada. */
const avisadas = new Set<string>();

function avisar(path: string, error: unknown) {
  if (!API_CONFIGURADA) {
    if (avisadas.has('*')) return;
    avisadas.add('*');
    console.warn(
      '[api] La web corre en Vercel pero NEXT_PUBLIC_API_URL apunta a localhost o no existe. ' +
        'Configúrala en Vercel → Settings → Environment Variables con la URL pública del backend ' +
        '(https://...) y vuelve a desplegar. Mientras tanto las páginas salen sin contenido.',
    );
    return;
  }
  if (avisadas.has(path)) return;
  avisadas.add(path);
  const causa =
    error instanceof Error
      ? ((error.cause as Error | undefined)?.message ?? error.message)
      : String(error);
  console.warn(`[api] No se pudo leer ${path} desde ${API_SERVER_URL}: ${causa}`);
}

/**
 * Variante tolerante: si la API está caída, la página igual se renderiza.
 * Un 500 global sería mucho peor para el SEO que una sección vacía.
 *
 * Además, una respuesta de reserva NO se guarda en caché (noStore): la página
 * se renderiza en cada visita hasta que el backend vuelva, en vez de quedar
 * vacía durante horas por el ISR. Si pasa al revalidar una página que ya tenía
 * contenido, Next conserva la versión anterior.
 */
async function safeFetch<T>(path: string, fallback: T, options?: FetchOptions): Promise<T> {
  try {
    return await apiFetch<T>(path, options);
  } catch (error) {
    avisar(path, error);
    // Sin try/catch: Next usa la excepción interna de noStore para saber que
    // la página no debe guardarse. Fuera de un render no hace nada.
    noStore();
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
    // Solo un 404 real del backend es "el artículo no existe"
    if (error instanceof ApiError && error.status === 404) return null;
    // Backend caído: NO responder 404 (Google desindexaría el artículo). Se
    // lanza el error: Next sigue sirviendo la última versión buena del
    // artículo y, si no la hay, responde un error temporal (5xx), que Google
    // vuelve a intentar más tarde.
    avisar(`/public/posts/${slug}`, error);
    throw error;
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
  leaderEducation: [],
  updatedAt: new Date(0).toISOString(),
};

export async function getSettings(): Promise<SiteSettingsDTO> {
  const settings = await safeFetch<SiteSettingsDTO>('/public/settings', FALLBACK_SETTINGS, {
    revalidate: 60,
    tags: ['settings'],
  });
  // Una API anterior no envía la formación del líder
  return {
    ...settings,
    leaderCareer: settings.leaderCareer ?? [],
    leaderEducation: settings.leaderEducation ?? [],
  };
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

/** Igual que getPost: null solo con un 404 real; si el backend cae, se lanza el error. */
export async function getCourse(slug: string): Promise<CourseDTO | null> {
  try {
    return await apiFetch<CourseDTO>(`/public/courses/${encodeURIComponent(slug)}`, {
      tags: ['courses'],
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    avisar(`/public/courses/${slug}`, error);
    throw error;
  }
}

/**
 * Completa los campos nuevos de un proyecto: una API anterior (o un proyecto
 * viejo) puede no enviarlos, y la página no debe romperse por eso.
 */
const normalizarProyecto = (p: ProjectDTO): ProjectDTO => ({
  ...p,
  company: p.company ?? '',
  items: Array.isArray(p.items) ? p.items : [],
  achievements: p.achievements ?? [],
});

/** Proyectos publicados: alimentan /proyectos, el mapa y las cifras del hero. */
export async function getProjects(): Promise<ProjectDTO[]> {
  const proyectos = await safeFetch<ProjectDTO[]>('/public/projects', [], { tags: ['projects'] });
  return proyectos.map(normalizarProyecto);
}

/** Igual que getPost: null solo con un 404 real; si el backend cae, se lanza el error. */
export async function getProject(slug: string): Promise<ProjectDTO | null> {
  try {
    const proyecto = await apiFetch<ProjectDTO>(`/public/projects/${encodeURIComponent(slug)}`, {
      tags: ['projects'],
    });
    return normalizarProyecto(proyecto);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    avisar(`/public/projects/${slug}`, error);
    throw error;
  }
}

/** Los proyectos de muestra no se indexan: serían páginas de relleno para Google. */
export const esProyectoDeEjemplo = (p: { title: string }) => /^proyecto de ejemplo/i.test(p.title);
