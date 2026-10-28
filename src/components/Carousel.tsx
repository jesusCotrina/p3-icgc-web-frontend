'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';

/** Ancho por defecto de cada diapositiva: 1 en móvil, 2 en tablet, 3 en escritorio. */
const ANCHO_POR_DEFECTO = 'w-[85%] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]';

/** Máximo de tarjetas visibles a la vez en cualquier pantalla (para el bucle). */
const MAX_VISIBLES = 4;

/**
 * Carrusel horizontal con scroll-snap.
 *
 * REGLA SEO: todas las diapositivas están en el HTML del servidor (los
 * `children` son Server Components). El JS solo mueve el scroll y pinta los
 * puntitos, así que Googlebot lee el contenido completo aunque no lo deslice.
 * Sin JS, el carrusel sigue funcionando deslizando con el dedo.
 *
 * Con `autoplayMs` avanza solo en bucle infinito: repite las diapositivas
 * (las copias van con aria-hidden y fuera del orden de tabulación, así no se
 * duplican para lectores de pantalla ni para el teclado, pero se pueden tocar
 * con el mouse porque a veces son las que están a la vista) y al llegar a la copia salta sin animación al
 * original, de modo que nunca "rebobina" ni se queda quieto aunque todas las
 * tarjetas entren en pantalla.
 */
