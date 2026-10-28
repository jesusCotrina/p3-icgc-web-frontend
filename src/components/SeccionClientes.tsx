import { LogoMarquee } from '@/components/LogoMarquee';
import { Reveal } from '@/components/Reveal';
import { CLIENTES } from '@/lib/clientes';

/**
 * "Confían en nosotros": la cinta de logos de empresas y comunidades.
 * La misma sección en el inicio y en /servicios.
 */
export function SeccionClientes() {
  return (
    <section aria-labelledby="clientes-titulo" className="py-14 lg:py-16">
      <div className="container-icgc">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Confían en nosotros</p>
          <h2 id="clientes-titulo" className="mt-3 text-balance text-3xl sm:text-4xl">
            Empresas y comunidades que trabajan con nosotros
          </h2>
        </Reveal>
        <Reveal retrasoMs={150} className="mt-10">
          <LogoMarquee clientes={CLIENTES} />
        </Reveal>
      </div>
    </section>
  );
}
