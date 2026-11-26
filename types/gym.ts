import type { ImageSourcePropType } from 'react-native';

export type DiaSemana =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado';

export type GrupoMuscular =
  | 'pierna'
  | 'pecho'
  | 'triceps'
  | 'espalda'
  | 'hombro'
  | 'biceps'
  | 'abdomen'
  | 'cadera'
  | 'gluteo'
  | 'lumbar'
  | 'antebrazo';

export interface Ejercicio {
  id: string; // 'pec-01'
  nombre: string;
  grupo: GrupoMuscular;
  series: number; // 4
  repeticiones: number; // 12
  imagen?: ImageSourcePropType;
}

export interface DiaPlan {
  dia: DiaSemana;
  enfoque: string;
  color: string;
  ejercicios: string[]; // ids de Ejercicio
  cardioMin?: number;
}

export type PerimetroClave =
  | 'hombro'
  | 'brazo'
  | 'antebrazo'
  | 'pecho'
  | 'abdomen'
  | 'cadera'
  | 'pierna'
  | 'pantorrilla';

export interface Medida {
  mes: string; // '2026-11'
  estaturaM: number;
  pesoKg: number;
  perimetrosCm: Record<PerimetroClave, number>;
}

export interface Socio {
  nombre: string;
  edad: number;
  fechaAsignacion: string; // '2026-11-04'
  objetivo: string;
  observaciones: string[];
  lesiones: GrupoMuscular[];
  medidas: Medida[];
}

/** Una serie registrada en una sesión de entrenamiento (tabla `series`). */
export interface Serie {
  id: number;
  fecha: string; // '2026-11-26' (fecha local)
  ejercicioId: string;
  repeticiones: number;
  pesoKg: number;
}

export type NuevaSerie = Omit<Serie, 'id'>;

/** Recordatorio semanal de entrenamiento (tabla `ajustes`). */
export interface Recordatorio {
  activo: boolean;
  hora: number; // 0-23
  minuto: number; // 0-59
}
