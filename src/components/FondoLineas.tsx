/**
 * Fondo decorativo suave: líneas finas que cruzan la sección de un lado a
 * otro en curvas amplias, como hilos. Más tranquilo que un fondo de figuras.
 * SVG en línea: casi no pesa, se ve nítido y no usa JavaScript.
 *
 * Es decorativo: aria-hidden y sin texto, Google y los lectores lo ignoran.
 */
export function FondoLineas({ className = '' }: { className?: string }) {
  // Cada línea: desde el borde izquierdo hasta el derecho, en una curva distinta
  const lineas = [
    { d: 'M-20 180 C 360 60, 760 320, 1460 120', color: '#8DB8F2', opacidad: 0.55 },
    { d: 'M-20 260 C 420 140, 820 400, 1460 210', color: '#8DB8F2', opacidad: 0.35 },
    { d: 'M-20 520 C 300 380, 900 700, 1460 460', color: '#5EEAD4', opacidad: 0.45 },
    { d: 'M-20 600 C 360 470, 940 780, 1460 540', color: '#5EEAD4', opacidad: 0.25 },
    { d: 'M-20 780 C 480 640, 980 900, 1460 720', color: '#FCD34D', opacidad: 0.35 },
  ];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      fill="none"
    >
      {lineas.map((l) => (
        <path
          key={l.d}
          d={l.d}
          stroke={l.color}
          strokeOpacity={l.opacidad}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
