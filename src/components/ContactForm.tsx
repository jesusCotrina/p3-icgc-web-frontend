'use client';

import { useState } from 'react';
import { API_PUBLIC_URL } from '@/lib/entorno';

type Estado =
  | { tipo: 'inicial' }
  | { tipo: 'enviando' }
  | { tipo: 'enviado' }
  | { tipo: 'error'; mensaje: string };

type ErrorApi = { message?: string; details?: { field: string; message: string }[] };

/**
 * Formulario de contacto de /nosotros.
 *
 * Envía los datos a la API (POST /api/public/contact) y quedan guardados en la
 * base de datos; el equipo los lee en el gestor, sección Mensajes.
 * Es cliente solo por el envío: las etiquetas y el texto vienen en el HTML.
 * El campo "website" está oculto: si llega lleno, es un bot.
 */
export function ContactForm() {
  const [estado, setEstado] = useState<Estado>({ tipo: 'inicial' });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formulario = event.currentTarget;
    const datos = Object.fromEntries(new FormData(formulario)) as Record<string, string>;

    setEstado({ tipo: 'enviando' });
    try {
      const res = await fetch(`${API_PUBLIC_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const cuerpo = (await res.json().catch(() => ({}))) as ErrorApi;
        // Muestra el primer problema concreto ("El correo no es válido")
        const detalle = cuerpo.details?.[0]?.message;
        throw new Error(detalle ?? cuerpo.message ?? 'No pudimos enviar tu mensaje.');
      }

      formulario.reset();
      setEstado({ tipo: 'enviado' });
    } catch (err) {
      setEstado({
        tipo: 'error',
        mensaje:
          err instanceof TypeError
            ? 'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.'
            : err instanceof Error
              ? err.message
              : 'No pudimos enviar tu mensaje.',
      });
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border border-silver-300 bg-white px-4 py-3 text-sm text-brand-900 transition-colors placeholder:text-slate-400 focus:border-brand-500';
  const labelClass = 'text-sm font-semibold text-brand-800';

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Nombres <span className="text-brand-500">*</span>
          </label>
          <input id="firstName" name="firstName" type="text" required minLength={2} maxLength={80} autoComplete="given-name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Apellidos <span className="text-brand-500">*</span>
          </label>
          <input id="lastName" name="lastName" type="text" required minLength={2} maxLength={120} autoComplete="family-name" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            Correo electrónico <span className="text-brand-500">*</span>
          </label>
          <input id="email" name="email" type="email" required maxLength={160} autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Número de celular <span className="text-brand-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            pattern="\+?[0-9 ]{6,20}"
            title="Solo números, espacios y el signo +"
            placeholder="999 999 999"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Cuéntanos qué necesita tu comunidad u organización."
          className={inputClass}
        />
      </div>

      {/* Trampa para bots: invisible para las personas y fuera del Tab */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">No completes este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={estado.tipo === 'enviando'} className="btn-primary w-full sm:w-auto">
        {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      {/* role="status": los lectores de pantalla anuncian el resultado */}
      <p
        role="status"
        className={`min-h-[1.25rem] text-sm ${estado.tipo === 'error' ? 'text-rose-700' : 'text-brand-700'}`}
      >
        {estado.tipo === 'enviado' && '¡Gracias! Recibimos tus datos y te contactaremos pronto.'}
        {estado.tipo === 'error' && estado.mensaje}
      </p>
    </form>
  );
}
