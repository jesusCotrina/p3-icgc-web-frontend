/**
 * Texto que se "escribe" letra por letra al cargar la página.
 *
 * Server Component sin JavaScript: cada letra va en su <span> con el retraso
 * de su turno y la animación es CSS (ver .tw-letra en globals.css). Por eso
 * Google lee el título completo en el HTML y no se agrega nada al bundle.
 * Con "reducir movimiento" el texto aparece entero de una vez.
 *
 * Va DENTRO del encabezado: el <h1> lleva el aria-label con el texto completo
 * para que el lector de pantalla no lo lea letra por letra.
 */
type Segmento = { texto: string; className?: string };

export function Typewriter({
  segmentos,
  msPorLetra = 35,
  inicioMs = 300,
}: {
  segmentos: readonly Segmento[];
  msPorLetra?: number;
  inicioMs?: number;
}) {
  let indice = 0;
  const retraso = () => ({ '--d': `${inicioMs + indice++ * msPorLetra}ms` }) as React.CSSProperties;
  const paso = { '--paso': `${msPorLetra}ms` } as React.CSSProperties;

  return (
    <span aria-hidden="true" style={paso}>
      {segmentos.map((segmento, s) => (
        <span key={s} className={segmento.className}>
          {Array.from(segmento.texto).map((letra, l) => (
            <span key={l} className="tw-letra" style={retraso()}>
              {letra}
            </span>
          ))}
        </span>
      ))}
      <span className="tw-cursor" style={retraso()} />
    </span>
  );
}

/** El texto plano de los segmentos, para el aria-label del encabezado. */
export const textoCompleto = (segmentos: readonly Segmento[]) =>
  segmentos.map((s) => s.texto).join('');
