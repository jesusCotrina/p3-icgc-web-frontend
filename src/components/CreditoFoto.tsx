import type { MediaDTO } from '@/lib/types';

type Creditos = Pick<MediaDTO, 'author' | 'source' | 'sourceUrl'>;

/** True si la foto trae autor, fuente o enlace (cargados en Multimedia del gestor). */
export function tieneCredito(media: Creditos | null | undefined): boolean {
  if (!media) return false;
  return Boolean(media.author?.trim() || media.source?.trim() || media.sourceUrl?.trim());
}

/** Sin nombre de fuente, se usa el dominio del enlace ("andina.pe"). */
function nombreDeFuente(source: string, enlace: string): string {
  if (source) return source;
  try {
    return new URL(enlace).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Línea de créditos de una foto del blog: "Foto: Autor · Fuente: Nombre".
 *
 * REGLA SEO: el enlace a la fuente lleva rel="nofollow": acredita sin
 * traspasar autoridad a un sitio ajeno. Sin datos no pinta nada.
 */
export function CreditoFoto({ media, className = '' }: { media: Creditos; className?: string }) {
  const autor = media.author?.trim() ?? '';
  const enlace = media.sourceUrl?.trim() ?? '';
  const fuente = nombreDeFuente(media.source?.trim() ?? '', enlace);
  if (!autor && !fuente) return null;

  return (
    <span className={`text-xs text-slate-500 ${className}`}>
      {autor && (
        <>
          Foto: <span className="font-medium text-slate-600">{autor}</span>
        </>
      )}
      {autor && fuente && ' · '}
      {fuente && (
        <>
          Fuente:{' '}
          {enlace ? (
            <a
              href={enlace}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-brand-700"
            >
              {fuente}
            </a>
          ) : (
            <span className="font-medium text-slate-600">{fuente}</span>
          )}
        </>
      )}
    </span>
  );
}
