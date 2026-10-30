/**
 * Encabezado estándar de las secciones del inicio: el nombre de la sección
 * como h2 grande y en negrita, y debajo una frase más chica.
 * Un mismo tamaño en todas, así la página se lee pareja.
 */
export function TituloSeccion({
  id,
  titulo,
  subtitulo,
  centrado = false,
}: {
  /** Para el aria-labelledby de la <section> */
  id: string;
  titulo: string;
  subtitulo?: string;
  centrado?: boolean;
}) {
  return (
    <div className={centrado ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <h2
        id={id}
        className="text-balance text-3xl font-extrabold tracking-tight text-brand-900 sm:text-[2.5rem]"
      >
        {titulo}
      </h2>
      {subtitulo && (
        <p className="mt-3 text-pretty text-lg font-medium text-slate-600">{subtitulo}</p>
      )}
    </div>
  );
}
