import { Ionicons } from '@expo/vector-icons';
import type { GrupoMuscular } from '@/types/gym';

export interface InfoGrupoMuscular {
  clave: GrupoMuscular;
  nombre: string;
  icono: keyof typeof Ionicons.glyphMap;
}

export const GRUPOS_MUSCULARES: InfoGrupoMuscular[] = [
  { clave: 'pierna', nombre: 'Pierna', icono: 'walk-outline' },
  { clave: 'pecho', nombre: 'Pecho', icono: 'shield-outline' },
  { clave: 'triceps', nombre: 'Tríceps', icono: 'barbell-outline' },
  { clave: 'espalda', nombre: 'Espalda', icono: 'body-outline' },
  { clave: 'hombro', nombre: 'Hombro', icono: 'fitness-outline' },
  { clave: 'biceps', nombre: 'Bíceps', icono: 'hand-left-outline' },
  { clave: 'abdomen', nombre: 'Abdomen', icono: 'disc-outline' },
  { clave: 'cadera', nombre: 'Cadera', icono: 'radio-button-on-outline' },
  { clave: 'gluteo', nombre: 'Glúteo', icono: 'flame-outline' },
  { clave: 'lumbar', nombre: 'Lumbar', icono: 'pulse-outline' },
  { clave: 'antebrazo', nombre: 'Antebrazo', icono: 'hand-right-outline' },
];
