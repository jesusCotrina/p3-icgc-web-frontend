/**
 * Borde en onda suave para cortar una sección de fondo (como las líneas de
 * FondoLineas): se pinta del color de la sección vecina (blanco por defecto)
 * sobre el borde de arriba o de abajo.
 *
 * Decorativo: SVG en línea, aria-hidden, sin JS. La sección que lo usa debe
 * ser "relative".
 */
export function BordeOndulado({
  lado,
  className = 'text-white',
}: {
  lado: 'arriba' | 'abajo';
  /** Color de la sección vecina, como clase de texto (el SVG usa currentColor) */
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-5 w-full sm:h-7 lg:h-9 ${
        lado === 'arriba' ? 'top-0' : 'bottom-0 rotate-180'
      } ${className}`}
      fill="currentColor"
    >
      {/* Onda baja y amplia: dos subidas suaves de lado a lado */}
      <path d="M0 0H1440V14C1260 34 1080 34 900 20C720 6 540 4 360 18C220 29 100 30 0 22Z" />
    </svg>
  );
}
