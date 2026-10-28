'use client';

import { useRef, useState } from 'react';

type Item = { slug: string; tarjeta: React.ReactNode };

/**
 * Grilla de proyectos (3 columnas × 2 filas por página) con paginación.
 * Cada tarjeta lleva a la página propia del proyecto (/proyectos/<slug>).
 *
 * REGLA SEO: las tarjetas de TODOS los proyectos llegan renderizadas desde el
 * servidor; las que no tocan en la página actual van con `hidden`. Google lee
 * todos los enlaces sin ejecutar JS.
 */
export function ProjectsExplorer({
  items,
  porPagina = 6,
}: {
  items: readonly Item[];
  porPagina?: number;
}) {
  const [pagina, setPagina] = useState(0);
  const grilla = useRef<HTMLDivElement>(null);
  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina));

  function irAPagina(nueva: number) {
    setPagina(Math.min(Math.max(nueva, 0), totalPaginas - 1));
    const nodo = grilla.current;
    if (nodo && nodo.getBoundingClientRect().top < 80) {
      const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      nodo.scrollIntoView({ behavior: suave ? 'smooth' : 'instant', block: 'start' });
    }
  }

  const boton =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <>
      <div ref={grilla} className="grid scroll-mt-24 gap-1 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.slug}
            id={item.slug}
            hidden={Math.floor(i / porPagina) !== pagina}
          >
            {item.tarjeta}
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <nav aria-label="Páginas de proyectos" className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => irAPagina(pagina - 1)}
            disabled={pagina === 0}
            className={`${boton} border-silver-200 bg-white text-brand-800 hover:bg-brand-50`}
          >
            Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => irAPagina(i)}
              aria-current={i === pagina ? 'page' : undefined}
              className={`${boton} ${
                i === pagina
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-silver-200 bg-white text-brand-800 hover:bg-brand-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => irAPagina(pagina + 1)}
            disabled={pagina >= totalPaginas - 1}
            className={`${boton} border-silver-200 bg-white text-brand-800 hover:bg-brand-50`}
          >
            Siguiente
          </button>
        </nav>
      )}
    </>
  );
}
