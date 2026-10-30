import { LogoMarquee } from '@/components/LogoMarquee';
import { Reveal } from '@/components/Reveal';
import { TituloSeccion } from '@/components/TituloSeccion';
import { CLIENTES, MINERAS } from '@/lib/clientes';

/**
 * "Confían en nosotros": dos cintas de logos, cada una con su título
 * (empresas y comunidades / empresas mineras). La misma sección en el inicio
 * y en /servicios.
 */
export function SeccionClientes() {
  const cintas = [
    {
      id: 'clientes-comunidades',
      titulo: 'Comunidades',
      etiqueta: 'logos de empresas y comunidades',
      clientes: CLIENTES,
    },
    {
      id: 'clientes-mineras',
      titulo: 'Negociación con Empresas Mineras',
      etiqueta: 'logos de empresas mineras',
      clientes: MINERAS,
    },
  ];

  return (
    <section aria-labelledby="clientes-titulo" className="py-14 lg:py-16">
      <div className="container-icgc">
        <Reveal>
          <TituloSeccion
            id="clientes-titulo"
            titulo="Confían en Nosotros"
            centrado
          />
        </Reveal>
        {cintas.map((cinta, i) => (
          <Reveal key={cinta.id} retrasoMs={150} className="mt-12">
            <div role="group" aria-labelledby={cinta.id}>
              <h3
                id={cinta.id}
                className="mb-6 text-center text-xl font-extrabold text-brand-800 sm:text-2xl"
              >
                {cinta.titulo}
              </h3>
              <LogoMarquee clientes={cinta.clientes} etiqueta={cinta.etiqueta} reversa={i === 1} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
