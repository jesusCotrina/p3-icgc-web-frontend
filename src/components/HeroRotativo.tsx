'use client';

import { useEffect, useState } from 'react';
import { Typewriter, type Segmento } from './Typewriter';

const MS_BORRADO = 16;
const PAUSA_MS = 4200;
/** Lo que dura la salida del texto hacia el fondo (.hero-texto-sale en globals.css) */
const SALIDA_MS = 600;

type Fase = 'escribe' | 'muestra' | 'sale' | 'borra';

/**
 * Título y texto del hero, en bucle: el título se escribe letra por letra,
 * al terminar el texto entra desde la izquierda; luego el texto se va hacia
 * el fondo, el título se borra y empieza el siguiente par.
 *
 * La primera vuelta es solo CSS (<Typewriter> + .hero-texto-entra con retraso),
 * así se pinta sin esperar al JS (LCP). Cuando termina y pasa la pausa, este
 * componente toma el control.
 *
 * REGLA SEO: el primer título va completo en un texto solo para lectores y
 * buscadores (sr-only) dentro del <h1>, y el primer texto está en el HTML del
 * servidor. Títulos y textos se apilan invisibles en la misma celda para
 * reservar el alto del más largo (CLS 0). Con "reducir movimiento" queda el
 * primer par, quieto.
 */
export function HeroRotativo({
  titulos,
  textos,
  claseTitulo,
  claseTexto,
  msPorLetra = 35,
  inicioMs = 300,
}: {
  titulos: readonly (readonly Segmento[])[];
  /** Un texto por título, en el mismo orden */
  textos: readonly string[];
  claseTitulo: string;
  claseTexto: string;
  msPorLetra?: number;
  inicioMs?: number;
}) {
  const largos = titulos.map((t) => t.reduce((n, s) => n + Array.from(s.texto).length, 0));
  // El texto entra un instante después de la última letra del título
  const entradaInicialMs = inicioMs + (largos[0] ?? 0) * msPorLetra + 150;

  const [animando, setAnimando] = useState(false);
  const [indice, setIndice] = useState(0);
  const [visibles, setVisibles] = useState(largos[0] ?? 0);
  const [fase, setFase] = useState<Fase>('muestra');

  // Espera a que termine la primera vuelta de CSS y pasa al bucle
  useEffect(() => {
    if (titulos.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => {
      setAnimando(true);
      setFase('sale');
    }, entradaInicialMs + PAUSA_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const largo = largos[indice] ?? 0;
  useEffect(() => {
    if (!animando) return;

    let espera: number;
    if (fase === 'escribe') {
      espera =
        visibles < largo
          ? window.setTimeout(() => setVisibles((v) => v + 1), msPorLetra)
          : window.setTimeout(() => setFase('muestra'), 150);
    } else if (fase === 'muestra') {
      espera = window.setTimeout(() => setFase('sale'), PAUSA_MS);
    } else if (fase === 'sale') {
      espera = window.setTimeout(() => setFase('borra'), SALIDA_MS);
    } else if (visibles > 0) {
      espera = window.setTimeout(() => setVisibles((v) => v - 1), MS_BORRADO);
    } else {
      setIndice((i) => (i + 1) % titulos.length);
      setFase('escribe');
      return;
    }
    return () => window.clearTimeout(espera);
  }, [animando, fase, visibles, largo, msPorLetra, titulos.length]);

  // Recorta los tramos del título actual a las letras visibles, sin perder el resaltado
  let restantes = visibles;
  const parcial = (titulos[indice] ?? []).map((segmento) => {
    const letras = Array.from(segmento.texto);
    const texto = letras.slice(0, Math.max(0, restantes)).join('');
    restantes -= letras.length;
    return { ...segmento, texto };
  });

  // Sin JS (primera vuelta) el texto entra con retraso por CSS
  const claseAnimacionTexto = !animando
    ? 'hero-texto-entra'
    : fase === 'muestra'
      ? 'hero-texto-entra'
      : fase === 'sale'
        ? 'hero-texto-sale'
        : 'opacity-0';

  return (
    <>
      <h1 className={claseTitulo}>
        <span className="sr-only">{(titulos[0] ?? []).map((s) => s.texto).join('')}</span>
        <span aria-hidden="true" className="grid">
          {titulos.map((titulo, t) => (
            <span key={t} className="invisible col-start-1 row-start-1">
              {titulo.map((s) => s.texto).join('')}
            </span>
          ))}
          <span className="col-start-1 row-start-1">
            {animando ? (
              parcial.map((segmento, s) => {
                const ultimo = s === parcial.length - 1;
                const letras = Array.from(segmento.texto);
                return (
                  <span key={s} className={segmento.className}>
                    {ultimo ? letras.slice(0, -1).join('') : segmento.texto}
                    {/* La última letra y el cursor juntos: el cursor no baja solo de línea */}
                    {ultimo && (
                      <span className="whitespace-nowrap">
                        {letras.at(-1)}
                        <span className="ml-[0.08em] inline-block h-[0.85em] w-[0.07em] translate-y-[0.04em] animate-pulse bg-brand-300" />
                      </span>
                    )}
                  </span>
                );
              })
            ) : (
              <Typewriter segmentos={titulos[0] ?? []} msPorLetra={msPorLetra} inicioMs={inicioMs} />
            )}
          </span>
        </span>
      </h1>

      <p className={`grid ${claseTexto}`}>
        {textos.map((texto) => (
          <span key={texto} aria-hidden="true" className="invisible col-start-1 row-start-1">
            {texto}
          </span>
        ))}
        {/* La key reinicia la animación de entrada en cada vuelta */}
        <span
          key={`${indice}-${animando ? fase : 'css'}`}
          className={`col-start-1 row-start-1 ${claseAnimacionTexto}`}
          style={animando ? undefined : ({ '--d': `${entradaInicialMs}ms` } as React.CSSProperties)}
        >
          {textos[indice] ?? textos[0]}
        </span>
      </p>
    </>
  );
}
