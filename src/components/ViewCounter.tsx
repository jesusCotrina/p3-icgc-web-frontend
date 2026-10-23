'use client';

import { useEffect } from 'react';
import { API_PUBLIC_URL } from '@/lib/entorno';

/**
 * Registra una visita al articulo.
 *
 * Va en el cliente a proposito: si el contador corriera en el servidor,
 * cada visita invalidaria el HTML cacheado y perderiamos el ISR (y con el,
 * el LCP bajo que necesitamos para posicionar). No renderiza nada.
 */
export function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    const controller = new AbortController();

    // keepalive: la peticion sobrevive aunque el visitante navegue de inmediato
    fetch(`${API_PUBLIC_URL}/api/public/posts/${encodeURIComponent(slug)}/views`, {
      method: 'POST',
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // Un contador fallido no debe molestar al lector
    });

    return () => controller.abort();
  }, [slug]);

  return null;
}
