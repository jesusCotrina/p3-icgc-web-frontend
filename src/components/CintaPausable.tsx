'use client';

import { useState } from 'react';

/**
 * Envuelve una cinta animada: un clic la detiene y otro la reanuda.
 * El contenido llega ya renderizado desde el servidor (children), así que los
 * logos siguen en el HTML; aquí solo se agrega el estado de pausa.
 * El botón (visible al enfocarlo con el teclado) da la misma pausa sin mouse.
 */
export function CintaPausable({
  etiqueta,
  className = '',
  children,
}: {
  /** Nombre de la cinta para el botón de pausa, p. ej. "logos de empresas mineras" */
  etiqueta: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pausada, setPausada] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setPausada((p) => !p)}
        data-pausada={pausada || undefined}
        className={`cursor-pointer [&[data-pausada]_ul]:[animation-play-state:paused] ${className}`}
      >
        {children}
      </div>
      <button
        type="button"
        aria-pressed={pausada}
        onClick={() => setPausada((p) => !p)}
        className="sr-only rounded-md bg-white px-3 py-1 text-xs font-semibold text-brand-800 shadow focus:not-sr-only focus:absolute focus:right-0 focus:top-full focus:mt-2"
      >
        {pausada ? `Reanudar ${etiqueta}` : `Pausar ${etiqueta}`}
      </button>
    </div>
  );
}
