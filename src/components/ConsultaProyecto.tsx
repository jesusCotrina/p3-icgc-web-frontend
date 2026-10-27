'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { WhatsAppIcon } from '@/components/Icons';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

const TIPOS = [
  'Riego',
  'Agua y saneamiento',
  'Caminos y puentes',
  'Local comunal o aulas',
  'Proyecto productivo',
  'Otro',
] as const;

/** Cada etapa sugiere el servicio que corresponde (ancla en /servicios). */
const ETAPAS = [
  { texto: 'Es solo una idea', servicio: 'expedientes-tecnicos', etiqueta: 'expedientes técnicos' },
  { texto: 'Tenemos perfil o expediente', servicio: 'inversion-publica', etiqueta: 'proyectos de inversión pública' },
  { texto: 'Vamos a licitar', servicio: 'licitaciones', etiqueta: 'licitaciones con el Estado' },
  { texto: 'La obra está en marcha', servicio: 'ejecucion-de-obras', etiqueta: 'ejecución y supervisión de obras' },
  { texto: 'La obra está paralizada', servicio: 'ejecucion-de-obras', etiqueta: 'ejecución y supervisión de obras' },
] as const;

/**
 * Cierre de /proyectos: la comunidad cuenta qué proyecto tiene y en qué punto
 * está; se le sugiere el servicio que corresponde y la consulta va por
 * WhatsApp ya escrita.
 *
 * REGLA SEO: preguntas y opciones vienen en el HTML del servidor; el cliente
 * solo arma el mensaje. Radios reales dentro de <fieldset> (teclado y lector).
 */
export function ConsultaProyecto({ whatsapp }: { whatsapp: string | null }) {
  const id = useId();
  const [tipo, setTipo] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<(typeof ETAPAS)[number] | null>(null);

  const url = whatsappUrl(
    { whatsapp },
    `Hola, vengo de la página web. Tenemos un proyecto y queremos asesoría.\n` +
      `• Tipo de proyecto: ${tipo ?? 'por definir'}\n` +
      `• Situación: ${etapa ? etapa.texto.toLowerCase() : 'por definir'}`,
  );

  const pastilla = (activa: boolean) =>
    `inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-300 ${
      activa
        ? 'border-white bg-white text-brand-900 shadow'
        : 'border-white/25 bg-white/10 text-white hover:border-white/60 hover:bg-white/20'
    }`;

  return (
    <div className="relative isolate overflow-hidden rounded-2xl px-6 py-8 sm:px-8 lg:px-10">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#06162b_0%,#0b2545_50%,#0e7490_100%)]"
      />
      <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center lg:gap-10">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-300">
            Asesoría en proyectos
          </p>
          <h2 id="consulta-titulo" className="mt-2 text-balance text-2xl text-white">
            ¿Tu comunidad tiene un proyecto?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-100">
            Cuéntanos qué proyecto es y en qué punto está: revisamos tu caso y te decimos qué se
            puede hacer.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-bold text-white">¿Qué tipo de proyecto?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <label key={t} className={pastilla(tipo === t)}>
                  <input
                    type="radio"
                    name={`${id}-tipo`}
                    checked={tipo === t}
                    onChange={() => setTipo(t)}
                    className="sr-only"
                  />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold text-white">¿En qué punto está?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ETAPAS.map((e) => (
                <label key={e.texto} className={pastilla(etapa?.texto === e.texto)}>
                  <input
                    type="radio"
                    name={`${id}-etapa`}
                    checked={etapa?.texto === e.texto}
                    onChange={() => setEtapa(e)}
                    className="sr-only"
                  />
                  {e.texto}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Sugerencia según la etapa elegida */}
          <p aria-live="polite" className="text-sm text-brand-100 empty:hidden">
            {etapa && (
              <>
                Te puede servir nuestro servicio de{' '}
                <Link
                  href={`/servicios#${etapa.servicio}`}
                  className="font-semibold text-white underline underline-offset-2"
                >
                  {etapa.etiqueta}
                </Link>
                .
              </>
            )}
          </p>

          <a href={url} {...propsEnlace(url)} className="btn-light">
            <WhatsAppIcon size={18} />
            Enviar por WhatsApp
          </a>
        </form>
      </div>
    </div>
  );
}
