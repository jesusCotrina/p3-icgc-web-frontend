/**
 * Genera src/lib/peru-mapa.ts (trazos SVG de los departamentos del Perú) a
 * partir de un GeoJSON. Se corre una sola vez; el resultado es estático y se
 * renderiza en el servidor, así que el mapa no agrega JS ni peticiones.
 *
 * Uso: node scripts/generar-mapa-peru.mjs <peru_departamental_simple.geojson>
 * Fuente: https://github.com/juaneladio/peru-geojson (MPL-2.0)
 */
import fs from 'node:fs';
import path from 'node:path';

const ANCHO = 600;
const MARGEN = 8;

const NOMBRES = {
  AMAZONAS: 'Amazonas', ANCASH: 'Áncash', APURIMAC: 'Apurímac', AREQUIPA: 'Arequipa',
  AYACUCHO: 'Ayacucho', CAJAMARCA: 'Cajamarca', CALLAO: 'Callao', CUSCO: 'Cusco',
  HUANCAVELICA: 'Huancavelica', HUANUCO: 'Huánuco', ICA: 'Ica', JUNIN: 'Junín',
  'LA LIBERTAD': 'La Libertad', LAMBAYEQUE: 'Lambayeque', LIMA: 'Lima', LORETO: 'Loreto',
  'MADRE DE DIOS': 'Madre de Dios', MOQUEGUA: 'Moquegua', PASCO: 'Pasco', PIURA: 'Piura',
  PUNO: 'Puno', 'SAN MARTIN': 'San Martín', TACNA: 'Tacna', TUMBES: 'Tumbes', UCAYALI: 'Ucayali',
};

// Ajustes manuales de la etiqueta (en unidades del SVG) donde el centroide
// cae mal o choca con la región vecina
const AJUSTE_ETIQUETA = {
  CALLAO: null, // demasiado pequeño: se nombra solo en la leyenda
  LIMA: [6, 6],
  TUMBES: [-2, -10],
  LAMBAYEQUE: [-8, 2],
  CAJAMARCA: [10, 4],
  AYACUCHO: [-8, 4],
  APURIMAC: [6, 2],
  MOQUEGUA: [-2, 2],
  TACNA: [0, 2],
  PASCO: [0, 2],
  HUANCAVELICA: [-2, 4],
};

const slug = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-');

const geo = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const poligonos = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);

// Proyección equirectangular corregida por la latitud media del Perú:
// a esta escala es indistinguible de Mercator y es trivial de invertir.
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
for (const f of geo.features)
  for (const pol of poligonos(f.geometry))
    for (const [lon, lat] of pol[0]) {
      minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
    }
const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
const escala = (ANCHO - 2 * MARGEN) / ((maxLon - minLon) * kx);
const ALTO = Math.ceil((maxLat - minLat) * escala + 2 * MARGEN);
const px = (lon) => +(MARGEN + (lon - minLon) * kx * escala).toFixed(1);
const py = (lat) => +(MARGEN + (maxLat - lat) * escala).toFixed(1);

/** Centroide de un anillo (fórmula del área con signo). */
function centroide(anillo) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < anillo.length - 1; i++) {
    const [x0, y0] = anillo[i], [x1, y1] = anillo[i + 1];
    const t = x0 * y1 - x1 * y0;
    a += t; cx += (x0 + x1) * t; cy += (y0 + y1) * t;
  }
  return { area: Math.abs(a / 2), x: cx / (3 * a), y: cy / (3 * a) };
}

const regiones = geo.features.map((f) => {
  const clave = f.properties.NOMBDEP;
  let d = '';
  let mayor = { area: 0, x: 0, y: 0 };
  for (const pol of poligonos(f.geometry)) {
    for (const anillo of pol) {
      const pts = anillo.map(([lon, lat]) => [px(lon), py(lat)]);
      // Quita puntos repetidos tras el redondeo
      const limpio = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
      d += `M${limpio.map((p) => p.join(' ')).join('L')}Z`;
    }
    const c = centroide(pol[0].map(([lon, lat]) => [px(lon), py(lat)]));
    if (c.area > mayor.area) mayor = c;
  }
  const ajuste = AJUSTE_ETIQUETA[clave];
  const etiqueta =
    ajuste === null ? null : [+(mayor.x + (ajuste?.[0] ?? 0)).toFixed(1), +(mayor.y + (ajuste?.[1] ?? 0)).toFixed(1)];
  return { id: slug(clave), nombre: NOMBRES[clave] ?? clave, d, etiqueta };
});
regiones.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

const salida = `/* eslint-disable */
/**
 * ARCHIVO GENERADO por scripts/generar-mapa-peru.mjs. No editar a mano.
 *
 * Límites departamentales derivados de "peru-geojson" de Juan Eladio
 * (https://github.com/juaneladio/peru-geojson), distribuido bajo la
 * Mozilla Public License 2.0 (https://mozilla.org/MPL/2.0/). Este archivo,
 * como obra derivada, se distribuye bajo la misma licencia.
 */

export const MAPA_ANCHO = ${ANCHO};
export const MAPA_ALTO = ${ALTO};

export type RegionMapa = {
  id: string;
  nombre: string;
  /** Trazo SVG del departamento */
  d: string;
  /** Posición del nombre; null si la región es muy pequeña para rotularla */
  etiqueta: [number, number] | null;
};

/** Convierte longitud/latitud en coordenadas del SVG del mapa. */
export function proyectar(lon: number, lat: number): [number, number] {
  return [
    ${MARGEN} + (lon - (${minLon})) * ${kx * escala},
    ${MARGEN} + (${maxLat} - lat) * ${escala},
  ];
}

export const REGIONES: RegionMapa[] = ${JSON.stringify(regiones)};
`;

const destino = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'src', 'lib', 'peru-mapa.ts');
fs.writeFileSync(destino, salida);
console.log(`OK ${destino} ${ANCHO}x${ALTO} ${(salida.length / 1024).toFixed(1)} KB`);
