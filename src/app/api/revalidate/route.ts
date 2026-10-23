import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/** Etiquetas que usan los fetch de src/lib/api.ts. Cualquier otra se ignora. */
const TAGS_PERMITIDAS = new Set(['posts', 'categories', 'courses', 'projects', 'settings']);

/**
 * El backend llama aquí cada vez que el gestor publica o edita algo.
 *
 * SEO: invalida solo los datos afectados y Next regenera las páginas que los
 * usan en la siguiente visita. Google ve el contenido nuevo al instante en
 * vez de esperar el ISR de 5 minutos.
 */
export async function POST(request: NextRequest) {
  const secreto = process.env.REVALIDATE_SECRET;
  if (!secreto || request.headers.get('x-revalidate-secret') !== secreto) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string' && TAGS_PERMITIDAS.has(t))
    : [];

  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ revalidated: tags });
}
