import { calcularImc, clasificarImc } from '@/utils/imc';
import { normalizar } from '@/utils/texto';
import { esCompletadosValido, esRecordatorioValido, esSocioValido, parsearJson } from '@/utils/guardas';
import { esDiaSemanaValido, obtenerPlanPorDia } from '@/data/plan';
import { buscarEjercicioPorId, ejercicios, esGrupoMuscularValido } from '@/data/ejercicios';
import { socioInicial } from '@/data/socio';

describe('IMC (OMS)', () => {
  it('calcula con un decimal', () => {
    expect(calcularImc(98, 1.75)).toBe(32);
    expect(calcularImc(70, 0)).toBe(0);
  });
  it.each([
    [18.4, 'Bajo peso'],
    [18.5, 'Peso normal'],
    [25, 'Sobrepeso'],
    [30, 'Obesidad grado I'],
    [35, 'Obesidad grado II'],
    [40, 'Obesidad grado III'],
  ])('clasifica %p como %s', (imc, esperado) => {
    expect(clasificarImc(imc)).toBe(esperado);
  });
});

describe('búsqueda sin tildes', () => {
  it('normalizar quita tildes y mayúsculas', () => {
    expect(normalizar('  Extensión de CUÁDRICEPS ')).toBe('extension de cuadriceps');
  });
  it('encuentra "extension" en el catálogo', () => {
    const hits = ejercicios.filter((e) => normalizar(e.nombre).includes('extension'));
    expect(hits.length).toBeGreaterThanOrEqual(3);
  });
});

describe('datos y validación de rutas', () => {
  it('el catálogo tiene 37 ejercicios con id único', () => {
    expect(ejercicios).toHaveLength(37);
    expect(new Set(ejercicios.map((e) => e.id)).size).toBe(37);
  });
  it('todo ejercicio del plan existe en el catálogo', () => {
    for (const dia of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const) {
      for (const id of obtenerPlanPorDia(dia)?.ejercicios ?? []) {
        expect(buscarEjercicioPorId(id)).toBeDefined();
      }
    }
  });
  it('valida parámetros de ruta', () => {
    expect(esDiaSemanaValido('lunes')).toBe(true);
    expect(esDiaSemanaValido('domingo')).toBe(false);
    expect(esGrupoMuscularValido('gluteo')).toBe(true);
    expect(esGrupoMuscularValido('cuello')).toBe(false);
  });
});

describe('guardas de tipo', () => {
  it('aceptan datos válidos y rechazan basura', () => {
    expect(esSocioValido(socioInicial)).toBe(true);
    expect(esSocioValido({ nombre: 'x' })).toBe(false);
    expect(esCompletadosValido({ lunes: [] })).toBe(false);
    expect(esRecordatorioValido({ activo: true, hora: 24, minuto: 0 })).toBe(false);
    expect(parsearJson('{malo')).toBeUndefined();
    expect(parsearJson(null)).toBeUndefined();
  });
});
