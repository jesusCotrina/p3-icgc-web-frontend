'use client';

import { useEffect, useState } from 'react';

const MS_POR_LETRA = 28;
const MS_BORRADO = 14;
const PAUSA_MS = 3800;

/**
 * Subtítulo del hero que se escribe letra por letra y va cambiando de frase
 * (se borra y escribe la siguiente, en bucle).
 *
 * REGLA SEO: la primera frase va en el HTML del servidor dentro de un texto
 * solo para lectores y buscadores (sr-only); lo animado es aria-hidden. Todas
 * las frases se apilan invisibles en la misma celda para reservar el alto de
 * la más larga: el texto que se escribe nunca empuja los botones (CLS 0).
 * Con "reducir movimiento" se muestra la primera frase completa y quieta.
 */
export function FrasesRotativas({
  frases,
  inicioMs = 0,
  className = '',
}: {
  frases: readonly string[];
  /** Espera antes de empezar (para que el título termine de escribirse) */
  inicioMs?: number;
  className?: string;
}) {
  const [indice, setIndice] = useState(0);
  const [visibles, setVisibles] = useState(0);
  const [borrando, setBorrando] = useState(false);
  const [arranco, setArranco] = useState(false);
  const [quieto, setQuieto] = useState(false);

  const frase = frases[indice] ?? '';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setQuieto(true);
      return;
    }
    const id = window.setTimeout(() => setArranco(true), inicioMs);
    return () => window.clearTimeout(id);
  }, [inicioMs]);

  useEffect(() => {
    if (!arranco || quieto) return;

    let espera: number;
    if (!borrando && visibles < frase.length) {
      espera = window.setTimeout(() => setVisibles((v) => v + 1), MS_POR_LETRA);
    } else if (!borrando) {
      // Frase completa: pausa y empieza a borrar (si hay más de una)
      if (frases.length < 2) return;
      espera = window.setTimeout(() => setBorrando(true), PAUSA_MS);
    } else if (visibles > 0) {
      espera = window.setTimeout(() => setVisibles((v) => v - 1), MS_BORRADO);
    } else {
      setBorrando(false);
      setIndice((i) => (i + 1) % frases.length);
      return;
    }
    return () => window.clearTimeout(espera);
  }, [arranco, quieto, borrando, visibles, frase.length, frases.length]);

  const texto = quieto ? frases[0] : frase.slice(0, visibles);

  return (
    <p className={className}>
      <span className="sr-only">{frases[0]}</span>
      <span aria-hidden="true" className="grid">
        {/* Reservan el alto de la frase más larga */}
        {frases.map((f) => (
          <span key={f} className="invisible col-start-1 row-start-1">
            {f}
          </span>
        ))}
        <span className="col-start-1 row-start-1">
          {texto}
          {!quieto && arranco && (
            <span className="ml-0.5 inline-block h-[1em] w-[0.08em] translate-y-[0.15em] animate-pulse bg-brand-300" />
          )}
        </span>
      </span>
    </p>
  );
}
