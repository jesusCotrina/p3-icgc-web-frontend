'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

/** `credito`: autor y licencia. No se muestra sobre la foto: se publica en /creditos. */
export type HeroSlide = { src: string; alt: string; credito?: string };

/**
 * Fondo rotativo del hero (fundido entre imágenes) con puntitos de navegación.
 *
 * REGLA SEO: el texto del hero (h1, botones) NO vive aquí, lo renderiza el
 * servidor encima de este componente. Solo la primera imagen lleva `priority`
 * porque es el LCP; las demás cargan después y no compiten con ella.
 */
export function HeroSlider({
  slides,
  intervalMs = 6000,
}: {
  slides: readonly HeroSlide[];
  intervalMs?: number;
}) {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Si el visitante pidió menos movimiento, arranca en pausa
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPausado(true);
  }, []);

  // `actual` en las dependencias: al elegir un puntito el temporizador se reinicia
  useEffect(() => {
    if (pausado || slides.length < 2) return;
    const id = window.setTimeout(() => setActual((i) => (i + 1) % slides.length), intervalMs);
    return () => window.clearTimeout(id);
  }, [actual, pausado, slides.length, intervalMs]);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === actual ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-14 z-20 flex items-center justify-center gap-2.5 lg:bottom-16">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActual(i)}
              aria-label={`Ver imagen ${i + 1} de ${slides.length}`}
              aria-current={i === actual ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === actual ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => setPausado((p) => !p)}
            aria-label={pausado ? 'Reanudar el carrusel' : 'Pausar el carrusel'}
            className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {pausado ? <path d="M7 4v16l13-8z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
