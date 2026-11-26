import { planSemanal } from '@/data/plan';
import { construirAvisos, formatearHora, parsearHora } from '@/services/recordatorios';

describe('recordatorios', () => {
  it('genera un aviso semanal por día de entreno (lunes=2 … sábado=7)', () => {
    const avisos = construirAvisos(planSemanal, { activo: true, hora: 6, minuto: 30 });
    expect(avisos.map((a) => a.weekday)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(avisos[1].title).toBe('Hoy toca Martes: Pierna + cardio');
    expect(avisos[1].body).toContain('20 min de cardio');
    expect(avisos.every((a) => a.hour === 6 && a.minute === 30)).toBe(true);
  });
  it('no genera avisos si está desactivado', () => {
    expect(construirAvisos(planSemanal, { activo: false, hora: 6, minuto: 0 })).toEqual([]);
  });
  it('parsea y formatea HH:MM', () => {
    expect(parsearHora('6:05')).toEqual({ hora: 6, minuto: 5 });
    expect(parsearHora('24:00')).toBeNull();
    expect(parsearHora('7')).toBeNull();
    expect(formatearHora({ hora: 6, minuto: 5 })).toBe('06:05');
  });
});
