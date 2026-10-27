'use client';

import { useId, useState } from 'react';
import { WhatsAppIcon } from '@/components/Icons';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';

const MODALIDADES = ['Virtual', 'Presencial', 'Semipresencial'] as const;
const GRUPOS = ['Hasta 20', '20 a 50', 'Más de 50'] as const;

/**
 * Cierre de /cursos: arma un programa a medida en tres toques (temas,
 * modalidad y tamaño del grupo) y lo envía por WhatsApp con el mensaje escrito.
 *
 * REGLA SEO: el texto, las preguntas y las opciones vienen en el HTML del
 * servidor; el cliente solo arma el mensaje. Las opciones son checkbox y radio
 * reales dentro de <fieldset>, así funciona con teclado y lector de pantalla.
 */
export function ProgramaAMedida({
  temas,
  whatsapp,
}: {
  /** Nombres de los cursos publicados: los temas salen del gestor */
  temas: string[];
  whatsapp: string | null;
}) {
  const id = useId();
  const opciones = [...temas, 'Otro tema'];
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [modalidad, setModalidad] = useState<string>(MODALIDADES[0]);
  const [grupo, setGrupo] = useState<string>(GRUPOS[0]);

  const alternar = (tema: string) =>
    setElegidos((prev) => (prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]));

  const url = whatsappUrl(
    { whatsapp },
    `Hola, vengo de la página web. Quiero un programa de capacitación a medida.\n` +
      `• Temas: ${elegidos.length ? elegidos.join(', ') : 'por definir'}\n` +
      `• Modalidad: ${modalidad}\n• Participantes: ${grupo.toLowerCase()} personas`,
  );

  /** Pastilla seleccionable: la misma para temas, modalidad y grupo */
  const pastilla = (activa: boolean) =>
    `inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8rem] font-semibold transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-300 ${
      activa
        ? 'border-white bg-white text-brand-900 shadow'
        : 'border-white/25 bg-white/10 text-white hover:border-white/60 hover:bg-white/20'
    }`;

  const grupoDeRadios = (
    nombre: string,
    valores: readonly string[],
    valor: string,
    cambiar: (v: string) => void,
  ) =>
    valores.map((v) => (
      <label key={v} className={pastilla(valor === v)}>
        <input
          type="radio"
          name={`${id}-${nombre}`}
          checked={valor === v}
          onChange={() => cambiar(v)}
          className="sr-only"
        />
        {v}
      </label>
    ));

  return (
    <div className="relative isolate overflow-hidden rounded-2xl px-6 py-8 sm:px-8 lg:px-10">
      {/* Fondo: degradado con una luz de color */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,#06162b_0%,#0b2545_50%,#0e7490_100%)]"
      />
      <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />

      <div className="grid gap-7 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center lg:gap-10">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-300">
            Programa a medida
          </p>
          <h2 id="medida-titulo" className="mt-2 text-balance text-2xl text-white">
            ¿Necesitas un programa a medida?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-100">
            Adaptamos temas, fechas y modalidad a tu comunidad u organización, con certificado del
            ICGC. Elige lo que necesitas y te respondemos por WhatsApp.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <fieldset>
            <legend className="text-sm font-bold text-white">Temas</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {opciones.map((tema) => {
                const activo = elegidos.includes(tema);
                return (
                  <label key={tema} className={pastilla(activo)}>
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={() => alternar(tema)}
                      className="sr-only"
                    />
                    <span aria-hidden="true">{activo ? '✓' : '+'}</span>
                    {tema}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <fieldset>
              <legend className="text-sm font-bold text-white">Modalidad</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {grupoDeRadios('modalidad', MODALIDADES, modalidad, setModalidad)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-bold text-white">Participantes</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {grupoDeRadios('grupo', GRUPOS, grupo, setGrupo)}
              </div>
            </fieldset>
          </div>

          <a href={url} {...propsEnlace(url)} className="btn-light">
            <WhatsAppIcon size={18} />
            Enviar por WhatsApp
          </a>
        </form>
      </div>
    </div>
  );
}
