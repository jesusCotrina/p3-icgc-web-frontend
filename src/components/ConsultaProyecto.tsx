'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { WhatsAppIcon } from '@/components/Icons';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

/** En qué necesita apoyo la comunidad o empresa */
const TIPOS = [
  'Elaboración o revisión de expedientes técnicos',
  'Licitaciones y propuestas económicas',
  'Ejecución y supervisión de obras',
  'Gestión de operaciones y servicios',
  'Administración de contratos',
  'Otra consulta',
] as const;

/** Cada etapa sugiere el servicio que corresponde (su página en /servicios). */
const ETAPAS = [
  { texto: 'Tenemos una idea o necesidad', servicio: 'expedientes-tecnicos-y-proyectos-sociales', etiqueta: 'expedientes técnicos y proyectos sociales' },
  { texto: 'Estamos preparando la documentación', servicio: 'expedientes-tecnicos-y-proyectos-sociales', etiqueta: 'expedientes técnicos y proyectos sociales' },
  { texto: 'Queremos participar en una licitación', servicio: 'gestion-de-proyectos-y-operaciones', etiqueta: 'gestión de proyectos, licitaciones y contratos' },
  { texto: 'El proyecto o servicio está en ejecución', servicio: 'gestion-de-proyectos-y-operaciones', etiqueta: 'gestión de proyectos y operaciones' },
  { texto: 'Necesitamos resolver dificultades', servicio: 'gestion-social-y-conflictos', etiqueta: 'gestión social y manejo de conflictos' },
] as const;

/**
 * Cierre de /proyectos: la comunidad o empresa cuenta en qué necesita apoyo y en
 * qué etapa está; se le sugiere el servicio que corresponde y la consulta va por
 * WhatsApp ya escrita.
 *
 * REGLA SEO: preguntas y opciones vienen en el HTML del servidor; el cliente
 * solo arma el mensaje. Radios reales dentro de <fieldset> (teclado y lector).
 */
export function ConsultaProyecto({
  whatsapp,
  aPantallaCompleta = false,
}: {
  whatsapp: string | null;
  /** Franja de borde a borde (cierre de /proyectos) en vez de una tarjeta */
  aPantallaCompleta?: boolean;
}) {
  const id = useId();
  const [tipo, setTipo] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<(typeof ETAPAS)[number] | null>(null);

  const url = whatsappUrl(
    { whatsapp },
    `Hola, vengo de la página web. Necesitamos asesoría en proyectos y operaciones.\n` +
      `• Apoyo que necesitamos: ${tipo ? tipo.toLowerCase() : 'por definir'}\n` +
      `• Etapa: ${etapa ? etapa.texto.toLowerCase() : 'por definir'}`,
  );

  const pastilla = (activa: boolean) =>
    `inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-900 ${
      activa
        ? 'border-brand-900 bg-brand-900 text-white shadow'
        : 'border-dorado/40 bg-white text-brand-900 hover:border-brand-900 hover:bg-brand-50'
    }`;

  return (
    <div
      className={`relative isolate overflow-hidden ${
        aPantallaCompleta ? 'py-12 lg:py-14' : 'rounded-2xl px-6 py-8 sm:px-8 lg:px-10'
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-arena"
      />
      <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-dorado/15 blur-3xl" />
      {/* A pantalla completa, termina en el azul con que empieza el pie: un solo degradado */}
      {aPantallaCompleta && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-b from-transparent to-[#173B65]"
        />
      )}

      <div
        className={`grid gap-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center lg:gap-10 ${
          aPantallaCompleta ? 'container-icgc' : ''
        }`}
      >
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-dorado-oscuro">
            Asesoría en proyectos y operaciones
          </p>
          <h2 id="consulta-titulo" className="mt-2 text-balance text-2xl font-extrabold text-brand-900">
            ¿Tu Comunidad o Empresa Necesita Impulsar un Proyecto?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-texto">
            Cuéntanos qué necesitas y en qué etapa te encuentras. Podemos apoyarte con asesoría
            técnica, administrativa y legal.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-bold text-brand-900">¿En qué necesitas apoyo?</legend>
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
            <legend className="text-sm font-bold text-brand-900">¿En qué etapa se encuentra?</legend>
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
          <p aria-live="polite" className="text-sm text-texto empty:hidden">
            {etapa && (
              <>
                Te puede servir nuestro servicio de{' '}
                <Link
                  href={`/servicios/${etapa.servicio}`}
                  className="font-semibold text-brand-900 underline underline-offset-2"
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
