/**
 * @jest-environment node
 */
import { migrar, MIGRACIONES } from '@/db/esquema';
import * as repo from '@/db/repositorio';
import { socioInicial } from '@/data/socio';
import { crearBdMemoria } from '@/test-utils/bdMemoria';

describe('base de datos (SQLite real con node:sqlite)', () => {
  let db: ReturnType<typeof crearBdMemoria>;

  beforeEach(async () => {
    db = crearBdMemoria();
    await migrar(db);
  });
  afterEach(() => db.cerrar());

  it('aplica todas las migraciones y es idempotente', async () => {
    expect(await migrar(db)).toBe(MIGRACIONES.length);
    const tablas = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    expect(tablas.map((t) => t.name)).toEqual(['ajustes', 'completados', 'medidas', 'series', 'socio']);
  });

  it('siembra la ficha inicial solo una vez', async () => {
    expect(await repo.sembrarSiVacia(db)).toBe(true);
    expect(await repo.sembrarSiVacia(db)).toBe(false);
    const estado = await repo.cargarEstado(db);
    expect(estado.socio.nombre).toBe(socioInicial.nombre);
    expect(estado.medidas.map((m) => m.mes)).toEqual(['2026-11', '2026-10']);
    expect(estado.recordatorio).toEqual(repo.RECORDATORIO_POR_DEFECTO);
  });

  it('migra los datos heredados de AsyncStorage', async () => {
    await repo.sembrarSiVacia(db, {
      socio: { ...socioInicial, nombre: 'Socio Migrado' },
      completados: { ...repo.completadosVacios(), lunes: ['pec-01', 'abd-01'] },
    });
    const estado = await repo.cargarEstado(db);
    expect(estado.socio.nombre).toBe('Socio Migrado');
    expect(estado.completados.lunes.sort()).toEqual(['abd-01', 'pec-01']);
  });

  it('registra, lista y elimina series', async () => {
    const s1 = await repo.insertarSerie(db, { fecha: '2026-11-24', ejercicioId: 'pec-01', repeticiones: 12, pesoKg: 40 });
    await repo.insertarSerie(db, { fecha: '2026-11-26', ejercicioId: 'pec-01', repeticiones: 10, pesoKg: 45 });
    expect(s1.id).toBeGreaterThan(0);
    let estado = await repo.cargarEstado(db);
    expect(estado.series).toHaveLength(2);
    expect(estado.series[0].fecha).toBe('2026-11-26');
    await repo.eliminarSerie(db, s1.id);
    estado = await repo.cargarEstado(db);
    expect(estado.series.map((s) => s.pesoKg)).toEqual([45]);
  });

  it('rechaza series inválidas con las restricciones CHECK', async () => {
    await expect(
      repo.insertarSerie(db, { fecha: '2026-11-26', ejercicioId: 'pec-01', repeticiones: 0, pesoKg: 40 })
    ).rejects.toThrow();
  });

  it('guarda socio, medidas, completados y recordatorio', async () => {
    await repo.sembrarSiVacia(db);
    await repo.guardarSocio(db, { ...socioInicial, edad: 43 });
    await repo.insertarMedida(db, { ...socioInicial.medidas[0], mes: '2026-12', pesoKg: 96 });
    await repo.marcarCompletado(db, 'martes', 'pie-01', true);
    await repo.marcarCompletado(db, 'martes', 'pie-01', true); // sin duplicar
    await repo.guardarRecordatorio(db, { activo: true, hora: 18, minuto: 30 });
    const estado = await repo.cargarEstado(db);
    expect(estado.socio.edad).toBe(43);
    expect(estado.medidas[0]).toMatchObject({ mes: '2026-12', pesoKg: 96 });
    expect(estado.medidas[0].perimetrosCm.pecho).toBe(108);
    expect(estado.completados.martes).toEqual(['pie-01']);
    expect(estado.recordatorio).toEqual({ activo: true, hora: 18, minuto: 30 });
  });

  it('reinicia todo a la ficha inicial', async () => {
    await repo.sembrarSiVacia(db);
    await repo.insertarSerie(db, { fecha: '2026-11-26', ejercicioId: 'pec-01', repeticiones: 12, pesoKg: 40 });
    const estado = await repo.reiniciarBaseDatos(db);
    expect(estado.series).toHaveLength(0);
    expect(estado.medidas).toHaveLength(2);
  });
});
