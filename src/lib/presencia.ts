import { PERU_REGIONS, type ProjectDTO } from './types';

/**
 * Cifras de presencia del instituto, calculadas SIEMPRE a partir de los
 * proyectos publicados en el gestor. El hero, los totales del mapa y cada
 * marcador salen de aquí, así que nunca pueden contradecirse.
 */

export type ResumenPresencia = {
  proyectos: number;
  regiones: number;
  comunidades: number;
};

export type PresenciaRegion = {
  region: string;
  nombre: string;
  proyectos: number;
  comunidades: number;
  /** Promedio de las coordenadas de sus proyectos; null si ninguno las tiene */
  lon: number | null;
  lat: number | null;
  titulos: string[];
};

export const nombreRegion = (id: string): string =>
  PERU_REGIONS.find((r) => r.id === id)?.name ?? id;

export function resumenPresencia(proyectos: ProjectDTO[]): ResumenPresencia {
  return {
    proyectos: proyectos.length,
    regiones: new Set(proyectos.map((p) => p.region)).size,
    comunidades: proyectos.reduce((total, p) => total + p.communitiesBenefited, 0),
  };
}

export function presenciaPorRegion(proyectos: ProjectDTO[]): PresenciaRegion[] {
  const grupos = new Map<string, ProjectDTO[]>();
  for (const p of proyectos) grupos.set(p.region, [...(grupos.get(p.region) ?? []), p]);

  return [...grupos.entries()].map(([region, lista]) => {
    const conCoordenadas = lista.filter((p) => p.latitude != null && p.longitude != null);
    const promedio = (valores: number[]) => valores.reduce((a, b) => a + b, 0) / valores.length;

    return {
      region,
      nombre: nombreRegion(region),
      proyectos: lista.length,
      comunidades: lista.reduce((total, p) => total + p.communitiesBenefited, 0),
      lon: conCoordenadas.length ? promedio(conCoordenadas.map((p) => p.longitude!)) : null,
      lat: conCoordenadas.length ? promedio(conCoordenadas.map((p) => p.latitude!)) : null,
      titulos: lista.map((p) => p.title),
    };
  });
}
