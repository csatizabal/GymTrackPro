import { DIAS_ORDEN } from '@/constants/colores';
import type { DiaSemana, Medida, Recordatorio, Socio } from '@/types/gym';

/**
 * Guardas de tipo para datos que llegan como `unknown` (JSON.parse, SQLite,
 * AsyncStorage heredado). Origen: GymTrack (`GymContext`), extraídas para
 * poder probarlas y reutilizarlas.
 */
export type Completados = Record<DiaSemana, string[]>;

export function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

export function esSocioValido(valor: unknown): valor is Socio {
  if (!esObjeto(valor)) return false;
  return (
    typeof valor.nombre === 'string' &&
    typeof valor.edad === 'number' &&
    typeof valor.fechaAsignacion === 'string' &&
    typeof valor.objetivo === 'string' &&
    Array.isArray(valor.observaciones) &&
    Array.isArray(valor.lesiones) &&
    Array.isArray(valor.medidas)
  );
}

export function esMedidaValida(valor: unknown): valor is Medida {
  return (
    esObjeto(valor) &&
    typeof valor.mes === 'string' &&
    typeof valor.estaturaM === 'number' &&
    typeof valor.pesoKg === 'number' &&
    esObjeto(valor.perimetrosCm)
  );
}

export function esListaMedidasValida(valor: unknown): valor is Medida[] {
  return Array.isArray(valor) && valor.every(esMedidaValida);
}

export function esCompletadosValido(valor: unknown): valor is Completados {
  if (!esObjeto(valor)) return false;
  return DIAS_ORDEN.every((dia) => Array.isArray(valor[dia]));
}

export function esRecordatorioValido(valor: unknown): valor is Recordatorio {
  return (
    esObjeto(valor) &&
    typeof valor.activo === 'boolean' &&
    typeof valor.hora === 'number' &&
    typeof valor.minuto === 'number' &&
    valor.hora >= 0 &&
    valor.hora <= 23 &&
    valor.minuto >= 0 &&
    valor.minuto <= 59
  );
}

/** JSON.parse que nunca lanza: devuelve `undefined` si el texto está corrupto. */
export function parsearJson(texto: string | null): unknown {
  if (texto === null) return undefined;
  try {
    return JSON.parse(texto) as unknown;
  } catch {
    return undefined;
  }
}
