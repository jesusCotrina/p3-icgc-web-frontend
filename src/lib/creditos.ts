/**
 * Créditos de las fotos fijas del sitio (las que viven en public/).
 *
 * Las licencias Creative Commons exigen nombrar al autor y la licencia. El
 * crédito no va sobre la foto: se publica en /creditos, enlazada desde el pie.
 * Las fotos que se suben desde el gestor llevan su crédito en el campo
 * "caption" de Multimedia y la página las agrega solas.
 */
export type CreditoFijo = {
  imagen: string;
  dondeSeUsa: string;
  autor: string;
  licencia: string;
  original: string;
};

export const CREDITOS_FIJOS: readonly CreditoFijo[] = [
  {
    imagen: '/hero/linderaje-comunidad-campesina-yanacona.webp',
    dondeSeUsa: 'Portada del inicio e imagen para compartir en redes',
    autor: 'AleliPao',
    licencia: 'CC BY-SA 4.0',
    original: 'https://commons.wikimedia.org/wiki/File:Linderaje_comunidad_campesina_Yanacona.jpg',
  },
  {
    imagen: '/hero/comunidad-campesina-santa-cruz-de-cumi.webp',
    dondeSeUsa: 'Portada del inicio',
    autor: 'Ordzonhyd Rudyard Tarco Palomino',
    licencia: 'CC BY 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Comunidad_Campesina_Santa_Cruz_de_Cumi_04.jpg',
  },
  {
    imagen: '/nosotros/area-ingenieria-grua.webp',
    dondeSeUsa: 'Nosotros: área de Ingeniería del equipo',
    autor: 'Flocci Nivis',
    licencia: 'CC BY 4.0',
    original: 'https://commons.wikimedia.org/wiki/File:20200417_Quartier_Eurobahnhof_01.jpg',
  },
  {
    imagen: '/nosotros/area-derecho-mazo.webp',
    dondeSeUsa: 'Nosotros: área de Derecho del equipo',
    autor: 'succo',
    licencia: 'CC0 (dominio público)',
    original: 'https://commons.wikimedia.org/wiki/File:Hammer-gbad3af78e_1920.jpg',
  },
  {
    imagen: '/nosotros/area-gestion-empresarial-oficina.webp',
    dondeSeUsa: 'Nosotros: área de Gestión Empresarial del equipo',
    autor: 'Shixart1985',
    licencia: 'CC BY 2.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Business_professional_engages_in_note-taking_during_a_meeting_at_a_modern_office_desk.jpg',
  },
];
