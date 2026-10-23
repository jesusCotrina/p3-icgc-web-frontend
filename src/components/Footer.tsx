import Image from 'next/image';
import Link from 'next/link';
import { direccionDelSitio } from '@/lib/direccion';
import { logoSrc } from '@/lib/api';
import type { CategoryDTO, SiteSettingsDTO } from '@/lib/types';
import { whatsappUrl } from '@/lib/whatsapp';
import { WhatsAppIcon } from './Icons';

/** Crédito del desarrollador del sitio. Solo se cambia aquí, a propósito. */
const DESARROLLADOR = {
  nombre: 'Prometeo',
  url: 'https://prometeo-web-puce.vercel.app/',
} as const;

/** Llama de Prometeo (su isotipo), en el blanco del footer con el centro rojo de su marca. */
function LogoPrometeo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M16 2c3.6 4.2 5.2 8 4.4 11.4 2-1 3.3-2.9 3.9-5.6C27 11 28 14.6 28 18a12 12 0 1 1-23.4-3.7c.5 2 1.7 3.5 3.6 4.4-1-4.2.9-8.8 7.8-16.7Z"
        fill="currentColor"
      />
      <path
        d="M16 13c1.9 2.4 2.7 4.7 2.3 6.9 1-.6 1.7-1.7 2-3.3 1 1.6 1.5 3.4 1.5 5.2a5.8 5.8 0 1 1-11.6 0c0-1.1.3-2.2.9-3.2.3 1.1.9 1.9 1.9 2.4-.6-2.3.4-4.8 3.1-8Z"
        fill="#C20E28"
      />
    </svg>
  );
}

/** Íconos de trazo de las redes (mismo estilo que el resto de íconos del sitio). */
const ICONOS_REDES: Record<string, React.ReactNode> = {
  Facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  YouTube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  LinkedIn: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  TikTok: <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />,
};

/**
 * El footer es la red de enlazado interno del sitio: desde cualquier página
 * se llega a las secciones clave y a las categorías del blog, lo que ayuda a
 * Google a rastrear todo y evita páginas huérfanas.
 */
export function Footer({
  settings,
  categories,
}: {
  settings: SiteSettingsDTO;
  categories: CategoryDTO[];
}) {
  const year = new Date().getFullYear();

  // Las URLs salen de los ajustes del gestor. Sin URL, el ícono se muestra
  // atenuado y no lleva a ningún lado (nunca un enlace roto o a "#").
  const waUrl = whatsappUrl(settings, 'general');
  const redes = [
    { url: settings.facebookUrl, label: 'Facebook' },
    { url: settings.instagramUrl, label: 'Instagram' },
    { url: settings.youtubeUrl, label: 'YouTube' },
    { url: settings.linkedinUrl, label: 'LinkedIn' },
    { url: settings.tiktokUrl, label: 'TikTok' },
    { url: waUrl.startsWith('http') ? waUrl : null, label: 'WhatsApp' },
  ];

  // El mapa apunta a la dirección de los datos generales del gestor; si aún
  // no se cargó, a la ciudad
  // La del gestor o, si está vacía, la dirección por defecto del instituto
  const direccion = direccionDelSitio(settings);
  const lugar = direccion.busqueda;
  const mapaUrl = `https://www.google.com/maps?q=${encodeURIComponent(lugar)}&output=embed`;

  return (
    <footer className="mt-24 bg-brand-gradient text-brand-100">
      <div className="container-icgc py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1.1fr_0.8fr_0.8fr_1fr_1.6fr]">
          {/* Identidad */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src={logoSrc(settings)}
                alt={settings.logoAlt}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full bg-white object-contain p-0.5"
              />
              <span className="text-xl font-extrabold text-white">ICGC</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">
              {settings.tagline}
            </p>
          </div>

          {/* Navegación */}
          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav" className="text-sm font-bold uppercase tracking-wider text-white">
              Navegación
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { href: '/proyectos', label: 'Asesoría en proyectos' },
                { href: '/cursos', label: 'Cursos de capacitación' },
                { href: '/nosotros', label: 'Sobre el instituto' },
                { href: '/blog', label: 'Blog de gestión comunal' },
                { href: '/nosotros#contacto', label: 'Contacto e informes' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-200 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Temas del blog: enlazado interno hacia las categorías */}
          <nav aria-labelledby="footer-temas">
            <h2 id="footer-temas" className="text-sm font-bold uppercase tracking-wider text-white">
              Temas
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.length > 0 ? (
                categories.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/blog?category=${c.slug}`}
                      className="text-brand-200 transition-colors hover:text-white"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-brand-300">Próximamente</li>
              )}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contacto</h2>
            <ul className="mt-5 space-y-3 text-sm text-brand-200">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              <li>{direccion.texto}, Perú</li>
            </ul>
          </div>

          {/* Ubicación. loading="lazy": el iframe de Maps pesa y está al final
              de la página, no debe competir con el LCP */}
          <div className="md:col-span-2 lg:col-span-4 xl:col-span-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Ubicación</h2>
            <div className="mt-5 overflow-hidden rounded-xl border border-white/15">
              <iframe
                src={mapaUrl}
                title={`Mapa de ubicación del ${settings.siteName} en ${lugar}`}
                width="600"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-56 w-full border-0"
              />
            </div>
            {/* La dirección también como texto: se lee sin cargar el mapa y Google la indexa */}
            <address className="mt-3 flex items-start gap-2 text-sm not-italic text-brand-100">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-brand-300"
              >
                <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {direccion.texto}, Perú
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-brand-200 transition-colors hover:text-white"
            >
              Cómo llegar al instituto en Google Maps
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/15 pt-8 text-xs text-brand-300 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.siteName}. Todos los derechos reservados.{' '}
            {/* La atribución de las fotos con licencia Creative Commons va en esa página */}
            <Link
              href="/creditos"
              className="underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              Créditos de las fotos
            </Link>
          </p>
          {/* Redes sociales: solo íconos */}
          <ul aria-label="Redes sociales" className="flex items-center gap-2">
            {redes.map((r) => {
              const icono =
                r.label === 'WhatsApp' ? (
                  <WhatsAppIcon size={18} />
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICONOS_REDES[r.label]}
                  </svg>
                );
              return (
                <li key={r.label}>
                  {r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`${settings.siteName} en ${r.label}`}
                      title={r.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-brand-800"
                    >
                      {icono}
                    </a>
                  ) : (
                    <span
                      aria-hidden="true"
                      title={`${r.label}: próximamente`}
                      className="inline-flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-white/10 text-white/35"
                    >
                      {icono}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Crédito del desarrollador: fijo en el código, no se edita desde el gestor */}
          <p className="flex items-center gap-1.5">
            Diseñado por
            <a
              href={DESARROLLADOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-white transition-opacity hover:opacity-80"
            >
              <LogoPrometeo />
              {DESARROLLADOR.nombre}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
