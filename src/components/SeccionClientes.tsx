import { LogoMarquee } from '@/components/LogoMarquee';
import { Reveal } from '@/components/Reveal';
import { TituloSeccion } from '@/components/TituloSeccion';
import { CLIENTES, MINERAS } from '@/lib/clientes';

/**
 * "Nuestra experiencia y relacionamiento institucional": dos cintas de logos,
 * cada una con su título (comunidades y empresas comunales / empresas con las
 * que se dialogó y negoció). La misma sección en el inicio y en /servicios.
 */
export function SeccionClientes() {
  const cintas = [
    {
      id: 'clientes-comunidades',
      titulo: 'Comunidades y Empresas Comunales',
      etiqueta: 'logos de comunidades y empresas comunales',
      clientes: CLIENTES,
    },
    {
      id: 'clientes-mineras',
      titulo: 'Diálogo y Negociación con Empresas',
      etiqueta: 'logos de empresas con las que se dialogó y negoció',
      clientes: MINERAS,
    },
  ];

  return (
    <section aria-labelledby="clientes-titulo" className="py-14 lg:py-16">
      <div className="container-icgc">
        <Reveal>
          <TituloSeccion
            id="clientes-titulo"
            titulo="Nuestra Experiencia y Relacionamiento Institucional"
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
