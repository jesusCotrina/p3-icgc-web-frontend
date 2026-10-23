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
    original: 'https://commons.wikimedia.org/wiki/File:Comunidad_Campesina_Santa_Cruz_de_Cumi_04.jpg',
  },
  {
    imagen: '/hero/paisaje-andino-laguna-quellacocha.webp',
    dondeSeUsa: 'Portada del inicio',
    autor: 'Nina Reicer',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Quellacocha_(Amazing_Andean_landscape_with_glacial_lake)_04.jpg',
  },
  {
    imagen: '/inicio/asamblea-comunal-tiquihua.webp',
    dondeSeUsa: 'Inicio, tarjeta “Consultoría y asesoría”',
    autor: 'Txolo',
    licencia: 'CC BY-SA 4.0',
    original: 'https://commons.wikimedia.org/wiki/File:Asamblea_comunal_en_la_comunidad_de_Tiquihua.jpg',
  },
  {
    imagen: '/inicio/taller-mapeo-participativo.webp',
    dondeSeUsa: 'Inicio, tarjeta “Cursos y capacitación”',
    autor: 'Candy Sotomayor',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Taller_Mapeo_participativo_para_la_justicia_clim%C3%A1tica_02.jpg',
  },
];
