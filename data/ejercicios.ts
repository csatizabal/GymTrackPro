import { GRUPOS_ORDEN } from '@/constants/colores';
import type { Ejercicio, GrupoMuscular } from '@/types/gym';

export const ejercicios: Ejercicio[] = [
  // Pierna (5)
  {
    id: 'pie-01',
    nombre: 'Media prensa 45°',
    grupo: 'pierna',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Media prensa 45°.png'),
  },
  {
    id: 'pie-02',
    nombre: 'Extensión de cuádriceps',
    grupo: 'pierna',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Extensión de cuádriceps.png'),
  },
  {
    id: 'pie-03',
    nombre: 'Desplazamiento con mancuerna',
    grupo: 'pierna',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Desplazamiento con mancuerna.png'),
  },
  {
    id: 'pie-04',
    nombre: 'Curl femoral',
    grupo: 'pierna',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Curl femoral.png'),
  },
  {
    id: 'pie-05',
    nombre: 'Pantorrilla sentado',
    grupo: 'pierna',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Pantorrilla sentado.png'),
  },

  // Pecho (4)
  {
    id: 'pec-01',
    nombre: 'Press banca plano',
    grupo: 'pecho',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Press banca plano.png'),
  },
  {
    id: 'pec-02',
    nombre: 'Vuelos',
    grupo: 'pecho',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Vuelos.png'),
  },
  {
    id: 'pec-03',
    nombre: 'Crossover',
    grupo: 'pecho',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Crossover.png'),
  },
  {
    id: 'pec-04',
    nombre: 'Peck deck',
    grupo: 'pecho',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Peck deck.png'),
  },

  // Tríceps (4)
  {
    id: 'tri-01',
    nombre: 'Extensión con mancuerna',
    grupo: 'triceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Extensión con mancuerna.png'),
  },
  {
    id: 'tri-02',
    nombre: 'Extensión en polea',
    grupo: 'triceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Extensión en polea.png'),
  },
  {
    id: 'tri-03',
    nombre: 'Patada de tríceps',
    grupo: 'triceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Patada de tríceps.png'),
  },
  {
    id: 'tri-04',
    nombre: 'Fondos',
    grupo: 'triceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Fondos.png'),
  },

  // Espalda (4)
  {
    id: 'esp-01',
    nombre: 'Dominada colgado',
    grupo: 'espalda',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Dominada colgado.png'),
  },
  {
    id: 'esp-02',
    nombre: 'Jalón polea espalda',
    grupo: 'espalda',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Jalón polea espalda.png'),
  },
  {
    id: 'esp-03',
    nombre: 'Remo sentado',
    grupo: 'espalda',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Remo sentado.png'),
  },
  {
    id: 'esp-04',
    nombre: 'Jalón polea al pecho',
    grupo: 'espalda',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Jalón polea al pecho.png'),
  },

  // Hombro (5)
  {
    id: 'hom-01',
    nombre: 'Press con mancuerna',
    grupo: 'hombro',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Press con mancuerna.png'),
  },
  {
    id: 'hom-02',
    nombre: 'Elevación lateral',
    grupo: 'hombro',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Elevación lateral.png'),
  },
  {
    id: 'hom-03',
    nombre: 'Elevación frontal',
    grupo: 'hombro',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Elevación frontal.png'),
  },
  {
    id: 'hom-04',
    nombre: 'Remo al mentón cerrado',
    grupo: 'hombro',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Remo al mentón cerrado.png'),
  },
  {
    id: 'hom-05',
    nombre: 'Hombro posterior',
    grupo: 'hombro',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Hombro posterior.png'),
  },

  // Bíceps (4)
  {
    id: 'bic-01',
    nombre: 'Curl con barra',
    grupo: 'biceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Curl con barra.png'),
  },
  {
    id: 'bic-02',
    nombre: 'Curl alternado de pie',
    grupo: 'biceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Curl alternado de pie.png'),
  },
  {
    id: 'bic-03',
    nombre: 'Predicador con barra',
    grupo: 'biceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Predicador con barra.png'),
  },
  {
    id: 'bic-04',
    nombre: 'Curl martillo',
    grupo: 'biceps',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Curl martillo.png'),
  },

  // Abdomen (3)
  {
    id: 'abd-01',
    nombre: 'Elevación de piernas',
    grupo: 'abdomen',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Elevación de piernas.png'),
  },
  {
    id: 'abd-02',
    nombre: 'Oblicuos con dos mancuernas',
    grupo: 'abdomen',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Oblicuos con dos mancuernas.png'),
  },
  {
    id: 'abd-03',
    nombre: 'Máquina abdominal',
    grupo: 'abdomen',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Máquina abdominal.png'),
  },

  // Cadera (2)
  {
    id: 'cad-01',
    nombre: 'Abductor en máquina',
    grupo: 'cadera',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Abductor en máquina.png'),
  },
  {
    id: 'cad-02',
    nombre: 'Patada lateral en polea',
    grupo: 'cadera',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Patada lateral en polea.png'),
  },

  // Glúteo (1)
  {
    id: 'glu-01',
    nombre: 'Máquina de glúteo',
    grupo: 'gluteo',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Máquina de glúteo.png'),
  },

  // Lumbar (3)
  {
    id: 'lum-01',
    nombre: 'Peso muerto',
    grupo: 'lumbar',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Peso muerto.png'),
  },
  {
    id: 'lum-02',
    nombre: 'Hiperextensiones',
    grupo: 'lumbar',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Hiperextensiones.png'),
  },
  {
    id: 'lum-03',
    nombre: 'Máquina lumbar',
    grupo: 'lumbar',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Máquina lumbar.png'),
  },

  // Antebrazo (2)
  {
    id: 'ant-01',
    nombre: 'Curl de muñeca',
    grupo: 'antebrazo',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Curl de muñeca.png'),
  },
  {
    id: 'ant-02',
    nombre: 'Curl de muñeca invertido',
    grupo: 'antebrazo',
    series: 4,
    repeticiones: 12,
    imagen: require('../assets/images/ejercicios/Curl de muñeca invertido.png'),
  },
];

// Utilidades de búsqueda y validación (origen: GymTrack).
export function buscarEjercicioPorId(id: string): Ejercicio | undefined {
  return ejercicios.find((ejercicio) => ejercicio.id === id);
}

export function esGrupoMuscularValido(valor: string): valor is GrupoMuscular {
  return GRUPOS_ORDEN.some((grupo) => grupo === valor);
}
