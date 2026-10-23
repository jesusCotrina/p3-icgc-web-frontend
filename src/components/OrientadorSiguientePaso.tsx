'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import { WhatsAppIcon } from '@/components/Icons';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

type Necesidad = {
  id: string;
  texto: string;
  /** Lo que recomendamos hacer, en una frase corta */
  paso: string;
  destino: { href: string; etiqueta: string };
};

const NECESIDADES: readonly Necesidad[] = [
  {
    id: 'proyecto',
    texto: 'Formular o impulsar un proyecto',
    paso: 'una asesoría para sacar adelante tu proyecto',
    destino: { href: '/proyectos', etiqueta: 'Ver cómo acompañamos los proyectos' },
  },
  {
    id: 'gestion',
    texto: 'Orientación en gestión comunal o marco legal',
    paso: 'una orientación en gestión comunal y marco legal',
    destino: {
      href: '/cursos#marco-legal-comunal',
      etiqueta: 'Ver el curso de marco legal comunal',
    },
  },
  {
    id: 'capacitar',
    texto: 'Capacitar a dirigentes y comuneros',
    paso: 'un programa de capacitación para tu equipo',
    destino: { href: '/cursos', etiqueta: 'Ver los cursos de capacitación' },
  },
  {
    id: 'licitacion',
    texto: 'Prepararse para una licitación',
    paso: 'preparar a tu comunidad para competir en una licitación',
    destino: { href: '/proyectos#licitaciones', etiqueta: 'Ver la asesoría en licitaciones' },
  },
];

const ETAPAS = [
  {
    id: 'idea',
    texto: 'Tenemos una idea o necesidad',
    consejo:
      'Empezamos con un diagnóstico: revisamos la necesidad y la documentación de la comunidad, y te proponemos la ruta más corta para avanzar.',
  },
  {
    id: 'gestion',
    texto: 'Ya estamos gestionando el proyecto',
    consejo:
      'Revisamos en qué punto está el trámite o el expediente, qué falta y qué está frenando el avance, para destrabarlo cuanto antes.',
  },
  {
    id: 'ejecucion',
    texto: 'Necesitamos apoyo durante la ejecución',
    consejo:
      'Te acompañamos mientras se ejecuta: control de avance, valorizaciones y la documentación que después pide la liquidación.',
  },
] as const;

/**
 * Cierre del inicio: en vez de un CTA genérico, un pequeño orientador. El
 * visitante elige qué necesita y en qué etapa está, y "Ver mi siguiente paso"
 * abre WhatsApp directamente con su consulta ya escrita.
 *
 * REGLA SEO: las preguntas y opciones vienen en el HTML del servidor; solo la
 * respuesta se arma en el cliente. Las opciones son radios reales dentro de
 * <fieldset>, así funciona con teclado y lector de pantalla.
 */
export function OrientadorSiguientePaso({ whatsapp }: { whatsapp: string | null }) {
  const id = useId();
  const [necesidad, setNecesidad] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(false);

  const elegidaNecesidad = NECESIDADES.find((n) => n.id === necesidad);
  const elegidaEtapa = ETAPAS.find((e) => e.id === etapa);
  const listo = Boolean(elegidaNecesidad && elegidaEtapa);

  const urlWhatsapp =
    elegidaNecesidad && elegidaEtapa
      ? whatsappUrl(
          { whatsapp },
          `Hola, vengo de la página web. Necesitamos: ${elegidaNecesidad.texto.toLowerCase()}. ` +
            `Etapa: ${elegidaEtapa.texto.toLowerCase()}. ¿Nos pueden orientar sobre el siguiente paso?`,
        )
      : '';

  const opcion = (activa: boolean) =>
    `flex h-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
      activa
        ? 'border-white bg-white text-brand-900 shadow-lg'
        : 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20'
    }`;

  const marca = (activa: boolean) =>
    `inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
      activa ? 'border-brand-600 bg-brand-600' : 'border-white/70'
    }`;

  return (
    <div className="relative isolate overflow-hidden rounded-2xl px-6 py-12 sm:px-12 lg:px-16">
      {/* Foto de fondo con velo oscuro: el texto blanco se lee sobre cualquier zona */}
      <Image
        src="/hero/paisaje-andino-laguna-quellacocha.webp"
        alt=""
        fill
        sizes="(max-width: 1440px) 100vw, 1440px"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-950/95 via-brand-900/90 to-brand-800/80"
      />

      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300">
          Encuentra tu siguiente paso
        </p>
        <h2 id="cta-titulo" className="mt-3 text-balance text-3xl text-white sm:text-4xl">
          ¿En qué etapa está tu comunidad?
        </h2>

        <form
          className="mt-8 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!listo) return;
            setMostrar(true);
            // Directo a WhatsApp con la consulta escrita. Si no hay número
            // cargado, whatsappUrl() lleva al formulario de /nosotros.
            if (urlWhatsapp.startsWith('http')) {
              const ventana = window.open(urlWhatsapp, '_blank', 'noopener,noreferrer');
              // Bloqueador de ventanas: se abre en la misma pestaña
              if (!ventana) window.location.href = urlWhatsapp;
            } else {
              window.location.href = urlWhatsapp;
            }
          }}
        >
          <fieldset>
            <legend className="text-base font-bold text-white">
              ¿Qué necesita tu comunidad hoy?
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {NECESIDADES.map((n) => (
                <label key={n.id} className={opcion(necesidad === n.id)}>
                  <input
                    type="radio"
                    name={`${id}-necesidad`}
                    value={n.id}
                    checked={necesidad === n.id}
                    onChange={() => {
                      setNecesidad(n.id);
                      setMostrar(false);
                    }}
                    className="sr-only"
                  />
                  <span aria-hidden="true" className={marca(necesidad === n.id)}>
                    {necesidad === n.id && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  {n.texto}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-base font-bold text-white">¿En qué etapa se encuentran?</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {ETAPAS.map((e) => (
                <label key={e.id} className={opcion(etapa === e.id)}>
                  <input
                    type="radio"
                    name={`${id}-etapa`}
                    value={e.id}
                    checked={etapa === e.id}
                    onChange={() => {
                      setEtapa(e.id);
                      setMostrar(false);
                    }}
                    className="sr-only"
                  />
                  <span aria-hidden="true" className={marca(etapa === e.id)}>
                    {etapa === e.id && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                  {e.texto}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!listo}
            className="btn-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WhatsAppIcon size={18} />
            Ver mi siguiente paso
          </button>
        </form>

        {/* aria-live: el lector de pantalla anuncia que se abrió WhatsApp */}
        <div aria-live="polite">
          {mostrar && elegidaNecesidad && elegidaEtapa && (
            <p className="mt-6 animate-fade-up text-sm leading-relaxed text-brand-100">
              Abrimos WhatsApp con tu consulta: te recomendamos {elegidaNecesidad.paso}.{' '}
              <a
                href={urlWhatsapp}
                {...propsEnlace(urlWhatsapp)}
                className="font-semibold text-white underline underline-offset-2"
              >
                Si no se abrió, toca aquí para enviarla
              </a>{' '}
              o{' '}
              <Link
                href={elegidaNecesidad.destino.href}
                className="font-semibold text-white underline underline-offset-2"
              >
                {elegidaNecesidad.destino.etiqueta.toLowerCase()}
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
