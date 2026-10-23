'use client';

import { useEffect, useRef, useState } from 'react';

type Desde = 'izquierda' | 'derecha' | 'abajo';

const OCULTO: Record<Desde, string> = {
  izquierda: '-translate-x-12',
  derecha: 'translate-x-12',
  abajo: 'translate-y-10',
};

/**
 * Hace que un bloque entre deslizándose desde un costado cuando aparece en
 * pantalla al bajar.
 *
 * REGLA SEO: el contenido llega visible en el HTML del servidor. Solo después
 * de hidratar, y únicamente si el bloque todavía está fuera de la pantalla, se
 * esconde para animarlo al llegar. Así nunca hay parpadeo arriba del todo, y
 * sin JS (o para Googlebot, que renderiza con una ventana muy alta) se ve normal.
 */
export function Reveal({
  children,
  desde = 'abajo',
  retrasoMs = 0,
  className = '',
}: {
  children: React.ReactNode;
  desde?: Desde;
  retrasoMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Ya visible al cargar: se queda como está
    if (nodo.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setOculto(true);
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        setOculto(false);
        observador.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: oculto ? '0ms' : `${retrasoMs}ms` }}
      className={`transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        oculto ? `opacity-0 ${OCULTO[desde]}` : 'translate-x-0 translate-y-0 opacity-100'
      } ${className}`}
    >
      {children}
    </div>
  );
}
