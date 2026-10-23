import { MAPA_ALTO, MAPA_ANCHO, proyectar, REGIONES } from '@/lib/peru-mapa';
import type { PresenciaRegion } from '@/lib/presencia';
import { type Marcador, PeruMapMarkers } from './PeruMapMarkers';

// Callao es muy pequeño para tener etiqueta: su marcador por defecto va aquí
const CENTRO_CALLAO: [number, number] = [-77.12, -12.05];

/**
 * Mapa del Perú por regiones con un marcador por región donde hay proyectos.
 *
 * REGLA SEO: el SVG y los nombres de las regiones salen del servidor (texto
 * real, no una imagen) y la lista de abajo repite los datos de cada marcador,
 * así Google los lee aunque nunca se pase el mouse. Solo los marcadores son JS.
 */
export function PeruMap({
  presencia,
  resumen,
}: {
  presencia: PresenciaRegion[];
  /** Cifras que van arriba de la lista, en la columna derecha */
  resumen?: React.ReactNode;
}) {
  const conPresencia = new Set(presencia.map((p) => p.region));

  const marcadores: Marcador[] = presencia.map((p) => {
    // Sin coordenadas en sus proyectos, el marcador va sobre el nombre de la región
    const etiqueta = REGIONES.find((r) => r.id === p.region)?.etiqueta;
    const [x, y] =
      p.lon != null && p.lat != null
        ? proyectar(p.lon, p.lat)
        : etiqueta
          ? [etiqueta[0], etiqueta[1] - 8]
          : proyectar(...CENTRO_CALLAO);

    return {
      id: p.region,
      region: p.nombre,
      x: (x / MAPA_ANCHO) * 100,
      y: (y / MAPA_ALTO) * 100,
      proyectos: p.proyectos,
      comunidades: p.comunidades,
      titulos: p.titulos,
    };
  });

  return (
    // Escritorio: mapa a la izquierda, cifras y regiones a la derecha (aprovecha
    // el ancho que antes quedaba vacío a los costados). Móvil: uno debajo del otro.
    <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      <div
        className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:justify-self-start"
        style={{ aspectRatio: `${MAPA_ANCHO} / ${MAPA_ALTO}` }}
      >
        <svg
          viewBox={`0 0 ${MAPA_ANCHO} ${MAPA_ALTO}`}
          role="img"
          aria-labelledby="mapa-peru-titulo"
          className="h-full w-full"
        >
          <title id="mapa-peru-titulo">
            Mapa del Perú por regiones con las zonas donde trabaja el ICGC
          </title>
          <g strokeLinejoin="round">
            {REGIONES.map((r) => (
              <path
                key={r.id}
                d={r.d}
                className={`stroke-white transition-colors duration-200 [stroke-width:1.5] ${
                  conPresencia.has(r.id)
                    ? 'fill-brand-300 hover:fill-brand-400'
                    : 'fill-brand-100 hover:fill-brand-200'
                }`}
              >
                <title>{r.nombre}</title>
              </path>
            ))}
          </g>
          <g
            aria-hidden="true"
            // En móvil los nombres quedarían de ~6px: se ocultan, la lista los cubre
            className="pointer-events-none hidden select-none fill-brand-800 text-[10px] font-semibold sm:inline"
          >
            {REGIONES.filter((r) => r.etiqueta).map((r) => (
              <text
                key={r.id}
                x={r.etiqueta![0]}
                y={r.etiqueta![1]}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {r.nombre}
              </text>
            ))}
          </g>
        </svg>

        <PeruMapMarkers marcadores={marcadores} />
      </div>

      <div>
        {resumen}

        {/* Alternativa en texto: accesible, indexable y útil en móvil */}
        {marcadores.length > 0 && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {marcadores.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-3 rounded-xl border border-silver-200 bg-white p-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 h-3 w-3 shrink-0 rounded-full bg-rose-600"
                />
                <p className="text-sm leading-relaxed text-slate-600">
                  <strong className="text-brand-900">{m.region}:</strong> {m.proyectos}{' '}
                  {m.proyectos === 1 ? 'proyecto' : 'proyectos'} y {m.comunidades}{' '}
                  {m.comunidades === 1 ? 'comunidad beneficiada' : 'comunidades beneficiadas'}.
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
