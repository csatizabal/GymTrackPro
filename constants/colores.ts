import type { DiaSemana, GrupoMuscular } from '@/types/gym';

// Paleta única de la app (origen: GymTrack2). Los componentes traídos de
// GymTrack usaban `TEMA`; se migraron a estas mismas claves.
export const COLORES_DIAS: Record<DiaSemana, string> = {
  lunes: '#38BDF8',
  martes: '#FB923C',
  miercoles: '#34D399',
  jueves: '#F472B6',
  viernes: '#38BDF8',
  sabado: '#C6F432',
};

// Paleta "Grafito + lima" (rediseño moderno). Las claves no cambian: todos los
// componentes la consumen, así el cambio de diseño se hace en un solo lugar.
export const COLORES_APP = {
  fondo: '#0B0D12',
  superficie: '#151922',
  superficieClara: '#202634',
  borde: '#262D3B',
  texto: '#F5F7FA',
  textoSecundario: '#9AA3B2',
  primario: '#C6F432',
  primarioFondo: 'rgba(198, 244, 50, 0.14)',
  acento: '#8B7CFF',
  exito: '#34D399',
  peligro: '#F87171',
  peligroFondo: 'rgba(248, 113, 113, 0.14)',
  advertencia: '#FBBF24',
  advertenciaFondo: 'rgba(251, 191, 36, 0.14)',
  advertenciaBorde: '#B7791F',
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
