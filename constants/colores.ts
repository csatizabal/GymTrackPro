import type { DiaSemana, GrupoMuscular } from '@/types/gym';

// Paleta única de la app (origen: GymTrack2). Los componentes traídos de
// GymTrack usaban `TEMA`; se migraron a estas mismas claves.
export const COLORES_DIAS: Record<DiaSemana, string> = {
  lunes: '#22C3E6',
  martes: '#F59E0B',
  miercoles: '#22C55E',
  jueves: '#EC4899',
  viernes: '#22C3E6',
  sabado: '#A3E635',
};

export const COLORES_APP = {
  fondo: '#0F172A',
  superficie: '#1E293B',
  superficieClara: '#334155',
  borde: '#475569',
  texto: '#F8FAFC',
  textoSecundario: '#94A3B8',
  primario: '#38BDF8',
  primarioFondo: 'rgba(56, 189, 248, 0.16)',
  acento: '#F59E0B',
  exito: '#22C55E',
  peligro: '#EF4444',
  peligroFondo: 'rgba(239, 68, 68, 0.16)',
  advertencia: '#EAB308',
  advertenciaFondo: '#713F12',
  advertenciaBorde: '#CA8A04',
};

// Catálogos de nombres y orden (origen: GymTrack).
export const DIAS_ORDEN: DiaSemana[] = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export const NOMBRES_DIA: Record<DiaSemana, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
};

export const GRUPOS_ORDEN: GrupoMuscular[] = [
  'pierna',
  'pecho',
  'triceps',
  'espalda',
  'hombro',
  'biceps',
  'abdomen',
  'cadera',
  'gluteo',
  'lumbar',
  'antebrazo',
];

export const NOMBRES_GRUPO: Record<GrupoMuscular, string> = {
  pierna: 'Pierna',
  pecho: 'Pecho',
  triceps: 'Tríceps',
  espalda: 'Espalda',
  hombro: 'Hombro',
  biceps: 'Bíceps',
  abdomen: 'Abdomen',
  cadera: 'Cadera',
  gluteo: 'Glúteo',
  lumbar: 'Lumbar',
  antebrazo: 'Antebrazo',
};
