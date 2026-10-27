'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Aviso de carga entre páginas: una barra en el borde superior y un círculo
 * girando. Se enciende al hacer clic en un enlace interno y se apaga cuando
 * cambia la ruta. Aparece con 150 ms de retraso (por CSS), así una navegación
 * rápida no parpadea. Pesa unos cientos de bytes y no toca el HTML del servidor.
 */
export function IndicadorNavegacion() {
  const pathname = usePathname();
  const [cargando, setCargando] = useState(false);

  // Llegó la página nueva
  useEffect(() => setCargando(false), [pathname]);

  useEffect(() => {
    function alHacerClic(event: MouseEvent) {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const enlace = (event.target as Element | null)?.closest('a');
      if (!enlace || enlace.target === '_blank' || enlace.hasAttribute('download')) return;
      const destino = new URL(enlace.href, window.location.href);
      // Otro sitio, o la misma página (anclas y filtros): no hay carga que esperar
      if (destino.origin !== window.location.origin) return;
      if (destino.pathname === window.location.pathname) return;
      setCargando(true);
    }
    // En captura: el <Link> de Next cancela el clic (preventDefault) antes de
    // que llegue a document, y así igual nos enteramos de la navegación
    document.addEventListener('click', alHacerClic, true);
    return () => document.removeEventListener('click', alHacerClic, true);
  }, []);

  // Si la navegación falla, el aviso no se queda prendido para siempre
  useEffect(() => {
    if (!cargando) return;
    const id = window.setTimeout(() => setCargando(false), 10000);
    return () => window.clearTimeout(id);
  }, [cargando]);

  if (!cargando) return null;

  return (
    <div role="status" aria-live="polite" className="aparecer-con-retraso">
      <div className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden">
        <div className="barra-navegacion h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-brand-600" />
      </div>
      <div className="fixed left-1/2 top-24 z-[100] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-800 shadow-card-hover ring-1 ring-brand-100">
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
        />
        Cargando...
      </div>
    </div>
  );
}
