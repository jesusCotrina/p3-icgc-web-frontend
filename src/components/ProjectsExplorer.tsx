'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Item = { slug: string; tarjeta: React.ReactNode; ficha: React.ReactNode };

const DURACION_MS = 500;
const CURVA = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Grilla de proyectos (3 columnas × 2 filas por página) con ficha de detalle.
 *
 * Al hacer clic en una tarjeta, esa tarjeta sube al primer lugar, su ficha
 * completa aparece a la derecha ocupando las otras dos columnas y el resto de
 * tarjetas baja. Las tarjetas se deslizan hasta su nuevo lugar (técnica FLIP).
 * Por debajo de xl (2 columnas) la ficha ocupa todo el ancho y trae su propia foto.
 *
 * REGLA SEO: las tarjetas y las fichas de TODOS los proyectos llegan
 * renderizadas desde el servidor; las que no tocan en la página actual van con
 * `hidden`. Google lee cada proyecto completo sin ejecutar JS.
 */
export function ProjectsExplorer({
  items,
  porPagina = 6,
}: {
  items: readonly Item[];
  porPagina?: number;
}) {
  const [pagina, setPagina] = useState(0);
  const [elegido, setElegido] = useState<string | null>(null);
  const grilla = useRef<HTMLDivElement>(null);
  const posiciones = useRef(new Map<string, DOMRect>());
  const desplazar = useRef(false);

  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina));
  const enPagina = items.slice(pagina * porPagina, (pagina + 1) * porPagina);
  const fuera = items.filter((item) => !enPagina.includes(item));
  const actual = enPagina.find((item) => item.slug === elegido) ?? null;
  // La elegida va primero; el resto conserva su orden
  const orden = actual ? [actual, ...enPagina.filter((item) => item !== actual)] : enPagina;

  /** Foto de dónde está cada tarjeta antes del cambio (la "F" de FLIP). */
  const recordarPosiciones = () => {
    posiciones.current.clear();
    grilla.current?.querySelectorAll<HTMLElement>('[data-proyecto]').forEach((nodo) => {
      if (!nodo.hidden) posiciones.current.set(nodo.dataset.proyecto!, nodo.getBoundingClientRect());
    });
  };

  const elegir = useCallback(
    (slug: string | null, conAnimacion = true) => {
      if (conAnimacion) recordarPosiciones();
      if (slug) {
        const indice = items.findIndex((item) => item.slug === slug);
        if (indice < 0) return;
        setPagina(Math.floor(indice / porPagina));
      }
      setElegido(slug);
      desplazar.current = true;
      // El ancla queda en la URL para compartir el proyecto, sin salto del navegador
      const url = slug ? `#${slug}` : window.location.pathname;
      window.history.replaceState(null, '', url);
    },
    [items, porPagina],
  );

  // Llegada con /proyectos#slug (desde las tarjetas del inicio)
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (slug && items.some((item) => item.slug === slug)) elegir(slug, false);
  }, [items, elegir]);

  // Cada tarjeta se desliza de su lugar anterior al nuevo (la "LIP" de FLIP)
  useLayoutEffect(() => {
    const anteriores = posiciones.current;
    if (!anteriores.size) return;
    posiciones.current = new Map();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    grilla.current?.querySelectorAll<HTMLElement>('[data-proyecto]').forEach((nodo) => {
      const antes = anteriores.get(nodo.dataset.proyecto!);
      if (!antes || nodo.hidden) return;
      const ahora = nodo.getBoundingClientRect();
      const dx = antes.left - ahora.left;
      const dy = antes.top - ahora.top;
      if (!dx && !dy) return;
      nodo.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: DURACION_MS, easing: CURVA },
      );
    });
  }, [elegido, pagina]);

  // Lleva la vista al inicio de la grilla, donde quedó la tarjeta elegida
  useEffect(() => {
    if (!desplazar.current) return;
    desplazar.current = false;
    const nodo = grilla.current;
    if (!nodo) return;
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (nodo.getBoundingClientRect().top < 80 || nodo.getBoundingClientRect().top > window.innerHeight * 0.4) {
      nodo.scrollIntoView({ behavior: suave ? 'smooth' : 'instant', block: 'start' });
    }
  }, [elegido, pagina]);

  function alHacerClic(event: React.MouseEvent) {
    const objetivo = event.target as HTMLElement;

    if (objetivo.closest('[data-cerrar-ficha]')) {
      elegir(null);
      return;
    }

    const tarjeta = objetivo.closest<HTMLElement>('[data-proyecto]');
    const slug = tarjeta?.dataset.proyecto;
    if (!slug) return;
    // Los enlaces externos (WhatsApp) siguen su camino
    const enlace = objetivo.closest('a');
    if (enlace && !enlace.getAttribute('href')?.includes('#')) return;

    event.preventDefault();
    if (slug !== elegido) elegir(slug);
  }

  function irAPagina(nueva: number) {
    setElegido(null);
    setPagina(nueva);
    desplazar.current = true;
    window.history.replaceState(null, '', window.location.pathname);
  }

  // Una sola lista con claves: React mueve los nodos en vez de recrearlos
  const nodos: React.ReactNode[] = [];
  for (const item of orden) {
    const esElegido = item === actual;
    nodos.push(
      <div
        key={item.slug}
        id={item.slug}
        data-proyecto={item.slug}
        // La elegida se esconde en pantallas chicas: su ficha ya trae la foto
        className={`scroll-mt-24 cursor-pointer rounded-2xl ${
          esElegido ? 'hidden ring-2 ring-brand-600 ring-offset-4 xl:block' : ''
        }`}
      >
        {item.tarjeta}
      </div>,
    );
    // Ficha de la elegida: justo después de su tarjeta, a lo ancho de dos columnas
    if (esElegido) {
      nodos.push(
        <div key={`ficha-${item.slug}`} className="animate-fade-up sm:col-span-2">
          {item.ficha}
        </div>,
      );
    }
  }
  for (const item of items) {
    if (item !== actual) {
      nodos.push(
        <div key={`ficha-${item.slug}`} hidden>
          {item.ficha}
        </div>,
      );
    }
  }
  for (const item of fuera) {
    nodos.push(
      <div key={item.slug} id={item.slug} data-proyecto={item.slug} hidden>
        {item.tarjeta}
      </div>,
    );
  }

  const boton =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <>
      {/* El clic se escucha aquí: las tarjetas siguen siendo Server Components */}
      <div
        ref={grilla}
        onClick={alHacerClic}
        className="grid scroll-mt-24 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {nodos}
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
              aria-label={`Página ${i + 1}`}
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
