'use client';

import { useEffect, useRef } from 'react';

export type Stat = {
  valor: number;
  etiqueta: string;
  /** Prefijo fijo que no se anima, p. ej. "+" */
  prefijo?: string;
  /** Sufijo fijo que no se anima, p. ej. "%" */
  sufijo?: string;
};

/** Todas las cifras tardan lo mismo, así terminan juntas aunque sean distintas. */
const DURACION_SEG = 3.5;

/**
 * Cifras animadas con CountUp.js (sección "Quiénes somos" del inicio).
 *
 * REGLA SEO: el número final ya viene escrito en el HTML que renderiza el
 * servidor. CountUp solo lo reemplaza una vez que el componente monta, así que
 * Googlebot lee "10" y no un "0" en blanco, y no hay salto de layout (CLS).
 */
export function StatsCounter({
  stats,
  variante = 'hero',
}: {
  stats: readonly Stat[];
  /** "hero": blanco sobre foto oscura · "tarjetas": 2 × 2 en tarjetas arena sobre fondo claro */
  variante?: 'hero' | 'tarjetas';
}) {
  const tarjetas = variante === 'tarjetas';
  const contenedor = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo) return;

    // Si el visitante pidió menos movimiento, dejamos el número quieto
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sinMovimiento) return;

    const numeros = Array.from(nodo.querySelectorAll<HTMLElement>('[data-contador]'));
    if (numeros.length === 0) return;

    let cancelado = false;
    let cleanupObserver: (() => void) | undefined;
    const instancias: { start: () => void }[] = [];

    // CountUp pesa poco pero no hace falta en el primer render: lo cargamos aparte
    // para no sumarlo al JS que bloquea la pintura inicial.
    void import('countup.js').then(({ CountUp }) => {
      if (cancelado) return;

      for (const nodoNumero of numeros) {
        const destino = Number(nodoNumero.dataset.contador);
        if (!Number.isFinite(destino)) continue;

        const contador = new CountUp(nodoNumero, destino, {
          duration: DURACION_SEG,
          separator: ' ',
          decimal: ',',
          useEasing: true,
        });

        if (contador.error) continue;
        instancias.push(contador);
      }

      // Arrancan al entrar en pantalla, y todas a la vez: así las tres
      // llegan al mismo tiempo aunque una cuente hasta 3 y otra hasta 50.
      const observer = new IntersectionObserver(
        (entradas) => {
          if (!entradas.some((e) => e.isIntersecting)) return;
          for (const instancia of instancias) instancia.start();
          observer.disconnect();
        },
        { threshold: 0.4 },
      );

      observer.observe(nodo);
      cleanupObserver = () => observer.disconnect();
    });

    return () => {
      cancelado = true;
      cleanupObserver?.();
    };
  }, []);

  return (
    <dl
      ref={contenedor}
      className={
        tarjetas
          ? 'grid grid-cols-2 gap-4 sm:gap-5'
          : 'mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-7'
      }
    >
      {stats.map((stat) => (
        <div
          key={stat.etiqueta}
          className={
            tarjetas
              ? 'rounded-2xl border border-dorado/25 bg-arena p-5 shadow-card sm:p-7'
              : undefined
          }
        >
          <dt className="sr-only">{stat.etiqueta}</dt>
          <dd>
            <span
              className={`block font-extrabold ${tarjetas ? 'text-4xl text-brand-900 sm:text-5xl' : 'text-3xl text-white sm:text-4xl'}`}
            >
              {stat.prefijo}
              {/* data-contador guarda el valor real; el texto visible ya es el final */}
              <span data-contador={stat.valor}>{stat.valor}</span>
              {stat.sufijo}
            </span>
            <span
              className={`mt-1.5 block leading-snug ${tarjetas ? 'text-sm font-medium text-texto' : 'text-xs text-brand-200'}`}
            >
              {stat.etiqueta}
            </span>
            {tarjetas && (
              <span aria-hidden="true" className="mt-4 block h-1 w-10 rounded-full bg-dorado" />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
