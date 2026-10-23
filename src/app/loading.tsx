/** Esqueleto de carga entre navegaciones. Evita pantallazos en blanco. */
export default function Loading() {
  return (
    <div className="container-icgc py-24" role="status" aria-label="Cargando contenido">
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-silver-200" />
      <div className="mt-5 h-5 w-1/2 animate-pulse rounded-lg bg-silver-100" />
      <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[16/10] animate-pulse bg-silver-200" />
            <div className="space-y-3 p-6">
              <div className="h-4 w-1/3 animate-pulse rounded bg-silver-100" />
              <div className="h-5 w-full animate-pulse rounded bg-silver-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-silver-100" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
