---
name: base-datos-sqlite
description: Cómo leer, escribir y cambiar el esquema de la base SQLite de GymTrackPro (expo-sqlite, migraciones, repositorio y pruebas con node:sqlite). Úsala para cualquier cambio que guarde o consulte datos.
---

# Base de datos SQLite

## Piezas
- `db/esquema.ts`: interfaz `BaseDatos` (subconjunto de `SQLiteDatabase`), `NOMBRE_BD` y `MIGRACIONES`.
- `db/repositorio.ts`: **todo** el SQL. Cada función recibe `db: BaseDatos` como primer parámetro.
- `db/inicializar.ts`: `onInit` del `SQLiteProvider`; aplica migraciones y migra AsyncStorage heredado.
- `context/GymContext.tsx`: obtiene `db` con `useSQLiteContext()` y llama al repositorio.

## Agregar un dato nuevo (ejemplo: notas por sesión)
1. **Migración**: agrega un string al final de `MIGRACIONES` (no edites las existentes):
   ```ts
   // v2: notas por sesión
   `CREATE TABLE IF NOT EXISTS notas (fecha TEXT PRIMARY KEY NOT NULL, texto TEXT NOT NULL);`,
   ```
   `migrar()` la aplica una vez y sube `PRAGMA user_version`.
2. **Tipo** en `types/gym.ts` y, si llega como JSON, una guarda en `utils/guardas.ts`.
3. **Repositorio**: funciones `guardarNota(db, ...)` y lectura en `cargarEstado`. Parámetros con `?`:
   `db.runAsync('INSERT ... VALUES (?, ?)', fecha, texto)`. Nunca interpolar valores en el SQL.
4. **Contexto**: estado + acción que actualiza memoria y llama al repositorio con `.catch(registrarError(...))`.
5. **Prueba** en `__tests__/repositorio.test.ts` (SQLite real en memoria):
   ```ts
   const db = crearBdMemoria(); await migrar(db);
   await repo.guardarNota(db, '2026-11-26', 'Buena sesión');
   expect((await repo.cargarEstado(db)).notas).toHaveLength(1);
   ```
   El archivo usa `@jest-environment node` y `test-utils/bdMemoria.ts` (requiere Node ≥ 22.13).

## Reglas
- Restricciones en la tabla (`CHECK`, `PRIMARY KEY`) además de la validación del formulario.
- Operaciones de varias filas dentro de `BEGIN` / `COMMIT` con `ROLLBACK` en el `catch` (ver `sembrarSiVacia`).
- Fechas como texto `AAAA-MM-DD` local (`fechaLocalISO()`), no `toISOString()` (es UTC).
- En web, expo-sqlite usa WebAssembly: no quites `wasm` ni los encabezados de `metro.config.js`.
