import Image from 'next/image';
import { CintaPausable } from './CintaPausable';

export type Cliente = {
  nombre: string;
  logo: string;
  width: number;
  height: number;
  /** Logo con el ícono arriba y el nombre chico abajo: se muestra más alto */
  grande?: boolean;
};

/** Los escudos y logos casi cuadrados se ven diminutos a la altura de uno ancho: van más altos. */
const esCuadrado = (c: Cliente) => c.grande || c.width / c.height < 1.4;

/**
 * Cinta de logos a color que se desplaza sola (animación CSS); un clic la
 * detiene y otro la reanuda (CintaPausable).
 *
 * La lista se repite para que el bucle no tenga cortes: solo la primera copia
 * es visible para lectores de pantalla y buscadores, el resto va con
 * aria-hidden y alt vacío para no duplicar contenido.
 */
export function LogoMarquee({
  clientes,
  etiqueta,
  reversa = false,
}: {
  clientes: readonly Cliente[];
  /** Para el botón de pausa: "Pausar <etiqueta>" */
  etiqueta: string;
  /** Gira en sentido contrario (para distinguir dos cintas seguidas) */
  reversa?: boolean;
}) {
  // Con pocos logos, se repiten hasta llenar una pantalla ancha
  const copias = Math.max(2, Math.ceil(8 / clientes.length));
  const tramo = Array.from({ length: copias }, () => clientes).flat();

  const lista = (oculta: boolean) => (
    <ul
      aria-hidden={oculta || undefined}
      className={`flex shrink-0 animate-marquee items-center gap-16 pr-16 motion-reduce:animate-none ${reversa ? '[animation-direction:reverse]' : ''}`}
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
            className={`${esCuadrado(c) ? 'h-20' : 'h-14'} w-auto object-contain`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <CintaPausable
      etiqueta={etiqueta}
      className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      {lista(false)}
      {lista(true)}
    </CintaPausable>
  );
}
