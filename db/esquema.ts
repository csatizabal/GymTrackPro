/**
 * Contrato mínimo de base de datos que usa la app. `SQLiteDatabase` de
 * expo-sqlite lo cumple; en las pruebas se implementa con `node:sqlite`.
 */
export type ValorSql = string | number | null;

export interface BaseDatos {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: ValorSql[]): Promise<{ lastInsertRowId: number; changes: number }>;
  getAllAsync<T>(sql: string, ...params: ValorSql[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, ...params: ValorSql[]): Promise<T | null>;
}

export const NOMBRE_BD = 'gymtrackpro.db';

/**
 * Migraciones en orden. La posición + 1 es la versión que deja la base
 * (`PRAGMA user_version`). Nunca edites una migración publicada: agrega otra.
 */
export const MIGRACIONES: string[] = [
  // v1: modelo inicial del MVP
  `
  CREATE TABLE IF NOT EXISTS socio (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    datos TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS medidas (
    mes TEXT PRIMARY KEY NOT NULL,
    estatura_m REAL NOT NULL,
    peso_kg REAL NOT NULL,
    perimetros TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS completados (
    dia TEXT NOT NULL,
    ejercicio_id TEXT NOT NULL,
    PRIMARY KEY (dia, ejercicio_id)
  );
  CREATE TABLE IF NOT EXISTS series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    ejercicio_id TEXT NOT NULL,
    repeticiones INTEGER NOT NULL CHECK (repeticiones > 0),
    peso_kg REAL NOT NULL CHECK (peso_kg >= 0),
    creado_en TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_series_ejercicio ON series (ejercicio_id, fecha);
  CREATE INDEX IF NOT EXISTS idx_series_fecha ON series (fecha);
  CREATE TABLE IF NOT EXISTS ajustes (
    clave TEXT PRIMARY KEY NOT NULL,
    valor TEXT NOT NULL
  );
  `,
];

/** Aplica las migraciones pendientes y devuelve la versión final. */
export async function migrar(db: BaseDatos): Promise<number> {
  const fila = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = fila?.user_version ?? 0;
  while (version < MIGRACIONES.length) {
    await db.execAsync(`BEGIN; ${MIGRACIONES[version]} PRAGMA user_version = ${version + 1}; COMMIT;`);
    version += 1;
  }
  return version;
}
