import Image from 'next/image';
import Link from 'next/link';
import { logoSrc } from '@/lib/api';
import type { SiteSettingsDTO } from '@/lib/types';
import { propsEnlace, whatsappUrl } from '@/lib/whatsapp';
import { WhatsAppIcon } from './Icons';
import { MobileMenu } from './MobileMenu';
import { NavLinks } from './NavLinks';

export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/blog', label: 'Blog' },
  { href: '/nosotros', label: 'Nosotros' },
] as const;

/**
 * Server Component: el menú se entrega en el HTML inicial.
 * Googlebot necesita ver estos enlaces para descubrir y repartir autoridad
 * entre las secciones del sitio. Solo el botón hamburguesa es cliente.
 */
export function Header({ settings }: { settings: SiteSettingsDTO }) {
  const waUrl = whatsappUrl(settings, 'general');

  // Blanco, con el contraste de la paleta: nombre en azul institucional y detalles en dorado
  return (
    <header className="sticky top-0 z-40 border-b border-silver-200 bg-white/95 backdrop-blur-md">
      <div className="container-icgc flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={`${settings.siteName} - ir al inicio`}
        >
          <Image
            src={logoSrc(settings)}
            alt={settings.logoAlt}
            width={52}
            height={52}
            priority
            className="h-12 w-12 shrink-0 rounded-full object-contain"
          />
          {/* El nombre completo es la marca que queremos asociar en Google.
              En móvil se corta a "ICGC" para que quepa sin romper la barra. */}
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-brand-900 sm:hidden">
              ICGC
            </span>
            <span className="hidden max-w-[17rem] text-[1.08rem] font-extrabold leading-[1.15] tracking-tight text-texto sm:block xl:max-w-none">
              Instituto de Capacitación
              <span className="block font-bold text-brand-900">en Gestión Comunal</span>
            </span>
          </span>
        </Link>

        {/* Menú y botón juntos, alineados a la derecha */}
        <div className="flex items-center gap-2 lg:gap-4">
          <NavLinks links={NAV_LINKS} />

          {/* El número sale de los datos generales del gestor; si está vacío,
              whatsappUrl() devuelve el formulario de /nosotros y el botón sigue sirviendo. */}
          <Link href={waUrl} {...propsEnlace(waUrl)} className="btn-primary hidden font-bold md:inline-flex">
            <WhatsAppIcon size={18} />
            Solicitar información
          </Link>
          <MobileMenu links={NAV_LINKS} whatsappUrl={waUrl} />
        </div>
      </div>
    </header>
  );
}
