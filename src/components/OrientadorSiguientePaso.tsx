'use client';

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
    destino: { href: '/servicios/gestion-de-proyectos-y-obras', etiqueta: 'Ver el servicio de gestión de proyectos y obras' },
  },
  {
    id: 'gestion',
    texto: 'Orientación en gestión comunal o marco legal',
    paso: 'una orientación en gestión comunal y marco legal',
    destino: {
      href: '/cursos/gestion-normativa-y-liderazgo-comunal',
      etiqueta: 'Ver el curso de gestión, normativa y liderazgo comunal',
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
    destino: { href: '/servicios/gestion-de-proyectos-y-operaciones', etiqueta: 'Ver el servicio de gestión de proyectos y licitaciones' },
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
export function OrientadorSiguientePaso({
  whatsapp,
  aPantallaCompleta = false,
}: {
  whatsapp: string | null;
  /** Franja de borde a borde (cierre del inicio) en vez de una tarjeta */
  aPantallaCompleta?: boolean;
}) {
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

  /** Pastilla seleccionable, igual que en "Programa a medida" de /cursos */
  const pastilla = (activa: boolean) =>
    `inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-900 ${
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
      {/* Fondo arena (paleta) con una luz dorada suave */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-arena"
      />
      <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-dorado/15 blur-3xl" />

      <div
        className={`grid gap-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center lg:gap-10 ${
          aPantallaCompleta ? 'container-icgc' : ''
        }`}
      >
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-dorado-oscuro">
            Encuentra tu siguiente paso
          </p>
          <h2 id="cta-titulo" className="mt-2 text-balance text-2xl font-extrabold text-brand-900">
            ¿En Qué Etapa Está tu Comunidad?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-texto">
            Elige qué necesitan y en qué punto están: te escribimos la consulta por WhatsApp.
          </p>
        </div>

        <form
          className="space-y-4"
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
            <legend className="text-sm font-bold text-brand-900">¿Qué necesitan?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {NECESIDADES.map((n) => (
                <label key={n.id} className={pastilla(necesidad === n.id)}>
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
                  {n.texto}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold text-brand-900">¿En qué etapa están?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ETAPAS.map((e) => (
                <label key={e.id} className={pastilla(etapa === e.id)}>
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
                  {e.texto}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!listo}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WhatsAppIcon size={18} />
            Enviar por WhatsApp
          </button>

          {/* aria-live: el lector de pantalla anuncia que se abrió WhatsApp */}
          <div aria-live="polite">
            {mostrar && elegidaNecesidad && elegidaEtapa && (
              <p className="animate-fade-up text-sm leading-relaxed text-texto">
                Te recomendamos {elegidaNecesidad.paso}.{' '}
                <a
                  href={urlWhatsapp}
                  {...propsEnlace(urlWhatsapp)}
                  className="font-semibold text-brand-900 underline underline-offset-2"
                >
                  Si no se abrió WhatsApp, toca aquí
                </a>{' '}
                o{' '}
                <Link
                  href={elegidaNecesidad.destino.href}
                  className="font-semibold text-brand-900 underline underline-offset-2"
                >
                  {elegidaNecesidad.destino.etiqueta.toLowerCase()}
                </Link>
                .
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
