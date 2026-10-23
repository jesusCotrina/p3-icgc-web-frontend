'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { WhatsAppIcon } from './Icons';
import { esRutaActiva } from './NavLinks';

type NavLink = { href: string; label: string };

/**
 * Único trozo interactivo del header.
 *
 * Los enlaces se renderizan siempre en el HTML (ocultos con CSS, no con JS):
 * así Googlebot los ve aunque nunca "abra" el menú.
 */
export function MobileMenu({
  links,
  whatsappUrl,
}: {
  links: readonly NavLink[];
  /** Mismo destino que el boton del header: wa.me o el formulario de /nosotros si no hay numero */
  whatsappUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Al navegar, el panel se cierra
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquea el scroll del fondo mientras el panel está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-silver-200 text-brand-800 transition-colors hover:bg-brand-50"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      <div
        id="menu-movil"
        hidden={!open}
        className="fixed inset-x-0 top-20 z-40 border-b border-silver-200 bg-white shadow-card-hover"
      >
        <nav aria-label="Navegación móvil" className="container-icgc flex flex-col gap-1 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={esRutaActiva(pathname, link.href) ? 'page' : undefined}
              className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                esRutaActiva(pathname, link.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-brand-900 hover:bg-brand-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={whatsappUrl}
            {...(whatsappUrl.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="btn-whatsapp mt-2"
          >
            <WhatsAppIcon size={18} />
            Solicitar información
          </Link>
        </nav>
      </div>
    </div>
  );
}
