import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { IndicadorNavegacion } from '@/components/IndicadorNavegacion';
import { JsonLd } from '@/components/JsonLd';
import { getCategories, getSettings, SITE_URL } from '@/lib/api';
import { OG_POR_DEFECTO, organizationSchema, websiteSchema } from '@/lib/seo';
import './globals.css';

// next/font autohospeda la fuente: sin petición a Google Fonts en tiempo de
// ejecución, sin FOUT y sin penalización en los Core Web Vitals.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B2545',
};

/**
 * Metadata base del sitio. `metadataBase` hace que todas las URLs relativas
 * (canónicas, Open Graph) se resuelvan como absolutas, que es lo que exigen
 * Google y las redes sociales.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${settings.siteName}`,
      // Toda página hija hereda la marca sin repetirla a mano
      template: `%s | ICGC`,
    },
    description: settings.defaultMetaDescription,
    applicationName: 'ICGC',
    authors: [{ name: settings.siteName, url: SITE_URL }],
    creator: settings.siteName,
    publisher: settings.siteName,
    category: 'education',
    keywords: [
      'gestión comunal',
      'capacitación comunal',
      'comunidades campesinas',
      'comunidades nativas',
      'instituto de capacitación',
      'dirigentes comunales',
      'ICGC',
      'Perú',
    ],
    // Sin canónica por defecto: cada página declara la suya en buildMetadata().
    // Una canónica "/" heredada haría que Google tome cualquier página olvidada
    // como duplicado del inicio.
    alternates: {
      types: { 'application/rss+xml': [{ url: `${SITE_URL}/blog/rss.xml`, title: 'Blog del ICGC' }] },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'es_PE',
      url: SITE_URL,
      siteName: settings.siteName,
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: [settings.ogImage ? { url: settings.ogImage.url, alt: settings.siteName } : OG_POR_DEFECTO],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: [settings.ogImage?.url ?? OG_POR_DEFECTO.url],
    },
    icons: {
      icon: settings.logo?.url ?? '/logo-icgc.png',
      apple: settings.logo?.url ?? '/logo-icgc.png',
    },
    ...(settings.googleSiteVerification
      ? { verification: { google: settings.googleSiteVerification } }
      : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Se resuelven en paralelo: el layout no debe retrasar el primer byte
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    // lang correcto: le dice a Google en qué idioma y para qué país es el contenido
    <html lang="es-PE" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        {/* Accesibilidad: saltar la navegación con el teclado */}
        <a href="#contenido" className="skip-link">
          Saltar al contenido principal
        </a>

        {/* Organización y sitio web: se declaran una sola vez, en el layout */}
        <JsonLd data={[organizationSchema(settings), websiteSchema(settings)]} />

        <IndicadorNavegacion />
        <Header settings={settings} />

        <main id="contenido" className="flex-1">
          {children}
        </main>

        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}
