import type { DiaPlan, DiaSemana } from '@/types/gym';
import { COLORES_DIAS } from '@/constants/colores';

// Calentamientos de la ficha (origen: GymTrack).
export const CALENTAMIENTO_INICIAL_MIN = 5;
export const CALENTAMIENTO_FINAL_MIN = 10;
export const CALENTAMIENTO_OPCIONES = 'Trote, bicicleta o elíptica';

export const planSemanal: DiaPlan[] = [
  {
    dia: 'lunes',
    enfoque: 'Full body',
    color: COLORES_DIAS.lunes,
    ejercicios: ['pec-01', 'esp-04', 'hom-01', 'pie-01', 'bic-01', 'tri-02', 'abd-01'],
  },
  {
    dia: 'martes',
    enfoque: 'Pierna + cardio',
    color: COLORES_DIAS.martes,
    ejercicios: ['pie-01', 'pie-02', 'pie-03', 'pie-04', 'pie-05'],
    cardioMin: 20,
  },
  {
    dia: 'miercoles',
    enfoque: 'Tren superior + abdomen',
    color: COLORES_DIAS.miercoles,
    ejercicios: ['pec-02', 'pec-04', 'hom-02', 'hom-03', 'tri-01', 'bic-04', 'abd-02', 'abd-03'],
  },
  {
    dia: 'jueves',
    enfoque: 'Pierna + tren superior',
    color: COLORES_DIAS.jueves,
    ejercicios: ['pie-02', 'pie-04', 'esp-02', 'esp-03', 'lum-02', 'bic-02', 'tri-03'],
  },
  {
    dia: 'viernes',
    enfoque: 'Full body',
    color: COLORES_DIAS.viernes,
    ejercicios: ['pec-01', 'esp-04', 'hom-01', 'pie-01', 'bic-01', 'tri-02', 'abd-01'],
  },
  {
    dia: 'sabado',
    enfoque: 'Glúteo + cardio',
    color: COLORES_DIAS.sabado,
    ejercicios: ['glu-01', 'cad-01', 'cad-02', 'lum-03', 'ant-01', 'ant-02'],
    cardioMin: 20,
  },
];

// Utilidades del plan (origen: GymTrack).
export function obtenerPlanPorDia(dia: DiaSemana): DiaPlan | undefined {
  return planSemanal.find((item) => item.dia === dia);
}

export function esDiaSemanaValido(valor: string): valor is DiaSemana {
  return planSemanal.some((item) => item.dia === valor);
}

/** Día del plan que corresponde a hoy; `null` el domingo (descanso). */
export function obtenerDiaActual(): DiaSemana | null {
  const mapaDias: Record<number, DiaSemana> = {
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado',
  };
  return mapaDias[new Date().getDay()] ?? null;
}
