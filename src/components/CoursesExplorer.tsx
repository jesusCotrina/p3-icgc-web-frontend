'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Ficha = { slug: string; contenido: React.ReactNode };

/** Solo slugs limpios: se usan dentro de un selector CSS. */
const SLUG_VALIDO = /^[a-z0-9-]+$/;

/**
 * Une el carrusel de cursos con la ficha de detalle que va debajo.
 *
 * Al hacer clic en una tarjeta (o en su "Ver detalle") se muestra la ficha de
 * ese curso, la página baja hasta ella y la resalta. Al elegir otra tarjeta la
 * ficha se reemplaza. El enlace de WhatsApp de cada tarjeta sigue funcionando.
 *
 * REGLA SEO: todas las fichas vienen renderizadas desde el servidor (las que
 * no están elegidas van con `hidden`), así Google lee el detalle de cada curso
 * sin ejecutar JS. Este componente solo decide cuál se ve.
 */
export function CoursesExplorer({
  carrusel,
  fichas,
}: {
  carrusel: React.ReactNode;
  fichas: readonly Ficha[];
}) {
  const [actual, setActual] = useState<string | null>(fichas[0]?.slug ?? null);
  // Cambia en cada selección: dispara el desplazamiento y el resaltado
  const [seleccion, setSeleccion] = useState(0);
  const zona = useRef<HTMLDivElement>(null);

  const abrir = useCallback(
    (slug: string) => {
      if (!fichas.some((f) => f.slug === slug)) return;
      setActual(slug);
      setSeleccion((n) => n + 1);
      // El ancla queda en la URL para compartir el curso, sin saltos del navegador
      window.history.replaceState(null, '', `#${slug}`);
    },
    [fichas],
  );

  // Llegada con /cursos#slug (por ejemplo, desde el inicio)
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    if (slug) abrir(slug);
  }, [abrir]);

  // Baja hasta la ficha, le pasa el foco y la resalta
  useEffect(() => {
    if (!seleccion || !actual) return;
    const ficha = zona.current?.querySelector<HTMLElement>(`[data-ficha="${actual}"]`);
    if (!ficha) return;

    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ficha.scrollIntoView({ behavior: suave ? 'smooth' : 'instant', block: 'start' });
    ficha.focus({ preventScroll: true });
    if (suave) {
      ficha.animate(
        [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }
  }, [seleccion, actual]);

  function alHacerClic(event: React.MouseEvent) {
    const objetivo = event.target as HTMLElement;
    const tarjeta = objetivo.closest<HTMLElement>('[data-curso]');
    const slug = tarjeta?.dataset.curso;
    if (!slug) return;

    // WhatsApp y cualquier otro enlace externo siguen su camino
    const enlace = objetivo.closest('a');
    if (enlace && !enlace.getAttribute('href')?.startsWith('/cursos#')) return;

    event.preventDefault();
    abrir(slug);
  }

  return (
    <>
      {/* Resalta la tarjeta elegida (también sus copias del bucle) */}
      <style>{`[data-curso]{cursor:pointer}${
        actual && SLUG_VALIDO.test(actual)
          ? `[data-curso="${actual}"]{border-color:#1C6DD0;box-shadow:0 0 0 2px #1C6DD0,0 20px 40px -16px rgba(11,37,69,.35)}`
          : ''
      }`}</style>

      {/* El clic se escucha aquí para no convertir cada tarjeta en componente de cliente */}
      <div onClick={alHacerClic}>{carrusel}</div>

      <div ref={zona} className="mt-12">
        {fichas.map((ficha) => (
          <div
            key={ficha.slug}
            id={ficha.slug}
            data-ficha={ficha.slug}
            tabIndex={-1}
            hidden={ficha.slug !== actual}
            className="scroll-mt-24 rounded-2xl outline-none"
          >
            {ficha.contenido}
          </div>
        ))}
      </div>
    </>
  );
}
