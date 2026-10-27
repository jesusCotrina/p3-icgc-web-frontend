import Image from 'next/image';

export type Cliente = { nombre: string; logo: string; width: number; height: number };

/** Los escudos y logos casi cuadrados se ven diminutos a la altura de uno ancho: van más altos. */
const esCuadrado = (c: Cliente) => c.width / c.height < 1.4;

/**
 * Cinta de logos que se desplaza sola (animación CSS, sin JS).
 *
 * La lista se repite para que el bucle no tenga cortes: solo la primera copia
 * es visible para lectores de pantalla y buscadores, el resto va con
 * aria-hidden y alt vacío para no duplicar contenido.
 */
export function LogoMarquee({ clientes }: { clientes: readonly Cliente[] }) {
  // Con pocos logos, se repiten hasta llenar una pantalla ancha
  const copias = Math.max(2, Math.ceil(8 / clientes.length));
  const tramo = Array.from({ length: copias }, () => clientes).flat();

  const lista = (oculta: boolean) => (
    <ul
      aria-hidden={oculta || undefined}
      className="flex shrink-0 animate-marquee items-center gap-16 pr-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
    >
      {tramo.map((c, i) => (
        <li key={`${c.nombre}-${i}`} className="shrink-0">
          <Image
            src={c.logo}
            alt={oculta || i >= clientes.length ? '' : `Logo de ${c.nombre}`}
            width={c.width}
            height={c.height}
            // Se muestran a 56 px de alto (~300 px de ancho): sin esto Next
            // descargaba el logo a 1920 px y pesaba de más (LCP/INP)
            sizes="300px"
            className={`${esCuadrado(c) ? 'h-20' : 'h-14'} w-auto object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {lista(false)}
      {lista(true)}
    </div>
  );
}
