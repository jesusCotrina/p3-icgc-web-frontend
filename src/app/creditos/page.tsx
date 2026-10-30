import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCourses, getPosts, getProjects, getSettings } from '@/lib/api';
import { CREDITOS_FIJOS } from '@/lib/creditos';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return buildMetadata({
    title: 'Créditos de las fotos | ICGC',
    description:
      'Autores y licencias de las fotografías que usa el sitio del Instituto de Capacitación en ' +
      'Gestión Comunal, en su mayoría publicadas con licencias Creative Commons.',
    path: '/creditos',
    settings,
    // Página legal: Google no la necesita en el índice, pero sí sigue sus enlaces
    noindex: true,
  });
}

type Fila = { clave: string; imagen: string; alt: string; dondeSeUsa: string; credito: string; original?: string };

/**
 * Atribución de las fotos con licencia Creative Commons.
 *
 * Para el SEO el crédito no aporta nada; lo exige la licencia. Se junta aquí
 * para no ensuciar las fotos del sitio. Las fotos subidas desde el gestor
 * aparecen solas si tienen su crédito (caption) cargado en Multimedia.
 */
export default async function CreditosPage() {
  const [cursos, proyectos, { items: articulos }] = await Promise.all([
    getCourses(),
    getProjects(),
    getPosts({ pageSize: 50 }),
  ]);

  const filas: Fila[] = CREDITOS_FIJOS.map((c) => ({
    clave: c.imagen,
    imagen: c.imagen,
    alt: '',
    dondeSeUsa: c.dondeSeUsa,
    credito: `${c.autor}, ${c.licencia}, Wikimedia Commons`,
    original: c.original,
  }));

  const desdeGestor = [
    ...proyectos.map((p) => ({ media: p.coverImage, donde: `Proyecto: ${p.title}` })),
    ...cursos.map((c) => ({ media: c.coverImage, donde: `Curso: ${c.name}` })),
    ...articulos.map((a) => ({ media: a.coverImage, donde: `Artículo: ${a.title}` })),
  ];
  for (const { media, donde } of desdeGestor) {
    if (!media?.caption) continue;
    // Una misma foto puede usarse en varios lugares: se lista una vez
    const existente = filas.find((f) => f.clave === media.id);
    if (existente) {
      existente.dondeSeUsa += ` · ${donde}`;
      continue;
    }
    filas.push({
      clave: media.id,
      imagen: media.url,
      alt: '',
      dondeSeUsa: donde,
      credito: media.caption.replace(/^Foto:\s*/, ''),
    });
  }

  return (
    <section className="container-icgc pb-16 pt-8 lg:pt-10">
      <h1 className="text-3xl font-extrabold">Créditos de las Fotos</h1>
      <p className="mt-3 max-w-2xl text-pretty text-slate-600">
        Agradecemos a los autores que comparten sus fotografías con licencias libres. Estas son las
        imágenes que usamos en el sitio, con su autor y su licencia.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {filas.map((fila) => (
          <li key={fila.clave} className="card flex gap-4 p-4">
            <Image
              src={fila.imagen}
              // Miniatura decorativa: el texto de al lado ya identifica la foto
              alt={fila.alt}
              width={112}
              height={80}
              sizes="112px"
              className="h-20 w-28 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-brand-900">{fila.credito}</p>
              <p className="mt-1 text-slate-600">{fila.dondeSeUsa}</p>
              {fila.original && (
                <a
                  href={fila.original}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-brand-600 hover:underline"
                >
                  Ver la foto original en Wikimedia Commons
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Link href="/" className="btn-secondary mt-10">
        Volver al inicio
      </Link>
    </section>
  );
}
