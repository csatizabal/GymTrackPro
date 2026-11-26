import { socioInicial } from '@/data/socio';
import type { DiaSemana, Medida, NuevaSerie, PerimetroClave, Recordatorio, Serie, Socio } from '@/types/gym';
import {
  esCompletadosValido,
  esObjeto,
  esRecordatorioValido,
  esSocioValido,
  parsearJson,
  type Completados,
} from '@/utils/guardas';
import { esDiaSemanaValido } from '@/data/plan';
import type { BaseDatos } from '@/db/esquema';

/** Todo lo que la app necesita en memoria al arrancar. */
export interface EstadoGuardado {
  socio: Socio;
  medidas: Medida[];
  completados: Completados;
  series: Serie[];
  recordatorio: Recordatorio;
}

/** Datos rescatados de la versión anterior (AsyncStorage). */
export interface DatosLegados {
  socio?: Socio;
  medidas?: Medida[];
  completados?: Completados;
}

export const RECORDATORIO_POR_DEFECTO: Recordatorio = { activo: false, hora: 6, minuto: 0 };

export function completadosVacios(): Completados {
  return { lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [] };
}

interface FilaMedida {
  mes: string;
  estatura_m: number;
  peso_kg: number;
  perimetros: string;
}

interface FilaSerie {
  id: number;
  fecha: string;
  ejercicio_id: string;
  repeticiones: number;
  peso_kg: number;
}

/** Lee el JSON de perímetros validando cada clave (0 si falta o no es número). */
function leerPerimetros(texto: string): Record<PerimetroClave, number> {
  const crudo = parsearJson(texto);
  const obj: Record<string, unknown> = esObjeto(crudo) ? crudo : {};
  const num = (clave: PerimetroClave): number => {
    const v = obj[clave];
    return typeof v === 'number' ? v : 0;
  };
  return {
    hombro: num('hombro'),
    brazo: num('brazo'),
    antebrazo: num('antebrazo'),
    pecho: num('pecho'),
    abdomen: num('abdomen'),
    cadera: num('cadera'),
    pierna: num('pierna'),
    pantorrilla: num('pantorrilla'),
  };
}

// ---------- Socio ----------
export async function guardarSocio(db: BaseDatos, socio: Socio): Promise<void> {
  await db.runAsync(
    'INSERT INTO socio (id, datos) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET datos = excluded.datos',
    JSON.stringify(socio)
  );
}

// ---------- Medidas ----------
export async function insertarMedida(db: BaseDatos, m: Medida): Promise<void> {
  await db.runAsync(
    'INSERT OR REPLACE INTO medidas (mes, estatura_m, peso_kg, perimetros) VALUES (?, ?, ?, ?)',
    m.mes,
    m.estaturaM,
    m.pesoKg,
    JSON.stringify(m.perimetrosCm)
  );
}

// ---------- Sesión del día (checklist) ----------
export async function marcarCompletado(
  db: BaseDatos,
  dia: DiaSemana,
  ejercicioId: string,
  marcado: boolean
): Promise<void> {
  if (marcado) {
    await db.runAsync('INSERT OR IGNORE INTO completados (dia, ejercicio_id) VALUES (?, ?)', dia, ejercicioId);
  } else {
    await db.runAsync('DELETE FROM completados WHERE dia = ? AND ejercicio_id = ?', dia, ejercicioId);
  }
}

// ---------- Series ----------
export async function insertarSerie(db: BaseDatos, s: NuevaSerie): Promise<Serie> {
  const resultado = await db.runAsync(
    'INSERT INTO series (fecha, ejercicio_id, repeticiones, peso_kg, creado_en) VALUES (?, ?, ?, ?, ?)',
    s.fecha,
    s.ejercicioId,
    s.repeticiones,
    s.pesoKg,
    new Date().toISOString()
  );
  return { ...s, id: resultado.lastInsertRowId };
}

export async function eliminarSerie(db: BaseDatos, id: number): Promise<void> {
  await db.runAsync('DELETE FROM series WHERE id = ?', id);
}

