'use client';

import { useEffect } from 'react';

/** Bloques que no se animan: no se ven o no son contenido. */
const IGNORAR = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK']);

/**
 * Busca las "piezas" de un bloque: si el bloque es solo un envoltorio (un único
 * hijo, como el div.container-icgc), baja un nivel. Los contenedores marcados
 * con data-revelar-hijos (grillas de tarjetas) aportan cada tarjeta por separado.
 */
function piezas(nodo: Element, profundidad = 0): HTMLElement[] {
  const hijos = Array.from(nodo.children).filter(
    (h): h is HTMLElement => h instanceof HTMLElement && !IGNORAR.has(h.tagName) && !h.hidden,
  );
  if (hijos.length === 1 && profundidad < 3) return piezas(hijos[0]!, profundidad + 1);
  return hijos.flatMap((h) =>
    h.hasAttribute('data-revelar-hijos')
      ? Array.from(h.children).filter((x): x is HTMLElement => x instanceof HTMLElement)
      : [h],
  );
}

/**
 * Misma animación de aparición que el inicio (Reveal), aplicada sola a todos
 * los bloques de la página: entran suaves desde abajo al bajar con el scroll.
 *
 * REGLA SEO: no renderiza nada ni cambia el HTML del servidor. Solo después de
 * hidratar esconde lo que todavía está fuera de pantalla y lo muestra al
 * llegar; lo visible al cargar no se toca (sin parpadeo, sin CLS). Sin JS o
 * para Googlebot, todo se ve normal. Respeta "reducir movimiento".
 */
export function AutoReveal() {
  useEffect(() => {
    const main = document.getElementById('contenido');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const pendientes: HTMLElement[] = [];
    for (const bloque of Array.from(main.children)) {
      piezas(bloque).forEach((pieza, i) => {
        if (pieza.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        pieza.classList.add('revelar', 'revelar-oculto');
        // Desfase corto entre piezas del mismo bloque (máx. 0,5 s)
        pieza.style.transitionDelay = `${Math.min(i, 4) * 110}ms`;
        pendientes.push(pieza);
      });
    }
    if (!pendientes.length) return;

    const temporizadores: number[] = [];
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const nodo = entrada.target as HTMLElement;
          observador.unobserve(nodo);
          nodo.classList.remove('revelar-oculto');
          // Al terminar se limpia todo: sin transform residual (sticky, FLIP)
          temporizadores.push(
            window.setTimeout(() => {
              nodo.classList.remove('revelar');
              nodo.style.transitionDelay = '';
            }, 1600),
          );
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    pendientes.forEach((nodo) => observador.observe(nodo));

    return () => {
      observador.disconnect();
      temporizadores.forEach((t) => window.clearTimeout(t));
      pendientes.forEach((nodo) => {
        nodo.classList.remove('revelar', 'revelar-oculto');
        nodo.style.transitionDelay = '';
      });
    };
  }, []);

  return null;
}
