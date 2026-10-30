import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Pagina 404. Next la sirve con status 404 real, que es lo que Google
 * necesita para dejar de rastrear la URL. Va con noindex y ofrece salidas
 * hacia las secciones principales para no perder al visitante.
 */
export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="container-icgc flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl font-black text-brand-200">404</p>
      <h1 className="mt-5 text-balance text-3xl sm:text-4xl">
        No Encontramos la Página que Buscas
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        Puede que el enlace haya cambiado o que la página ya no exista. Te dejamos algunos caminos
        de vuelta.
      </p>

      <nav aria-label="Enlaces de recuperación" className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
        <Link href="/blog" className="btn-secondary">
          Ir al blog
        </Link>
        <Link href="/cursos" className="btn-secondary">
          Ver los cursos
        </Link>
      </nav>
    </section>
  );
}
