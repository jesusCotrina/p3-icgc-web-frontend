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

/** Cada necesidad enlaza al servicio o curso que la atiende (slugs de servicios.ts). */
const NECESIDADES: readonly Necesidad[] = [
  {
    id: 'empresa-comunal',
    texto: 'Constituir o fortalecer una empresa comunal',
    paso: 'una asesoría para constituir o fortalecer tu empresa comunal',
    destino: {
      href: '/servicios/empresas-comunales',
      etiqueta: 'Ver el servicio de constitución de empresas comunales',
    },
  },
  {
    id: 'estatutos',
    texto: 'Revisar estatutos, reglamentos o contratos',
    paso: 'una revisión legal de tus estatutos, reglamentos o contratos',
    destino: {
      href: '/servicios/asesoria-legal-y-ambiental',
      etiqueta: 'Ver el servicio de asesoría legal y ambiental',
    },
  },
  {
    id: 'capacitar',
    texto: 'Capacitar a dirigentes, comuneros o trabajadores',
    paso: 'un programa de capacitación para tu equipo',
    destino: { href: '/cursos', etiqueta: 'Ver los cursos de capacitación' },
  },
  {
    id: 'negociacion',
    texto: 'Recibir apoyo en negociaciones y mesas de diálogo',
    paso: 'un acompañamiento en tus negociaciones y mesas de diálogo',
    destino: {
      href: '/servicios/gestion-social-y-conflictos',
      etiqueta: 'Ver el servicio de gestión social y manejo de conflictos',
    },
  },
  {
    id: 'expedientes',
    texto: 'Elaborar expedientes o gestionar proyectos y obras',
    paso: 'una asesoría para elaborar tus expedientes y gestionar tus proyectos y obras',
    destino: {
      href: '/servicios/expedientes-tecnicos-y-proyectos-sociales',
      etiqueta: 'Ver el servicio de elaboración de expedientes técnicos',
    },
  },
  {
    id: 'licitacion',
    texto: 'Preparar licitaciones y propuestas',
    paso: 'preparar a tu organización para competir en una licitación',
    destino: {
      href: '/servicios/gestion-de-proyectos-y-operaciones',
      etiqueta: 'Ver el servicio de gestión de proyectos y operaciones',
    },
  },
  {
    id: 'legal-ambiental',
    texto: 'Recibir asesoría legal o ambiental',
    paso: 'una asesoría legal o ambiental',
    destino: {
      href: '/servicios/asesoria-legal-y-ambiental',
      etiqueta: 'Ver el servicio de asesoría legal y ambiental',
    },
  },
];

/** Tipo de apoyo que buscan: va en el mensaje de WhatsApp. */
const TIPOS_APOYO = [
  { id: 'orientacion', texto: 'Orientación inicial' },
  { id: 'puntual', texto: 'Atención de una necesidad específica' },
  { id: 'continuo', texto: 'Asesoría y acompañamiento continuo' },
] as const;

/**
 * Cierre del inicio: en vez de un CTA genérico, un pequeño orientador. El
 * visitante elige qué necesita y qué tipo de apoyo busca, y "Enviar por
 * WhatsApp" abre WhatsApp directamente con su consulta ya escrita.
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
  const [tipo, setTipo] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(false);

  const elegidaNecesidad = NECESIDADES.find((n) => n.id === necesidad);
  const elegidoTipo = TIPOS_APOYO.find((t) => t.id === tipo);
  const listo = Boolean(elegidaNecesidad && elegidoTipo);

  const urlWhatsapp =
    elegidaNecesidad && elegidoTipo
      ? whatsappUrl(
          { whatsapp },
          `Hola, vengo de la página web. Necesitamos: ${elegidaNecesidad.texto.toLowerCase()}. ` +
            `Tipo de apoyo: ${elegidoTipo.texto.toLowerCase()}. ¿Nos pueden orientar?`,
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
            Conversemos sobre sus necesidades
          </p>
          <h2 id="cta-titulo" className="mt-2 text-balance text-2xl font-extrabold text-brand-900">
            ¿Cómo Podemos Apoyar a tu Comunidad o Empresa?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-texto">
            Selecciona el servicio que necesitas y cuéntanos tu situación por WhatsApp.
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
            <legend className="text-sm font-bold text-brand-900">¿Qué tipo de apoyo buscan?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIPOS_APOYO.map((t) => (
                <label key={t.id} className={pastilla(tipo === t.id)}>
                  <input
                    type="radio"
                    name={`${id}-tipo`}
                    value={t.id}
                    checked={tipo === t.id}
                    onChange={() => {
                      setTipo(t.id);
                      setMostrar(false);
                    }}
                    className="sr-only"
                  />
                  {t.texto}
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
            {mostrar && elegidaNecesidad && elegidoTipo && (
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
