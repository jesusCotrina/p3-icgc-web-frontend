'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = { href: string; label: string };

/**
 * true si el enlace corresponde a la sección actual.
 * "/" solo coincide consigo mismo; el resto también marca sus subrutas
 * (un artículo en /blog/mi-post deja marcado "Blog").
 */
export function esRutaActiva(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Menú de escritorio. Es cliente solo para leer la ruta y marcar la sección
 * activa: los <a> ya vienen en el HTML del servidor, así que Googlebot los
 * rastrea igual. aria-current le dice a los lectores de pantalla dónde están.
 */
export function NavLinks({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 lg:flex">
      {links.map((link) => {
        const activo = esRutaActiva(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            // Precarga completa: /blog es dinámico (lee filtros de la URL) y sin esto
            // no se precarga; así todas las secciones del menú abren al instante
            prefetch
            aria-current={activo ? 'page' : undefined}
            className={`relative rounded-lg px-3.5 py-2 text-sm transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition-colors ${
              activo
                ? 'bg-brand-50 font-semibold text-brand-900 after:bg-dorado'
                : 'font-medium text-texto after:bg-transparent hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
