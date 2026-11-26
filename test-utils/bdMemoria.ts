/// <reference types="node" />
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import type { BaseDatos, ValorSql } from '@/db/esquema';

/**
 * Implementa `BaseDatos` con el SQLite que trae Node (`node:sqlite`, Node ≥ 22.13)
 * para probar migraciones y repositorio con SQL real, sin teléfono.
 */
export function crearBdMemoria(): BaseDatos & { cerrar: () => void } {
  const db = new DatabaseSync(':memory:');
  const p = (params: ValorSql[]): SQLInputValue[] => params;
  return {
    async execAsync(sql) {
      db.exec(sql);
    },
    async runAsync(sql, ...params) {
      const r = db.prepare(sql).run(...p(params));
      return { lastInsertRowId: Number(r.lastInsertRowid), changes: Number(r.changes) };
    },
    async getAllAsync<T>(sql: string, ...params: ValorSql[]) {
      return db.prepare(sql).all(...p(params)) as T[];
    },
    async getFirstAsync<T>(sql: string, ...params: ValorSql[]) {
      const fila = db.prepare(sql).get(...p(params));
      return (fila ?? null) as T | null;
    },
    cerrar: () => db.close(),
  };
}
