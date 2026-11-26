import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SQLiteDatabase } from 'expo-sqlite';
import { migrar } from '@/db/esquema';
import { sembrarSiVacia, type DatosLegados } from '@/db/repositorio';
import {
  esCompletadosValido,
  esListaMedidasValida,
  esSocioValido,
  parsearJson,
} from '@/utils/guardas';

/** Claves que usaba GymTrack2 con AsyncStorage (antes del MVP). */
export const CLAVES_LEGADO = {
  SOCIO: '@gymtrack_socio_v1',
  MEDIDAS: '@gymtrack_medidas_v1',
  COMPLETADOS: '@gymtrack_completados_v1',
} as const;

async function leerLegado(): Promise<DatosLegados> {
  try {
    const [rawSocio, rawMedidas, rawCompletados] = await Promise.all([
      AsyncStorage.getItem(CLAVES_LEGADO.SOCIO),
      AsyncStorage.getItem(CLAVES_LEGADO.MEDIDAS),
      AsyncStorage.getItem(CLAVES_LEGADO.COMPLETADOS),
    ]);
    const socio = parsearJson(rawSocio);
    const medidas = parsearJson(rawMedidas);
    const completados = parsearJson(rawCompletados);
    return {
      socio: esSocioValido(socio) ? socio : undefined,
      medidas: esListaMedidasValida(medidas) ? medidas : undefined,
      completados: esCompletadosValido(completados) ? completados : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * `onInit` del `SQLiteProvider`: aplica migraciones y, la primera vez,
 * pasa los datos de AsyncStorage a SQLite y borra las claves antiguas.
 */
export async function inicializarBaseDatos(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await migrar(db);
  const legado = await leerLegado();
  const sembro = await sembrarSiVacia(db, legado);
  if (sembro && (legado.socio || legado.medidas || legado.completados)) {
    await AsyncStorage.multiRemove(Object.values(CLAVES_LEGADO)).catch(() => {});
  }
}
