import type { Serie } from '@/types/gym';
import {
  estimar1RM,
  fechaLocalISO,
  formatearSerie,
  progresionEjercicio,
  resumirSesiones,
  tendencia1RM,
  validarSerie,
  volumenTotal,
} from '@/utils/progresion';

const serie = (id: number, fecha: string, ejercicioId: string, repeticiones: number, pesoKg: number): Serie => ({
  id,
  fecha,
  ejercicioId,
  repeticiones,
  pesoKg,
});

describe('estimar1RM (Epley)', () => {
  it('calcula peso × (1 + reps/30) redondeado a 0,5', () => {
    expect(estimar1RM(40, 12)).toBe(56); // 40 × 1,4
    expect(estimar1RM(50, 10)).toBe(66.5); // 66,67 → 66,5
  });
  it('con 1 repetición devuelve el peso y con datos inválidos 0', () => {
    expect(estimar1RM(80, 1)).toBe(80);
    expect(estimar1RM(0, 12)).toBe(0);
    expect(estimar1RM(40, 0)).toBe(0);
  });
});

describe('sesiones y progresión', () => {
  const series = [
    serie(1, '2026-11-23', 'pec-01', 12, 40),
    serie(2, '2026-11-23', 'pec-01', 10, 45),
    serie(3, '2026-11-23', 'abd-01', 15, 0),
    serie(4, '2026-11-25', 'pec-01', 12, 45),
  ];

  it('volumenTotal suma reps × peso', () => {
    expect(volumenTotal(series)).toBe(480 + 450 + 0 + 540);
  });

  it('resumirSesiones agrupa por fecha, más reciente primero', () => {
    const sesiones = resumirSesiones(series);
    expect(sesiones.map((s) => s.fecha)).toEqual(['2026-11-25', '2026-11-23']);
    expect(sesiones[1].ejercicios).toEqual(['pec-01', 'abd-01']);
    expect(sesiones[1].volumen).toBe(930);
  });

  it('progresionEjercicio elige la mejor serie por 1RM y ordena cronológicamente', () => {
    const puntos = progresionEjercicio(series, 'pec-01');
    expect(puntos.map((p) => p.fecha)).toEqual(['2026-11-23', '2026-11-25']);
    expect(puntos[0].mejorSerie.id).toBe(2); // 45 × 10 (60) supera a 40 × 12 (56)
    expect(puntos[1].rm1).toBe(63);
    expect(tendencia1RM(puntos)).toBe(3);
  });

  it('tendencia1RM es null con menos de dos sesiones', () => {
    expect(tendencia1RM(progresionEjercicio(series, 'abd-01'))).toBeNull();
  });
});

describe('validarSerie', () => {
  it('acepta datos válidos y coma decimal', () => {
    expect(validarSerie('12', '42,5').valores).toEqual({ repeticiones: 12, pesoKg: 42.5 });
    expect(validarSerie(' 8 ', '0').valores).toEqual({ repeticiones: 8, pesoKg: 0 });
  });
  it('rechaza repeticiones y pesos fuera de rango', () => {
    const r = validarSerie('0', '-5');
    expect(r.valores).toBeUndefined();
    expect(r.errores.repeticiones).toBeDefined();
    expect(r.errores.pesoKg).toBeDefined();
    expect(validarSerie('12.5', '40').errores.repeticiones).toBeDefined();
    expect(validarSerie('12', '').errores.pesoKg).toBeDefined();
  });
});

describe('formato', () => {
  it('fechaLocalISO usa la fecha local', () => {
    expect(fechaLocalISO(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
  it('formatearSerie distingue peso corporal', () => {
    expect(formatearSerie({ repeticiones: 12, pesoKg: 40 })).toBe('12 × 40 kg');
    expect(formatearSerie({ repeticiones: 15, pesoKg: 0 })).toBe('15 reps (peso corporal)');
  });
});
