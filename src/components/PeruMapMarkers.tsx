'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type Marcador = {
  id: string;
  region: string;
  /** Posición en % sobre el mapa */
  x: number;
  y: number;
  proyectos: number;
  comunidades: number;
  titulos: string[];
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/**
 * Marcadores encima del mapa (el mapa en sí es SVG del servidor).
 *
 * La tarjeta se abre al pasar el mouse. Para no excluir a nadie también se
 * abre al enfocar el marcador con el teclado y al tocarlo en pantallas
 * táctiles, donde no existe el "hover".
 */
export function PeruMapMarkers({ marcadores }: { marcadores: Marcador[] }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const cierre = useRef<number | null>(null);

  // Pequeño retardo al salir: deja pasar el mouse del pin a la tarjeta sin que se cierre
  const abrir = (id: string) => {
    if (cierre.current) window.clearTimeout(cierre.current);
    setAbierto(id);
  };
  const cerrar = () => {
    if (cierre.current) window.clearTimeout(cierre.current);
    cierre.current = window.setTimeout(() => setAbierto(null), 150);
  };

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(null);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      if (cierre.current) window.clearTimeout(cierre.current);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      {marcadores.map((m) => {
        const activo = abierto === m.id;
        // La tarjeta se abre hacia el lado con más espacio
        const haciaIzquierda = m.x > 55;

        return (
          <div
            key={m.id}
            className={`absolute ${activo ? 'z-30' : 'z-20'}`}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onMouseEnter={() => abrir(m.id)}
            onMouseLeave={cerrar}
            onFocus={() => abrir(m.id)}
            onBlur={cerrar}
          >
            <button
              type="button"
              // Táctil: el toque abre la tarjeta (no hay hover que la abra)
              onClick={() => abrir(m.id)}
              aria-expanded={activo}
              aria-describedby={activo ? `marcador-${m.id}` : undefined}
              aria-label={`${m.region}: ${plural(m.proyectos, 'proyecto', 'proyectos')}`}
              className="group absolute -translate-x-1/2 -translate-y-full"
            >
              {/* Onda que late: llama la atención sobre el marcador */}
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 animate-ping rounded-full bg-rose-500/50 motion-reduce:animate-none"
              />
              <svg
                width="34"
                height="42"
                viewBox="0 0 24 30"
                aria-hidden="true"
                className={`relative drop-shadow-md transition-transform duration-200 ${
                  activo ? '-translate-y-0.5 scale-110' : ''
                }`}
              >
                <path
                  d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 30 12 30s12-9.5 12-18.3C24 5.2 18.6 0 12 0z"
                  fill={activo ? '#1452A3' : '#E11D48'}
                />
                <circle cx="12" cy="11.5" r="4.5" fill="#fff" />
              </svg>
            </button>

            {activo && (
              <div
                id={`marcador-${m.id}`}
                role="tooltip"
                className={`absolute top-2 w-64 animate-fade-up rounded-xl border border-silver-200 bg-white p-5 text-left shadow-card-hover sm:w-72 ${
                  haciaIzquierda ? 'right-4' : 'left-4'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-500">
                  Región
                </p>
                <p className="mt-1 text-lg font-bold text-brand-900">{m.region}</p>

                <dl className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex flex-col rounded-lg bg-brand-50 p-3 text-center">
                    <dt className="text-xs text-slate-500">Proyectos</dt>
                    <dd className="order-first text-2xl font-black text-brand-700">
                      {m.proyectos}
                    </dd>
                  </div>
                  <div className="flex flex-col rounded-lg bg-brand-50 p-3 text-center">
                    <dt className="text-xs text-slate-500">Comunidades</dt>
                    <dd className="order-first text-2xl font-black text-brand-700">
                      {m.comunidades}
                    </dd>
                  </div>
                </dl>

                <ul className="mt-4 space-y-1.5 text-sm leading-snug text-slate-600">
                  {m.titulos.slice(0, 3).map((t) => (
                    <li key={t} className="flex gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/proyectos"
                  className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Ver los proyectos en {m.region} →
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