// ---------- Ajustes ----------
export async function guardarRecordatorio(db: BaseDatos, r: Recordatorio): Promise<void> {
  await db.runAsync(
    "INSERT INTO ajustes (clave, valor) VALUES ('recordatorio', ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor",
    JSON.stringify(r)
  );
}

// ---------- Carga ----------
export async function cargarEstado(db: BaseDatos): Promise<EstadoGuardado> {
  const filaSocio = await db.getFirstAsync<{ datos: string }>('SELECT datos FROM socio WHERE id = 1');
  const socioLeido = parsearJson(filaSocio?.datos ?? null);
  const socio = esSocioValido(socioLeido) ? socioLeido : socioInicial;

  const filasMedidas = await db.getAllAsync<FilaMedida>(
    'SELECT mes, estatura_m, peso_kg, perimetros FROM medidas ORDER BY mes DESC'
  );
  const medidas: Medida[] = filasMedidas.map((f) => ({
    mes: f.mes,
    estaturaM: f.estatura_m,
    pesoKg: f.peso_kg,
    perimetrosCm: leerPerimetros(f.perimetros),
  }));

  const completados = completadosVacios();
  const filasCompletados = await db.getAllAsync<{ dia: string; ejercicio_id: string }>(
    'SELECT dia, ejercicio_id FROM completados'
  );
  for (const f of filasCompletados) {
    if (esDiaSemanaValido(f.dia)) completados[f.dia].push(f.ejercicio_id);
  }

  const filasSeries = await db.getAllAsync<FilaSerie>(
    'SELECT id, fecha, ejercicio_id, repeticiones, peso_kg FROM series ORDER BY fecha DESC, id ASC'
  );
  const series: Serie[] = filasSeries.map((f) => ({
    id: f.id,
    fecha: f.fecha,
    ejercicioId: f.ejercicio_id,
    repeticiones: f.repeticiones,
    pesoKg: f.peso_kg,
  }));

  const filaRecordatorio = await db.getFirstAsync<{ valor: string }>(
    "SELECT valor FROM ajustes WHERE clave = 'recordatorio'"
  );
  const recordatorioLeido = parsearJson(filaRecordatorio?.valor ?? null);
  const recordatorio = esRecordatorioValido(recordatorioLeido) ? recordatorioLeido : RECORDATORIO_POR_DEFECTO;

  return { socio, medidas, completados, series, recordatorio };
}

/**
 * Siembra la base la primera vez: usa los datos heredados de AsyncStorage si
 * existen y, si no, los de la ficha inicial. No hace nada si ya hay socio.
 * Devuelve true si sembró.
 */
export async function sembrarSiVacia(db: BaseDatos, legado: DatosLegados = {}): Promise<boolean> {
  const existe = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM socio');
  if ((existe?.n ?? 0) > 0) return false;

  const socio = legado.socio ?? socioInicial;
  const medidas = legado.medidas ?? socio.medidas;
  const completados = legado.completados && esCompletadosValido(legado.completados) ? legado.completados : undefined;

  await db.execAsync('BEGIN');
  try {
    await guardarSocio(db, socio);
    for (const m of medidas) await insertarMedida(db, m);
    if (completados) {
      for (const [dia, ids] of Object.entries(completados)) {
        if (!esDiaSemanaValido(dia)) continue;
        for (const id of ids) await marcarCompletado(db, dia, id, true);
      }
    }
    await db.execAsync('COMMIT');
  } catch (error) {
    await db.execAsync('ROLLBACK');
    throw error;
  }
  return true;
}

/** Borra todo y vuelve a la ficha inicial ("Restaurar datos"). */
export async function reiniciarBaseDatos(db: BaseDatos): Promise<EstadoGuardado> {
  await db.execAsync(
    'BEGIN; DELETE FROM socio; DELETE FROM medidas; DELETE FROM completados; DELETE FROM series; DELETE FROM ajustes; COMMIT;'
  );
  await sembrarSiVacia(db);
  return cargarEstado(db);
}
