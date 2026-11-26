import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { socioInicial } from '@/data/socio';
import { planSemanal } from '@/data/plan';
import * as repo from '@/db/repositorio';
import { programarRecordatorios, type ResultadoProgramacion } from '@/services/recordatorios';
import type { DiaSemana, Medida, NuevaSerie, Recordatorio, Serie, Socio } from '@/types/gym';
import type { Completados } from '@/utils/guardas';
import { fechaLocalISO } from '@/utils/progresion';

/**
 * Estado global de GymTrackPro.
 * La fuente de verdad es SQLite (`db/`); aquí se mantiene una copia en memoria
 * para pintar rápido. Cada acción actualiza la memoria y escribe en la base.
 */
export type { Completados };

export interface GymState {
  socio: Socio;
  setSocio: (s: Socio) => void;
  medidas: Medida[];
  agregarMedida: (m: Medida) => void;
  completados: Completados;
  alternarEjercicio: (dia: DiaSemana, id: string) => void;
  series: Serie[];
  registrarSerie: (s: Omit<NuevaSerie, 'fecha'> & { fecha?: string }) => Promise<void>;
  eliminarSerie: (id: number) => void;
  recordatorio: Recordatorio;
  actualizarRecordatorio: (r: Recordatorio) => Promise<ResultadoProgramacion>;
  cargando: boolean;
  reiniciarDatos: () => Promise<void>;
}

const GymContext = createContext<GymState | null>(null);

function registrarError(accion: string) {
  return (err: unknown) => console.error(`Error al ${accion}:`, err);
}

/** Día del plan que corresponde a una fecha AAAA-MM-DD (null si es domingo). */
function diaDeFecha(fecha: string): DiaSemana | null {
  const [a, m, d] = fecha.split('-').map(Number);
  const dias: (DiaSemana | null)[] = [null, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return dias[new Date(a, m - 1, d).getDay()];
}

export function GymProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [socio, setSocioState] = useState<Socio>(socioInicial);
  const [medidas, setMedidas] = useState<Medida[]>(socioInicial.medidas);
  const [completados, setCompletados] = useState<Completados>(repo.completadosVacios());
  const [series, setSeries] = useState<Serie[]>([]);
  const [recordatorio, setRecordatorio] = useState<Recordatorio>(repo.RECORDATORIO_POR_DEFECTO);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    repo
      .cargarEstado(db)
      .then((estado) => {
        if (cancelado) return;
        setSocioState(estado.socio);
        setMedidas(estado.medidas);
        setCompletados(estado.completados);
        setSeries(estado.series);
        setRecordatorio(estado.recordatorio);
      })
      .catch(registrarError('cargar la base de datos'))
      .finally(() => {
        if (!cancelado) setCargando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [db]);

  const setSocio = (nuevo: Socio) => {
    setSocioState(nuevo);
    repo.guardarSocio(db, nuevo).catch(registrarError('guardar el socio'));
  };

  const agregarMedida = (m: Medida) => {
    setMedidas((prev) =>
      [m, ...prev.filter((x) => x.mes !== m.mes)].sort((a, b) => b.mes.localeCompare(a.mes))
    );
    repo.insertarMedida(db, m).catch(registrarError('guardar la medida'));
  };

  const fijarCompletado = (dia: DiaSemana, id: string, marcado: boolean) => {
    setCompletados((prev) => {
      const sinId = prev[dia].filter((x) => x !== id);
      return { ...prev, [dia]: marcado ? [...sinId, id] : sinId };
    });
    repo.marcarCompletado(db, dia, id, marcado).catch(registrarError('guardar el progreso'));
  };

  const alternarEjercicio = (dia: DiaSemana, id: string) => {
    fijarCompletado(dia, id, !completados[dia].includes(id));
  };

  const registrarSerie: GymState['registrarSerie'] = async ({ fecha, ...resto }) => {
    const nueva: NuevaSerie = { ...resto, fecha: fecha ?? fechaLocalISO() };
    const guardada = await repo.insertarSerie(db, nueva);
    setSeries((prev) => [...prev, guardada]);
    // Si el ejercicio está en el plan de ese día, se marca como completado.
    const dia = diaDeFecha(nueva.fecha);
    const plan = dia ? planSemanal.find((p) => p.dia === dia) : undefined;
    if (dia && plan?.ejercicios.includes(nueva.ejercicioId) && !completados[dia].includes(nueva.ejercicioId)) {
      fijarCompletado(dia, nueva.ejercicioId, true);
    }
  };

  const eliminarSerie = (id: number) => {
    setSeries((prev) => prev.filter((s) => s.id !== id));
    repo.eliminarSerie(db, id).catch(registrarError('eliminar la serie'));
  };

  const actualizarRecordatorio = async (r: Recordatorio): Promise<ResultadoProgramacion> => {
    const resultado = await programarRecordatorios(planSemanal, r);
    // Si el sistema negó el permiso, se guarda como desactivado.
    const efectivo = resultado === 'sin-permiso' ? { ...r, activo: false } : r;
    setRecordatorio(efectivo);
    await repo.guardarRecordatorio(db, efectivo);
    return resultado;
  };

  const reiniciarDatos = async () => {
    try {
      const estado = await repo.reiniciarBaseDatos(db);
      setSocioState(estado.socio);
      setMedidas(estado.medidas);
      setCompletados(estado.completados);
      setSeries(estado.series);
      setRecordatorio(estado.recordatorio);
      await programarRecordatorios(planSemanal, estado.recordatorio);
    } catch (err) {
      registrarError('reiniciar los datos')(err);
    }
  };

  return (
    <GymContext.Provider
      value={{
        socio,
        setSocio,
        medidas,
        agregarMedida,
        completados,
        alternarEjercicio,
        series,
        registrarSerie,
        eliminarSerie,
        recordatorio,
        actualizarRecordatorio,
        cargando,
        reiniciarDatos,
      }}>
      {children}
    </GymContext.Provider>
  );
}

export function useGym(): GymState {
  const ctx = useContext(GymContext);
  if (!ctx) throw new Error('useGym debe usarse dentro de GymProvider');
  return ctx;
}