export function Carousel({
  label,
  children,
  autoplayMs,
  itemClassName = ANCHO_POR_DEFECTO,
  flechas = true,
  espacio = 'gap-6',
  flechasLaterales = false,
}: {
  label: string;
  children: React.ReactNode;
  /** Si se indica, avanza solo cada N ms, en bucle. */
  autoplayMs?: number;
  /** Ancho de cada diapositiva (clases de Tailwind) */
  itemClassName?: string;
  /** false: sin botones anterior/siguiente (quedan los puntitos y el deslizamiento) */
  flechas?: boolean;
  /** Separación entre diapositivas (clase de Tailwind; el ancho de cada una debe descontarla) */
  espacio?: string;
  /** Flechas a los costados de las tarjetas (y puntitos más chicos abajo) */
  flechasLaterales?: boolean;
}) {
  const pista = useRef<HTMLUListElement>(null);
  const originales = Children.toArray(children);
  const n = originales.length;
  const enBucle = Boolean(autoplayMs) && n > 1;

  // Las copias del bucle se agregan recién en el navegador: el HTML del
  // servidor lleva cada tarjeta una sola vez (más liviano, carga más rápido)
  // y Google lee igual todas las originales.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // Copias suficientes para que, estando en la última original, siempre haya
  // tarjetas a la derecha que mostrar
  const copias = enBucle && montado ? Math.max(2, Math.ceil(MAX_VISIBLES / n) + 1) : 1;
  const slides = Array.from({ length: copias }, () => originales).flat();

  const [actual, setActual] = useState(0);
  const [paginas, setPaginas] = useState(n);
  const [enPausa, setEnPausa] = useState(false);
  const indiceCrudo = useRef(0);
  const finDeScroll = useRef<number | null>(null);

  /** Ancho de una diapositiva + el espacio entre ellas. */
  const paso = useCallback(() => {
    const nodo = pista.current;
    const primera = nodo?.firstElementChild as HTMLElement | null;
    if (!nodo || !primera) return 0;
    const gap = parseFloat(getComputedStyle(nodo).columnGap) || 0;
    return primera.offsetWidth + gap;
  }, []);

  const medir = useCallback(() => {
    const nodo = pista.current;
    const ancho = paso();
    if (!nodo || !ancho) return;

    const indice = Math.round(nodo.scrollLeft / ancho);
    indiceCrudo.current = indice;

    if (enBucle) {
      setPaginas(n);
      setActual(indice % n);
      return;
    }
    // Sin bucle: cuántas "paradas" hay según cuántas tarjetas entran a la vez
    const visibles = Math.max(1, Math.round((nodo.clientWidth + 1) / ancho));
    const total = Math.max(1, n - visibles + 1);
    setPaginas(total);
    setActual(Math.min(indice, total - 1));
  }, [paso, n, enBucle]);

  // Al terminar de desplazarse dentro de las copias, salta al original equivalente
  const alDesplazar = () => {
    medir();
    if (!enBucle) return;
    if (finDeScroll.current) window.clearTimeout(finDeScroll.current);
    finDeScroll.current = window.setTimeout(() => {
      const nodo = pista.current;
      const ancho = paso();
      if (!nodo || !ancho) return;
      const indice = Math.round(nodo.scrollLeft / ancho);
      if (indice >= n) nodo.scrollTo({ left: (indice % n) * ancho, behavior: 'instant' });
    }, 150);
  };

  // Las copias se ven y se pueden clicar, pero el Tab no debe pasar por ellas
  useEffect(() => {
    pista.current
      ?.querySelectorAll<HTMLElement>(
        '[data-copia] a, [data-copia] button, [data-copia] [tabindex]',
      )
      .forEach((el) => el.setAttribute('tabindex', '-1'));
  }, [copias, n]);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => {
      window.removeEventListener('resize', medir);
      if (finDeScroll.current) window.clearTimeout(finDeScroll.current);
    };
  }, [medir]);

  const desplazarA = useCallback(
    (indice: number) => {
      const nodo = pista.current;
      if (!nodo) return;
      // Con "reducir movimiento" el salto es instantáneo, pero el carrusel sigue avanzando
      const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      nodo.scrollTo({ left: indice * paso(), behavior: suave ? 'smooth' : 'instant' });
    },
    [paso],
  );

  const siguiente = useCallback(() => {
    if (enBucle) return desplazarA(indiceCrudo.current + 1);
    desplazarA(actual >= paginas - 1 ? 0 : actual + 1);
  }, [enBucle, desplazarA, actual, paginas]);

  const anterior = () => {
    if (!enBucle) return desplazarA(Math.max(0, actual - 1));
    const nodo = pista.current;
    const ancho = paso();
    // Desde la primera: salta a su copia y retrocede desde ahí
    if (nodo && indiceCrudo.current === 0) {
      nodo.scrollTo({ left: n * ancho, behavior: 'instant' });
      indiceCrudo.current = n;
    }
    desplazarA(indiceCrudo.current - 1);
  };

  useEffect(() => {
    if (!autoplayMs || enPausa || n < 2) return;
    const id = window.setInterval(siguiente, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, enPausa, n, siguiente]);

  const flecha =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-silver-200 bg-white text-brand-800 shadow-card transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40';

  const botonAnterior = (clase: string) => (
    <button
      type="button"
      onClick={anterior}
      disabled={!enBucle && actual === 0}
      aria-label="Anterior"
      className={clase}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );

  const botonSiguiente = (clase: string) => (
    <button
      type="button"
      onClick={siguiente}
      disabled={!enBucle && actual >= paginas - 1}
      aria-label="Siguiente"
      className={clase}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  );

  // Flechas laterales: flotan sobre el borde de la pista, centradas en alto.
  // En celular se ocultan (se desliza con el dedo y quedan los puntitos).
  const lateral =
    'absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-silver-200 bg-white text-brand-800 shadow-card-hover transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex';

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      // Solo se pausa mientras el mouse está encima (o con foco de teclado):
      // un clic en un puntito no lo deja detenido para siempre
      onMouseEnter={() => setEnPausa(true)}
      onMouseLeave={() => setEnPausa(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setEnPausa(true)}
      onBlur={() => setEnPausa(false)}
    >
      {/* Con flechas laterales, una franja a cada lado: las flechas viven ahí
          y nunca tapan las tarjetas */}
      <div className={`relative ${flechasLaterales ? 'sm:px-14' : ''}`}>
        {/* relative: los textos ocultos (sr-only, position: absolute) de las
            tarjetas quedan anclados a la pista y recortados por ella; si no, se
            anclan al contenedor con transform (Reveal) y ensanchan la página */}
        <ul
          ref={pista}
          onScroll={alDesplazar}
          className={`scrollbar-none relative -mx-4 flex snap-x snap-mandatory ${espacio} overflow-x-auto px-4 pb-4 pt-1 sm:mx-0 sm:px-0`}
        >
          {slides.map((slide, i) => {
            const copia = i >= n;
            return (
              <li
                key={i}
                aria-roledescription={copia ? undefined : 'diapositiva'}
                aria-label={copia ? undefined : `${i + 1} de ${n}`}
                aria-hidden={copia || undefined}
                data-copia={copia || undefined}
                className={`shrink-0 snap-start ${itemClassName}`}
              >
                {slide}
              </li>
            );
          })}
        </ul>

        {flechas && flechasLaterales && paginas > 1 && (
          <>
            {botonAnterior(`${lateral} left-1`)}
            {botonSiguiente(`${lateral} right-1`)}
          </>
        )}
      </div>

      {paginas > 1 && (
        <div className={`flex items-center justify-center gap-4 ${flechasLaterales ? 'mt-3' : 'mt-6'}`}>
          {flechas && !flechasLaterales && botonAnterior(flecha)}

          <div className={`flex items-center ${flechasLaterales ? 'gap-1.5' : 'gap-2'}`}>
            {Array.from({ length: paginas }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => desplazarA(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                aria-current={i === actual ? 'true' : undefined}
                className={`rounded-full transition-all duration-300 ${
                  flechasLaterales
                    ? i === actual
                      ? 'h-1.5 w-5 bg-brand-600'
                      : 'h-1.5 w-1.5 bg-brand-200 hover:bg-brand-300'
                    : i === actual
                      ? 'h-2.5 w-8 bg-brand-600'
                      : 'h-2.5 w-2.5 bg-brand-200 hover:bg-brand-300'
                }`}
              />
            ))}
          </div>

          {flechas && !flechasLaterales && botonSiguiente(flecha)}
        </div>
      )}
    </div>
  );
}
