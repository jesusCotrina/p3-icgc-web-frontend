/**
 * Iconos SVG en línea.
 *
 * Van inline y no como librería de iconos: son cuatro trazos, pesan menos que
 * cualquier paquete y no agregan JS que retrase la pintura (Core Web Vitals).
 * Todos llevan aria-hidden porque el texto del botón ya dice qué hace.
 */

type IconProps = { className?: string; size?: number };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/** Logotipo de WhatsApp (relleno, no trazo: es una marca reconocible). */
export function WhatsAppIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24z" />
    </svg>
  );
}

/** Libro abierto: para "Ver cursos". */
export function BookIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H9a3 3 0 0 1 3 3v15a2.5 2.5 0 0 0-2.5-2.5H4a2 2 0 0 1-2-2z" />
      <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H15a3 3 0 0 0-3 3v15a2.5 2.5 0 0 1 2.5-2.5H20a2 2 0 0 0 2-2z" />
    </svg>
  );
}

/** Maletín: para "Ver servicios". */
export function BriefcaseIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 13h20" />
    </svg>
  );
}

/** Apretón de manos estilizado: para "Quiero asesoría". */
export function HandshakeIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.8-.8" />
      <path d="M18 12h4V6l-2.5-2.5a2 2 0 0 0-1.4-.6H15l-3 3" />
      <path d="M2 6h4l3.5-3.5a2 2 0 0 1 1.4-.6H14" />
      <path d="M6 12H2V6" />
      <path d="m6 12 3.5 3.5a1 1 0 1 0 3-3L9 9" />
    </svg>
  );
}

/** Plano/proyecto: para la sección de proyectos. */
export function BlueprintIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
      <path d="M13 13h4v4h-4z" />
    </svg>
  );
}

export function CheckIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} strokeWidth={3} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ArrowRightIcon({ className = '', size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} strokeWidth={2.5} className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/** Cámara de video: modalidad en vivo / virtual. */
export function VideoIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <path d="m16 13 5.2 3.5a.5.5 0 0 0 .8-.4V7.9a.5.5 0 0 0-.8-.4L16 11" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

/** Reloj: horas lectivas. */
export function ClockIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

/** Calendario: duración. */
export function CalendarIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/** Documento: material del curso. */
export function FileIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 13h6M10 17h6M8 9h2" />
    </svg>
  );
}

/** Medalla: certificación. */
export function AwardIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1" />
    </svg>
  );
}

/** Persona: docente a cargo. */
export function UserIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} {...base} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
