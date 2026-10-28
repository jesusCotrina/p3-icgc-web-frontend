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
    imagen: '/hero/paisaje-andino-laguna-quellacocha.webp',
    dondeSeUsa: 'Portada del inicio',
    autor: 'Nina Reicer',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Quellacocha_(Amazing_Andean_landscape_with_glacial_lake)_04.jpg',
  },
  {
    imagen: '/servicios/empresas-comunales.webp',
    dondeSeUsa: 'Servicio “Constitución y fortalecimiento de empresas comunales”',
    autor: 'AgainErick',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Granja_Porc%C3%B3n_-_View_with_vicu%C3%B1as.jpg',
  },
  {
    imagen: '/servicios/organizacion-y-gestion-comunal.webp',
    dondeSeUsa: 'Servicio “Organización y gestión comunal”',
    autor: 'Thayne Tuason',
    licencia: 'CC BY 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Chinchero_Peru-_Community_meeting.jpg',
  },
  {
    imagen: '/servicios/negociacion-de-tierras-y-convenios.webp',
    dondeSeUsa: 'Servicio “Negociación de tierras y convenios”',
    autor: 'HighVoltage 5576',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Mina_Cerro_de_Pasco1.jpg',
  },
  {
    imagen: '/servicios/gestion-social-y-conflictos.webp',
    dondeSeUsa: 'Servicio “Gestión social y manejo de conflictos”',
    autor: 'QM Keen',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Inicio_de_la_mesa_de_di%C3%A1logo_en_Gesti%C3%B3n_Popular_del_Riesgo_del_Desastre_%2B_OpenStreetMap_Per%C3%BA_2022.jpg',
  },
  {
    imagen: '/servicios/gestion-de-proyectos-y-obras.webp',
    dondeSeUsa: 'Servicio “Gestión de proyectos y obras”',
    autor: 'Thayne Tuason',
    licencia: 'CC BY 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Urubamba-_Road_construction-_big_hole.jpg',
  },
  {
    imagen: '/servicios/licitaciones-y-contratos.webp',
    dondeSeUsa: 'Servicio “Licitaciones y administración de contratos”',
    autor: 'Blogtrepreneur',
    licencia: 'CC BY 2.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Legal_Contract_%26_Signature_-_Warm_Tones.jpg',
  },
  {
    imagen: '/servicios/gestion-empresarial-y-financiera.webp',
    dondeSeUsa: 'Servicio “Gestión empresarial, financiera y control de gestión”',
    autor: 'Shixart1985',
    licencia: 'CC BY 2.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Business_professional_engages_in_note-taking_during_a_meeting_at_a_modern_office_desk.jpg',
  },
  {
    imagen: '/servicios/asesoria-legal-y-ambiental.webp',
    dondeSeUsa: 'Servicio “Asesoría legal y acompañamiento ambiental”',
    autor: 'NPS staff (Servicio de Parques Nacionales de EE. UU.)',
    licencia: 'Dominio público',
    original:
      'https://commons.wikimedia.org/wiki/File:Charley_River_Water_Quality_Testing,_Yukon-Charley_Rivers,_2003_(5ab3809c-f437-4519-97b4-b9e895deca9b).jpg',
  },
  {
    imagen: '/inicio/taller-mapeo-participativo.webp',
    dondeSeUsa: 'Servicio “Capacitación y desarrollo de capacidades”',
    autor: 'Candy Sotomayor',
    licencia: 'CC BY-SA 4.0',
    original:
      'https://commons.wikimedia.org/wiki/File:Taller_Mapeo_participativo_para_la_justicia_clim%C3%A1tica_02.jpg',
  },
];
