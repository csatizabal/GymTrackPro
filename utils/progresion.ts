import type { Serie } from '@/types/gym';

/** Fecha local en formato AAAA-MM-DD (no UTC: evita que la sesión de las 8 p. m. caiga "mañana"). */
export function fechaLocalISO(fecha: Date = new Date()): string {
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

/**
 * 1RM estimado con la fórmula de Epley: peso × (1 + reps / 30).
 * Con 1 repetición el 1RM es el propio peso. Se redondea a 0,5 kg.
 */
export function estimar1RM(pesoKg: number, repeticiones: number): number {
  if (pesoKg <= 0 || repeticiones <= 0) return 0;
  const bruto = repeticiones === 1 ? pesoKg : pesoKg * (1 + repeticiones / 30);
  return Math.round(bruto * 2) / 2;
}

/** Volumen de entrenamiento = Σ repeticiones × peso (kg). */
export function volumenTotal(series: Pick<Serie, 'repeticiones' | 'pesoKg'>[]): number {
  return series.reduce((total, s) => total + s.repeticiones * s.pesoKg, 0);
}

export interface ResumenSesion {
  fecha: string;
  series: Serie[];
  ejercicios: string[]; // ids sin repetir, en orden de registro
  volumen: number;
}

/** Agrupa las series por fecha (una sesión por día), de la más reciente a la más antigua. */
export function resumirSesiones(series: Serie[]): ResumenSesion[] {
  const porFecha = new Map<string, Serie[]>();
  for (const s of series) {
    const lista = porFecha.get(s.fecha) ?? [];
    lista.push(s);
    porFecha.set(s.fecha, lista);
  }
  return [...porFecha.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([fecha, lista]) => {
      const ordenadas = [...lista].sort((a, b) => a.id - b.id);
      return {
        fecha,
        series: ordenadas,
        ejercicios: [...new Set(ordenadas.map((s) => s.ejercicioId))],
        volumen: volumenTotal(ordenadas),
      };
    });
}

export interface PuntoProgresion {
  fecha: string;
  mejorSerie: Serie;
  rm1: number;
  volumen: number;
  numSeries: number;
}

/** Progresión de un ejercicio: un punto por sesión, de la más antigua a la más reciente. */
export function progresionEjercicio(series: Serie[], ejercicioId: string): PuntoProgresion[] {
  const delEjercicio = series.filter((s) => s.ejercicioId === ejercicioId);
  return resumirSesiones(delEjercicio)
    .map((sesion) => {
      const mejorSerie = sesion.series.reduce((mejor, s) =>
        estimar1RM(s.pesoKg, s.repeticiones) > estimar1RM(mejor.pesoKg, mejor.repeticiones) ? s : mejor
      );
      return {
        fecha: sesion.fecha,
        mejorSerie,
        rm1: estimar1RM(mejorSerie.pesoKg, mejorSerie.repeticiones),
        volumen: sesion.volumen,
        numSeries: sesion.series.length,
      };
    })
    .reverse();
}

/** Diferencia de 1RM entre la última sesión y la anterior (null si hay menos de dos). */
export function tendencia1RM(puntos: PuntoProgresion[]): number | null {
  if (puntos.length < 2) return null;
  const ultimo = puntos[puntos.length - 1];
  const previo = puntos[puntos.length - 2];
  return Math.round((ultimo.rm1 - previo.rm1) * 10) / 10;
}

export interface ResultadoValidacionSerie {
  valores?: { repeticiones: number; pesoKg: number };
  errores: { repeticiones?: string; pesoKg?: string };
}

/** Valida el formulario de una serie. Acepta coma decimal en el peso; 0 kg = peso corporal. */
export function validarSerie(repsTexto: string, pesoTexto: string): ResultadoValidacionSerie {
  const errores: ResultadoValidacionSerie['errores'] = {};
  const repsLimpio = repsTexto.trim();
  const pesoLimpio = pesoTexto.trim().replace(',', '.');

  const repeticiones = Number(repsLimpio);
  if (!/^\d+$/.test(repsLimpio) || repeticiones < 1 || repeticiones > 100) {
    errores.repeticiones = 'Entre 1 y 100 repeticiones.';
  }

  const pesoKg = Number(pesoLimpio);
  if (pesoLimpio.length === 0 || Number.isNaN(pesoKg) || pesoKg < 0 || pesoKg > 500) {
    errores.pesoKg = 'Peso entre 0 y 500 kg.';
  }

  if (errores.repeticiones || errores.pesoKg) return { errores };
  return { valores: { repeticiones, pesoKg: Math.round(pesoKg * 10) / 10 }, errores };
}

/** Texto legible de una serie: "12 × 40 kg" o "12 reps (peso corporal)". */
export function formatearSerie(s: Pick<Serie, 'repeticiones' | 'pesoKg'>): string {
  return s.pesoKg === 0 ? `${s.repeticiones} reps (peso corporal)` : `${s.repeticiones} × ${s.pesoKg} kg`;
}
