import type { PerimetroClave } from '@/types/gym';

export interface DefPerimetro {
  clave: PerimetroClave;
  etiqueta: string;
}

export const PERIMETROS_DEF: DefPerimetro[] = [
  { clave: 'hombro', etiqueta: 'Hombro' },
  { clave: 'brazo', etiqueta: 'Brazo' },
  { clave: 'antebrazo', etiqueta: 'Antebrazo' },
  { clave: 'pecho', etiqueta: 'Pecho' },
  { clave: 'abdomen', etiqueta: 'Abdomen' },
  { clave: 'cadera', etiqueta: 'Cadera' },
  { clave: 'pierna', etiqueta: 'Pierna' },
  { clave: 'pantorrilla', etiqueta: 'Pantorrilla' },
];
